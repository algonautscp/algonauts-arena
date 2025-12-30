import { Contest } from "@/types/contest";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Link from "next/link";

function statusVariant(status: Contest["status"]) {
  if (status === "RUNNING") return "green";
  if (status === "UPCOMING") return "yellow";
  return "gray";
}

export default function ContestListCard({
  contests,
}: {
  contests: Contest[];
}) {
  return (
    <Card title="Contests">
      <div className="space-y-3">
        {contests.map((contest) => (
          <Link
            key={contest.id}
            href={`/contests/${contest.id}`}
            className="flex justify-between items-center p-2 rounded hover:bg-slate-800"
          >
            <span>{contest.title}</span>
            <Badge
              text={contest.status}
              variant={statusVariant(contest.status)}
            />
          </Link>
        ))}
      </div>
    </Card>
  );
}
