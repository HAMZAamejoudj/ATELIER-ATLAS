"use client";

import { cn } from "cn";
import { useState } from "react";

import { AdminSidebar } from "@/components/admin/AdminSidebar";

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-stone-100">
      <AdminSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
      />
      <main
        className={cn(
          "min-h-screen transition-all duration-300",
          collapsed ? "ml-20" : "ml-64",
        )}
      >
        {children}
      </main>
    </div>
  );
}
