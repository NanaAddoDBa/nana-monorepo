import { locationById, serializeTrip, tripFromParams, type RentalTrip } from "@rental";
import { SearchForm } from "@/widgets/search-form/ui/SearchForm";
import { TripSummary } from "@/widgets/trip-summary/ui/TripSummary";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, X } from "lucide-react";

import { cars } from "@/entities/car/model/cars";
import { filterCars } from "@/features/catalog/lib/filters";
import {
  CatalogFilterPanel,
  type FilterKey,
} from "@/features/catalog/ui/CatalogFilterPanel";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import { Select } from "@/shared/ui/select";
import { CarCard } from "@/widgets/car-card/ui/CarCard";

function priceLimit(value: string): number | null {
  if (!value.trim()) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

export function FleetPage() {
  const [params, setParams] = useSearchParams();
  const value = (key: FilterKey) => params.get(key) || "";
  const trip: RentalTrip | null = tripFromParams(params);
  const selectedCity = trip ? locationById(trip.pickupLocationId)?.name || "" : value("city");

  function updateFilter(key: FilterKey, nextValue: string) {
    setParams((current) => {
      const next = new URLSearchParams(current);
      if (nextValue) next.set(key, nextValue);
      else next.delete(key);
      return next;
    }, { replace: true });
  }

  const filtered = filterCars(cars, {
    search: value("search"),
    category: value("category"),
    transmission: value("transmission"),
    city: selectedCity,
    sort: value("sort") || "featured",
    maxPrice: priceLimit(value("maxPrice")),
  });

  function resetFilters() {
    setParams((current) => {
      const selectedTrip = tripFromParams(current);
      return selectedTrip ? serializeTrip(selectedTrip) : new URLSearchParams();
    }, { replace: true });
  }

  return (
    <main>
      <div className="border-b border-border bg-secondary/40">
        <div className="page-container py-15 sm:py-20">
          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
          >
            <ArrowLeft size={16} /> Home
          </Link>
          <Badge className="mb-5 block w-fit bg-card text-primary">
            THE COLLECTION
          </Badge>
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <h1 className="display-serif text-[clamp(3.5rem,6vw,6.5rem)] leading-none">
                Find your <em>drive.</em>
              </h1>
              <p className="mt-5 max-w-xl leading-7 text-muted-foreground">
                Browse by vehicle type, pickup city, and indicative daily rate.
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              {filtered.length} of {cars.length} vehicles
            </p>
          </div>
        </div>
      </div>

      <div className="page-container mt-8 space-y-3">
        {trip && <TripSummary trip={trip} />}
        <SearchForm />
      </div>
      <div className="page-container grid gap-10 py-12 lg:grid-cols-[260px_1fr]">
        <CatalogFilterPanel
          value={value}
          onChange={updateFilter}
          onReset={resetFilters}
        />

        <section aria-label="Car catalogue" className="min-w-0">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm font-medium">
              {filtered.length} cars found
              {selectedCity && (
                <span className="text-muted-foreground">
                  {" "}in {selectedCity}
                </span>
              )}
            </p>

            <div className="flex items-center gap-3">
              <Label htmlFor="fleet-sort" className="mb-0">
                Sort by
              </Label>
              <Select
                id="fleet-sort"
                className="w-[190px]"
                value={value("sort") || "featured"}
                onChange={(event) => updateFilter("sort", event.target.value)}
              >
                <option value="featured">Featured</option>
                <option value="price-low">Lowest price</option>
                <option value="price-high">Highest price</option>
                <option value="seats">Most seats</option>
              </Select>
            </div>
          </div>

          {filtered.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 2xl:grid-cols-3">
              {filtered.map((car) => (
                <CarCard car={car} key={car.id} trip={trip} />
              ))}
            </div>
          ) : (
            <div className="flex min-h-[390px] flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card p-8 text-center">
              <span className="mb-5 grid size-16 place-items-center rounded-full bg-muted">
                <X size={26} />
              </span>
              <h2 className="text-2xl font-bold">
                No cars match those filters
              </h2>
              <p className="mt-3 max-w-xs text-muted-foreground">
                Try another location, rate, or vehicle type.
              </p>
              <Button className="mt-6" onClick={resetFilters}>
                Clear filters <ArrowRight size={17} />
              </Button>
            </div>
          )}

          <p className="mt-8 text-xs leading-6 text-muted-foreground">
            Vehicle details, rates, and locations are examples.
            Availability and final pricing require confirmation.
          </p>
        </section>
      </div>
    </main>
  );
}
