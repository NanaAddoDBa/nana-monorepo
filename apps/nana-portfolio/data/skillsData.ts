import type { SkillsData } from "@/types/aboutSectionTypes"

const items = (names: string[]) =>
  names.map((name) => ({
    name,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  }))

export const skillsData: SkillsData = {
  programming: [
    {
      category: "Frontend",
      items: items([
        "React.js",
        "Next.js",
        "TypeScript",
        "JavaScript (ES6+)",
        "HTML5",
        "CSS3",
        "Tailwind CSS",
      ]),
    },
    {
      category: "APIs & data",
      items: items([
        "Python",
        "SQL",
        "Node.js",
        "NestJS",
        "REST APIs",
        "PostgreSQL",
        "Supabase",
        "Prisma",
      ]),
    },
    {
      category: "UI engineering",
      items: items([
        "Responsive interfaces",
        "Reusable components",
        "State management",
        "Forms",
        "Component architecture",
      ]),
    },
  ],
  testing: [
    {
      category: "Testing & quality",
      items: items([
        "Playwright",
        "Cypress",
        "Jest",
        "Vitest",
        "Debugging",
        "Regression testing",
      ]),
    },
    {
      category: "AI applications",
      items: items([
        "LLM APIs",
        "Retrieval-augmented generation (RAG)",
        "Prompt engineering",
        "Output validation",
        "LangChain",
        "OpenClaw",
      ]),
    },
  ],
  productivity: [
    {
      category: "Automation",
      items: items(["n8n", "Power Automate", "SharePoint", "Copilot Studio"]),
    },
    {
      category: "Development & delivery",
      items: items([
        "Git",
        "GitHub Actions",
        "Vite",
        "Docker Compose",
        "CI/CD",
        "Jira",
      ]),
    },
  ],
  languageSkills: [
    { name: "English", slug: "english", level: "Fluent (C2)" },
    { name: "German", slug: "german", level: "A2" },
    { name: "Twi", slug: "twi", level: "Native" },
  ],
  softSkills: [
    {
      category: "Working together",
      items: items([
        "Stakeholder requirements",
        "Problem solving",
        "Technical support",
      ]),
    },
  ],
}

export const skillsAccordionSectionsData = [
  {
    id: "programming",
    title: "Frontend, APIs & data",
    type: "categories",
    dataKey: "programming",
  },
  {
    id: "testing",
    title: "AI applications & testing",
    type: "categories",
    dataKey: "testing",
  },
  {
    id: "productivity",
    title: "Automation & delivery",
    type: "categories",
    dataKey: "productivity",
  },
  {
    id: "languages-spoken",
    title: "Languages",
    type: "languages",
    dataKey: "languageSkills",
  },
  {
    id: "soft-skills",
    title: "Collaboration",
    type: "categories",
    dataKey: "softSkills",
  },
] as const
