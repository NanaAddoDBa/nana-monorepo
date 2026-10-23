import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import test from "node:test";
import { StripePaymentGateway } from "../src/bookings/gateway.ts";

const gateway=new StripePaymentGateway("sk_test_for_signature_unit_test","whsec_test_secret");
function signed(type,paymentStatus="paid",amount=33000){
  const raw=Buffer.from(JSON.stringify({
    id:"evt_test_1234567",object:"event",type,livemode:false,
    data:{object:{
      id:"cs_test_ABC123456789",object:"checkout.session",
      mode:"payment",client_reference_id:"7c12bfa2-19ad-4899-a2d5-2a36132d436f",
      payment_status:paymentStatus,amount_total:amount,currency:"eur",
      payment_intent:"pi_test_example",
      metadata:{aventra_reservation_id:"7c12bfa2-19ad-4899-a2d5-2a36132d436f"},
    }},
  }));
  const timestamp=Math.floor(Date.now()/1000);
  const digest=createHmac("sha256","whsec_test_secret")
    .update(timestamp+"."+raw.toString("utf8")).digest("hex");
  return {raw,signature:"t="+timestamp+",v1="+digest};
}

test("only a valid Stripe signature produces a verified payment event",()=>{
  const {raw,signature}=signed("checkout.session.completed");
  const event=gateway.verifyEvent(raw,signature);
  assert.equal(event.type,"paid");
  assert.equal(event.currency,"eur");
  assert.equal(event.amountTotal,33000);
  assert.equal(event.paymentIntentId,"pi_test_example");
  assert.throws(()=>gateway.verifyEvent(raw,"t=123,v1=bad"));
});

test("incomplete payments never produce a paid confirmation",()=>{
  const pending=signed("checkout.session.completed","unpaid");
  assert.equal(gateway.verifyEvent(pending.raw,pending.signature),null);
  const expired=signed("checkout.session.expired","unpaid");
  assert.equal(gateway.verifyEvent(expired.raw,expired.signature).type,"expired");
  const irrelevant=signed("customer.created");
  assert.equal(gateway.verifyEvent(irrelevant.raw,irrelevant.signature),null);
});
