import type { ProjectsData } from "@/types/projectsSectionTypes"

export const projectsData = {
  heading: "Projects",
  intro:
    "A selection of software engineering work focused on frontend development, API-connected workflows, automation, testing, database-backed systems, and practical delivery.",
  items: [
    {
      id: "regulatory-compliance-platform",
      title: "Regulatory Compliance Platform",
      organization: "Food and Drug Authority Ghana",
      summary:
        "Developed a specialized auditing tool that digitized manual verification processes, improved data handling, and strengthened oversight across regulated entities.",
      techStack: [
        "Web Application Development",
        "Workflow Automation",
        "Data Management",
        "Testing & Validation",
        "Process Digitization",
      ],
      category: "Internal Tooling",
      featured: true,
      source: "professional",
      outcomes: [
        "Digitized manual verification workflows",
        "Supported structured data capture and verification",
        "Improved validation and operational reporting workflows",
        "Improved oversight across regulated entities",
      ],
    },
    {
      id: "ecommerce-checkout-optimization",
      title: "E-Commerce Checkout Optimization",
      organization: "Everything Beaded",
      summary:
        "Optimized an end-to-end e-commerce payment flow using TypeScript, Node.js, PostgreSQL, and React to improve transaction reliability and checkout performance.",
      techStack: ["React", "TypeScript", "Node.js", "PostgreSQL"],
      category: "E-Commerce",
      featured: true,
      source: "professional",
      outcomes: [
        "Improved checkout flow performance",
        "Strengthened transaction reliability",
        "Worked across API, database, and frontend behavior",
        "Applied debugging and validation to reduce flow issues",
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
        "Data Organization",
      ],
      category: "Mobile Application",
      featured: true,
      source: "github",
      owner: "NanaAddoDBa",
      outcomes: [
        "Organized expense data into a simple mobile workflow",
        "Improved visibility into spending records",
        "Focused on reliable data entry and retrieval flows",
        "Focused on usability and clear interaction flow",
      ],
      links: [
        {
          label: "Repository",
          href: "https://github.com/NanaAddoDBa/Mobile-expence-tracker",
        },
      ],
    },
    {
      id: "portfolio-website",
      title: "Portfolio Website",
      organization: "Personal Project",
      summary:
        "Designed and developed a personal portfolio website to showcase software engineering skills, GitHub projects, technical experience, and frontend development approach through a structured, responsive, and modern user experience.",
      techStack: [
        "Next.js",
        "React",
        "TypeScript",
        "Tailwind CSS",
        "shadcn/ui",
        "GitHub API",
        "Automation",
      ],
      category: "Portfolio Website",
      featured: true,
      source: "github",
      owner: "NanaAddoDBa",
      outcomes: [
        "Presented projects and skills in a structured, recruiter-friendly format",
        "Connected project cards to public GitHub repository data",
        "Built a responsive interface across desktop and mobile layouts",
        "Used reusable components, typed data structures, and validation for maintainability",
      ],
      links: [
        {
          label: "Repository",
          href: "https://github.com/NanaAddoDBa/nana-portfolio",
        },
      ],
    },
  ],
} satisfies ProjectsData
