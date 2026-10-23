import type { RentalQuote, RentalTrip } from "../../../../packages/rental-contracts/src/index.ts";

export interface EnquiryReceipt {
  id: string;
  reference: string;
  status: "submitted";
  createdAt: string;
  quote: RentalQuote;
  notificationStatus: "queued";
  nextSteps: string;
}

export interface StoreRequest {
  idempotencyKey: string;
  fingerprint: string;
  vehicleId: string;
  trip: RentalTrip;
  quote: RentalQuote;
  customer: {
    name: string;
    email: string;
    phone: string;
    message: string;
  };
}

export type StoreResult =
  | { kind: "created"; receipt: EnquiryReceipt }
  | { kind: "replayed"; receipt: EnquiryReceipt }
  | { kind: "conflict" };

export interface EnquiryRepository {
  store(request: StoreRequest): Promise<StoreResult>;
}
