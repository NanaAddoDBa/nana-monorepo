import { test, expect } from "@playwright/test";

test("search, filters, vehicle details and back navigation preserve the trip", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Explore vehicles/ }).first().click();
  await expect(page).toHaveURL(/#\/fleet\?/);
  const url = new URL(page.url());
  const originalTrip = new URLSearchParams(url.hash.split("?")[1] || "");
  expect(originalTrip.get("pickupLocation")).toBe("munich");
  expect(originalTrip.get("pickupTime")).toBe("10:00");

  await page.getByLabel("Vehicle type").selectOption("SUV");
  await page.getByRole("link", { name: /View car/ }).first().click();
  await expect(page).toHaveURL(/#\/fleet\//);
  await expect(page.getByText("Base estimate", { exact: false }).first()).toBeVisible();

  await page.getByRole("link", { name: "Back to fleet" }).click();
  await expect(page.getByLabel("Vehicle type")).toHaveValue("SUV");
  const restored = new URLSearchParams(page.url().split("?")[1] || "");
  expect(restored.get("pickupDate")).toBe(originalTrip.get("pickupDate"));
});

test("guest review, API submission and confirmation show the real server receipt", async ({ page }) => {
  let submissionCount = 0;
  await page.route("https://api.aventra.test/v1/enquiries", async (route) => {
    const request = route.request();
    if (request.method() === "OPTIONS") {
      await route.fulfill({
        status: 204,
        headers: {
          "access-control-allow-origin": "*",
          "access-control-allow-headers": "content-type,idempotency-key",
          "access-control-allow-methods": "POST, OPTIONS",
        },
      });
      return;
    }
    submissionCount += 1;
    const body = JSON.parse(request.postData() || "{}");
    expect(body.customer.email).toBe("guest@example.com");
    expect(request.headers()["idempotency-key"]).toMatch(/^[0-9a-f-]{36}$/i);
    await route.fulfill({
      status: 201,
      contentType: "application/json",
      headers: { "access-control-allow-origin": "*" },
      body: JSON.stringify({
        receipt: {
          id: "e2e-receipt",
          reference: "AV-2030-E2E123",
          status: "submitted",
          createdAt: new Date().toISOString(),
          quote: {
            vehicleId: body.vehicleId, billableDays: 3,
            dailyRateCents: 10500, baseAmountCents: 31500,
            currency: "EUR", requiresManualReview: false, finalPriceConfirmed: false,
          },
          notificationStatus: "queued",
          nextSteps: "The operator will review the enquiry.",
        },
      }),
    });
  });

  await page.goto("/#/fleet");
  await page.getByRole("link", { name: /View car/ }).filter({ visible: true }).first().click();
  await page.getByRole("link", { name: /Request this car/ }).click();
  await expect(page).toHaveURL(/#\/book\//);
  await page.getByLabel("Full name *").fill("Integration Guest");
  await page.getByLabel("Email address *").fill("guest@example.com");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Review enquiry" }).click();
  await expect(page).toHaveURL(/#\/review\//);
  await expect(page.getByText("guest@example.com")).toBeVisible();
  await page.getByRole("button", { name: "Submit rental enquiry" }).click();
  await expect(page).toHaveURL(/#\/confirmation/);
  await expect(page.getByText("AV-2030-E2E123")).toBeVisible();
  await expect(page.getByText(/not a reservation confirmation/i)).toBeVisible();
  expect(submissionCount).toBe(1);
});

test("invalid trip prevents search and provides a validation message", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Return date").fill("2020-01-01");
  await expect(page.getByRole("button", { name: /Explore vehicles/ })).toBeDisabled();
  await expect(page.getByRole("alert")).toContainText(/return must be after pickup|pickup must be in the future/i);
});
