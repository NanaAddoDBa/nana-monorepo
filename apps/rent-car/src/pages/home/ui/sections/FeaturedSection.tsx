import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

import { cars } from "@/entities/car/model/cars";
import { Button } from "@/shared/ui/button";
import { CarCard } from "@/widgets/car-card/ui/CarCard";

const featuredCars = [
  ...cars.filter((car) => car.featured),
  ...cars.filter((car) => !car.featured),
].slice(0, 3);

export function FeaturedSection() {
  return (
    <section className="section-spacing page-container" id="featured">
      <div className="mb-9 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[.2em] text-primary">
            Explore the fleet
          </p>
          <h2 className="display-serif text-[clamp(2.9rem,5.5vw,5rem)] leading-[1.05]">
            Featured <em>vehicles.</em>
          </h2>
          <p className="mt-4 max-w-lg text-muted-foreground">
            Compare specifications and indicative rates across our example fleet.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link to="/fleet">
            View all cars <ArrowUpRight size={17} />
          </Link>
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {featuredCars.map((car) => <CarCard key={car.id} car={car} />)}
      </div>
    </section>
  );
}
