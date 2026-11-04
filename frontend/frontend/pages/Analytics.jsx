import React, { useState, useEffect } from "react";
import { useRequireAuth } from "../context/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Separator } from "../components/ui/Separator";
import { Progress } from "../components/ui/Progress";
import { TrendingUp, Clock, Target } from "lucide-react";
import { getMySkills, getMyProfile } from "../api/index";

export default function Analytics() {
  const [skills, setSkills] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    Promise.allSettled([getMySkills(), getMyProfile()])
      .then(([s, p]) => {
        if (mounted) {
          if (s.status === "fulfilled") setSkills(s.value);
          if (p.status === "fulfilled") setProfile(p.value);
        }
      })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 p-4">
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map((i)=> <Card key={i}><CardContent className="p-4 flex items-center justify-between"><SkeletonMetric /></CardContent></Card>)}
        </div>
      </div>
    );
  }

  const readiness = profile ? Math.min(100, Math.round(
    ((skills.length > 0 ? 1 : 0) * 30) +
    ((profile.cgpa || 0) / 4 * 40) +
    (profile.year ? Math.min((profile.year / 4) * 30, 30) : 0)
  )) : 0;

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track your skill growth and career readiness from database records.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Readiness Score</p>
              <p className="text-3xl font-bold">{readiness}</p>
            </div>
            <Badge variant={readiness >= 70 ? "success" : readiness >= 40 ? "secondary" : "outline"}>
              {readiness >= 70 ? "Strong" : readiness >= 40 ? "Developing" : "Needs Work"}
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Skills Assessed</p>
              <p className="text-3xl font-bold">{skills.length}</p>
            </div>
            <Badge variant="outline">{skills.length}</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Profile</p>
              <p className="text-3xl font-bold">{profile ? "Complete" : "nil"}</p>
            </div>
            <Badge variant={profile ? "success" : "outline"}>{profile ? "In DB" : "Missing"}</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">CGPA</p>
              <p className="text-3xl font-bold">{profile?.cgpa || "nil"}</p>
            </div>
            <Badge variant="outline">{profile?.cgpa || "—"}</Badge>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" /> Skill Growth
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {skills.length === 0 ? (
              <div className="text-center py-8">
                <Target className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No skills in database. Add skills in your Profile to see growth analytics.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {skills.map((s, i) => (
                  <div key={s.skill_id} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{s.title}</span>
                      <span className="text-xs text-muted-foreground">#{i + 1}</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${Math.min(100, 50 + i * 15)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-4 w-4" /> Readiness Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Profile Data</span>
                <span className="font-medium">{profile ? "Present" : "nil"}</span>
              </div>
              <Progress value={profile ? 100 : 0} className="h-2" color={profile ? "success" : "destructive"} />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Skills Added</span>
                <span className="font-medium">{skills.length}</span>
              </div>
              <Progress value={Math.min(100, skills.length * 25)} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {skills.length === 0 && !profile && (
        <div className="bg-muted/50 rounded-lg border border-border p-4 text-sm">
          <p className="text-muted-foreground">
            <span className="font-medium">nil</span> — No analytics data is present in the database.
          </p>
        </div>
      )}
    </div>
  );
}

function SkeletonMetric() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1"><div className="h-3 w-24 bg-muted/50 rounded" /><div className="h-3 w-48 mt-2 bg-muted/50 rounded" /></div>
      <Badge className="h-8 w-8 rounded-full bg-muted" />
    </div>
  );
}