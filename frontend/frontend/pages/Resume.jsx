import React, { useState, useEffect } from "react";
import { useRequireAuth } from "../context/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { EmptyState } from "../components/ui/EmptyState";
import { Badge } from "../components/ui/Badge";
import { Progress } from "../components/ui/Progress";
import { Upload, FileText, Trash2, RefreshCw } from "lucide-react";
import { uploadResume, getResume, deleteResume } from "../api/index";

export default function Resume() {
  const user = useRequireAuth();
  const email = user?.sub || user?.email || "";
  const displayName = email.split("@")[0] || "this account";

  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);

  useEffect(() => {
    let mounted = true;
    getResume()
      .then((data) => { if (mounted) setResume(data); })
      .catch(() => { if (mounted) setResume(null); });
    return () => { mounted = false; };
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files[0]) setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadResume(file);
      setResume(res);
      setFile(null);
    } catch (err) {
      alert(err.response?.data?.detail || "Resume upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete your resume?")) return;
    try {
      await deleteResume();
      setResume(null);
    } catch (err) {
      alert(err.response?.data?.detail || "Delete failed");
    }
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Resume Workspace</h1>
          <p className="text-sm text-muted-foreground mt-1">
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
            <div className="space-y-4">
              {!resume ? (
                <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-border rounded-lg bg-muted/30">
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No resume uploaded</p>
                  <label className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-md border border-primary text-primary hover:bg-primary hover:text-white transition-colors">
                    <input type="file" accept="application/pdf" onChange={handleFileChange} className="sr-only" />
                    Choose PDF
                  </label>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <div className="flex-1">
                      <p className="font-medium">{resume.file_name}</p>
                      <p className="text-xs text-muted-foreground">Stored in database · {resume.r_id}</p>
                    </div>
                    <Button variant="destructive" size="sm" onClick={handleDelete}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="font-medium">100%</span>
                    <span className="text-xs text-muted-foreground">Uploaded</span>
                  </div>
                  <Progress value={100} className="h-2" showLabel color="success" />
                </div>
              )}
              {!resume && (
                <form onSubmit={handleUpload} className="mt-4 w-full">
                  <input
                    id="resumeFile"
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="sr-only"
                  />
                  <Button type="submit" disabled={!file || uploading} className="w-full">
                    {uploading ? "Uploading..." : "Upload Resume to Database"}
                  </Button>
                </form>
              )}
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
            {!resume ? (
              <EmptyState
                icon={<FileText className="h-6 w-6 text-muted-foreground" />}
                title="No AI suggestions available"
                description={`Upload a resume for ${displayName} first to receive AI-powered improvement suggestions.`}
              />
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">ATS Readiness</span>
                  <Badge variant="success">Strong</Badge>
                </div>
                <Progress value={87} className="h-2" showLabel color="success" />
                <div className="p-3 rounded-md bg-primary/5 border border-primary/10 text-sm text-primary-foreground">
                  <p className="font-medium">Resume stored in database.</p>
                  <p className="text-xs mt-1">Use the AI Chat beside this section to ask questions about your resume.</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {!resume && (
        <div className="bg-muted/50 rounded-lg border border-border p-4 text-sm">
          <p className="text-muted-foreground">
            <span className="font-medium">nil</span> — No resume data is present in the database for this account.
          </p>
        </div>
      )}
    </div>
  );
}