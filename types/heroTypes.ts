// -----------------------------
// ACTION TYPES (unchanged)
// -----------------------------

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

// -----------------------------
// SHARED TYPES
// -----------------------------

export type HeroSlideDensity = "default" | "compact"

export type HeroSlideImage = {
  src: string
  alt: string
}

// -----------------------------
// VARIANT SYSTEM (NEW)
// -----------------------------

export type HeroSlideVariant = "image" | "skills" | "projects"

// -----------------------------
// BASE TYPE (shared across all)
// -----------------------------

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

// -----------------------------
// VARIANT: IMAGE (Slide 1)
// -----------------------------

export type HeroSlideImageVariant = HeroSlideBase & {
  variant: "image"
  image: HeroSlideImage
}

// -----------------------------
// VARIANT: SKILLS (Slide 2)
// -----------------------------

export type HeroSlideSkillsVariant = HeroSlideBase & {
  variant: "skills"
  // no image allowed
}

// -----------------------------
// VARIANT: PROJECTS (Slide 3)
// -----------------------------

export type HeroSlideProjectsVariant = HeroSlideBase & {
  variant: "projects"
  // no image allowed
}

// -----------------------------
// FINAL UNION TYPE
// -----------------------------

export type HeroSlide =
  | HeroSlideImageVariant
  | HeroSlideSkillsVariant
  | HeroSlideProjectsVariant
