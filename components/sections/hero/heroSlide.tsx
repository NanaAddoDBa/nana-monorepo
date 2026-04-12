import Image from "next/image"

import type { HeroSlide as HeroSlideData } from "@/types/heroSectionTypes"
import { cn } from "@/lib/utils"

import { HeroActions } from "./heroActions"
import { skillsData } from "@/data/skillsData"
import { projectsData } from "@/data/projectsData"

type HeroSlideProps = {
  slide: HeroSlideData
  headingId?: string
}

export function HeroSlide({ slide, headingId }: Readonly<HeroSlideProps>) {
  const isCompact = slide.density === "compact"

  const isImage = slide.variant === "image"
  const isSkills = slide.variant === "skills"
  const isProjects = slide.variant === "projects"

  return (
    <div className="w-full">
      {/* ===== IMAGE SLIDE (GRID) ===== */}
      {isImage ? (
        <div className="grid w-full items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,26rem)]">
          {/* LEFT */}
          <div className="flex flex-col gap-4">
            <HeroText
              slide={slide}
              headingId={headingId}
              isCompact={isCompact}
            />
          </div>

          {/* RIGHT IMAGE */}
          <div className="flex justify-end">
            <div className="w-full max-w-[22rem] xl:max-w-[24rem]">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] border border-border/70 bg-card shadow-[0_18px_45px_-25px_rgba(0,0,0,0.3)]">
                <Image
                  src={slide.image!.src}
                  alt={slide.image!.alt}
                  fill
                  className="object-cover"
                  priority={headingId === "hero-heading"}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ===== NON-IMAGE SLIDES (FLEX — THIS FIXES YOUR PROBLEM) ===== */
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
          {/* LEFT */}
          <div className="max-w-[60%]">
            <HeroText
              slide={slide}
              headingId={headingId}
              isCompact={isCompact}
            />
          </div>

          {/* RIGHT */}
          {isSkills && (
            <div className="w-full max-w-[28rem] space-y-4">
              {skillsData.programming.slice(0, 3).map((group) => (
                <div
                  key={group.category}
                  className="rounded-xl border border-border/60 bg-card/50 p-4"
                >
                  <p className="mb-2 text-xs tracking-widest text-muted-foreground uppercase">
                    {group.category}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {group.items.map((i) => i.name).join(", ")}
                  </p>
                </div>
              ))}
            </div>
          )}

          {isProjects && (
            <div className="w-full max-w-[24rem] rounded-xl border border-border/60 bg-card/60 p-5 shadow-sm">
              <p className="mb-4 text-center text-xs tracking-widest text-muted-foreground uppercase">
                Selected Case Studies
              </p>

              <div className="space-y-3">
                {projectsData.items
                  .filter((p) => p.featured)
                  .slice(0, 2)
                  .map((project) => (
                    <div
                      key={project.id}
                      className="rounded-lg border border-border/50 bg-secondary/40 p-3"
                    >
                      <p className="text-sm font-medium">{project.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {project.category}
                      </p>
                    </div>
                  ))}
              </div>

              <button className="mt-5 w-full rounded-md bg-primary py-2 text-sm text-primary-foreground">
                Explore Projects
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ===== TEXT BLOCK (REUSABLE + CLEAN) ===== */
function HeroText({
  slide,
  headingId,
  isCompact,
}: {
  slide: HeroSlideData
  headingId?: string
  isCompact: boolean
}) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-[0.66rem] font-semibold tracking-[0.22em] text-primary uppercase">
        {slide.eyebrow}
      </p>

      <div className={cn("flex flex-col", isCompact ? "gap-2.5" : "gap-3")}>
        <h1
          id={headingId}
          className="max-w-[22ch] font-heading text-[clamp(2rem,3vw,3.2rem)] leading-[0.95] font-bold tracking-[-0.04em] text-foreground"
        >
          {slide.title}
        </h1>

        {slide.highlightLine && (
          <p className="max-w-[24ch] text-[clamp(1.4rem,2vw,2.2rem)] font-light text-primary/85 italic">
            {slide.highlightLine}
          </p>
        )}

        <p className="max-w-[55ch] text-[clamp(0.9rem,1vw,1.05rem)] text-muted-foreground">
          {slide.description}
        </p>
      </div>

      {slide.supportingPoints?.length && (
        <div className="flex flex-wrap gap-2 pt-1">
          {slide.supportingPoints.map((point) => (
            <span
              key={point}
              className="rounded-full border border-border bg-secondary px-3 py-1 text-xs"
            >
              {point}
            </span>
          ))}
        </div>
      )}

      <HeroActions
        primaryAction={slide.primaryAction}
        secondaryAction={slide.secondaryAction}
        size={isCompact ? "compact" : "default"}
      />
    </div>
  )
}
