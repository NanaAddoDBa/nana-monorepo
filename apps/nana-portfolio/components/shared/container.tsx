import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type ContainerProps = {
  children: ReactNode
  className?: string
}

export function Container({ children, className }: Readonly<ContainerProps>) {
  return (
    <div className={cn("w-full px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </div>
  )
}
