import assert from "node:assert/strict";
import { randomBytes, randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { Pool } from "pg";
import { PostgresBookingStore, bookingFingerprint } from "../src/bookings/repository.ts";

const trip = {
  pickupLocationId:"munich",returnLocationId:"munich",
  pickupDate:"2030-11-04",pickupTime:"10:00",
  returnDate:"2030-11-07",returnTime:"10:00",
};
const now = Date.UTC(2030,10,1);
const customer = {name:"Database Test Driver",email:"database-driver@example.com",phone:""};

test("verified inventory is exclusive; paid webhook creates pickup pass exactly once",{
  skip:!process.env.TEST_DATABASE_URL,
},async()=>{
  const pool=new Pool({connectionString:process.env.TEST_DATABASE_URL});
  const carId="test-car-"+randomUUID();
  try{
    for(const migration of ["001_enquiries.sql","002_paid_bookings.sql"]){
      const sql=await readFile(new URL("../src/db/migrations/"+migration,import.meta.url),"utf8");
      await pool.query(sql);
    }
    await pool.query(
      "INSERT INTO verified_rental_vehicles " +
      "(vehicle_id,display_name,pickup_location_id,daily_price_cents,mandatory_fee_cents," +
      "security_deposit_cents,price_includes_tax,pickup_address,pickup_instructions," +
      "mileage_policy,fuel_policy,cancellation_policy,terms_version,active,verified_at) " +
      "VALUES($1,$2,'munich',10500,1500,20000,TRUE,$3,$4,$5,$6,$7,$8,TRUE,NOW())",
      [carId,"Test verified vehicle","Test branch road 11, Munich",
       "Show driver's licence at the rental desk",
       "500 km included","Same-to-same fuel","Free cancellation within policy","test-terms-v1"],
    );
    const store=new PostgresBookingStore(pool);
    const quotes=await store.availability(trip,now);
    assert.equal(quotes.length,1);
    assert.equal(quotes[0].totalAmountCents,33000);
    assert.equal(quotes[0].depositCents,20000);
    const details={
      vehicleId:carId,trip,customer,acceptedTermsVersion:"test-terms-v1",
    };
    const input={
      ...details,idempotencyKey:randomUUID(),fingerprint:bookingFingerprint(details),
    };
    const created=await store.reserve(input,now);
    assert.equal(created.kind,"created");
    assert.equal((await store.availability(trip,now)).length,0);

    await assert.rejects(
      store.reserve({...input,idempotencyKey:randomUUID()},now),
      error=>error.statusCode===409,
    );
    const sessionId="cs_test_"+randomBytes(22).toString("hex");
    await store.attachSession(created.record.id,{
      id:sessionId,url:"https://checkout.stripe.com/pay/test-session",
      expiresAt:Math.floor(Date.now()/1000)+2000,
    });
    const replay=await store.reserve(input,now);
    assert.equal(replay.kind,"replayed");
    assert.equal(replay.record.sessionId,sessionId);
    const pending=await store.getReceipt(sessionId);
    assert.equal(pending.status,"pending_payment");
    assert.equal(pending.pickup,undefined);

    const payment={
      eventId:"evt_test_"+randomUUID(),type:"paid",bookingId:created.record.id,
      sessionId,amountTotal:33000,currency:"eur",paymentIntentId:"pi_test_sample",
    };
    await store.applyPayment(payment);
    await store.applyPayment(payment);
    const confirmed=await store.getReceipt(sessionId);
    assert.equal(confirmed.status,"confirmed");
    assert.equal(confirmed.pickup.address,"Test branch road 11, Munich");
    assert.equal(confirmed.pickup.documents.length,3);
    const notifications=await pool.query(
      "SELECT count(*)::integer AS count FROM rental_booking_notifications WHERE reservation_id=$1",
      [created.record.id],
    );
    assert.equal(notifications.rows[0].count,2);
    await store.applyPayment({...payment,eventId:"evt_test_"+randomUUID(),type:"expired"});
    assert.equal((await store.getReceipt(sessionId)).status,"confirmed");
  }finally{
    await pool.query(
      "DELETE FROM rental_payment_events WHERE reservation_id IN " +
      "(SELECT id FROM paid_rental_reservations WHERE vehicle_id=$1)",[carId],
    ).catch(()=>{});
    await pool.query("DELETE FROM paid_rental_reservations WHERE vehicle_id=$1",[carId]).catch(()=>{});
    await pool.query("DELETE FROM verified_rental_vehicles WHERE vehicle_id=$1",[carId]).catch(()=>{});
    await pool.end();
  }
});
