import React from "react";
import { useRequireAuth } from "../context/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Skeleton } from "../components/ui/Skeleton";
import { EmptyState } from "../components/ui/EmptyState";
import { Badge } from "../components/ui/Badge";
import { StatCard } from "../components/ui/StatCard";
import { ActivityFeed } from "../components/ui/ActivityFeed";
import { OpportunityCard } from "../components/ui/OpportunityCard";
import { Progress } from "../components/ui/Progress";
import { Zap, TrendingUp, Target } from "lucide-react";

const sampleStats = [
  { label: "Profile Completion", value: 72, suffix: "%", icon: Target, trend: "+5%" },
  { label: "Skills Assessed", value: 14, icon: Zap, trend: "+2" },
  { label: "Opportunities Matched", value: 23, icon: TrendingUp, trend: "+6" },
  { label: "Avg. Match Score", value: 78, suffix: "%", icon: Target, trend: "+12%" },
];

const sampleActivity = [
  { id: 1, title: "Completed React Assessment", time: "2 hours ago", type: "assessment" },
  { id: 2, title: "Profile updated with new skills", time: "Yesterday", type: "profile" },
  { id: 3, title: "Applied to Summer Internship", time: "3 days ago", type: "application" },
  { id: 4, title: "Resume reviewed by AI", time: "5 days ago", type: "resume" },
];

const sampleOpportunities = [
  { id: 1, title: "Frontend Engineering Intern", company: "Vercel", match: 92, location: "Remote", type: "Internship", tags: ["React", "TypeScript"] },
  { id: 2, title: "Software Engineer I", company: "Linear", match: 85, location: "Remote", type: "Full-time", tags: ["Node", "PostgreSQL"] },
  { id: 3, title: "ML Engineering Intern", company: "Scale AI", match: 68, location: "San Francisco", type: "Internship", tags: ["Python", "ML"] },
];

const skillRows = [
  { skill: "React", current: 78 },
  { skill: "TypeScript", current: 72 },
  { skill: "Node.js", current: 64 },
  { skill: "Python", current: 55 },
];

export default function Dashboard() {
  const user = useRequireAuth();
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => { const t = setTimeout(() => setLoading(false), 800); return () => clearTimeout(t); }, []);
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between"><div><Skeleton className="h-7 w-48 mb-2" /><Skeleton className="h-4 w-64" /></div></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">{[1, 2, 3, 4].map((i) => <Card key={i}><div className="p-4 space-y-3"><Skeleton className="h-4 w-24" /><Skeleton className="h-8 w-16" /></div></Card>)}</div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-2xl font-bold tracking-tight">Welcome back, {user?.name?.split(" ")[0] || "Student"}</h1><p className="text-sm text-muted-foreground mt-1">Here is your readiness overview for today.</p></div>
        <Button variant="primary" className="gap-2"><Zap className="h-4 w-4" /> Complete Profile</Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">{sampleStats.map((stat) => <StatCard key={stat.label} {...stat} />)}</div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2"><CardHeader><CardTitle>Recommended Opportunities</CardTitle></CardHeader><CardContent className="space-y-3">{sampleOpportunities.map((opp) => <OpportunityCard key={opp.id} {...opp} />)}</CardContent></Card>
        <Card><CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader><CardContent><ActivityFeed items={sampleActivity} /></CardContent></Card>
      </div>
      <Card><CardHeader><CardTitle>Skill Growth</CardTitle></CardHeader><CardContent><div className="space-y-4">{skillRows.map((s) => <div key={s.skill} className="space-y-1.5"><div className="flex items-center justify-between text-sm"><span className="font-medium">{s.skill}</span><span className="text-muted-foreground">{s.current}%</span></div><Progress value={s.current} className="h-2" /></div>)}</div></CardContent></Card>
    </div>
  );
}