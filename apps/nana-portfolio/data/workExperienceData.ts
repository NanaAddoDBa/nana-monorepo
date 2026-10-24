import type { WorkExperienceData } from "@/types/aboutSectionTypes"

export const workExperienceData: WorkExperienceData = {
  eyebrow: "Experience",
  heading: "Professional experience",
  intro:
    "Web development, workflow automation and data reporting across commerce, marketing and regulatory operations.",
  items: [
    {
      id: "aiesec-automation-analyst",
      role: "AI Automation and Marketing Analyst",
      company: "AIESEC Germany",
      location: "Passau, Germany",
      workType: "Volunteer",
      period: "Oct 2025 – Mar 2026",
      summary:
        "Supported marketing operations through campaign reporting and repeatable automation workflows.",
      responsibilities: [
        "Built campaign reporting and email-generation workflows using Python, Power Automate and SharePoint.",
        "Analysed historical programme data to inform campaign targeting and enrolment planning.",
      ],
      skills: ["Python", "Power Automate", "SharePoint", "Data analysis"],
    },
    {
      id: "everything-beaded-software-developer",
      role: "Software Developer",
      company: "Everything Beaded",
      location: "Accra, Ghana",
      workType: "Remote",
      period: "2021 – Jun 2025",
      summary:
        "Developed and maintained responsive e-commerce interfaces and connected backend services.",
      responsibilities: [
        "Developed the company's e-commerce storefront in 2023 using React.js and Node.js.",
        "Built reusable components and REST APIs to translate stakeholder requirements into product and shopping workflows.",
        "Improved frontend behaviour, database queries and application data retrieval through debugging and performance optimisation.",
      ],
      skills: ["React", "Node.js", "REST APIs", "Database queries"],
    },
    {
      id: "fda-national-service",
      role: "IT Officer (National Service)",
      company: "Food and Drugs Authority (FDA)",
      location: "Greater Accra Region, Ghana",
      workType: "Contract",
      period: "Sep 2019 – Sep 2020",
      summary:
        "Built internal auditing and verification tools to support regulatory review and compliance tracking.",
      responsibilities: [
        "Digitised manual regulatory reviews with web interfaces and structured forms.",
        "Supported product-surveillance data collection, review, storage and reporting.",
        "Built automated data workflows and product-metrics dashboards for operational reporting.",
      ],
      skills: ["Web interfaces", "Data workflows", "Reporting"],
    },
    {
      id: "ccml-it-intern",
      role: "IT Technician Intern",
      company: "Christian Community Microfinance Limited (CCML)",
      location: "Accra, Ghana",
      period: "2018",
      summary:
        "Supported financial-application users and stakeholder reporting.",
      responsibilities: [
        "Developed SQL queries to extract client data and produce daily, monthly and annual reports.",
        "Resolved technical issues and supported staff with day-to-day software problems.",
      ],
      skills: ["SQL", "Reporting", "Technical support"],
    },
  ],
}
