import * as React from "react";
import { cn } from "@/shared/lib/cn";

// Accessible native select with shadcn-compatible design tokens.
export function Select({ className, ...props }: React.ComponentProps<"select">) {
  return <select data-slot="native-select" className={cn("h-12 w-full min-w-0 cursor-pointer appearance-none rounded-xl border border-input bg-background px-4 pr-8 text-sm text-foreground outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20", className)} {...props} />;
}