import React from "react";
import { cn } from "../../lib/utils";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { MapPin, Building2, Clock, ExternalLink } from "lucide-react";
import { getMatchScoreColor } from "../../lib/utils";

export function OpportunityCard({ title, company, match, location, type, tags = [], className }) {
  return (
    <div className={cn("group rounded-md border border-border p-3 transition-colors hover:bg-accent/40", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-semibold truncate group-hover:text-primary transition-colors">{title}</h4>
          <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
            <Building2 className="h-3 w-3" />
            {company}
            {location && <span className="flex items-center gap-1"><span>·</span> <MapPin className="h-3 w-3" /> {location}</span>}
            {type && <span className="flex items-center gap-1"><span>·</span> <Clock className="h-3 w-3" /> {type}</span>}
          </div>
          {tags.length > 0 && <div className="flex flex-wrap gap-1 mt-2">{tags.map((tag) => <Badge key={tag} variant="secondary" className="text-[10px]">{tag}</Badge>)}</div>}
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={cn("text-lg font-bold", getMatchScoreColor(match))}>{match}%</span>
          <Button variant="ghost" size="sm" className="gap-1 h-7 text-xs">View <ExternalLink className="h-3 w-3" /></Button>
        </div>
      </div>
    </div>
  );
}

export default OpportunityCard;
