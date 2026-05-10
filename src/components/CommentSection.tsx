"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { fetchComments } from "@/lib/data/browser";
import CommentItem from "./CommentItem";
import type { CommentWithAuthor } from "@/lib/types";

const MAX_NESTING_DEPTH = 2; // 3 levels total: root (0), reply (1), reply-to-reply (2)

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
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    fetchComments(postId).then(setComments);
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;

    if (!userId) {
      router.push(`/auth/login?next=${encodeURIComponent(pathname)}`);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, body: body.trim() }),
      });

      const data = await res.json();

      if (res.ok) {
        setComments(prev => [...prev, data.comment]);
        setBody("");
      } else {
        alert(data.error ?? "Failed to post comment");
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to post comment");
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (parentId: string, replyBody: string) => {
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId, body: replyBody, parentId }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error ?? "Failed to reply");
    }

    setComments(prev => [...prev, data.comment]);
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

  // Build the comment tree from the flat list
  const commentTree = useMemo(() => {
    // Map parent_id -> children
    const childrenMap = new Map<string, CommentWithAuthor[]>();
    for (const c of comments) {
      const key = c.parent_id ?? "__root__";
      if (!childrenMap.has(key)) childrenMap.set(key, []);
      childrenMap.get(key)!.push(c);
    }

    // Sort children within each parent by created_at
    for (const [, kids] of childrenMap) {
      kids.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    }

    return childrenMap;
  }, [comments]);

  // Recursively render a comment and its descendants
  function renderCommentTree(comment: CommentWithAuthor, depth: number): React.ReactNode {
    const children = commentTree.get(comment.id) ?? [];
    const nextDepth = Math.min(depth + 1, MAX_NESTING_DEPTH + 1);

    return (
      <CommentItem
        key={comment.id}
        comment={comment}
        userId={userId}
        depth={depth}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onReply={handleReply}
      >
        {children.length > 0 && (
          <div>
            {children.map(child => renderCommentTree(child, nextDepth))}
          </div>
        )}
      </CommentItem>
    );
  }

  const rootComments = commentTree.get("__root__") ?? [];

  return (
    <div>
      <h3 className="text-base font-bold text-text-primary font-heading mb-1">
        {comments.length} {comments.length === 1 ? "Reply" : "Replies"}
      </h3>
      <div className="h-px bg-surface-border mb-4" />

      {rootComments.map(comment => renderCommentTree(comment, 0))}

      <form onSubmit={handleSubmit} className="mt-4 pt-4 border-t border-surface-border">
        <textarea
          value={body}
          onChange={e => setBody(e.target.value)}
          placeholder="Share your thoughts..."
          rows={3}
          aria-label="Write a comment"
          className="w-full px-4 py-3 bg-surface-2 text-text-primary text-sm rounded-xl border border-surface-border focus:border-primary/50 focus:ring-1 focus:ring-primary/25 transition-all placeholder:text-text-muted resize-none"
        />
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
      </form>
    </div>
  );
}
