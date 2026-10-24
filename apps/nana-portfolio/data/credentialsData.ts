import type { CredentialsData } from "@/types/aboutSectionTypes"

export const credentialsData: CredentialsData = {
  educationHeading: "Education & technical qualifications",
  educationItems: [
    {
      id: "msc-computer-science-passau",
      degree: "M.Sc. Computer Science",
      institution: "University of Passau",
      location: "Passau, Germany",
      startDate: "Apr 2023",
      endDate: "Mar 2027 (expected)",
      description:
        "Master's thesis: Guided Scratch Tutoring Assistant, combining learner project state, static analysis and behavioural tests with LLM-generated guidance.",
    },
    {
      id: "bsc-computer-science-csu",
      degree: "B.Sc. Computer Science",
      institution: "Christian Service University College",
      location: "Kumasi, Ghana",
      endDate: "Jun 2019",
      description:
        "Awarded by the University of Ghana. Second Class Honours (Upper Division).",
    },
    {
      id: "database-technology-diploma",
      degree: "Advanced Professional Diploma in Database Technology",
      institution: "IPMC College of Technology",
      location: "Ghana",
      startDate: "May 2014",
      endDate: "Sep 2015",
    },
    {
      id: "software-engineering-diploma",
      degree: "Professional Diploma in Software Engineering",
      institution: "IPMC College of Technology",
      location: "Ghana",
      startDate: "Mar 2014",
      endDate: "Mar 2015",
    },
  ],
  certificationsHeading: "Selected courses",
  certificationItems: [
    {
      id: "cypress-web-automation",
      title: "Cypress: Web Automation Testing from Zero to Hero",
      issuer: "Udemy",
      issuedAt: "Aug 2024",
    },
    {
      id: "react-complete-guide",
      title: "React – The Complete Guide (incl. Next.js, Redux)",
      issuer: "Udemy",
    },
    {
      id: "modern-javascript-beginning",
      title: "Modern JavaScript From The Beginning 2.0",
      issuer: "Udemy",
    },
  ],
}
