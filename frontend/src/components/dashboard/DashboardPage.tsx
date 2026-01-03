"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";
import OverviewStrip from "@/components/dashboard/sections/OverviewStrip";
import ProgressSection from "@/components/dashboard/sections/ProgressSection";
import CompetitionSection from "@/components/dashboard/sections/CompetitionSection";
import PracticeGoals from "@/components/dashboard/sections/PracticeGoals";
import ActivityFeed from "@/components/dashboard/sections/ActivityFeed";
import MentorNotes from "@/components/dashboard/sections/MentorNotes";
import ContextAwareCTA from "@/components/dashboard/sections/ContextAwareCTA";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { data, loading, error } = useDashboardData();
  const { user, updateProfile } = useAuth();
  const [codeforcesUsername, setCodeforcesUsername] = useState(user?.codeforcesUsername || "");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleAddCodeforcesUsername = async () => {
    if (!codeforcesUsername.trim()) return;
    
    setIsUpdating(true);
    try {
      await updateProfile({ codeforcesUsername: codeforcesUsername.trim() });
      // Refresh dashboard data to fetch Codeforces rating
      window.location.reload();
    } catch (error) {
      console.error('Failed to update Codeforces username:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Dashboard</h2>
            <p className="text-muted-foreground">{error}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="p-6 space-y-6"
      >
        {/* Overview Strip */}
        <OverviewStrip 
          rank={data?.stats.rank}
          streak={data?.stats.streak}
          problemsSolved={data?.stats.problemsSolved}
          rating={data?.stats.rating}
          isCodeforcesRating={!!localStorage.getItem("user") && JSON.parse(localStorage.getItem("user") || "{}")?.codeforcesUsername}
        />

        {/* Codeforces Username Setup */}
        {!user?.codeforcesUsername && (
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Add Codeforces Username</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Enter your Codeforces username"
                  value={codeforcesUsername}
                  onChange={(e) => setCodeforcesUsername(e.target.value)}
                  className="flex-1 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button 
                  onClick={handleAddCodeforcesUsername}
                  disabled={isUpdating || !codeforcesUsername.trim()}
                >
                  {isUpdating ? 'Adding...' : 'Add'}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Add your Codeforces username to see your real rating on the dashboard
              </p>
            </CardContent>
          </Card>
        )}

        {/* Context-Aware CTA */}
        <ContextAwareCTA cta={data?.primaryCTA || null} loading={loading} />

        {/* Progress Section */}
        <ProgressSection 
          weeklyProgress={data?.weeklyProgress}
        />

        {/* Competition Section */}
        <CompetitionSection />

        {/* Practice Goals */}
        <PracticeGoals goals={data?.goals || []} loading={loading} />

        {/* Activity Feed */}
        <ActivityFeed activities={data?.activityFeed || []} loading={loading} />

        {/* Mentor Notes */}
        <MentorNotes notes={data?.mentorNotes || []} loading={loading} />
      </motion.div>
    </DashboardLayout>
  );
}
