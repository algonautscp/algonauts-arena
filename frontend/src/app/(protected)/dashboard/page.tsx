"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

import PracticeStatsCard from "@/components/dashboard/PracticeStatsCard";
import ContestListCard from "@/components/dashboard/ContestListCard";
import PracticeLeaderboard from "@/components/dashboard/PracticeLeaderboard";
import PracticeSyncButton from "@/components/dashboard/PracticeSyncButton";


import { PracticeStats, PracticeLeaderboardEntry } from "@/types/practice";
import { Contest } from "@/types/contest";

export default function DashboardPage() {
  const { user } = useAuth();

  const [stats, setStats] = useState<PracticeStats | null>(null);
  const [contests, setContests] = useState<Contest[]>([]);
  const [leaderboard, setLeaderboard] = useState<
    PracticeLeaderboardEntry[]
  >([]);

  useEffect(() => {
    api.get("/practice/me/stats").then((res) =>
      setStats(res.data)
    );

    api.get("/contests").then((res) =>
      setContests(res.data)
    );

    if (user?.role === "ADMIN" || user?.role === "MENTOR") {
      api.get("/practice/leaderboard").then((res) =>
        setLeaderboard(res.data)
      );
    }
  }, [user]);

  return (
    <main className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
            Welcome!!, {user?.name}
        </h1>

        <PracticeSyncButton
            onSuccess={() => {
            api.get("/practice/me/stats").then((res) =>
                setStats(res.data)
            );
            }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats && <PracticeStatsCard stats={stats} />}
        <ContestListCard contests={contests} />
      </div>

      {(user?.role === "ADMIN" || user?.role === "MENTOR") &&
        leaderboard.length > 0 && (
          <PracticeLeaderboard data={leaderboard} />
        )}
    </main>
  );
}
