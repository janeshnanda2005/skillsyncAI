import React from "react";
import { cn } from "../../lib/utils";

export function Progress({ value, max = 100, className, showLabel = false, size = "default", color = "primary" }) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const sizes = { sm: "h-1", default: "h-2", lg: "h-3" };
  const colors = { primary: "bg-primary", success: "bg-success", warning: "bg-amber-500", destructive: "bg-destructive" };
  return (
    <div className={cn("w-full", className)}>
      <div className={cn("w-full overflow-hidden rounded-full bg-muted", sizes[size])} role="progressbar" aria-valuenow={percentage} aria-valuemin={0} aria-valuemax={100}>
        <div className={cn("h-full rounded-full transition-all duration-300 ease-out", colors[color])} style={{ width: percentage + "%" }} />
      </div>
      {showLabel && <span className="mt-1 text-xs text-muted-foreground">{Math.round(percentage)}%</span>}
    </div>
  );
}

export default Progress;