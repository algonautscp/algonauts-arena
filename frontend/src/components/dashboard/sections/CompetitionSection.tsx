"use client";

import { motion } from "framer-motion";
import { Trophy, Medal, Crown, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { useLeaderboardData } from "@/hooks/useLeaderboardData";
import { useState } from "react";

export default function CompetitionSection() {
  const { leaderboard, loading, error, scope, fetchLeaderboard} = useLeaderboardData();

  const [scope2, setScope] = useState<string>(scope);

  const handleScopeChange = (newScope: string) => {
    setScope(newScope);
    fetchLeaderboard(newScope);
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Medal className="w-5 h-5 text-orange-600" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case 2:
        return "bg-gray-100 text-gray-800 border-gray-200";
      case 3:
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const displayEntries = leaderboard?.top || [];
  const currentUserEntry = leaderboard?.me;

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
          Leaderboard ({scope === 'all-time' ? 'All-time' : 'Weekly'})
        </CardTitle>
          <div className="flex gap-1">
            <Button
              variant={scope2 === 'weekly' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleScopeChange('all-time')}
              disabled={loading}
            >
              All-time
            </Button>
            <Button
              variant={scope2 === 'all-time' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleScopeChange('weekly')}
              disabled={loading}
            >
              Weekly
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">
            <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
            <p>Loading...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-destructive">
            <p>Error loading leaderboard</p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayEntries.map((entry, index) => (
              <motion.div
                key={entry.userId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${getRankBadgeColor(index + 1)}`}>
                    {getRankIcon(index + 1)}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{entry.name}</p>
                    <p className="text-sm text-muted-foreground">{entry.solvedCount} solved</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">{entry.solvedCount}</p>
                  <p className="text-xs text-muted-foreground">
                    {entry.weeklyDelta > 0 && `+${entry.weeklyDelta} this week`}
                  </p>
                </div>
              </motion.div>
            ))}

            {currentUserEntry && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center justify-between p-3 rounded-lg bg-primary/10 border border-primary/20"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary text-primary-foreground">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">You</p>
                    <p className="text-sm text-muted-foreground">Rank #{currentUserEntry.rank}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">{currentUserEntry.solvedCount}</p>
                  <p className="text-xs text-muted-foreground">
                    {currentUserEntry.weeklyDelta > 0 && `+${currentUserEntry.weeklyDelta} this week`}
                  </p>
                </div>
              </motion.div>
            )}

            {(!displayEntries || displayEntries.length === 0) && (
              <div className="text-center py-8 text-muted-foreground">
                <Trophy className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No data available</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
