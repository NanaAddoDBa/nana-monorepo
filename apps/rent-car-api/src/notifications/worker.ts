import { Pool } from "pg";
import nodemailer from "nodemailer";

interface PendingNotification {
  id: number;
  attempts: number;
  recipient_kind: "customer" | "operator";
  reference: string;
  vehicle_id: string;
  customer_name: string;
  customer_email: string;
  trip: {
    pickupLocationId: string;
    returnLocationId: string;
    pickupDate: string;
    pickupTime: string;
    returnDate: string;
    returnTime: string;
  };
}

async function deliverBatch(pool: Pool, smtpUrl: string, from: string, operatorEmail: string): Promise<number> {
  const transport = nodemailer.createTransport(smtpUrl);
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await client.query<PendingNotification>(
      `SELECT o.id,o.attempts,o.recipient_kind,
        e.reference,e.vehicle_id,e.customer_name,e.customer_email,e.trip
       FROM notification_outbox o
       JOIN rental_enquiries e ON e.id = o.enquiry_id
       WHERE o.delivered_at IS NULL AND o.attempts < 5 AND o.next_attempt_at <= NOW()
       ORDER BY o.id LIMIT 10 FOR UPDATE OF o SKIP LOCKED`,
    );
    for (const item of result.rows) {
      const to = item.recipient_kind === "customer" ? item.customer_email : operatorEmail;
      const title = item.recipient_kind === "customer"
        ? "We received your Aventra rental enquiry"
        : "New Aventra rental enquiry";
      const text = [
        item.recipient_kind === "customer" ? `Hello ${item.customer_name},` : "A new rental enquiry has arrived.",
        "", `Reference: ${item.reference}`, `Vehicle: ${item.vehicle_id}`,
        `Pickup: ${item.trip.pickupLocationId}, ${item.trip.pickupDate} ${item.trip.pickupTime}`,
        `Return: ${item.trip.returnLocationId}, ${item.trip.returnDate} ${item.trip.returnTime}`,
        "", "This is an enquiry receipt, not a confirmed reservation or final rental quote.",
        "An operator must verify availability and rental terms before confirmation.",
      ].join("\n");
      try {
        await transport.sendMail({
          from, to, subject: `${title} · ${item.reference}`, text,
          headers: { "X-Aventra-Reference": item.reference },
        });
        await client.query("UPDATE notification_outbox SET delivered_at=NOW(),last_error=NULL WHERE id=$1", [item.id]);
      } catch {
        const nextAttempt = item.attempts + 1;
        const delay = Math.min(3600, 30 * 2 ** (nextAttempt - 1));
        await client.query(
          `UPDATE notification_outbox
           SET attempts=$2,next_attempt_at=NOW()+($3 * INTERVAL '1 second'),last_error='delivery failed'
           WHERE id=$1`,
          [item.id, nextAttempt, delay],
        );
      }
    }
    await client.query("COMMIT");
    return result.rowCount || 0;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
    transport.close();
  }
}

const databaseUrl = process.env.DATABASE_URL;
const smtpUrl = process.env.SMTP_URL;
const from = process.env.NOTIFICATION_FROM;
const operatorEmail = process.env.OPERATOR_EMAIL;
if (!databaseUrl || !smtpUrl || !from || !operatorEmail) {
  throw new Error("DATABASE_URL, SMTP_URL, NOTIFICATION_FROM and OPERATOR_EMAIL must be configured for notification delivery.");
}
const pool = new Pool({ connectionString: databaseUrl });
try {
  let count;
  do {
    count = await deliverBatch(pool, smtpUrl, from, operatorEmail);
  } while (count > 0);
} finally {
  await pool.end();
}
