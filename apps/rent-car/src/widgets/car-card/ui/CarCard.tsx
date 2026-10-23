import { Link, useLocation } from "react-router-dom";
import { ArrowUpRight, Fuel, Heart, Settings2, Users } from "lucide-react";

import type { Car } from "@/entities/car/model/cars";
import { quoteForVehicle, type RentalQuote, type RentalTrip } from "@rental";
import { useFavorites } from "@/features/favorites/model/FavoritesProvider";
import { priceLabel } from "@/shared/config/site";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";

interface CarCardProps {
  car: Car;
  trip?: RentalTrip | null;
}

export function CarCard({ car, trip }: CarCardProps) {
  const { search } = useLocation();
  const { isFavorite, toggle } = useFavorites();
  const saved = isFavorite(car.id);
  const detailsUrl = `/fleet/${car.id}${search}`;
  let quote: RentalQuote | null = null;
  try { if (trip) quote = quoteForVehicle(car.id, trip); } catch { /* No valid trip-specific estimate. */ }

  return (
    <Card className="group overflow-hidden border-border/80 shadow-none transition-shadow hover:shadow-lg">
      <div
        className="relative h-57 overflow-hidden"
        style={{ backgroundColor: car.accent }}
      >
        <img
          className="vehicle-photo"
          src={car.image}
          alt={`Representative image of ${car.name}`}
          loading="lazy"
          decoding="async"
        />
        <Badge className="absolute left-4 top-4 bg-white/95 text-[#26392f]">
          {car.category}
        </Badge>
        <button
          type="button"
          aria-label={saved ? `Remove ${car.name} from favorites` : `Save ${car.name} to favorites`}
          aria-pressed={saved}
          onClick={() => toggle(car.id)}
          className="absolute right-4 top-4 grid size-10 cursor-pointer place-items-center rounded-full bg-white/95 text-[#26392f] shadow-sm transition-colors hover:text-[#176b58]"
        >
          <Heart size={19} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold tracking-tight">{car.name}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{car.summary}</p>

        <div className="my-5 grid grid-cols-3 gap-3 border-y border-border py-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Users size={15} /> {car.seats} seats
          </span>
          <span className="flex items-center gap-1.5">
            <Settings2 size={15} /> {car.transmission}
          </span>
          <span className="flex items-center gap-1.5">
            <Fuel size={15} /> {car.fuel}
          </span>
        </div>

        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs text-muted-foreground">
              {quote ? `Base estimate · ${quote.billableDays} day(s)` : "Indicative from"}
            </p>
            <p className="mt-0.5 text-2xl font-bold">
              {priceLabel(quote ? quote.baseAmountCents / 100 : car.dailyRate)}
              {!quote && <span className="ml-1 text-xs font-normal text-muted-foreground">/ day</span>}
            </p>
            {quote?.requiresManualReview && (
              <p className="mt-1 text-xs text-muted-foreground">One-way fee not included</p>
            )}
          </div>
          <Button size="sm" asChild>
            <Link to={detailsUrl}>
              View car <ArrowUpRight size={16} />
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}
