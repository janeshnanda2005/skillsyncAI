import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Skeleton } from "../components/ui/Skeleton";
import { Upload, FileText } from "lucide-react";

const sampleResume = {
  fileName: "Jane_Doe_Resume.pdf",
  uploadedAt: "Oct 12, 2024",
  aiScore: 87,
  aiSuggestions: [
    "Add more quantifiable metrics to your work experience (e.g., 'increased performance by 20%').",
    "Include a link to your portfolio or GitHub profile.",
    "Add relevant certifications section with dates.",
    "Use strong action verbs at the start of each bullet point.",
  ],
};

export default function Resume() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><div><h1 className="text-2xl font-bold tracking-tight">Resume Workspace</h1><p className="text-sm text-muted-foreground mt-1">Build and improve your resume with AI-powered suggestions.</p></div><Button variant="outline" className="gap-2"><Upload className="h-4 w-4" /> Upload Resume</Button></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1"><CardHeader><CardTitle className="flex items-center gap-2"><FileText className="h-4 w-4" /> Resume File</CardTitle></CardHeader><CardContent className="p-4"><div className="space-y-3"><div className="flex items-center gap-3"><Upload className="h-5 w-5 text-primary" /><div className="flex-1"><p className="font-medium">{sampleResume.fileName}</p><p className="text-xs text-muted-foreground">{sampleResume.uploadedAt}</p></div></div><div className="space-y-1 mt-3"><span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">AI Score</span><div className="flex items-center gap-2"><span className="text-2xl font-bold">{sampleResume.aiScore}/100</span><Badge variant="success">Strong</Badge></div></div></div></CardContent></Card>
        <Card className="lg:col-span-2"><CardHeader><CardTitle className="flex items-center gap-2"><FileText className="h-4 w-4" /> AI Suggestions</CardTitle></CardHeader><CardContent className="space-y-3">{sampleResume.aiSuggestions.map((s, i) => <div key={i} className="flex items-start gap-3 p-3 rounded-md bg-muted/30"><span className="mt-1 shrink-0 text-xs bg-primary/10 px-2 py-1 rounded text-primary">{i + 1}</span><p className="text-sm">{s}</p></div>)}</CardContent></Card>
      </div>
    </div>
  );
}