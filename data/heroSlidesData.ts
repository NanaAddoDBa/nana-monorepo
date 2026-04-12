import type { HeroSlide } from "@/types/heroSectionTypes"

export const heroSlidesData = [
  {
    id: "intro",
    variant: "image",
    density: "default",
    eyebrow: "welcome to my personal website",
    title: "Hello, I’m Nana Addo Dankwa Bampoe Addo",
    highlightLine: "Software Developer",
    description:
      "I build modern web applications with clean architecture, purposeful design, and maintainable frontend systems that stay clear as products grow.",
    primaryAction: {
      type: "link",
      label: "View Projects",
      href: "#projects",
      variant: "primary",
    },
    secondaryAction: {
      type: "downloadGroup",
      label: "Download CV",
      downloadGroupId: "primaryCv",
      variant: "secondary",
    },
    image: {
      src: "/images/profile/nana-portrait.png",
      alt: "Portrait of Nana Addo Dankwa Bampoe Addo",
    },
    supportingPoints: [
      "Next.js & React",
      "TypeScript-driven development",
      "Maintainable frontend architecture",
    ],
  },
  {
    id: "strengths",
    variant: "skills",
    density: "compact",
    eyebrow: "Core Strengths",
    title: "Frontend Engineering",
    highlightLine: "Clean Systems, Thoughtful Interfaces",
    description:
      "I build responsive interfaces, API-connected experiences, and scalable frontend systems with strong attention to maintainability and delivery quality.",
    primaryAction: {
      type: "link",
      label: "About Me",
      href: "#about",
      variant: "primary",
    },
    secondaryAction: {
      type: "link",
      label: "View Projects",
      href: "#projects",
      variant: "secondary",
    },
  },
  {
    id: "proof",
    variant: "projects",
    density: "compact",
    eyebrow: "Selected Proof",
    title: "Real-World Projects",
    highlightLine: "Impact Through Execution",
    description:
      "My work includes product-focused web development, workflow tooling, and systems designed to improve reliability, efficiency, and user outcomes.",
    primaryAction: {
      type: "link",
      label: "Explore Projects",
      href: "#projects",
      variant: "primary",
    },
    secondaryAction: {
      type: "link",
      label: "Let’s Connect",
      href: "#contact",
      variant: "secondary",
    },
  },
] satisfies HeroSlide[]
