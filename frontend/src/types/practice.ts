export type PracticeStats = {
  total: number;
  breakdown: {
    EASY: number;
    MEDIUM: number;
    HARD: number;
  };
};

export type PracticeLeaderboardEntry = {
  rank: number;
  user: {
    id: string;
    name: string;
    email: string;
  };
  solves: number;
};

// Practice Questions & Attempts Types
export interface PracticeTopic {
  id: string;
  name: string;
  description: string | null;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  _count: {
    questions: number;
  };
}

export interface PracticeQuestion {
  id: string;
  topicId: string;
  name: string;
  url: string;
  platform: string | null;
  difficulty: string | null;
  suggestedBy: string | null;
  approvedBy: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  attempts?: PracticeAttempt[];
}

export interface PracticeAttempt {
  id: string;
  userId: string;
  questionId: string;
  status: 'SOLVED' | 'WA' | 'TLE' | 'RTE';
  createdAt: string;
  updatedAt: string;
}

export interface TopicWithQuestions extends PracticeTopic {
  questions: PracticeQuestion[];
}

export interface UserSolution {
  id: string;
  userId: string;
  platform: string;
  problemName: string;
  problemUrl: string;
  difficulty: string | null;
  source: string;
  solvedAt: string;
}

export interface SuggestQuestionRequest {
  topicId: string;
  name: string;
  url: string;
  platform?: string;
  difficulty?: string;
}

export interface UpdateAttemptRequest {
  questionId: string;
  status: 'SOLVED' | 'WA' | 'TLE' | 'RTE';
}

export interface AddSolutionRequest {
  problemName: string;
  problemUrl: string;
  solutionUrl: string;
  platform?: string;
}

export interface UpdateSolutionRequest {
  problemUrl?: string;
  platform?: string;
}

// Admin Question Management Types
export interface AdminQuestion {
  id: string;
  topicId: string;
  name: string;
  url: string;
  platform: string | null;
  difficulty: string | null;
  suggestedBy: string | null;
  approvedBy: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
  topic: PracticeTopic;
  suggested?: { name: string; email: string } | null;
  approved?: { name: string; email: string } | null;
  _count: { attempts: number };
}

export interface CreateQuestionRequest {
  topicId: string;
  name: string;
  url: string;
  platform?: string;
  difficulty?: string;
}

export interface UpdateQuestionRequest {
  name?: string;
  url?: string;
  platform?: string;
  difficulty?: string;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
}
