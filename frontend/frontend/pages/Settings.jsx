import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { Separator } from "../components/ui/Separator";
import { Moon, Sun, Bell, Globe, Palette, User } from "lucide-react";

export default function Settings() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold tracking-tight">Settings</h1><p className="text-sm text-muted-foreground mt-1">Manage your account and application preferences.</p></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2"><CardHeader><CardTitle>General</CardTitle></CardHeader><CardContent className="space-y-4"><Input id="displayName" label="Display Name" placeholder="Jane Doe" defaultValue="Jane Doe" /><Input id="email" label="Email Address" type="email" placeholder="jane@example.com" defaultValue="jane@example.com" /><Select id="language" label="Language" defaultValue="English"><option value="English">English</option><option value="Spanish">Español</option><option value="French">Français</option><option value="German">Deutsch</option></Select><Separator /><div className="flex items-center justify-between"><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-md bg-card"><Moon className="h-5 w-5 text-muted-foreground" /><Sun className="absolute h-5 w-5 text-primary" /></div><div><p className="text-sm font-medium">Dark Mode</p><p className="text-xs text-muted-foreground">Toggle dark theme</p></div></div><button className="w-14 h-7 rounded-full bg-primary/10 relative transition-colors peer"><span className="absolute left-1 top-1 h-5 w-5 rounded-full bg-background shadow-sm transition-all peer-checked:translate-x-4 peer-checked:bg-primary peer:ring-2 peer:ring-transparent peer-checked:ring-offset-2" /></button></div></CardContent></Card>
        <Card className="lg:col-span-1"><CardHeader><CardTitle>Account</CardTitle></CardHeader><CardContent className="space-y-4"><div className="flex items-center gap-3"><User className="h-5 w-5 text-muted-foreground" /><div><p className="text-sm font-medium">jane.doe@example.com</p><p className="text-xs text-muted-foreground">Student account</p></div></div><Button variant="outline" className="w-full">Change Password</Button><Separator className="my-3" /><Button variant="destructive" className="w-full">Delete Account</Button></CardContent></Card>
      </div>
    </div>
  );
}