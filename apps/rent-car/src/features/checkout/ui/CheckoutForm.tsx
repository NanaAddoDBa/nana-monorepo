import { useEffect, useRef, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ClipboardCopy, CreditCard, Mail, ShieldCheck } from "lucide-react";
import {
  locationById, locationIdForName, makeDefaultTrip, quoteForVehicle,
  validateTrip, type CheckoutQuote, type RentalTrip,
} from "@rental";

import type { Car } from "@/entities/car/model/cars";
import { beginSecureCheckout, fetchCheckoutQuote } from "@/features/checkout/lib/bookingsApi";
import { CheckoutSummary } from "@/features/checkout/ui/CheckoutSummary";
import { submitEnquiry } from "@/features/booking/lib/api";
import { bookingRequestText, mailtoBooking, type BookingRequest } from "@/features/booking/lib/request";
import { emptyCustomer, validCustomer, type CustomerDetails } from "@/features/booking/model/customer";
import { TripFields } from "@/features/rental-search/ui/TripFields";
import { site } from "@/shared/config/site";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { TripSummary } from "@/widgets/trip-summary/ui/TripSummary";
import { Link } from "react-router-dom";

export function CheckoutForm({ car, initialTrip, cancelled = false }: {
  car: Car; initialTrip: RentalTrip | null; cancelled?: boolean;
}) {
  const navigate = useNavigate();
  const [trip, setTrip] = useState<RentalTrip>(initialTrip || makeDefaultTrip());
  const [editTrip, setEditTrip] = useState(!initialTrip);
  const [customer, setCustomer] = useState<CustomerDetails>(emptyCustomer);
  const [quote, setQuote] = useState<CheckoutQuote | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(site.usePaidBookings);
  const [quoteError, setQuoteError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [draft, setDraft] = useState("");
  const [retryQuote, setRetryQuote] = useState(0);
  const attempt = useRef<{ fingerprint: string; key: string } | null>(null);
  const issues = validateTrip(trip);

  let estimate = null;
  try { estimate = quoteForVehicle(car.id,trip); } catch (problem) {
    if (!site.usePaidBookings && issues.length === 0) {
      issues.push(problem instanceof Error ? problem.message : "Choose a supported trip.");
    }
  }
  const tripKey = JSON.stringify(trip);

  useEffect(() => {
    if (!site.usePaidBookings) return;
    const abort = new AbortController();
    if (validateTrip(trip).length) {
      setQuote(null);
      setQuoteLoading(false);
      return;
    }
    setQuote(null);
    setQuoteLoading(true);
    setQuoteError("");
    fetchCheckoutQuote(car.id,trip,abort.signal).then((result) => {
      if (!abort.signal.aborted) {
        setQuote(result);
        setQuoteLoading(false);
      }
    }).catch((err: unknown) => {
      if (!abort.signal.aborted) {
        setQuoteLoading(false);
        setQuoteError(err instanceof Error ? err.message : "A verified price could not be loaded.");
      }
    });
    return () => abort.abort();
  // tripKey is the stable representation of trip values for fetches.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [car.id,tripKey,retryQuote]);

  function updateCustomer(field: keyof CustomerDetails, value: string | boolean) {
    setCustomer(current => ({...current,[field]:value}));
    setError("");
  }

  function buildDraft(): BookingRequest {
    return {
      carName: car.name, dailyRate: car.dailyRate,
      pickupCity: locationById(trip.pickupLocationId)?.name || trip.pickupLocationId,
      returnCity: locationById(trip.returnLocationId)?.name || trip.returnLocationId,
      pickupDate: trip.pickupDate, pickupTime: trip.pickupTime,
      returnDate: trip.returnDate, returnTime: trip.returnTime,
      billableDays: estimate?.billableDays, baseAmountCents: estimate?.baseAmountCents,
      customerName: customer.name.trim(), customerEmail: customer.email.trim(),
      phone: customer.phone.trim(), message: customer.message.trim(),
    };
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (issues.length || !validCustomer(customer) || submitting) return;
    const fingerprint = JSON.stringify([car.id,trip,customer]);
    if (!attempt.current || attempt.current.fingerprint !== fingerprint) {
      attempt.current = { fingerprint, key: crypto.randomUUID() };
    }
    setSubmitting(true);
    setError("");
    try {
      if (site.usePaidBookings) {
        if (!quote) throw new Error("Wait for the final verified price before paying.");
        const url = await beginSecureCheckout(
          car.id,trip,customer,quote.termsVersion,attempt.current.key,
        );
        window.location.assign(url);
        return;
      }
      if (site.useEnquiryApi) {
        const receipt = await submitEnquiry(car.id,trip,customer,attempt.current.key);
        navigate("/confirmation",{replace:true,state:{receipt,vehicleName:car.name,trip}});
        return;
      }
      setDraft(bookingRequestText(buildDraft()));
      setNotice("Your request is ready to copy or send. It has not been submitted.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to continue. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function copyDraft() {
    try { await navigator.clipboard.writeText(draft); setNotice("Request copied. It has not been sent."); }
    catch { setNotice("Select and copy the request text manually."); }
  }

  const buttonLabel = site.usePaidBookings
    ? quote ? "Pay securely " + new Intl.NumberFormat("en-DE",{style:"currency",currency:"EUR"}).format(quote.totalAmountCents/100) : "Checking final price…"
    : site.useEnquiryApi ? "Send rental enquiry" : "Prepare enquiry";
  const disabled = issues.length > 0 || !validCustomer(customer) ||
    submitting || (site.usePaidBookings && (!quote || quoteLoading));

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(300px,.75fr)]">
      <form onSubmit={submit} className="rounded-3xl border border-border bg-card p-5 sm:p-8">
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">Guest checkout · No account required</p>
          <h2 className="mt-2 text-2xl font-semibold">One quick step</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Check your trip, enter your details and {site.usePaidBookings ?
              "continue to secure payment." : "prepare your rental enquiry."}
          </p>
        </div>

        {cancelled && <p role="status" className="mb-5 rounded-xl bg-muted p-4 text-sm">
          Payment was not completed. You have not received a confirmed booking.
        </p>}

        <div className="mb-5 flex items-center justify-between gap-3">
          <h3 className="font-semibold">Trip details</h3>
          <Button variant="outline" size="sm" type="button"
            onClick={() => setEditTrip(x => !x)} aria-expanded={editTrip}
            aria-controls="checkout-trip-editor">
            {editTrip ? "Done editing" : "Edit trip"}
          </Button>
        </div>
        <TripSummary trip={trip} />
        {editTrip && (
          <div id="checkout-trip-editor" className="mt-4 rounded-xl border border-border p-4">
            <TripFields idPrefix="checkout" value={trip} onChange={setTrip}
              allowedPickupLocations={car.locations.map(locationIdForName).filter((id):id is string => !!id)} />
          </div>
        )}
        {issues.length > 0 && <p className="mt-3 text-sm text-destructive" role="alert">{issues[0]}</p>}
        {site.usePaidBookings && quoteError && (
          <div role="alert" className="mt-4 rounded-xl bg-muted p-4 text-sm">
            <p>{quoteError}</p>
            <Button size="sm" type="button" variant="outline" className="mt-3"
              onClick={() => setRetryQuote(x=>x+1)}>Retry availability check</Button>
          </div>
        )}

        <hr className="my-7 border-border"/>
        <fieldset className="grid gap-4 sm:grid-cols-2">
          <legend className="mb-4 text-base font-semibold">Driver contact details</legend>
          <div>
            <Label htmlFor="checkout-name">Full name *</Label>
            <Input id="checkout-name" autoComplete="name" value={customer.name}
              required minLength={2} maxLength={80} placeholder="Name on your licence"
              onChange={(e)=>updateCustomer("name",e.target.value)}/>
          </div>
          <div>
            <Label htmlFor="checkout-email">Email address *</Label>
            <Input id="checkout-email" autoComplete="email" type="email"
              value={customer.email} required maxLength={150} placeholder="you@example.com"
              onChange={(e)=>updateCustomer("email",e.target.value)}/>
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="checkout-phone">Phone (optional)</Label>
            <Input id="checkout-phone" type="tel" autoComplete="tel"
              value={customer.phone} maxLength={40} placeholder="+49 ..."
              onChange={(e)=>updateCustomer("phone",e.target.value)}/>
          </div>
          {!site.usePaidBookings && <div className="sm:col-span-2">
            <Label htmlFor="checkout-note">Notes (optional)</Label>
            <textarea id="checkout-note" rows={3} value={customer.message} maxLength={1000}
              onChange={(e)=>updateCustomer("message",e.target.value)}
              className="w-full rounded-xl border border-input bg-background p-3 text-sm"
              placeholder="Anything the rental operator should know?"/>
          </div>}
        </fieldset>

        {site.usePaidBookings && quote && (
          <div className="mt-6 rounded-xl bg-muted p-4 text-sm">
            <h3 className="font-semibold">Before you pay</h3>
            <p className="mt-2">The final rental price includes required taxes and mandatory fees.
              A separate deposit of <strong>{(quote.depositCents/100).toLocaleString("en-DE",{style:"currency",currency:"EUR"})}</strong> may be authorized at collection.</p>
            <p className="mt-2"><strong>Cancellation:</strong> {quote.cancellationPolicy}</p>
          </div>
        )}
        <label className="mt-6 flex cursor-pointer items-start gap-3 text-sm leading-6 text-muted-foreground">
          <input type="checkbox" required checked={customer.consent}
            onChange={e=>updateCustomer("consent",e.target.checked)}
            className="mt-1 size-4 shrink-0 accent-primary"/>
          <span>{site.usePaidBookings
            ? <>I accept the <Link to="/terms" target="_blank" rel="noopener noreferrer"
              className="font-medium text-primary underline">rental terms</Link>, cancellation policy and the disclosed price and deposit conditions.</>
            : "I understand this is an enquiry, not a confirmed reservation. Any rental price and availability require confirmation."}</span>
        </label>
        <Button type="submit" className="mt-6 w-full" size="lg" disabled={disabled}>
          {site.usePaidBookings ? <CreditCard size={18}/> : <ArrowRight size={18}/>}
          {submitting ? "Processing…" : buttonLabel}
        </Button>
        <p className="mt-3 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck size={15}/>
          {site.usePaidBookings ? "Payment details are entered securely with Stripe. No card data is stored here." :
            "No payment is collected in enquiry mode."}
        </p>
        {error && <p role="alert" className="mt-4 rounded-xl bg-muted p-4 text-sm text-destructive">{error}</p>}
        {notice && <p role="status" className="mt-4 text-sm text-primary">{notice}</p>}
        {draft && !site.usePaidBookings && !site.useEnquiryApi && (
          <div className="mt-5 rounded-xl border border-border p-4">
            <h3 className="font-semibold">Prepared request — not sent</h3>
            <textarea readOnly aria-label="Prepared rental enquiry" value={draft} rows={9}
              className="mt-3 w-full rounded-lg border border-input bg-background p-3 text-xs"/>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button type="button" size="sm" variant="outline" onClick={copyDraft}>
                <ClipboardCopy size={16}/> Copy request
              </Button>
              {site.bookingEmail && <Button type="button" size="sm" onClick={()=>{
                window.location.href = mailtoBooking(site.bookingEmail,buildDraft());
                setNotice("Send the message in your email app. A booking is not confirmed.");
              }}><Mail size={16}/> Open email application</Button>}
            </div>
          </div>
        )}
      </form>
      <CheckoutSummary car={car} trip={trip} verified={quote}/>
    </div>
  );
}
