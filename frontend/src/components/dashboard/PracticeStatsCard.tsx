import { PracticeStats } from "@/types/practice";
import Card from "@/components/ui/Card";

export default function PracticeStatsCard({
  stats,
}: {
  stats: PracticeStats;
}) {
  return (
    <Card title="Practice Stats">
      <div className="space-y-2">
        <p>Total Solved: {stats.total}</p>
        <p className="text-green-400">
          EASY: {stats.breakdown.EASY}
        </p>
        <p className="text-yellow-400">
          MEDIUM: {stats.breakdown.MEDIUM}
        </p>
        <p className="text-red-400">
          HARD: {stats.breakdown.HARD}
        </p>
      </div>
    </Card>
  );
}
