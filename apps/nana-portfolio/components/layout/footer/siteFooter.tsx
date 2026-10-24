import { ArrowUp } from "lucide-react"
import { Container } from "@/components/shared/container"

export function SiteFooter() {
  return (
    <footer className="border-t border-border py-6">
      <Container>
        <div className="flex flex-col justify-between gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Nana Addo Dankwa Bampoe Addo</p>
          <a
            href="#hero"
            className="inline-flex min-h-11 items-center gap-2 font-medium hover:text-primary"
          >
            Back to top <ArrowUp className="size-4" aria-hidden="true" />
          </a>
        </div>
      </Container>
    </footer>
  )
}
