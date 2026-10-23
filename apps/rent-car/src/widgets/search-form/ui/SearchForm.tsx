import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, MapPin } from "lucide-react";

import { changePickupDate, initialTripDates, validateTrip } from "@/features/booking/lib/trip";
import { site } from "@/shared/config/site";
import { dateOffset } from "@/shared/lib/dates";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Select } from "@/shared/ui/select";

export function SearchForm() {
  const navigate = useNavigate();
  const [city, setCity] = useState<string>(site.locations[0]);
  const [dates, setDates] = useState(() => initialTripDates(null, null));
  const valid = validateTrip(dates);

  function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!valid) return;

    const query = new URLSearchParams({
      city,
      pickup: dates.pickupDate,
      return: dates.returnDate,
    });

    navigate(`/fleet?${query.toString()}`);
  }

  return (
    <form
      onSubmit={search}
      className="rounded-[26px] border border-border bg-card p-5 shadow-[0_18px_65px_rgba(20,40,33,.1)] lg:p-6"
    >
      <p className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[.14em] text-primary">
        <span className="size-2 rounded-full bg-primary" />
        Start your journey
      </p>
      <div className="grid gap-4 md:grid-cols-[1.25fr_1fr_1fr_auto] md:items-end">
        <div>
          <Label htmlFor="search-city">Pickup location</Label>
          <div className="relative">
            <MapPin
              size={17}
              className="pointer-events-none absolute left-3.5 top-4 text-muted-foreground"
            />
            <Select
              id="search-city"
              value={city}
              onChange={(event) => setCity(event.target.value)}
              className="pl-10"
            >
              {site.locations.map((name) => <option key={name}>{name}</option>)}
            </Select>
          </div>
        </div>
        <div>
          <Label htmlFor="search-pickup">Pickup date</Label>
          <Input
            id="search-pickup"
            type="date"
            value={dates.pickupDate}
            min={dateOffset(0)}
            onChange={(event) => setDates((current) => changePickupDate(current, event.target.value))}
            required
          />
        </div>
        <div>
          <Label htmlFor="search-return">Return date</Label>
          <Input
            id="search-return"
            type="date"
            value={dates.returnDate}
            min={dates.pickupDate || dateOffset(0)}
            onChange={(event) => setDates((current) => ({
              ...current,
              returnDate: event.target.value,
            }))}
            required
          />
        </div>
        <Button
          size="lg"
          type="submit"
          disabled={!valid}
          className="h-12 whitespace-nowrap"
        >
          Find a car <ArrowRight size={18} />
        </Button>
      </div>
      {!valid && (
        <p role="alert" className="mt-3 text-xs text-destructive">
          Choose a future pickup and a return date after pickup.
        </p>
      )}
    </form>
  );
}
