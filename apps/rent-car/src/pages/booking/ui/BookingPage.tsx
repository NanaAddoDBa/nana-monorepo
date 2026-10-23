import { tripFromParams } from "@rental";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { findCar } from "@/entities/car/model/cars";
import { CheckoutForm } from "@/features/checkout/ui/CheckoutForm";
import { NotFoundPage } from "@/pages/not-found/ui/NotFoundPage";
import { site } from "@/shared/config/site";

export function BookingPage() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const car = findCar(id);

  if (!car) return <NotFoundPage />;
  const fleetUrl = "/fleet" + (params.toString() ? "?" + params.toString() : "");
  return (
    <main className="page-container py-10 md:py-14">
      <Link to={fleetUrl} className="mb-6 inline-flex items-center gap-2 text-sm text-primary">
        <ArrowLeft size={16}/> Back to car selection
      </Link>
      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-primary">
        {site.usePaidBookings ? "SECURE GUEST CHECKOUT" : "RENTAL REQUEST"}
      </p>
      <h1 className="display-serif text-[clamp(3rem,5.8vw,5.5rem)] leading-none">
        {site.usePaidBookings ? <>Book your <em>car.</em></> : <>Plan your <em>rental.</em></>}
      </h1>
      <p className="mb-8 mt-4 max-w-2xl leading-7 text-muted-foreground">
        {site.usePaidBookings
          ? "Verify your rental price, enter your details and pay securely. Pickup details follow once payment is confirmed."
          : "Check your preferred trip and prepare an enquiry. No payment or reservation is completed on this demonstration."}
      </p>
      <CheckoutForm car={car} initialTrip={tripFromParams(params)}
        cancelled={params.get("cancelled") === "1"}/>
    </main>
  );
}
