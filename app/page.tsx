import { SiteFooter } from "@/components/layout/footer/siteFooter"
import { SiteHeader } from "@/components/layout/header/SiteHeader"
import { AboutSection } from "@/components/sections/about/aboutSection"
import { ContactSection } from "@/components/sections/contact/contactSection"
import { HeroSection } from "@/components/sections/hero/heroSection"
import { ProjectsSection } from "@/components/sections/projects/projectsSection"

export default function Page() {
  return (
    <>
      <div className="border-2 border-red-500">
        <SiteHeader />
      </div>

      <main className="border-2 border-blue-500">
        <div className="border-2 border-green-500">
          <HeroSection />
        </div>

        <div className="border-2 border-yellow-500">
          <AboutSection />
        </div>

        <div className="border-2 border-purple-500">
          <ProjectsSection />
        </div>

        <div className="border-2 border-pink-500">
          <ContactSection />
        </div>
      </main>

      <div className="border-2 border-orange-500">
        <SiteFooter />
      </div>
    </>
  )
}
