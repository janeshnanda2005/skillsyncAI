import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { cn } from "../../lib/utils";
import { useAuth } from "../../context/AuthContext";
import { ThemeToggle } from "../../context/ThemeContext";
import { Avatar } from "../ui/Avatar";
import { Button } from "../ui/Button";
import { Bell, Search, Settings, LogOut, Menu, Zap } from "lucide-react";

export function Topbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const displayName = user?.name || user?.email?.split("@")[0] || "Student";

  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-card/80 px-4 backdrop-blur-md">
      <button type="button" className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-foreground" aria-label="Open menu"><Menu className="h-5 w-5" /></button>
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary"><Zap className="h-3.5 w-3.5 text-primary-foreground" /></div>
        <span className="text-sm font-semibold tracking-tight hidden sm:inline">SkillSyncAI</span>
      </div>
      <div className="relative mx-auto w-full max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input type="search" placeholder="Search opportunities, skills, people..." className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring" aria-label="Search" />
      </div>
      <div className="ml-auto flex items-center gap-1">
        <ThemeToggle />
        <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="Notifications"><Bell className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => navigate("/settings")} aria-label="Settings"><Settings className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon" className="h-9 w-9" onClick={handleLogout} aria-label="Log out"><LogOut className="h-4 w-4" /></Button>
        <Avatar name={displayName} size="sm" />
      </div>
    </header>
  );
}

export default Topbar;