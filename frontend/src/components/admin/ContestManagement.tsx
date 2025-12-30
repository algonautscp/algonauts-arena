"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Contest } from "@/types/contest";
import ContestAdminCard from "./ContestAdminCard";

export default function ContestManagement({
  canMutate,
}: {
  canMutate: boolean;
}) {
  const [contests, setContests] = useState<Contest[]>([]);

  useEffect(() => {
    api.get("/contests").then((res) => setContests(res.data));
  }, []);

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Manage Contests</h2>

      {contests.map((contest) => (
        <ContestAdminCard
          key={contest.id}
          contest={contest}
          canMutate={canMutate}
        />
      ))}
    </section>
  );
}
