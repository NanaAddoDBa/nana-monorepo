import Link from "next/link"
import { ArrowRight, ChevronDown, Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cvDocumentsData } from "@/data/cvDocumentsData"
import { cn } from "@/lib/utils"
import type {
  HeroSlideAction,
  HeroSlideDownloadGroupAction,
  HeroSlideLinkAction,
} from "@/types/heroSectionTypes"

type HeroActionsSize = "default" | "compact"

type HeroActionsProps = {
  primaryAction: HeroSlideAction
  secondaryAction?: HeroSlideAction
  size?: HeroActionsSize
}

function getButtonVariant(variant: HeroSlideAction["variant"]) {
  return variant === "primary" ? "default" : "outline"
}

function getButtonSize(size: HeroActionsSize) {
  return size === "compact" ? "default" : "lg"
}

function getButtonClassName(size: HeroActionsSize) {
  return cn(
    "rounded-full",
    size === "compact" ? "h-10 px-4 text-sm" : "min-w-fit"
  )
}

function HeroLinkAction({
  action,
  isPrimary = false,
  size,
}: Readonly<{
  action: HeroSlideLinkAction
  isPrimary?: boolean
  size: HeroActionsSize
}>) {
  return (
    <Button
      asChild
      size={getButtonSize(size)}
      variant={getButtonVariant(action.variant)}
      className={getButtonClassName(size)}
    >
      <Link href={action.href}>
        <span>{action.label}</span>
        {isPrimary ? <ArrowRight data-icon="inline-end" /> : null}
      </Link>
    </Button>
  )
}

function HeroDownloadGroupAction({
  action,
  size,
}: Readonly<{
  action: HeroSlideDownloadGroupAction
  size: HeroActionsSize
}>) {
  const downloadGroup = cvDocumentsData.find(
    (group) => group.id === action.downloadGroupId
  )

  if (!downloadGroup) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size={getButtonSize(size)}
          variant={getButtonVariant(action.variant)}
          className={getButtonClassName(size)}
        >
          <Download data-icon="inline-start" />
          <span>{action.label}</span>
          <ChevronDown data-icon="inline-end" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="min-w-56">
        <DropdownMenuLabel>{downloadGroup.label}</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {downloadGroup.documents.map((document) => (
          <DropdownMenuItem key={document.id} asChild>
            <a href={document.href} download>
              <Download data-icon="inline-start" />
              <span>{document.label}</span>
            </a>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function HeroAction({
  action,
  isPrimary = false,
  size,
}: Readonly<{
  action: HeroSlideAction
  isPrimary?: boolean
  size: HeroActionsSize
}>) {
  if (action.type === "link") {
    return <HeroLinkAction action={action} isPrimary={isPrimary} size={size} />
  }

  return <HeroDownloadGroupAction action={action} size={size} />
}

export function HeroActions({
  primaryAction,
  secondaryAction,
  size = "default",
}: Readonly<HeroActionsProps>) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center pt-2",
        size === "compact" ? "gap-2" : "gap-3"
      )}
    >
      <HeroAction action={primaryAction} isPrimary size={size} />
      {secondaryAction ? (
        <HeroAction action={secondaryAction} size={size} />
      ) : null}
    </div>
  )
}
