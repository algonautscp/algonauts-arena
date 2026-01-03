// Dashboard Types
export interface PracticeSession {
  id: string;
  date: string;
  duration: number; // in minutes
  problemsSolved: number;
  problemsAttempted: number;
  averageDifficulty: 'easy' | 'medium' | 'hard';
  topics: string[];
  successRate: number;
}

export interface WeakArea {
  name: string;
  unsolvedProblems: number;
  failureRate: number;
  difficulty: 'easy' | 'medium' | 'hard';
  priority: 'high' | 'medium' | 'low';
}

export interface PracticeGoal {
  id: string;
  type: 'problems_per_week' | 'minimum_difficulty' | 'streak_days';
  target: number;
  current: number;
  unit: string;
  deadline?: string;
  completed: boolean;
}

export interface ActivityItem {
  id: string;
  type: 'practice_session' | 'contest_participation' | 'mentor_note' | 'achievement' | 'goal_completed';
  title: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface MentorNote {
  id: string;
  title: string;
  content: string;
  priority: 'high' | 'medium' | 'low';
  timestamp: string;
  mentorId: string;
  mentorName: string;
  visibleTo: 'user' | 'mentor' | 'admin';
}

export interface MentorAnnouncement {
  id: string;
  title: string;
  content: string;
  type: 'general' | 'contest' | 'workshop';
  timestamp: string;
  mentorId: string;
  mentorName: string;
}

export interface DashboardStats {
  rank: number;
  streak: number;
  problemsSolved: number;
  rating: number;
  weeklyProgress: number[];
}

export interface ContestInfo {
  id: string;
  name: string;
  date: string;
  time: string;
  duration: string;
  type: string;
  status: 'upcoming' | 'ongoing' | 'completed';
}

export interface LeaderboardEntry {
  userId: string;
  name: string;
  solvedCount: number;
  weeklyDelta: number;
  streak: number;
}

export interface LeaderboardData {
  top: LeaderboardEntry[];
  me?: {
    rank: number;
    solvedCount: number;
    weeklyDelta: number;
    streak: number;
  };
}

export interface ContextAwareCTA {
  type: 'continue_practice' | 'start_daily' | 'resume_unsolved' | 'join_contest';
  title: string;
  description: string;
  actionUrl: string;
  priority: number; // Higher number = higher priority
}

export interface WeeklyProgress {
  days: {
    date: string;
    day: string;
    solvedCount: number;
  }[];
}

export interface DashboardData {
  stats: DashboardStats;
  weeklyProgress: WeeklyProgress;
  goals: PracticeGoal[];
  activityFeed: ActivityItem[];
  mentorNotes: MentorNote[];
  mentorAnnouncements: MentorAnnouncement[];
  upcomingContest: ContestInfo | null;
  contestHistory: ContestInfo[];
  leaderboard: LeaderboardData;
  primaryCTA: ContextAwareCTA;
}
