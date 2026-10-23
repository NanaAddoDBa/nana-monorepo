import { ShieldCheck } from "lucide-react";

import type { Car } from "@/entities/car/model/cars";
import { priceLabel } from "@/shared/config/site";
import { estimatedBaseTotal, rentalDays } from "@/shared/lib/dates";
import { Separator } from "@/shared/ui/separator";

interface BookingSummaryProps {
  car: Car;
  city: string;
  pickupDate: string;
  returnDate: string;
  datesValid: boolean;
}

export function BookingSummary({
  car,
  city,
  pickupDate,
  returnDate,
  datesValid,
}: BookingSummaryProps) {
  const days = rentalDays(pickupDate, returnDate);
  const estimate = estimatedBaseTotal(car.dailyRate, pickupDate, returnDate);

  return (
    <aside className="lg:sticky lg:top-7 lg:self-start">
      <div className="overflow-hidden rounded-[30px] border border-border bg-card">
        <img
          src={car.image}
          alt={"Representative image of " + car.name}
          loading="lazy"
          className="h-55 w-full object-cover"
        />
        <div className="p-7">
          <p className="mb-1 text-xs uppercase tracking-widest text-primary">
            Your selection
          </p>
          <h2 className="text-2xl font-semibold">{car.name}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {car.category} · {car.transmission}
          </p>

          <Separator className="my-6" />
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Daily rate</dt>
              <dd>{priceLabel(car.dailyRate)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Rental days</dt>
              <dd>{days || "—"}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Pickup location</dt>
              <dd>{city}</dd>
            </div>
          </dl>

          <Separator className="my-6" />
          <div className="flex items-end justify-between gap-3">
            <span className="text-sm font-semibold">
              Estimated base total
            </span>
            <strong className="text-3xl">
              {datesValid ? priceLabel(estimate) : "—"}
            </strong>
          </div>
          <p className="mt-3 text-xs leading-6 text-muted-foreground">
            Indicative rates only. Taxes, deposits, insurance, mileage and
            surcharges are excluded. The operator must confirm the final amount.
          </p>
        </div>
      </div>
      <p className="mt-5 flex gap-3 px-2 text-sm leading-6 text-muted-foreground">
        <ShieldCheck size={20} className="mt-0.5 shrink-0 text-primary" />
        Your details stay in this browser unless you choose to send
        the prepared email.
      </p>
    </aside>
  );
}
