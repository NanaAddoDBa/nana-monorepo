import { workExperienceData } from "@/data/aboutData"

export function ExperienceTab() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h3 className="font-heading text-2xl md:text-3xl">
          {workExperienceData.heading}
        </h3>
        <p className="max-w-3xl text-base leading-7 text-muted-foreground">
          {workExperienceData.intro}
        </p>
      </div>
      <div className="divide-y divide-border">
        {workExperienceData.items.map((item) => (
          <article
            key={item.id}
            className="grid gap-4 py-7 first:pt-0 last:pb-0 lg:grid-cols-[11rem_1fr] lg:gap-8"
          >
            <p className="text-sm font-semibold text-primary">{item.period}</p>
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="text-xl font-semibold">{item.role}</h4>
                <p className="text-sm font-medium">{item.company}</p>
                <p className="text-sm text-muted-foreground">
                  {item.location}
                  {item.workType ? ` · ${item.workType}` : ""}
                </p>
              </div>
              <p className="text-sm leading-7 text-muted-foreground">
                {item.summary}
              </p>
              <ul className="list-disc space-y-2 pl-4 text-sm leading-7 text-muted-foreground marker:text-primary">
                {item.responsibilities.map((responsibility) => (
                  <li key={responsibility}>{responsibility}</li>
                ))}
              </ul>
              <ul className="flex flex-wrap gap-2" aria-label="Skills used">
                {item.skills.map((skill) => (
                  <li
                    key={skill}
                    className="rounded-md bg-secondary px-2.5 py-1 text-xs"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
