import type { CheckoutQuote, RentalQuote, RentalTrip } from "@rental";
import { quoteForVehicle } from "@rental";
import type { Car } from "@/entities/car/model/cars";
import { priceLabel, site } from "@/shared/config/site";
import { Separator } from "@/shared/ui/separator";

export function CheckoutSummary({ car, trip, verified }: {
  car: Car; trip: RentalTrip; verified: CheckoutQuote | null;
}) {
  let sample: RentalQuote | null = null;
  if (!site.usePaidBookings) {
    try { sample = quoteForVehicle(car.id,trip); } catch { /* Invalid preview trip. */ }
  }
  return (
    <aside className="lg:sticky lg:top-6 lg:self-start">
      <div className="overflow-hidden rounded-3xl border border-border bg-card">
        <img src={car.image} alt={"Representative photo of " + car.name} loading="lazy"
          className="h-44 w-full object-cover" />
        <div className="space-y-4 p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Your rental</p>
            <h2 className="mt-1 text-xl font-semibold">{car.name}</h2>
            <p className="text-sm text-muted-foreground">{car.category} · {car.transmission}</p>
          </div>
          <Separator/>
          {verified ? (
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between gap-3"><dt>{verified.billableDays} day(s) × {priceLabel(verified.dailyPriceCents/100)}</dt>
                <dd>{priceLabel(verified.baseAmountCents/100)}</dd></div>
              <div className="flex justify-between gap-3"><dt>Mandatory fees</dt>
                <dd>{priceLabel(verified.mandatoryFeeCents/100)}</dd></div>
              <div className="flex justify-between gap-3 border-t border-border pt-4 font-bold">
                <dt>Total payable now</dt><dd className="text-xl">{priceLabel(verified.totalAmountCents/100)}</dd>
              </div>
              <div className="flex justify-between gap-3 text-muted-foreground">
                <dt>Separate deposit at pickup</dt><dd>{priceLabel(verified.depositCents/100)}</dd>
              </div>
              <p className="text-xs text-muted-foreground">Required taxes and mandatory fees are included. A deposit may be separately authorized at collection, not charged now.</p>
              <Separator/>
              <div className="space-y-2 text-xs text-muted-foreground">
                <p><strong className="text-foreground">Mileage:</strong> {verified.mileagePolicy}</p>
                <p><strong className="text-foreground">Fuel:</strong> {verified.fuelPolicy}</p>
                <p><strong className="text-foreground">Cancellation:</strong> {verified.cancellationPolicy}</p>
              </div>
            </dl>
          ) : site.usePaidBookings ? (
            <p role="status" className="text-sm text-muted-foreground">Checking real availability and the final payable amount…</p>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between gap-3">
                <span className="text-sm text-muted-foreground">Illustrative base estimate</span>
                <strong className="text-xl">{sample ? priceLabel(sample.baseAmountCents/100) : "—"}</strong>
              </div>
              <p className="text-xs leading-5 text-muted-foreground">This is not a payable quote. Taxes, deposits, insurance and fees need operator confirmation. No payment is collected.</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
