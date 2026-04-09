import type { SkillsData } from "@/types/aboutTypes"
export const skillsData: SkillsData = {
  programming: [
    {
      category: "Languages",
      items: [
        { name: "JavaScript", slug: "javascript" },
        { name: "TypeScript", slug: "typescript" },
        { name: "HTML", slug: "html5" },
        { name: "CSS", slug: "css3" },
      ],
    },
    {
      category: "Frameworks & Libraries",
      items: [
        { name: "React", slug: "react" },
        { name: "Next.js", slug: "next-dot-js" },
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
      category: "Tools & Workflow",
      items: [
        { name: "GitHub", slug: "github" },
        { name: "GitLab", slug: "gitlab" },
        { name: "Figma", slug: "figma" },
      ],
    },
  ],

  testing: [
    {
      category: "Frontend Testing",
      items: [
        { name: "Jest", slug: "jest" },
        { name: "Cypress", slug: "cypress" },
        { name: "Postman", slug: "postman" },
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
