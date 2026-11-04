import React from "react";
import { cn } from "../../lib/utils";

export function Badge({ className, variant = "default", ...props }) {
  const variants = {
    default: "bg-primary/10 text-primary hover:bg-primary/20",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    success: "bg-success/10 text-success hover:bg-success/20",
    warning: "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 dark:text-amber-400",
    destructive: "bg-destructive/10 text-destructive hover:bg-destructive/20",
    outline: "text-foreground",
  };
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-transparent px-2.5 py-0.5 text-xs font-medium transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export default Badge;
