import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { cn } from "../../lib/utils";
import { useAuth } from "../../context/AuthContext";
import { ThemeToggle } from "../../context/ThemeContext";
import { Avatar } from "../ui/Avatar";
import { Button } from "../ui/Button";
import { LayoutDashboard, User, Briefcase, FileText, GraduationCap, BarChart3, Settings, HelpCircle, Menu, X, Zap, LogOut, Brain } from "lucide-react";

const workspaceNav = [
  { label: "Overview", icon: LayoutDashboard, to: "/dashboard" },
  { label: "Student Profile", icon: User, to: "/profile" },
  { label: "Opportunities", icon: Briefcase, to: "/opportunities" },
  { label: "Resume Workspace", icon: FileText, to: "/resume" },
  { label: "Skill Assessment", icon: GraduationCap, to: "/assessment" },
  { label: "Analytics", icon: BarChart3, to: "/analytics" },
  { label: "AI Chat", icon: Brain, to: "/ai-chat" },
];

const preferencesNav = [
  { label: "Settings", icon: Settings, to: "/settings" },
  { label: "Help & Support", icon: HelpCircle, to: "/help" },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const displayName = user?.name || user?.email?.split("@")[0] || "Student";

  const handleLogout = () => { logout(); navigate("/login"); setMobileOpen(false); };

  const NavItem = ({ item }) => (
    <NavLink to={item.to} end onClick={() => setMobileOpen(false)} className={({ isActive }) => cn("flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors", "text-muted-foreground hover:bg-accent hover:text-foreground", isActive && "bg-primary-soft text-primary font-semibold")}>
      <item.icon className="h-4 w-4 shrink-0" />
      <span className={cn("truncate", collapsed && "hidden")}>{item.label}</span>
    </NavLink>
  );

  return (
    <>
      {mobileOpen && <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden animate-fade-in" onClick={() => setMobileOpen(false)} />}
      <button type="button" onClick={() => setMobileOpen(!mobileOpen)} className="fixed left-3 top-3 z-50 inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card text-foreground md:hidden" aria-label="Toggle menu">{mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
      <aside className={cn("fixed inset-y-0 left-0 z-40 flex flex-col border-r border-border bg-card transition-all duration-200", collapsed ? "w-[64px]" : "w-[240px]", mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0")}>
        <div className="flex h-14 items-center gap-2 border-b border-border px-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary"><Zap className="h-4 w-4 text-primary-foreground" /></div>
          {!collapsed && <span className="text-lg font-bold tracking-tight">SkillSyncAI</span>}
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-2 scrollbar-thin">
          <div className="px-2 pb-1 pt-1"><span className={cn("px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground", collapsed && "hidden")}>Workspace</span>{workspaceNav.map((item) => <NavItem key={item.to} item={item} />)}</div>
          <div className="px-2 pb-1 pt-3"><span className={cn("px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground", collapsed && "hidden")}>Preferences</span>{preferencesNav.map((item) => <NavItem key={item.to} item={item} />)}</div>
        </nav>
        <div className="border-t border-border p-2">
          <div className="flex items-center gap-2 rounded-md p-2 hover:bg-accent transition-colors">
            <Avatar name={displayName} size="sm" />
            {!collapsed && <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{displayName}</p><p className="truncate text-xs text-muted-foreground">Student account</p></div>}
            <Button variant="ghost" size="icon" onClick={handleLogout} className="h-8 w-8" aria-label="Log out"><LogOut className="h-4 w-4" /></Button>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;