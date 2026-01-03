"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
  Trophy, 
  Target, 
  Settings, 
  Home,
  Sword,
  BookOpen,
  MessageSquare,
  FolderPlus
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

const sidebarItems = [
  { icon: Home, label: "Overview", href: "/dashboard" },
  { icon: Target, label: "Practice", href: "/practice" },
  { icon: Trophy, label: "Contests", href: "/contests" },
  { icon: BookOpen, label: "Learn", href: "/learn" },
  { icon: MessageSquare, label: "My Goals", href: "/messages" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

const adminItems = [
  { icon: FolderPlus, label: "Practice Management", href: "/admin/questions" },
];

/**
 * Fixed sidebar navigation - no collapse functionality
 * 
 * Simple, static sidebar with consistent width and no animations
 * Eliminates hydration issues and provides stable navigation
 */
export function SidebarNavigation() {
  const pathname = usePathname();
  const { user } = useAuth();

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === href || pathname === "/dashboard/";
    }
    return pathname.startsWith(href);
  };

  const isAdminOrMentor = user && ['ADMIN', 'MENTOR'].includes(user.role);
  return (
    <div
      className="bg-card border-r border-border shadow-sm relative z-20 overflow-hidden"
      style={{ width: '240px' }}
      aria-label="Main navigation"
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <Sword className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg whitespace-nowrap">
              Algonauts
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4" aria-label="Dashboard navigation">
          <ul className="space-y-2" role="list">
            {sidebarItems.map((item) => (
              <li key={item.href} role="listitem">
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                    isActive(item.href)
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  )}
                  aria-current={isActive(item.href) ? "page" : undefined}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium whitespace-nowrap">
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
            
            {/* Admin Section - Only visible to admins and mentors */}
            {isAdminOrMentor && (
              <>
                <li className="pt-4 pb-2">
                  <div className="px-3">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Admin
                    </div>
                  </div>
                </li>
                {adminItems.map((item) => (
                  <li key={item.href} role="listitem">
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                        isActive(item.href)
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted text-muted-foreground hover:text-foreground"
                      )}
                      aria-current={isActive(item.href) ? "page" : undefined}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      <span className="font-medium whitespace-nowrap">
                        {item.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </>
            )}
          </ul>
        </nav>

        {/* No collapse toggle - fixed sidebar */}
      </div>
    </div>
  );
}
