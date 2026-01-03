"use client";

import { motion } from "framer-motion";
import { Play, Sword, Target, Trophy, Clock, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { ContextAwareCTA } from "@/types/dashboard";

interface ContextAwareCTAProps {
  cta: ContextAwareCTA | null;
  loading?: boolean;
}

export default function ContextAwareCTAComponent({ cta, loading = false }: ContextAwareCTAProps) {
  if (loading) {
    return (
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-muted rounded w-2/3 mb-2"></div>
            <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
            <div className="h-10 bg-muted rounded w-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!cta) {
    return (
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <div className="text-center py-8">
            <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No recommended action</p>
            <p className="text-sm text-muted-foreground mt-2">Check back later for personalized recommendations</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getCTAIcon = (type: string) => {
    switch (type) {
      case 'continue_practice':
        return <Play className="w-5 h-5" />;
      case 'start_daily':
        return <Sword className="w-5 h-5" />;
      case 'resume_unsolved':
        return <Target className="w-5 h-5" />;
      case 'join_contest':
        return <Trophy className="w-5 h-5" />;
      default:
        return <Play className="w-5 h-5" />;
    }
  };

  const getCTAColor = (type: string) => {
    switch (type) {
      case 'continue_practice':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'start_daily':
        return 'bg-green-500 hover:bg-green-600';
      case 'resume_unsolved':
        return 'bg-orange-500 hover:bg-orange-600';
      case 'join_contest':
        return 'bg-purple-500 hover:bg-purple-600';
      default:
        return 'bg-primary hover:bg-primary/90';
    }
  };

  const getCTABgColor = (type: string) => {
    switch (type) {
      case 'continue_practice':
        return 'bg-blue-50 border-blue-200';
      case 'start_daily':
        return 'bg-green-50 border-green-200';
      case 'resume_unsolved':
        return 'bg-orange-50 border-orange-200';
      case 'join_contest':
        return 'bg-purple-50 border-purple-200';
      default:
        return 'bg-primary/10 border-primary/20';
    }
  };

  const getCTATextColor = (type: string) => {
    switch (type) {
      case 'continue_practice':
        return 'text-blue-600';
      case 'start_daily':
        return 'text-green-600';
      case 'resume_unsolved':
        return 'text-orange-600';
      case 'join_contest':
        return 'text-purple-600';
      default:
        return 'text-primary';
    }
  };

  const handleCTAClick = () => {
    // Navigate to the action URL
    window.location.href = cta.actionUrl;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`p-6 rounded-lg border-2 ${getCTABgColor(cta.type)}`}
          >
            {/* CTA Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-lg ${getCTATextColor(cta.type)}`}>
                  {getCTAIcon(cta.type)}
                </div>
                <div>
                  <h3 className={`text-xl font-bold ${getCTATextColor(cta.type)}`}>
                    {cta.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {cta.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Priority</p>
                  <p className="text-sm font-medium">{cta.priority}</p>
                </div>
              </div>
            </div>

            {/* CTA Action Button */}
            <Button
              onClick={handleCTAClick}
              className={`w-full ${getCTAColor(cta.type)} text-white font-medium py-3`}
              size="lg"
            >
              {cta.title}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            {/* CTA Context */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Recommended based on your recent activity</span>
                </div>
                <span className="text-xs">
                  Type: {cta.type.replace('_', ' ')}
                </span>
              </div>
            </div>
          </motion.div>

          {/* CTA Explanation */}
          <div className="mt-4 p-4 bg-muted/30 rounded-lg">
            <h4 className="font-medium text-sm mb-2">Why this action?</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              This recommendation is based on your practice history, current goals, and recent activity. 
              Our context-aware system analyzes your progress patterns to suggest the most impactful next step.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
