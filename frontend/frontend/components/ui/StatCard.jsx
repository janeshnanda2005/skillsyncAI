import React from "react";
import { cn } from "../../lib/utils";
import { TrendingUp, ArrowUpRight } from "lucide-react";

export function StatCard({ label, value, suffix = "", icon: Icon, trend, className }) {
  return (
    <div className={cn("rounded-lg border border-border bg-card p-4 shadow-sm transition-colors hover:bg-accent/30", className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="mt-2 flex items-baseline gap-1">
        <span className="text-2xl font-bold">{value}{suffix}</span>
        {trend && <span className="flex items-center text-xs font-medium text-success"><ArrowUpRight className="h-3 w-3" /> {trend}</span>}
      </div>
    </div>
  );
}

export default StatCard;
