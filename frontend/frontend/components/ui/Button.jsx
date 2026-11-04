import React from "react";
import { cn } from "../../lib/utils";

export default function Button({
  className,
  variant = "solid",
  size = "md",
  asChild = false,
  children,
  ...props
}) {
  const Comp = asChild ? "span" : "button";

  const variants = {
    solid:
      "bg-fg text-bg border-none hover:bg-bg hover:text-fg",
    ghost:
      "border border-border hover:border-border-strong hover:bg-bg/10",
    text:
      "bg-none border-none text-fg-muted hover:text-fg hover:underline",
  };

  const sizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base",
  };

  return (
    <Comp
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded",
        "font-bold uppercase tracking-widest text-xs",
        "transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}


export { Button };
