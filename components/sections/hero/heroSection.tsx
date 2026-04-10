"use client"

import * as React from "react"
import Autoplay from "embla-carousel-autoplay"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
import { heroSlidesData } from "@/data/heroSlidesData"
import { cn } from "@/lib/utils"
import { SectionShell } from "@/components/shared/sectionShell"
import { HeroSlide } from "./heroSlide"
import { HeroSlideFrame } from "./heroSlideFrame"

export function HeroSection() {
  const [api, setApi] = React.useState<CarouselApi>()
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [slideCount, setSlideCount] = React.useState(0)

  const autoplay = React.useRef(
    Autoplay({
      delay: 5000,
    })
  )

  React.useEffect(() => {
    if (!api) {
      return
    }

    const updateCarouselState = () => {
      setCurrentIndex(api.selectedScrollSnap())
      setSlideCount(api.scrollSnapList().length)
    }

    updateCarouselState()
    api.on("select", updateCarouselState)
    api.on("reInit", updateCarouselState)

    return () => {
      api.off("select", updateCarouselState)
      api.off("reInit", updateCarouselState)
    }
  }, [api])

  return (
    <SectionShell id="hero" className="relative">
      <div
        className="relative"
        onMouseEnter={() => autoplay.current.stop()}
        onMouseLeave={() => autoplay.current.play()}
      >
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[autoplay.current]}
          className="w-full"
        >
          <CarouselContent>
            {heroSlidesData.map((slide, index) => (
              <CarouselItem key={slide.id}>
                <HeroSlideFrame>
                  <HeroSlide
                    slide={slide}
                    headingId={index === 0 ? "hero-heading" : undefined}
                  />
                </HeroSlideFrame>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <Button
          type="button"
          variant="outline"
          size="icon"
          className="absolute top-1/2 left-2 z-10 hidden -translate-y-1/2 rounded-full md:inline-flex"
          aria-label="Previous slide"
          onClick={() => api?.scrollPrev()}
        >
          <ChevronLeft />
        </Button>

        <Button
          type="button"
          variant="outline"
          size="icon"
          className="absolute top-1/2 right-2 z-10 hidden -translate-y-1/2 rounded-full md:inline-flex"
          aria-label="Next slide"
          onClick={() => api?.scrollNext()}
        >
          <ChevronRight />
        </Button>

        <div className="pointer-events-none absolute inset-x-0 bottom-4 z-10 flex justify-center">
          <div className="pointer-events-auto flex items-center gap-2">
            {Array.from({ length: slideCount }).map((_, index) => (
              <button
                key={`hero-pagination-${index}`}
                type="button"
                aria-label={`Go to slide ${index + 1}`}
                aria-current={currentIndex === index ? "true" : undefined}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  currentIndex === index
                    ? "w-8 bg-foreground"
                    : "w-5 bg-border hover:bg-muted-foreground"
                )}
                onClick={() => api?.scrollTo(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </SectionShell>
  )
}
