import type { CredentialsData } from "@/types/aboutSectionTypes"

export const credentialsData: CredentialsData = {
  educationHeading: "Education",
  educationItems: [
    {
      id: "msc-computer-science-passau",
      degree: "Master of Computer Science (MSc)",
      institution: "University of Passau",
      location: "Passau, Germany",
      startDate: "04.2023",
      endDate: "03.2027",
    },
    {
      id: "bsc-computer-science-csu",
      degree: "Bachelor of Computer Science (BSc)",
      institution: "Christian Service University",
      location: "Kumasi, Ghana",
      startDate: "08.2015",
      endDate: "06.2019",
    },
  ],
  certificationsHeading: "Certifications",
  certificationItems: [
    {
      id: "react-complete-guide",
      title: "React - The Complete Guide (incl. Next.js, Redux)",
      issuer: "Udemy",
    },
    {
      id: "modern-javascript-beginning",
      title: "Modern JavaScript From The Beginning 2.0",
      issuer: "Udemy",
    },
    {
      id: "cypress-web-automation",
      title: "Cypress: Web Automation Testing from Zero to Hero",
      issuer: "Udemy",
    },
    {
      id: "software-development-advanced-diploma",
      title: "Software Development | Advanced Diploma",
      issuer: "IPMC",
      location: "Ghana",
    },
    {
      id: "database-administration-advanced-diploma",
      title: "Database Administration | Advanced Diploma",
      issuer: "IPMC",
      location: "Ghana",
    },
  ],
}
