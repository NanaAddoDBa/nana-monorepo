import type { ProjectsData } from "@/types/projectsSectionTypes"

export const projectsData = {
  heading: "Projects",
  intro:
    "Selected product, platform, and automation work with an emphasis on reliability, usability, and maintainable delivery.",
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
        "Created a focused workflow for recording and organizing expenses",
        "Made spending records easier to review",
        "Designed reliable data-entry and retrieval flows",
        "Prioritized clear mobile interactions",
      ],
      links: [
        {
          label: "Repository",
          href: "https://github.com/NanaAddoDBa/nana-monorepo/tree/master/apps/mobile-expense-tracker",
        },
      ],
    },
    {
      id: "nana-monorepo",
      title: "Nana Monorepo",
      organization: "Personal Project",
      summary:
        "Built a multi-application repository with shared development workflows, continuous integration, container packaging, and cloud deployment foundations.",
      techStack: [
        "Next.js",
        "React",
        "TypeScript",
        "Tailwind CSS",
        "shadcn/ui",
        "GitHub API",
        "Terraform",
        "Cloud Run",
        "Automation",
      ],
      category: "Monorepo Platform",
      featured: true,
      source: "github",
      owner: "NanaAddoDBa",
      updatedAt: "2026-06-17",
      outcomes: [
        "Organized the portfolio and mobile expense tracker as independent applications",
        "Standardized app commands and CI workflows across the repository",
        "Added Docker packaging and Cloud Run infrastructure",
        "Preserved independent project and deployment boundaries",
      ],
      links: [
        {
          label: "Monorepo",
          href: "https://github.com/NanaAddoDBa/nana-monorepo",
        },
      ],
    },
    {
      id: "portfolio-website",
      title: "Portfolio Website",
      organization: "Personal Project",
      summary:
        "Built a recruiter-facing portfolio that presents engineering experience, selected projects, technical capabilities, CVs, and direct contact options.",
      techStack: [
        "Next.js",
        "React",
        "TypeScript",
        "Tailwind CSS",
        "shadcn/ui",
        "GitHub API",
        "Resend",
        "Playwright",
      ],
      category: "Portfolio App",
      featured: true,
      source: "github",
      owner: "NanaAddoDBa",
      updatedAt: "2026-06-17",
      outcomes: [
        "Built a responsive recruiter-facing portfolio experience",
        "Connected project cards to public GitHub repository data",
        "Added contact form validation, email delivery, and Telegram notification support",
        "Added project-card tests and Playwright smoke coverage",
      ],
      links: [
        {
          label: "Sub-project",
          href: "https://github.com/NanaAddoDBa/nana-monorepo/tree/master/apps/nana-portfolio",
        },
      ],
    },
  ],
} satisfies ProjectsData
