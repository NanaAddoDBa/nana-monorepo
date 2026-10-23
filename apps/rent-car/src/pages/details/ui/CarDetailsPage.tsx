import { Link, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, BriefcaseBusiness, CalendarDays, Fuel, Heart, MapPin, Settings2, Users } from "lucide-react";
import { cars, findCar } from "@/entities/car/model/cars";
import { useFavorites } from "@/features/favorites/model/FavoritesProvider";
import { site, priceLabel } from "@/shared/config/site";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Separator } from "@/shared/ui/separator";
import { NotFoundPage } from "@/pages/not-found/ui/NotFoundPage";
import { CarCard } from "@/widgets/car-card/ui/CarCard";

export function CarDetailsPage() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const { toggle, isFavorite } = useFavorites();
  const car = findCar(id);
  if (!car) return <NotFoundPage />;
  const details = [
    { icon: Users, label: car.seats + " seats" }, { icon: Settings2, label: car.transmission },
    { icon: Fuel, label: car.fuel }, { icon: BriefcaseBusiness, label: car.luggage + " bags" },
  ];
  const bookingParams = new URLSearchParams({
    city: params.get("city") || car.locations[0] || site.locations[0],
    pickup: params.get("pickup") || "",
    return: params.get("return") || "",
  });
  const similar = cars.filter((other) => other.id !== car.id).slice(0, 3);
  return <main className="page-container py-10 md:py-14">
    <Link to="/fleet" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"><ArrowLeft size={16} /> Back to fleet</Link>
    <div className="mb-8 flex flex-wrap items-end justify-between gap-5"><div><Badge className="mb-4">{car.category}</Badge><h1 className="display-serif text-[clamp(3rem,5.4vw,5.8rem)] leading-none">{car.name}</h1><p className="mt-4 text-muted-foreground">{car.summary}</p></div><Button variant="outline" onClick={() => toggle(car.id)} aria-pressed={isFavorite(car.id)}><Heart size={18} fill={isFavorite(car.id) ? "currentColor" : "none"} /> {isFavorite(car.id) ? "Saved" : "Save car"}</Button></div>
    <div className="grid gap-8 lg:grid-cols-[1.5fr_.75fr]">
      <div>
        <div className="relative h-[360px] overflow-hidden rounded-[32px] md:h-[520px]" style={{ backgroundColor: car.accent }}><img src={car.image} alt={"Representative photograph for " + car.name} className="size-full object-cover" /><span className="absolute bottom-5 left-5 rounded-full bg-white/95 px-4 py-2 text-xs font-semibold text-[#18392b]">Illustrative image</span></div>
        <div className="mt-8 grid gap-4 rounded-3xl border border-border bg-card p-5 sm:grid-cols-4">{details.map(({ icon: Icon, label }) => <div key={label} className="flex items-center gap-3 sm:flex-col sm:items-start"><span className="grid size-10 place-items-center rounded-xl bg-secondary text-primary"><Icon size={19} /></span><span className="text-sm font-medium">{label}</span></div>)}</div>
        <section className="mt-12"><h2 className="display-serif text-4xl">The details</h2><p className="mt-4 max-w-2xl leading-8 text-muted-foreground">Discover a car designed to make the journey feel as good as the destination. All vehicle details below are sample specifications and must be confirmed before rental.</p><div className="mt-8 grid gap-3 sm:grid-cols-2">{car.features.map((feature) => <div key={feature} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4"><span className="size-2 rounded-full bg-primary" /><span className="text-sm">{feature}</span></div>)}</div></section>
      </div>
      <aside className="lg:sticky lg:top-6 lg:self-start"><Card className="p-7"><p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Indicative daily rate</p><p className="mt-2 text-4xl font-bold">{priceLabel(car.dailyRate)}<span className="ml-2 text-sm font-normal text-muted-foreground">/ day</span></p><Separator className="my-6" /><div className="space-y-5 text-sm"><div className="flex items-start gap-3"><MapPin size={18} className="mt-0.5 text-primary" /><div><p className="font-semibold">Sample pickup locations</p><p className="mt-1 text-muted-foreground">{car.locations.join(", ")}</p></div></div><div className="flex items-start gap-3"><CalendarDays size={18} className="mt-0.5 text-primary" /><div><p className="font-semibold">Choose your dates</p><p className="mt-1 text-muted-foreground">Submit a request for confirmation</p></div></div></div><Button className="mt-7 w-full" asChild><Link to={"/book/" + car.id + "?" + bookingParams.toString()}>Request this car <ArrowRight size={18} /></Link></Button><p className="mt-4 text-center text-xs leading-5 text-muted-foreground">No payment collected. This is not a confirmed reservation.</p></Card></aside>
    </div>
    <section className="py-20"><div className="mb-8 flex items-center justify-between gap-4"><h2 className="display-serif text-4xl">More to explore</h2><Link to="/fleet" className="text-sm font-semibold text-primary hover:underline">All cars</Link></div><div className="grid gap-6 md:grid-cols-3">{similar.map((item) => <CarCard key={item.id} car={item} />)}</div></section>
  </main>;
}