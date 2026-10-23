import { useState } from "react";
import type { RentalTrip } from "@rental";
import { Button } from "@/shared/ui/button";
import { SearchForm } from "@/widgets/search-form/ui/SearchForm";
import { TripSummary } from "@/widgets/trip-summary/ui/TripSummary";

export function FleetTripBar({ trip }: { trip: RentalTrip | null }) {
  const [editing, setEditing] = useState(false);
  if (!trip) return <SearchForm />;
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Your rental search</p>
        <Button variant="outline" size="sm" onClick={() => setEditing(!editing)}
          aria-expanded={editing} aria-controls="fleet-edit-trip">
          {editing ? "Close trip editor" : "Edit trip"}
        </Button>
      </div>
      <TripSummary trip={trip} />
      {editing && <div id="fleet-edit-trip"><SearchForm /></div>}
    </div>
  );
}
