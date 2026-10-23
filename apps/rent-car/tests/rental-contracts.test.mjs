import assert from "node:assert/strict";
import test from "node:test";
import { billableDays, localDateTimeToEpoch, makeDefaultTrip, quoteForVehicle,
  serializeTrip, tripFromParams, validateTrip } from "../../../packages/rental-contracts/src/index.ts";

const trip = {
  pickupLocationId: "munich", returnLocationId: "munich",
  pickupDate: "2030-11-04", pickupTime: "10:00",
  returnDate: "2030-11-07", returnTime: "10:00",
};

test("day-based estimate uses authoritative sample catalogue", () => {
  const quote = quoteForVehicle("all-terrain-suv", trip, Date.UTC(2030, 10, 1));
  assert.equal(quote.billableDays, 3);
  assert.equal(quote.baseAmountCents, 31500);
  assert.equal(quote.finalPriceConfirmed, false);
});

test("additional started rental day is billed", () => {
  assert.equal(billableDays({ ...trip, returnTime: "11:00" }), 4);
});

test("one-way needs manual review and does not include an unverified surcharge", () => {
  const quote = quoteForVehicle("all-terrain-suv", { ...trip, returnLocationId: "berlin" }, Date.UTC(2030, 10, 1));
  assert.equal(quote.requiresManualReview, true);
  assert.equal(quote.baseAmountCents, 31500);
});

test("DST gap is rejected and DST ambiguity has deterministic interpretation", () => {
  assert.equal(localDateTimeToEpoch("2030-03-31", "02:30", "Europe/Berlin"), null);
  assert.notEqual(localDateTimeToEpoch("2030-10-27", "02:30", "Europe/Berlin"), null);
});

test("trips serialize and parse without exposing private contact details", () => {
  assert.deepEqual(tripFromParams(serializeTrip(trip)), trip);
  const legacy = tripFromParams(new URLSearchParams("city=Munich&pickup=2030-11-04&return=2030-11-07"));
  assert.equal(legacy?.pickupLocationId, "munich");
  assert.equal(legacy?.pickupTime, "10:00");
  assert.equal(legacy?.returnTime, "10:00");
});

test("missing trip parameters distinguish browsing from configured search", () => {
  assert.equal(tripFromParams(new URLSearchParams("category=SUV")), null);
  assert.equal(validateTrip(makeDefaultTrip()).length, 0);
});

test("invalid dates and unsupported locations are rejected", () => {
  assert.ok(validateTrip({ ...trip, pickupLocationId: "nowhere" }, Date.UTC(2030, 10, 1)).length);
  assert.ok(validateTrip({ ...trip, returnDate: "2030-11-03" }, Date.UTC(2030, 10, 1)).length);
  assert.ok(validateTrip({ ...trip, pickupDate: "2030-02-30" }, Date.UTC(2030, 1, 1)).length);
});
