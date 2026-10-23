import { CalendarClock, MapPin } from "lucide-react";
import { locationById, validateTrip, type RentalTrip } from "@rental";
import { Link } from "react-router-dom";
import { Button } from "@/shared/ui/button";

interface Props {
  trip: RentalTrip;
  editHref?: string;
  editState?: unknown;
}

export function TripSummary({ trip, editHref, editState }: Props) {
  const pickup = locationById(trip.pickupLocationId)?.name || trip.pickupLocationId;
  const dropoff = locationById(trip.returnLocationId)?.name || trip.returnLocationId;
  const issues = validateTrip(trip);
  return (
    <section aria-label="Selected rental trip"
      className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5">
      <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
        <span className="inline-flex items-center gap-2"><MapPin size={18} className="text-primary" />
          <strong>{pickup}</strong> → <strong>{dropoff}</strong>
        </span>
        <span className="inline-flex items-center gap-2"><CalendarClock size={18} className="text-primary" />
          {trip.pickupDate} {trip.pickupTime} – {trip.returnDate} {trip.returnTime}
        </span>
      </div>
      {editHref && <Button variant="outline" size="sm" asChild><Link to={editHref} state={editState}>Edit trip</Link></Button>}
      {issues.length > 0 && <p role="alert" className="w-full text-xs text-destructive">{issues[0]}</p>}
    </section>
  );
}
