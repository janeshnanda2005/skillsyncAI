import React from "react";
import { cn } from "../../lib/utils";

export default function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn(
        "h-4 w-full rounded bg-bg-elevated border border-border animate-pulse",
        className
      )}
      {...props}
    />
  );
}


export { Skeleton };
