import type { HeroSlide as HeroSlideData } from "@/types/heroTypes"
import { cn } from "@/lib/utils"

import { HeroActions } from "./heroActions"

type HeroSlideProps = {
  slide: HeroSlideData
  headingId?: string
}

export function HeroSlide({ slide, headingId }: Readonly<HeroSlideProps>) {
  const isCompact = slide.density === "compact"

  return (
    <div className="flex h-full items-center">
      <div className="grid w-full grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10">
        <div className="flex flex-col gap-5 lg:col-span-7 xl:col-span-6">
          <p className="text-[0.66rem] font-semibold tracking-[0.22em] text-primary uppercase">
            {slide.eyebrow}
          </p>

          <div className={cn("flex flex-col", isCompact ? "gap-2.5" : "gap-3")}>
            <h1
              id={headingId}
              className={cn(
                "font-heading leading-[0.98] font-bold tracking-[-0.04em] text-foreground",
                isCompact
                  ? "text-3xl sm:text-[3.2rem] md:text-[3.45rem] lg:text-[3.55rem] xl:text-[3.7rem]"
                  : "text-3xl sm:text-4xl md:text-[3rem] lg:text-[3.35rem] xl:text-[3.65rem]"
              )}
            >
              {slide.title}
            </h1>

            {slide.highlightLine ? (
              <p
                className={cn(
                  "font-heading leading-none font-light tracking-[-0.03em] text-primary/80 italic",
                  isCompact
                    ? "text-[1.7rem] sm:text-[2rem] md:text-[2.35rem] lg:text-[2.45rem] xl:text-[2.65rem]"
                    : "text-[1.9rem] sm:text-[2.3rem] md:text-[2.6rem] lg:text-[2.75rem] xl:text-[3rem]"
                )}
              >
                {slide.highlightLine}
              </p>
            ) : null}

            <p
              className={cn(
                "text-muted-foreground",
                isCompact
                  ? "text-sm leading-7 md:text-[0.92rem] md:leading-7"
                  : "text-sm leading-7 md:text-[0.95rem] md:leading-8"
              )}
            >
              {slide.description}
            </p>
          </div>

          {slide.supportingPoints?.length ? (
            <ul className="flex flex-wrap gap-2.5 pt-1">
              {slide.supportingPoints.map((point) => (
                <li
                  key={point}
                  className="rounded-full border border-border bg-secondary px-3 py-1.5 text-xs text-secondary-foreground sm:text-sm"
                >
                  {point}
                </li>
              ))}
            </ul>
          ) : null}

          <HeroActions
            primaryAction={slide.primaryAction}
            secondaryAction={slide.secondaryAction}
            size={isCompact ? "compact" : "default"}
          />
        </div>

        <div className="lg:col-span-5 xl:col-span-6">
          <div className="mx-auto aspect-[4/5] w-full max-w-[320px] rounded-2xl border border-border/70 bg-card/40 shadow-sm backdrop-blur-sm lg:mr-0 lg:ml-auto">
            <div className="flex h-full items-center justify-center rounded-2xl border border-border/40 bg-gradient-to-b from-background/40 to-card/60">
              <span className="text-sm text-muted-foreground">
                Hero visual panel
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
