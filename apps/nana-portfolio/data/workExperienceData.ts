import type { WorkExperienceData } from "@/types/aboutSectionTypes"

export const workExperienceData: WorkExperienceData = {
  eyebrow: "Experience",
  heading: "Professional Experience",
  intro:
    "My experience combines front-end engineering, API-connected product work, testing, database-backed workflows, internal tooling, automation, and collaborative software delivery.",
  items: [
    {
      id: "everything-beaded-software-developer",
      role: "Software Developer",
      company: "Everything Beaded",
      location: "Accra, Ghana",
      workType: "Remote",
      period: "03.2022 - 11.2025",
      summary:
        "Worked on an e-commerce platform with a focus on frontend delivery, API-driven functionality, testing, database-aware performance improvements, and maintainable implementation.",
      responsibilities: [
        "Developed and maintained user-facing features for an e-commerce platform using React, TypeScript, JavaScript, and Node.js.",
        "Supported API-driven workflows across product, checkout, and payment-related user journeys.",
        "Improved application and database-backed performance to support smoother user experiences.",
        "Used testing, debugging, and validation practices to improve reliability and reduce regressions.",
        "Applied LLM-assisted and automation-focused workflows to support research, implementation, documentation, and development speed.",
        "Collaborated with stakeholders to translate requirements into clean and maintainable frontend solutions.",
      ],
      skills: [
        "React",
        "TypeScript",
        "Node.js",
        "Database Performance",
        "Testing",
        "Frontend Development",
        "API Integration",
        "LLM-Assisted Development",
        "Automation",
        "Performance Optimization",
      ],
    },
    {
      id: "fda-it-specialist-internship",
      role: "IT Specialist (Internship)",
      company: "Food and Drug Authority",
      location: "Accra, Ghana",
      period: "02.2020 - 12.2021",
      summary:
        "Supported internal software delivery by building workflow tools, strengthening authentication, improving data handling, and contributing to structured team development processes.",
      responsibilities: [
        "Built and maintained internal tools that improved workflow efficiency for regulatory processes.",
        "Implemented secure authentication features to strengthen access control and protect sensitive operational data.",
        "Worked with data-oriented workflows that supported verification, reporting, and operational accountability.",
        "Supported testing, troubleshooting, and documentation for internal software workflows.",
        "Supported agile development activities to improve feature delivery and team collaboration.",
      ],
      skills: [
        "Authentication",
        "Workflow Optimization",
        "Data Management",
        "Testing",
        "Automation",
        "Agile Development",
      ],
    },
  ],
}
