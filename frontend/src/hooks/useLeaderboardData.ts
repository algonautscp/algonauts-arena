"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { LeaderboardData } from "@/types/dashboard";

export function useLeaderboardData() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scope="weekly";

  const fetchLeaderboard = async (newScope: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/api/dashboard/leaderboard?scope=${newScope}`);
      console.log("Leaderboard response:", response.data, newScope);
      setLeaderboard(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch leaderboard');
      setLeaderboard(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard(scope);
  }, [scope]);

  return {
    leaderboard,
    loading,
    error,
    scope,
    fetchLeaderboard
  };
}
