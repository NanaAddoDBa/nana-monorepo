import type { Car } from "@/entities/car/model/cars";
import { priceLabel } from "@/shared/config/site";
import { Separator } from "@/shared/ui/separator";
import { quoteForVehicle, locationById, validateTrip, type RentalQuote, type RentalTrip } from "@rental";

export function BookingSummary({ car, trip }: { car: Car; trip: RentalTrip }) {
  let quote: RentalQuote | null = null;
  try { quote = quoteForVehicle(car.id, trip); } catch { /* Invalid trip or unsupported pickup. */ }
  const pickup = locationById(trip.pickupLocationId)?.name || trip.pickupLocationId;
  const dropoff = locationById(trip.returnLocationId)?.name || trip.returnLocationId;
  return (
    <aside className="lg:sticky lg:top-7 lg:self-start">
      <div className="overflow-hidden rounded-[30px] border border-border bg-card">
        <img src={car.image} alt={"Representative image of " + car.name}
          loading="lazy" className="h-55 w-full object-cover" />
        <div className="p-7">
          <p className="mb-1 text-xs uppercase tracking-widest text-primary">Vehicle selected</p>
          <h2 className="text-2xl font-semibold">{car.name}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{car.category} · {car.transmission}</p>
          <Separator className="my-6" />
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Pickup</dt>
              <dd className="text-right">{pickup}<span className="block text-xs">{trip.pickupDate} {trip.pickupTime}</span></dd></div>
            <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Return</dt>
              <dd className="text-right">{dropoff}<span className="block text-xs">{trip.returnDate} {trip.returnTime}</span></dd></div>
            <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Daily base rate</dt>
              <dd>{priceLabel(car.dailyRate)}</dd></div>
            {quote && <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Billable days</dt>
              <dd>{quote.billableDays}</dd></div>}
          </dl>
          <Separator className="my-6" />
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-semibold">Base estimate</span>
            <strong className="text-3xl">{quote ? priceLabel(quote.baseAmountCents / 100) : "—"}</strong>
          </div>
          {validateTrip(trip).length > 0 && <p className="mt-3 text-xs text-destructive">Update the trip to calculate an estimate.</p>}
          {quote?.requiresManualReview && <p className="mt-3 text-xs text-muted-foreground">A one-way return may incur an additional charge.</p>}
          <p className="mt-3 text-xs leading-6 text-muted-foreground">
            Illustrative base estimate only. Taxes, deposits, insurance and other fees are not included.
            Availability and final price must be confirmed by the operator.
          </p>
        </div>
      </div>
    </aside>
  );
}
