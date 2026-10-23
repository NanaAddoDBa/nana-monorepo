import { Link } from "react-router-dom";
import { ArrowUpRight, CarFront } from "lucide-react";
import { site } from "@/shared/config/site";

export function SiteFooter() {
  return (
    <footer className="bg-[#142821] text-white">
      <div className="page-container grid gap-12 py-16 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <div className="mb-5 flex items-center gap-2"><CarFront size={26} className="text-[#a8e0be]" /><span className="text-2xl font-bold tracking-tighter">AVENTRA.</span></div>
          <p className="max-w-sm leading-7 text-white/65">Thoughtful driving starts with the right car. Browse at your pace and request the ride that fits the journey.</p>
          <p className="mt-8 text-sm text-[#a8e0be]">{site.tagline}</p>
        </div>
        <div>
          <p className="mb-5 text-xs font-bold uppercase tracking-[.2em] text-[#a8e0be]">Explore</p>
          <div className="flex flex-col gap-3 text-sm text-white/75">
            <Link to="/fleet" className="hover:text-white">Browse fleet</Link>
            <Link to="/favorites" className="hover:text-white">Saved cars</Link>
            <Link to="/about" className="hover:text-white">Our approach</Link>
            <Link to="/contact" className="hover:text-white">Get in touch <ArrowUpRight className="inline" size={14} /></Link>
          </div>
        </div>
        <div>
          <p className="mb-5 text-xs font-bold uppercase tracking-[.2em] text-[#a8e0be]">Information</p>
          <div className="flex flex-col gap-3 text-sm text-white/75">
            <Link to="/privacy" className="hover:text-white">Privacy</Link>
            <Link to="/terms" className="hover:text-white">Rental terms</Link>
            <p className="max-w-xs leading-6 text-white/45">All vehicles, rates and locations on this demonstration are illustrative until verified by an operator.</p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/15">
        <div className="page-container flex flex-wrap justify-between gap-3 py-6 text-xs text-white/50"><p>© {new Date().getFullYear()} Aventra concept. Independent adaptation.</p><p>Built to move better.</p></div>
      </div>
    </footer>
  );
}