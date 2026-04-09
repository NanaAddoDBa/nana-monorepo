import type { WorkExperienceData } from "@/types/aboutTypes"

export const workExperienceData = {
  eyebrow: "Experience",
  heading: "Professional Experience",
  intro:
    "My experience combines frontend-focused product development with internal tool building, secure system support, and collaborative software delivery.",
  items: [
    {
      id: "everything-beaded-software-developer",
      role: "Software Developer",
      company: "Everything Beaded",
      location: "Accra, Ghana",
      workType: "Remote",
      period: "03.2022 – 11.2025",
      summary:
        "Worked on an e-commerce platform with a focus on frontend delivery, API-driven functionality, performance improvements, and maintainable implementation.",
      responsibilities: [
        "Developed and maintained features for an e-commerce platform using React and Node.js.",
        "Supported user-facing workflows and API-driven functionality.",
        "Improved application and database performance to support smoother user experiences.",
        "Collaborated with stakeholders to translate requirements into clean and maintainable frontend solutions.",
      ],
      skills: [
        "React",
        "Node.js",
        "Frontend Development",
        "API Integration",
        "Performance Optimization",
      ],
    },
    {
      id: "fda-it-specialist-internship",
      role: "IT Specialist (Internship)",
      company: "Food and Drug Authority",
      location: "Accra, Ghana",
      period: "02.2020 – 12.2021",
      summary:
        "Supported internal software delivery by building workflow tools, strengthening authentication, and contributing to structured team development processes.",
      responsibilities: [
        "Built and maintained internal tools that improved workflow efficiency for regulatory processes.",
        "Implemented secure authentication features to strengthen access control and protect sensitive operational data.",
        "Supported agile development activities to improve feature delivery and team collaboration.",
      ],
      skills: ["Authentication", "Workflow Optimization", "Agile Development"],
    },
  ],
} satisfies WorkExperienceData
