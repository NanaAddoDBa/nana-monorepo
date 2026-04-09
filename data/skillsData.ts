//src\assets\data\skillsData.ts

// Create these types in a new file: src/types/skills.ts
export interface SkillItem {
  name: string
  slug: string
}

export interface SkillCategory {
  category: string
  items: SkillItem[]
}

export interface LanguageSkill {
  name: string
  slug: string
  level: string
}

export interface SkillsData {
  testing: SkillCategory[]
  programming: SkillCategory[]
  contentCreation: SkillCategory[]
  productivity: SkillCategory[]
  languageSkills: LanguageSkill[]
  softSkills: string[]
}

export const skillsData = {
  testing: [
    {
      category: "Test Automation Tools",
      items: [
        { name: "Cypress", slug: "cypress" },
        { name: "Selenium", slug: "selenium" },
        { name: "JUnit", slug: "junit" },
        { name: "TestNG", slug: "testng" },
        { name: "Jest", slug: "jest" },
      ],
    },
    {
      category: "Manual Testing",
      items: [
        { name: "Functional Testing", slug: "functional-testing" },
        { name: "Regression Testing", slug: "regression-testing" },
        { name: "Exploratory Testing", slug: "exploratory-testing" },
        { name: "Usability Testing", slug: "usability-testing" },
      ],
    },
    {
      category: "Defect Tracking",
      items: [
        { name: "JIRA", slug: "jira" },
        { name: "Bugzilla", slug: "bugzilla" },
      ],
    },
    {
      category: "Test Management",
      items: [
        { name: "TestRail", slug: "testrail" },
        { name: "Zephyr", slug: "zephyr" },
      ],
    },
    {
      category: "API Testing",
      items: [
        { name: "Postman", slug: "postman" },
        { name: "RESTful Services", slug: "restful-services" },
      ],
    },
    {
      category: "Performance Testing",
      items: [
        { name: "JMeter", slug: "jmeter" },
        { name: "LoadRunner", slug: "loadrunner" },
      ],
    },
    {
      category: "CI/CD Integration",
      items: [
        { name: "Jenkins", slug: "jenkins" },
        { name: "GitLab CI", slug: "gitlab-ci" },
        { name: "CircleCI", slug: "circleci" },
      ],
    },
  ],
  programming: [
    {
      category: "Languages",
      items: [
        { name: "Python", slug: "python" },
        { name: "Java", slug: "java" },
        { name: "JavaScript", slug: "javascript" },
        { name: "TypeScript", slug: "typescript" },
        { name: "SQL", slug: "sql" },
        { name: "Go", slug: "golang" },
        { name: "C#", slug: "csharp" },
      ],
    },
    {
      category: "Web Development",
      items: [
        { name: "HTML", slug: "html5" },
        { name: "CSS", slug: "css3" },
        { name: "React", slug: "react" },
        { name: "Next.js", slug: "next-dot-js" },
        { name: "Vue.js", slug: "vue-dot-js" },
        { name: "Tailwind CSS", slug: "tailwindcss" },
        { name: "Bootstrap", slug: "bootstrap" },
        { name: "ShadCN", slug: "shadcn" },
        { name: "Node.js", slug: "node-dot-js" },
      ],
    },
    {
      category: "Mobile Development",
      items: [
        { name: "React Native", slug: "react-native" },
        { name: "Expo", slug: "expo" },
        { name: "Flutter", slug: "flutter" },
        { name: "Swift", slug: "swift" },
      ],
    },
    {
      category: "Database Management",
      items: [
        { name: "MySQL", slug: "mysql" },
        { name: "PostgreSQL", slug: "postgresql" },
        { name: "MongoDB", slug: "mongodb" },
        { name: "Firebase", slug: "firebase" },
        { name: "Oracle Database", slug: "oracle-database" },
        { name: "Redis", slug: "redis" },
        { name: "Query Optimization", slug: "query-optimization" },
        { name: "Data Integrity", slug: "data-integrity" },
      ],
    },
  ],
  contentCreation: [
    {
      category: "Content Platforms",
      items: [
        { name: "Blogging", slug: "blogging" },
        { name: "Video Production", slug: "video-production" },
        { name: "Copywriting", slug: "copywriting" },
      ],
    },
    {
      category: "Digital Marketing",
      items: [
        { name: "Social Media Management", slug: "social-media-management" },
        { name: "SEO Optimization", slug: "seo-optimization" },
        { name: "Canva", slug: "canva" },
        { name: "Adobe Photoshop", slug: "adobe-photoshop" },
        { name: "Figma", slug: "figma" },
      ],
    },
  ],
  productivity: [
    {
      category: "Team Communication",
      items: [
        { name: "Slack", slug: "slack" },
        { name: "Microsoft Teams", slug: "microsoft-teams" },
        { name: "Zoom", slug: "zoom" },
      ],
    },
    {
      category: "Version Control",
      items: [
        { name: "GitHub", slug: "github" },
        { name: "GitLab", slug: "gitlab" },
        { name: "Bitbucket", slug: "bitbucket" },
      ],
    },
    {
      category: "Documentation",
      items: [
        { name: "Confluence", slug: "confluence" },
        { name: "Notion", slug: "notion" },
        { name: "Google Docs", slug: "google-docs" },
        { name: "Technical Writing", slug: "technical-writing" },
      ],
    },
  ],
  languageSkills: [
    { name: "English", slug: "english", level: "Native" },
    { name: "German", slug: "german", level: "Communicative (B1)" },
  ],
  softSkills: [
    "Time Management",
    "Attention to Detail",
    "Team Collaboration",
    "Adaptability",
    "Communication",
    "Problem-Solving",
    "Critical Thinking",
    "Creativity",
    "Emotional Intelligence",
    "Leadership",
    "Conflict Resolution",
  ],
}
