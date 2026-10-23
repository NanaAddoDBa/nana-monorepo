import { vehicleRateById, type VehicleRate } from "./catalogue.ts";
import { billableDays, type RentalTrip, validateTrip } from "./trip.ts";

export interface RentalQuote {
  vehicleId: string;
  currency: "EUR";
  billableDays: number;
  dailyRateCents: number;
  baseAmountCents: number;
  requiresManualReview: boolean;
  finalPriceConfirmed: false;
}

export function quoteForVehicle(vehicleId: string, trip: RentalTrip, now = Date.now()): RentalQuote {
  const vehicle = vehicleRateById(vehicleId);
  if (!vehicle) throw new Error("Vehicle not found.");
  const issues = validateTrip(trip, now);
  if (issues.length) throw new Error(issues.join(" "));
  if (!vehicle.pickupLocations.includes(trip.pickupLocationId)) {
    throw new Error("This car is not listed at the selected pickup location.");
  }
  const days = billableDays(trip);
  if (!days) throw new Error("Choose valid rental dates and times.");
  return {
    vehicleId, currency: "EUR", billableDays: days,
    dailyRateCents: vehicle.dailyRateCents,
    baseAmountCents: days * vehicle.dailyRateCents,
    requiresManualReview: trip.pickupLocationId !== trip.returnLocationId,
    finalPriceConfirmed: false,
  };
}

export function previewQuote(vehicle: VehicleRate, trip: RentalTrip): RentalQuote | null {
  try { return quoteForVehicle(vehicle.id, trip); } catch { return null; }
}
