import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

import { Button } from "@/shared/ui/button";

export function CallToActionSection() {
  return (
    <section className="page-container py-24">
      <div className="relative overflow-hidden rounded-[36px] bg-[#164936] px-7 py-14 text-white sm:px-14 sm:py-18 md:py-24">
        <div className="mesh-accent absolute inset-0 opacity-20" aria-hidden="true" />
        <div className="relative z-10 max-w-2xl">
          <p className="mb-5 text-xs font-bold uppercase tracking-[.2em] text-[#afe4c3]">
            Choose your vehicle
          </p>
          <h2 className="display-serif text-[clamp(3rem,6vw,6rem)] leading-[1.03]">
            Ready to <em>explore?</em>
          </h2>
          <p className="mt-6 max-w-lg leading-7 text-white/75">
            Browse the available vehicle types, compare indicative rates,
            and prepare your rental request.
          </p>
          <Button
            size="lg"
            className="mt-8 bg-white text-[#174936] hover:bg-white/90"
            asChild
          >
            <Link to="/fleet">
              Explore the fleet <ArrowUpRight size={19} />
            </Link>
          </Button>
        </div>
        <div className="pointer-events-none absolute -bottom-20 -right-20 size-80 rounded-full border-[65px] border-white/10 md:size-[450px]" />
      </div>
    </section>
  );
}
