"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trophy, 
  Sword, 
  MessageSquare, 
  Award,
  Target,
  ChevronDown,
  ChevronUp,
  Clock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { ActivityItem } from "@/types/dashboard";

interface ActivityFeedProps {
  activities: ActivityItem[];
  loading?: boolean;
}

export default function ActivityFeed({ activities, loading = false }: ActivityFeedProps) {
  const [expanded, setExpanded] = useState(false);

  if (loading) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Activity Feed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="p-3 border rounded-lg bg-muted/30 animate-pulse">
                <div className="h-4 bg-muted rounded w-2/3 mb-2"></div>
                <div className="h-3 bg-muted rounded w-full mb-1"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (activities.length === 0) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Activity Feed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No recent activity</p>
            <p className="text-sm text-muted-foreground mt-2">Start practicing to see your activity here</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'practice_session':
        return <Sword className="w-4 h-4" />;
      case 'contest_participation':
        return <Trophy className="w-4 h-4" />;
      case 'mentor_note':
        return <MessageSquare className="w-4 h-4" />;
      case 'achievement':
        return <Award className="w-4 h-4" />;
      case 'goal_completed':
        return <Target className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'practice_session':
        return 'bg-blue-100 text-blue-600';
      case 'contest_participation':
        return 'bg-purple-100 text-purple-600';
      case 'mentor_note':
        return 'bg-green-100 text-green-600';
      case 'achievement':
        return 'bg-yellow-100 text-yellow-600';
      case 'goal_completed':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const displayedActivities = expanded ? activities : activities.slice(0, 5);

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          Activity Feed
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <AnimatePresence>
            {displayedActivities.map((activity, index) => (
              <motion.div
                key={`${activity.id || activity.type}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.01, x: 4 }}
                className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
              >
                {/* Activity Icon */}
                <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </div>

                {/* Activity Content */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm mb-1">{activity.title}</h4>
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                    {activity.description}
                  </p>
                  
                  {/* Activity Metadata */}
                  {activity.metadata && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {Object.entries(activity.metadata).slice(0, 2).map(([key, value]) => (
                        <span
                          key={key}
                          className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md"
                        >
                          {key}: {String(value)}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Timestamp */}
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{formatTimestamp(activity.timestamp)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Expand/Collapse Button */}
          {activities.length > 5 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center gap-2 text-xs mt-4"
              >
                {expanded ? (
                  <>
                    <ChevronUp className="w-3 h-3" />
                    Show Less ({activities.length - 5} hidden)
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3 h-3" />
                    Show More ({activities.length - 5} more)
                  </>
                )}
              </Button>
            </motion.div>
          )}

          {/* Activity Summary */}
          <div className="mt-6 p-4 bg-muted/30 rounded-lg">
            <h4 className="font-medium text-sm mb-3">Activity Summary</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { 
                  type: 'practice_session', 
                  label: 'Practice Sessions', 
                  count: activities.filter(a => a.type === 'practice_session').length,
                  icon: Sword
                },
                { 
                  type: 'contest_participation', 
                  label: 'Contests', 
                  count: activities.filter(a => a.type === 'contest_participation').length,
                  icon: Trophy
                },
                { 
                  type: 'achievement', 
                  label: 'Achievements', 
                  count: activities.filter(a => a.type === 'achievement').length,
                  icon: Award
                },
                { 
                  type: 'goal_completed', 
                  label: 'Goals Completed', 
                  count: activities.filter(a => a.type === 'goal_completed').length,
                  icon: Target
                }
              ].map((stat, index) => (
                <motion.div
                  key={stat.type}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="text-center"
                >
                  <div className={`p-2 rounded-lg ${getActivityColor(stat.type)} mx-auto w-fit mb-2`}>
                    <stat.icon className="w-4 h-4" />
                  </div>
                  <p className="text-lg font-semibold">{stat.count}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
