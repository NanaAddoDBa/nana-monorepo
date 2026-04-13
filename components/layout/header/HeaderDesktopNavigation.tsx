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

type NavigationDropdownLinkProps = {
  href: string
  label: string
  description?: string
  ariaLabel?: string
  className?: string
}

function NavigationDropdownLink({
  href,
  label,
  description,
  ariaLabel,
  className,
}: Readonly<NavigationDropdownLinkProps>) {
  return (
    <NavigationMenuLink asChild>
      <Link
        href={href}
        aria-label={ariaLabel}
        className={cn(
          "block rounded-md p-3 no-underline transition-colors outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
          className
        )}
      >
        <div className="space-y-1">
          <p className="text-sm leading-none font-medium">{label}</p>
          {description ? (
            <p className="line-clamp-2 text-sm leading-5 text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
      </Link>
    </NavigationMenuLink>
  )
}

export function HeaderDesktopNavigation({
  className,
}: Readonly<HeaderDesktopNavigationProps>) {
  return (
    <NavigationMenu className={cn("hidden lg:flex", className)}>
      <NavigationMenuList className="gap-1">
        {navigationData.map((item) => {
          const subItems = "items" in item ? item.items : undefined
          const hasSubmenu = Boolean(subItems?.length)

          return (
            <NavigationMenuItem key={item.id}>
              {hasSubmenu ? (
                <>
                  <NavigationMenuTrigger className="bg-transparent px-4 text-sm font-medium">
                    {item.label}
                  </NavigationMenuTrigger>

                  <NavigationMenuContent>
                    <div className="grid w-[560px] grid-cols-[220px_1fr] gap-3 p-3">
                      <NavigationDropdownLink
                        href={item.href ?? "#about"}
                        ariaLabel={item.ariaLabel}
                        label={item.label}
                        description={item.description}
                        className="flex h-full flex-col justify-between rounded-lg border border-border/60 bg-secondary/30 p-4"
                      />

                      <ul className="grid gap-2">
                        {subItems?.map((subItem) => (
                          <li key={subItem.id}>
                            <NavigationDropdownLink
                              href={subItem.href}
                              ariaLabel={subItem.ariaLabel}
                              label={subItem.label}
                              description={subItem.description}
                            />
                          </li>
                        ))}
                      </ul>
                    </div>
                  </NavigationMenuContent>
                </>
              ) : (
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
              )}
            </NavigationMenuItem>
          )
        })}
      </NavigationMenuList>
    </NavigationMenu>
  )
}
