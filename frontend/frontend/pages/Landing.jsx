import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { SpaceBackground } from "../components/space/SpaceBackground";
import { OrbitRing } from "../components/space/OrbitRing";
import { Reveal } from "../components/space/Reveal";
import { Zap, GraduationCap, TrendingUp, UserCheck, Brain, ArrowRight } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-black text-fg overflow-x-hidden">
      <SpaceBackground className="inset-0 z-0" />

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded border border-border bg-black">
            <Zap className="h-3.5 w-3.5 text-fg" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-fg">
            SkillSyncAI
          </span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest">
          <Link to="#" className="text-fg-muted hover:text-fg transition-colors">
            Features
          </Link>
          <Link to="#" className="text-fg-muted hover:text-fg transition-colors">
            Pricing
          </Link>
          <Link to="#" className="text-fg-muted hover:text-fg transition-colors">
            About
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="h-9 px-4">
            Log in
          </Button>
          <Button size="sm" className="h-9 px-5" asChild>
            <Link to="/signup">Get started</Link>
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-start justify-center min-h-[70vh] px-6 pt-20 pb-12 max-w-7xl mx-auto">
        <Reveal className="mb-8">
          <span className="inline-flex items-center gap-1.5 rounded border border-border px-2.5 py-0.5 text-[10px] font-bold uppercase text-glow-mars border-glow-mars/30 bg-glow-mars/10">
            NEW FOR COLLEGES &amp; PLACEMENT TEAMS
          </span>
        </Reveal>

        <Reveal className="mb-6">
          <h1 className="text-5xl md:text-7xl lg:text-9xl font-bold leading-[1.05] tracking-tight text-fg">
            YOUR CAREER,<br />
            IN ORBIT.
          </h1>
        </Reveal>

        <Reveal className="mb-10">
          <p className="text-lg md:text-xl text-fg-muted max-w-[65ch] leading-relaxed">
            SkillSyncAI helps students build job-ready profiles, discover matched
            opportunities, and track skill growth — all in one professional workspace.
          </p>
        </Reveal>

        <Reveal>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Button size="lg" className="h-12 px-8 text-sm" asChild>
              <Link to="/signup">Get started — it's free</Link>
            </Button>
            <Button variant="outline" size="lg" className="h-12 px-8 text-sm" asChild>
              <Link to="/login">Log in</Link>
            </Button>
          </div>
        </Reveal>
      </section>

      {/* Section: Features */}
      <section className="relative z-10 border-y border-border bg-bg py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-fg">
              Everything you need to get hired
            </h2>
            <p className="mt-4 text-lg text-fg-muted max-w-[65ch] mx-auto leading-relaxed">
              A complete toolkit for student career readiness, from profile to placement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: UserCheck,
                title: "PERSONAL WORKSPACE",
                desc: "Manage your academic and professional profile in one place.",
              },
              {
                icon: Brain,
                title: "SKILL ASSESSMENTS",
                desc: "Validate your skills and track growth over time.",
              },
              {
                icon: TrendingUp,
                title: "OPPORTUNITY MATCHING",
                desc: "AI-matched jobs and internships based on your skills.",
              },
            ].map((f, i) => {
              const Comp = f.icon;
              return (
                <Card key={i} className="group hover:border-glow-mars/30 transition-colors">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded border border-border bg-black text-glow-mars group-hover:bg-glow-mars group-hover:text-black transition-colors">
                      <Comp className="h-5 w-5" />
                    </div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-fg">
                      {f.title}
                    </h3>
                    <p className="text-xs text-fg-muted leading-relaxed">{f.desc}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section: Spec Rows (Data) */}
      <section className="relative z-10 border-y border-border bg-black py-24 px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 items-start">
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-fg mb-6">
              Placement results
            </h2>
            <p className="text-lg text-fg-muted max-w-[65ch] leading-relaxed mb-8">
              Real outcomes for students using SkillSyncAI across partner colleges.
            </p>

            <div className="space-y-0">
              <SpecRow label="Students placed" value="12,843" />
              <SpecRow label="Partner colleges" value="47" />
              <SpecRow label="Avg. match score" value="78%" />
              <SpecRow label="Assessments completed" value="89,201" />
              <SpecRow label="Resume reviews" value="34,112" />
            </div>
          </div>
          <div className="flex-1 hidden lg:block">
            <div className="relative h-64 w-full">
              <OrbitRing size={320} color="var(--glow-orbit)" className="mx-auto" />
            </div>
          </div>
        </div>
      </section>

      {/* Section: Atmosphere (blue glow story) */}
      <section className="relative z-10 border-y border-border bg-black/50 py-24 px-6">
        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Blue atmospheric glow */}
          <div
            className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-glow-orbit/20 blur-[120px] pointer-events-none"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-fg mb-6">
                Built for readiness
              </h2>
              <p className="text-lg text-fg-muted max-w-[65ch] leading-relaxed">
                Real-time telemetry on skill growth, assessment scores, and career
                trajectory — no decoration, just data that moves you forward.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 border-t border-border bg-bg py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-fg mb-4">
            Ready to launch your career?
          </h2>
          <p className="text-lg text-fg-muted max-w-[65ch] mx-auto mb-10">
            Join thousands of students using SkillSyncAI to get job-ready.
          </p>
          <Button size="lg" className="h-12 px-10 text-sm" asChild>
            <Link to="/signup">Get started — it's free</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border bg-black py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded border border-border bg-black">
              <Zap className="h-3 w-3 text-fg" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-fg">
              SkillSyncAI
            </span>
          </div>
          <p className="text-[10px] text-fg-muted">
            &copy; {new Date().getFullYear()} SkillSyncAI. Built for colleges &amp; placement teams.
          </p>
        </div>
      </footer>
    </div>
  );
}

function SpecRow({ label, value }) {
  return (
    <div className="flex items-baseline justify-between py-2 px-4 border-b border-border/50 last:border-0">
      <span className="text-xs font-bold uppercase tracking-widest text-fg-subtle">
        {label}
      </span>
      <span className="text-sm font-bold text-fg tabular-nums">{value}</span>
    </div>
  );
}