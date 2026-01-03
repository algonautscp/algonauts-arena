"use client";

import { motion } from "framer-motion";
import { BarChart3} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { WeeklyProgress } from "@/types/dashboard";

interface ProgressSectionProps {
  weeklyProgress?: WeeklyProgress;
}

export default function ProgressSection({ 
  weeklyProgress
}: ProgressSectionProps) {
  
  // Get max solved count for scaling
  const maxSolved = weeklyProgress?.days && weeklyProgress.days.length > 0 
    ? Math.max(...weeklyProgress.days.map((day) => day.solvedCount))
    : 1;
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-8"
    >
      <div className="grid grid-cols-1 gap-6">
        {/* Weekly Progress Chart - Full Width */}
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Weekly Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(maxSolved > 0) && weeklyProgress?.days?.length && weeklyProgress.days.length > 0 ? (
              <div className="space-y-4">
                {/* Chart */}
                <div className="relative h-48">
                  <div className="absolute inset-0 flex items-end justify-between gap-2">
                    {weeklyProgress?.days.map((day, index) => {
                      const height = maxSolved > 0 ? (day.solvedCount / maxSolved) * 100 : 0;
                      return (
                        <motion.div
                          key={day.date}
                          initial={{ height: 0 }}
                          animate={{ height: `${height}%` }}
                          transition={{ 
                            duration: 0.8, 
                            delay: index * 0.1,
                            ease: "easeOut"
                          }}
                          className={`flex-1 rounded-t-sm hover:opacity-90 transition-opacity relative group cursor-pointer ${
                            day.solvedCount === 0 
                              ? 'bg-gradient-to-t from-gray-600 to-gray-400' 
                              : day.solvedCount >= maxSolved 
                                ? 'bg-gradient-to-t from-emerald-500 via-emerald-400 to-emerald-300'
                                : day.solvedCount >= maxSolved * 0.7
                                  ? 'bg-gradient-to-t from-blue-500 via-blue-400 to-blue-300'
                                  : day.solvedCount >= maxSolved * 0.4
                                    ? 'bg-gradient-to-t from-purple-500 via-purple-400 to-purple-300'
                                    : 'bg-gradient-to-t from-pink-500 via-pink-400 to-pink-300'
                          }`}
                          style={{ minHeight: height > 0 ? '4px' : '2px' }}
                        >
                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 shadow-lg">
                            <div className="font-medium">{formatDate(day.date)}</div>
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${
                                day.solvedCount === 0 
                                  ? 'bg-gray-400' 
                                  : day.solvedCount >= maxSolved 
                                    ? 'bg-emerald-400'
                                    : day.solvedCount >= maxSolved * 0.7
                                      ? 'bg-blue-400'
                                      : day.solvedCount >= maxSolved * 0.4
                                        ? 'bg-purple-400'
                                        : 'bg-pink-400'
                              }`}></div>
                              <span>{day.solvedCount} problems solved</span>
                            </div>
                            {day.solvedCount > 0 && (
                              <div className="text-xs text-gray-400 mt-1">
                                {day.solvedCount >= maxSolved 
                                  ? 'Peak performance!' 
                                  : day.solvedCount >= maxSolved * 0.7
                                    ? 'Great progress!'
                                    : day.solvedCount >= maxSolved * 0.4
                                      ? 'Good effort!'
                                      : 'Keep going!'
                                }
                              </div>
                            )}
                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                
                  {/* Y-axis labels */}
                  <div className="absolute left-7 top-0 h-full flex flex-col justify-between text-xs text-muted-foreground -ml-8">
                    <span>{maxSolved}</span>
                    <span>{Math.floor(maxSolved / 2)}</span>
                    <span>0</span>
                  </div>
                </div>
                
                {/* X-axis labels */}
                <div className="flex justify-between gap-2 text-xs text-muted-foreground mb-4">
                  {weeklyProgress?.days?.map((day) => (
                    <div key={day?.date} className="flex-1 text-center">
                      {day?.day}
                    </div>
                  ))}
                </div>

                {/* Color Legend */}
                <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground border-t pt-3">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-gradient-to-t from-emerald-500 to-emerald-300"></div>
                    <span>Peak</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-gradient-to-t from-blue-500 to-blue-300"></div>
                    <span>Great</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-gradient-to-t from-purple-500 to-purple-300"></div>
                    <span>Good</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-gradient-to-t from-pink-500 to-pink-300"></div>
                    <span>Starting</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-gradient-to-t from-gray-600 to-gray-400"></div>
                    <span>None</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No weekly progress data available</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.section>
  );
}
            
