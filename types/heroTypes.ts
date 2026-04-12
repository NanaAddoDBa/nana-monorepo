export type HeroSlideActionVariant = "primary" | "secondary"

export type HeroSlideLinkAction = {
  type: "link"
  label: string
  href: string
  variant: HeroSlideActionVariant
}

export type HeroSlideDownloadGroupAction = {
  type: "downloadGroup"
  label: string
  downloadGroupId: string
  variant: HeroSlideActionVariant
}

export type HeroSlideAction = HeroSlideLinkAction | HeroSlideDownloadGroupAction

export type HeroSlideDensity = "default" | "compact"

export type HeroSlideImage = {
  src: string
  alt: string
}

export type HeroSlideVariant = "image" | "skills" | "projects"

type HeroSlideBase = {
  id: string
  eyebrow: string
  title: string
  highlightLine?: string
  description: string
  primaryAction: HeroSlideAction
  secondaryAction?: HeroSlideAction
  supportingPoints?: string[]
  density?: HeroSlideDensity
}

export type HeroSlideImageVariant = HeroSlideBase & {
  variant: "image"
  image: HeroSlideImage
}

export type HeroSlideSkillsVariant = HeroSlideBase & {
  variant: "skills"
}

export type HeroSlideProjectsVariant = HeroSlideBase & {
  variant: "projects"
}

export type HeroSlide =
  | HeroSlideImageVariant
  | HeroSlideSkillsVariant
  | HeroSlideProjectsVariant
