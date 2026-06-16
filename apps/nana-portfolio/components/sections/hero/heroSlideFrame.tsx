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
        "w-full px-8 pt-6 pb-14 sm:px-10 sm:pt-8 sm:pb-16 lg:px-12 lg:pt-10 lg:pb-20 xl:px-14",
        className
      )}
    >
      <div className="flex items-center">
        <div className="w-full">{children}</div>
      </div>
    </div>
  )
}
