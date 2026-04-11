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
export type HeroSlideImage = {
  src: string
  alt: string
}

export type HeroSlideAction = HeroSlideLinkAction | HeroSlideDownloadGroupAction

export type HeroSlideDensity = "default" | "compact"

export type HeroSlide = {
  id: string
  eyebrow: string
  title: string
  highlightLine?: string
  description: string
  primaryAction: HeroSlideAction
  secondaryAction?: HeroSlideAction
  supportingPoints?: string[]
  image?: HeroSlideImage
  density?: HeroSlideDensity
}
