export type ContestStatus = "UPCOMING" | "RUNNING" | "FINISHED";

export type Contest = {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  status: ContestStatus;
  isTeamBased: boolean;
};
