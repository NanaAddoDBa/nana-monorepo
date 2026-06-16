import type { AboutOverviewData } from "@/types/aboutSectionTypes"

export const aboutOverviewData = {
  eyebrow: "Overview",
  heading: "Software Engineer Profile",
  summary:
    "I'm a Software Engineer with 4+ years of front-end engineering experience building modern web applications with React, Next.js, TypeScript, and JavaScript. I also bring practical experience in testing, API integration, database-backed workflows, LLM-assisted development, agentic coding tools, and automation. I enjoy turning requirements into reliable, maintainable software that supports real users and product goals.",
  stats: [
    {
      id: "experience",
      value: "4+",
      label: "Years in Frontend Engineering",
    },
    {
      id: "focus",
      value: "React + TypeScript",
      label: "Core Engineering Stack",
    },
    {
      id: "approach",
      value: "Testing + Automation",
      label: "Quality Approach",
    },
  ],
  expertiseHeading: "Key Areas of Expertise",
  expertiseItems: [
    {
      id: "frontend-development",
      title: "Frontend Engineering",
      description:
        "Build responsive, accessible, and maintainable web interfaces with React, Next.js, TypeScript, JavaScript, HTML, CSS, and modern component patterns.",
      iconKey: "laptop",
    },
    {
      id: "software-engineering",
      title: "Software Engineering",
      description:
        "Translate requirements into structured features, API-connected workflows, reusable modules, and maintainable code that can evolve with product needs.",
      iconKey: "code",
    },
    {
      id: "testing-quality",
      title: "Testing & Quality",
      description:
        "Use testing, debugging, validation, and review habits to reduce regressions and support safer iteration across user-facing workflows.",
      iconKey: "testTube",
    },
    {
      id: "database-api-workflows",
      title: "APIs & Databases",
      description:
        "Work with API-driven features, data flows, and database-backed application behavior, including PostgreSQL-oriented project experience.",
      iconKey: "database",
    },
    {
      id: "llm-agentic-tools",
      title: "LLM & Agentic Tools",
      description:
        "Use LLMs, agentic coding tools, and automation workflows to accelerate research, implementation, debugging, documentation, and productivity.",
      iconKey: "zap",
    },
    {
      id: "collaboration-delivery",
      title: "Collaboration & Delivery",
      description:
        "Work with requirements, feedback, documentation, and team workflows to deliver clear, dependable software features.",
      iconKey: "users",
    },
  ],
  closingNote:
    "I am targeting Software Engineer roles where I can combine front-end depth, product thinking, testing discipline, database awareness, and AI-assisted automation to ship useful software.",
} satisfies AboutOverviewData
