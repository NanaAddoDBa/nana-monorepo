import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { Button } from "@/shared/ui/button";

const steps = [
  {
    number: "01",
    title: "Browse the fleet",
    description: "Find cars by category, location, transmission and daily rate.",
  },
  {
    number: "02",
    title: "Select your dates",
    description: "Choose pickup and return dates and review the base estimate.",
  },
  {
    number: "03",
    title: "Request availability",
    description: "Send the prepared enquiry to confirm terms and availability.",
  },
] as const;

export function HowItWorksSection() {
  return (
    <section className="section-spacing bg-secondary/60">
      <div className="page-container grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-24">
        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-[.2em] text-primary">
            How it works
          </p>
          <h2 className="display-serif text-[clamp(3rem,5.5vw,5.8rem)] leading-[1.03]">
            Three simple <em>steps.</em>
          </h2>
          <p className="mt-6 max-w-md leading-8 text-muted-foreground">
            From comparing cars to preparing a rental request, the process is
            designed to be straightforward.
          </p>
          <Button className="mt-8" asChild>
            <Link to="/fleet">
              Find your car <ArrowRight size={18} />
            </Link>
          </Button>
        </div>

        <ol className="divide-y divide-border border-t border-border">
          {steps.map(({ number, title, description }) => (
            <li
              className="grid gap-5 py-8 sm:grid-cols-[60px_1fr] sm:py-10"
              key={number}
            >
              <span className="display-serif text-3xl text-primary">
                {number}
              </span>
              <div>
                <h3 className="text-2xl font-semibold">{title}</h3>
                <p className="mt-2 max-w-md leading-7 text-muted-foreground">
                  {description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
