"use client";

import { useState } from "react";
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";

interface DashboardLayoutProps {
  children: React.ReactNode;
  shopName?: string;
}

export function DashboardLayout({ children, shopName }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AppSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col lg:ml-[260px] min-w-0">
        <AppHeader onMenuClick={() => setSidebarOpen(true)} shopName={shopName} />
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
