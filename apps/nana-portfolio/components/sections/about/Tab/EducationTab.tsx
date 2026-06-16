import type { ReactNode } from "react"
import { Award, GraduationCap, MapPin } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { credentialsData } from "@/data/aboutData"
import type {
  CertificationItem,
  EducationItem,
} from "@/types/aboutSectionTypes"

const educationCardClassName = "border-border/60 bg-secondary/20 shadow-none"
const metaLabelClassName =
  "text-[0.68rem] font-semibold tracking-[0.16em] text-muted-foreground uppercase"

function IconBadge({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
      {children}
    </span>
  )
}

function PeriodBadge({
  value,
}: Readonly<{
  value: string
}>) {
  return (
    <span className="inline-flex rounded-sm border border-border/60 bg-background/40 px-3 py-1 text-[0.68rem] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
      {value}
    </span>
  )
}

function LocationRow({
  location,
}: Readonly<{
  location: string
}>) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <MapPin className="h-4 w-4" />
      <span>{location}</span>
    </div>
  )
}

function EducationCard({ item }: Readonly<{ item: EducationItem }>) {
  const period = `${item.startDate} - ${item.endDate}`

  return (
    <Card className={educationCardClassName}>
      <CardContent className="space-y-5 p-5 md:p-6">
        <div className="flex items-start justify-between gap-4">
          <PeriodBadge value={period} />

          <IconBadge>
            <GraduationCap className="h-5 w-5" />
          </IconBadge>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-card-foreground">
            {item.degree}
          </h3>

          <p className="text-sm font-medium tracking-[0.14em] text-muted-foreground uppercase">
            {item.institution}
          </p>

          <LocationRow location={item.location} />
        </div>

        {item.description ? (
          <p className="text-sm leading-7 text-muted-foreground">
            {item.description}
          </p>
        ) : null}
      </CardContent>
    </Card>
  )
}

function CertificationCard({
  item,
}: Readonly<{
  item: CertificationItem
}>) {
  return (
    <Card className={educationCardClassName}>
      <CardContent className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-4">
          <IconBadge>
            <Award className="h-5 w-5" />
          </IconBadge>

          {item.issuedAt ? (
            <span className={metaLabelClassName}>{item.issuedAt}</span>
          ) : null}
        </div>

        <div className="space-y-2">
          <h4 className="text-base leading-7 font-semibold text-card-foreground">
            {item.title}
          </h4>

          <p className="text-sm font-medium tracking-[0.14em] text-muted-foreground uppercase">
            {item.issuer}
          </p>

          {item.location ? <LocationRow location={item.location} /> : null}
        </div>
      </CardContent>
    </Card>
  )
}

export function EducationTab() {
  return (
    <div className="space-y-10 md:space-y-12">
      <div className="space-y-5">
        <div className="space-y-2">
          <p className="text-xs font-semibold tracking-[0.24em] text-primary uppercase">
            Credentials
          </p>
          <h2 className="font-heading text-3xl text-card-foreground md:text-4xl">
            Academic Background and Certifications
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {credentialsData.educationItems.map((item) => (
            <EducationCard key={item.id} item={item} />
          ))}
        </div>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <h3 className="font-heading text-2xl text-card-foreground md:text-3xl">
            {credentialsData.certificationsHeading}
          </h3>
          <p className="text-sm leading-7 text-muted-foreground">
            Continued learning through practical coursework and specialized
            training.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {credentialsData.certificationItems.map((item) => (
            <CertificationCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  )
}
