import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { cn } from "../../lib/utils";
import { useAuth } from "../../context/AuthContext";
import { ThemeToggle } from "../../context/ThemeContext";
import { Zap, LayoutDashboard, User, Briefcase, FileText, GraduationCap, BarChart3, Settings, HelpCircle, Menu, X, LogOut, Brain, Clock } from "lucide-react";

const workspaceNav = [
  { label: "Overview", sublabel: "Mission Control", icon: LayoutDashboard, to: "/dashboard" },
  { label: "Student Profile", sublabel: "Crew Record", icon: User, to: "/profile" },
  { label: "Opportunities", sublabel: "Destinations", icon: Briefcase, to: "/opportunities" },
  { label: "Resume Workspace", sublabel: "Flight Plan", icon: FileText, to: "/resume" },
  { label: "Skill Assessment", sublabel: "Flight Tests", icon: GraduationCap, to: "/assessment" },
  { label: "Analytics", sublabel: "Telemetry", icon: BarChart3, to: "/analytics" },
  { label: "AI Chat", sublabel: "Neural Link", icon: Brain, to: "/ai-chat" },
];

const preferencesNav = [
  { label: "Settings", sublabel: "Systems", icon: Settings, to: "/settings" },
  { label: "Help & Support", sublabel: "Comms", icon: HelpCircle, to: "/help" },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const displayName = user?.name || user?.email?.split("@")[0] || "CREW";

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMobileOpen(false);
  };

  const NavItem = ({ item }) => (
    <NavLink
      to={item.to}
      end
      onClick={() => setMobileOpen(false)}
      className={({ isActive }) =>
        cn(
          "flex flex-col items-start gap-0.5 rounded border-transparent px-3 py-2.5 text-sm font-bold uppercase tracking-widest",
          "transition-all duration-300",
          "text-fg-muted hover:text-fg hover:bg-bg/30",
          isActive
            ? "border-l-2 border-fg bg-white/5 text-fg"
            : "text-fg-subtle"
        )
      }
    >
      <item.icon className="h-4 w-4 shrink-0 text-fg-muted" />
      <span className="leading-none">{item.label}</span>
      <span className="text-[10px] leading-none text-fg-subtle">{item.sublabel}</span>
    </NavLink>
  );

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/90 backdrop-blur-sm md:hidden animate-fade-in"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <button
        type="button"
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed left-3 top-3 z-50 inline-flex h-9 w-9 items-center justify-center rounded border border-border bg-bg-elevated text-fg md:hidden"
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex flex-col border-r border-border bg-bg/80 backdrop-blur-md transition-all duration-300",
          collapsed ? "w-[64px]" : "w-[240px]",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Brand */}
        <div className="flex h-14 items-center gap-2 border-b border-border px-4 bg-bg/60 backdrop-blur">
          <div className="flex h-7 w-7 items-center justify-center rounded border border-border bg-black">
            <Zap className="h-3.5 w-3.5 text-fg" />
          </div>
          {!collapsed && (
            <span className="text-sm font-bold uppercase tracking-widest text-fg">
              SkillSyncAI
            </span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-2">
          <div className="px-2 pb-1 pt-1">
            <span className="px-3 text-[10px] font-bold uppercase tracking-widest text-fg-subtle">
              Mission
            </span>
            {workspaceNav.map((item) => (
              <NavItem key={item.to} item={item} />
            ))}
          </div>

          <div className="px-2 pb-1 pt-3">
            <span className="px-3 text-[10px] font-bold uppercase tracking-widest text-fg-subtle">
              Systems
            </span>
            {preferencesNav.map((item) => (
              <NavItem key={item.to} item={item} />
            ))}
          </div>
        </nav>

        {/* Footer: crew account */}
        <div className="border-t border-border p-2">
          <div className="flex items-center gap-2 rounded border border-border px-2 py-1.5 hover:bg-bg/30 transition-colors">
            <div className="h-7 w-7 rounded border border-border flex items-center justify-center text-[10px] font-bold text-fg">
              {displayName.charAt(0)}
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold uppercase tracking-widest text-fg leading-none">
                  {displayName}
                </p>
                <p className="text-[10px] text-fg-subtle leading-none">Crew Member</p>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              aria-label="Log out"
              className="h-7 w-7 p-1"
            >
              <LogOut className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;