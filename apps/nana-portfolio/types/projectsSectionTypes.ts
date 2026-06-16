export type ProjectLink = {
  label: string
  href: string
}

export type ProjectItem = {
  id: string
  title: string
  organization?: string
  summary: string
  techStack: string[]
  category: string
  featured?: boolean
  outcomes?: string[]
  links?: ProjectLink[]
  owner?: string
  updatedAt?: string
  source?: "professional" | "github"
  stars?: number
  forks?: number
}

export type ProjectsData = {
  heading: string
  intro?: string
  items: ProjectItem[]
}
