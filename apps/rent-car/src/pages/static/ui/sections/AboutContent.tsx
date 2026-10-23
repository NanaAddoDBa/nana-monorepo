import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck } from "lucide-react";

import { Button } from "@/shared/ui/button";

const benefits = [
  {
    title: "Compare confidently",
    description: "Review seating, transmission, features, and daily rates.",
  },
  {
    title: "Plan your dates",
    description: "Choose pickup and return dates before making a request.",
  },
  {
    title: "Stay organized",
    description: "Save your favorite vehicles in your browser.",
  },
] as const;

export function AboutContent() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {benefits.map(({ title, description }) => (
        <article
          key={title}
          className="rounded-3xl border border-border bg-card p-7"
        >
          <ShieldCheck size={24} className="mb-5 text-primary" />
          <h2 className="text-xl font-bold">{title}</h2>
          <p className="mt-3 leading-7 text-muted-foreground">
            {description}
          </p>
        </article>
      ))}

      <Button asChild className="mt-4 w-fit md:col-span-3">
        <Link to="/fleet">
          Explore the fleet <ArrowRight size={17} />
        </Link>
      </Button>
    </div>
  );
}
