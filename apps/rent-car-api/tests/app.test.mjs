import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import test from "node:test";
import { buildApp } from "../src/app.ts";

const trip = {
  pickupLocationId: "munich", returnLocationId: "munich",
  pickupDate: "2030-11-04", pickupTime: "10:00",
  returnDate: "2030-11-07", returnTime: "10:00",
};
const now = () => Date.UTC(2030, 10, 1);
const body = {
  vehicleId: "all-terrain-suv", trip,
  customer: { name: "Integration Guest", email: "guest@example.com", phone: "", message: "", consent: true },
};

function memoryRepository() {
  const records = new Map();
  return {
    records,
    async store(input) {
      const original = records.get(input.idempotencyKey);
      if (original) return original.fingerprint !== input.fingerprint
        ? { kind: "conflict" } : { kind: "replayed", receipt: original.receipt };
      const receipt = {
        id: randomUUID(), reference: "AV-2030-SANDBOX",
        status: "submitted", createdAt: new Date(now()).toISOString(),
        quote: input.quote, notificationStatus: "queued",
        nextSteps: "The operator will review the request.",
      };
      records.set(input.idempotencyKey, { fingerprint: input.fingerprint, receipt });
      return { kind: "created", receipt };
    },
  };
}
async function setup(enabled = true) {
  const repository = memoryRepository();
  const app = await buildApp({ repository, allowSampleEnquiries: enabled, clock: now });
  return { app, repository };
}

test("health and locations endpoints respond", async () => {
  const { app } = await setup();
  try {
    assert.equal((await app.inject({ method: "GET", url: "/healthz" })).statusCode, 200);
    const locations = await app.inject({ method: "GET", url: "/v1/locations" });
    assert.equal(locations.json().locations.length, 4);
  } finally { await app.close(); }
});

test("server calculates authoritative quote and rejects invalid trips", async () => {
  const { app } = await setup();
  try {
    const result = await app.inject({ method: "POST", url: "/v1/quotes", payload: { vehicleId: body.vehicleId, trip } });
    assert.equal(result.statusCode, 200);
    assert.equal(result.json().quote.baseAmountCents, 31500);
    const invalid = await app.inject({ method: "POST", url: "/v1/quotes", payload: { vehicleId: body.vehicleId, trip: { ...trip, returnDate: "2030-11-03" } } });
    assert.equal(invalid.statusCode, 422);
  } finally { await app.close(); }
});

test("public submission is gated until verified operator data exists", async () => {
  const { app, repository } = await setup(false);
  try {
    const result = await app.inject({ method: "POST", url: "/v1/enquiries", payload: body,
      headers: { "idempotency-key": randomUUID() } });
    assert.equal(result.statusCode, 503);
    assert.equal(repository.records.size, 0);
  } finally { await app.close(); }
});

test("idempotent submission returns one receipt; conflicting reuse returns 409", async () => {
  const { app, repository } = await setup();
  const key = randomUUID();
  try {
    const options = { method: "POST", url: "/v1/enquiries", payload: body,
      headers: { "idempotency-key": key } };
    const first = await app.inject(options);
    const second = await app.inject(options);
    assert.equal(first.statusCode, 201);
    assert.equal(second.statusCode, 200);
    assert.equal(first.json().receipt.reference, second.json().receipt.reference);
    assert.equal(repository.records.size, 1);
    const clash = await app.inject({ ...options, payload: { ...body, customer: { ...body.customer, name: "Other Guest" } } });
    assert.equal(clash.statusCode, 409);
  } finally { await app.close(); }
});

test("submission rejects missing idempotency, invalid email and invalid pickup", async () => {
  const { app } = await setup();
  try {
    assert.equal((await app.inject({ method: "POST", url: "/v1/enquiries", payload: body })).statusCode, 400);
    assert.equal((await app.inject({ method: "POST", url: "/v1/enquiries", payload: {
      ...body, customer: { ...body.customer, email: "not-mail" },
    }, headers: { "idempotency-key": randomUUID() } })).statusCode, 422);
    assert.equal((await app.inject({ method: "POST", url: "/v1/enquiries", payload: {
      ...body, trip: { ...trip, pickupLocationId: "unsupported" },
    }, headers: { "idempotency-key": randomUUID() } })).statusCode, 422);
  } finally { await app.close(); }
});
