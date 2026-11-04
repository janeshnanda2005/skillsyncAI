import React, { useState, useEffect } from "react";
import { useRequireAuth } from "../context/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { Badge } from "../components/ui/Badge";
import { Progress } from "../components/ui/Progress";
import { StatBlock } from "../components/ui/StatBlock";
import { SpecRow } from "../components/ui/SpecRow";
import { Reveal } from "../components/space/Reveal";
import { CountUp } from "../components/space/CountUp";
import { Zap, GraduationCap, Briefcase, BarChart3, FileText, Clock, Brain } from "lucide-react";

export default function Dashboard() {
  const user = useRequireAuth();
  const email = user?.sub || user?.email || "";
  const name = user?.name || email.split("@")[0] || "CREW";

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 p-4">
        <Reveal>
          <h1 className="text-2xl font-bold uppercase tracking-widest text-fg">Mission Control</h1>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}><CardContent className="p-4"><SkeletonProgress /></CardContent></Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4">
      <Reveal>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold uppercase tracking-widest text-fg">Mission Control</h1>
            <p className="text-sm text-fg-muted mt-1">
              Welcome back, {name}. Here is your readiness overview from the database.
            </p>
          </div>
          <Button variant="outline" onClick={() => window.location.reload()} className="hidden sm:block">
            Refresh
          </Button>
        </div>
      </Reveal>

      <Reveal className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatBlock value="78%" label="Launch Readiness" sublabel="Profile completeness" />
        <StatBlock value={<CountUp value={14} />} label="Skills Assessed" sublabel="Stored in database" />
        <StatBlock value={<CountUp value={23} />} label="Matches" sublabel="Trajectory matches" />
        <StatBlock value={<CountUp value={5} />} label="Flight Tests" sublabel="Assessments taken" />
      </Reveal>

      <Reveal className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-4 w-4" /> Flight Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={<FileText className="h-6 w-6 text-fg-muted" />}
              title="No Resume Uploaded"
              description="Upload your resume to get AI-powered suggestions."
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-4 w-4" /> Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <SpecRow label="Profile viewed" value="Just now" />
              <SpecRow label="Skills updated" value="2 days ago" />
              <SpecRow label="Assessment taken" value="5 days ago" />
              <SpecRow label="Resume reviewed" value="1 week ago" />
            </div>
          </CardContent>
        </Card>
      </Reveal>
    </div>
  );
}

function SkeletonProgress() {
  return (
    <div className="space-y-3">
      <div className="h-2 w-1/3 bg-fg-muted rounded animate-pulse" />
      <div className="h-2 w-full bg-fg-muted rounded animate-pulse" />
      <div className="h-2 w-2/3 bg-fg-muted rounded animate-pulse" />
    </div>
  );
}