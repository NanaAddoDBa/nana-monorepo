import Image from "next/image"

import { projectsData } from "@/data/projectsData"
import { skillsData } from "@/data/skillsData"
import type { HeroSlide as HeroSlideData } from "@/types/heroSectionTypes"
import { cn } from "@/lib/utils"

import { HeroActions } from "./heroActions"

type HeroSlideProps = {
  slide: HeroSlideData
  headingId?: string
}

type HeroTextProps = {
  slide: HeroSlideData
  headingId?: string
}

function HeroText({ slide, headingId }: Readonly<HeroTextProps>) {
  const isCompact = slide.density === "compact"

  return (
    <div className="flex min-w-0 flex-col justify-center gap-4 lg:gap-5">
      <p className="text-[0.66rem] font-semibold tracking-[0.22em] text-primary uppercase">
        {slide.eyebrow}
      </p>

      <div className={cn("flex flex-col", isCompact ? "gap-2.5" : "gap-3")}>
        <h1
          id={headingId}
          className={cn(
            "max-w-[20ch] font-heading leading-[0.95] font-bold tracking-[-0.04em] text-balance text-foreground lg:max-w-[22ch]",
            "text-[clamp(2rem,3vw,3.2rem)]"
          )}
        >
          {slide.title}
        </h1>

        {slide.highlightLine ? (
          <p
            className={cn(
              "max-w-[22ch] font-heading leading-none font-light tracking-[-0.02em] text-primary/85 italic",
              "text-[clamp(1.4rem,2vw,2.2rem)]"
            )}
          >
            {slide.highlightLine}
          </p>
        ) : null}

        <p
          className={cn(
            "max-w-[55ch] text-muted-foreground",
            "text-[clamp(0.9rem,1vw,1.05rem)]"
          )}
        >
          {slide.description}
        </p>
      </div>

      {slide.variant === "image" && slide.supportingPoints?.length ? (
        <ul className="flex max-w-[42rem] flex-wrap gap-2 pt-1">
          {slide.supportingPoints.map((point) => (
            <li
              key={point}
              className="rounded-full border border-border bg-secondary px-3 py-1 text-xs text-secondary-foreground sm:text-sm"
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
  )
}

function HeroImagePreview({
  slide,
  headingId,
}: Readonly<{
  slide: Extract<HeroSlideData, { variant: "image" }>
  headingId?: string
}>) {
  return (
    <div className="flex justify-center lg:justify-end">
      <div className="w-full max-w-[20rem] lg:max-w-[22rem] xl:max-w-[24rem]">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] border border-border/70 bg-card shadow-[0_18px_45px_-25px_rgba(0,0,0,0.3)]">
          <Image
            src={slide.image.src}
            alt={slide.image.alt}
            fill
            className="object-cover"
            priority={headingId === "hero-heading"}
          />
        </div>
      </div>
    </div>
  )
}

function HeroSkillsPreview() {
  return (
    <div className="flex justify-start lg:justify-end">
      <div className="w-full max-w-[24rem] space-y-4">
        {skillsData.programming.slice(0, 3).map((group) => (
          <div
            key={group.category}
            className="rounded-xl border border-border/60 bg-card/50 p-4"
          >
            <p className="mb-2 text-xs tracking-widest text-muted-foreground uppercase">
              {group.category}
            </p>

            <p className="text-sm text-muted-foreground">
              {group.items.map((item) => item.name).join(", ")}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

function HeroProjectsPreview() {
  return (
    <div className="flex justify-start lg:justify-end">
      <div className="w-full max-w-[24rem] rounded-xl border border-border/60 bg-card/60 p-5 shadow-sm">
        <p className="mb-4 text-center text-xs tracking-widest text-muted-foreground uppercase">
          Selected Case Studies
        </p>

        <div className="space-y-3">
          {projectsData.items
            .filter((project) => project.featured)
            .slice(0, 4)
            .map((project) => (
              <a
                key={project.id}
                href={`#${project.id}`}
                className="block rounded-lg border border-border/50 bg-secondary/40 p-3 transition hover:bg-secondary/60"
              >
                <p className="text-sm font-medium text-foreground">
                  {project.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {project.category}
                </p>
              </a>
            ))}
        </div>
      </div>
    </div>
  )
}

export function HeroSlide({ slide, headingId }: Readonly<HeroSlideProps>) {
  return (
    <div className="w-full">
      <div
        className={cn(
          "grid w-full items-center gap-y-8 lg:gap-y-0",
          slide.variant === "image"
            ? "lg:grid-cols-[minmax(0,1fr)_minmax(22rem,26rem)] lg:gap-x-10 xl:gap-x-14"
            : "lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-x-6 xl:gap-x-8"
        )}
      >
        <HeroText slide={slide} headingId={headingId} />

        {slide.variant === "image" ? (
          <HeroImagePreview slide={slide} headingId={headingId} />
        ) : null}

        {slide.variant === "skills" ? <HeroSkillsPreview /> : null}

        {slide.variant === "projects" ? <HeroProjectsPreview /> : null}
      </div>
    </div>
  )
}
