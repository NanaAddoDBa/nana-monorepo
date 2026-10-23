import assert from "node:assert/strict";
import test from "node:test";
import { dateOffset, estimatedBaseTotal, parseISODate, rentalDays } from "../src/shared/lib/dates.ts";
import { cars } from "../src/entities/car/model/cars.ts";
import { filterCars, defaultFilters } from "../src/features/catalog/lib/filters.ts";

test("rental days count date boundaries correctly, including leap years", () => {
  assert.equal(rentalDays("2028-02-28", "2028-03-01"), 2);
  assert.equal(rentalDays("2026-10-24", "2026-10-27"), 3);
});
test("invalid and reversed date ranges have no price", () => {
  assert.equal(parseISODate("2026-02-30"), null);
  assert.equal(parseISODate("not-a-date"), null);
  assert.equal(rentalDays("2026-10-27", "2026-10-24"), 0);
  assert.equal(rentalDays("2026-10-24", "2026-10-24"), 0);
  assert.equal(estimatedBaseTotal(89, "2026-10-27", "2026-10-24"), 0);
});
test("base rental price is deterministic", () => {
  assert.equal(estimatedBaseTotal(89, "2026-10-24", "2026-10-27"), 267);
  assert.equal(estimatedBaseTotal(-10, "2026-10-24", "2026-10-27"), 0);
});
test("dateOffset returns an ISO date", () => {
  assert.match(dateOffset(1, new Date(2026, 9, 23)), /^\\d{4}-\\d{2}-\\d{2}$/);
  assert.equal(dateOffset(1, new Date(2026, 11, 31)), "2027-01-01");
});
test("catalog filters combine city, category and price without mutating input", () => {
  const copy = [...cars];
  const results = filterCars(cars, { ...defaultFilters, city: "Munich", category: "SUV", maxPrice: 110 });
  assert.deepEqual(results.map((car) => car.id), ["all-terrain-suv"]);
  assert.deepEqual(cars, copy);
});
test("sorting by rate is ordered", () => {
  const results = filterCars(cars, { ...defaultFilters, sort: "price-low" });
  assert.ok(results.every((car, i) => i === 0 || results[i - 1].dailyRate <= car.dailyRate));
});