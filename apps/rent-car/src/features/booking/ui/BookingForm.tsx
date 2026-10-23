import { useState, type FormEvent } from "react";
import { ArrowRight, ClipboardCopy, Mail } from "lucide-react";

import type { Car } from "@/entities/car/model/cars";
import {
  bookingRequestText,
  mailtoBooking,
  type BookingRequest,
} from "@/features/booking/lib/request";
import {
  changePickupDate,
  initialTripDates,
  validateTrip,
} from "@/features/booking/lib/trip";
import { BookingSummary } from "@/features/booking/ui/BookingSummary";
import { site } from "@/shared/config/site";
import { dateOffset } from "@/shared/lib/dates";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Select } from "@/shared/ui/select";
import { Separator } from "@/shared/ui/separator";

interface BookingFormProps {
  car: Car;
  initialCity?: string;
  initialPickup?: string;
  initialReturn?: string;
}

export function BookingForm({
  car,
  initialCity,
  initialPickup,
  initialReturn,
}: BookingFormProps) {
  const [city, setCity] = useState(
    initialCity && car.locations.includes(initialCity)
      ? initialCity
      : car.locations[0],
  );
  const [dates, setDates] = useState(() =>
    initialTripDates(initialPickup, initialReturn),
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [requestDraft, setRequestDraft] = useState("");
  const [notice, setNotice] = useState("");
  const datesValid = validateTrip(dates);

  function buildRequest(): BookingRequest {
    return {
      carName: car.name,
      dailyRate: car.dailyRate,
      pickupCity: city,
      pickupDate: dates.pickupDate,
      returnDate: dates.returnDate,
      customerName: name.trim(),
      customerEmail: email.trim(),
      phone: phone.trim(),
      message: message.trim(),
    };
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!datesValid || !consent || !name.trim() || !email.trim()) return;

    const request = buildRequest();
    setRequestDraft(bookingRequestText(request));

    if (site.bookingEmail) {
      setNotice("Your email application will open with the request. Send the email to contact the operator.");
      window.location.href = mailtoBooking(site.bookingEmail, request);
    } else {
      setNotice("An operator email is not configured. You can copy the request, but it has not been sent.");
    }
  }

  async function copyRequest() {
    try {
      await navigator.clipboard.writeText(requestDraft);
      setNotice("Request copied. No email has been sent.");
    } catch {
      setNotice("Copy is not available in this browser. Select and copy the request text below.");
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.25fr_.75fr]">
      <form
        onSubmit={submit}
        className="rounded-[30px] border border-border bg-card p-6 sm:p-9"
      >
        <h2 className="text-2xl font-semibold">Your rental request</h2>
        <p className="mb-8 mt-2 text-sm leading-6 text-muted-foreground">
          Choose your dates and share your contact details. Availability and
          rental terms must be confirmed by the operator.
        </p>

        <fieldset className="mb-8 grid gap-5 sm:grid-cols-2">
          <legend className="mb-5 text-sm font-bold uppercase tracking-widest text-primary">
            01 / Your trip
          </legend>

          <div className="sm:col-span-2">
            <Label htmlFor="book-city">Pickup city</Label>
            <Select
              id="book-city"
              value={city}
              onChange={(event) => setCity(event.target.value)}
              required
            >
              {car.locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="book-pickup">Pickup date</Label>
            <Input
              id="book-pickup"
              type="date"
              min={dateOffset(0)}
              value={dates.pickupDate}
              onChange={(event) =>
                setDates((current) =>
                  changePickupDate(current, event.target.value),
                )
              }
              required
            />
          </div>

          <div>
            <Label htmlFor="book-return">Return date</Label>
            <Input
              id="book-return"
              type="date"
              min={dates.pickupDate || dateOffset(0)}
              value={dates.returnDate}
              onChange={(event) =>
                setDates((current) => ({
                  ...current,
                  returnDate: event.target.value,
                }))
              }
              required
            />
          </div>

          {!datesValid && (
            <p role="alert" className="text-sm text-destructive sm:col-span-2">
              Select a current or future pickup date and a return date after it.
            </p>
          )}
        </fieldset>

        <Separator className="my-8" />

        <fieldset className="grid gap-5 sm:grid-cols-2">
          <legend className="mb-5 text-sm font-bold uppercase tracking-widest text-primary">
            02 / Your details
          </legend>

          <div>
            <Label htmlFor="book-name">Full name *</Label>
            <Input
              id="book-name"
              value={name}
              minLength={2}
              maxLength={80}
              autoComplete="name"
              onChange={(event) => setName(event.target.value)}
              placeholder="Your name"
              required
            />
          </div>

          <div>
            <Label htmlFor="book-email">Email address *</Label>
            <Input
              id="book-email"
              type="email"
              value={email}
              maxLength={120}
              autoComplete="email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <Label htmlFor="book-phone">Phone (optional)</Label>
            <Input
              id="book-phone"
              type="tel"
              value={phone}
              maxLength={40}
              autoComplete="tel"
              onChange={(event) => setPhone(event.target.value)}
              placeholder="+49 ..."
            />
          </div>

          <div className="sm:col-span-2">
            <Label htmlFor="book-message">Additional details (optional)</Label>
            <textarea
              id="book-message"
              value={message}
              maxLength={300}
              rows={4}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Questions or special requirements"
              className="w-full rounded-xl border border-input bg-background p-4 text-sm outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
            />
          </div>
        </fieldset>

        <label className="mt-7 flex cursor-pointer items-start gap-3 text-sm leading-6 text-muted-foreground">
          <input
            type="checkbox"
            checked={consent}
            onChange={(event) => setConsent(event.target.checked)}
            className="mt-1 size-4 accent-primary"
            required
          />
          <span>
            I understand this is an availability request, not a confirmed
            reservation. No payment is collected by this website.
          </span>
        </label>

        <Button
          type="submit"
          size="lg"
          className="mt-7 w-full"
          disabled={!datesValid || !consent}
        >
          {site.bookingEmail ? <Mail size={18} /> : <ClipboardCopy size={18} />}
          {site.bookingEmail ? "Prepare email request" : "Prepare request"}
          <ArrowRight size={17} />
        </Button>

        {notice && (
          <p
            role="status"
            className="mt-4 rounded-xl bg-secondary p-4 text-sm text-secondary-foreground"
          >
            {notice}
          </p>
        )}

        {requestDraft && (
          <div className="mt-6">
            <Label htmlFor="request-draft">Your prepared request</Label>
            <textarea
              id="request-draft"
              value={requestDraft}
              readOnly
              rows={12}
              className="w-full rounded-xl border border-input bg-background p-4 font-mono text-xs leading-6"
            />
            <Button type="button" variant="outline" className="mt-3" onClick={copyRequest}>
              <ClipboardCopy size={16} /> Copy request
            </Button>
          </div>
        )}
      </form>

      <BookingSummary
        car={car}
        city={city}
        pickupDate={dates.pickupDate}
        returnDate={dates.returnDate}
        datesValid={datesValid}
      />
    </div>
  );
}
