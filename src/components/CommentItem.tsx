"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import VoteButtons from "./VoteButtons";
import ReportButton from "./ReportButton";
import Avatar from "./Avatar";
import type { CommentWithAuthor } from "@/lib/types";

function timeAgo(date: string) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function CommentItem({
  comment,
  userId,
  depth = 0,
  onEdit,
  onDelete,
  onReply,
  children,
}: {
  comment: CommentWithAuthor;
  userId?: string;
  depth?: number;
  onEdit?: (commentId: string, body: string) => Promise<void>;
  onDelete?: (commentId: string) => Promise<void>;
  onReply?: (parentId: string, body: string) => Promise<void>;
  children?: React.ReactNode;
}) {
  const [editing, setEditing] = useState(false);
  const [editBody, setEditBody] = useState(comment.body);
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  // Reply state
  const [replying, setReplying] = useState(false);
  const [replyBody, setReplyBody] = useState("");
  const [replySaving, setReplySaving] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const isAuthor = userId && comment.author_id === userId;

  const handleSave = async () => {
    if (!editBody.trim() || !onEdit) return;
    setSaving(true);
    setError("");
    try {
      await onEdit(comment.id, editBody.trim());
      setEditing(false);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    setDeleting(true);
    setError("");
    try {
      await onDelete(comment.id);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to delete");
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleReply = async () => {
    if (!replyBody.trim() || !onReply) return;

    if (!userId) {
      router.push(`/auth/login?next=${encodeURIComponent(pathname)}`);
      return;
    }

    setReplySaving(true);
    setError("");
    try {
      await onReply(comment.id, replyBody.trim());
      setReplyBody("");
      setReplying(false);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to reply");
    } finally {
      setReplySaving(false);
    }
  };

  const maxDepth = 2; // allow 3 levels: root (0), reply (1), reply-to-reply (2)

  return (
    <div>
      <div className={`flex gap-3 py-3.5 border-b border-surface-border last:border-0 ${depth > 0 ? "ml-8" : ""}`}>
        <VoteButtons
          targetType="comment"
          targetId={comment.id}
          initialScore={comment.vote_score}
          userId={userId}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <Avatar
              username={comment.profiles?.username}
              avatarUrl={comment.profiles?.avatar_url}
              size="sm"
            />
            <span className="text-xs font-semibold text-text-secondary font-heading">
              {comment.profiles?.username ?? "deleted"}
            </span>
            <span className="text-xs text-text-muted">{timeAgo(comment.created_at)}</span>

            {/* Edit/Delete/Reply buttons */}
            {!editing && !showDeleteConfirm && (
              <div className="ml-auto flex items-center gap-1">
                {/* Reply button — visible to everyone */}
                {depth <= maxDepth && (
                  <button
                    onClick={() => { setReplying(!replying); setReplyBody(""); setError(""); }}
                    className="p-1 text-text-muted hover:text-primary transition-colors rounded"
                    title="Reply"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                  </button>
                )}

                {isAuthor && (
                  <>
                    <button
                      onClick={() => { setEditBody(comment.body); setEditing(true); setError(""); }}
                      className="p-1 text-text-muted hover:text-primary transition-colors rounded"
                      title="Edit comment"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => { setShowDeleteConfirm(true); setError(""); }}
                      className="p-1 text-text-muted hover:text-red-400 transition-colors rounded"
                      title="Delete comment"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </>
                )}

                {/* Report button — visible to logged-in users who are not the comment author */}
                {!isAuthor && userId && (
                  <ReportButton targetType="comment" targetId={comment.id} userId={userId} />
                )}
              </div>
            )}
          </div>

          {editing ? (
            <div className="space-y-2">
              <textarea
                value={editBody}
                onChange={(e) => setEditBody(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-surface-2 text-text-primary text-sm rounded-lg border border-surface-border focus:border-primary/50 focus:ring-1 focus:ring-primary/25 transition-all resize-none"
              />
              {error && <p className="text-xs text-red-400">{error}</p>}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSave}
                  disabled={saving || !editBody.trim()}
                  className="px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-md hover:bg-primary-glow transition-colors font-heading disabled:opacity-40"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => { setEditing(false); setError(""); }}
                  disabled={saving}
                  className="px-3 py-1.5 bg-surface-3 text-text-secondary text-xs font-bold rounded-md hover:bg-surface-4 transition-colors font-heading"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : showDeleteConfirm ? (
            <div>
              <p className="text-sm text-text-secondary mb-2">Delete this comment?</p>
              {error && <p className="text-xs text-red-400 mb-2">{error}</p>}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-md hover:bg-red-600 transition-colors font-heading disabled:opacity-50"
                >
                  {deleting ? "Deleting..." : "Yes, delete"}
                </button>
                <button
                  onClick={() => { setShowDeleteConfirm(false); setError(""); }}
                  disabled={deleting}
                  className="px-3 py-1.5 bg-surface-3 text-text-secondary text-xs font-bold rounded-md hover:bg-surface-4 transition-colors font-heading"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-text-primary leading-relaxed whitespace-pre-wrap">{comment.body}</p>
          )}

          {/* Mini reply form */}
          {replying && (
            <div className="mt-2 space-y-2">
              <textarea
                value={replyBody}
                onChange={(e) => setReplyBody(e.target.value)}
                placeholder="Write a reply..."
                rows={2}
                className="w-full px-3 py-2 bg-surface-2 text-text-primary text-sm rounded-lg border border-surface-border focus:border-primary/50 focus:ring-1 focus:ring-primary/25 transition-all resize-none placeholder:text-text-muted"
              />
              {error && <p className="text-xs text-red-400">{error}</p>}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleReply}
                  disabled={replySaving || !replyBody.trim()}
                  className="px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-md hover:bg-primary-glow transition-colors font-heading disabled:opacity-40"
                >
                  {replySaving ? "Replying..." : "Reply"}
                </button>
                <button
                  onClick={() => { setReplying(false); setReplyBody(""); setError(""); }}
                  disabled={replySaving}
                  className="px-3 py-1.5 bg-surface-3 text-text-secondary text-xs font-bold rounded-md hover:bg-surface-4 transition-colors font-heading"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Render nested children (replies) */}
      {children}
    </div>
  );
}
