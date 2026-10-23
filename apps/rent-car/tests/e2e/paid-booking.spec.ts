import { expect, test } from "@playwright/test";

test.skip(process.env.VITE_ENABLE_PAID_BOOKINGS !== "true", "Paid-booking test mode only.");

const api = "https://api.aventra.test";
const sessionId = "cs_test_ABCDEF0123456789abcdefghijklmn";

function verifiedQuote(trip: Record<string,string>) {
  return {
    vehicleId:"all-terrain-suv", vehicleName:"Mid-size SUV", currency:"EUR",
    billableDays:3,dailyPriceCents:10000,baseAmountCents:30000,
    mandatoryFeeCents:1500,totalAmountCents:31500,depositCents:20000,
    priceIncludesTax:true,pickupLocationId:"munich",pickupAddress:"Verified Example Street 12, Munich",
    mileagePolicy:"500 km included",fuelPolicy:"Return with the same fuel level",
    cancellationPolicy:"Free cancellation until 24 hours before pickup",
    termsVersion:"verified-test-v1",trip,
  };
}

async function mockPrices(page: import("@playwright/test").Page) {
  await page.route(api + "/v1/bookings/availability",async route => {
    if (route.request().method()==="OPTIONS") { await route.fulfill({status:204,headers:{
      "access-control-allow-origin":"*","access-control-allow-headers":"content-type",
      "access-control-allow-methods":"POST, OPTIONS",
    }});return;}
    const body=JSON.parse(route.request().postData() || "{}");
    await route.fulfill({status:200,contentType:"application/json",
      headers:{"access-control-allow-origin":"*"},
      body:JSON.stringify({quotes:[verifiedQuote(body.trip)]})});
  });
  await page.route(api + "/v1/bookings/quote",async route => {
    if (route.request().method()==="OPTIONS") { await route.fulfill({status:204,headers:{
      "access-control-allow-origin":"*","access-control-allow-headers":"content-type",
      "access-control-allow-methods":"POST, OPTIONS",
    }});return;}
    const body=JSON.parse(route.request().postData() || "{}");
    await route.fulfill({status:200,contentType:"application/json",
      headers:{"access-control-allow-origin":"*"},
      body:JSON.stringify({quote:verifiedQuote(body.trip)})});
  });
}

test("available vehicle → one-page checkout → Stripe → verified pickup pass",async ({page})=>{
  await mockPrices(page);
  await page.route("https://checkout.stripe.com/**",async route => {
    await route.fulfill({status:200,contentType:"text/html",body:"<h1>Mock hosted payment provider</h1>"});
  });
  let capturedKey = "";
  await page.route(api+"/v1/bookings/checkout",async route=>{
    if(route.request().method()==="OPTIONS") {await route.fulfill({status:204,headers:{
      "access-control-allow-origin":"*",
      "access-control-allow-headers":"content-type,idempotency-key",
      "access-control-allow-methods":"POST, OPTIONS",
    }});return;}
    const body=JSON.parse(route.request().postData() || "{}");
    capturedKey=route.request().headers()["idempotency-key"];
    expect(body.vehicleId).toBe("all-terrain-suv");
    expect(body.acceptedTermsVersion).toBe("verified-test-v1");
    expect(body.customer.email).toBe("driver@example.com");
    await route.fulfill({status:201,contentType:"application/json",
      headers:{"access-control-allow-origin":"*"},
      body:JSON.stringify({checkoutUrl:"https://checkout.stripe.com/pay/mock-session"})});
  });

  await page.goto("/");
  await page.getByRole("button",{name:/Explore vehicles/}).click();
  await expect(page.getByRole("link",{name:/Select car/})).toBeVisible();
  await page.getByRole("link",{name:/Select car/}).click();
  await expect(page).toHaveURL(/#\/checkout\/all-terrain-suv/);
  await expect(page.getByText(/Total payable now/)).toBeVisible();
  await page.getByLabel("Full name *").fill("Driver Example");
  await page.getByLabel("Email address *").fill("driver@example.com");
  await page.getByRole("checkbox").check();
  await page.getByRole("button",{name:/Pay securely/}).click();
  await page.waitForURL("https://checkout.stripe.com/pay/mock-session");
  expect(capturedKey).toMatch(/^[0-9a-f-]{36}$/i);

  let lookups=0;
  await page.route(api+"/v1/bookings/receipt?*",async route=>{
    lookups++;
    await route.fulfill({status:200,contentType:"application/json",
      headers:{"access-control-allow-origin":"*"},
      body:JSON.stringify({booking:{
        // React StrictMode can initiate an extra mount-time receipt fetch in development.\n        status:lookups <= 2 ? "pending_payment" : "confirmed",
        reference:"AV-2030-PAID001",
        vehicleName:"Mid-size SUV",
        trip:{pickupLocationId:"munich",returnLocationId:"munich",
          pickupDate:"2030-11-04",pickupTime:"10:00",
          returnDate:"2030-11-07",returnTime:"10:00"},
        quote:verifiedQuote({}),
        ...(lookups <= 2 ? {} : {pickup:{
          reference:"AV-2030-PAID001",address:"Verified Example Street 12, Munich",
          instructions:"Show your licence at the service desk",
          documents:["Valid driving licence","Accepted photo ID"],
        }}),
      }})});
  });
  await page.goto("/#/pickup?session_id="+sessionId);
  await expect(page.getByText("Payment is being verified.")).toBeVisible();
  await expect(page.getByRole("heading",{name:"Ready for pickup."})).toBeVisible({timeout:15000});
  await expect(page.getByText("AV-2030-PAID001")).toBeVisible();
  await expect(page.getByRole("link",{name:/Get directions/})).toHaveAttribute("href",/google.com\/maps/);
});

test("server booking conflict cannot create a confirmation or pickup pass",async ({page})=>{
  await mockPrices(page);
  let lastKey = "";
  let count=0;
  await page.route(api+"/v1/bookings/checkout",async route=>{
    if(route.request().method()==="OPTIONS") {await route.fulfill({status:204,headers:{
      "access-control-allow-origin":"*",
      "access-control-allow-headers":"content-type,idempotency-key",
      "access-control-allow-methods":"POST, OPTIONS",
    }});return;}
    count+=1;
    const key=route.request().headers()["idempotency-key"];
    if(lastKey) expect(key).toBe(lastKey);
    lastKey=key;
    await route.fulfill({status:409,contentType:"application/json",
      headers:{"access-control-allow-origin":"*"},
      body:JSON.stringify({error:"This vehicle is already reserved for the selected dates."})});
  });
  await page.goto("/");
  await page.getByRole("button",{name:/Explore vehicles/}).click();
  await page.getByRole("link",{name:/Select car/}).click();
  await page.getByLabel("Full name *").fill("Driver Example");
  await page.getByLabel("Email address *").fill("driver@example.com");
  await page.getByRole("checkbox").check();
  await page.getByRole("button",{name:/Pay securely/}).click();
  await expect(page.getByRole("alert")).toContainText(/already reserved/i);
  await page.getByRole("button",{name:/Pay securely/}).click();
  await expect(page.getByRole("alert")).toContainText(/already reserved/i);
  expect(count).toBe(2);
  expect(page.url()).toContain("#/checkout/");
});
