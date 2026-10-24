import type { HeroSlide } from "@/types/heroSectionTypes"

export const heroSlidesData = [
  {
    id: "intro",
    variant: "image",
    eyebrow: "Frontend & applied AI",
    title: "Hi, I'm Nana Addo.",
    highlightLine: "I build interfaces and intelligent workflows.",
    description:
      "From responsive React applications to LLM-powered learning tools, I turn complex requirements into clear, useful experiences.",
    primaryAction: {
      type: "link",
      label: "Explore my work",
      href: "#projects",
      variant: "primary",
    },
    secondaryAction: {
      type: "link",
      label: "Get in touch",
      href: "#contact",
      variant: "secondary",
    },
    image: {
      src: "/images/profile/nana-portrait.png",
      alt: "Nana Addo Dankwa Bampoe Addo",
    },
    supportingPoints: [
      "React & TypeScript",
      "LLM applications",
      "Workflow automation",
    ],
  },
] satisfies HeroSlide[]
