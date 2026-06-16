import type { SkillsData } from "@/types/aboutSectionTypes"

export const skillsData: SkillsData = {
  programming: [
    {
      category: "Languages",
      items: [
        { name: "JavaScript", slug: "javascript" },
        { name: "TypeScript", slug: "typescript" },
        { name: "SQL", slug: "sql" },
        { name: "HTML", slug: "html5" },
        { name: "CSS", slug: "css3" },
      ],
    },
    {
      category: "Frameworks & Libraries",
      items: [
        { name: "React", slug: "react" },
        { name: "Next.js", slug: "next-dot-js" },
        { name: "Node.js", slug: "node-dot-js" },
        { name: "Vue.js", slug: "vue-dot-js" },
      ],
    },
    {
      category: "Styling & UI",
      items: [
        { name: "Tailwind CSS", slug: "tailwindcss" },
        { name: "Bootstrap", slug: "bootstrap" },
        { name: "shadcn/ui", slug: "shadcn" },
      ],
    },
    {
      category: "APIs, Data & Workflow",
      items: [
        { name: "REST APIs", slug: "rest-apis" },
        { name: "PostgreSQL", slug: "postgresql" },
        { name: "Database Management", slug: "database-management" },
        { name: "Workflow Automation", slug: "workflow-automation" },
        { name: "GitHub", slug: "github" },
        { name: "GitLab", slug: "gitlab" },
        { name: "Figma", slug: "figma" },
      ],
    },
  ],
  testing: [
    {
      category: "Testing & QA",
      items: [
        { name: "Jest", slug: "jest" },
        { name: "Cypress", slug: "cypress" },
        { name: "Postman", slug: "postman" },
        { name: "Manual Testing", slug: "manual-testing" },
        { name: "Debugging", slug: "debugging" },
        { name: "Regression Testing", slug: "regression-testing" },
      ],
    },
    {
      category: "AI & Automation",
      items: [
        { name: "LLM-Assisted Development", slug: "llm-assisted-development" },
        { name: "Agentic Coding Tools", slug: "agentic-coding-tools" },
        { name: "Prompt Engineering", slug: "prompt-engineering" },
        { name: "Developer Automation", slug: "developer-automation" },
      ],
    },
  ],
  productivity: [
    {
      category: "Collaboration & Documentation",
      items: [
        { name: "Slack", slug: "slack" },
        { name: "Microsoft Teams", slug: "microsoft-teams" },
        { name: "Zoom", slug: "zoom" },
        { name: "Notion", slug: "notion" },
        { name: "Confluence", slug: "confluence" },
        { name: "Google Docs", slug: "google-docs" },
      ],
    },
  ],
  languageSkills: [
    { name: "English", slug: "english", level: "Native" },
    { name: "German", slug: "german", level: "Intermediate (B1)" },
  ],
  softSkills: [
    {
      category: "Collaboration & Communication",
      items: [
        { name: "Communication", slug: "communication" },
        { name: "Collaboration", slug: "collaboration" },
      ],
    },
    {
      category: "Execution & Thinking",
      items: [
        { name: "Problem Solving", slug: "problem-solving" },
        { name: "Attention to Detail", slug: "attention-to-detail" },
        { name: "Adaptability", slug: "adaptability" },
        { name: "Time Management", slug: "time-management" },
      ],
    },
  ],
}

export const skillsAccordionSectionsData = [
  {
    id: "programming",
    title: "Programming",
    type: "categories",
    dataKey: "programming",
  },
  {
    id: "testing",
    title: "Testing & QA",
    type: "categories",
    dataKey: "testing",
  },
  {
    id: "productivity",
    title: "Productivity & Tools",
    type: "categories",
    dataKey: "productivity",
  },
  {
    id: "languages-spoken",
    title: "Languages Spoken",
    type: "languages",
    dataKey: "languageSkills",
  },
  {
    id: "soft-skills",
    title: "Soft Skills",
    type: "categories",
    dataKey: "softSkills",
  },
] as const
