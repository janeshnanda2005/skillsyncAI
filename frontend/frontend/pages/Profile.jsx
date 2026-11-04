import React, { useState, useEffect } from "react";
import { useRequireAuth } from "../context/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { EmptyState } from "../components/ui/EmptyState";
import { Badge } from "../components/ui/Badge";
import { Progress } from "../components/ui/Progress";
import { SpecRow } from "../components/ui/SpecRow";
import { Reveal } from "../components/space/Reveal";
import { cn } from "../lib/utils";
import { User, GraduationCap, Code, Briefcase, Award, Edit2 } from "lucide-react";
import {
  getMyProfile, addStudentDetails,
  getMySkills, addSkill,
  getMyCertifications, addCertification,
  getMyProjects, addProject,
} from "../api/index";

export default function Profile() {
  const user = useRequireAuth();
  const email = user?.sub || user?.email || "";
  const name = user?.name || email.split("@")[0] || "CREW";

  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [certs, setCerts] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAddProfile, setShowAddProfile] = useState(false);
  const [pfData, setPfData] = useState({ name: "", dept: "", year: "", cgpa: "", domain: "" });
  const [skillTitle, setSkillTitle] = useState("");
  const [certTitle, setCertTitle] = useState("");
  const [projTitle, setProjTitle] = useState("");
  const [projDesc, setProjDesc] = useState("");

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const [p, s, c, pr] = await Promise.allSettled([
          getMyProfile(), getMySkills(), getMyCertifications(), getMyProjects(),
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

  const handleAddProfile = async (e) => {
    e.preventDefault();
    try {
      await addStudentDetails({
        name: pfData.name,
        dept: pfData.dept,
        year: Number(pfData.year) || 0,
        cgpa: Number(pfData.cgpa) || 0,
        domain: pfData.domain,
      });
      setShowAddProfile(false);
      setPfData({ name: "", dept: "", year: "", cgpa: "", domain: "" });
      const p = await getMyProfile();
      setProfile(p);
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to add profile");
    }
  };

  const handleAddSkill = async () => {
    if (!skillTitle.trim()) return;
    try {
      await addSkill(skillTitle);
      setSkillTitle("");
      const s = await getMySkills();
      setSkills(s);
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to add skill");
    }
  };

  const handleAddCert = async () => {
    if (!certTitle.trim()) return;
    try {
      await addCertification(certTitle);
      setCertTitle("");
      const c = await getMyCertifications();
      setCerts(c);
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to add certification");
    }
  };

  const handleAddProject = async () => {
    if (!projTitle.trim()) return;
    try {
      await addProject(projTitle, projDesc);
      setProjTitle("");
      setProjDesc("");
      const pr = await getMyProjects();
      setProjects(pr);
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to add project");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 p-4">
        <Reveal>
          <h1 className="text-2xl font-bold uppercase tracking-widest text-fg">Crew Record</h1>
        </Reveal>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1"><CardContent className="p-6 flex flex-col items-center"><div className="h-12 w-12 rounded-full bg-fg-muted animate-pulse" /><SkeletonLine className="h-4 w-32 mt-2" /></CardContent></Card>
          <div className="lg:col-span-2 space-y-6">{[1,2,3,4].map((i)=> <Card key={i}><CardContent className="p-4 space-y-3"><SkeletonLine className="h-4 w-24" /><SkeletonLine className="h-2 w-full" /></CardContent></Card>)}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4">
      <Reveal>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold uppercase tracking-widest text-fg">Crew Record</h1>
            <p className="text-sm text-fg-muted mt-1">
              Your academic and professional details stored in the database.
            </p>
          </div>
          {!profile && (
            <Button variant="outline" onClick={() => setShowAddProfile(true)}>Add Profile</Button>
          )}
        </div>
      </Reveal>

      <Reveal className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded border border-border flex items-center justify-center text-fg">
                {displayNameChar(name)}
              </div>
              <div>
                <p className="text-sm font-bold text-fg">{profile?.name || name}</p>
                <p className="text-xs text-fg-muted">{profile?.email || email}</p>
              </div>
            </div>
            <Badge variant="outline">Crew Member</Badge>
            {!profile && (
              <div className="mt-4 p-3 rounded border border-border bg-bg/30 text-xs text-fg-muted text-center">
                No crew record in database. Click "Add Profile" to create one.
              </div>
            )}
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" /> Education
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile ? (
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-bold text-fg">{profile.dept} · {profile.domain}</p>
                      <p className="text-xs text-fg-muted">Year {profile.year} · CGPA {profile.cgpa}</p>
                    </div>
                    <Badge variant="outline">{profile.year}</Badge>
                  </div>
                  <p className="text-xs text-fg-muted mt-1">Stored in database</p>
                </div>
              ) : (
                <EmptyState
                  icon={<GraduationCap className="h-6 w-6 text-fg-muted" />}
                  title="No Education Data"
                  description="No crew profile found in the database."
                />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-4 w-4" /> Skills
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {skills.length === 0 ? (
                <EmptyState
                  icon={<Code className="h-6 w-6 text-fg-muted" />}
                  title="No Skills Data"
                  description="No skills found in the database for your account."
                />
              ) : (
                <div className="space-y-2">
                  {skills.map((s) => (
                    <div key={s.skill_id} className="flex items-center justify-between">
                      <span className="text-sm text-fg">{s.title}</span>
                      <Badge variant="secondary" size="sm">Stored</Badge>
                    </div>
                  ))}
                  <div className="mt-3 pt-3 border-t border-border/50 flex items-center gap-2">
                    <input
                      id="skillTitle"
                      value={skillTitle}
                      onChange={(e) => setSkillTitle(e.target.value)}
                      placeholder="Add a skill..."
                      className="flex-1 h-9 rounded border border-border bg-bg px-3 text-xs text-fg outline-none focus-visible:ring-1 focus-visible:ring-border-strong"
                    />
                    <Button size="sm" onClick={handleAddSkill}>Add</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-4 w-4" /> Certifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {certs.length === 0 ? (
                <EmptyState
                  icon={<Award className="h-6 w-6 text-fg-muted" />}
                  title="No Certifications"
                  description="No certification records found in the database."
                />
              ) : (
                <div className="space-y-2">
                  {certs.map((c) => (
                    <div key={c.cert_id} className="flex items-center justify-between">
                      <span className="text-sm text-fg">{c.title}</span>
                      <Badge variant="outline" size="sm">Stored</Badge>
                    </div>
                  ))}
                  <div className="mt-3 pt-3 border-t border-border/50 flex items-center gap-2">
                    <input
                      id="certTitle"
                      value={certTitle}
                      onChange={(e) => setCertTitle(e.target.value)}
                      placeholder="Add a certification..."
                      className="flex-1 h-9 rounded border border-border bg-bg px-3 text-xs text-fg outline-none focus-visible:ring-1 focus-visible:ring-border-strong"
                    />
                    <Button size="sm" onClick={handleAddCert}>Add</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" /> Projects
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {projects.length === 0 ? (
                <EmptyState
                  icon={<Briefcase className="h-6 w-6 text-fg-muted" />}
                  title="No Projects"
                  description="No project records found in the database."
                />
              ) : (
                <div className="space-y-2">
                  {projects.map((p) => (
                    <div key={p.pid} className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-bold text-fg">{p.title}</p>
                        <p className="text-xs text-fg-muted">{p.description}</p>
                      </div>
                      <Badge variant="outline" size="sm">Stored</Badge>
                    </div>
                  ))}
                  <div className="mt-3 pt-3 border-t border-border/50">
                    <input
                      id="projTitle"
                      value={projTitle}
                      onChange={(e) => setProjTitle(e.target.value)}
                      placeholder="Project title..."
                      className="mb-2 w-full h-9 rounded border border-border bg-bg px-3 text-xs text-fg outline-none focus-visible:ring-1 focus-visible:ring-border-strong"
                    />
                    <textarea
                      id="projDesc"
                      value={projDesc}
                      onChange={(e) => setProjDesc(e.target.value)}
                      placeholder="Description..."
                      className="mb-2 w-full h-24 rounded border border-border bg-bg px-3 py-2 text-xs text-fg outline-none focus-visible:ring-1 focus-visible:ring-border-strong"
                    />
                    <Button size="sm" onClick={handleAddProject}>Add Project</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </Reveal>

      {showAddProfile && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Edit2 className="h-4 w-4" /> Add Crew Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddProfile} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input id="pfName" label="Full Name" value={pfData.name} onChange={(e) => setPfData({...pfData, name: e.target.value})} required />
              <Input id="pfDept" label="Department" value={pfData.dept} onChange={(e) => setPfData({...pfData, dept: e.target.value})} required />
              <Input id="pfYear" label="Year" type="number" value={pfData.year} onChange={(e) => setPfData({...pfData, year: e.target.value})} required />
              <Input id="pfCgpa" label="CGPA" type="number" step="0.1" value={pfData.cgpa} onChange={(e) => setPfData({...pfData, cgpa: e.target.value})} required />
              <Input id="pfDomain" label="Domain" value={pfData.domain} onChange={(e) => setPfData({...pfData, domain: e.target.value})} required />
              <Button type="submit" className="md:col-span-2">Save Profile</Button>
              <Button variant="outline" type="button" onClick={() => setShowAddProfile(false)}>Cancel</Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function displayNameChar(name) {
  return name ? name.charAt(0).toUpperCase() : "C";
}

function SkeletonLine({ className }) {
  return <div className={cn(className, "h-3 bg-fg-muted rounded animate-pulse")} />;
}
