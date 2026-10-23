import { BriefcaseBusiness, Fuel, Settings2, Users } from "lucide-react";

import type { Car } from "@/entities/car/model/cars";

export function VehicleSpecifications({ car }: { car: Car }) {
  const specifications = [
    { label: car.seats + " seats", Icon: Users },
    { label: car.transmission, Icon: Settings2 },
    { label: car.fuel, Icon: Fuel },
    { label: car.luggage + " bags", Icon: BriefcaseBusiness },
  ];

  return (
    <>
      <div className="mt-8 grid gap-4 rounded-3xl border border-border bg-card p-5 sm:grid-cols-4">
        {specifications.map(({ label, Icon }) => (
          <div key={label} className="flex items-center gap-3 sm:flex-col sm:items-start">
            <span className="grid size-10 place-items-center rounded-xl bg-secondary text-primary">
              <Icon size={19} />
            </span>
            <span className="text-sm font-medium">{label}</span>
          </div>
        ))}
      </div>

      <section className="mt-12">
        <h2 className="display-serif text-4xl">Vehicle features</h2>
        <p className="mt-4 max-w-2xl leading-8 text-muted-foreground">
          These specifications are examples and must be confirmed with
          the rental operator before making an agreement.
        </p>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {car.features.map((feature) => (
            <li
              key={feature}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4"
            >
              <span className="size-2 rounded-full bg-primary" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
