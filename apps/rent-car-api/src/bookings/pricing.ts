import {
  billableDays, locationById, localDateTimeToEpoch, validateTrip,
  type RentalTrip,
} from "../../../../packages/rental-contracts/src/index.ts";
import { BookingError, type CheckoutQuote, type VerifiedVehicle } from "./types.ts";

export function validatedTimes(trip: RentalTrip, now = Date.now()) {
  const issues = validateTrip(trip, now);
  if (issues.length) throw new BookingError(422, issues[0]);

  // One-way return charges and logistics require additional operator rules.
  if (trip.pickupLocationId !== trip.returnLocationId) {
    throw new BookingError(422, "Instant checkout is currently available for same-location returns only.");
  }

  const location = locationById(trip.pickupLocationId);
  if (!location) throw new BookingError(422, "Choose a supported pickup location.");
  const pickup = localDateTimeToEpoch(trip.pickupDate, trip.pickupTime, location.timeZone);
  const dropoff = localDateTimeToEpoch(trip.returnDate, trip.returnTime, location.timeZone);
  if (pickup === null || dropoff === null) {
    throw new BookingError(422, "Invalid rental date or time.");
  }
  return { pickupAt: new Date(pickup), returnAt: new Date(dropoff) };
}

export function priceVerifiedVehicle(
  vehicle: VerifiedVehicle, trip: RentalTrip, now = Date.now(),
): CheckoutQuote {
  validatedTimes(trip, now);
  if (vehicle.pickupLocationId !== trip.pickupLocationId) {
    throw new BookingError(422, "This vehicle is not stationed at the selected pickup location.");
  }
  const billable = billableDays(trip);
  const base = vehicle.dailyPriceCents * billable;
  const total = base + vehicle.mandatoryFeeCents;
  if (!Number.isSafeInteger(total) || total < 50 || total > 100_000_000) {
    throw new BookingError(422, "The rental price could not be calculated.");
  }

  return {
    vehicleId: vehicle.vehicleId,
    vehicleName: vehicle.name,
    currency: "EUR",
    billableDays: billable,
    dailyPriceCents: vehicle.dailyPriceCents,
    baseAmountCents: base,
    mandatoryFeeCents: vehicle.mandatoryFeeCents,
    totalAmountCents: total,
    depositCents: vehicle.depositCents,
    priceIncludesTax: true,
    pickupLocationId: vehicle.pickupLocationId,
    pickupAddress: vehicle.pickupAddress,
    mileagePolicy: vehicle.mileagePolicy,
    fuelPolicy: vehicle.fuelPolicy,
    cancellationPolicy: vehicle.cancellationPolicy,
    termsVersion: vehicle.termsVersion,
  };
}
