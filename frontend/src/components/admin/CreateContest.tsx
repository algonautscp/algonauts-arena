"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import axios from "axios";

export default function CreateContest() {
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isTeamBased, setIsTeamBased] = useState(false);

  const submit = async () => {
    if (!title || !startTime || !endTime) {
      return alert("All fields required");
    }
    try {
      await api.post("/contests", {
        title,
        startTime,
        endTime,
        isTeamBased,
      });

      alert("Contest created");
      setTitle("");
    } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
            alert(err.response?.data?.message || "Login failed"); }
        else {
            alert("Something went wrong");
        }
    }
  };

  return (
    <section className="bg-slate-900 p-4 rounded space-y-3">
      <h2 className="text-xl font-semibold">Create Contest</h2>

      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full px-3 py-2 bg-slate-800 rounded"
      />

      <input
        type="datetime-local"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
        className="w-full px-3 py-2 bg-slate-800 rounded"
      />

      <input
        type="datetime-local"
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
        className="w-full px-3 py-2 bg-slate-800 rounded"
      />

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={isTeamBased}
          onChange={(e) => setIsTeamBased(e.target.checked)}
        />
        Team-based contest
      </label>

      <button
        onClick={submit}
        className="px-4 py-2 bg-emerald-600 rounded"
      >
        Create
      </button>
    </section>
  );
}
