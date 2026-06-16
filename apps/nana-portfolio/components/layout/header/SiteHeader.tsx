import { HeaderDesktopNavigation } from "@/components/layout/header/HeaderDesktopNavigation"
import { Container } from "@/components/shared/container"
import { SiteLogo } from "@/components/shared/siteLogo"
import { ThemeSwitch } from "@/components/shared/themeSwitch"

export function SiteHeader() {
  return (
    <header className="border-b border-border">
      <Container>
        <div className="grid min-h-12 w-full grid-cols-[1fr_auto_1fr] items-center gap-4">
          <div className="justify-self-start">
            <SiteLogo priority />
          </div>

          <div className="hidden lg:flex">
            <HeaderDesktopNavigation />
          </div>

          <div className="hidden justify-self-end lg:flex">
            <ThemeSwitch />
          </div>
        </div>
      </Container>
    </header>
  )
}
