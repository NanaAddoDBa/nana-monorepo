import { tripFromParams } from "@rental";
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

  return (
    <main className="page-container py-10 md:py-16">
      <Link
        to={"/fleet/" + car.id + (params.toString() ? "?" + params.toString() : "")}
        className="mb-7 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft size={16} /> Back to vehicle
      </Link>
      <p className="mb-3 text-xs font-bold uppercase tracking-[.18em] text-primary">
        RENTAL ENQUIRY
      </p>
      <h1 className="display-serif mb-4 text-[clamp(3.5rem,6vw,6rem)] leading-none">
        Request a <em>car.</em>
      </h1>
      <p className="mb-10 max-w-2xl leading-7 text-muted-foreground">
        Add your trip details and contact information.
        The operator must confirm availability and terms.
      </p>

      <BookingForm car={car} initialTrip={tripFromParams(params)} />
    </main>
  );
}
