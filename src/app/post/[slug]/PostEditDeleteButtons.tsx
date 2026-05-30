"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PostEditDeleteButtons({ postId, postSlug }: { postId: string; postSlug: string }) {
  const router = useRouter();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setDeleting(true);
    setError("");
    try {
      const res = await fetch(`/api/posts/${postId}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Failed to delete" }));
        throw new Error(data.error ?? "Failed to delete post");
      }
      router.refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (showDeleteConfirm) {
    return (
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-red-400 font-heading font-bold">Delete?</span>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded hover:bg-red-600 transition-colors font-heading disabled:opacity-50"
        >
          {deleting ? "..." : "Yes"}
        </button>
        <button
          onClick={() => { setShowDeleteConfirm(false); setError(""); }}
          disabled={deleting}
          className="px-2 py-1 bg-surface-3 text-text-secondary text-xs font-bold rounded hover:bg-surface-4 transition-colors font-heading"
        >
          No
        </button>
        {error && <span className="text-xs text-red-400">{error}</span>}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-0.5">
      <button
        onClick={() => router.push(`/post/${postSlug}/edit`)}
        className="p-1.5 text-text-muted hover:text-primary transition-colors rounded-md hover:bg-surface-3"
        title="Edit post"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      </button>
      <button
        onClick={() => setShowDeleteConfirm(true)}
        className="p-1.5 text-text-muted hover:text-red-400 transition-colors rounded-md hover:bg-surface-3"
        title="Delete post"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
}
