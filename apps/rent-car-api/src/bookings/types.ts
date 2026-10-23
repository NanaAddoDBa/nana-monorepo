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

export interface CheckoutQuote {
  vehicleId: string;
  vehicleName: string;
  currency: "EUR";
  billableDays: number;
  dailyPriceCents: number;
  baseAmountCents: number;
  mandatoryFeeCents: number;
  totalAmountCents: number;
  depositCents: number;
  priceIncludesTax: true;
  pickupLocationId: string;
  pickupAddress: string;
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

export interface BookingReceipt {
  status: "pending_payment" | "confirmed" | "expired" | "refund_required" | "picked_up" | "completed";
  reference: string;
  vehicleName: string;
  quote: CheckoutQuote;
  trip: RentalTrip;
  pickup?: {
    address: string;
    instructions: string;
    documents: string[];
    reference: string;
  };
}

export class BookingError extends Error {
  constructor(public readonly statusCode: number, message: string) {
    super(message);
    this.name = "BookingError";
  }
}
