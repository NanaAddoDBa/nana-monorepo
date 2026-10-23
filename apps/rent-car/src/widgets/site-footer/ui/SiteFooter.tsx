import { Link } from "react-router-dom";
import { ArrowUpRight, CarFront } from "lucide-react";

import { site } from "@/shared/config/site";

const exploreLinks = [
  { to: "/fleet", label: "Browse fleet" },
  { to: "/favorites", label: "Saved cars" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Get in touch" },
];

const informationLinks = [
  { to: "/privacy", label: "Privacy" },
  { to: "/terms", label: "Rental information" },
];

export function SiteFooter() {
  return (
    <footer className="bg-[#142821] text-white">
      <div className="page-container grid gap-12 py-16 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <div className="mb-5 flex items-center gap-2">
            <CarFront size={26} className="text-[#a8e0be]" />
            <span className="text-2xl font-bold tracking-tighter">
              {site.name.toUpperCase()}.
            </span>
          </div>
          <p className="max-w-sm leading-7 text-white/65">
            Browse vehicle details, compare indicative rates,
            and prepare an availability enquiry.
          </p>
          <p className="mt-8 text-sm text-[#a8e0be]">{site.tagline}</p>
        </div>

        <nav aria-label="Footer navigation">
          <h2 className="mb-5 text-xs font-bold uppercase tracking-[.2em] text-[#a8e0be]">
            Explore
          </h2>
          <div className="flex flex-col gap-3 text-sm text-white/75">
            {exploreLinks.map(({ to, label }) => (
              <Link key={to} to={to} className="hover:text-white">
                {label}
                {to === "/contact" && (
                  <ArrowUpRight className="ml-1 inline" size={14} />
                )}
              </Link>
            ))}
          </div>
        </nav>

        <nav aria-label="Footer information">
          <h2 className="mb-5 text-xs font-bold uppercase tracking-[.2em] text-[#a8e0be]">
            Information
          </h2>
          <div className="flex flex-col gap-3 text-sm text-white/75">
            {informationLinks.map(({ to, label }) => (
              <Link key={to} to={to} className="hover:text-white">
                {label}
              </Link>
            ))}
            <p className="max-w-xs leading-6 text-white/45">
              Listed vehicles and rates are examples.
              Final availability and pricing require confirmation.
            </p>
          </div>
        </nav>
      </div>

      <div className="border-t border-white/15">
        <div className="page-container flex flex-wrap justify-between gap-3 py-6 text-xs text-white/50">
          <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
          <p>{site.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
