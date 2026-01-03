"use client";

import { useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { useDashboardData } from "@/hooks/useDashboardData";
import { DashboardShell } from "../DashboardShell";
import { SidebarNavigation } from "./SidebarNavigation";
import { DashboardHeader } from "./DashboardHeader";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
}

/**
 * Main dashboard layout component that orchestrates all sub-components
 * 
 * ARCHITECTURE IMPROVEMENTS:
 * - Uses real user data from auth context
 * - Displays actual user rank from dashboard stats
 * - Memoized props to optimize performance
 * - Clean separation between SSR and client-only code
 */
export default function DashboardLayout({ 
  children, 
  title
}: DashboardLayoutProps) {
  const { user } = useAuth();
  const { data } = useDashboardData();

  // Memoize header props to prevent unnecessary re-renders
  const headerProps = useMemo(() => ({
    title,
    userName: user?.name,
    userRank: data?.stats?.rank ? `Rank #${data.stats.rank}` : undefined,
    userInitials: user?.name 
      ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
      : "GU"
  }), [title, user, data?.stats?.rank]);

  return (
    <DashboardShell>
      {/* Fixed Sidebar - no collapse functionality */}
      <SidebarNavigation />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header - SSR-safe */}
        <DashboardHeader {...headerProps} />

        {/* Page Content */}
        <main className="flex-1 bg-muted/30 overflow-auto">
          {children}
        </main>
      </div>
    </DashboardShell>
  );
}
