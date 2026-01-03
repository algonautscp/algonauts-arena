"use client";

import { motion } from "framer-motion";
import { Play, Clock, Sword, Calendar, TrendingUp, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";

interface Contest {
  name: string;
  date: string;
  time: string;
  duration: string;
  type: string;
}

interface ActionSectionProps {
  lastPracticeTopic?: string;
  unsolvedProblems?: number;
  upcomingContest?: Contest;
  contestHistory?: Contest[];
}

export default function ActionSection({ 
  lastPracticeTopic = "Binary Search Trees",
  unsolvedProblems = 7,
  upcomingContest = {
    name: "Weekly Coding Challenge",
    date: "2024-01-07",
    time: "18:00 UTC",
    duration: "2 hours",
    type: "Algorithmic"
  },
  contestHistory = [
    { name: "New Year Contest", date: "2024-01-01", time: "16:00 UTC", duration: "3 hours", type: "Marathon" },
    { name: "Speed Round", date: "2023-12-28", time: "20:00 UTC", duration: "1 hour", type: "Speed" },
    { name: "Algorithm Masters", date: "2023-12-24", time: "18:00 UTC", duration: "2.5 hours", type: "Algorithmic" },
  ]
}: ActionSectionProps) {
  const getTimeUntilContest = () => {
    const contestDate = new Date(`${upcomingContest.date} ${upcomingContest.time}`);
    const now = new Date();
    const diff = contestDate.getTime() - now.getTime();
    
    if (diff <= 0) return "Contest started";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="mb-8"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Primary CTA Card */}
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sword className="w-5 h-5 text-primary" />
              Continue Your Journey
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Context-aware CTA */}
            <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-primary">Resume Practice</h3>
                <Play className="w-5 h-5 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Continue learning {lastPracticeTopic}
              </p>
              <Button className="w-full" size="lg">
                Continue Last Practice
              </Button>
            </div>

            {/* Alternative CTAs */}
            <div className="grid grid-cols-2 gap-3">
              {unsolvedProblems > 0 && (
                <Button variant="outline" className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Resume Unsolved ({unsolvedProblems})
                </Button>
              )}
              <Button variant="outline" className="flex items-center gap-2">
                <Sword className="w-4 h-4" />
                Start Today&apos;s Practice
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Contest */}
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-500" />
              Upcoming Contest
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-orange-900">{upcomingContest.name}</h3>
                <span className="px-2 py-1 bg-orange-200 text-orange-800 text-xs rounded-full font-medium">
                  {upcomingContest.type}
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-orange-700">
                  <Calendar className="w-4 h-4" />
                  <span>{upcomingContest.date}</span>
                </div>
                <div className="flex items-center gap-2 text-orange-700">
                  <Clock className="w-4 h-4" />
                  <span>{upcomingContest.time} • {upcomingContest.duration}</span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-orange-100 rounded-lg">
                <p className="text-2xl font-bold text-orange-900 text-center">
                  {getTimeUntilContest()}
                </p>
              </div>
            </div>
            
            <Button variant="outline" className="w-full">
              Set Reminder
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Contest History */}
      <Card className="mt-6 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            Recent Contests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {contestHistory.map((contest, index) => (
              <motion.div
                key={contest.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.01 }}
                className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">{contest.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {contest.date} • {contest.time} • {contest.duration}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full font-medium">
                    {contest.type}
                  </span>
                  <span className="text-sm text-green-600 font-medium">Completed</span>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.section>
  );
}
