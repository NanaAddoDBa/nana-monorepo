import { createHash, randomBytes, randomUUID } from "node:crypto";
import type { Pool, PoolClient } from "pg";
import type { RentalTrip } from "../../../../packages/rental-contracts/src/trip.ts";
import { priceVerifiedVehicle, validatedTimes } from "./pricing.ts";
import { BookingError } from "./types.ts";
import type { BookingCustomer, BookingReceipt, BookingRecord, CheckoutQuote, VerifiedVehicle } from "./types.ts";

export interface PaymentNotification {
  eventId: string;
  type: "paid" | "expired";
  bookingId: string;
  sessionId: string;
  amountTotal: number | null;
  currency: string | null;
  paymentIntentId: string | null;
}

export interface BookingStore {
  availability(trip: RentalTrip, now?: number): Promise<CheckoutQuote[]>;
  quote(vehicleId: string, trip: RentalTrip, now?: number): Promise<CheckoutQuote>;
  reserve(input: HoldInput, now?: number): Promise<{ kind: "created" | "replayed"; record: BookingRecord }>;
  attachSession(id: string, session: { id: string; url: string; expiresAt: number }): Promise<void>;
  abandonCreation(id: string): Promise<void>;
  getReceipt(sessionId: string): Promise<BookingReceipt | null>;
  applyPayment(event: PaymentNotification): Promise<void>;
}

export interface HoldInput {
  vehicleId: string;
  trip: RentalTrip;
  customer: BookingCustomer;
  acceptedTermsVersion: string;
  idempotencyKey: string;
  fingerprint: string;
}

export function bookingFingerprint(input: Omit<HoldInput, "idempotencyKey" | "fingerprint">) {
  return createHash("sha256").update(JSON.stringify(input)).digest("hex");
}

interface InventoryRow {
  vehicle_id: string; display_name: string; pickup_location_id: string;
  daily_price_cents: number; mandatory_fee_cents: number;
  security_deposit_cents: number; pickup_address: string; pickup_instructions: string;
  mileage_policy: string; fuel_policy: string; cancellation_policy: string;
  terms_version: string;
}
interface BookingRow {
  id: string; reference: string; idempotency_key: string; request_fingerprint: string;
  status: BookingRecord["status"]; vehicle_id: string; trip: RentalTrip;
  customer_name: string; customer_email: string; customer_phone: string;
  quote_snapshot: CheckoutQuote; pickup_snapshot: { instructions: string };
  stripe_session_id: string | null; stripe_session_url: string | null;
  session_expires_at: Date | string;
}

