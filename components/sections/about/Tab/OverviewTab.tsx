import {
  Bug,
  Code,
  Database,
  Laptop,
  Newspaper,
  Palette,
  TestTube2,
  Users,
  Zap,
  Blocks,
  type LucideIcon,
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { aboutOverviewData } from "@/data/aboutOverviewData"
import type {
  AboutOverviewExpertiseItem,
  AboutOverviewIconKey,
} from "@/types/aboutSectionTypes"

const overviewIconMap: Record<AboutOverviewIconKey, LucideIcon> = {
  testTube: TestTube2,
  laptop: Laptop,
  database: Database,
  code: Code,
  bug: Bug,
  newspaper: Newspaper,
  palette: Palette,
  blocks: Blocks,
  zap: Zap,
  users: Users,
}

function OverviewStatCard({
  value,
  label,
}: Readonly<{
  value: string
  label: string
}>) {
  return (
    <Card className="border-border/60 bg-secondary/30 shadow-none">
      <CardContent className="p-4">
        <div className="space-y-1">
          <p className="font-heading text-2xl text-card-foreground">{value}</p>
          <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">
            {label}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

function OverviewExpertiseCard({
  item,
}: Readonly<{
  item: AboutOverviewExpertiseItem
}>) {
  const Icon = overviewIconMap[item.iconKey]

  return (
    <Card className="border-border/60 bg-secondary/30 shadow-none">
      <CardContent className="flex h-full flex-col gap-4 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Icon className="h-5 w-5" />
          </div>

          <h5 className="text-lg font-semibold text-card-foreground">
            {item.title}
          </h5>
        </div>

        <p className="text-sm leading-7 text-muted-foreground">
          {item.description}
        </p>
      </CardContent>
    </Card>
  )
}

export function OverviewTab() {
  return (
    <section
      className="space-y-8 md:space-y-10"
      aria-labelledby="about-overview-heading"
    >
      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr] xl:items-start">
        <div className="space-y-4 md:space-y-5">
          <p className="text-xs font-semibold tracking-[0.24em] text-primary uppercase">
            {aboutOverviewData.eyebrow}
          </p>

          <div className="space-y-3">
            <h3
              id="about-overview-heading"
              className="font-heading text-3xl leading-tight text-card-foreground md:text-4xl"
            >
              {aboutOverviewData.heading}
            </h3>

            <p className="text-base leading-8 text-muted-foreground">
              {aboutOverviewData.summary}
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
          {aboutOverviewData.stats.map((stat) => (
            <OverviewStatCard
              key={stat.id}
              value={stat.value}
              label={stat.label}
            />
          ))}
        </div>
      </div>

      <div className="h-px bg-border/60" />

      <div className="space-y-5 md:space-y-6">
        <h4 className="font-heading text-2xl text-card-foreground md:text-3xl">
          {aboutOverviewData.expertiseHeading}
        </h4>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {aboutOverviewData.expertiseItems.map((item) => (
            <OverviewExpertiseCard key={item.id} item={item} />
          ))}
        </div>
      </div>

      <Card className="border-border/60 bg-secondary/30 shadow-none">
        <CardContent className="p-5">
          <p className="text-sm leading-7 text-muted-foreground">
            {aboutOverviewData.closingNote}
          </p>
        </CardContent>
      </Card>
    </section>
  )
}
