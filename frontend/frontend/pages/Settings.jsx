import React from "react";
import { useRequireAuth } from "../context/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Separator } from "../components/ui/Separator";
import { User, Moon, Sun, LogOut } from "lucide-react";
import { logoutUser } from "../api/index";

export default function Settings() {
  const user = useRequireAuth();
  const email = user?.sub || user?.email || "";
  const name = user?.name || email.split("@")[0] || "CREW";

  const handleLogout = async () => {
    try { await logoutUser(); } catch {}
    window.location.href = "/login";
  };

  return (
    <div className="space-y-8 p-4">
      <div>
        <h1 className="text-2xl font-bold uppercase tracking-widest text-fg">Systems</h1>
        <p className="text-sm text-fg-muted mt-1">
          Manage your account and application preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>General</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              id="displayName"
              label="Display Name"
              placeholder="Enter name"
              defaultValue={name}
              disabled
            />
            <Input
              id="email"
              label="Email Address"
              type="email"
              placeholder="Enter email"
              defaultValue={email}
              disabled
            />
            <p className="text-xs text-fg-muted">
              Account details are synced from the authentication database.
            </p>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded border border-border bg-black">
                  <Moon className="h-5 w-5 text-fg-muted" />
                  <Sun className="absolute h-5 w-5 text-fg" />
                </div>
                <div>
                  <p className="text-sm font-bold uppercase tracking-widest text-fg">Dark Mode</p>
                  <p className="text-[10px] text-fg-muted">Toggle dark theme</p>
                </div>
              </div>
              <button className="w-14 h-7 rounded-full bg-fg/10 relative transition-colors peer">
                <span className="absolute left-1 top-1 h-5 w-5 rounded-full bg-black shadow-sm transition-all peer-checked:translate-x-4 peer-checked:bg-fg peer:ring-2 peer:ring-transparent peer-checked:ring-offset-2" />
              </button>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-fg-muted" />
              <div>
                <p className="text-sm font-bold text-fg">{email}</p>
                <p className="text-[10px] text-fg-muted">Crew Member</p>
              </div>
            </div>
            <Button variant="outline" className="w-full" onClick={() => {}} disabled>
              Change Password
            </Button>
            <Separator className="my-3" />
            <Button variant="destructive" className="w-full" onClick={handleLogout}>
              <LogOut className="h-3 w-3 mr-2" />
              Log out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}