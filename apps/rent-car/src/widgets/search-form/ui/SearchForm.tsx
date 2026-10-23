import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, MapPin } from "lucide-react";
import { dateOffset, rentalDays } from "@/shared/lib/dates";
import { site } from "@/shared/config/site";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Select } from "@/shared/ui/select";

export function SearchForm({ compact = false }: { compact?: boolean }) {
  const navigate = useNavigate();
  const [city, setCity] = useState<string>(site.locations[0]);
  const [pickup, setPickup] = useState(dateOffset(1));
  const [dropoff, setDropoff] = useState(dateOffset(4));
  const invalid = rentalDays(pickup, dropoff) === 0 || pickup < dateOffset(0);

  function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (invalid) return;
    navigate("/fleet?" + new URLSearchParams({ city, pickup, return: dropoff }).toString());
  }
  return (
    <form onSubmit={search} className={"rounded-[26px] border border-border bg-card p-5 shadow-[0_18px_65px_rgba(20,40,33,.1)] " + (compact ? "" : "lg:p-6")}>
      <div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[.14em] text-primary"><span className="size-2 rounded-full bg-primary" />Start your journey</div>
      <div className="grid gap-4 md:grid-cols-[1.25fr_1fr_1fr_auto] md:items-end">
        <div><Label htmlFor="search-city">Pickup location</Label><div className="relative"><MapPin size={17} className="pointer-events-none absolute left-3.5 top-4 text-muted-foreground" /><Select id="search-city" value={city} onChange={(event) => setCity(event.target.value)} className="pl-10">{site.locations.map((name) => <option key={name}>{name}</option>)}</Select></div></div>
        <div><Label htmlFor="search-pickup">Pickup date</Label><Input id="search-pickup" type="date" value={pickup} min={dateOffset(0)} onChange={(event) => setPickup(event.target.value)} required /></div>
        <div><Label htmlFor="search-return">Return date</Label><Input id="search-return" type="date" value={dropoff} min={pickup || dateOffset(0)} onChange={(event) => setDropoff(event.target.value)} required /></div>
        <Button size="lg" type="submit" disabled={invalid} className="h-12 whitespace-nowrap">Find a car <ArrowRight size={18} /></Button>
      </div>
      {invalid && <p role="alert" className="mt-3 text-xs text-destructive">Choose a future pickup and a return date after pickup.</p>}
    </form>
  );
}