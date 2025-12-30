"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import axios from "axios";

export default function ContestSubmission({
  contestId,
}: {
  contestId: string;
}) {
  const [problemUrl, setProblemUrl] = useState("");
  const [status, setStatus] = useState("ACCEPTED");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!problemUrl) return alert("Problem URL required");

    try {
      setLoading(true);
      await api.post(`/contests/${contestId}/submit`, {
        problemUrl,
        status,
      });
      alert("Submission recorded");
      setProblemUrl("");
    } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
            alert(err.response?.data?.message || "Login failed"); }
        else {
            alert("Something went wrong");
        }

    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold">Submit Solution</h2>

      <input
        value={problemUrl}
        onChange={(e) => setProblemUrl(e.target.value)}
        placeholder="Problem URL"
        className="w-full px-3 py-2 rounded bg-slate-800 border border-slate-700"
      />

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="px-3 py-2 rounded bg-slate-800 border border-slate-700"
      >
        <option value="ACCEPTED">ACCEPTED</option>
        <option value="WRONG_ANSWER">WRONG_ANSWER</option>
      </select>

      <button
        onClick={submit}
        disabled={loading}
        className="px-4 py-2 bg-green-600 rounded hover:bg-green-700"
      >
        {loading ? "Submitting..." : "Submit"}
      </button>
    </section>
  );
}
