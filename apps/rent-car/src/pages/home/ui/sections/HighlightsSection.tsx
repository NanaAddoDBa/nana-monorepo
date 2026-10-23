import { Compass, Heart, ShieldCheck } from "lucide-react";

const highlights = [
  {
    title: "Compare your options",
    description: "Explore cars by category and price",
    Icon: Compass,
  },
  {
    title: "Review the details",
    description: "Check features before enquiring",
    Icon: ShieldCheck,
  },
  {
    title: "Save your shortlist",
    description: "Keep your choices in this browser",
    Icon: Heart,
  },
] as const;

export function HighlightsSection() {
  return (
    <section aria-label="Rental features" className="border-y border-border bg-card py-8">
      <div className="page-container grid gap-6 text-sm md:grid-cols-3">
        {highlights.map(({ title, description, Icon }) => (
          <div className="flex items-center gap-4" key={title}>
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-secondary text-primary">
              <Icon size={22} />
            </span>
            <div>
              <p className="font-semibold">{title}</p>
              <p className="text-muted-foreground">{description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
