import type { AboutOverviewData } from "@/types/aboutSectionTypes"

export const aboutOverviewData = {
  eyebrow: "A little about me",
  heading: "Thoughtful interfaces. Reliable systems.",
  summary:
    "I'm Nana Addo Dankwa Bampoe Addo, a software developer based in Passau, Germany. I build responsive web applications with React, Next.js and TypeScript, and develop LLM applications and workflow automation with Python, SQL and APIs. I'm completing an M.Sc. in Computer Science at the University of Passau, where my thesis explores guided Scratch tutoring.",
  stats: [
    { id: "focus", value: "React + TypeScript", label: "Frontend engineering" },
    { id: "approach", value: "LLMs + Automation", label: "Applied AI" },
    {
      id: "education",
      value: "M.Sc. candidate",
      label: "University of Passau",
    },
  ],
  expertiseHeading: "What I bring to a team",
  expertiseItems: [
    {
      id: "frontend-development",
      title: "Frontend engineering",
      description:
        "Responsive interfaces, reusable components, state management and API-connected user journeys with React, Next.js and TypeScript.",
      iconKey: "laptop",
    },
    {
      id: "ai-applications",
      title: "LLM applications",
      description:
        "Context-aware guidance, retrieval-augmented generation and model-output validation, grounded in application data and automated checks.",
      iconKey: "blocks",
    },
    {
      id: "testing-quality",
      title: "Testing & automation",
      description:
        "UI and regression testing with Playwright, Cypress, Jest and Vitest, alongside Python and Power Automate workflows for recurring tasks.",
      iconKey: "testTube",
    },
  ],
  closingNote:
    "Available for full-time opportunities in frontend engineering, LLM applications and workflow automation.",
} satisfies AboutOverviewData
