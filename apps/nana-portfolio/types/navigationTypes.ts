export type NavigationItemId = "home" | "about" | "projects" | "contact"

export type NavigationHref = `#${string}` | `/${string}`

export type NavigationMenuItem = {
  id: string
  label: string
  href: NavigationHref
  ariaLabel?: string
  description?: string
}

export type NavigationItem = {
  id: NavigationItemId
  label: string
  href?: NavigationHref
  ariaLabel?: string
  description?: string
  items?: NavigationMenuItem[]
}
