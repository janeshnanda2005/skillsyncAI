import React from "react";
import { cn } from "../../lib/utils";

export default function EmptyState({ icon, title, description, action, className }) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center py-12 px-4", className)}>
      {icon && (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded bg-bg-elevated border border-border text-fg-muted">
          {icon}
        </div>
      )}
      <h3 className="text-base font-bold uppercase tracking-widest text-fg">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-fg-muted max-w-xs leading-relaxed">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}


export { EmptyState };
