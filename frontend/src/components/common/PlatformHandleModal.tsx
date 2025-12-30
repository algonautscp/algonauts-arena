"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { CodingPlatform, PLATFORM_LABELS } from "@/lib/platform";
import axios from "axios";

export default function PlatformHandleModal({
  platform,
  onSuccess,
  onClose,
}: {
  platform: CodingPlatform;
  onSuccess: () => void;
  onClose: () => void;
}) {
  const [handle, setHandle] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandle = async () => {
    if (!handle.trim()) return alert("Handle is required");

    try {
      setLoading(true);
      await api.post("/users/platform-handle", {
        platform,
        handle,
      });
      onSuccess();
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
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <div className="bg-slate-900 p-6 rounded w-full max-w-sm space-y-4">
        <h2 className="text-xl font-bold">
          Add {PLATFORM_LABELS[platform]} Handle
        </h2>

        <input
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          placeholder={`${PLATFORM_LABELS[platform]} username`}
          className="w-full px-3 py-2 rounded bg-slate-800 border border-slate-700"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-700 rounded"
          >
            Cancel
          </button>
          <button
            onClick={submitHandle}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 rounded"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
