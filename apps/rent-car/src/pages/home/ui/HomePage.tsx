import { CallToActionSection } from "@/pages/home/ui/sections/CallToActionSection";
import { FeaturedSection } from "@/pages/home/ui/sections/FeaturedSection";
import { HeroSection } from "@/pages/home/ui/sections/HeroSection";
import { HighlightsSection } from "@/pages/home/ui/sections/HighlightsSection";
import { HowItWorksSection } from "@/pages/home/ui/sections/HowItWorksSection";

export function HomePage() {
  return (
    <main>
      <HeroSection />
      <HighlightsSection />
      <FeaturedSection />
      <HowItWorksSection />
      <CallToActionSection />
    </main>
  );
}
