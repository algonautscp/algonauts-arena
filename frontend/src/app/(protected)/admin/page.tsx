"use client";

import AdminGuard from "@/components/admin/AdminGuard";
import CreateContest from "@/components/admin/CreateContest";
import ContestManagement from "@/components/admin/ContestManagement";
import { useAuth } from "@/context/AuthContext";

export default function AdminPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  return (
    <AdminGuard>
      <main className="p-6 space-y-8">
        <h1 className="text-3xl font-bold">Admin Panel</h1>

        {isAdmin && <CreateContest />}

        <ContestManagement canMutate={isAdmin} />
      </main>
    </AdminGuard>
  );
}
