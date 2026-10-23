import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { tripSchema } from "../contracts.ts";
import { BookingError, type BookingCustomer } from "./types.ts";
import { bookingFingerprint, type BookingStore } from "./repository.ts";
import type { PaymentGateway } from "./gateway.ts";

const bookingQuoteSchema = z.object({
  trip: tripSchema,
  vehicleId: z.string().min(1).max(80),
}).strict();

const checkoutSchema = bookingQuoteSchema.extend({
  customer: z.object({
    name: z.string().trim().min(2).max(80),
    email: z.string().trim().email().max(150),
    phone: z.string().trim().max(40).default(""),
    consent: z.literal(true),
  }).strict(),
  acceptedTermsVersion: z.string().min(3).max(60),
}).strict();

const availabilitySchema = z.object({ trip: tripSchema }).strict();
const sessionQuerySchema = z.object({ session_id: z.string().min(20).max(200) });

export interface BookingRoutesOptions {
  store: BookingStore;
  gateway: PaymentGateway;
  enabled: boolean;
  publicSiteUrl: string;
  clock?: () => number;
}

function bookingEnabled(options: BookingRoutesOptions): void {
  if (!options.enabled) {
    throw new BookingError(503,
      "Instant bookings are not yet available. Verified inventory, prices and payment setup are required.");
  }
}

export function registerBookingRoutes(app: FastifyInstance, options: BookingRoutesOptions): void {
  app.post("/v1/bookings/availability", async (request, reply) => {
    bookingEnabled(options);
    const parsed = availabilitySchema.safeParse(request.body);
    if (!parsed.success) return reply.code(422).send({ error: "Choose a valid rental trip." });
    const quotes = await options.store.availability(parsed.data.trip, options.clock?.());
    return { quotes };
  });

  app.post("/v1/bookings/quote", async (request, reply) => {
    bookingEnabled(options);
    const parsed = bookingQuoteSchema.safeParse(request.body);
    if (!parsed.success) return reply.code(422).send({ error: "Choose a valid vehicle and trip." });
    return { quote: await options.store.quote(parsed.data.vehicleId, parsed.data.trip, options.clock?.()) };
  });

  app.post("/v1/bookings/checkout", { config: { rateLimit: { max: 5, timeWindow: "1 minute" } } },
    async (request, reply) => {
      bookingEnabled(options);
      const parsed = checkoutSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.code(422).send({ error: "Check the booking details and accept the rental terms." });
      }
      const idempotencyKey = request.headers["idempotency-key"];
      if (typeof idempotencyKey !== "string" ||
        !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(idempotencyKey)) {
        return reply.code(400).send({ error: "A UUID idempotency key is required." });
      }

      const data = parsed.data;
      const customer: BookingCustomer = {
        name: data.customer.name,
        email: data.customer.email,
        phone: data.customer.phone,
      };
      const order = {
        vehicleId: data.vehicleId, trip: data.trip, customer,
        acceptedTermsVersion: data.acceptedTermsVersion,
      };
      const hold = await options.store.reserve({
        ...order, idempotencyKey, fingerprint: bookingFingerprint(order),
      }, options.clock?.());

      if (hold.kind === "replayed") {
        return { checkoutUrl: hold.record.sessionUrl, expiresAt: hold.record.expiresAt.toISOString() };
      }
      let session;
      try {
        session = await options.gateway.createSession(hold.record, options.publicSiteUrl);
      } catch (error) {
        await options.store.abandonCreation(hold.record.id);
        throw error;
      }
      try {
        await options.store.attachSession(hold.record.id, session);
      } catch (error) {
        // If persistence fails, expire the newly created payment session
        // BEFORE releasing the hold. Never leave a payable orphan checkout.
        await options.gateway.expireSession(session.id);
        await options.store.abandonCreation(hold.record.id);
        throw error;
      }
      return reply.code(201).send({
        checkoutUrl: session.url, expiresAt: new Date(session.expiresAt * 1000).toISOString(),
      });
    },
  );

  app.get("/v1/bookings/receipt", async (request, reply) => {
    // Receipt checks remain available after new bookings are disabled so
    // existing paid customers retain their pickup instructions.
    const parsed = sessionQuerySchema.safeParse(request.query);
    if (!parsed.success) return reply.code(400).send({ error: "Invalid checkout session." });
    const receipt = await options.store.getReceipt(parsed.data.session_id);
    if (!receipt) return reply.code(404).send({ error: "Booking not found." });
    return { booking: receipt };
  });

  app.post("/v1/stripe/webhook", {
    config: { rawBody: true, rateLimit: { max: 180, timeWindow: "1 minute" } },
  }, async (request, reply) => {
    const signature = request.headers["stripe-signature"];
    if (typeof signature !== "string" || !Buffer.isBuffer(request.rawBody)) {
      return reply.code(400).send({ error: "Invalid payment signature." });
    }
    let notification;
    try {
      notification = options.gateway.verifyEvent(request.rawBody, signature);
    } catch {
      return reply.code(400).send({ error: "Invalid payment signature." });
    }
    if (notification) await options.store.applyPayment(notification);
    return { received: true };
  });
}
