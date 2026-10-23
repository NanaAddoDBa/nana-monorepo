import { test, expect } from "@playwright/test";

test.skip(process.env.VITE_ENABLE_PAID_BOOKINGS === "true", "Preview/enquiry-mode tests.");

test("search, vehicle details and back navigation preserve dates and filters", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Explore vehicles/ }).first().click();
  await expect(page).toHaveURL(/#\/fleet\?/);
  const original = new URLSearchParams(page.url().split("?")[1] || "");
  expect(original.get("pickupLocation")).toBe("munich");

  await page.getByRole("button", { name: "Filters" }).click().catch(() => {});
  await page.getByLabel("Vehicle type").selectOption("SUV");
  await page.getByRole("link", { name: /Details/ }).first().click();
  await expect(page).toHaveURL(/#\/fleet\//);
  await expect(page.getByText("Estimated base", { exact: false }).first()).toBeVisible();
  await page.getByRole("link", { name: "Back to fleet" }).click();
  await expect(page.getByLabel("Vehicle type")).toHaveValue("SUV");
  const restored = new URLSearchParams(page.url().split("?")[1] || "");
  expect(restored.get("pickupDate")).toBe(original.get("pickupDate"));
});

test("guest completes one-page enquiry without a forced account or review step", async ({ page }) => {
  let submissions = 0;
  await page.route("https://api.aventra.test/v1/enquiries", async route => {
    if (route.request().method() === "OPTIONS") {
      await route.fulfill({ status: 204, headers: {
        "access-control-allow-origin":"*",
        "access-control-allow-headers":"content-type,idempotency-key",
        "access-control-allow-methods":"POST, OPTIONS",
      } }); return;
    }
    submissions += 1;
    const body = JSON.parse(route.request().postData() || "{}");
    expect(body.customer.email).toBe("guest@example.com");
    expect(route.request().headers()["idempotency-key"]).toMatch(/^[0-9a-f-]{36}$/i);
    await route.fulfill({ status: 201, contentType: "application/json",
      headers: {"access-control-allow-origin":"*"},
      body: JSON.stringify({receipt:{
        id:"e2e-receipt",reference:"AV-2030-E2E123",status:"submitted",
        createdAt:new Date().toISOString(),
        quote:{ vehicleId:body.vehicleId,billableDays:3,dailyRateCents:5800,
          baseAmountCents:17400,currency:"EUR",requiresManualReview:false,finalPriceConfirmed:false},
        notificationStatus:"queued",nextSteps:"The operator will review the request.",
      }}),
    });
  });

  await page.goto("/#/fleet");
  await page.getByRole("link", { name: /Continue/ }).first().click();
  await expect(page).toHaveURL(/#\/checkout\//);
  await page.getByLabel("Full name *").fill("Integration Guest");
  await page.getByLabel("Email address *").fill("guest@example.com");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: /Send rental enquiry/ }).click();
  await expect(page).toHaveURL(/#\/confirmation/);
  await expect(page.getByText("AV-2030-E2E123")).toBeVisible();
  await expect(page.getByText(/not a reservation confirmation/i)).toBeVisible();
  expect(submissions).toBe(1);
});

test("invalid trip prevents a customer from continuing", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Return date").fill("2020-01-01");
  await expect(page.getByRole("button", { name: /Explore vehicles/ })).toBeDisabled();
  await expect(page.getByRole("alert")).toContainText(/return must be after pickup|pickup must be in the future/i);
});
