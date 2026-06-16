import type { ProjectsData } from "@/types/projectsSectionTypes"

export const projectsData = {
  heading: "Projects",
  intro:
    "A selection of projects focused on workflow improvement, frontend development, and performance-focused web application delivery.",
  items: [
    {
      id: "regulatory-compliance-platform",
      title: "Regulatory Compliance Platform",
      organization: "Food and Drug Authority Ghana",
      summary:
        "Developed a specialized auditing tool that digitized manual verification processes and improved oversight and data accuracy across regulated entities.",
      techStack: [
        "Web Application Development",
        "Workflow Automation",
        "Process Digitization",
      ],
      category: "Internal Tooling",
      featured: true,
      outcomes: [
        "Digitized manual verification workflows",
        "Improved oversight across regulated entities",
        "Supported better data accuracy and accountability",
      ],
    },
    {
      id: "ecommerce-checkout-optimization",
      title: "E-Commerce Checkout Optimization",
      organization: "Web Application Project",
      summary:
        "Optimized an end-to-end e-commerce payment flow using TypeScript, Node.js, PostgreSQL, and React to improve transaction reliability and checkout performance.",
      techStack: ["React", "TypeScript", "Node.js", "PostgreSQL"],
      category: "E-Commerce",
      featured: true,
      outcomes: [
        "Improved checkout flow performance",
        "Strengthened transaction reliability",
        "Supported a smoother payment experience",
      ],
    },
    {
      id: "mobile-expenses-tracker",
      title: "Mobile Expenses Tracker",
      organization: "Personal Project",
      summary:
        "Built a mobile-focused expense tracking application designed to help users record, organize, and monitor spending more easily.",
      techStack: [
        "Mobile App Development",
        "Expense Tracking",
        "User Interface Design",
      ],
      category: "Mobile Application",
      featured: true,
      outcomes: [
        "Organized expense data into a simple mobile workflow",
        "Improved visibility into spending records",
        "Focused on usability and clear interaction flow",
      ],
    },
    {
      id: "portfolio-website",
      title: "Portfolio Website",
      organization: "Personal Project",
      summary:
        "Designed and developed a personal portfolio website to showcase projects, technical skills, and frontend development approach through a structured, responsive, and modern user experience.",
      techStack: [
        "Next.js",
        "React",
        "TypeScript",
        "Tailwind CSS",
        "shadcn/ui",
      ],
      category: "Portfolio Website",
      featured: true,
      outcomes: [
        "Presented projects and skills in a structured, recruiter-friendly format",
        "Built a responsive interface across desktop and mobile layouts",
        "Used reusable components and typed data structures for maintainability",
      ],
    },
  ],
} satisfies ProjectsData
