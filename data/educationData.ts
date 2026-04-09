// src/assets/data/educationData.ts

export interface Education {
  degree: string;
  school: string;
  date: string;
  location?: string;
  description?: string[];
  type: 'degree' | 'certification';
}

export const educationData: {
  degrees: Education[];
  certifications: Education[];
} = {
  degrees: [
    {
      type: 'degree',
      degree: "Master of Science in Computer Science",
      school: "University of Passau",
      location: "Passau, Germany",
      date: "04/2023 – Present",
      description: [
        "Focus on Software Engineering and Systems Development",
        "Research in Modern Web Technologies and Cloud Computing",
      ]
    },
    {
      type: 'degree',
      degree: "Bachelor of Science in Computer Science",
      school: "Christian Service University College",
      location: "Ghana",
      date: "10/2015 – 06/2019",
      description: [
        "Graduated with First Class Honors",
        "Focus on Programming and Software Development",
      ]
    }
  ],
  certifications: [
    {
      type: 'certification',
      degree: "Advanced Diploma in Database Administration",
      school: "IPMC",
      location: "Ghana",
      date: "2018",
      description: [
        "Database Design and Implementation",
        "Database Security and Administration",
        "Performance Tuning and Optimization"
      ]
    },
    {
      type: 'certification',
      degree: "Advanced Diploma in Software Engineering",
      school: "IPMC",
      location: "Ghana",
      date: "2018",
      description: [
        "Software Development Life Cycle",
        "Object-Oriented Programming",
        "Web and Mobile Application Development"
      ]
    }
  ]
};