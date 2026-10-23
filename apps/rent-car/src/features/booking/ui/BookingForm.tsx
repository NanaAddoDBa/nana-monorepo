import { useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { makeDefaultTrip, serializeTrip, validateTrip, type RentalTrip } from "@rental";

import type { Car } from "@/entities/car/model/cars";
import { customerFromUnknown, emptyCustomer, validCustomer, type CustomerDetails } from "@/features/booking/model/customer";
import { BookingSummary } from "@/features/booking/ui/BookingSummary";
import { TripFields } from "@/features/rental-search/ui/TripFields";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";

interface Props {
  car: Car;
  initialTrip: RentalTrip | null;
}

export function BookingForm({ car, initialTrip }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const [trip, setTrip] = useState<RentalTrip>(initialTrip || makeDefaultTrip());
  const initialContact = customerFromUnknown((location.state as { customer?: unknown } | null)?.customer);
  const [customer, setCustomer] = useState<CustomerDetails>(initialContact || emptyCustomer);
  const issues = validateTrip(trip);

  function set(field: keyof CustomerDetails, value: string | boolean) {
    setCustomer((current) => ({ ...current, [field]: value }));
  }

  function review(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (issues.length || !validCustomer(customer)) return;
    navigate("/review/" + car.id + "?" + serializeTrip(trip).toString(), {
      state: { customer },
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.25fr_.75fr]">
      <form onSubmit={review} className="rounded-[30px] border border-border bg-card p-6 sm:p-9">
        <p className="mb-2 text-xs font-bold uppercase tracking-[.18em] text-primary">Step 1 of 2</p>
        <h2 className="text-2xl font-semibold">Your trip and details</h2>
        <p className="mb-8 mt-2 text-sm leading-6 text-muted-foreground">
          Review your trip before preparing your enquiry. This does not reserve a vehicle.
        </p>
        <fieldset>
          <legend className="mb-5 text-sm font-bold uppercase tracking-widest text-primary">Trip details</legend>
          <TripFields value={trip} onChange={setTrip} idPrefix="book" />
          {issues.length > 0 && <p role="alert" className="mt-4 text-sm text-destructive">{issues[0]}</p>}
        </fieldset>

        <hr className="my-8 border-border" />
        <fieldset className="grid gap-5 sm:grid-cols-2">
          <legend className="mb-5 text-sm font-bold uppercase tracking-widest text-primary">Contact details</legend>
          <div>
            <Label htmlFor="book-name">Full name *</Label>
            <Input id="book-name" value={customer.name} autoComplete="name" minLength={2} maxLength={80}
              onChange={(event) => set("name", event.target.value)} required placeholder="Full name" />
          </div>
          <div>
            <Label htmlFor="book-email">Email address *</Label>
            <Input id="book-email" type="email" value={customer.email} autoComplete="email" maxLength={150}
              onChange={(event) => set("email", event.target.value)} required placeholder="you@example.com" />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="book-phone">Phone (optional)</Label>
            <Input id="book-phone" type="tel" value={customer.phone} autoComplete="tel" maxLength={40}
              onChange={(event) => set("phone", event.target.value)} placeholder="+49 ..." />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="book-message">Additional notes (optional)</Label>
            <textarea id="book-message" rows={4} maxLength={1000} value={customer.message}
              onChange={(event) => set("message", event.target.value)}
              className="w-full rounded-xl border border-input bg-background p-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
              placeholder="Any questions for the rental operator?" />
          </div>
        </fieldset>
        <label className="mt-7 flex cursor-pointer items-start gap-3 text-sm leading-6 text-muted-foreground">
          <input type="checkbox" checked={customer.consent} required className="mt-1 size-4 accent-primary"
            onChange={(event) => set("consent", event.target.checked)} />
          I understand that this is an enquiry, not a reservation. The rental operator must confirm availability and terms.
        </label>
        <Button type="submit" size="lg" className="mt-7 w-full"
          disabled={issues.length > 0 || !validCustomer(customer)}>
          Review enquiry <ArrowRight size={18} />
        </Button>
      </form>
      <BookingSummary car={car} trip={trip} />
    </div>
  );
}
