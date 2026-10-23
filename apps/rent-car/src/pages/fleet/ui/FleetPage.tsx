import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Search, SlidersHorizontal, X } from "lucide-react";
import { cars } from "@/entities/car/model/cars";
import { filterCars } from "@/features/catalog/lib/filters";
import { site } from "@/shared/config/site";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Select } from "@/shared/ui/select";
import { CarCard } from "@/widgets/car-card/ui/CarCard";

export function FleetPage() {
  const [params, setParams] = useSearchParams();
  const value = (key: string) => params.get(key) || "";
  const setValue = (key: string, nextValue: string) => {
    const next = new URLSearchParams(params);
    if (nextValue) next.set(key, nextValue); else next.delete(key);
    setParams(next, { replace: true });
  };
  const selectedMax = value("maxPrice");
  const filtered = filterCars(cars, {
    search: value("search"), category: value("category"), transmission: value("transmission"),
    city: value("city"), sort: value("sort") || "featured",
    maxPrice: selectedMax && Number.isFinite(Number(selectedMax)) ? Number(selectedMax) : null,
  });
  function reset() { setParams(new URLSearchParams(), { replace: true }); }
  return <main>
    <div className="border-b border-border bg-secondary/40">
      <div className="page-container py-15 sm:py-20"><Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"><ArrowLeft size={16} /> Home</Link><Badge className="mb-5 block w-fit bg-card text-primary">THE COLLECTION</Badge><div className="flex flex-wrap items-end justify-between gap-5"><div><h1 className="display-serif text-[clamp(3.5rem,6vw,6.5rem)] leading-none">Find your <em>drive.</em></h1><p className="mt-5 max-w-xl leading-7 text-muted-foreground">Choose a car that fits your next chapter. Photos and pricing are illustrative.</p></div><p className="text-sm text-muted-foreground">{filtered.length} of {cars.length} sample cars</p></div></div>
    </div>
    <div className="page-container grid gap-10 py-12 lg:grid-cols-[260px_1fr]">
      <aside className="lg:sticky lg:top-6 lg:self-start">
        <div className="mb-6 flex items-center justify-between"><h2 className="flex items-center gap-2 font-bold"><SlidersHorizontal size={18} /> Filters</h2><button type="button" onClick={reset} className="cursor-pointer text-sm text-primary hover:underline">Reset</button></div>
        <div className="grid gap-5 rounded-3xl border border-border bg-card p-6 sm:grid-cols-2 lg:grid-cols-1">
          <div><Label htmlFor="fleet-search">Search cars</Label><div className="relative"><Search size={16} className="absolute left-3.5 top-4 text-muted-foreground" /><Input id="fleet-search" className="pl-10" placeholder="Name or type" value={value("search")} onChange={(event) => setValue("search", event.target.value)} /></div></div>
          <div><Label htmlFor="fleet-city">Pickup city</Label><Select id="fleet-city" value={value("city")} onChange={(event) => setValue("city", event.target.value)}><option value="">All locations</option>{site.locations.map((city) => <option key={city} value={city}>{city}</option>)}</Select></div>
          <div><Label htmlFor="fleet-category">Vehicle type</Label><Select id="fleet-category" value={value("category")} onChange={(event) => setValue("category", event.target.value)}><option value="">All types</option>{["Compact", "Sedan", "SUV", "Electric", "Performance"].map((type) => <option key={type}>{type}</option>)}</Select></div>
          <div><Label htmlFor="fleet-transmission">Transmission</Label><Select id="fleet-transmission" value={value("transmission")} onChange={(event) => setValue("transmission", event.target.value)}><option value="">Any transmission</option><option>Automatic</option><option>Manual</option></Select></div>
          <div><Label htmlFor="fleet-price">Maximum daily price</Label><Select id="fleet-price" value={value("maxPrice")} onChange={(event) => setValue("maxPrice", event.target.value)}><option value="">Any price</option><option value="75">€75</option><option value="100">€100</option><option value="125">€125</option><option value="150">€150</option></Select></div>
        </div>
      </aside>
      <div className="min-w-0">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4"><p className="text-sm font-medium">{filtered.length} cars found {value("city") && <span className="text-muted-foreground">in {value("city")}</span>}</p><div className="flex items-center gap-3"><Label htmlFor="fleet-sort" className="mb-0">Sort by</Label><Select id="fleet-sort" className="w-[190px]" value={value("sort") || "featured"} onChange={(event) => setValue("sort", event.target.value)}><option value="featured">Featured</option><option value="price-low">Lowest price</option><option value="price-high">Highest price</option><option value="seats">Most seats</option></Select></div></div>
        {filtered.length ? <div className="grid gap-6 md:grid-cols-2 2xl:grid-cols-3">{filtered.map((car) => <CarCard key={car.id} car={car} />)}</div> : <div className="flex min-h-[390px] flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card p-8 text-center"><span className="mb-5 grid size-16 place-items-center rounded-full bg-muted"><X size={26} /></span><h2 className="text-2xl font-bold">No cars match those filters</h2><p className="mt-3 max-w-xs text-muted-foreground">Try a different location, price, or vehicle type.</p><Button className="mt-6" onClick={reset}>Clear filters <ArrowRight size={17} /></Button></div>}
        <p className="mt-8 text-xs leading-6 text-muted-foreground">This is an illustrative catalogue. Filter results do not represent live availability. Rental dates and final pricing require confirmation by the operator.</p>
      </div>
    </div>
  </main>;
}