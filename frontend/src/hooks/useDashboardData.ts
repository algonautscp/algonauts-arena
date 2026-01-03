"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { 
  DashboardData, 
  PracticeGoal,
  ActivityItem,
  MentorNote,
  MentorAnnouncement,
  DashboardStats,
  ContestInfo,
  LeaderboardData,
  ContextAwareCTA
} from "@/types/dashboard";

// Base hook for API calls with loading and error states
function useApiData<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(url);
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// Dashboard stats hook
export function useDashboardStats() {
  return useApiData<DashboardStats>("/dashboard/stats");
}

// Weekly progress hook
export function useWeeklyProgress() {
  return useApiData<{ days: { date: string; day: string; solvedCount: number }[] }>("/dashboard/weekly-progress");
}

// Practice goals hook
export function usePracticeGoals() {
  return useApiData<PracticeGoal[]>("/dashboard/goals");
}

// Activity feed hook
export function useActivityFeed() {
  return useApiData<ActivityItem[]>("/dashboard/activity-feed");
}

// Mentor notes hook
export function useMentorNotes() {
  return useApiData<MentorNote[]>("/dashboard/mentor-notes");
}

// Mentor announcements hook
export function useMentorAnnouncements() {
  return useApiData<MentorAnnouncement[]>("/dashboard/mentor-announcements");
}

// Upcoming contest hook
export function useUpcomingContest() {
  return useApiData<ContestInfo>("/dashboard/upcoming-contest");
}

// Contest history hook
export function useContestHistory() {
  return useApiData<ContestInfo[]>("/dashboard/contest-history");
}

// Leaderboard hook with scope support
export function useLeaderboard(scope: 'all-time' | 'weekly' = 'all-time') {
  return useApiData<LeaderboardData>(`/dashboard/leaderboard?scope=${scope}`);
}

// Primary CTA hook
export function usePrimaryCTA() {
  return useApiData<ContextAwareCTA>("/dashboard/primary-cta");
}

// Combined dashboard data hook for optimized loading
export function useDashboardData() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Get user from localStorage for Codeforces rating
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;

      // Parallel API calls for better performance using authenticated api instance
      const [
        statsResponse,
        weeklyProgressResponse,
        goalsResponse,
        activityResponse,
        notesResponse,
        announcementsResponse,
        contestResponse,
        historyResponse,
        leaderboardResponse,
        ctaResponse
      ] = await Promise.allSettled([
        api.get("/api/dashboard/stats"),
        api.get("/api/dashboard/weekly-progress").catch(() => ({ data: { days: [] } })),
        api.get("/api/dashboard/goals"),
        api.get("/api/dashboard/activity-feed"),
        api.get("/api/dashboard/mentor-notes"),
        api.get("/api/dashboard/mentor-announcements"),
        api.get("/api/dashboard/upcoming-contest"),
        api.get("/api/dashboard/contest-history"),
        api.get("/api/dashboard/leaderboard?scope=all-time"),
        api.get("/api/dashboard/primary-cta")
      ]);

      // Extract data from settled promises
      const statsData = statsResponse.status === 'fulfilled' ? statsResponse.value.data : null;
      const weeklyProgressData = weeklyProgressResponse.status === 'fulfilled' ? weeklyProgressResponse.value.data : { days: [] };
      const goalsData = goalsResponse.status === 'fulfilled' ? goalsResponse.value.data : [];
      const activityData = activityResponse.status === 'fulfilled' ? activityResponse.value.data : [];
      const notesData = notesResponse.status === 'fulfilled' ? notesResponse.value.data : [];
      const announcementsData = announcementsResponse.status === 'fulfilled' ? announcementsResponse.value.data : [];
      const contestData = contestResponse.status === 'fulfilled' ? contestResponse.value.data : null;
      const historyData = historyResponse.status === 'fulfilled' ? historyResponse.value.data : [];
      const leaderboardData = leaderboardResponse.status === 'fulfilled' ? leaderboardResponse.value.data : [];
      const ctaData = ctaResponse.status === 'fulfilled' ? ctaResponse.value.data : null;

      // Fetch Codeforces rating if username is available
      let codeforcesRating = null;
      if (user?.codeforcesUsername) {
        codeforcesRating = await dashboardUtils.fetchCodeforcesRating(user.codeforcesUsername);
      }

      // Get weekly solved count from weekly progress data
      const weeklySolvedCount = weeklyProgressData?.days?.reduce((total: number, day: any) => total + day.solvedCount, 0) || 0;

      // Calculate rank asynchronously
      const calculatedRank = await dashboardUtils.calculateRank(weeklySolvedCount);

      setData({
        stats: {
          ...statsData,
          rank: calculatedRank,
          rating: codeforcesRating || statsData?.rating || 0,
          streak: dashboardUtils.calculateStreak(weeklyProgressData?.days || []),
          problemsSolved: weeklySolvedCount
        },
        weeklyProgress: weeklyProgressData,
        goals: goalsData,
        activityFeed: activityData,
        mentorNotes: notesData,
        mentorAnnouncements: announcementsData,
        upcomingContest: contestData,
        contestHistory: historyData,
        leaderboard: leaderboardData,
        primaryCTA: ctaData
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  return { data, loading, error, refetch: fetchAllData };
}

// Dashboard utilities for calculations and transformations
export const dashboardUtils = {
  // Fetch Codeforces rating for a user
  fetchCodeforcesRating: async (username: string): Promise<number | null> => {
    try {
      const response = await fetch(`https://codeforces.com/api/user.info?handles=${username}`);
      const data = await response.json();
      
      if (data.status === 'OK' && data.result.length > 0) {
        return data.result[0].rating || null;
      }
      return null;
    } catch (error) {
      console.error('Error fetching Codeforces rating:', error);
      return null;
    }
  },

  // Calculate current streak based on weekly progress days
  calculateStreak: (days: { solvedCount: number }[]): number => {
    if (!days || days.length === 0) return 0;

    let streak = 0;
    
    // Check days from most recent to oldest
    for (let i = days.length - 1; i >= 0; i--) {
      if (days[i].solvedCount > 0) {
        streak++;
      } else {
        break; // Break on first day with no solves
      }
    }

    return streak;
  },

  // Calculate rank based on problems solved compared to other users
  calculateRank: async (userProblemsSolved: number): Promise<number> => {
    try {
      // In a real app, this would fetch from your backend API
      // For now, return a mock rank based on problems solved
      if (userProblemsSolved === 0) return 0;
      return Math.max(1, Math.floor(1000 / userProblemsSolved));
    } catch (error) {
      console.error('Error calculating rank:', error);
      return 0;
    }
  },

  // Generate context-aware CTA based on user activity
  generateContextAwareCTA: (stats: DashboardStats): ContextAwareCTA => {
    if (!stats.problemsSolved || stats.problemsSolved === 0) {
      return {
        type: 'start_daily',
        title: 'Solve Your First Problem',
        description: 'Start your journey by solving your first problem',
        actionUrl: '/practice',
        priority: 100
      };
    }

    if (stats.streak === 0) {
      return {
        type: 'start_daily',
        title: 'Keep Your Streak Alive',
        description: 'Solve a problem today to maintain your streak',
        actionUrl: '/practice',
        priority: 90
      };
    }

    // Default CTA
    return {
      type: 'start_daily',
      title: 'Start Practice',
      description: 'Begin a new practice session',
      actionUrl: '/practice',
      priority: 50
    };
  }
};
