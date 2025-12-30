"use client";

import { api } from "@/lib/api";
import { useState } from "react";
import PlatformHandleModal from "@/components/common/PlatformHandleModal";
import axios from "axios";

export default function PracticeSyncButton({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const sync = async () => {
    try {
      setLoading(true);
      await api.post("/practice/sync/codeforces");
      onSuccess();
      alert("Practice synced successfully");
    } catch (err: unknown) {

        if (axios.isAxiosError(err)) {
            const message = err.response?.data?.message
            if (message?.toLowerCase().includes("handle")) {
                setShowModal(true);
            } else {
                alert(message || "Sync failed");
            }
        }
        else {
            alert("Something went wrong");
        }

    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={sync}
        disabled={loading}
        className="px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-700"
      >
        {loading ? "Syncing..." : "Sync Codeforces"}
      </button>

      {showModal && (
        <PlatformHandleModal
          platform="codeforces"
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            sync(); // retry after handle saved
          }}
        />
      )}
    </>
  );
}
