"use client";

import { motion } from "framer-motion";
import { Trophy, Zap, Target, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";

interface OverviewStripProps {
  rank?: number;
  streak?: number;
  problemsSolved?: number;
  rating?: number;
  isCodeforcesRating?: boolean;
}

export default function OverviewStrip({ 
  rank,
  streak, 
  problemsSolved, 
  rating,
  isCodeforcesRating = false
}: OverviewStripProps) {
  const stats = [
    {
      icon: Trophy,
      label: "Rank",
      value: rank ? `#${rank.toLocaleString()}` : "N/A",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      icon: Zap,
      label: "Streak",
      value: streak !== undefined ? `${streak} day${streak === 1 ? '' : 's'}` : "0 days",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      icon: Target,
      label: "Solved",
      value: problemsSolved ? problemsSolved.toLocaleString() : "0",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: TrendingUp,
      label: isCodeforcesRating ? "CF Rating" : "Rating",
      value: rating ? rating.toLocaleString() : "N/A",
      color: isCodeforcesRating ? "text-red-600" : "text-blue-600",
      bgColor: isCodeforcesRating ? "bg-red-50" : "bg-blue-50",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.02 }}
        >
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground font-medium">
                    {stat.label}
                  </p>
                  <p className="text-xl font-bold text-foreground">
                    {stat.value}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
