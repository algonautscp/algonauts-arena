"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, Target, TrendingUp, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { PracticeSession } from "@/types/dashboard";

interface PracticeTimelineProps {
  sessions: PracticeSession[];
  loading?: boolean;
}

export default function PracticeTimeline({ sessions, loading = false }: PracticeTimelineProps) {
  if (loading) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Practice Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 border rounded-lg bg-muted/30 animate-pulse">
                <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (sessions.length === 0) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Practice Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No practice sessions yet</p>
            <p className="text-sm text-muted-foreground mt-2">Start your first practice session to see your timeline</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 80) return 'text-green-600';
    if (rate >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Practice Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sessions.slice(0, 10).map((session, index) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, x: 4 }}
              className="p-4 border rounded-lg bg-card hover:bg-muted/50 transition-colors"
            >
              {/* Session Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(session.date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{formatDuration(session.duration)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs rounded-full font-medium border ${getDifficultyColor(session.averageDifficulty)}`}>
                    {session.averageDifficulty}
                  </span>
                  <span className={`text-sm font-medium ${getSuccessRateColor(session.successRate)}`}>
                    {session.successRate}%
                  </span>
                </div>
              </div>

              {/* Session Stats */}
              <div className="grid grid-cols-3 gap-4 mb-3">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-1">
                    <Target className="w-3 h-3" />
                    <span>Solved</span>
                  </div>
                  <p className="text-lg font-semibold text-green-600">{session.problemsSolved}</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-1">
                    <BarChart3 className="w-3 h-3" />
                    <span>Attempted</span>
                  </div>
                  <p className="text-lg font-semibold text-blue-600">{session.problemsAttempted}</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>Success</span>
                  </div>
                  <p className="text-lg font-semibold">{session.successRate}%</p>
                </div>
              </div>

              {/* Topics */}
              <div className="flex flex-wrap gap-2">
                {(session.topics ?? []).slice(0, 3).map((topic, topicIndex) => (
                  <span
                    key={topicIndex}
                    className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md"
                  >
                    {topic}
                  </span>
                ))}

                {(session.topics?.length ?? 0) > 3 && (
                  <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md">
                    +{session.topics.length - 3} more
                  </span>
                )}
              </div>
            </motion.div>
          ))}

          {sessions.length > 10 && (
            <div className="text-center pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Showing 10 of {sessions.length} sessions
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
