import { SiteFooter } from "@/components/layout/footer/siteFooter"
import { SiteHeader } from "@/components/layout/header/SiteHeader"
import { AboutSection } from "@/components/sections/about/aboutSection"
import { ContactSection } from "@/components/sections/contact/contactSection"
import { HeroSection } from "@/components/sections/hero/heroSection"
import { ProjectsSection } from "@/components/sections/projects/projectsSection"

export default function Page() {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only fixed top-3 left-3 z-50 rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground focus:not-sr-only"
      >
        Skip to content
      </a>
      <SiteHeader />

      <main id="main-content" tabIndex={-1}>
        <HeroSection />
        <ProjectsSection />
        <AboutSection />
        <ContactSection />
      </main>

      <SiteFooter />
    </>
  )
}
