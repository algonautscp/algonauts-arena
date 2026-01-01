import { PracticeLeaderboardEntry } from "@/types/practice";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

export default function PracticeLeaderboard({
  data,
}: {
  data: PracticeLeaderboardEntry[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Practice Leaderboard</CardTitle>
      </CardHeader>
      <CardContent>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b border-slate-700">
            <th>Rank</th>
            <th>Name</th>
            <th>Solves</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={row.user.id}
              className="border-b border-slate-800"
            >
              <td>{row.rank}</td>
              <td>{row.user.name}</td>
              <td>{row.solves}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </CardContent>
    </Card>
  );
}