function verifiedVehicle(row: InventoryRow): VerifiedVehicle {
  return {
    vehicleId: row.vehicle_id, name: row.display_name,
    pickupLocationId: row.pickup_location_id, dailyPriceCents: row.daily_price_cents,
    mandatoryFeeCents: row.mandatory_fee_cents, depositCents: row.security_deposit_cents,
    pickupAddress: row.pickup_address, pickupInstructions: row.pickup_instructions,
    mileagePolicy: row.mileage_policy, fuelPolicy: row.fuel_policy,
    cancellationPolicy: row.cancellation_policy, termsVersion: row.terms_version,
  };
}
function booking(row: BookingRow): BookingRecord {
  return {
    id: row.id, reference: row.reference, idempotencyKey: row.idempotency_key,
    fingerprint: row.request_fingerprint, status: row.status,
    vehicleId: row.vehicle_id, trip: row.trip,
    customer: { name: row.customer_name, email: row.customer_email, phone: row.customer_phone },
    quote: row.quote_snapshot, pickupInstructions: row.pickup_snapshot.instructions,
    sessionId: row.stripe_session_id, sessionUrl: row.stripe_session_url,
    expiresAt: new Date(row.session_expires_at),
  };
}
function receipt(record: BookingRecord): BookingReceipt {
  const paid = ["confirmed", "picked_up", "completed"].includes(record.status);
  let status: BookingReceipt["status"] = "pending_payment";
  if (paid) status = record.status as "confirmed" | "picked_up" | "completed";
  else if (record.status === "expired" || record.status === "cancelled") status = "expired";
  else if (record.status === "refund_required") status = "refund_required";
  return {
    status, reference: record.reference, quote: record.quote,
    vehicleName: record.quote.vehicleName, trip: record.trip,
    ...(paid ? { pickup: {
      address: record.quote.pickupAddress, instructions: record.pickupInstructions,
      reference: record.reference,
      documents: [
        "Valid driving licence for each driver",
        "Accepted government-issued photo ID",
        "Card required for the separately disclosed security deposit",
      ],
    } } : {}),
  };
}
async function transaction<T>(pool: Pool, work: (client: PoolClient) => Promise<T>) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const value = await work(client);
    await client.query("COMMIT");
    return value;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export class PostgresBookingStore implements BookingStore {
  private readonly pool: Pool;
  constructor(pool: Pool) { this.pool = pool; }

  private async inventory(db: Pool | PoolClient, id: string, lock = false): Promise<VerifiedVehicle | null> {
    const result = await db.query<InventoryRow>(
      "SELECT * FROM verified_rental_vehicles WHERE vehicle_id=$1 AND active=TRUE " +
      "AND verified_at IS NOT NULL AND price_includes_tax=TRUE " +
      (lock ? "FOR UPDATE" : ""), [id],
    );
    return result.rows[0] ? verifiedVehicle(result.rows[0]) : null;
  }

  private async occupied(db: Pool | PoolClient, id: string, start: Date, end: Date) {
    const rows = await db.query(
      "SELECT 1 FROM paid_rental_reservations WHERE vehicle_id=$1 " +
      "AND status IN ('creating','pending_payment','confirmed','picked_up') " +
      "AND tstzrange(pickup_at,return_at,'[)') && tstzrange($2::timestamptz,$3::timestamptz,'[)') LIMIT 1",
      [id, start, end],
    );
    return (rows.rowCount || 0) > 0;
  }

  async availability(trip: RentalTrip, now = Date.now()): Promise<CheckoutQuote[]> {
    const { pickupAt, returnAt } = validatedTimes(trip, now);
    const inventory = await this.pool.query<InventoryRow>(
      "SELECT * FROM verified_rental_vehicles WHERE active=TRUE AND verified_at IS NOT NULL " +
      "AND price_includes_tax=TRUE AND pickup_location_id=$1 ORDER BY daily_price_cents,vehicle_id",
      [trip.pickupLocationId],
    );
    const available: CheckoutQuote[] = [];
    for (const row of inventory.rows) {
      if (!(await this.occupied(this.pool,row.vehicle_id,pickupAt,returnAt))) {
        available.push(priceVerifiedVehicle(verifiedVehicle(row),trip,now));
      }
    }
    return available;
  }

  async quote(vehicleId: string, trip: RentalTrip, now = Date.now()) {
    const { pickupAt, returnAt } = validatedTimes(trip,now);
    const car = await this.inventory(this.pool,vehicleId);
    if (!car) throw new BookingError(404,"Verified inventory is not available.");
    if (await this.occupied(this.pool,vehicleId,pickupAt,returnAt)) {
      throw new BookingError(409,"This vehicle is already reserved for the selected dates.");
    }
    return priceVerifiedVehicle(car,trip,now);
  }

  async reserve(input: HoldInput, now = Date.now()) {
    const { pickupAt, returnAt } = validatedTimes(input.trip,now);
    try {
      return await transaction(this.pool, async client => {
        const existing = await client.query<BookingRow>(
          "SELECT * FROM paid_rental_reservations WHERE idempotency_key=$1 FOR UPDATE",
          [input.idempotencyKey],
        );
        if (existing.rowCount) {
          const previous = booking(existing.rows[0]);
          if (previous.fingerprint !== input.fingerprint) {
            throw new BookingError(409,"Checkout details changed. Start a fresh checkout.");
          }
          if (previous.status === "pending_payment" && previous.sessionUrl) {
            return { kind: "replayed" as const, record: previous };
          }
          throw new BookingError(409,"This checkout is no longer active. Please try again.");
        }

        // Row locking plus a GiST exclusion constraint protect the same car.
        const car = await this.inventory(client,input.vehicleId,true);
        if (!car) throw new BookingError(404,"Verified inventory is not available.");
        if (input.acceptedTermsVersion !== car.termsVersion) {
          throw new BookingError(409,"Rental terms were updated. Please review them again.");
        }
        const quote = priceVerifiedVehicle(car,input.trip,now);
        await client.query(
          "UPDATE paid_rental_reservations SET status='expired' " +
          "WHERE vehicle_id=$1 AND status='creating' AND stripe_session_id IS NULL " +
          "AND session_expires_at<NOW()",[input.vehicleId],
        );
        if (await this.occupied(client,input.vehicleId,pickupAt,returnAt)) {
          throw new BookingError(409,"This car was just selected for the same dates.");
        }
        const id = randomUUID();
        const reference = "AV-" + new Date(now).getUTCFullYear() + "-" +
          randomBytes(7).toString("hex").toUpperCase();
        const expiresAt = new Date(now + 5*60_000);
        await client.query(
          "INSERT INTO paid_rental_reservations " +
          "(id,reference,vehicle_id,trip,pickup_at,return_at,customer_name,customer_email," +
          "customer_phone,total_amount_cents,security_deposit_cents,quote_snapshot," +
          "pickup_snapshot,terms_version,request_fingerprint,idempotency_key,status,session_expires_at) " +
          "VALUES ($1,$2,$3,$4::jsonb,$5,$6,$7,$8,$9,$10,$11,$12::jsonb,$13::jsonb,$14,$15,$16,'creating',$17)",
          [id,reference,input.vehicleId,JSON.stringify(input.trip),pickupAt,returnAt,
            input.customer.name,input.customer.email,input.customer.phone,
            quote.totalAmountCents,quote.depositCents,JSON.stringify(quote),
            JSON.stringify({instructions:car.pickupInstructions}),quote.termsVersion,
            input.fingerprint,input.idempotencyKey,expiresAt],
        );
        const record: BookingRecord = {
          id,reference,idempotencyKey:input.idempotencyKey,fingerprint:input.fingerprint,
          status:"creating",vehicleId:input.vehicleId,trip:input.trip,
          customer:input.customer,quote,pickupInstructions:car.pickupInstructions,
          sessionId:null,sessionUrl:null,expiresAt,
        };
        return { kind:"created" as const, record };
      });
    } catch(error) {
      if (error && typeof error==="object" && "code" in error && error.code==="23P01") {
        throw new BookingError(409,"This car is no longer available.");
      }
      throw error;
    }
  }

  async attachSession(id: string, session: {id:string;url:string;expiresAt:number}) {
    const result = await this.pool.query(
      "UPDATE paid_rental_reservations SET stripe_session_id=$2,stripe_session_url=$3," +
      "session_expires_at=to_timestamp($4),status='pending_payment' " +
      "WHERE id=$1 AND status='creating' RETURNING id",
      [id,session.id,session.url,session.expiresAt],
    );
    if (!result.rowCount) throw new Error("Could not attach the payment session.");
  }

  async abandonCreation(id: string) {
    await this.pool.query(
      "UPDATE paid_rental_reservations SET status='expired' " +
      "WHERE id=$1 AND status='creating' AND stripe_session_id IS NULL",[id],
    );
  }

  async getReceipt(sessionId: string): Promise<BookingReceipt | null> {
    const row = await this.pool.query<BookingRow>(
      "SELECT * FROM paid_rental_reservations WHERE stripe_session_id=$1",[sessionId],
    );
    return row.rows[0] ? receipt(booking(row.rows[0])) : null;
  }

  async applyPayment(event: PaymentNotification) {
    await transaction(this.pool, async client => {
      const seen = await client.query(
        "INSERT INTO rental_payment_events(stripe_event_id) VALUES($1) " +
        "ON CONFLICT DO NOTHING RETURNING stripe_event_id",[event.eventId],
      );
      if (!seen.rowCount) return;
      const result = await client.query<BookingRow>(
        "SELECT * FROM paid_rental_reservations " +
        "WHERE id=$1 AND stripe_session_id=$2 FOR UPDATE",[event.bookingId,event.sessionId],
      );
      if (!result.rowCount) throw new Error("Cannot reconcile the verified payment session.");
      const current = result.rows[0];
      if (event.type === "paid") {
        if (event.currency !== "eur" || event.amountTotal !== current.quote_snapshot.totalAmountCents) {
          await client.query(
            "UPDATE paid_rental_reservations SET status='refund_required' " +
            "WHERE id=$1 AND status='pending_payment'",[current.id],
          );
        } else if (current.status === "pending_payment") {
          await client.query(
            "UPDATE paid_rental_reservations SET status='confirmed',confirmed_at=NOW()," +
            "stripe_payment_intent_id=$2 WHERE id=$1",[current.id,event.paymentIntentId],
          );
          await client.query(
            "INSERT INTO rental_booking_notifications(reservation_id,recipient_kind) " +
            "VALUES($1,'customer'),($1,'operator') ON CONFLICT DO NOTHING",[current.id],
          );
        } else if (!["confirmed","picked_up","completed"].includes(current.status)) {
          await client.query(
            "UPDATE paid_rental_reservations SET status='refund_required' WHERE id=$1",[current.id],
          );
        }
      } else if (current.status === "pending_payment") {
        await client.query("UPDATE paid_rental_reservations SET status='expired' WHERE id=$1",[current.id]);
      }
      await client.query(
        "UPDATE rental_payment_events SET reservation_id=$2 WHERE stripe_event_id=$1",
        [event.eventId,current.id],
      );
    });
  }
}
