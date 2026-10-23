import * as React from "react";
import { cn } from "@/shared/lib/cn";

export function Badge({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="badge" className={cn("inline-flex items-center rounded-full bg-muted px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-foreground", className)} {...props} />;
}