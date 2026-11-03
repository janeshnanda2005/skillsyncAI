import React from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Zap, GraduationCap, TrendingUp, UserCheck } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="sticky top-0 z-30 border-b border-border bg-background/80 px-4 py-3 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2"><div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary"><Zap className="h-4 w-4 text-primary-foreground" /></div><span className="text-lg font-bold tracking-tight">SkillSyncAI</span></div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium"><Link to="#" className="text-muted-foreground hover:text-primary transition-colors">Features</Link><Link to="#" className="text-muted-foreground hover:text-primary transition-colors">Pricing</Link><Link to="#" className="text-muted-foreground hover:text-primary transition-colors">About</Link></div>
          <div className="flex items-center gap-2"><Button variant="outline" size="sm">Log in</Button><Button size="sm">Get started</Button></div>
        </div>
      </nav>
      <section className="relative overflow-hidden py-16 px-4 sm:py-24 lg:py-32">
        <div className="max-w-5xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary uppercase tracking-wider"><span className="h-1.5 w-1.5 rounded-full bg-primary" /> New for colleges & placement teams</span>
          <h1 className="mt-6 text-5xl md:text-7xl font-bold tracking-tight leading-tight">AI-powered career readiness, built for students.</h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">SkillSyncAI helps students build job-ready profiles, discover matched opportunities, and track skill growth — all in one professional workspace.</p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"><Button size="lg" className="w-full sm:w-auto">Get started — it's free</Button><Button variant="outline" size="lg" className="w-full sm:w-auto" asChild><Link to="/login">Log in</Link></Button></div>
        </div>
      </section>
      <section className="py-16 px-4 border-y border-border bg-background">
        <div className="max-w-7xl mx-auto"><h2 className="text-3xl font-bold tracking-tight text-center mb-12">Everything you need to get hired</h2><div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { Icon: UserCheck, title: "Personal Workspace", desc: "Manage your academic and professional profile in one place." },
            { Icon: GraduationCap, title: "Skill Assessments", desc: "Validate your skills and track growth over time." },
            { Icon: TrendingUp, title: "Opportunity Matching", desc: "AI-matched jobs and internships based on your skills." },
          ].map((f, i) => {
            const Comp = f.Icon;
            return (
              <Card key={i}>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><Comp className="h-5 w-5" /></div>
                  <h3 className="font-semibold">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </CardContent>
              </Card>
            );
          })}
        </div></div>
      </section>
      <section className="py-20 px-4 bg-primary/5"><div className="max-w-3xl mx-auto text-center"><h2 className="text-3xl font-bold tracking-tight">Ready to launch your career?</h2><p className="mt-4 text-lg text-muted-foreground">Join thousands of students using SkillSyncAI to get job-ready.</p><div className="mt-8"><Button size="lg" className="w-full md:w-auto">Get started — it's free</Button></div></div></section>
      <footer className="border-t border-border py-8 px-4 bg-background"><div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4"><div className="flex items-center gap-2"><div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary"><Zap className="h-3 w-3 text-primary-foreground" /></div><span className="font-semibold">SkillSyncAI</span></div><p className="text-xs text-muted-foreground">© {new Date().getFullYear()} SkillSyncAI. Built for colleges & placement teams.</p></div></footer>
    </div>
  );
}