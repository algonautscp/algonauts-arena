"use client";

import { useAuth } from "@/context/AuthContext";

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  if (!user) return null;

  if (user.role === "MEMBER") {
    return (
      <div className="p-6 text-red-400">
        Access denied
      </div>
    );
  }

  return <>{children}</>;
}
