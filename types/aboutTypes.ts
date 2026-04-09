export type AboutTabId =
  | "overview"
  | "skills"
  | "experience"
  | "education"
  | "certifications"

export type AboutTab = {
  id: AboutTabId
  label: string
  value: AboutTabId
}

export type AboutOverviewStat = {
  id: string
  value: string
  label: string
}

export type AboutOverviewExpertiseItem = {
  id: string
  title: string
  description: string
  iconKey: "testTube" | "laptop" | "database" | "code" | "bug" | "newspaper"
}

export type AboutOverviewData = {
  eyebrow: string
  heading: string
  summary: string
  stats: AboutOverviewStat[]
  expertiseHeading: string
  expertiseItems: AboutOverviewExpertiseItem[]
  closingNote: string
}
