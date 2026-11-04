import React from "react";
import { cn } from "../../lib/utils";

export function Avatar({ src, alt, name, size = "md", className }) {
  const sizes = { sm: "h-8 w-8 text-xs", md: "h-10 w-10 text-sm", lg: "h-12 w-12 text-base", xl: "h-16 w-16 text-lg" };
  const getInitials = (n) => {
    if (!n) return "?";
    return n.split(/\s+/).map((p) => p[0]).join("").slice(0, 2).toUpperCase();
  };
  const gradients = ["from-primary to-primary/70", "from-success to-success/70", "from-amber-500 to-amber-400", "from-pink-500 to-pink-400", "from-blue-500 to-blue-400", "from-indigo-500 to-indigo-400"];
  const colorIndex = (name || "U").split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % gradients.length;
  return (
    <div className={cn("relative inline-flex shrink-0 overflow-hidden rounded-full", "bg-gradient-to-br font-semibold text-white", sizes[size], className)}>
      {src ? <img src={src} alt={alt || name || "Avatar"} className="h-full w-full object-cover" /> : <span className="flex h-full w-full items-center justify-center">{getInitials(name)}</span>}
    </div>
  );
}

export default Avatar;
