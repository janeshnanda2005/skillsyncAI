import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { Badge } from "../components/ui/Badge";
import { EmptyState } from "../components/ui/EmptyState";
import { Skeleton } from "../components/ui/Skeleton";
import { OpportunityCard } from "../components/ui/OpportunityCard";
import { Search, Filter, MapPin, Building2, Briefcase } from "lucide-react";

const allOpportunities = [
  { id: 1, title: "Frontend Engineering Intern", company: "Vercel", match: 92, location: "Remote", type: "Internship", tags: ["React", "TypeScript", "Tailwind"] },
  { id: 2, title: "Software Engineer I", company: "Linear", match: 85, location: "Remote", type: "Full-time", tags: ["Node", "PostgreSQL", "React"] },
  { id: 3, title: "ML Engineering Intern", company: "Scale AI", match: 68, location: "San Francisco, CA", type: "Internship", tags: ["Python", "ML", "PyTorch"] },
  { id: 4, title: "Full Stack Developer", company: "Stripe", match: 79, location: "Dublin, IE", type: "Full-time", tags: ["Node", "React", "Go"] },
  { id: 5, title: "Data Analyst Intern", company: "Airbnb", match: 54, location: "Remote", type: "Internship", tags: ["Python", "SQL", "Tableau"] },
  { id: 6, title: "DevOps Engineer", company: "Cloudflare", match: 61, location: "Austin, TX", type: "Full-time", tags: ["Kubernetes", "Terraform", "Go"] },
];

export default function Opportunities() {
  const [loading, setLoading] = React.useState(true);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [minMatch, setMinMatch] = useState(0);
  React.useEffect(() => { const t = setTimeout(() => setLoading(false), 800); return () => clearTimeout(t); }, []);
  const filtered = allOpportunities.filter((opp) => opp.title.toLowerCase().includes(query.toLowerCase()) || opp.company.toLowerCase().includes(query.toLowerCase()) && (typeFilter === "all" || opp.type === typeFilter) && opp.match >= minMatch);
  if (loading) {
    return (
      <div className="space-y-6"><div><Skeleton className="h-7 w-48 mb-2" /><Skeleton className="h-4 w-72" /></div><div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">{[1, 2, 3, 4, 5, 6].map((i) => <Card key={i}><div className="p-4 space-y-3"><Skeleton className="h-5 w-32" /><Skeleton className="h-4 w-24" /><Skeleton className="h-2 w-full" /></div></Card>)}</div></div>
    );
  }
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold tracking-tight">Opportunities</h1><p className="text-sm text-muted-foreground mt-1">AI-matched jobs and internships based on your skills</p></div>
      <Card><CardContent className="p-4"><div className="grid grid-cols-1 md:grid-cols-4 gap-3"><div className="md:col-span-2"><Input id="search" placeholder="Search by title or company..." value={query} onChange={(e) => setQuery(e.target.value)} /></div><Select id="type" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}><option value="all">All types</option><option value="Internship">Internship</option><option value="Full-time">Full-time</option><option value="Part-time">Part-time</option></Select><Select id="match" value={String(minMatch)} onChange={(e) => setMinMatch(Number(e.target.value))}><option value="0">Any match score</option><option value="50">50%+</option><option value="70">70%+</option><option value="80">80%+</option></Select></div></CardContent></Card>
      {filtered.length === 0 ? <EmptyState icon={<Briefcase className="h-6 w-6" />} title="No opportunities found" description="Try adjusting your filters or search query." /> : <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">{filtered.map((opp) => <OpportunityCard key={opp.id} {...opp} />)}</div>}
    </div>
  );
}