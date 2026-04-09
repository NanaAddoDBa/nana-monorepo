import Link from "next/link"

import { navigationData } from "@/data/navigationData"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
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
      <NavigationMenuList>
        {navigationData.map((item) => {
          const subItems = "items" in item ? item.items : undefined

          return (
            <NavigationMenuItem key={item.id}>
              {subItems?.length ? (
                <>
                  <NavigationMenuTrigger className="bg-transparent">
                    {item.label}
                  </NavigationMenuTrigger>

                  <NavigationMenuContent>
                    <ul className="grid min-w-[240px] gap-1 p-2">
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            href={item.href}
                            aria-label={item.ariaLabel}
                            className="block rounded-md p-3 text-sm leading-none no-underline transition-colors outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            {item.label}
                          </Link>
                        </NavigationMenuLink>
                      </li>

                      {subItems.map((subItem) => (
                        <li key={subItem.id}>
                          <NavigationMenuLink asChild>
                            <Link
                              href={subItem.href}
                              aria-label={subItem.ariaLabel}
                              className="block rounded-md p-3 text-sm leading-none no-underline transition-colors outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            >
                              {subItem.label}
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </>
              ) : (
                <NavigationMenuLink
                  asChild
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "bg-transparent transition-colors"
                  )}
                >
                  <Link href={item.href} aria-label={item.ariaLabel}>
                    {item.label}
                  </Link>
                </NavigationMenuLink>
              )}
            </NavigationMenuItem>
          )
        })}
      </NavigationMenuList>
    </NavigationMenu>
  )
}
