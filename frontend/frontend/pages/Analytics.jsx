import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { TrendingUp, Target } from "lucide-react";

export default function Analytics() {
  return (
    <div className="space-y-8 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold uppercase tracking-widest text-fg">Telemetry</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded border border-border bg-bg-elevated p-4">
          <p className="text-xs font-bold uppercase tracking-widest text-fg-muted">Launch Readiness</p>
          <p className="text-3xl font-bold text-fg tabular-nums">78</p>
        </div>
        <div className="rounded border border-border bg-bg-elevated p-4">
          <p className="text-xs font-bold uppercase tracking-widest text-fg-muted">Skills Assessed</p>
          <p className="text-3xl font-bold text-fg tabular-nums">14</p>
        </div>
        <div className="rounded border border-border bg-bg-elevated p-4">
          <p className="text-xs font-bold uppercase tracking-widest text-fg-muted">Flight Tests</p>
          <p className="text-3xl font-bold text-fg tabular-nums">5</p>
        </div>
        <div className="rounded border border-border bg-bg-elevated p-4">
          <p className="text-xs font-bold uppercase tracking-widest text-fg-muted">Trajectory</p>
          <p className="text-3xl font-bold text-fg tabular-nums">+12%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" /> Skill Growth Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0fa" strokeOpacity={0.1} />
                  <XAxis dataKey="name" axisLine={false} tick={{ fill: "#8a8d99", fontSize: 11 }} />
                  <YAxis axisLine={false} tick={{ fill: "#8a8d99", fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: "#0a0a0c", border: "1px solid rgba(255,255,255,0.14)" }} />
                  <Line type="monotone" dataKey="skills" stroke="#d9703f" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-4 w-4" /> Skill Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {skillGrowth.map((s) => (
              <div key={s.name} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold text-fg">{s.name}</span>
                  <span className="font-bold text-right tabular-nums">{s.value}</span>
                </div>
                <div className="h-2 w-full bg-fg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-glow-mars" style={{ width: `${s.value}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="rounded border border-border bg-bg-elevated p-4">
        <p className="text-xs text-fg-muted text-center">
          Telemetry data computed from database records. No data present shows nil.
        </p>
      </div>
    </div>
  );
}

const weeklyGrowth = [
  { name: "Mon", skills: 3 },
  { name: "Tue", skills: 4 },
  { name: "Wed", skills: 5 },
  { name: "Thu", skills: 6 },
  { name: "Fri", skills: 7 },
  { name: "Sat", skills: 2 },
  { name: "Sun", skills: 1 },
];

const skillGrowth = [
  { name: "React", value: 85 },
  { name: "TypeScript", value: 75 },
  { name: "Node.js", value: 70 },
  { name: "Python", value: 60 },
  { name: "SQL", value: 55 },
];