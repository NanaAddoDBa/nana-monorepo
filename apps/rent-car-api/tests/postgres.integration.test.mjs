import assert from "node:assert/strict";
import { randomUUID, createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { Pool } from "pg";
import { quoteForVehicle } from "../../../packages/rental-contracts/src/index.ts";
import { PostgresEnquiryRepository } from "../src/enquiries/postgres.ts";

test("PostgreSQL persists one enquiry and two notification records", {
  skip: !process.env.TEST_DATABASE_URL,
}, async () => {
  const pool = new Pool({ connectionString: process.env.TEST_DATABASE_URL });
  const sql = await readFile(new URL("../src/db/migrations/001_enquiries.sql", import.meta.url), "utf8");
  await pool.query(sql);
  const trip = {
    pickupLocationId: "munich", returnLocationId: "munich",
    pickupDate: "2030-11-04", pickupTime: "10:00",
    returnDate: "2030-11-07", returnTime: "10:00",
  };
  const repo = new PostgresEnquiryRepository(pool);
  const idempotencyKey = randomUUID();
  const customer = { name: "DB Test", email: "integration-" + randomUUID() + "@example.com", phone: "", message: "" };
  const base = { idempotencyKey, vehicleId: "all-terrain-suv", trip,
    quote: quoteForVehicle("all-terrain-suv", trip, Date.UTC(2030, 10, 1)), customer };
  const input = { ...base, fingerprint: createHash("sha256").update(JSON.stringify(base)).digest("hex") };
  try {
    const a = await repo.store(input);
    const b = await repo.store(input);
    assert.equal(a.kind, "created");
    assert.equal(b.kind, "replayed");
    assert.equal(a.receipt.reference, b.receipt.reference);
    const row = await pool.query("SELECT COUNT(*)::integer AS count FROM notification_outbox WHERE enquiry_id=$1", [a.receipt.id]);
    assert.equal(row.rows[0].count, 2);
  } finally {
    await pool.query("DELETE FROM rental_enquiries WHERE customer_email = $1", [customer.email]);
    await pool.end();
  }
});
