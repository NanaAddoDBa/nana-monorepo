import { createHash, randomBytes, randomUUID } from "node:crypto";
import type { Pool } from "pg";
import type { EnquiryReceipt, EnquiryRepository, StoreRequest, StoreResult } from "./repository.ts";

function fingerprint(request: StoreRequest): string {
  return createHash("sha256")
    .update(JSON.stringify([request.vehicleId, request.trip, request.customer]))
    .digest("hex");
}

export function requestFingerprint(request: Omit<StoreRequest, "fingerprint">): string {
  return fingerprint({ ...request, fingerprint: "" });
}

function receiptFromRow(row: { id: string; reference: string; status: "submitted"; created_at: Date | string; quote: EnquiryReceipt["quote"] }): EnquiryReceipt {
  return {
    id: row.id, reference: row.reference, status: "submitted",
    createdAt: new Date(row.created_at).toISOString(),
    quote: row.quote, notificationStatus: "queued",
    nextSteps: "Your request has been recorded. An operator must confirm availability and final terms.",
  };
}

export class PostgresEnquiryRepository implements EnquiryRepository {
  private readonly pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async store(input: StoreRequest): Promise<StoreResult> {
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      const id = randomUUID();
      const reference = "AV-" + new Date().getUTCFullYear() + "-" + randomBytes(6).toString("hex").toUpperCase();
      const inserted = await client.query(
        `INSERT INTO rental_enquiries
        (id, reference, idempotency_key, fingerprint, vehicle_id, trip, quote,
         customer_name, customer_email, customer_phone, customer_message)
         VALUES ($1,$2,$3,$4,$5,$6::jsonb,$7::jsonb,$8,$9,$10,$11)
         ON CONFLICT (idempotency_key) DO NOTHING
         RETURNING id, reference, status, created_at, quote`,
        [id,reference,input.idempotencyKey,input.fingerprint,input.vehicleId,
          JSON.stringify(input.trip),JSON.stringify(input.quote),
          input.customer.name,input.customer.email,input.customer.phone,input.customer.message],
      );
      if (inserted.rowCount) {
        await client.query(
          `INSERT INTO notification_outbox (enquiry_id, recipient_kind)
           VALUES ($1,'operator'),($1,'customer')`,
          [id],
        );
        await client.query("COMMIT");
        return { kind: "created", receipt: receiptFromRow(inserted.rows[0]) };
      }
      const existing = await client.query(
        `SELECT id,reference,status,created_at,quote,fingerprint
         FROM rental_enquiries WHERE idempotency_key = $1`,
        [input.idempotencyKey],
      );
      await client.query("COMMIT");
      if (!existing.rows.length || existing.rows[0].fingerprint !== input.fingerprint) {
        return { kind: "conflict" };
      }
      return { kind: "replayed", receipt: receiptFromRow(existing.rows[0]) };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}
