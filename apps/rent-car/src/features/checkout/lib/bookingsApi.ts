import type { CheckoutQuote, PaidBookingReceipt, RentalTrip } from "@rental";
import type { CustomerDetails } from "@/features/booking/model/customer";
import { site } from "@/shared/config/site";

function apiBase() {
  const raw = site.enquiryApiUrl.replace(/\/+$/, "");
  const url = new URL(raw);
  if (url.protocol !== "https:" &&
    !(url.protocol === "http:" && ["localhost","127.0.0.1"].includes(url.hostname))) {
    throw new Error("The booking service must use HTTPS.");
  }
  return url.origin + url.pathname.replace(/\/+$/, "");
}

async function request<T>(
  path: string, body?: unknown, options?: { signal?: AbortSignal; idempotencyKey?: string },
): Promise<T> {
  const response = await fetch(apiBase() + path, {
    method: body === undefined ? "GET" : "POST",
    headers: {
      ...(body === undefined ? {} : { "Content-Type": "application/json" }),
      ...(options?.idempotencyKey ? { "Idempotency-Key": options.idempotencyKey } : {}),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    signal: options?.signal,
    cache: "no-store",
  });
  const result: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const error = result && typeof result === "object" && "error" in result &&
      typeof result.error === "string" ? result.error : "The booking service is unavailable.";
    throw new Error(error);
  }
  return result as T;
}

function validQuote(q: unknown): q is CheckoutQuote {
  if (!q || typeof q !== "object") return false;
  const value = q as Partial<CheckoutQuote>;
  return typeof value.vehicleId === "string" && typeof value.vehicleName === "string" &&
    value.currency === "EUR" && value.priceIncludesTax === true &&
    typeof value.totalAmountCents === "number" && value.totalAmountCents > 0 &&
    Number.isSafeInteger(value.totalAmountCents) &&
    typeof value.billableDays === "number" && value.billableDays >= 1 &&
    typeof value.depositCents === "number" && value.depositCents >= 0 &&
    typeof value.termsVersion === "string" && typeof value.pickupAddress === "string";
}

export async function fetchAvailableCars(trip: RentalTrip, signal?: AbortSignal) {
  const data = await request<{ quotes?: unknown }>(
    "/v1/bookings/availability", { trip }, { signal },
  );
  if (!Array.isArray(data.quotes) || !data.quotes.every(validQuote)) {
    throw new Error("The availability service returned incomplete pricing.");
  }
  return data.quotes as CheckoutQuote[];
}

export async function fetchCheckoutQuote(vehicleId: string, trip: RentalTrip, signal?: AbortSignal) {
  const data = await request<{ quote?: unknown }>(
    "/v1/bookings/quote", { vehicleId, trip }, { signal },
  );
  if (!validQuote(data.quote)) throw new Error("The verified price is unavailable.");
  return data.quote;
}

export async function beginSecureCheckout(
  vehicleId: string, trip: RentalTrip, customer: CustomerDetails,
  acceptedTermsVersion: string, idempotencyKey: string,
) {
  if (!site.usePaidBookings) throw new Error("Online payments are not yet enabled.");
  const data = await request<{ checkoutUrl?: unknown }>(
    "/v1/bookings/checkout",
    {
      vehicleId, trip,
      customer: { name: customer.name.trim(), email: customer.email.trim(),
        phone: customer.phone.trim(), consent: customer.consent },
      acceptedTermsVersion,
    },
    { idempotencyKey },
  );
  if (typeof data.checkoutUrl !== "string") {
    throw new Error("The payment provider did not return a checkout link.");
  }
  const url = new URL(data.checkoutUrl);
  if (url.protocol !== "https:") throw new Error("The payment link is not secure.");
  return url.href;
}

export async function fetchPaidReceipt(sessionId: string, signal?: AbortSignal) {
  if (!/^cs_(?:test_|live_)[A-Za-z0-9]+$/.test(sessionId) && sessionId.length < 20) {
    throw new Error("Invalid payment session.");
  }
  const data = await request<{booking?: PaidBookingReceipt}>(
    "/v1/bookings/receipt?session_id=" + encodeURIComponent(sessionId),
    undefined,
    { signal },
  );
  const value = data.booking;
  if (!value || typeof value.reference !== "string" ||
    !["pending_payment","confirmed","picked_up","completed","expired","refund_required"].includes(value.status) ||
    !validQuote(value.quote)) throw new Error("The booking receipt could not be verified.");
  return value;
}
