import { Link } from "react-router-dom";
import { ArrowRight, Heart } from "lucide-react";
import { cars } from "@/entities/car/model/cars";
import { useFavorites } from "@/features/favorites/model/FavoritesProvider";
import { Button } from "@/shared/ui/button";
import { CarCard } from "@/widgets/car-card/ui/CarCard";

export function FavoritesPage() {
  const { favorites } = useFavorites();
  const savedCars = cars.filter((car) => favorites.includes(car.id));
  return <main className="page-container min-h-[65vh] py-14 md:py-20"><p className="mb-4 text-xs font-bold uppercase tracking-[.2em] text-primary">YOUR SHORTLIST</p><h1 className="display-serif text-[clamp(3.3rem,6vw,6rem)]">Saved for later.</h1><p className="mb-10 mt-4 text-muted-foreground">Your favorite cars are saved in this browser, so you can come back to them.</p>{savedCars.length ? <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{savedCars.map((car) => <CarCard key={car.id} car={car} />)}</div> : <div className="flex flex-col items-center rounded-[30px] border border-dashed border-border bg-card px-5 py-20 text-center"><span className="mb-6 grid size-18 place-items-center rounded-full bg-secondary text-primary"><Heart size={32} /></span><h2 className="text-2xl font-semibold">Nothing saved just yet</h2><p className="mt-3 max-w-sm leading-7 text-muted-foreground">Tap the heart on any vehicle to keep it in your personal shortlist.</p><Button className="mt-7" asChild><Link to="/fleet">Browse vehicles <ArrowRight size={18} /></Link></Button></div>}</main>;
}