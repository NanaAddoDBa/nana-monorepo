import Link from "next/link"
import { ArrowUpRight, GitFork, Star } from "lucide-react"

import type { ProjectItem } from "@/types/projectsSectionTypes"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type ProjectCardProps = {
  project: ProjectItem
}

function getProjectSourceLabel(project: ProjectItem) {
  return project.source === "github" ? "GitHub Repository" : "Professional Work"
}

export function ProjectCard({ project }: Readonly<ProjectCardProps>) {
  const titleId = `${project.id}-title`

  return (
    <article id={project.id} aria-labelledby={titleId} className="scroll-mt-24">
      <Card className="overflow-hidden border-border/60 bg-card/40 shadow-none">
        <div className="aspect-[16/10] border-b border-border/60 bg-secondary/30">
          <div className="flex h-full flex-col justify-between p-5">
            <span className="inline-flex w-fit rounded-sm border border-border/60 bg-background/40 px-3 py-1 text-[0.68rem] font-semibold tracking-[0.18em] text-primary uppercase">
              {project.category}
            </span>

            <div className="space-y-2">
              {project.organization ? (
                <p className="text-sm font-medium text-muted-foreground">
                  {project.organization}
                </p>
              ) : null}

              <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
                {getProjectSourceLabel(project)}
              </p>

              {project.source === "github" &&
              (project.stars !== undefined || project.forks !== undefined) ? (
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Star className="h-3.5 w-3.5" />
                    {project.stars ?? 0}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <GitFork className="h-3.5 w-3.5" />
                    {project.forks ?? 0}
                  </span>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <CardHeader className="space-y-3">
          <div className="space-y-2">
            <CardTitle id={titleId} className="text-2xl text-card-foreground">
              {project.title}
            </CardTitle>

            <p className="text-sm leading-7 text-muted-foreground">
              {project.summary}
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          <ul className="flex flex-wrap gap-2">
            {project.techStack.map((technology) => (
              <li
                key={technology}
                className="rounded-sm border border-border/60 bg-secondary/30 px-3 py-1.5 text-xs font-medium text-secondary-foreground"
              >
                {technology}
              </li>
            ))}
          </ul>

          {project.outcomes?.length ? (
            <ul className="space-y-2">
              {project.outcomes.map((outcome) => (
                <li
                  key={outcome}
                  className="text-sm leading-7 text-muted-foreground"
                >
                  {outcome}
                </li>
              ))}
            </ul>
          ) : null}
        </CardContent>

        {project.links?.length ? (
          <CardFooter className="flex flex-wrap items-center gap-3">
            {project.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-card-foreground transition-colors hover:text-primary"
              >
                <span>{link.label}</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            ))}
          </CardFooter>
        ) : null}
      </Card>
    </article>
  )
}
