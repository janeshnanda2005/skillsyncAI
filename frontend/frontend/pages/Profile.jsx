import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Avatar } from "../components/ui/Avatar";
import { Progress } from "../components/ui/Progress";
import { Separator } from "../components/ui/Separator";
import { EmptyState } from "../components/ui/EmptyState";
import { User, GraduationCap, Briefcase, Code, Edit } from "lucide-react";

const sampleSkills = [
  { name: "React", level: 85, years: 2 },
  { name: "TypeScript", level: 75, years: 1.5 },
  { name: "Node.js", level: 70, years: 2 },
  { name: "Python", level: 60, years: 1 },
  { name: "PostgreSQL", level: 55, years: 1 },
];

const sampleEducation = [
  { id: 1, degree: "B.Sc. Computer Science", institution: "University of Technology", year: "2024", gpa: "3.8/4.0" },
  { id: 2, degree: "AWS Certified Developer", institution: "Amazon Web Services", year: "2023", gpa: "—" },
];

const sampleExperience = [
  { id: 1, role: "Frontend Intern", company: "Vercel", duration: "Summer 2023", description: "Built internal tooling with React and TypeScript." },
  { id: 2, role: "Teaching Assistant", company: "University of Technology", duration: "2022–2023", description: "Mentored students in data structures and algorithms." },
];

export default function Profile() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><div><h1 className="text-2xl font-bold tracking-tight">Student Profile</h1><p className="text-sm text-muted-foreground mt-1">Manage your academic and professional profile</p></div><Button variant="outline" className="gap-2"><Edit className="h-4 w-4" /> Edit Profile</Button></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1"><CardContent className="flex flex-col items-center text-center p-6"><Avatar name="Jane Doe" size="xl" /><h2 className="mt-3 text-lg font-semibold">Jane Doe</h2><p className="text-sm text-muted-foreground">Computer Science · 2024</p><div className="mt-4 w-full"><div className="flex items-center justify-between text-xs mb-1"><span className="text-muted-foreground">Profile completion</span><span className="font-medium">72%</span></div><Progress value={72} className="h-2" /></div><div className="mt-4 flex flex-wrap gap-1 justify-center"><Badge variant="success">Verified</Badge><Badge variant="secondary">Active</Badge></div></CardContent></Card>
        <div className="lg:col-span-2 space-y-6">
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><GraduationCap className="h-4 w-4" /> Education</CardTitle></CardHeader><CardContent className="space-y-4">{sampleEducation.map((edu) => <div key={edu.id}><div className="flex items-start justify-between"><div><p className="font-medium">{edu.degree}</p><p className="text-sm text-muted-foreground">{edu.institution}</p></div><Badge variant="outline">{edu.year}</Badge></div><p className="text-xs text-muted-foreground mt-1">GPA: {edu.gpa}</p><Separator className="mt-3" /></div>)}</CardContent></Card>
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><Code className="h-4 w-4" /> Skills</CardTitle></CardHeader><CardContent className="space-y-3">{sampleSkills.map((skill) => <div key={skill.name} className="space-y-1.5"><div className="flex items-center justify-between text-sm"><span className="font-medium">{skill.name}</span><span className="text-muted-foreground">{skill.level}%</span></div><Progress value={skill.level} className="h-2" /></div>)}</CardContent></Card>
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><Briefcase className="h-4 w-4" /> Experience</CardTitle></CardHeader><CardContent className="space-y-4">{sampleExperience.map((exp) => <div key={exp.id}><div className="flex items-start justify-between"><div><p className="font-medium">{exp.role}</p><p className="text-sm text-muted-foreground">{exp.company}</p></div><Badge variant="outline">{exp.duration}</Badge></div><p className="text-sm text-muted-foreground mt-1">{exp.description}</p><Separator className="mt-3" /></div>)}</CardContent></Card>
        </div>
      </div>
    </div>
  );
}