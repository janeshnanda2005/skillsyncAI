import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "../../lib/utils";
import { useAuth } from "../../context/AuthContext";
import { ThemeToggle } from "../../context/ThemeContext";
import { Bell, Search, Settings, LogOut, Menu, Zap } from "lucide-react";

export function Topbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const displayName = user?.name || user?.email?.split("@")[0] || "CREW";

  const now = new Date();
  const sessionTime = now.toISOString().slice(11, 19);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header
      className="sticky top-0 z-30 h-14 flex items-center gap-2 border-b border-border bg-bg/80 backdrop-blur-md px-4"
    >
      <button
        type="button"
        className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded border border-border bg-bg-elevated text-fg"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded border border-border bg-black">
          <Zap className="h-3.5 w-3.5 text-fg" />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-fg hidden sm:inline">
          SkillSyncAI
        </span>
      </div>

      <div className="relative mx-auto w-full max-w-md">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-subtle"
        />
        <input
          type="search"
          placeholder="SEARCH..."
          className="h-9 w-full rounded border border-border bg-bg pl-9 pr-3 text-xs text-fg outline-none transition-colors"
          placeholderClassName="text-fg-subtle/60"
          aria-label="Search"
        />
      </div>

      <div className="ml-auto flex items-center gap-1">
        <ThemeToggle />
        <Button variant="ghost" size="sm" className="h-9 w-9" aria-label="Notifications">
          <Bell className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 w-9"
          onClick={() => navigate("/settings")}
          aria-label="Settings"
        >
          <Settings className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 w-9"
          onClick={handleLogout}
          aria-label="Log out"
        >
          <LogOut className="h-4 w-4" />
        </Button>
        <div className="flex items-end gap-0.5">
          <span className="text-[10px] font-bold text-fg-muted tabular-nums">T+</span>
          <span className="text-[10px] font-bold text-fg tabular-nums">{sessionTime}</span>
        </div>
        <div className="h-7 w-7 rounded border border-border flex items-center justify-center text-[10px] font-bold text-fg">
          {displayName.charAt(0)}
        </div>
      </div>
    </header>
  );
}

export default Topbar;