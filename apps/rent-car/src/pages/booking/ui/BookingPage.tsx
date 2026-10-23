import { Link, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { findCar } from "@/entities/car/model/cars";
import { BookingForm } from "@/features/booking/ui/BookingForm";
import { NotFoundPage } from "@/pages/not-found/ui/NotFoundPage";

export function BookingPage() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const car = findCar(id);
  if (!car) return <NotFoundPage />;
  return <main className="page-container py-10 md:py-16"><Link to={"/fleet/" + car.id} className="mb-7 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"><ArrowLeft size={16} /> Back to vehicle</Link><p className="mb-3 text-xs font-bold uppercase tracking-[.18em] text-primary">PLAN YOUR JOURNEY</p><h1 className="display-serif mb-4 text-[clamp(3.5rem,6vw,6rem)] leading-none">Make a <em>request.</em></h1><p className="mb-10 max-w-2xl leading-7 text-muted-foreground">Prepare your trip details. An operator must confirm availability before any rental is booked.</p><BookingForm car={car} initialCity={params.get("city") || undefined} initialPickup={params.get("pickup") || undefined} initialReturn={params.get("return") || undefined} /></main>;
}