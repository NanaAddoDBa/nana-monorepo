import { useState, type FormEvent } from "react";
import { ArrowRight, ClipboardCopy, Mail, ShieldCheck } from "lucide-react";
import type { Car } from "@/entities/car/model/cars";
import { bookingRequestText, mailtoBooking, type BookingRequest } from "@/features/booking/lib/request";
import { dateOffset, estimatedBaseTotal, rentalDays } from "@/shared/lib/dates";
import { site, priceLabel } from "@/shared/config/site";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Select } from "@/shared/ui/select";
import { Separator } from "@/shared/ui/separator";

export function BookingForm({ car, initialCity, initialPickup, initialReturn }: {
  car: Car; initialCity?: string; initialPickup?: string; initialReturn?: string;
}) {
  const [city, setCity] = useState(initialCity && car.locations.includes(initialCity) ? initialCity : car.locations[0]);
  const [pickupDate, setPickupDate] = useState(initialPickup && initialPickup >= dateOffset(0) ? initialPickup : dateOffset(1));
  const [returnDate, setReturnDate] = useState(initialReturn && initialReturn > (initialPickup || "") ? initialReturn : dateOffset(4));
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [draft, setDraft] = useState("");
  const [notice, setNotice] = useState("");
  const days = rentalDays(pickupDate, returnDate);
  const validDates = days > 0 && pickupDate >= dateOffset(0);
  const estimate = estimatedBaseTotal(car.dailyRate, pickupDate, returnDate);

  function collect(): BookingRequest {
    return { carName: car.name, dailyRate: car.dailyRate, pickupCity: city, pickupDate, returnDate, customerName: name.trim(), customerEmail: email.trim(), phone: phone.trim(), message: message.trim() };
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validDates || !confirmed || !name.trim() || !email.trim()) return;
    const details = collect();
    const text = bookingRequestText(details);
    setDraft(text);
    if (site.bookingEmail) {
      setNotice("Your email application should open with a prepared request. Send the email to complete the request.");
      window.location.href = mailtoBooking(site.bookingEmail, details);
    } else {
      setNotice("No operator email has been configured. Copy the request below; it has not been sent.");
    }
  }
  async function copy() {
    try { await navigator.clipboard.writeText(draft); setNotice("Request copied. No message has been sent."); }
    catch { setNotice("Copy unavailable in this browser. Select the request text below manually."); }
  }

  return <div className="grid gap-8 lg:grid-cols-[1.25fr_.75fr]">
    <form onSubmit={submit} className="rounded-[30px] border border-border bg-card p-6 sm:p-9">
      <h2 className="text-2xl font-semibold">Your rental request</h2><p className="mb-8 mt-2 text-sm leading-6 text-muted-foreground">Tell us when and where. The operator will need to confirm vehicle availability, the price, and the terms.</p>
      <fieldset className="mb-8 grid gap-5 sm:grid-cols-2"><legend className="mb-5 text-sm font-bold uppercase tracking-widest text-primary">01 / Your trip</legend>
        <div className="sm:col-span-2"><Label htmlFor="book-city">Pickup city</Label><Select id="book-city" value={city} onChange={(event) => setCity(event.target.value)} required>{car.locations.map((location) => <option key={location}>{location}</option>)}</Select></div>
        <div><Label htmlFor="book-pickup">Pickup date</Label><Input id="book-pickup" type="date" min={dateOffset(0)} value={pickupDate} onChange={(event) => setPickupDate(event.target.value)} required /></div>
        <div><Label htmlFor="book-return">Return date</Label><Input id="book-return" type="date" min={pickupDate || dateOffset(0)} value={returnDate} onChange={(event) => setReturnDate(event.target.value)} required /></div>
        {!validDates && <p role="alert" className="text-sm text-destructive sm:col-span-2">Select a current or future pickup date and a return date after it.</p>}
      </fieldset>
      <Separator className="my-8" />
      <fieldset className="grid gap-5 sm:grid-cols-2"><legend className="mb-5 text-sm font-bold uppercase tracking-widest text-primary">02 / Your details</legend>
        <div><Label htmlFor="book-name">Full name *</Label><Input id="book-name" value={name} minLength={2} maxLength={80} autoComplete="name" onChange={(event) => setName(event.target.value)} placeholder="Your name" required /></div>
        <div><Label htmlFor="book-email">Email address *</Label><Input id="book-email" value={email} type="email" maxLength={120} autoComplete="email" onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required /></div>
        <div className="sm:col-span-2"><Label htmlFor="book-phone">Phone (optional)</Label><Input id="book-phone" value={phone} type="tel" maxLength={40} autoComplete="tel" onChange={(event) => setPhone(event.target.value)} placeholder="+49 ..." /></div>
        <div className="sm:col-span-2"><Label htmlFor="book-message">Additional details (optional)</Label><textarea id="book-message" value={message} maxLength={300} rows={4} onChange={(event) => setMessage(event.target.value)} placeholder="Questions or special requirements" className="w-full rounded-xl border border-input bg-background p-4 text-sm outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20" /></div>
      </fieldset>
      <label className="mt-7 flex cursor-pointer items-start gap-3 text-sm leading-6 text-muted-foreground"><input type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} className="mt-1 size-4 accent-primary" required /><span>I understand that this is an availability request, not a guaranteed reservation. No payment is collected by this site.</span></label>
      <Button type="submit" size="lg" className="mt-7 w-full" disabled={!validDates || !confirmed}>{site.bookingEmail ? <Mail size={18} /> : <ClipboardCopy size={18} />}{site.bookingEmail ? "Prepare email request" : "Prepare a copyable request"} <ArrowRight size={17} /></Button>
      {notice && <p role="status" className="mt-4 rounded-xl bg-secondary p-4 text-sm text-secondary-foreground">{notice}</p>}
      {draft && <div className="mt-6"><Label htmlFor="request-draft">Your prepared request</Label><textarea id="request-draft" readOnly value={draft} rows={12} className="w-full rounded-xl border border-input bg-background p-4 font-mono text-xs leading-6" /><Button type="button" variant="outline" className="mt-3" onClick={copy}><ClipboardCopy size={16} /> Copy request</Button></div>}
    </form>
    <aside className="lg:sticky lg:top-7 lg:self-start">
      <div className="overflow-hidden rounded-[30px] border border-border bg-card"><img src={car.image} alt={"Representative photograph for " + car.name} className="h-55 w-full object-cover" /><div className="p-7"><p className="mb-1 text-xs uppercase tracking-widest text-primary">Your selection</p><h2 className="text-2xl font-semibold">{car.name}</h2><p className="mt-1 text-sm text-muted-foreground">{car.category} · {car.transmission}</p><Separator className="my-6" /><div className="space-y-3 text-sm"><div className="flex justify-between gap-3"><span className="text-muted-foreground">Daily rate</span><span>{priceLabel(car.dailyRate)}</span></div><div className="flex justify-between gap-3"><span className="text-muted-foreground">Rental days</span><span>{days || "—"}</span></div><div className="flex justify-between gap-3"><span className="text-muted-foreground">Pickup location</span><span>{city}</span></div></div><Separator className="my-6" /><div className="flex items-end justify-between"><span className="text-sm font-semibold">Estimated base total</span><span className="text-3xl font-bold">{validDates ? priceLabel(estimate) : "—"}</span></div><p className="mt-3 text-xs leading-6 text-muted-foreground">Sample calculation only. Taxes, deposits, insurance, mileage and surcharges are not included. Final amount requires operator confirmation.</p></div></div>
      <p className="mt-5 flex gap-3 px-2 text-sm leading-6 text-muted-foreground"><ShieldCheck size={20} className="mt-0.5 shrink-0 text-primary" /> Your details stay in your browser unless you choose to send the prepared email.</p>
    </aside>
  </div>;
}