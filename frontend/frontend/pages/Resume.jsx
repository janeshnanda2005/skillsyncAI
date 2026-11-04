import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { Badge } from "../components/ui/Badge";
import { Progress } from "../components/ui/Progress";
import { Upload, FileText } from "lucide-react";

export default function Resume() {
  return (
    <div className="space-y-8 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-widest text-fg">Flight Plan</h1>
          <p className="text-sm text-fg-muted mt-1">
            Upload your resume PDF to the database and get AI-powered suggestions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-4 w-4" /> Resume File
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-border rounded-lg bg-bg-elevated">
              <Upload className="h-8 w-8 text-fg-muted mb-2" />
              <p className="text-sm text-fg-muted">No resume uploaded</p>
              <label className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded border border-fg text-fg hover:bg-fg hover:text-black transition-colors">
                <input type="file" accept="application/pdf" className="sr-only" />
                Choose PDF
              </label>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-4 w-4" /> AI Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <EmptyState
              icon={<FileText className="h-6 w-6 text-fg-muted" />}
              title="No AI Suggestions Available"
              description="Upload a resume first to receive AI-powered improvement suggestions."
            />
          </CardContent>
        </Card>
      </div>

      <div className="rounded border border-border bg-bg-elevated p-4 text-sm">
        <p className="text-fg-muted">
          <span className="font-bold text-fg">nil</span> — No resume data is present in the database for this account.
        </p>
      </div>
    </div>
  );
}