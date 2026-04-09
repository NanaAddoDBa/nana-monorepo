import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type ContainerProps = {
  children: ReactNode
  className?: string
}

export function Container({ children, className }: Readonly<ContainerProps>) {
  return (
    <div className={cn("w-full px-2 sm:px-4 lg:px-6", className)}>
      {children}
    </div>
  )
}
