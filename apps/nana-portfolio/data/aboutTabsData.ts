import type { AboutTab } from "@/types/aboutSectionTypes"

export const aboutTabsData = [
  {
    id: "overview",
    label: "Overview",
    href: "#about-overview",
    ariaLabel: "Go to the overview tab in the about section",
    description:
      "Professional summary, core strengths, and key expertise areas.",
  },
  {
    id: "skills",
    label: "Skills",
    href: "#about-skills",
    ariaLabel: "Go to the skills tab in the about section",
    description: "Technical stack, tools, testing, and language capabilities.",
  },
  {
    id: "experience",
    label: "Experience",
    href: "#about-experience",
    ariaLabel: "Go to the experience tab in the about section",
    description:
      "Professional timeline, roles, responsibilities, and outcomes.",
  },
  {
    id: "education",
    label: "Education",
    href: "#about-education",
    ariaLabel: "Go to the education tab in the about section",
    description: "Academic background and continuing learning credentials.",
  },
  {
    id: "certifications",
    label: "Certifications",
    href: "#about-certifications",
    ariaLabel: "Go to the certifications tab in the about section",
    description:
      "Professional coursework, certifications, and training records.",
  },
] as const satisfies readonly AboutTab[]
