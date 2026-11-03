import React from "react";
import { cn } from "../../lib/utils";
import { Badge } from "./Badge";

const typeConfig = { assessment: { label: "Assessment", variant: "success" }, profile: { label: "Profile", variant: "secondary" }, application: { label: "Application", variant: "default" }, resume: { label: "Resume", variant: "warning" } };

export function ActivityFeed({ items, className }) {
  if (!items.length) return <p className="text-sm text-muted-foreground text-center py-6">No recent activity</p>;
  return (
    <div className={cn("space-y-1", className)}>
      {items.map((item, i) => {
        const cfg = typeConfig[item.type] || { label: item.type, variant: "default" };
        return (
          <div key={item.id} className="flex items-start gap-3 rounded-md p-2 hover:bg-accent/50 transition-colors animate-slide-in-right" style={{ animationDelay: i * 50 + "ms" }}>
            <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
            <div className="min-w-0 flex-1">
              <p className="text-sm truncate">{item.title}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge variant={cfg.variant} className="text-[10px] px-1.5 py-0">{cfg.label}</Badge>
                <span className="text-xs text-muted-foreground">{item.time}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ActivityFeed;