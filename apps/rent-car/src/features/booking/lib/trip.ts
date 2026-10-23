import {
  addCalendarDays,
  dateOffset,
  isValidRentalPeriod,
  rentalDays,
} from "../../../shared/lib/dates.ts";

export interface TripDates {
  pickupDate: string;
  returnDate: string;
}

const QUERY_KEYS = ["city", "pickup", "return"] as const;

export function initialTripDates(
  pickup: string | null | undefined,
  dropoff: string | null | undefined,
  today = dateOffset(0),
): TripDates {
  const validPickup = pickup && pickup >= today && dateOffsetFrom(pickup)
    ? pickup
    : addCalendarDays(today, 1);

  return {
    pickupDate: validPickup,
    returnDate: dropoff && rentalDays(validPickup, dropoff) > 0
      ? dropoff
      : addCalendarDays(validPickup, 3),
  };
}

function dateOffsetFrom(value: string): boolean {
  return addCalendarDays(value, 0) !== "";
}

export function changePickupDate(current: TripDates, pickupDate: string): TripDates {
  return {
    pickupDate,
    returnDate: rentalDays(pickupDate, current.returnDate) > 0
      ? current.returnDate
      : addCalendarDays(pickupDate, 3),
  };
}

export function rentalDetailsQuery(search: string): string {
  const original = new URLSearchParams(search);
  const params = new URLSearchParams();

  for (const key of QUERY_KEYS) {
    const value = original.get(key);
    if (value) params.set(key, value);
  }

  const query = params.toString();
  return query ? `?${query}` : "";
}

export function validateTrip(dates: TripDates): boolean {
  return isValidRentalPeriod(dates.pickupDate, dates.returnDate);
}
