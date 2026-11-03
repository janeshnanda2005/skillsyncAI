import React from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function AppShell() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="md:pl-[240px]">
        <Topbar />
        <main className="min-h-[calc(100vh-56px)] p-4 md:p-6"><Outlet /></main>
      </div>
    </div>
  );
}

export default AppShell;