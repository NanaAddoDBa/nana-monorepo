import { SiteFooter } from "@/components/layout/footer/siteFooter"
import { SiteHeader } from "@/components/layout/header/SiteHeader"
import { AboutSection } from "@/components/sections/about/aboutSection"
import { ContactSection } from "@/components/sections/contact/contactSection"
import { HeroSection } from "@/components/sections/hero/heroSection"
import { ProjectsSection } from "@/components/sections/projects/projectsSection"

export default function Page() {
  return (
    <>
      <SiteHeader />

      <main>
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
        <ContactSection />
      </main>

      <SiteFooter />
    </>
  )
}
