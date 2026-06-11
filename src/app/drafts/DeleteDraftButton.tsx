"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteDraftButton({ draftId }: { draftId: string }) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    setDeleting(true);
    setError("");
    try {
      const res = await fetch(`/api/drafts/${draftId}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to delete draft");
      }
      router.refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setDeleting(false);
      setShowConfirm(false);
    }
  }

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-red-400 font-heading font-bold">Delete?</span>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="px-2.5 py-2 bg-red-500 text-white text-xs font-bold rounded-lg hover:bg-red-600 transition-colors font-heading disabled:opacity-50"
        >
          {deleting ? "Deleting..." : "Yes"}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          disabled={deleting}
          className="px-2.5 py-2 bg-surface-3 text-text-secondary text-xs font-bold rounded-lg hover:bg-surface-4 transition-colors font-heading disabled:opacity-50"
        >
          Cancel
        </button>
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="shrink-0 p-1.5 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
      title="Delete draft"
      aria-label="Delete draft"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    </button>
  );
}
