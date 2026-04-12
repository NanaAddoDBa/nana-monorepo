import type { HeroSlide } from "@/types/heroSectionTypes"

export const heroSlidesData = [
  {
    id: "intro",
    variant: "image",
    density: "default",
    eyebrow: "welcome to my personal website",
    title: "Hello, I’m Nana Addo Dankwa Bampoe Addo",
    highlightLine: "Software Developer",
    description:
      "I enjoy building modern web applications with clean architecture and purposeful design, creating maintainable digital products that balance strong user experience, scalable structure, and practical engineering decisions.",
    primaryAction: {
      type: "link",
      label: "View Projects",
      href: "#projects",
      variant: "primary",
    },
    secondaryAction: {
      type: "downloadGroup",
      label: "Download CV",
      downloadGroupId: "primaryCv",
      variant: "secondary",
    },
    image: {
      src: "/images/profile/nana-portrait.png",
      alt: "Portrait of Nana Addo Dankwa Bampoe Addo",
    },
    supportingPoints: [
      "Next.js & React",
      "TypeScript-driven development",
      "Maintainable frontend architecture",
    ],
  },
  {
    id: "strengths",
    variant: "skills",
    density: "compact",
    eyebrow: "Core Strengths",
    title:
      "Frontend craft backed by API thinking, testing awareness, and scalable structure",
    highlightLine: "Clean Systems, Thoughtful Interfaces",
    description:
      "My work spans modern frontend development, backend integration, and clean implementation patterns that stay readable, modular, and easy to evolve over time.",
    primaryAction: {
      type: "link",
      label: "About Me",
      href: "#about",
      variant: "primary",
    },
    secondaryAction: {
      type: "link",
      label: "View Projects",
      href: "#projects",
      variant: "secondary",
    },
    supportingPoints: [
      "React, Next.js, Tailwind CSS",
      "Node.js, Express.js, REST APIs",
      "Testing, databases, and team collaboration",
    ],
  },
  {
    id: "proof",
    variant: "projects",
    density: "compact",
    eyebrow: "Selected Proof",
    title:
      "From e-commerce platform improvements to regulatory workflow digitization",
    highlightLine: "Projects With Real-World Impact",
    description:
      "My project experience includes improving reliability and performance in product workflows and contributing to systems that support operational efficiency, accountability, and better user outcomes.",
    primaryAction: {
      type: "link",
      label: "Explore Projects",
      href: "#projects",
      variant: "primary",
    },
    secondaryAction: {
      type: "link",
      label: "Let’s Connect",
      href: "#contact",
      variant: "secondary",
    },
    supportingPoints: [
      "E-commerce platform development",
      "Internal tooling for regulatory processes",
      "Current MSc in Computer Science",
    ],
  },
] satisfies HeroSlide[]
