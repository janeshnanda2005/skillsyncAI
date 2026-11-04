import * as React from "react";
import { cn } from "../../lib/utils";

export function Dialog({ open, onOpenChange, children }) {
  React.useEffect(() => {
    const handleEscape = (e) => { if (e.key === "Escape") onOpenChange(false); };
    if (open) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => { document.removeEventListener("keydown", handleEscape); document.body.style.overflow = ""; };
  }, [open, onOpenChange]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => onOpenChange(false)} />
      <div className="relative z-50">{children}</div>
    </div>
  );
}

export function DialogContent({ className, children, ...props }) {
  return <div className={cn("relative w-full max-w-lg rounded-lg border border-border bg-card p-6 shadow-lg", "animate-scale-in", className)} {...props}>{children}</div>;
}

export function DialogHeader({ className, ...props }) {
  return <div className={cn("flex flex-col space-y-1.5 text-left", className)} {...props} />;
}

export function DialogFooter({ className, ...props }) {
  return <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", "mt-6 gap-2", className)} {...props} />;
}

export function DialogTitle({ className, ...props }) {
  return <h2 className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />;
}

export function DialogDescription({ className, ...props }) {
  return <p className={cn("text-sm text-muted-foreground", className)} {...props} />;
}

export default Dialog;
