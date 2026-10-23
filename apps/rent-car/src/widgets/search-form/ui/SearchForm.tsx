import { useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { makeDefaultTrip, serializeTrip, tripFromParams, validateTrip, type RentalTrip } from "@rental";

import { TripFields } from "@/features/rental-search/ui/TripFields";
import { Button } from "@/shared/ui/button";

export function SearchForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const [trip, setTrip] = useState<RentalTrip>(
    () => tripFromParams(new URLSearchParams(location.search)) || makeDefaultTrip(),
  );
  const issues = validateTrip(trip);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (issues.length) return;

    const existing = new URLSearchParams(location.search);
    // Preserve customer filter settings, not stale trip/legacy values.
    for (const key of ["city", "pickup", "return", "pickupLocation", "returnLocation",
      "pickupDate", "pickupTime", "returnDate", "returnTime"]) existing.delete(key);
    serializeTrip(trip).forEach((value, key) => existing.set(key, value));
    navigate("/fleet?" + existing.toString());
  }

  return (
    <form onSubmit={submit} className="rounded-[26px] border border-border bg-card p-5 shadow-[0_18px_65px_rgba(20,40,33,.1)] lg:p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-sm font-bold uppercase tracking-[.14em] text-primary">Plan your rental</h2>
        <span className="text-xs text-muted-foreground">Locations, dates and local times</span>
      </div>
      <TripFields value={trip} onChange={setTrip} idPrefix="search" />
      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
        <p role={issues.length ? "alert" : undefined}
          className={issues.length ? "text-sm text-destructive" : "text-sm text-muted-foreground"}>
          {issues[0] || "Browse indicative prices; availability must be confirmed."}
        </p>
        <Button type="submit" disabled={issues.length > 0}>
          Explore vehicles <ArrowRight size={18} />
        </Button>
      </div>
    </form>
  );
}
