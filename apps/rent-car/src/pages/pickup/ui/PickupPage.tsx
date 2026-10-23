import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, CalendarCheck, CheckCircle2, Clock, MapPin, Printer, ShieldCheck } from "lucide-react";
import type { PaidBookingReceipt } from "@rental";

import { fetchPaidReceipt } from "@/features/checkout/lib/bookingsApi";
import { priceLabel, site } from "@/shared/config/site";
import { Button } from "@/shared/ui/button";

export function PickupPage() {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id") || "";
  const [booking, setBooking] = useState<PaidBookingReceipt | null>(null);
  const [loading, setLoading] = useState(Boolean(sessionId));
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!sessionId || !site.enquiryApiUrl) {
      setError("This pickup link is incomplete, or the booking service is not configured.");
      setLoading(false);
      return;
    }
    const controller = new AbortController();
    let next: ReturnType<typeof setTimeout> | undefined;
    setLoading(true);
    fetchPaidReceipt(sessionId,controller.signal).then(result => {
      if (controller.signal.aborted) return;
      setBooking(result);
      setLoading(false);
      setError("");
      if (result.status === "pending_payment" && attempt < 12) {
        next = setTimeout(() => setAttempt(i => i + 1),3000);
      }
    }).catch((err: unknown) => {
      if (controller.signal.aborted) return;
      setLoading(false);
      setError(err instanceof Error ? err.message : "Booking verification is unavailable.");
    });
    return () => {
      controller.abort();
      if (next) clearTimeout(next);
    };
  }, [sessionId,attempt]);

  const paid = booking && ["confirmed","picked_up","completed"].includes(booking.status) &&
    booking.pickup;
  const address = paid ? booking.pickup?.address : null;
  const directions = address
    ? "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(address)
    : "";

  return (
    <main className="page-container min-h-[65vh] py-12 md:py-20">
      <div className="mx-auto max-w-3xl">
        {loading && !booking ? (
          <div role="status" className="rounded-3xl border border-border bg-card p-10 text-center">
            <Clock size={36} className="mx-auto mb-5 text-primary"/>
            <h1 className="display-serif text-4xl">Verifying your booking…</h1>
            <p className="mt-4 text-muted-foreground">We are checking the payment status securely with the rental service.</p>
          </div>
        ) : paid ? (
          <section aria-label="Confirmed rental pickup pass" className="overflow-hidden rounded-3xl border border-border bg-card">
            <div className="bg-primary px-7 py-9 text-primary-foreground sm:px-10">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={32}/>
                <p className="text-sm font-semibold uppercase tracking-widest">Payment verified · Booking confirmed</p>
              </div>
              <h1 className="display-serif mt-4 text-5xl">Ready for pickup.</h1>
              <p className="mt-4 text-sm">Keep this reference and bring the required documents to collect your vehicle.</p>
            </div>
            <div className="space-y-8 p-6 sm:p-10">
              <div className="rounded-2xl bg-secondary p-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Your pickup reference</p>
                <p className="mt-3 break-all text-3xl font-bold">{booking.reference}</p>
                <p className="mt-2 text-sm text-muted-foreground">{booking.vehicleName} · {priceLabel(booking.quote.totalAmountCents/100)} rental payment</p>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <h2 className="flex items-center gap-2 font-semibold"><CalendarCheck size={19} className="text-primary"/> Pickup</h2>
                  <p className="mt-2">{booking.trip.pickupDate} at {booking.trip.pickupTime}</p>
                  <p className="mt-1 text-sm text-muted-foreground">Local branch time</p>
                </div>
                <div>
                  <h2 className="flex items-center gap-2 font-semibold"><Clock size={19} className="text-primary"/> Return</h2>
                  <p className="mt-2">{booking.trip.returnDate} at {booking.trip.returnTime}</p>
                  <p className="mt-1 text-sm text-muted-foreground">Local branch time</p>
                </div>
              </div>
              <div className="border-t border-border pt-6">
                <h2 className="flex items-center gap-2 text-xl font-semibold"><MapPin className="text-primary"/> Where to collect</h2>
                <p className="mt-3">{address}</p>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">{booking.pickup?.instructions}</p>
                <Button asChild className="mt-4" variant="outline">
                  <a href={directions} target="_blank" rel="noopener noreferrer">Get directions <ArrowRight size={16}/></a>
                </Button>
              </div>
              <div className="border-t border-border pt-6">
                <h2 className="flex items-center gap-2 text-xl font-semibold"><ShieldCheck className="text-primary"/> Bring to pickup</h2>
                <ul className="mt-3 space-y-2 text-sm leading-7 text-muted-foreground">
                  {booking.pickup?.documents.map(document => <li key={document}>• {document}</li>)}
                </ul>
                <p className="mt-4 text-sm">Separate deposit: {priceLabel(booking.quote.depositCents/100)} (if applicable, authorized at collection).</p>
              </div>
              <div className="flex flex-wrap gap-3 print:hidden">
                <Button onClick={() => window.print()} variant="outline"><Printer size={16}/> Print pickup pass</Button>
                <Button asChild><Link to="/fleet">Explore more cars <ArrowRight size={16}/></Link></Button>
              </div>
            </div>
          </section>
        ) : (
          <section className="rounded-3xl border border-border bg-card p-8 text-center sm:p-12">
            <Clock size={40} className="mx-auto mb-5 text-primary"/>
            <h1 className="display-serif text-5xl">
              {booking?.status === "pending_payment" ? "Payment is being verified." :
                booking?.status === "refund_required" ? "Please contact rental support." :
                booking?.status === "expired" ? "This checkout has expired." : "Booking confirmation unavailable"}
            </h1>
            <p className="mx-auto mt-5 max-w-xl leading-7 text-muted-foreground">
              {booking?.status === "pending_payment"
                ? "Your booking is not confirmed yet. Keep this page open or check again shortly. Do not pay a second time."
                : booking?.status === "refund_required"
                  ? "We could not safely confirm this payment. Keep your payment receipt and contact the operator for reconciliation."
                  : error || "We cannot confirm a paid reservation from this link. No pickup pass has been issued."}
            </p>
            {booking?.reference && <p className="mt-4 text-sm font-semibold">Reference: {booking.reference}</p>}
            {error && <p role="alert" className="mt-4 text-sm text-destructive">{error}</p>}
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Button variant="outline" onClick={() => setAttempt(i=>i+1)} disabled={loading}>
                {loading ? "Checking…" : "Check booking status"}
              </Button>
              <Button asChild><Link to="/contact">Contact the operator <ArrowRight size={16}/></Link></Button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
