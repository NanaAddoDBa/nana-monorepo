import Link from "next/link"

import { navigationData } from "@/data/navigationData"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"

type HeaderDesktopNavigationProps = {
  className?: string
}

export function HeaderDesktopNavigation({
  className,
}: Readonly<HeaderDesktopNavigationProps>) {
  return (
    <NavigationMenu className={cn("hidden lg:flex", className)}>
      <NavigationMenuList className="gap-1">
        {navigationData.map((item) => (
          <NavigationMenuItem key={item.id}>
            <NavigationMenuLink
              asChild
              className={cn(
                navigationMenuTriggerStyle(),
                "bg-transparent px-4 text-sm font-medium transition-colors"
              )}
            >
              <Link href={item.href ?? "#"} aria-label={item.ariaLabel}>
                {item.label}
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  )
}
