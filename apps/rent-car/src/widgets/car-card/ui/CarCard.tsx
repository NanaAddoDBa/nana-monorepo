import { Link } from "react-router-dom";
import { ArrowUpRight, Fuel, Heart, Settings2, Users } from "lucide-react";
import type { Car } from "@/entities/car/model/cars";
import { useFavorites } from "@/features/favorites/model/FavoritesProvider";
import { priceLabel } from "@/shared/config/site";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";

export function CarCard({ car }: { car: Car }) {
  const { isFavorite, toggle } = useFavorites();
  const saved = isFavorite(car.id);
  return (
    <Card className="group overflow-hidden border-border/80 shadow-none transition-shadow hover:shadow-lg">
      <div className="relative h-57 overflow-hidden" style={{ backgroundColor: car.accent }}>
        <img className="vehicle-photo" src={car.image} alt={"Illustrative photograph for " + car.name} loading="lazy" decoding="async" />
        <Badge className="absolute left-4 top-4 bg-white/95 text-[#26392f]">{car.category}</Badge>
        <button type="button" aria-label={(saved ? "Remove " : "Save ") + car.name + (saved ? " from" : " to") + " favorites"} aria-pressed={saved} onClick={() => toggle(car.id)} className="absolute right-4 top-4 grid size-10 cursor-pointer place-items-center rounded-full bg-white/95 text-[#26392f] shadow-sm transition-colors hover:text-[#176b58]"><Heart size={19} fill={saved ? "currentColor" : "none"} /></button>
      </div>
      <div className="p-6">
        <div className="mb-2 flex items-start justify-between gap-3">
          <div><h3 className="text-xl font-bold tracking-tight">{car.name}</h3><p className="mt-1 text-sm text-muted-foreground">{car.summary}</p></div>
        </div>
        <div className="my-5 grid grid-cols-3 gap-3 border-y border-border py-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><Users size={15} />{car.seats} seats</span>
          <span className="flex items-center gap-1.5"><Settings2 size={15} />{car.transmission}</span>
          <span className="flex items-center gap-1.5"><Fuel size={15} />{car.fuel}</span>
        </div>
        <div className="flex items-end justify-between gap-4">
          <div><p className="text-xs text-muted-foreground">Indicative from</p><p className="mt-0.5 text-2xl font-bold">{priceLabel(car.dailyRate)}<span className="ml-1 text-xs font-normal text-muted-foreground">/ day</span></p></div>
          <Button size="sm" asChild><Link to={"/fleet/" + car.id}>View car <ArrowUpRight size={16} /></Link></Button>
        </div>
      </div>
    </Card>
  );
}