import { createHash } from "node:crypto";
import Fastify, { type FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import { rentalLocations, quoteForVehicle } from "../../../packages/rental-contracts/src/index.ts";
import { enquirySchema, quoteSchema } from "./contracts.ts";
import type { EnquiryRepository, StoreRequest } from "./enquiries/repository.ts";

export interface ApiOptions {
  repository: EnquiryRepository;
  allowedOrigins?: string[];
  allowSampleEnquiries?: boolean;
  clock?: () => number;
}

export async function buildApp(options: ApiOptions): Promise<FastifyInstance> {
  const app = Fastify({ logger: false, bodyLimit: 12_288, trustProxy: true });
  const origins = options.allowedOrigins || [
    "https://nanaaddodba.github.io",
    "http://localhost:5173",
  ];
  await app.register(cors, {
    origin(origin, callback) {
      callback(null, !origin || origins.includes(origin));
    },
    methods: ["GET", "POST", "OPTIONS"],
  });
  await app.register(rateLimit, { max: 60, timeWindow: "1 minute" });

  app.get("/healthz", async () => ({ status: "ok" }));
  app.get("/v1/locations", async () => ({ locations: rentalLocations }));

  app.post("/v1/quotes", async (request, reply) => {
    const parsed = quoteSchema.safeParse(request.body);
    if (!parsed.success) return reply.code(422).send({ error: "Invalid quote request.", details: parsed.error.flatten() });
    try {
      return { quote: quoteForVehicle(parsed.data.vehicleId, parsed.data.trip, options.clock?.()) };
    } catch (error) {
      return reply.code(422).send({ error: error instanceof Error ? error.message : "Invalid trip." });
    }
  });

  app.post("/v1/enquiries", { config: { rateLimit: { max: 8, timeWindow: "1 minute" } } }, async (request, reply) => {
    if (!options.allowSampleEnquiries) return reply.code(503).send({
      error: "Rental enquiries are not enabled. Verified inventory and operator configuration are required.",
    });
    const parsed = enquirySchema.safeParse(request.body);
    if (!parsed.success) return reply.code(422).send({ error: "Invalid enquiry.", details: parsed.error.flatten() });
    const key = request.headers["idempotency-key"];
    if (typeof key !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(key)) {
      return reply.code(400).send({ error: "A UUID idempotency key is required." });
    }
    let quote;
    try {
      quote = quoteForVehicle(parsed.data.vehicleId, parsed.data.trip, options.clock?.());
    } catch (error) {
      return reply.code(422).send({ error: error instanceof Error ? error.message : "Invalid trip." });
    }
    const input: StoreRequest = {
      idempotencyKey: key,
      fingerprint: createHash("sha256").update(JSON.stringify(parsed.data)).digest("hex"),
      vehicleId: parsed.data.vehicleId, trip: parsed.data.trip, quote,
      customer: {
        name: parsed.data.customer.name, email: parsed.data.customer.email,
        phone: parsed.data.customer.phone, message: parsed.data.customer.message,
      },
    };
    const result = await options.repository.store(input);
    if (result.kind === "conflict") return reply.code(409).send({
      error: "This submission key has already been used for different enquiry details.",
    });
    return reply.code(result.kind === "created" ? 201 : 200).send({ receipt: result.receipt });
  });

  app.setErrorHandler((error, _request, reply) => {
    if ("statusCode" in error && typeof error.statusCode === "number" && error.statusCode < 500) {
      reply.code(error.statusCode).send({ error: error.message });
      return;
    }
    // Avoid returning private customer information, SQL diagnostics or stack traces.
    app.log.error({ err: error }, "Unhandled API error");
    reply.code(500).send({ error: "Unable to complete this request. Please try again." });
  });

  return app;
}
