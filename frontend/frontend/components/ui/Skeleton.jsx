import React from "react";
import { cn } from "../../lib/utils";

export function Skeleton({ className, variant = "shimmer", ...props }) {
  const variants = { text: "h-4 w-full rounded", circular: "rounded-full aspect-square", rounded: "rounded-md", shimmer: "rounded-md" };
  return (
    <div className={cn("bg-muted", variant === "shimmer" && "relative overflow-hidden", variants[variant], className)} {...props}>
      {variant === "shimmer" && <div className="absolute inset-0 -translate-x-1/2 bg-gradient-to-r from-transparent via-background/50 to-transparent animate-shimmer" />}
    </div>
  );
}

export default Skeleton;