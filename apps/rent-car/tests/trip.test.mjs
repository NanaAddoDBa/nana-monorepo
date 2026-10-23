import assert from "node:assert/strict";
import test from "node:test";
import { addCalendarDays, isValidRentalPeriod } from "../src/shared/lib/dates.ts";
import {
  changePickupDate,
  initialTripDates,
  rentalDetailsQuery,
  validateTrip,
} from "../src/features/booking/lib/trip.ts";

test("date shifts work across month and year boundaries", () => {
  assert.equal(addCalendarDays("2026-12-31", 1), "2027-01-01");
  assert.equal(addCalendarDays("2028-02-28", 1), "2028-02-29");
  assert.equal(addCalendarDays("invalid", 1), "");
});

test("unavailable or invalid pickup dates use a valid default", () => {
  assert.deepEqual(initialTripDates(null, null, "2026-10-23"), {
    pickupDate: "2026-10-24",
    returnDate: "2026-10-27",
  });
  assert.deepEqual(initialTripDates("2026-10-20", "2026-10-25", "2026-10-23"), {
    pickupDate: "2026-10-24",
    returnDate: "2026-10-25",
  });
  assert.deepEqual(initialTripDates("not-a-date", "2026-11-10", "2026-10-23"), {
    pickupDate: "2026-10-24",
    returnDate: "2026-11-10",
  });
});

test("changing pickup preserves or updates return depending on the date order", () => {
  assert.deepEqual(
    changePickupDate(
      { pickupDate: "2026-11-04", returnDate: "2026-11-07" },
      "2026-11-06",
    ),
    { pickupDate: "2026-11-06", returnDate: "2026-11-07" },
  );
  assert.deepEqual(
    changePickupDate(
      { pickupDate: "2026-11-04", returnDate: "2026-11-07" },
      "2026-11-10",
    ),
    { pickupDate: "2026-11-10", returnDate: "2026-11-13" },
  );
});

test("fleet navigation forwards rental context but excludes filter-only parameters", () => {
  const query = rentalDetailsQuery("?city=Munich&pickup=2026-11-04&return=2026-11-07&sort=price-low&category=SUV");
  assert.equal(query, "?city=Munich&pickup=2026-11-04&return=2026-11-07");
  assert.equal(rentalDetailsQuery("?category=SUV"), "");
});

test("date validation excludes past and zero-day rentals", () => {
  assert.equal(isValidRentalPeriod("2026-10-22", "2026-10-26", "2026-10-23"), false);
  assert.equal(isValidRentalPeriod("2026-10-24", "2026-10-24", "2026-10-23"), false);
  assert.equal(isValidRentalPeriod("2026-10-24", "2026-10-25", "2026-10-23"), true);
  assert.equal(validateTrip({ pickupDate: "2026-10-24", returnDate: "2026-10-25" }), isValidRentalPeriod("2026-10-24", "2026-10-25"));
});
