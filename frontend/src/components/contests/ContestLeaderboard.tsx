"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { LeaderboardEntry } from "@/types/leaderboard";

export default function ContestLeaderboard({
  contestId,
}: {
  contestId: string;
}) {
  const [data, setData] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    api
      .get(`/contests/${contestId}/leaderboard`)
      .then((res) => setData(res.data));
  }, [contestId]);

  if (!data.length) return null;

  const isTeamBased = !!data[0].team;

  return (
    <section>
      <h2 className="text-xl font-semibold mb-2">
        Leaderboard
      </h2>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-700">
            <th>Rank</th>
            <th>{isTeamBased ? "Team" : "User"}</th>
            <th>Solves</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={row.rank}
              className="border-b border-slate-800"
            >
              <td>{row.rank}</td>
              <td>
                {isTeamBased
                  ? row.team?.name
                  : row.user?.name}
              </td>
              <td>{row.solves}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
