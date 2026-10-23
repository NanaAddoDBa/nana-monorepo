import { AboutContent } from "@/pages/static/ui/sections/AboutContent";
import { ContactContent } from "@/pages/static/ui/sections/ContactContent";
import { PrivacyContent, TermsContent } from "@/pages/static/ui/sections/LegalContent";

export type StaticPageKind = "about" | "contact" | "privacy" | "terms";

const pageMeta: Record<StaticPageKind, {
  eyebrow: string;
  title: string;
  description: string;
}> = {
  about: {
    eyebrow: "ABOUT AVENTRA",
    title: "Find a car for your plans.",
    description: "Browse vehicles, compare their features, and prepare an enquiry with your rental dates.",
  },
  contact: {
    eyebrow: "CONTACT",
    title: "Get in touch.",
    description: "Contact the operator about a vehicle, a rental request, or the next steps.",
  },
  privacy: {
    eyebrow: "PRIVACY",
    title: "Your privacy.",
    description: "An overview of browser storage and enquiry handling.",
  },
  terms: {
    eyebrow: "RENTAL INFORMATION",
    title: "Before you book.",
    description: "Important conditions to review before arranging a rental.",
  },
};

const contentByKind = {
  about: AboutContent,
  contact: ContactContent,
  privacy: PrivacyContent,
  terms: TermsContent,
};

export function StaticPage({ kind }: { kind: StaticPageKind }) {
  const { eyebrow, title, description } = pageMeta[kind];
  const Content = contentByKind[kind];

  return (
    <main className="page-container min-h-[62vh] py-18 md:py-24">
      <p className="mb-4 text-xs font-bold uppercase tracking-[.2em] text-primary">
        {eyebrow}
      </p>
      <h1 className="display-serif max-w-3xl text-[clamp(3.5rem,6.5vw,6.5rem)] leading-[1.02]">
        {title}
      </h1>
      <p className="mb-12 mt-7 max-w-2xl text-lg leading-8 text-muted-foreground">
        {description}
      </p>
      <Content />
    </main>
  );
}
