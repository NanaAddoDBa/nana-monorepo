import * as React from "react";
import { cn } from "@/shared/lib/cn";

export function Input({ className, type = "text", ...props }: React.ComponentProps<"input">) {
  return <input data-slot="input" type={type} className={cn("h-12 w-full min-w-0 rounded-xl border border-input bg-background px-4 text-sm text-foreground shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 disabled:opacity-50", className)} {...props} />;
}