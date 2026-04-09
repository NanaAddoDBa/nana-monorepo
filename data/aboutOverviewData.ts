import type { AboutOverviewData } from "@/types/aboutTypes"

export const aboutOverviewData = {
  eyebrow: "Overview",
  heading: "Professional Summary",
  summary:
    "I build thoughtful digital experiences that balance technical depth, maintainable architecture, and clear user-centered design. My background spans software testing, web development, database work, and technical problem-solving, with a strong focus on quality, performance, and practical implementation.",
  stats: [
    {
      id: "experience",
      value: "06+",
      label: "Years in IT",
    },
    {
      id: "focus",
      value: "QA + UI",
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
      id: "qa-testing",
      title: "QA & Testing",
      description:
        "Experienced in automated and manual testing, with a focus on software reliability, test strategy, and continuous quality improvement.",
      iconKey: "testTube",
    },
    {
      id: "web-development",
      title: "Web Development",
      description:
        "Builds responsive and maintainable web applications using modern frontend frameworks and strong implementation patterns.",
      iconKey: "laptop",
    },
    {
      id: "database-management",
      title: "Database Management",
      description:
        "Comfortable working with database design, optimization, and data integrity to support reliable application behavior.",
      iconKey: "database",
    },
    {
      id: "programming",
      title: "Programming",
      description:
        "Strong foundation across multiple programming languages with an emphasis on readable, efficient, and scalable code.",
      iconKey: "code",
    },
    {
      id: "quality-control",
      title: "Quality Control",
      description:
        "Applies structured validation, careful review, and systematic improvement processes to maintain high delivery standards.",
      iconKey: "bug",
    },
    {
      id: "content-communication",
      title: "Content & Communication",
      description:
        "Able to create technical content, documentation, and clear communication assets that support product and team goals.",
      iconKey: "newspaper",
    },
  ],
  closingNote:
    "Always learning, always refining, and consistently aiming to turn complexity into clear, reliable user experiences.",
} satisfies AboutOverviewData
