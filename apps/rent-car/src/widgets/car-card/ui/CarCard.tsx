import { Link, useLocation } from "react-router-dom";
import { ArrowUpRight, Fuel, Heart, Settings2, Users } from "lucide-react";
import type { CheckoutQuote, RentalTrip, RentalQuote } from "@rental";
import { quoteForVehicle } from "@rental";

import type { Car } from "@/entities/car/model/cars";
import { useFavorites } from "@/features/favorites/model/FavoritesProvider";
import { priceLabel, site } from "@/shared/config/site";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";

interface CarCardProps {
  car: Car;
  trip?: RentalTrip | null;
  verifiedQuote?: CheckoutQuote | null;
}

export function CarCard({ car, trip, verifiedQuote }: CarCardProps) {
  const { search } = useLocation();
  const { isFavorite, toggle } = useFavorites();
  const saved = isFavorite(car.id);
  const detailsUrl = "/fleet/" + car.id + search;
  const checkoutUrl = "/checkout/" + car.id + search;

  let preview: RentalQuote | null = null;
  if (!site.usePaidBookings && trip) {
    try { preview = quoteForVehicle(car.id, trip); } catch { /* Preview only. */ }
  }
  const amount = verifiedQuote
    ? verifiedQuote.totalAmountCents / 100
    : preview ? preview.baseAmountCents / 100 : car.dailyRate;

  return (
    <Card className="group overflow-hidden border-border/80 shadow-none transition-shadow hover:shadow-lg">
      <div className="relative h-52 overflow-hidden" style={{ backgroundColor: car.accent }}>
        <img className="vehicle-photo" src={car.image}
          alt={"Representative photograph for " + car.name} loading="lazy" decoding="async" />
        <Badge className="absolute left-4 top-4 bg-white/95 text-[#26392f]">{car.category}</Badge>
        <button type="button"
          aria-label={saved ? "Remove " + car.name + " from favorites" : "Save " + car.name + " to favorites"}
          aria-pressed={saved} onClick={() => toggle(car.id)}
          className="absolute right-4 top-4 grid size-10 cursor-pointer place-items-center rounded-full bg-white/95 text-[#26392f] shadow-sm transition-colors hover:text-[#176b58]">
          <Heart size={19} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="p-5 sm:p-6">
        <h3 className="text-xl font-bold tracking-tight">{car.name}</h3>
        <p className="mt-1 min-h-10 text-sm text-muted-foreground">{car.summary}</p>
        <div className="my-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-y border-border py-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><Users size={15}/>{car.seats} seats</span>
          <span className="flex items-center gap-1.5"><Settings2 size={15}/>{car.transmission}</span>
          <span className="flex items-center gap-1.5"><Fuel size={15}/>{car.fuel}</span>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">
            {verifiedQuote ? "Total rental price · taxes and mandatory fees included"
              : preview ? "Illustrative base rental estimate" : "Illustrative daily rate from"}
          </p>
          <p className="mt-1 text-2xl font-bold">
            {priceLabel(amount)}
            {!verifiedQuote && !preview && <span className="ml-1 text-xs font-normal text-muted-foreground">/ day</span>}
          </p>
          {verifiedQuote && (
            <p className="mt-1 text-xs text-muted-foreground">
              {verifiedQuote.billableDays} day(s) · Deposit {priceLabel(verifiedQuote.depositCents / 100)} separately
            </p>
          )}
          {preview?.requiresManualReview && <p className="mt-1 text-xs text-muted-foreground">One-way fees not included</p>}
        </div>
        <div className="mt-5 grid grid-cols-2 gap-2">
          <Button size="sm" variant="outline" asChild>
            <Link to={detailsUrl}>Details <ArrowUpRight size={15}/></Link>
          </Button>
          <Button size="sm" asChild>
            <Link to={checkoutUrl}>
              {verifiedQuote ? "Select car" : "Continue"} <ArrowUpRight size={15}/>
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}
