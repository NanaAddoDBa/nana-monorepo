import { HeaderDesktopNavigation } from "@/components/layout/header/HeaderDesktopNavigation"
import { MobileNavigation } from "@/components/layout/header/MobileNavigation"
import { Container } from "@/components/shared/container"
import { SiteLogo } from "@/components/shared/siteLogo"
import { ThemeSwitch } from "@/components/shared/themeSwitch"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-md">
      <Container>
        <div className="flex min-h-18 items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <SiteLogo priority />
            <a href="#hero" className="text-sm font-semibold">
              Nana Addo
              <span className="hidden text-xs font-normal text-muted-foreground sm:block">
                Frontend & applied AI
              </span>
            </a>
          </div>
          <HeaderDesktopNavigation />
          <div className="flex items-center gap-2">
            <a
              href="#cv"
              className="hidden min-h-11 items-center rounded-lg border border-border px-4 text-sm font-medium hover:bg-muted sm:inline-flex"
            >
              Download CVs
            </a>
            <ThemeSwitch className="size-11" />
            <MobileNavigation />
          </div>
        </div>
      </Container>
    </header>
  )
}
