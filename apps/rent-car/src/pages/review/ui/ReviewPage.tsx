import { useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, ClipboardCopy, Mail } from "lucide-react";
import { locationById, quoteForVehicle, tripFromParams, validateTrip } from "@rental";

import { findCar } from "@/entities/car/model/cars";
import { submitEnquiry } from "@/features/booking/lib/api";
import { bookingRequestText, mailtoBooking } from "@/features/booking/lib/request";
import { customerFromUnknown } from "@/features/booking/model/customer";
import { BookingSummary } from "@/features/booking/ui/BookingSummary";
import { NotFoundPage } from "@/pages/not-found/ui/NotFoundPage";
import { site } from "@/shared/config/site";
import { Button } from "@/shared/ui/button";
import { TripSummary } from "@/widgets/trip-summary/ui/TripSummary";

export function ReviewPage() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const attempt = useRef<{ fingerprint: string; key: string } | null>(null);

  const car = findCar(id);
  if (!car) return <NotFoundPage />;
  const trip = tripFromParams(params);
  const customer = customerFromUnknown((location.state as { customer?: unknown } | null)?.customer);
  const returnUrl = "/book/" + car.id + (params.toString() ? "?" + params.toString() : "");
  const quote = (() => {
    try { return trip ? quoteForVehicle(car.id, trip) : null; } catch { return null; }
  })();

  if (!customer || !trip || validateTrip(trip).length > 0 || !quote) {
    return (
      <main className="page-container min-h-[65vh] py-20">
        <h1 className="display-serif text-5xl">Finish your enquiry details</h1>
        <p className="my-6 max-w-xl text-muted-foreground">This review needs a valid trip and contact details. For privacy, we do not put your personal details into the URL.</p>
        <Button asChild><Link to={returnUrl}>Return to enquiry form <ArrowRight size={17} /></Link></Button>
      </main>
    );
  }

  const selectedVehicleId = car.id;
  const selectedVehicleName = car.name;
  const requestText = bookingRequestText({
    carName: car.name, dailyRate: car.dailyRate,
    pickupCity: locationById(trip.pickupLocationId)?.name || trip.pickupLocationId,
    returnCity: locationById(trip.returnLocationId)?.name || trip.returnLocationId,
    pickupDate: trip.pickupDate, pickupTime: trip.pickupTime,
    returnDate: trip.returnDate, returnTime: trip.returnTime,
    customerName: customer.name, customerEmail: customer.email, phone: customer.phone, message: customer.message,
  });

  async function submit() {
    if (!trip || !customer || sending || !quote) return;
    const fingerprint = JSON.stringify({ id: selectedVehicleId, trip, customer });
    if (!attempt.current || attempt.current.fingerprint !== fingerprint) {
      attempt.current = { fingerprint, key: crypto.randomUUID() };
    }
    setSending(true);
    setError("");
    try {
      const receipt = await submitEnquiry(selectedVehicleId, trip, customer, attempt.current.key);
      navigate("/confirmation", {
        replace: true,
        state: { receipt, vehicleName: selectedVehicleName, trip },
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "The enquiry could not be submitted. Please retry.");
    } finally {
      setSending(false);
    }
  }

  async function copyDraft() {
    try {
      await navigator.clipboard.writeText(requestText);
      setNotice("Request copied. It has not been sent.");
    } catch {
      setNotice("Clipboard access is unavailable. Select and copy the draft below.");
    }
  }

  return (
    <main className="page-container py-12 md:py-18">
      <Link to={returnUrl} state={{ customer }} className="mb-8 inline-flex items-center gap-2 text-sm text-primary">
        <ArrowLeft size={17} /> Edit your enquiry
      </Link>
      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-primary">Step 2 of 2</p>
      <h1 className="display-serif text-5xl md:text-6xl">Review your enquiry.</h1>
      <p className="my-7 max-w-2xl leading-7 text-muted-foreground">
        Check the trip and contact information before submitting. This is a request for availability, not a confirmed booking.
      </p>
      <div className="mb-8"><TripSummary trip={trip} editHref={returnUrl} editState={{ customer }} /></div>
      <div className="grid gap-8 lg:grid-cols-[1.25fr_.75fr]">
        <section className="rounded-3xl border border-border bg-card p-6 md:p-9" aria-label="Review customer information">
          <h2 className="text-2xl font-semibold">Contact and delivery</h2>
          <dl className="mt-5 space-y-4 text-sm">
            <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Name</dt><dd>{customer.name}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Email</dt><dd>{customer.email}</dd></div>
            {customer.phone && <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Phone</dt><dd>{customer.phone}</dd></div>}
            {customer.message && <div><dt className="mb-1 text-muted-foreground">Notes</dt><dd className="whitespace-pre-wrap">{customer.message}</dd></div>}
          </dl>
          <div className="mt-7 rounded-2xl bg-muted p-4 text-sm leading-6">
            The base estimate excludes additional charges. An operator must confirm availability, final pricing and rental conditions.
            {quote.requiresManualReview && <p className="mt-2 font-semibold">One-way return requires manual review; extra fees are not included.</p>}
          </div>
          {site.useEnquiryApi ? (
            <Button className="mt-7 w-full" disabled={sending} onClick={submit}>
              {sending ? "Submitting..." : "Submit rental enquiry"} <ArrowRight size={18} />
            </Button>
          ) : (
            <div className="mt-7 space-y-3">
              <p className="text-sm text-muted-foreground">Online submissions are not yet enabled. You can prepare an email request without a reservation reference.</p>
              {site.bookingEmail && (
                <Button className="w-full" onClick={() => {
                  const url = mailtoBooking(site.bookingEmail, {
                    carName: car.name, dailyRate: car.dailyRate,
                    pickupCity: locationById(trip.pickupLocationId)?.name || trip.pickupLocationId,
                    returnCity: locationById(trip.returnLocationId)?.name || trip.returnLocationId,
                    pickupDate: trip.pickupDate, pickupTime: trip.pickupTime,
                    returnDate: trip.returnDate, returnTime: trip.returnTime,
                    customerName: customer.name, customerEmail: customer.email, phone: customer.phone, message: customer.message,
                  });
                  window.location.href = url;
                  setNotice("Your email app should open. Send the email yourself to contact the operator.");
                }}>
                  <Mail size={18} /> Open email application
                </Button>
              )}
              <Button variant="outline" className="w-full" onClick={copyDraft}>
                <ClipboardCopy size={18} /> Copy enquiry
              </Button>
              <textarea aria-label="Copyable enquiry" readOnly value={requestText} rows={8}
                className="w-full rounded-xl border border-input bg-background p-3 text-xs" />
            </div>
          )}
          {notice && <p role="status" className="mt-4 text-sm text-primary">{notice}</p>}
          {error && <p role="alert" className="mt-4 rounded-xl bg-muted p-4 text-sm text-destructive">{error}</p>}
        </section>
        <BookingSummary car={car} trip={trip} />
      </div>
    </main>
  );
}
