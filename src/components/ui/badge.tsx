import * as React from "react";
import { cn } from "@/lib/utils";

const Badge = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & {
    variant?: "default" | "secondary" | "destructive" | "outline";
  }
>(({ className, variant, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
      {
        "bg-primary text-primary-foreground hover:bg-primary/80": variant === "default",
        "bg-secondary text-secondary-foreground hover:bg-secondary/80": variant === "secondary",
        "bg-destructive text-destructive-foreground hover:bg-destructive/80": variant === "destructive",
        "text-foreground border border-input bg-background hover:bg-accent hover:text-accent-foreground": variant === "outline",
      },
      className
    )}
    {...props}
  />
));
Badge.displayName = "Badge";

export { Badge };