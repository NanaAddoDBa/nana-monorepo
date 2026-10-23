import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Check, ChevronRight, Compass } from "lucide-react";

import { cars } from "@/entities/car/model/cars";
import { priceLabel } from "@/shared/config/site";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { SearchForm } from "@/widgets/search-form/ui/SearchForm";

const lowestDailyRate = Math.min(...cars.map((car) => car.dailyRate));

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pb-12 pt-12 md:pb-20 md:pt-18">
      <div className="page-container grid items-center gap-10 lg:grid-cols-[1.04fr_.96fr] lg:gap-8">
        <div className="relative z-10 pb-1 lg:pb-12">
          <Badge className="mb-7 gap-2 bg-secondary text-secondary-foreground">
            Car rental, simplified
          </Badge>
          <h1 className="display-serif max-w-[650px] text-[clamp(4rem,7.2vw,7.7rem)] leading-[.98]">
            Find your next <em className="text-primary">car.</em>
          </h1>
          <p className="mt-8 max-w-[490px] text-base leading-8 text-muted-foreground md:text-lg">
            Compare vehicle types and daily rates, save your favorites,
            and send a request for your preferred rental dates.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <Link to="/fleet">
                Explore the fleet <ArrowUpRight size={19} />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/about">
                How it works <ArrowRight size={18} />
              </Link>
            </Button>
          </div>
          <div className="mt-12 flex flex-wrap gap-5 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <Check className="text-primary" size={18} /> Compare cars
            </span>
            <span className="flex items-center gap-2">
              <Check className="text-primary" size={18} /> Request availability
            </span>
          </div>
        </div>

        <div className="relative min-h-[390px] md:min-h-[550px] lg:min-h-[620px]">
          <div className="hero-visual absolute inset-0 overflow-hidden">
            <img
              src={cars[2].image}
              alt="SUV on the road"
              className="hero-image"
              fetchPriority="high"
            />
          </div>
          <div className="absolute left-[-2%] top-[12%] rounded-2xl border border-white/50 bg-white/90 p-4 text-[#1a3028] shadow-xl backdrop-blur sm:left-[-5%]">
            <Compass size={21} />
            <p className="mt-2 text-xs font-semibold tracking-widest">
              OUR FLEET
            </p>
            <p className="text-xs opacity-60">Explore by category</p>
          </div>
          <div className="absolute bottom-[6%] right-[-2%] rounded-[22px] bg-white p-5 text-[#173428] shadow-2xl sm:right-[-4%]">
            <p className="text-xs uppercase tracking-widest opacity-60">
              Indicative from
            </p>
            <p className="mt-1 text-3xl font-bold">
              {priceLabel(lowestDailyRate)}
              <span className="text-sm font-normal opacity-65"> / day</span>
            </p>
            <Link
              to="/fleet"
              className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-[#176b58]"
            >
              See the fleet <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      <div className="page-container relative z-20 mt-7 lg:mt-[-16px]">
        <SearchForm />
      </div>
    </section>
  );
}
