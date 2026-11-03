import * as React from "react";
import { cn } from "../../lib/utils";

export function Tabs({ value, defaultValue, onValueChange, children, className }) {
  const [internalValue, setInternalValue] = React.useState(value ?? defaultValue ?? "");
  const currentValue = value ?? internalValue;
  const setValue = (v) => { setInternalValue(v); onValueChange?.(v); };
  return (
    <TabsContext.Provider value={{ value: currentValue, onValueChange: setValue }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

const TabsContext = React.createContext(null);

export function TabsList({ className, ...props }) {
  return <div className={cn("inline-flex h-10 items-center justify-center gap-1 rounded-md bg-muted p-1 text-muted-foreground", className)} {...props} />;
}

export function TabsTrigger({ className, value, ...props }) {
  const ctx = React.useContext(TabsContext);
  const isActive = ctx?.value === value;
  return (
    <button type="button" role="tab" aria-selected={isActive} data-state={isActive ? "active" : "inactive"} onClick={() => ctx?.onValueChange(value)} className={cn("inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium", "ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", "disabled:pointer-events-none disabled:opacity-50", isActive ? "bg-background text-foreground shadow-sm" : "hover:text-foreground/80", className)} {...props} />
  );
}

export function TabsContent({ className, value, ...props }) {
  const ctx = React.useContext(TabsContext);
  if (ctx?.value !== value) return null;
  return <div className={cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className)} role="tabpanel" {...props} />;
}