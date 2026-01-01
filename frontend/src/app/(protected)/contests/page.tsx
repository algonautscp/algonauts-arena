"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Contest } from "@/types/contest";
import { Card } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Link from "next/link";

function statusVariant(status: Contest["status"]) {
  if (status === "RUNNING") return "green";
  if (status === "UPCOMING") return "yellow";
  return "gray";
}

export default function ContestsPage() {
  const [contests, setContests] = useState<Contest[]>([]);

  useEffect(() => {
    api.get("/contests").then((res) => setContests(res.data));
  }, []);

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Contests</h1>

      <div className="grid gap-4">
        {contests.map((contest) => (
          <Card key={contest.id} title={contest.title}>
            <div className="flex justify-between items-center">
              <Badge
                text={contest.status}
                variant={statusVariant(contest.status)}
              />

              <Link
                href={`/contests/${contest.id}`}
                className="text-blue-400 hover:underline"
              >
                View
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </main>
  );
}
