import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { Badge } from "../components/ui/Badge";
import { Progress } from "../components/ui/Progress";
import { Reveal } from "../components/space/Reveal";
import { GraduationCap, Clock } from "lucide-react";
import { getAssessments } from "../api/index";

export default function Assessment() {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getAssessments()
      .then((data) => { if (mounted) setAssessments(Array.isArray(data) ? data : []); })
      .catch(() => { if (mounted) setAssessments([]); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 p-4">
        <Reveal>
          <h1 className="text-2xl font-bold uppercase tracking-widest text-fg">Flight Tests</h1>
        </Reveal>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1"><CardContent className="p-4"><div className="space-y-3"><div className="h-2 w-1/3 bg-fg-muted rounded animate-pulse" /><div className="h-2 w-full bg-fg-muted rounded animate-pulse" /></div></CardContent></Card>
          <Card className="lg:col-span-2"><CardContent className="p-4"><div className="space-y-3">{[1,2,3].map((i)=> <div key={i} className="h-8 w-full rounded border border-fg-muted animate-pulse" />)}</div></CardContent></Card>
        </div>
      </div>
    );
  }

  const completed = assessments.filter((a) => a.status === "completed").length;
  const total = assessments.length;
  const avgScore = total > 0 ? Math.round(assessments.reduce((sum, a) => sum + (a.score || 0), 0) / total) : 0;

  return (
    <div className="space-y-8 p-4">
      <Reveal>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold uppercase tracking-widest text-fg">Flight Tests</h1>
            <p className="text-sm text-fg-muted mt-1">
              View your assessment results stored in the database.
            </p>
          </div>
          <Button variant="outline" onClick={() => {}} className="hidden sm:block">
            Take Assessment
          </Button>
        </div>
      </Reveal>

      <Reveal className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Overall Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-fg-muted">Completed</span>
                <span className="font-bold text-fg">{completed}/{total}</span>
              </div>
              <Progress value={total > 0 ? Math.round((completed / total) * 100) : 0} className="h-2" showLabel />
              <div className="flex items-center justify-between text-sm">
                <span className="text-fg-muted">Avg Score</span>
                <span className="font-bold text-fg">{avgScore}</span>
              </div>
              <Progress value={avgScore} className="h-2" color="success" showLabel />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" /> Assessments
            </CardTitle>
          </CardHeader>
          <CardContent>
            {assessments.length === 0 ? (
              <EmptyState
                icon={<Clock className="h-6 w-6 text-fg-muted" />}
                title="No Assessments Found"
                description="No assessment records found in the database for your account."
              />
            ) : (
              <div className="space-y-3">
                {assessments.map((a) => (
                  <div key={a.assesment_id} className="flex items-start justify-between p-3 rounded border border-border bg-bg-elevated">
                    <div className="flex-1">
                      <p className="text-sm font-bold text-fg">{a.title}</p>
                      <p className="text-xs text-fg-muted">{a.description || "No description"}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={a.status === "completed" ? "success" : "secondary"}>{a.status}</Badge>
                      {a.score !== undefined && <div className="mt-1 text-sm font-bold text-fg">{a.score}%</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </Reveal>

      {total === 0 && (
        <div className="rounded border border-border bg-bg-elevated p-4 text-sm">
          <p className="text-fg-muted">
            <span className="font-bold text-fg">nil</span> — No assessment data is present in the database.
          </p>
        </div>
      )}
    </div>
  );
}