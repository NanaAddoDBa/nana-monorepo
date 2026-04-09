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

export const aboutOverviewIconKeys = [
  "testTube",
  "laptop",
  "database",
  "code",
  "bug",
  "newspaper",
  "palette",
  "blocks",
  "zap",
  "users",
] as const

export type AboutOverviewIconKey = (typeof aboutOverviewIconKeys)[number]

export type AboutOverviewExpertiseItem = {
  id: string
  title: string
  description: string
  iconKey: AboutOverviewIconKey
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

export interface SkillItem {
  name: string
  slug: string
}

export interface SkillCategory {
  category: string
  items: SkillItem[]
}

export interface LanguageSkill {
  name: string
  slug: string
  level: string
}

export interface SkillsData {
  programming: SkillCategory[]
  testing: SkillCategory[]
  productivity: SkillCategory[]
  languageSkills: LanguageSkill[]
  softSkills: SkillCategory[]
}
