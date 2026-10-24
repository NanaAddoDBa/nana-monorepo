"use client"

import { useRef, useState } from "react"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { navigationData } from "@/data/navigationData"

export function MobileNavigation() {
  const [open, setOpen] = useState(false)
  const destination = useRef<string | null>(null)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="size-11 lg:hidden"
          aria-label="Open navigation"
        >
          <Menu className="size-5" aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent
        onCloseAutoFocus={(event) => {
          if (destination.current) {
            event.preventDefault()
            const section = document.querySelector<HTMLElement>(
              destination.current
            )
            section?.focus({ preventScroll: true })
            section?.scrollIntoView({ block: "start" })
            destination.current = null
          }
        }}
      >
        <SheetHeader className="pt-8">
          <SheetTitle>Explore the portfolio</SheetTitle>
          <SheetDescription>
            Projects, experience and ways to get in touch.
          </SheetDescription>
        </SheetHeader>
        <nav aria-label="Mobile navigation" className="grid gap-2 px-4">
          {navigationData.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className="rounded-lg px-4 py-4 text-base font-medium hover:bg-muted"
              onClick={() => {
                destination.current = item.href
                setOpen(false)
              }}
            >
              {item.label}
            </a>
          ))}
          <a
            href="#cv"
            className="rounded-lg px-4 py-4 text-base font-medium hover:bg-muted"
            onClick={() => {
              destination.current = "#cv"
              setOpen(false)
            }}
          >
            Download CVs
          </a>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
