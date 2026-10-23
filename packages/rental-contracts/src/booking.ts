import type { RentalTrip } from "./trip.ts";

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

export type PaidBookingStatus =
  | "pending_payment"
  | "confirmed"
  | "picked_up"
  | "completed"
  | "expired"
  | "refund_required";

export interface PaidBookingReceipt {
  status: PaidBookingStatus;
  reference: string;
  vehicleName: string;
  quote: CheckoutQuote;
  trip: RentalTrip;
  pickup?: {
    reference: string;
    address: string;
    instructions: string;
    documents: string[];
  };
}
