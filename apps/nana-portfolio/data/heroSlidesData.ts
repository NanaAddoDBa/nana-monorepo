import type { HeroSlide } from "@/types/heroSectionTypes"

export const heroSlidesData = [
  {
    id: "intro",
    variant: "image",
    density: "default",
    eyebrow: "Software Engineer Portfolio",
    title: "Hello, I'm Nana Addo",
    highlightLine: "Software Engineer",
    description:
      "I design and build reliable web products with React, Next.js, TypeScript, testing, and automation.",
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
      alt: "Portrait of Nana Addo",
    },
    supportingPoints: [
      "React, Next.js & TypeScript",
      "Testing, APIs & databases",
      "LLM-assisted automation",
    ],
  },
  {
    id: "strengths",
    variant: "skills",
    density: "compact",
    eyebrow: "Core Strengths",
    title: "Software Engineering",
    highlightLine: "Frontend Depth, Full-Stack Awareness",
    description:
      "My front-end foundation is complemented by API integration, database-backed workflows, testing, and practical full-stack delivery.",
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
    title: "Applied Engineering Work",
    highlightLine: "Delivery, Reliability, Automation",
    description:
      "Selected projects demonstrate measurable improvements to product reliability, operational workflows, and user experience.",
    primaryAction: {
      type: "link",
      label: "Explore Projects",
      href: "#projects",
      variant: "primary",
    },
    secondaryAction: {
      type: "link",
      label: "Let's Connect",
      href: "#contact",
      variant: "secondary",
    },
  },
] satisfies HeroSlide[]
