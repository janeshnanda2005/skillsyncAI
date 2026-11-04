import React, { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./Card";
import { Badge } from "./Badge";
import { Progress } from "./Progress";
import { Target } from "lucide-react";

const defaultJD = `We are looking for a Software Engineering Intern with strong proficiency in programming fundamentals. The ideal candidate should have experience with Python, JavaScript, or TypeScript, and a solid understanding of data structures and algorithms. Familiarity with React, Node.js, and SQL databases is preferred. Experience with Git, cloud platforms (AWS/Azure/GCP), and Agile methodologies is a plus. Strong problem-solving skills and the ability to work in a team environment are essential.`;

const defaultResume = `John Doe
Computer Science Student

Skills: Python, JavaScript, React, Node.js, SQL, Git, HTML/CSS, Data Structures, Algorithms

Projects:
- Personal Portfolio Website: Built with React and Node.js, deployed on AWS.
- Task Management App: Full-stack application with PostgreSQL database.

Education:
B.Sc. Computer Science, Expected 2025`;

const commonKeywords = [
  "python", "javascript", "typescript", "react", "node.js", "sql",
  "git", "aws", "azure", "gcp", "docker", "kubernetes", "agile",
  "data structures", "algorithms", "machine learning", "api",
  "rest", "postgresql", "mongodb", "html/css", "tailwind",
];

export default function AtsScoreCalculator() {
  const [jd, setJd] = useState(defaultJD);
  const [resume, setResume] = useState(defaultResume);

  const result = useMemo(() => {
    const jdLower = jd.toLowerCase();
    const resLower = resume.toLowerCase();
    const jdKeywords = commonKeywords.filter((k) => jdLower.includes(k.toLowerCase()));
    const found = jdKeywords.filter((k) => resLower.includes(k.toLowerCase()));
    const notFound = jdKeywords.filter((k) => !resLower.includes(k.toLowerCase()));
    const score = jdKeywords.length > 0 ? Math.round((found.length / jdKeywords.length) * 100) : 0;
    return { score, matched: found, missing: notFound };
  }, [jd, resume]);

  const getScoreColor = (s) => {
    if (s >= 80) return "bg-success/10 text-success border-success/20";
    if (s >= 50) return "bg-amber-500/10 text-amber-600 border-amber-500/20";
    return "bg-destructive/10 text-destructive border-destructive/20";
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Target className="h-4 w-4" />
          ATS Score Calculator
        </CardTitle>
        <div className="flex items-center gap-1">
          <span className={getScoreColor(result.score) + " text-xs font-semibold px-2 py-1 rounded-full border"}>
            {result.score}%
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Job Description</label>
          <textarea
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            rows={4}
            className="w-full h-24 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="Paste job description here..."
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Resume Text</label>
          <textarea
            value={resume}
            onChange={(e) => setResume(e.target.value)}
            rows={5}
            className="w-full h-32 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="Paste your resume text here..."
          />
        </div>
        <div className="relative my-2">
          <div className="border-t border-border" />
          <span className="absolute -top-px left-[20%] bg-background px-2 text-xs text-muted-foreground">
            Scoring Criteria
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">ATS Match Score</p>
            <p className="text-2xl font-bold">{result.score}%</p>
          </div>
          <Progress value={result.score} className="h-2" color={result.score >= 80 ? "success" : result.score >= 50 ? "warning" : "destructive"} showLabel />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3 rounded-md bg-success/5 border border-success/10">
            <p className="text-xs font-semibold text-success uppercase tracking-wider">Matched Keywords ({result.matched.length})</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {result.matched.length > 0 ? result.matched.map((k) => (
                <span key={k} className="text-[10px] bg-success/20 text-success px-2 py-0.5 rounded">{k}</span>
              )) : (
                <span className="text-[10px] text-muted-foreground">None matched</span>
              )}
            </div>
          </div>
          <div className="p-3 rounded-md bg-destructive/5 border border-destructive/10">
            <p className="text-xs font-semibold text-destructive uppercase tracking-wider">Missing Keywords ({result.missing.length})</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {result.missing.length > 0 ? result.missing.map((k) => (
                <span key={k} className="text-[10px] bg-destructive/20 text-destructive px-2 py-0.5 rounded">{k}</span>
              )) : (
                <span className="text-[10px] text-muted-foreground">None missing</span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


export { AtsScoreCalculator };
