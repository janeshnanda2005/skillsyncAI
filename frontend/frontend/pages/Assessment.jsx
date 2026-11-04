import React, { useState, useEffect } from "react";
import { useRequireAuth } from "../context/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { Badge } from "../components/ui/Badge";
import { Progress } from "../components/ui/Progress";
import { GraduationCap, Clock, CheckCircle2 } from "lucide-react";
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
        <h1 className="text-2xl font-bold tracking-tight">Skill Assessments</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1"><CardContent className="p-4 space-y-3"><SkeletonProgress /></CardContent></Card>
          <Card className="lg:col-span-2"><CardContent className="p-4"><div className="space-y-3">{[1,2,3].map((i)=> <SkeletonRow key={i} />)}</div></CardContent></Card>
        </div>
      </div>
    );
  }

  const completed = assessments.filter((a) => a.status === "completed").length;
  const total = assessments.length;
  const avgScore = total > 0
    ? Math.round(assessments.reduce((sum, a) => sum + (a.score || 0), 0) / total)
    : 0;

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Skill Assessments</h1>
          <p className="text-sm text-muted-foreground mt-1">
            View your assessment results stored in the database.
          </p>
        </div>
        <Button variant="outline" onClick={() => {}} className="hidden sm:block">
          Take Assessment
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Overall Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Completed</span>
                <span className="font-medium">{completed}/{total}</span>
              </div>
              <Progress value={total > 0 ? Math.round((completed / total) * 100) : 0} className="h-2" showLabel />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Avg Score</span>
                <span className="font-medium">{avgScore}</span>
              </div>
              <Progress value={avgScore} className="h-2" showLabel color="success" />
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
                icon={<Clock className="h-6 w-6 text-muted-foreground" />}
                title="No assessments found"
                description="No assessment records found in the database for your account."
              />
            ) : (
              <div className="space-y-3">
                {assessments.map((a) => (
                  <div key={a.assesment_id} className="flex items-start justify-between p-3 rounded-md bg-muted/30">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{a.title}</p>
                      <p className="text-xs text-muted-foreground">{a.description || "No description"}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={a.status === "completed" ? "success" : "secondary"}>
                        {a.status}
                      </Badge>
                      {a.score !== undefined && (
                        <div className="mt-1 text-sm font-medium">{a.score}%</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {total === 0 && (
        <div className="bg-muted/50 rounded-lg border border-border p-4 text-sm">
          <p className="text-muted-foreground">
            <span className="font-medium">nil</span> — No assessment data is present in the database.
          </p>
        </div>
      )}
    </div>
  );
}

function SkeletonProgress() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Completed</span>
        <span className="text-xs font-medium text-muted-foreground">nil</span>
      </div>
      <div className="h-2 w-full rounded-full bg-muted overflow-hidden"><div className="h-full bg-muted/50" /></div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Avg Score</span>
        <span className="text-xs font-medium text-muted-foreground">nil</span>
      </div>
      <div className="h-2 w-full rounded-full bg-muted overflow-hidden"><div className="h-full bg-muted/50" /></div>
    </div>
  );
}

function SkeletonRow() {
  return (
    <div className="flex items-start justify-between p-3 rounded-md bg-muted/30">
      <div className="flex-1"><SkeletonLine className="h-4 w-32" /><SkeletonLine className="h-3 w-48 mt-1" /></div>
      <div className="text-right"><SkeletonLine className="h-3 w-16" /></div>
    </div>
  );
}

function SkeletonLine({ className }) {
  return <div className={className} />;
}