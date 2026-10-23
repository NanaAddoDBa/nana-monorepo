import { locationById, serializeTrip, tripFromParams, validateTrip, type CheckoutQuote, type RentalTrip } from "@rental";
import { useEffect, useState } from "react";
import { fetchAvailableCars } from "@/features/checkout/lib/bookingsApi";
import { site } from "@/shared/config/site";
import { FleetTripBar } from "@/pages/fleet/ui/FleetTripBar";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, SlidersHorizontal, X } from "lucide-react";

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
  const [quotes, setQuotes] = useState<CheckoutQuote[]>([]);
  const [availabilityState, setAvailabilityState] = useState<"idle"|"loading"|"ready"|"error">("idle");
  const [availabilityError, setAvailabilityError] = useState("");
  const [retry, setRetry] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const tripKey = trip ? serializeTrip(trip).toString() : "";
  useEffect(() => {
    if (!site.usePaidBookings || !tripKey) return;
    const selected = tripFromParams(new URLSearchParams(tripKey));
    if (!selected || validateTrip(selected).length) {
      setAvailabilityState("error");
      setAvailabilityError("Choose a valid pickup and return date and time.");
      return;
    }
    const abort = new AbortController();
    setAvailabilityState("loading");
    setAvailabilityError("");
    fetchAvailableCars(selected, abort.signal).then((available) => {
      if (abort.signal.aborted) return;
      setQuotes(available);
      setAvailabilityState("ready");
    }).catch((error: unknown) => {
      if (abort.signal.aborted) return;
      setAvailabilityState("error");
      setAvailabilityError(error instanceof Error ? error.message : "Availability could not be checked.");
    });
    return () => abort.abort();
  }, [tripKey, retry]);

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

  const quoteById = new Map(quotes.map((quote) => [quote.vehicleId, quote]));
  const visible = site.usePaidBookings
    ? availabilityState === "ready" ? filtered.filter((car) => quoteById.has(car.id)) : []
    : filtered;

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
              {site.usePaidBookings && availabilityState === "ready" ?
                visible.length + " verified car(s) available" : filtered.length + " vehicles to explore"}
            </p>
          </div>
        </div>
      </div>

      <div className="page-container mt-8 space-y-3">
        <FleetTripBar trip={trip} />
      </div>
      <div className="page-container grid gap-10 py-12 lg:grid-cols-[260px_1fr]">
        <div>
          <Button className="mb-4 lg:hidden" variant="outline" onClick={() => setFiltersOpen(!filtersOpen)}
            aria-controls="fleet-filter-panel" aria-expanded={filtersOpen}>
            <SlidersHorizontal size={17} /> {filtersOpen ? "Hide filters" : "Filters"}
          </Button>
          <div id="fleet-filter-panel" className={filtersOpen ? "" : "hidden lg:block"}>
            <CatalogFilterPanel value={value} onChange={updateFilter} onReset={resetFilters} />
          </div>
        </div>

        <section aria-label="Car catalogue" className="min-w-0">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm font-medium">
              {visible.length} cars found
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

          {site.usePaidBookings && availabilityState === "loading" ? (
            <p role="status" className="rounded-2xl border border-border bg-card p-8 text-center">
              Checking verified availability and final pricing…
            </p>
          ) : site.usePaidBookings && availabilityState === "error" ? (
            <div role="alert" className="rounded-2xl border border-border bg-card p-8">
              <h2 className="text-lg font-semibold">Availability check unavailable</h2>
              <p className="mt-2 text-muted-foreground">{availabilityError}</p>
              <Button className="mt-4" onClick={() => setRetry(value => value + 1)}>Try again</Button>
            </div>
          ) : site.usePaidBookings && !trip ? (
            <p className="rounded-2xl border border-border bg-card p-8">Choose your pickup location and dates to see verified available vehicles.</p>
          ) : visible.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 2xl:grid-cols-3">
              {visible.map((car) => (
                <CarCard car={car} key={car.id} trip={trip}
                  verifiedQuote={site.usePaidBookings ? quoteById.get(car.id) : null} />
              ))}
            </div>
          ) : (
            <div className="flex min-h-[390px] flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card p-8 text-center">
              <span className="mb-5 grid size-16 place-items-center rounded-full bg-muted">
                <X size={26} />
              </span>
              <h2 className="text-2xl font-bold">
                {site.usePaidBookings ? "No verified cars are available for this trip" : "No cars match those filters"}
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
            {site.usePaidBookings
              ? "Available cars and complete mandatory-fee totals are verified by the rental service. A separate refundable deposit may be required at pickup."
              : "These vehicles and prices are illustrative. Browsing does not confirm availability or reserve a car."}
          </p>
        </section>
      </div>
    </main>
  );
}
