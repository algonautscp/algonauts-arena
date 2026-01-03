"use client";

import { motion } from "framer-motion";
import { AlertTriangle, TrendingDown, Target, BarChart3, Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { WeakArea } from "@/types/dashboard";

interface WeakAreasDetectionProps {
  weakAreas: WeakArea[];
  loading?: boolean;
}

export default function WeakAreasDetection({ weakAreas, loading = false }: WeakAreasDetectionProps) {
  if (loading) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Weak Areas Detection
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

  if (weakAreas.length === 0) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-green-500" />
            Weak Areas Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Target className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <p className="text-green-600 font-medium">No weak areas detected</p>
            <p className="text-sm text-muted-foreground mt-2">Great job! Keep up the consistent practice</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'medium':
        return <TrendingDown className="w-4 h-4 text-yellow-500" />;
      default:
        return <BarChart3 className="w-4 h-4 text-blue-500" />;
    }
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

  const getFailureRateColor = (rate: number) => {
    if (rate >= 70) return 'text-red-600';
    if (rate >= 50) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getRecommendation = (area: WeakArea) => {
    if (area.failureRate >= 70) {
      return "Focus on fundamentals. Try easier problems first.";
    } else if (area.failureRate >= 50) {
      return "Review core concepts and practice similar problems.";
    } else {
      return "Practice more problems to build confidence.";
    }
  };

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          Weak Areas Detection
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Detection Summary */}
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-5 h-5 text-orange-600" />
              <h3 className="font-semibold text-orange-900">Rule-Based Analysis</h3>
            </div>
            <p className="text-sm text-orange-700">
              Areas detected based on failure rate and difficulty patterns. 
              Focus on high-priority topics first.
            </p>
          </div>

          {/* Weak Areas List */}
          {weakAreas.map((area, index) => (
            <motion.div
              key={area.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, x: 4 }}
              className={`p-4 border rounded-lg transition-all ${
                area.priority === 'high' 
                  ? 'bg-red-50 border-red-200' 
                  : area.priority === 'medium'
                  ? 'bg-yellow-50 border-yellow-200'
                  : 'bg-blue-50 border-blue-200'
              }`}
            >
              {/* Area Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  {getPriorityIcon(area.priority)}
                  <div>
                    <h3 className="font-semibold">{area.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium border ${getPriorityColor(area.priority)}`}>
                        {area.priority} priority
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full font-medium border ${getDifficultyColor(area.difficulty)}`}>
                        {area.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-1">
                    <Target className="w-3 h-3" />
                    <span>Unsolved</span>
                  </div>
                  <p className="text-lg font-semibold text-red-600">{area.unsolvedProblems}</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-1">
                    <BarChart3 className="w-3 h-3" />
                    <span>Failure Rate</span>
                  </div>
                  <p className={`text-lg font-semibold ${getFailureRateColor(area.failureRate)}`}>
                    {Math.round(area.failureRate * 100)}%
                  </p>
                </div>
              </div>

              {/* Failure Rate Bar */}
              <div className="space-y-2 mb-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Failure Rate</span>
                  <span className={`font-medium ${getFailureRateColor(area.failureRate)}`}>
                    {Math.round(area.failureRate * 100)}%
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${area.failureRate * 100}%` }}
                    transition={{ 
                      delay: index * 0.1 + 0.2, 
                      duration: 0.8, 
                      ease: "easeOut" 
                    }}
                    className={`h-full ${
                      area.failureRate >= 0.7 ? 'bg-red-500' :
                      area.failureRate >= 0.5 ? 'bg-yellow-500' : 'bg-orange-500'
                    } rounded-full`}
                  />
                </div>
              </div>

              {/* Recommendation */}
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-blue-900 mb-1">Recommendation</p>
                    <p className="text-xs text-blue-700">{getRecommendation(area)}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Detection Rules */}
          <div className="mt-6 p-4 bg-muted/30 rounded-lg">
            <h4 className="font-medium text-sm mb-2">Detection Rules</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• High Priority: Failure rate ≥ 70%</li>
              <li>• Medium Priority: Failure rate 50-69%</li>
              <li>• Low Priority: Failure rate 20-49%</li>
              <li>• Only areas with ≥20% failure rate are shown</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
