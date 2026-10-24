import { ArrowUpRight } from "lucide-react"
import type { ProjectItem } from "@/types/projectsSectionTypes"

export function ProjectCard({ project }: Readonly<{ project: ProjectItem }>) {
  const titleId = `${project.id}-title`
  return (
    <article
      id={project.id}
      aria-labelledby={titleId}
      className="flex h-full scroll-mt-24 flex-col gap-5 rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/40 md:p-8"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          {project.category}
        </span>
        <span className="text-xs text-muted-foreground">{project.status}</span>
      </div>
      <div className="space-y-3">
        <h3 id={titleId} className="font-heading text-2xl leading-snug">
          {project.title}
        </h3>
        <p className="text-xs font-medium text-muted-foreground">
          {project.organization}
        </p>
        <p className="text-sm leading-7 text-muted-foreground">
          {project.summary}
        </p>
      </div>
      <ul className="flex flex-wrap gap-2" aria-label="Technologies">
        {project.techStack.map((technology) => (
          <li
            key={technology}
            className="rounded-md border border-border bg-secondary/40 px-2.5 py-1 text-xs font-medium"
          >
            {technology}
          </li>
        ))}
      </ul>
      {project.outcomes?.length ? (
        <ul className="list-disc space-y-2 pl-4 text-sm leading-6 text-muted-foreground marker:text-primary">
          {project.outcomes.map((outcome) => (
            <li key={outcome}>{outcome}</li>
          ))}
        </ul>
      ) : null}
      {project.links?.length ? (
        <div className="mt-auto flex flex-wrap gap-4 border-t border-border pt-4">
          {project.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold hover:text-primary"
              aria-label={`${link.label}: ${project.title}`}
            >
              {link.label}
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
          ))}
        </div>
      ) : null}
    </article>
  )
}
