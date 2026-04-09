import type { AboutOverviewData } from "@/types/aboutTypes"

export const aboutOverviewData = {
  eyebrow: "Overview",
  heading: "Professional Summary",
  summary:
    "I build modern frontend experiences that combine thoughtful design, maintainable architecture, and reliable implementation. With a strong foundation in software quality and web development, I focus on creating responsive, accessible, and scalable interfaces that are clear for users and practical for teams to maintain.",
  stats: [
    {
      id: "experience",
      value: "06+",
      label: "Years in IT",
    },
    {
      id: "focus",
      value: "Frontend UI",
      label: "Core Focus",
    },
    {
      id: "approach",
      value: "Clean Systems",
      label: "Build Approach",
    },
  ],
  expertiseHeading: "Key Areas of Expertise",
  expertiseItems: [
    {
      id: "frontend-development",
      title: "Frontend Development",
      description:
        "Build responsive and maintainable interfaces with a strong focus on clarity, usability, and scalable implementation.",
      iconKey: "laptop",
    },
    {
      id: "ui-engineering",
      title: "UI Engineering",
      description:
        "Translate design intent into polished, reusable interface patterns that work consistently across devices and screen sizes.",
      iconKey: "palette",
    },
    {
      id: "component-architecture",
      title: "Component Architecture",
      description:
        "Organize frontend systems with reusable components, typed data structures, and clear separation of responsibilities.",
      iconKey: "blocks",
    },
    {
      id: "frontend-testing",
      title: "Frontend Testing",
      description:
        "Apply structured testing practices to improve reliability, reduce regressions, and support confident iteration.",
      iconKey: "testTube",
    },
    {
      id: "performance-quality",
      title: "Performance & Quality",
      description:
        "Focus on clean implementation, accessibility, and performance-minded decisions that improve the overall user experience.",
      iconKey: "zap",
    },
    {
      id: "collaboration-delivery",
      title: "Collaboration & Delivery",
      description:
        "Work effectively across tools, documentation, and team workflows to keep development organized, communicative, and efficient.",
      iconKey: "users",
    },
  ],
  closingNote:
    "I enjoy turning complex requirements into clean, reliable, and user-focused frontend experiences.",
} satisfies AboutOverviewData
