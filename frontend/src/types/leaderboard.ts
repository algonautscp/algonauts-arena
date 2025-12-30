export type LeaderboardEntry = {
  rank: number;
  solves: number;
  penalty?: number;
  user?: {
    id: string;
    name: string;
  };
  team?: {
    id: string;
    name: string;
  };
};
