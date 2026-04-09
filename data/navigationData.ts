import type { NavigationItem } from "@/types/navigationTypes"

export const navigationData = [
  {
    id: "home",
    label: "Home",
    href: "#hero",
    ariaLabel: "Go to hero section",
  },
  {
    id: "about",
    label: "About",
    href: "#about",
    ariaLabel: "Go to about section",
    items: [
      {
        id: "about-skills",
        label: "Skills",
        href: "#about-skills",
        ariaLabel: "Go to skills content",
      },
      {
        id: "about-experience",
        label: "Experience",
        href: "#about-experience",
        ariaLabel: "Go to experience content",
      },
      {
        id: "about-education",
        label: "Education",
        href: "#about-education",
        ariaLabel: "Go to education content",
      },
      {
        id: "about-certifications",
        label: "Certifications",
        href: "#about-certifications",
        ariaLabel: "Go to certifications content",
      },
    ],
  },
  {
    id: "projects",
    label: "Projects",
    href: "#projects",
    ariaLabel: "Go to projects section",
    // TODO: Add an optional one-tier Projects subnav later only if project depth
    // clearly justifies it, for example: Featured, Case Studies, or flagship projects.
  },
  {
    id: "contact",
    label: "Contact",
    href: "#contact",
    ariaLabel: "Go to contact section",
  },
] as const satisfies readonly NavigationItem[]
