import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Check, ChevronRight, Compass, Heart, ShieldCheck, Sparkles } from "lucide-react";
import { cars } from "@/entities/car/model/cars";
import { SearchForm } from "@/widgets/search-form/ui/SearchForm";
import { CarCard } from "@/widgets/car-card/ui/CarCard";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { priceLabel } from "@/shared/config/site";

const steps = [
  { number: "01", title: "Find your fit", description: "Explore the collection and filter by the things that matter to you." },
  { number: "02", title: "Plan your dates", description: "Pick your location and rental dates to prepare a clear request." },
  { number: "03", title: "Make it yours", description: "Contact the operator to confirm availability, terms and a final quote." },
];

export function HomePage() {
  const featured = [cars[1], cars[2], cars[0]];
  return <main>
    <section className="relative overflow-hidden pb-12 pt-12 md:pb-20 md:pt-18">
      <div className="page-container grid items-center gap-10 lg:grid-cols-[1.04fr_.96fr] lg:gap-8">
        <div className="relative z-10 pb-1 lg:pb-12">
          <Badge className="mb-7 gap-2 bg-secondary text-secondary-foreground"><Sparkles size={13} />Your next chapter starts here</Badge>
          <h1 className="display-serif max-w-[650px] text-[clamp(4rem,7.2vw,7.7rem)] leading-[.98]">Your road.<br />Your <em className="text-primary">rules.</em></h1>
          <p className="mt-8 max-w-[490px] text-base leading-8 text-muted-foreground md:text-lg">Find the perfect ride for a city escape, a spontaneous weekend, or wherever life takes you next.</p>
          <div className="mt-9 flex flex-wrap gap-3"><Button size="lg" asChild><Link to="/fleet">Explore the fleet <ArrowUpRight size={19} /></Link></Button><Button size="lg" variant="outline" asChild><Link to="/about">Our story <ArrowRight size={18} /></Link></Button></div>
          <div className="mt-12 flex flex-wrap gap-5 text-sm text-muted-foreground"><span className="flex items-center gap-2"><Check className="text-primary" size={18} />Curated choices</span><span className="flex items-center gap-2"><Check className="text-primary" size={18} />Simple requests</span></div>
        </div>
        <div className="relative min-h-[390px] md:min-h-[550px] lg:min-h-[620px]">
          <div className="hero-visual absolute inset-0 overflow-hidden">
            <img src={cars[2].image} alt="Illustrative SUV on the road" className="hero-image" fetchPriority="high" />
          </div>
          <div className="absolute left-[-2%] top-[12%] rounded-2xl border border-white/50 bg-white/90 p-4 text-[#1a3028] shadow-xl backdrop-blur sm:left-[-5%]"><Compass size={21} /><p className="mt-2 text-xs font-semibold tracking-widest">THE OPEN ROAD</p><p className="text-xs opacity-60">Made for the moments</p></div>
          <div className="absolute bottom-[6%] right-[-2%] rounded-[22px] bg-white p-5 text-[#173428] shadow-2xl sm:right-[-4%]"><p className="text-xs uppercase tracking-widest opacity-60">Explore from</p><p className="mt-1 text-3xl font-bold">{priceLabel(58)}<span className="text-sm font-normal opacity-65"> / day</span></p><Link to="/fleet" className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-[#176b58]">See the fleet <ChevronRight size={16} /></Link></div>
        </div>
      </div>
      <div className="page-container relative z-20 mt-7 lg:mt-[-16px]"><SearchForm /></div>
    </section>
    <section className="border-y border-border bg-card py-8">
      <div className="page-container grid gap-6 text-sm md:grid-cols-3">
        <div className="flex items-center gap-4"><span className="grid size-12 shrink-0 place-items-center rounded-full bg-secondary text-primary"><Compass size={22} /></span><div><p className="font-semibold">Your journey, your choice</p><p className="text-muted-foreground">Browse without pressure</p></div></div>
        <div className="flex items-center gap-4"><span className="grid size-12 shrink-0 place-items-center rounded-full bg-secondary text-primary"><ShieldCheck size={22} /></span><div><p className="font-semibold">Details before you decide</p><p className="text-muted-foreground">Review essentials up front</p></div></div>
        <div className="flex items-center gap-4"><span className="grid size-12 shrink-0 place-items-center rounded-full bg-secondary text-primary"><Heart size={22} /></span><div><p className="font-semibold">Save what you love</p><p className="text-muted-foreground">Keep your shortlist handy</p></div></div>
      </div>
    </section>
    <section className="section-spacing page-container" id="featured">
      <div className="mb-9 flex flex-wrap items-end justify-between gap-6">
        <div><p className="mb-3 text-xs font-bold uppercase tracking-[.2em] text-primary">Find your drive</p><h2 className="display-serif text-[clamp(2.9rem,5.5vw,5rem)] leading-[1.05]">A car for <em>every</em> plan.</h2><p className="mt-4 max-w-lg text-muted-foreground">A few standouts from our illustrative collection. Find your kind of freedom.</p></div>
        <Button variant="outline" asChild><Link to="/fleet">View all cars <ArrowUpRight size={17} /></Link></Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{featured.map((car) => <CarCard key={car.id} car={car} />)}</div>
    </section>
    <section className="section-spacing bg-secondary/60">
      <div className="page-container grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-24">
        <div><p className="mb-4 text-xs font-bold uppercase tracking-[.2em] text-primary">How it works</p><h2 className="display-serif text-[clamp(3rem,5.5vw,5.8rem)] leading-[1.03]">The best trips start <em>simple.</em></h2><p className="mt-6 max-w-md leading-8 text-muted-foreground">Less time figuring out the details, more time imagining the destination. Three clear steps to your rental request.</p><Button className="mt-8" asChild><Link to="/fleet">Find your car <ArrowRight size={18} /></Link></Button></div>
        <div className="divide-y divide-border border-t border-border">
          {steps.map((step) => <div className="grid gap-5 py-8 sm:grid-cols-[60px_1fr] sm:py-10" key={step.number}><span className="display-serif text-3xl text-primary">{step.number}</span><div><h3 className="text-2xl font-semibold">{step.title}</h3><p className="mt-2 max-w-md leading-7 text-muted-foreground">{step.description}</p></div></div>)}
        </div>
      </div>
    </section>
    <section className="page-container py-24">
      <div className="relative overflow-hidden rounded-[36px] bg-[#164936] px-7 py-14 text-white sm:px-14 sm:py-18 md:py-24">
        <div className="mesh-accent absolute inset-0 opacity-20" aria-hidden="true" />
        <div className="relative z-10 max-w-2xl"><p className="mb-5 text-xs font-bold uppercase tracking-[.2em] text-[#afe4c3]">Your adventure awaits</p><h2 className="display-serif text-[clamp(3rem,6vw,6rem)] leading-[1.03]">Where will you go <em>next?</em></h2><p className="mt-6 max-w-lg leading-7 text-white/75">From the daily commute to the unforgettable detour — see what is possible.</p><Button size="lg" className="mt-8 bg-white text-[#174936] hover:bg-white/90" asChild><Link to="/fleet">Explore the collection <ArrowUpRight size={19} /></Link></Button></div>
        <div className="pointer-events-none absolute -bottom-20 -right-20 size-80 rounded-full border-[65px] border-white/10 md:size-[450px]" />
      </div>
    </section>
  </main>;
}