import type { CheckoutQuote, PaidBookingReceipt } from "../../../../packages/rental-contracts/src/booking.ts";
export type { CheckoutQuote } from "../../../../packages/rental-contracts/src/booking.ts";
export type BookingReceipt = PaidBookingReceipt;
import type { RentalTrip } from "../../../../packages/rental-contracts/src/trip.ts";

export interface VerifiedVehicle {
  vehicleId: string;
  name: string;
  pickupLocationId: string;
  dailyPriceCents: number;
  mandatoryFeeCents: number;
  depositCents: number;
  pickupAddress: string;
  pickupInstructions: string;
  mileagePolicy: string;
  fuelPolicy: string;
  cancellationPolicy: string;
  termsVersion: string;
}

export interface BookingCustomer {
  name: string;
  email: string;
  phone: string;
}

export interface BookingRequest {
  vehicleId: string;
  trip: RentalTrip;
  customer: BookingCustomer;
  acceptedTermsVersion: string;
}

export interface BookingRecord {
  id: string;
  reference: string;
  idempotencyKey: string;
  fingerprint: string;
  status: "creating" | "pending_payment" | "confirmed" | "picked_up" | "completed" | "expired" | "cancelled" | "refund_required";
  vehicleId: string;
  trip: RentalTrip;
  customer: BookingCustomer;
  quote: CheckoutQuote;
  pickupInstructions: string;
  sessionId: string | null;
  sessionUrl: string | null;
  expiresAt: Date;
}

export class BookingError extends Error {
  readonly statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = "BookingError";
  }
}
