export type AboutTabId =
  | "overview"
  | "skills"
  | "experience"
  | "education"
  | "certifications"

export type AboutTabHref = `#about-${AboutTabId}`

export type SectionTab<TId extends string> = {
  id: TId
  label: string
  href: `#about-${TId}`
  ariaLabel?: string
  description?: string
}

export type AboutTab = SectionTab<AboutTabId>

export type AboutOverviewStat = {
  id: string
  value: string
  label: string
}

export const AboutOverviewIconKeys = [
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

export type AboutOverviewIconKey = (typeof AboutOverviewIconKeys)[number]

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

export type SkillItem = {
  name: string
  slug: string
}

export type SkillCategory = {
  category: string
  items: SkillItem[]
}

export type LanguageSkill = SkillItem & {
  level: string
}

export type SkillsData = {
  programming: SkillCategory[]
  testing: SkillCategory[]
  productivity: SkillCategory[]
  languageSkills: LanguageSkill[]
  softSkills: SkillCategory[]
}

export type ExperienceItem = {
  id: string
  role: string
  company: string
  location: string
  workType?: string
  period: string
  summary: string
  responsibilities: string[]
  skills: string[]
}

export type WorkExperienceData = {
  eyebrow: string
  heading: string
  intro: string
  items: ExperienceItem[]
}

export type EducationItem = {
  id: string
  degree: string
  institution: string
  location: string
  startDate: string
  endDate: string
  isCurrent?: boolean
  description?: string
}

export type CertificationItem = {
  id: string
  title: string
  issuer: string
  location?: string
  issuedAt?: string
  credentialUrl?: string
}

export type CredentialsData = {
  educationHeading: string
  educationItems: EducationItem[]
  certificationsHeading: string
  certificationItems: CertificationItem[]
}
