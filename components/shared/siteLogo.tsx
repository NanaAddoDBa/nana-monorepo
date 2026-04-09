import Image from "next/image"
import Link from "next/link"

import { cn } from "@/lib/utils"

type SiteLogoProps = {
  className?: string
  href?: string
  ariaLabel?: string
  priority?: boolean
}

export function SiteLogo({
  className,
  href = "/",
  ariaLabel = "Go to home",
  priority = false,
}: Readonly<SiteLogoProps>) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className={cn(
        "inline-flex items-center rounded-md transition-opacity duration-200 ease-out",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none",
        "hover:opacity-90",
        className
      )}
    >
      <Image
        src="/icons/brand/logo.svg"
        alt="NADBA"
        width={500}
        height={500}
        priority={priority}
        className="h-15 w-15 shrink-0"
      />
    </Link>
  )
}
