import { ArrowUpRight } from "lucide-react"
import { SectionShell } from "@/components/shared/sectionShell"
import { projectsData } from "@/data/projectsData"
import { ProjectCard } from "./projectsCard"

export function ProjectsSection() {
  return (
    <SectionShell
      id="projects"
      aria-labelledby="projects-heading"
      className="border-y border-border bg-secondary/20"
    >
      <div className="space-y-8 md:space-y-10">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
              Selected work
            </p>
            <h2
              id="projects-heading"
              className="font-heading text-3xl md:text-4xl"
            >
              Ideas, turned into working software.
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              {projectsData.intro}
            </p>
          </div>
          <a
            href="https://github.com/NanaAddoDBa"
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 shrink-0 items-center gap-2 text-sm font-semibold hover:text-primary"
          >
            More on GitHub{" "}
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </a>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {projectsData.items
            .filter((project) => project.featured)
            .map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          <div className="flex flex-col items-start justify-center gap-4 rounded-2xl border border-dashed border-primary/35 p-6 md:p-8">
            <p className="text-xs font-semibold tracking-widest text-primary uppercase">
              What&apos;s next?
            </p>
            <h3 className="font-heading text-2xl">
              Your next product challenge.
            </h3>
            <p className="max-w-sm text-sm leading-7 text-muted-foreground">
              I&apos;m looking for a team where I can contribute to frontend
              engineering, LLM applications and useful automation.
            </p>
            <a
              href="#contact"
              className="inline-flex min-h-11 items-center gap-2 font-semibold text-primary"
            >
              Let&apos;s talk{" "}
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </SectionShell>
  )
}
