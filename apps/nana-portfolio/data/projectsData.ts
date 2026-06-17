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
      id: "nana-monorepo",
      title: "Nana Monorepo",
      organization: "Personal Project",
      summary:
        "Created a personal monorepo that will eventually house all of my personal projects, with each project kept as its own app, package, or sub-project inside the repository.",
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
        "Housed the nana-portfolio website project under apps/nana-portfolio",
        "Prepared the repository to eventually house all personal projects as dedicated sub-projects",
        "Added shared app commands, CI foundations, Docker packaging, and Cloud Run infrastructure",
        "Kept sub-projects eligible for individual portfolio cards rather than treating the monorepo as one large project only",
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
        "Designed and developed nana-portfolio, the portfolio website project app housed inside Nana Monorepo, to showcase software engineering skills, GitHub projects, technical experience, CV links, and recruiter contact paths.",
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
