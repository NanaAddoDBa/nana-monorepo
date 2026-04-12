import type { AboutTab } from "@/types/aboutSectionTypes"

export const aboutTabsData = [
  {
    id: "overview",
    label: "Overview",
    value: "overview",
  },
  {
    id: "skills",
    label: "Skills",
    value: "skills",
  },
  {
    id: "experience",
    label: "Experience",
    value: "experience",
  },
  {
    id: "education",
    label: "Education",
    value: "education",
  },
  {
    id: "certifications",
    label: "Certifications",
    value: "certifications",
  },
] as const satisfies readonly AboutTab[]
