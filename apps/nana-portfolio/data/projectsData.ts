import type { ProjectsData } from "@/types/projectsSectionTypes"

export const projectsData = {
  heading: "Selected projects",
  intro:
    "A closer look at the interfaces, learning tools and automation workflows I build.",
  items: [
    {
      id: "guided-scratch-tutor",
      title: "Guided Scratch Tutoring Assistant",
      organization: "Master's thesis · University of Passau",
      summary:
        "A context-aware Scratch tutor that brings learner project state, static analysis and behavioural tests into the feedback loop.",
      techStack: [
        "React",
        "JavaScript",
        "LLM APIs",
        "LitterBox",
        "Whisker",
        "Docker Compose",
      ],
      category: "Applied AI",
      featured: true,
      status: "Thesis · in progress",
      outcomes: [
        "Validates generated edits in isolated project copies before presenting them.",
        "Invalidates outdated guidance after workspace changes and requires fresh tests before step completion.",
      ],
    },
    {
      id: "flashcard-learning-platform",
      title: "Flashcard Learning Platform",
      organization: "Personal project",
      summary:
        "An interactive study experience with 3D flashcards, saved deck libraries and recall-based review scheduling.",
      techStack: ["React", "Vite", "JavaScript", "Supabase", "PostgreSQL"],
      category: "Frontend",
      featured: true,
      status: "Personal project",
      outcomes: [
        "Keyboard and touch navigation across browsing, deck previews and study sessions.",
        "Persistent sessions with ownership checks and duplicate-review prevention.",
      ],
    },
    {
      id: "mobile-expenses-tracker",
      title: "Expense Tracker & Budget Manager",
      organization: "Personal project",
      summary:
        "Responsive account, expense and budget workflows, with savings goals and user-scoped financial records.",
      techStack: ["React", "TypeScript", "NestJS", "Prisma", "PostgreSQL"],
      category: "Full stack",
      featured: true,
      status: "Personal project",
      source: "github",
      outcomes: [
        "Connects account and transaction screens to filtered, paginated REST APIs.",
        "Frontend and API checks run through GitHub Actions.",
      ],
      links: [
        {
          label: "View source",
          href: "https://github.com/NanaAddoDBa/Mobile-expence-tracker",
        },
      ],
    },
    {
      id: "ai-customer-support-agent",
      title: "AI Customer-Support Agent",
      organization: "Customer-support project",
      summary:
        "A retrieval-augmented support agent connecting a business knowledge base, LLM APIs and Telegram to answer customer enquiries.",
      techStack: ["OpenClaw", "RAG", "LLM APIs", "Telegram"],
      category: "Applied AI",
      featured: true,
      status: "Application project",
      outcomes: [
        "Retrieves business context to inform answers to customer questions.",
        "Connects the support workflow to a Telegram interface.",
      ],
    },
    {
      id: "ecommerce-storefront-prototype",
      title: "E-Commerce Storefront Prototype",
      organization: "Interactive demo",
      summary:
        "A responsive storefront with product browsing, search, filters, wishlist and persistent shopping-cart interactions.",
      techStack: [
        "Next.js",
        "React",
        "TypeScript",
        "Tailwind CSS",
        "Playwright",
      ],
      category: "Frontend",
      featured: true,
      status: "Prototype",
      outcomes: [
        "Keeps browsing and shopping interactions usable across screen sizes.",
        "Customer journeys covered with Playwright.",
      ],
    },
  ],
} satisfies ProjectsData
