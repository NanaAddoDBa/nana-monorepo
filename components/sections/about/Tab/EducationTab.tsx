import { Award, GraduationCap, MapPin } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { credentialsData } from "@/data/credentialsData"

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
            <Card
              key={item.id}
              className="border-border/60 bg-secondary/20 shadow-none"
            >
              <CardContent className="space-y-5 p-5 md:p-6">
                <div className="flex items-start justify-between gap-4">
                  <span className="inline-flex rounded-sm border border-border/60 bg-background/40 px-3 py-1 text-[0.68rem] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                    {item.isCurrent
                      ? `${item.startDate} — Present`
                      : `${item.startDate} — ${item.endDate}`}
                  </span>

                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <GraduationCap className="h-5 w-5" />
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-card-foreground">
                    {item.degree}
                  </h3>

                  <p className="text-sm font-medium tracking-[0.14em] text-muted-foreground uppercase">
                    {item.institution}
                  </p>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{item.location}</span>
                  </div>
                </div>

                {item.description ? (
                  <p className="text-sm leading-7 text-muted-foreground">
                    {item.description}
                  </p>
                ) : null}
              </CardContent>
            </Card>
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
            <Card
              key={item.id}
              className="border-border/60 bg-secondary/20 shadow-none"
            >
              <CardContent className="space-y-4 p-5">
                <div className="flex items-start justify-between gap-4">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Award className="h-5 w-5" />
                  </span>

                  {item.issuedAt ? (
                    <span className="text-[0.68rem] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                      {item.issuedAt}
                    </span>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <h4 className="text-base leading-7 font-semibold text-card-foreground">
                    {item.title}
                  </h4>

                  <p className="text-sm font-medium tracking-[0.14em] text-muted-foreground uppercase">
                    {item.issuer}
                  </p>

                  {item.location ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{item.location}</span>
                    </div>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
