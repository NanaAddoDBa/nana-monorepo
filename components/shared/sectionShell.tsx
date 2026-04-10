import type { ReactNode } from "react"

import { Container } from "@/components/shared/container"
import { cn } from "@/lib/utils"

type SectionShellProps = {
  id?: string
  children: ReactNode
  className?: string
  contentClassName?: string
  withContainer?: boolean
  viewport?: "auto" | "screen-fit" | "hero-fit"
}

function getViewportClass(viewport: SectionShellProps["viewport"]) {
  switch (viewport) {
    case "screen-fit":
      return "min-h-[100svh]"
    case "hero-fit":
      return "min-h-[calc(100svh-3rem)]"
    default:
      return ""
  }
}

export function SectionShell({
  id,
  children,
  className,
  contentClassName,
  withContainer = true,
  viewport = "auto",
}: Readonly<SectionShellProps>) {
  const content = (
    <div
      className={cn(
        "w-full py-12 md:py-16 lg:py-20",
        getViewportClass(viewport),
        contentClassName
      )}
    >
      {children}
    </div>
  )

  return (
    <section id={id} className={cn("w-full", className)}>
      {withContainer ? <Container>{content}</Container> : content}
    </section>
  )
}
