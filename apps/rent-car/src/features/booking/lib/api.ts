import type { RentalQuote, RentalTrip } from "@rental";
import type { CustomerDetails } from "@/features/booking/model/customer";
import { site } from "@/shared/config/site";

export interface EnquiryReceipt {
  id: string;
  reference: string;
  status: "submitted";
  createdAt: string;
  quote: RentalQuote;
  notificationStatus: "queued";
  nextSteps: string;
}

export async function submitEnquiry(
  vehicleId: string,
  trip: RentalTrip,
  customer: CustomerDetails,
  idempotencyKey: string,
): Promise<EnquiryReceipt> {
  if (!site.useEnquiryApi) throw new Error("Server-backed enquiries are not enabled.");
  const base = site.enquiryApiUrl.replace(/\/+$/, "");
  if (!base.startsWith("https://") && !base.startsWith("http://localhost:")) {
    throw new Error("A secure API URL is required.");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);
  try {
    const response = await fetch(base + "/v1/enquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Idempotency-Key": idempotencyKey },
      body: JSON.stringify({ vehicleId, trip, customer }),
      signal: controller.signal,
    });
    const result: unknown = await response.json();
    if (!response.ok) {
      const detail = result && typeof result === "object" && "error" in result
        && typeof result.error === "string" ? result.error : "The rental enquiry could not be submitted.";
      throw new Error(detail);
    }
    if (!result || typeof result !== "object" || !("receipt" in result)
      || !result.receipt || typeof result.receipt !== "object"
      || !("reference" in result.receipt) || typeof result.receipt.reference !== "string"
      || !("id" in result.receipt) || typeof result.receipt.id !== "string") {
      throw new Error("The server did not return a valid enquiry receipt.");
    }
    return result.receipt as EnquiryReceipt;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("The server did not respond in time. Retry without changing your enquiry; duplicate submissions are protected.");
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
