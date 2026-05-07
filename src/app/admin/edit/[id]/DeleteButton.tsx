"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteButton({ postId, redirectTo = "/admin" }: { postId: string; redirectTo?: string }) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    setDeleting(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/posts/${postId}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to delete post");
      }
      router.push(redirectTo);
      router.refresh();
    } catch (e: any) {
      setError(e.message ?? "Something went wrong");
      setDeleting(false);
      setShowConfirm(false);
    }
  }

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-red-400 font-heading font-bold">Are you sure?</span>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-lg hover:bg-red-600 transition-colors font-heading disabled:opacity-50"
        >
          {deleting ? "Deleting..." : "Yes, delete"}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          disabled={deleting}
          className="px-3 py-1.5 bg-surface-3 text-text-secondary text-xs font-bold rounded-lg hover:bg-surface-4 transition-colors font-heading disabled:opacity-50"
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
      className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg text-sm font-bold hover:bg-red-500/20 transition-colors font-heading border border-red-500/20"
    >
      Delete Post
    </button>
  );
}
