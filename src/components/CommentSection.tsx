"use client";

import { useState, useEffect } from "react";
import { fetchComments } from "@/lib/data/browser";
import CommentItem from "./CommentItem";
import type { CommentWithAuthor } from "@/lib/types";

export default function CommentSection({
  postId,
  userId,
}: {
  postId: string;
  userId?: string;
}) {
  const [comments, setComments] = useState<CommentWithAuthor[]>([]);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchComments(postId).then(setComments);
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;
    setLoading(true);

    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId, body: body.trim() }),
    });

    if (res.ok) {
      const { comment } = await res.json();
      setComments(prev => [...prev, comment]);
      setBody("");
    }
    setLoading(false);
  };

  const handleEdit = async (commentId: string, newBody: string) => {
    const res = await fetch(`/api/comments/${commentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: newBody }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({ error: "Failed to edit" }));
      throw new Error(data.error ?? "Failed to edit comment");
    }

    setComments(prev =>
      prev.map(c => (c.id === commentId ? { ...c, body: newBody } : c)),
    );
  };

  const handleDelete = async (commentId: string) => {
    const res = await fetch(`/api/comments/${commentId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({ error: "Failed to delete" }));
      throw new Error(data.error ?? "Failed to delete comment");
    }

    setComments(prev => prev.filter(c => c.id !== commentId));
  };

  return (
    <div>
      <h3 className="text-base font-bold text-text-primary font-heading mb-1">
        {comments.length} {comments.length === 1 ? "Reply" : "Replies"}
      </h3>
      <div className="h-px bg-surface-border mb-4" />

      {comments.map(comment => (
        <CommentItem
          key={comment.id}
          comment={comment}
          userId={userId}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ))}

      <form onSubmit={handleSubmit} className="mt-4 pt-4 border-t border-surface-border">
        <textarea
          value={body}
          onChange={e => setBody(e.target.value)}
          placeholder={userId ? "Share your thoughts..." : "Sign in to join the conversation"}
          rows={3}
          disabled={!userId}
          aria-label="Write a comment"
          className="w-full px-4 py-3 bg-surface-2 text-text-primary text-sm rounded-xl border border-surface-border focus:border-primary/50 focus:ring-1 focus:ring-primary/25 transition-all placeholder:text-text-muted resize-none disabled:opacity-50 disabled:cursor-not-allowed"
        />
        {userId && (
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              disabled={loading || !body.trim()}
              aria-label="Submit comment"
              className="px-5 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-glow hover:-translate-y-px transition-all duration-150 disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:bg-primary font-heading"
            >
              {loading ? "Posting..." : "Post Reply"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
