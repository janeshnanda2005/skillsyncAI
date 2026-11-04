import React, { useState, useEffect } from "react";
import { useRequireAuth } from "../context/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { Badge } from "../components/ui/Badge";
import { Progress } from "../components/ui/Progress";
import {
  User, Zap, Briefcase, BarChart3, FileText, Clock, GraduationCap, Award,
} from "lucide-react";
import { getMyProfile, getMySkills, getMyCertifications, getMyProjects } from "../api/index";

const statRows = [
  { label: "Profile Completion", key: "completion", icon: Zap, color: "text-primary" },
  { label: "Skills Added", key: "skills", icon: GraduationCap, color: "text-success" },
  { label: "Certifications", key: "certs", icon: Award, color: "text-secondary" },
  { label: "Projects", key: "projects", icon: Briefcase, color: "text-muted-foreground" },
];

export default function Dashboard() {
  const user = useRequireAuth();
  const email = user?.sub || user?.email || "";
  const name = user?.name || email.split("@")[0] || "Student";

  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [certs, setCerts] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const [p, s, c, pr] = await Promise.allSettled([
          getMyProfile(),
          getMySkills(),
          getMyCertifications(),
          getMyProjects(),
        ]);
        if (p.status === "fulfilled") setProfile(p.value);
        if (s.status === "fulfilled") setSkills(s.value);
        if (c.status === "fulfilled") setCerts(c.value);
        if (pr.status === "fulfilled") setProjects(pr.value);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const completion = Math.round(
    ((profile ? 1 : 0) * 25) +
    ((skills.length > 0 ? 1 : 0) * 25) +
    ((certs.length > 0 ? 1 : 0) * 25) +
    ((projects.length > 0 ? 1 : 0) * 25)
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold tracking-tight">Dashboard</h1></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}><div className="p-4 space-y-3"><Skeleton className="h-4 w-24" /><Skeleton className="h-8 w-16" /></div></Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Welcome back, {name}. Here is your account overview from the database.
          </p>
        </div>
        <Button variant="outline" onClick={() => window.location.reload()} className="hidden sm:block">
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-4 w-4" /> Account
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{profile?.name || name}</p>
            <p className="text-xs text-muted-foreground mt-1">{profile?.email || email}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-4 w-4" /> Profile Completion
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{completion}%</span>
              <span className="text-xs text-muted-foreground">of profile complete</span>
            </div>
            <Progress value={completion} className="h-2" showLabel />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" /> Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{skills.length}</span>
              <span className="text-xs text-muted-foreground">added to database</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" /> Certifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{certs.length}</span>
              <span className="text-xs text-muted-foreground">stored in database</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-4 w-4" /> Recent Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            {projects.length === 0 ? (
              <EmptyState
                icon={<Briefcase className="h-6 w-6 text-muted-foreground" />}
                title="No projects"
                description="No project records found in the database. Add your first project."
              />
            ) : (
              <div className="space-y-3">
                {projects.map((p) => (
                  <div key={p.pid} className="flex items-start gap-3">
                    <div className="mt-1 shrink-0 text-xs bg-primary/10 px-2 py-1 rounded text-primary">
                      {p.pid}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{p.title}</p>
                      <p className="text-xs text-muted-foreground">{p.description}</p>
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
              <Clock className="h-4 w-4" /> Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm truncate">{profile ? "Profile loaded from database" : "No profile data"}</p>
                  <span className="text-xs text-muted-foreground">Just now</span>
                </div>
              </div>
              {skills.length > 0 && (
                <div className="flex items-start gap-3">
                  <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-success" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm truncate">{skills.length} skill(s) added to database</p>
                    <span className="text-xs text-muted-foreground">Just now</span>
                  </div>
                </div>
              )}
              {certs.length > 0 && (
                <div className="flex items-start gap-3">
                  <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-secondary" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm truncate">{certs.length} certification(s) stored</p>
                    <span className="text-xs text-muted-foreground">Just now</span>
                  </div>
                </div>
              )}
              {skills.length === 0 && certs.length === 0 && !profile && (
                <p className="text-xs text-muted-foreground text-center py-4">
                  No activity recorded yet. Add your profile, skills, and certifications to get started.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { Skeleton } from "../components/ui/Skeleton";