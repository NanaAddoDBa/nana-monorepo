import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type HeroSlideFrameProps = {
  children: ReactNode
  className?: string
}

export function HeroSlideFrame({
  children,
  className,
}: Readonly<HeroSlideFrameProps>) {
  return (
    <div
      className={cn(
        "w-full px-8 py-6 sm:px-10 sm:py-8 lg:px-12 lg:py-10 xl:px-14",
        className
      )}
    >
      <div className="grid h-[calc(100svh-5.5rem)] grid-rows-[minmax(0,1fr)_3.5rem]">
        <div className="min-h-0 overflow-hidden">{children}</div>

        <div aria-hidden="true" className="flex items-center justify-center">
          <div className="h-3 w-24" />
        </div>
      </div>
    </div>
  )
}
