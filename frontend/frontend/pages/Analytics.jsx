import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Separator } from "../components/ui/Separator";
import { TrendingUp, Clock, Target } from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const weeklyGrowth = [
  { name: "Mon", skills: 3, readiness: 60 },
  { name: "Tue", skills: 4, readiness: 62 },
  { name: "Wed", skills: 5, readiness: 68 },
  { name: "Thu", skills: 6, readiness: 72 },
  { name: "Fri", skills: 7, readiness: 75 },
  { name: "Sat", skills: 2, readiness: 76 },
  { name: "Sun", skills: 1, readiness: 77 },
];

const skillGrowth = [
  { name: "React", value: 85 },
  { name: "TypeScript", value: 75 },
  { name: "Node.js", value: 70 },
  { name: "Python", value: 60 },
  { name: "SQL", value: 55 },
];

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><div><h1 className="text-2xl font-bold tracking-tight">Analytics</h1><p className="text-sm text-muted-foreground mt-1">Track your skill growth and career readiness over time.</p></div></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><CardContent className="flex items-center justify-between gap-3"><div><p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Readiness Score</p><p className="text-3xl font-bold">78</p></div><Badge variant="success">+12 this month</Badge></CardContent></Card>
        <Card><CardContent className="flex items-center justify-between gap-3"><div><p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Skills Assessed</p><p className="text-3xl font-bold">14</p></div><Badge variant="success">+3 this month</Badge></CardContent></Card>
        <Card><CardContent className="flex items-center justify-between gap-3"><div><p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Assessments Taken</p><p className="text-3xl font-bold">5</p></div><Badge variant="secondary">2 pending</Badge></CardContent></Card>
        <Card><CardContent className="flex items-center justify-between gap-3"><div><p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Profile Completeness</p><p className="text-3xl font-bold">72%</p></div><Badge variant="outline">Needs work</Badge></CardContent></Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="lg:col-span-2"><CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="h-4 w-4" /> Skill Growth Over Time</CardTitle></CardHeader><CardContent><div className="h-64 w-full"><ResponsiveContainer width="100%" height="100%"><LineChart data={weeklyGrowth}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Line type="monotone" dataKey="skills" stroke="#635bdb" strokeWidth={2} dot={false} /></LineChart></ResponsiveContainer></div></CardContent></Card>
        <Card><CardHeader><CardTitle className="flex items-center gap-2"><Target className="h-4 w-4" /> Skill Breakdown</CardTitle></CardHeader><CardContent className="space-y-3">{skillGrowth.map((s) => <div key={s.name} className="space-y-1"><div className="flex items-center justify-between text-sm"><span className="font-medium">{s.name}</span><span className="font-medium text-right">{s.value}</span></div><div className="h-2 w-full bg-muted rounded-full overflow-hidden"><div className="h-full bg-primary" style={{ width: s.value + "%" }} /></div></div>)}</CardContent></Card>
      </div>
    </div>
  );
}