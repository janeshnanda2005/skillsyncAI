import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { HelpCircle, Mail, Zap, ShieldCheck } from "lucide-react";

export default function Help() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><div><h1 className="text-2xl font-bold tracking-tight">Help & Support</h1><p className="text-sm text-muted-foreground mt-1">Get help with SkillSyncAI and your career journey.</p></div></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2"><CardHeader><CardTitle>Contact Support</CardTitle></CardHeader><CardContent className="space-y-4"><div className="flex items-center gap-3"><Mail className="h-5 w-5 text-primary" /><div className="flex-1"><p className="text-sm font-medium">support@skillsyncai.com</p><p className="text-xs text-muted-foreground">We respond within 24 hours</p></div></div><div className="flex items-center gap-3"><ShieldCheck className="h-5 w-5 text-success" /><div className="flex-1"><p className="text-sm font-medium">Security & Privacy</p><p className="text-xs text-muted-foreground">Report a security concern</p></div></div></CardContent></Card>
        <Card className="lg:col-span-1"><CardHeader><CardTitle>Quick Links</CardTitle></CardHeader><CardContent className="space-y-3"><button className="w-full text-left text-sm text-primary hover:underline">Documentation</button><button className="w-full text-left text-sm text-primary hover:underline">FAQ</button><button className="w-full text-left text-sm text-primary hover:underline">Submit a Request</button></CardContent></Card>
      </div>
    </div>
  );
}