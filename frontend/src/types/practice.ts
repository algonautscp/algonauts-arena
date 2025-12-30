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
