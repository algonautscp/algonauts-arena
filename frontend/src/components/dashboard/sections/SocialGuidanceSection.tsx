"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Bell, ChevronDown, ChevronUp, User, Trophy, Sword, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";

interface MentorNote {
  id: string;
  title: string;
  content: string;
  priority: "high" | "medium" | "low";
  timestamp: string;
}

interface MentorAnnouncement {
  id: string;
  title: string;
  content: string;
  type: "general" | "contest" | "workshop";
  timestamp: string;
}

interface ActivityItem {
  id: string;
  type: "achievement" | "practice" | "contest" | "social";
  title: string;
  description: string;
  timestamp: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface SocialGuidanceSectionProps {
  mentorNotes?: MentorNote[];
  mentorAnnouncements?: MentorAnnouncement[];
  activityFeed?: ActivityItem[];
}

export default function SocialGuidanceSection({ 
  mentorNotes = [
    {
      id: "1",
      title: "Focus on Dynamic Programming",
      content: "Your DP problem-solving rate has improved by 30% this week. Keep practicing the optimization techniques we discussed.",
      priority: "high",
      timestamp: "2 hours ago"
    },
    {
      id: "2", 
      title: "Contest Strategy Review",
      content: "Great performance in last weekend&apos;s contest! Let&apos;s work on time management for the next one.",
      priority: "medium",
      timestamp: "1 day ago"
    }
  ],
  mentorAnnouncements = [
    {
      id: "1",
      title: "New Algorithm Workshop",
      content: "Join us this Friday for an advanced graph algorithms workshop. Limited spots available.",
      type: "workshop",
      timestamp: "3 hours ago"
    },
    {
      id: "2",
      title: "Contest Registration Open",
      content: "Registration for the Monthly Marathon is now open. Early bird discount available.",
      type: "contest", 
      timestamp: "1 day ago"
    }
  ],
  activityFeed = [
    {
      id: "1",
      type: "achievement",
      title: "Achievement Unlocked",
      description: "Solved 10 problems in a row without hints",
      timestamp: "30 minutes ago",
      icon: Trophy
    },
    {
      id: "2",
      type: "practice",
      title: "Practice Session Completed",
      description: "Binary Search Trees - 8/10 problems solved",
      timestamp: "2 hours ago",
      icon: Sword
    },
    {
      id: "3",
      type: "contest",
      title: "Contest Rank Improved",
      description: "Moved from #156 to #142 in global rankings",
      timestamp: "1 day ago",
      icon: Trophy
    },
    {
      id: "4",
      type: "social",
      title: "New Follower",
      description: "Alice Chen started following you",
      timestamp: "2 days ago",
      icon: User
    },
    {
      id: "5",
      type: "practice",
      title: "Learning Path Updated",
      description: "Started Advanced Algorithms module",
      timestamp: "3 days ago",
      icon: BookOpen
    }
  ]
}: SocialGuidanceSectionProps) {
  const [activityFeedExpanded, setActivityFeedExpanded] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const getAnnouncementColor = (type: string) => {
    switch (type) {
      case "contest":
        return "bg-purple-50 border-purple-200";
      case "workshop":
        return "bg-green-50 border-green-200";
      default:
        return "bg-blue-50 border-blue-200";
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="mb-8"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mentor Notes */}
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              Mentor Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mentorNotes.map((note, index) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="p-3 rounded-lg border bg-card hover:bg-muted/50"
                >
                  <div className="flex items-start gap-3">
                    <div className={`px-2 py-1 text-xs rounded-full font-medium border ${getPriorityColor(note.priority)}`}>
                      {note.priority}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm mb-1">{note.title}</h4>
                      <p className="text-xs text-muted-foreground mb-2">{note.content}</p>
                      <p className="text-xs text-muted-foreground">{note.timestamp}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Mentor Announcements */}
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-orange-500" />
              Announcements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mentorAnnouncements.map((announcement, index) => (
                <motion.div
                  key={announcement.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className={`p-3 rounded-lg border ${getAnnouncementColor(announcement.type)}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm mb-1">{announcement.title}</h4>
                      <p className="text-xs text-muted-foreground mb-2">{announcement.content}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{announcement.timestamp}</span>
                        <span className="text-xs font-medium text-muted-foreground capitalize">
                          {announcement.type}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              Activity Feed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <AnimatePresence>
                {(activityFeedExpanded ? activityFeed : activityFeed.slice(0, 3)).map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50"
                  >
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <activity.icon className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm mb-1">{activity.title}</h4>
                      <p className="text-xs text-muted-foreground mb-1">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {activityFeed.length > 3 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActivityFeedExpanded(!activityFeedExpanded)}
                  className="w-full flex items-center gap-2 text-xs"
                >
                  {activityFeedExpanded ? (
                    <>
                      <ChevronUp className="w-3 h-3" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-3 h-3" />
                      Show More ({activityFeed.length - 3} more)
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.section>
  );
}
