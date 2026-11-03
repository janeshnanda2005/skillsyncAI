import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Progress } from "../components/ui/Progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/Table";
import { GraduationCap, CheckCircle2, Clock, FileText } from "lucide-react";

const assessments = [
  { id: 1, title: "JavaScript Fundamentals", category: "Programming", progress: 100, status: "completed", score: 85 },
  { id: 2, title: "React Component Patterns", category: "Frontend", progress: 100, status: "completed", score: 92 },
  { id: 3, title: "TypeScript Basics", category: "Frontend", progress: 60, status: "in_progress", score: null },
  { id: 4, title: "Database Design", category: "Backend", progress: 30, status: "not_started", score: null },
  { id: 5, title: "System Design Basics", category: "Architecture", progress: 0, status: "not_started", score: null },
];

export default function Assessment() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><div><h1 className="text-2xl font-bold tracking-tight">Skill Assessments</h1><p className="text-sm text-muted-foreground mt-1">Take assessments to validate and track your skills.</p></div><Button variant="outline" className="gap-2"><GraduationCap className="h-4 w-4" /> Take Assessment</Button></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1"><CardHeader><CardTitle>Overall Progress</CardTitle></CardHeader><CardContent className="space-y-4"><div className="space-y-2"><div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Completed</span><span className="font-medium">2/5</span></div><Progress value={40} className="h-2" /><div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Avg Score</span><span className="font-medium">88</span></div><Progress value={88} className="h-2" /></div></CardContent></Card>
        <Card className="lg:col-span-2"><CardHeader><CardTitle className="flex items-center gap-2"><GraduationCap className="h-4 w-4" /> Assessments</CardTitle></CardHeader><CardContent><Table><TableHeader><TableRow><TableHead>Assessment</TableHead><TableHead>Category</TableHead><TableHead>Progress</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Score</TableHead></TableRow></TableHeader><TableBody>{assessments.map((a) => <TableRow key={a.id}><TableCell>{a.title}</TableCell><TableCell className="text-muted-foreground">{a.category}</TableCell><TableCell><div className="w-24"><Progress value={a.progress} className="h-1" /></div></TableCell><TableCell><Badge variant={a.status === "completed" ? "success" : a.status === "in_progress" ? "secondary" : "outline"}>{a.status.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}</Badge></TableCell><TableCell className="text-right">{a.score !== null ? <span className="font-medium">{a.score}</span> : <span className="text-muted-foreground">—</span>}</TableCell></TableRow>)}</TableBody></Table></CardContent></Card>
      </div>
    </div>
  );
}