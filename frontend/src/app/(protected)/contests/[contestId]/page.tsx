"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { ContestDetail } from "@/types/contest-detail";
import ContestSubmission from "@/components/contests/ContestSubmission";
import ContestLeaderboard from "@/components/contests/ContestLeaderboard";

export default function ContestDetailPage({
  params,
}: {
  params: { contestId: string };
}) {
  const [contest, setContest] = useState<ContestDetail | null>(null);

  useEffect(() => {
    api
      .get(`/contests/${params.contestId}`)
      .then((res) => setContest(res.data));
  }, [params.contestId]);

  if (!contest) return <div className="p-6">Loading...</div>;

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">{contest.title}</h1>

      <p>Status: {contest.status}</p>

      <section>
        <h2 className="text-xl font-semibold mb-2">Problems</h2>
        <ul className="list-disc ml-6">
          {contest.problems.map((p) => (
            <li key={p.id}>
              <a
                href={p.problemUrl}
                target="_blank"
                className="text-blue-400 underline"
              >
                {p.problemUrl}
              </a>
            </li>
          ))}
        </ul>
      </section>

      {contest.status === "RUNNING" && (
        <ContestSubmission contestId={contest.id} />
      )}

      <ContestLeaderboard contestId={contest.id} />
    </main>
  );
}
