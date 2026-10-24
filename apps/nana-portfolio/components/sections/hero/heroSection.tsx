import Image from "next/image"
import { ArrowDown, Download, MapPin } from "lucide-react"

import { SectionShell } from "@/components/shared/sectionShell"
import { cvDocumentsData } from "@/data/cvDocumentsData"
import { heroSlidesData } from "@/data/heroSlidesData"
import { HeroActions } from "./heroActions"

export function HeroSection() {
  const intro = heroSlidesData[0]

  return (
    <SectionShell
      id="hero"
      aria-labelledby="hero-heading"
      contentClassName="py-10 md:py-16 lg:py-20"
    >
      <div className="grid items-center gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
        <div className="space-y-7">
          <p className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/5 px-4 py-2 text-xs font-semibold text-primary">
            <span
              className="size-2 rounded-full bg-primary"
              aria-hidden="true"
            />
            Available for full-time opportunities
          </p>
          <div className="space-y-4">
            <p className="text-sm font-semibold tracking-[0.18em] text-muted-foreground uppercase">
              {intro.eyebrow}
            </p>
            <h1
              id="hero-heading"
              className="font-heading text-[clamp(2.7rem,5vw,4.7rem)] leading-[1.08] tracking-tight text-balance"
            >
              {intro.title}
            </h1>
            <p className="max-w-[25ch] font-heading text-[clamp(1.8rem,3vw,2.7rem)] leading-tight text-primary">
              {intro.highlightLine}
            </p>
            <p className="max-w-xl text-base leading-8 text-muted-foreground md:text-lg">
              {intro.description}
            </p>
          </div>
          <HeroActions
            primaryAction={intro.primaryAction}
            secondaryAction={intro.secondaryAction}
          />
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="size-4" aria-hidden="true" /> Passau, Germany
          </p>
        </div>
        <div className="mx-auto w-full max-w-sm lg:max-w-md">
          <div className="relative aspect-[4/4.5] overflow-hidden rounded-3xl border border-border bg-muted">
            <Image
              src={intro.image.src}
              alt={intro.image.alt}
              fill
              priority
              sizes="(min-width: 1024px) 420px, (min-width: 640px) 384px, calc(100vw - 32px)"
              className="object-cover object-top"
            />
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs font-medium text-muted-foreground">
            <span>React & TypeScript</span>
            <span>LLM applications</span>
            <span>Automation</span>
          </div>
        </div>
      </div>
      <div
        id="cv"
        tabIndex={-1}
        className="mt-12 grid scroll-mt-24 gap-4 rounded-2xl border border-border bg-card p-5 md:mt-16 md:grid-cols-[1fr_1.8fr] md:items-center md:p-6"
      >
        <div>
          <h2 className="text-base font-semibold">
            A CV for the role you have in mind.
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Two focus areas. English PDFs.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {cvDocumentsData[0].documents.map((document) => (
            <a
              key={document.id}
              href={document.href}
              download
              className="flex min-h-14 items-center justify-between gap-3 rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold transition-colors hover:border-primary hover:text-primary"
              aria-label={`Download ${document.label} CV (English PDF)`}
            >
              <span>
                {document.label}
                <span className="mt-0.5 block text-xs font-normal text-muted-foreground">
                  Download CV · PDF
                </span>
              </span>
              <Download className="size-5 shrink-0" aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>
      <a
        href="#projects"
        className="mt-8 inline-flex min-h-11 items-center gap-2 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowDown className="size-4" aria-hidden="true" /> Take a look at my
        work
      </a>
    </SectionShell>
  )
}
