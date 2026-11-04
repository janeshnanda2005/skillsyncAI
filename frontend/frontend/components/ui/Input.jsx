import React from "react";
import { cn } from "../../lib/utils";

export default function Input({ className, label, ...props }) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label className="text-xs font-bold uppercase tracking-widest text-fg-subtle">
          {label}
        </label>
      )}
      <input
        className={cn(
          "h-10 w-full rounded bg-bg-elevated border border-border px-3 py-2 text-sm text-fg",
          "placeholder:text-fg-subtle/60",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-border-strong",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          className
        )}
        {...props}
      />
    </div>
  );
}


export { Input };
