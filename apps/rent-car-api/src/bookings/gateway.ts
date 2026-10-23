import Stripe from "stripe";
import { serializeTrip } from "../../../../packages/rental-contracts/src/trip.ts";
import type { PaymentNotification } from "./repository.ts";
import type { BookingRecord } from "./types.ts";

export interface StripeSession {
  id: string;
  url: string;
  expiresAt: number;
}

export interface PaymentGateway {
  createSession(booking: BookingRecord, publicSiteUrl: string): Promise<StripeSession>;
  expireSession(sessionId: string): Promise<void>;
  verifyEvent(body: Buffer, signature: string): PaymentNotification | null;
}

export class StripePaymentGateway implements PaymentGateway {
  private readonly client: Stripe;
  private readonly webhookSecret: string;

  constructor(secretKey: string, webhookSecret: string) {
    this.client = new Stripe(secretKey);
    this.webhookSecret = webhookSecret;
  }

  async createSession(booking: BookingRecord, publicSiteUrl: string): Promise<StripeSession> {
    const root = publicSiteUrl.replace(/\/+$/, "");
    const query = serializeTrip(booking.trip).toString();
    const session = await this.client.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: booking.customer.email,
      client_reference_id: booking.id,
      expires_at: Math.floor(Date.now() / 1000) + 31 * 60,
      line_items: [{
        price_data: {
          currency: "eur",
          unit_amount: booking.quote.totalAmountCents,
          product_data: {
            name: booking.quote.vehicleName + " rental",
            description: booking.trip.pickupDate + " to " + booking.trip.returnDate +
              " · taxes and mandatory fees included",
          },
        },
        quantity: 1,
      }],
      payment_intent_data: { metadata: { aventra_reservation_id: booking.id } },
      metadata: { aventra_reservation_id: booking.id },
      success_url: root + "/#/pickup?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: root + "/#/book/" + encodeURIComponent(booking.vehicleId) +
        (query ? "?" + query + "&cancelled=1" : "?cancelled=1"),
    }, { idempotencyKey: "aventra-" + booking.id });

    if (!session.url) throw new Error("Stripe did not return a hosted Checkout URL.");
    return { id: session.id, url: session.url, expiresAt: session.expires_at };
  }

  async expireSession(sessionId: string): Promise<void> {
    await this.client.checkout.sessions.expire(sessionId);
  }

  verifyEvent(body: Buffer, signature: string): PaymentNotification | null {
    // Signature verification is mandatory. Never trust a browser redirect
    // or an unsigned JSON object as confirmation of payment.
    const event = this.client.webhooks.constructEvent(body, signature, this.webhookSecret);
    if (![
      "checkout.session.completed",
      "checkout.session.async_payment_succeeded",
      "checkout.session.async_payment_failed",
      "checkout.session.expired",
    ].includes(event.type)) return null;

    const session = event.data.object as Stripe.Checkout.Session;
    const bookingId = session.metadata?.aventra_reservation_id || session.client_reference_id;
    if (!bookingId || session.mode !== "payment") return null;
    const isPaid = (
      event.type === "checkout.session.completed" ||
      event.type === "checkout.session.async_payment_succeeded"
    ) && session.payment_status === "paid";

    // A completed session with pending settlement must keep its hold; it
    // cannot be confirmed until a later paid event arrives.
    if (!isPaid && event.type === "checkout.session.completed") return null;

    return {
      eventId: event.id,
      bookingId,
      sessionId: session.id,
      type: isPaid ? "paid" : "expired",
      amountTotal: session.amount_total,
      currency: session.currency,
      paymentIntentId: typeof session.payment_intent === "string" ?
        session.payment_intent : session.payment_intent?.id || null,
    };
  }
}
