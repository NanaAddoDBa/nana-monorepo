import { Link, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, Heart } from "lucide-react";

import { cars, findCar } from "@/entities/car/model/cars";
import { useFavorites } from "@/features/favorites/model/FavoritesProvider";
import { NotFoundPage } from "@/pages/not-found/ui/NotFoundPage";
import { RentalRequestPanel } from "@/pages/details/ui/RentalRequestPanel";
import { VehicleSpecifications } from "@/pages/details/ui/VehicleSpecifications";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { CarCard } from "@/widgets/car-card/ui/CarCard";

export function CarDetailsPage() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const { toggle, isFavorite } = useFavorites();
  const car = findCar(id);

  if (!car) return <NotFoundPage />;

  const saved = isFavorite(car.id);
  const bookingQuery = new URLSearchParams({
    city: params.get("city") || car.locations[0],
    pickup: params.get("pickup") || "",
    return: params.get("return") || "",
  }).toString();
  const related = cars.filter((item) => item.id !== car.id).slice(0, 3);

  return (
    <main className="page-container py-10 md:py-14">
      <Link
        to="/fleet"
        className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft size={16} /> Back to fleet
      </Link>

      <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
        <div>
          <Badge className="mb-4">{car.category}</Badge>
          <h1 className="display-serif text-[clamp(3rem,5.4vw,5.8rem)] leading-none">
            {car.name}
          </h1>
          <p className="mt-4 text-muted-foreground">{car.summary}</p>
        </div>
        <Button
          variant="outline"
          onClick={() => toggle(car.id)}
          aria-pressed={saved}
        >
          <Heart size={18} fill={saved ? "currentColor" : "none"} />
          {saved ? "Saved" : "Save car"}
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.5fr_.75fr]">
        <div>
          <div
            className="relative h-[360px] overflow-hidden rounded-[32px] md:h-[520px]"
            style={{ backgroundColor: car.accent }}
          >
            <img
              src={car.image}
              alt={"Representative image of " + car.name}
              className="size-full object-cover"
            />
            <span className="absolute bottom-5 left-5 rounded-full bg-white/95 px-4 py-2 text-xs font-semibold text-[#18392b]">
              Example image
            </span>
          </div>
          <VehicleSpecifications car={car} />
        </div>

        <RentalRequestPanel car={car} bookingQuery={bookingQuery} />
      </div>

      <section className="py-20">
        <div className="mb-8 flex items-center justify-between gap-4">
          <h2 className="display-serif text-4xl">More to explore</h2>
          <Link to="/fleet" className="text-sm font-semibold text-primary hover:underline">
            All cars
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {related.map((item) => <CarCard key={item.id} car={item} />)}
        </div>
      </section>
    </main>
  );
}
