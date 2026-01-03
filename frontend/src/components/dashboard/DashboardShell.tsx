"use client";

import { ReactNode } from "react";

interface DashboardShellProps {
  children: ReactNode;
}

/**
 * Layout shell that provides the basic structure
 * Client component to ensure hydration consistency
 */
export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-background flex">
      {children}
    </div>
  );
}