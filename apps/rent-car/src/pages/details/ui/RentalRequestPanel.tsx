import type { RentalQuote } from "@rental";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";

import type { Car } from "@/entities/car/model/cars";
import { priceLabel } from "@/shared/config/site";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Separator } from "@/shared/ui/separator";

interface RentalRequestPanelProps {
  car: Car;
  bookingQuery: string;
  quote?: RentalQuote | null;
}

export function RentalRequestPanel({
  car,
  bookingQuery,
  quote,
}: RentalRequestPanelProps) {
  const detailsUrl = "/book/" + car.id + (bookingQuery ? "?" + bookingQuery : "");

  return (
    <aside className="lg:sticky lg:top-6 lg:self-start">
      <Card className="p-7">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          {quote ? `Estimated base · ${quote.billableDays} day(s)` : "Indicative daily rate"}
        </p>
        <p className="mt-2 text-4xl font-bold">
          {priceLabel(quote ? quote.baseAmountCents / 100 : car.dailyRate)}
          {!quote && <span className="ml-2 text-sm font-normal text-muted-foreground">/ day</span>}
        </p>

        {quote?.requiresManualReview && <p className="mt-2 text-xs text-muted-foreground">One-way return fee not included; operator review required.</p>}
        <Separator className="my-6" />
        <div className="space-y-5 text-sm">
          <div className="flex items-start gap-3">
            <MapPin size={18} className="mt-0.5 text-primary" />
            <div>
              <p className="font-semibold">Pickup locations</p>
              <p className="mt-1 text-muted-foreground">
                {car.locations.join(", ")}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CalendarDays size={18} className="mt-0.5 text-primary" />
            <div>
              <p className="font-semibold">Choose your dates</p>
              <p className="mt-1 text-muted-foreground">
                Submit a request for availability.
              </p>
            </div>
          </div>
        </div>

        <Button className="mt-7 w-full" asChild>
          <Link to={detailsUrl}>
            Request this car <ArrowRight size={18} />
          </Link>
        </Button>
        <p className="mt-4 text-center text-xs leading-5 text-muted-foreground">
          No payment is collected and no reservation is confirmed here.
        </p>
      </Card>
    </aside>
  );
}
