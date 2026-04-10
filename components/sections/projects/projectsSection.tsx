import { Container } from "@/components/shared/container"
import { projectsData } from "@/data/projectsData"

import { ProjectCard } from "./projectsCard"

export function ProjectsSection() {
  const featuredProjects = projectsData.items.filter(
    (project) => project.featured
  )

  return (
    <section id="projects" aria-labelledby="projects-heading">
      <Container>
        <div className="py-12 md:py-16">
          <div className="space-y-3">
            <p className="text-xs font-semibold tracking-[0.24em] text-primary uppercase">
              {projectsData.heading}
            </p>

            <div className="space-y-3">
              <h2
                id="projects-heading"
                className="font-heading text-3xl text-foreground md:text-4xl"
              >
                Selected Work
              </h2>

              {projectsData.intro ? (
                <p className="text-base leading-8 text-muted-foreground">
                  {projectsData.intro}
                </p>
              ) : null}
            </div>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
