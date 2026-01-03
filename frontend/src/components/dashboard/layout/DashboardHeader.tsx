"use client";

import { Menu } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface DashboardHeaderProps {
  title?: string;
  onMobileMenuToggle?: () => void;
}

/**
 * Header component with user info and mobile menu toggle
 * SSR-safe with minimal client-side state
 */
export function DashboardHeader({ 
  title = "Dashboard",
  onMobileMenuToggle
}: DashboardHeaderProps) {
  const { user } = useAuth();
  
  // Generate initials from user name
  const userInitials = user?.name 
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : "GU";

  // Format rank from dashboard stats (will be passed from parent)
  const userRank = user?.id ? `Rank #${user.id.slice(-3)}` : "Rank #142";

  return (
    <header className="bg-card border-b border-border shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <button 
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={onMobileMenuToggle}
            aria-label="Toggle mobile menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-semibold">{title}</h1>
        </div>

        <div className="flex items-center gap-4">
          {/* User Menu */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium">{user?.name || "Guest"}</p>
              <p className="text-xs text-muted-foreground">{userRank}</p>
            </div>
            <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
              <span className="text-sm font-medium">{userInitials}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
