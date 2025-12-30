export type ContestProblem = {
  id: string;
  problemUrl: string;
};

export type ContestDetail = {
  id: string;
  title: string;
  description?: string;
  status: "UPCOMING" | "RUNNING" | "FINISHED";
  isTeamBased: boolean;
  problems: ContestProblem[];
};
