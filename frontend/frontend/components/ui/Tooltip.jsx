import * as React from "react";
import { cn } from "../../lib/utils";

export function Tooltip({ children, content, side = "top" }) {
  const [open, setOpen] = React.useState(false);
  const timeoutRef = React.useRef(null);
  const show = () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); setOpen(true); };
  const hide = () => { timeoutRef.current = setTimeout(() => setOpen(false), 150); };
  const sides = { top: "bottom-full left-1/2 -translate-x-1/2 mb-2", bottom: "top-full left-1/2 -translate-x-1/2 mt-2", left: "right-full top-1/2 -translate-y-1/2 mr-2", right: "left-full top-1/2 -translate-y-1/2 ml-2" };
  return (
    <div className="relative inline-flex" onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={hide}>
      {children}
      {open && <div className={cn("absolute z-50 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-xs text-background", "shadow-lg animate-fade-in", sides[side])}>{content}</div>}
    </div>
  );
}

export default Tooltip;
