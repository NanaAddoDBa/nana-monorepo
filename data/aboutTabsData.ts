import type { AboutTab } from "@/types/aboutSectionTypes"

export const aboutTabsData = [
  {
    id: "overview",
    label: "Overview",
  },
  {
    id: "skills",
    label: "Skills",
  },
  {
    id: "experience",
    label: "Experience",
  },
  {
    id: "education",
    label: "Education",
  },
  {
    id: "certifications",
    label: "Certifications",
  },
] as const satisfies readonly AboutTab[]
