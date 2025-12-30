"use client";

import { Contest } from "@/types/contest";
import { useState } from "react";
import { api } from "@/lib/api";
import axios from "axios";

export default function ContestAdminCard({
  contest,
  canMutate,
}: {
  contest: Contest;
  canMutate: boolean;
}) {
  const [problemUrl, setProblemUrl] = useState("");

  const addProblem = async () => {
    if (!problemUrl) return;

    try {
      await api.post(`/contests/${contest.id}/problems`, {
        problemUrl,
      });
      alert("Problem added");
      setProblemUrl("");
    } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
            alert(err.response?.data?.message || "Login failed"); }
        else {
            alert("Something went wrong");
        }
    }
  };

  return (
    <div className="bg-slate-900 p-4 rounded space-y-3">
      <h3 className="font-semibold">{contest.title}</h3>

      <p>Status: {contest.status}</p>

      {canMutate ? (
        <>
          <input
            placeholder="Problem URL"
            value={problemUrl}
            onChange={(e) => setProblemUrl(e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 rounded"
          />

          <button
            onClick={addProblem}
            className="px-3 py-1 bg-blue-600 rounded"
          >
            Add Problem
          </button>
        </>
      ) : (
        <p className="text-slate-400 text-sm">
          Read-only (Mentor access)
        </p>
      )}
    </div>
  );
}
