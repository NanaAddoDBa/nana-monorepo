import { CheckCircle2 } from "lucide-react"

import { workExperienceData } from "@/data/workExperienceData"

type ExperienceTimelineItemProps = {
  item: (typeof workExperienceData.items)[number]
  align: "left" | "right"
}

function ExperienceTimelineItem({
  item,
  align,
}: Readonly<ExperienceTimelineItemProps>) {
  const isLeft = align === "left"

  return (
    <article className="relative lg:grid lg:grid-cols-[1fr_auto_1fr] lg:gap-10 lg:py-10">
      <div className="absolute top-0 left-3 h-full w-px bg-border/60 lg:hidden" />

      <div
        className={isLeft ? "hidden lg:flex lg:justify-end" : "hidden lg:block"}
      >
        {isLeft ? (
          <div className="max-w-sm space-y-3 text-right">
            <p className="text-xs font-semibold tracking-[0.24em] text-primary uppercase">
              {item.period}
            </p>

            <div className="space-y-1">
              <h3 className="text-2xl font-semibold text-card-foreground">
                {item.role}
              </h3>

              <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                {item.company}, {item.location}
                {item.workType ? ` · ${item.workType}` : ""}
              </p>
            </div>

            <p className="text-sm leading-7 text-muted-foreground">
              {item.summary}
            </p>

            <ul className="space-y-4 pt-2">
              {item.responsibilities.map((responsibility) => (
                <li
                  key={responsibility}
                  className="flex items-start justify-end gap-3"
                >
                  <p className="max-w-xs text-sm leading-7 text-muted-foreground">
                    {responsibility}
                  </p>

                  <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      <div className="relative z-10 hidden lg:flex lg:items-start lg:justify-center">
        <div className="mt-1.5 h-3 w-3 rounded-full border border-primary/60 bg-background shadow-[0_0_20px_rgba(196,181,253,0.35)]" />
      </div>

      <div
        className={
          isLeft ? "hidden lg:block" : "hidden lg:flex lg:justify-start"
        }
      >
        {!isLeft ? (
          <div className="max-w-sm space-y-3">
            <p className="text-xs font-semibold tracking-[0.24em] text-primary uppercase">
              {item.period}
            </p>

            <div className="space-y-1">
              <h3 className="text-2xl font-semibold text-card-foreground">
                {item.role}
              </h3>

              <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                {item.company}, {item.location}
                {item.workType ? ` · ${item.workType}` : ""}
              </p>
            </div>

            <p className="text-sm leading-7 text-muted-foreground">
              {item.summary}
            </p>

            <ul className="space-y-4 pt-2">
              {item.responsibilities.map((responsibility) => (
                <li key={responsibility} className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </span>

                  <p className="text-sm leading-7 text-muted-foreground">
                    {responsibility}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      <div className="relative pl-10 lg:hidden">
        <div className="absolute top-1.5 left-[0.32rem] z-10 h-3 w-3 rounded-full border border-primary/60 bg-background shadow-[0_0_20px_rgba(196,181,253,0.35)]" />

        <div className="space-y-3">
          <p className="text-xs font-semibold tracking-[0.24em] text-primary uppercase">
            {item.period}
          </p>

          <div className="space-y-1">
            <h3 className="text-xl font-semibold text-card-foreground">
              {item.role}
            </h3>

            <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
              {item.company}, {item.location}
              {item.workType ? ` · ${item.workType}` : ""}
            </p>
          </div>

          <p className="text-sm leading-7 text-muted-foreground">
            {item.summary}
          </p>

          <ul className="space-y-4 pt-2">
            {item.responsibilities.map((responsibility) => (
              <li key={responsibility} className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </span>

                <p className="text-sm leading-7 text-muted-foreground">
                  {responsibility}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  )
}

export function ExperienceTab() {
  return (
    <div className="space-y-8 md:space-y-10">
      <div className="space-y-4">
        <p className="text-xs font-semibold tracking-[0.24em] text-primary uppercase">
          {workExperienceData.eyebrow}
        </p>

        <div className="space-y-3">
          <h2 className="font-heading text-3xl text-card-foreground md:text-4xl">
            {workExperienceData.heading}
          </h2>

          <p className="max-w-3xl text-base leading-8 text-muted-foreground">
            {workExperienceData.intro}
          </p>
        </div>
      </div>

      <div className="relative rounded-3xl border border-border/60 bg-secondary/20 px-5 py-6 md:px-8 md:py-8 lg:px-10 lg:py-10">
        <div className="absolute top-10 left-1/2 hidden h-[calc(100%-5rem)] w-px -translate-x-1/2 bg-border/70 lg:block" />

        <div className="space-y-8 lg:space-y-0">
          {workExperienceData.items.map((item, index) => (
            <ExperienceTimelineItem
              key={item.id}
              item={item}
              align={index % 2 === 0 ? "right" : "left"}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
