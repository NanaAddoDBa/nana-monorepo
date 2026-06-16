import type { AboutOverviewData } from "@/types/aboutSectionTypes"

export const aboutOverviewData = {
  eyebrow: "Overview",
  heading: "Professional Summary",
  summary:
    "I’m a Frontend Developer with experience building modern web applications using React, Next.js, TypeScript, and JavaScript. I enjoy turning requirements into clear, responsive, and maintainable user interfaces, and I care about creating frontend solutions that are reliable, user-friendly, and aligned with real product goals.",
  stats: [
    {
      id: "experience",
      value: "06+",
      label: "Years in Frontend Development",
    },
    {
      id: "focus",
      value: "React + Next.js",
      label: "Primary Stack",
    },
    {
      id: "approach",
      value: "User-Focused",
      label: "Build Approach",
    },
  ],
  expertiseHeading: "Key Areas of Expertise",
  expertiseItems: [
    {
      id: "frontend-development",
      title: "Frontend Development",
      description:
        "Build responsive web interfaces that are practical, maintainable, and designed around real user needs.",
      iconKey: "laptop",
    },
    {
      id: "ui-engineering",
      title: "UI Engineering",
      description:
        "Turn ideas and design direction into polished interfaces that feel consistent across devices and screen sizes.",
      iconKey: "palette",
    },
    {
      id: "component-architecture",
      title: "Component Architecture",
      description:
        "Create reusable components and structured frontend systems that make applications easier to scale and maintain.",
      iconKey: "blocks",
    },
    {
      id: "frontend-testing",
      title: "Frontend Testing",
      description:
        "Use testing to improve reliability, reduce regressions, and support safer iteration during development.",
      iconKey: "testTube",
    },
    {
      id: "performance-quality",
      title: "Performance & Quality",
      description:
        "Focus on clean implementation, accessibility, and performance improvements that strengthen the overall user experience.",
      iconKey: "zap",
    },
    {
      id: "collaboration-delivery",
      title: "Collaboration & Delivery",
      description:
        "Work closely with requirements, feedback, and team workflows to deliver frontend features clearly and efficiently.",
      iconKey: "users",
    },
  ],
  closingNote:
    "I enjoy building frontend experiences that are reliable, easy to use, and thoughtful in both structure and design.",
} satisfies AboutOverviewData
