import React from "react";
import { cn } from "../../lib/utils";

export function Table({ className, ...props }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className={cn("w-full caption-bottom text-sm", "[&_th]:text-left [&_th]:font-medium [&_th]:text-muted-foreground [&_th]:py-2 [&_th]:px-3 [&_th]:border-b [&_th]:border-border", "[&_td]:py-2 [&_td]:px-3 [&_td]:border-b [&_td]:border-border", "[&_tr:last-child]:border-0", className)} {...props} />
    </div>
  );
}

export function TableHeader({ className, ...props }) {
  return <thead className={cn("sticky top-0 bg-card [&_tr]:border-b [&_tr]:border-border", className)} {...props} />;
}

export function TableBody({ className, ...props }) {
  return <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props} />;
}

export function TableRow({ className, ...props }) {
  return <tr className={cn("transition-colors hover:bg-accent/50", "data-[state=selected]:bg-accent", className)} {...props} />;
}

export function TableHead({ className, ...props }) {
  return <th className={cn("h-10 px-3 text-left align-middle font-medium text-muted-foreground", className)} {...props} />;
}

export function TableCell({ className, ...props }) {
  return <td className={cn("align-middle", className)} {...props} />;
}

export function TableCaption({ className, ...props }) {
  return <caption className={cn("mt-2 text-xs text-muted-foreground", className)} {...props} />;
}

export default Table;