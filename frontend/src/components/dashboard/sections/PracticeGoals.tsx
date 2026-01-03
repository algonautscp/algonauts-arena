"use client";

import { motion } from "framer-motion";
import { Target, TrendingUp, Calendar, Award, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { PracticeGoal } from "@/types/dashboard";

interface PracticeGoalsProps {
  goals: PracticeGoal[];
  loading?: boolean;
}

export default function PracticeGoals({ goals, loading = false }: PracticeGoalsProps) {
  if (loading) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Practice Goals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 border rounded-lg bg-muted/30 animate-pulse">
                <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-muted rounded w-full mb-2"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (goals.length === 0) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Practice Goals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No active goals</p>
            <p className="text-sm text-muted-foreground mt-2">Set up practice goals to track your progress</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getGoalIcon = (type: string) => {
    switch (type) {
      case 'problems_per_week':
        return <Target className="w-5 h-5" />;
      case 'minimum_difficulty':
        return <TrendingUp className="w-5 h-5" />;
      case 'streak_days':
        return <Calendar className="w-5 h-5" />;
      default:
        return <Award className="w-5 h-5" />;
    }
  };

  const getGoalColor = (progress: number) => {
    if (progress >= 100) return 'bg-green-500';
    if (progress >= 75) return 'bg-blue-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return 'text-green-600';
    if (progress >= 75) return 'text-blue-600';
    if (progress >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatGoalType = (type: string) => {
    switch (type) {
      case 'problems_per_week':
        return 'Problems Per Week';
      case 'minimum_difficulty':
        return 'Minimum Difficulty';
      case 'streak_days':
        return 'Streak Days';
      default:
        return 'Goal';
    }
  };

  const getDeadlineText = (deadline?: string) => {
    if (!deadline) return '';
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    return `${diffDays} days left`;
  };

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Practice Goals
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {goals.map((goal, index) => {
            const progress = Math.min((goal.current / goal.target) * 100, 100);
            const isCompleted = goal.completed || progress >= 100;
            
            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className={`p-4 border rounded-lg transition-all ${
                  isCompleted 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-card hover:bg-muted/50'
                }`}
              >
                {/* Goal Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      isCompleted ? 'bg-green-100 text-green-600' : 'bg-primary/10 text-primary'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        getGoalIcon(goal.type)
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold">{formatGoalType(goal.type)}</h3>
                      <p className="text-sm text-muted-foreground">
                        {goal.current} / {goal.target} {goal.unit}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {goal.deadline && (
                      <p className={`text-sm font-medium ${
                        new Date(goal.deadline) < new Date() ? 'text-red-600' : 'text-muted-foreground'
                      }`}>
                        {getDeadlineText(goal.deadline)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className={`font-medium ${getProgressColor(progress)}`}>
                      {Math.round(progress)}%
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ 
                        delay: index * 0.1 + 0.2, 
                        duration: 0.8, 
                        ease: "easeOut" 
                      }}
                      className={`h-full ${getGoalColor(progress)} rounded-full`}
                    />
                  </div>
                </div>

                {/* Goal Status */}
                {isCompleted && (
                  <div className="mt-3 flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Goal Completed!</span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
