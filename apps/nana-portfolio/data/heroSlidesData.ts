import type { HeroSlide } from "@/types/heroSectionTypes"

export const heroSlidesData = [
  {
    id: "intro",
    variant: "image",
    density: "default",
    eyebrow: "welcome to my personal website",
    title: "Hello, I'm Nana Addo Dankwa Bampoe Addo",
    highlightLine: "Software Engineer",
    description:
      "I build reliable web applications, automation-focused workflows, and maintainable software systems using modern frontend tools, testing practices, databases, and AI-assisted engineering.",
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
      "I bring 4+ years of front-end engineering experience with practical exposure to testing, database-backed workflows, API integration, LLM tools, agentic coding workflows, and automation.",
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
      "My work spans product-focused web development, internal tooling, automated workflows, and systems built to improve reliability, efficiency, and user outcomes.",
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
