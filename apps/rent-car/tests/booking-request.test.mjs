import assert from "node:assert/strict";
import test from "node:test";

import {
  bookingRequestText,
  mailtoBooking,
} from "../src/features/booking/lib/request.ts";

const request = {
  carName: "Mid-size SUV",
  dailyRate: 105,
  pickupCity: "Munich",
  pickupDate: "2026-11-04",
  returnDate: "2026-11-07",
  customerName: "Test Customer",
  customerEmail: "customer@example.com",
  phone: "",
  message: "Need a child seat & airport pickup?",
};

test("enquiry text includes the correct dates, prices and contact information", () => {
  const text = bookingRequestText(request);

  assert.match(text, /Rental days: 3/);
  assert.match(text, /Indicative base total: EUR 315/);
  assert.match(text, /Test Customer/);
  assert.match(text, /customer@example\.com/);
  assert.match(text, /Need a child seat & airport pickup\?/);
  assert.match(text, /Please confirm availability/);
});

test("mail-to URLs correctly encode the enquiry without submitting it", () => {
  const url = new URL(mailtoBooking("rentals@example.com", request));

  assert.equal(url.protocol, "mailto:");
  assert.equal(url.pathname, "rentals@example.com");
  assert.equal(url.searchParams.get("subject"), "Availability request: Mid-size SUV");
  assert.equal(url.searchParams.get("body"), bookingRequestText(request));
});
