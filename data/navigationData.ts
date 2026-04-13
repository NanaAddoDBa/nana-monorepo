import { aboutTabsData } from "@/data/aboutData"
import type { NavigationItem } from "@/types/navigationTypes"

const aboutNavigationItems = aboutTabsData
  .filter((tab) => tab.id !== "certifications")
  .map((tab) => ({
    id: `about-${tab.id}`,
    label: tab.label,
    href: tab.href,
    ariaLabel: tab.ariaLabel,
    description: tab.description,
  }))

export const navigationData = [
  {
    id: "home",
    label: "Home",
    href: "#hero",
    ariaLabel: "Go to hero section",
    description: "Intro, identity, and the main hero preview.",
  },
  {
    id: "about",
    label: "About",
    href: "#about",
    ariaLabel: "Go to about section",
    description:
      "Professional summary, skills, experience, and education in a tabbed section.",
    items: aboutNavigationItems,
  },
  {
    id: "projects",
    label: "Projects",
    href: "#projects",
    ariaLabel: "Go to projects section",
    description:
      "Featured project work, case studies, and implementation outcomes.",
  },
  {
    id: "contact",
    label: "Contact",
    href: "#contact",
    ariaLabel: "Go to contact section",
    description:
      "Contact details, availability, and the message form for reaching out.",
  },
] as const satisfies readonly NavigationItem[]
