import VoteButtons from "./VoteButtons";
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
}: {
  comment: CommentWithAuthor;
  userId?: string;
}) {
  return (
    <div className="flex gap-3 py-3.5 border-b border-surface-border last:border-0">
      <VoteButtons
        targetType="comment"
        targetId={comment.id}
        initialScore={comment.vote_score}
        userId={userId}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-5 h-5 rounded-full bg-surface-4 flex items-center justify-center text-[10px] font-bold text-text-muted shrink-0">
            {(comment.profiles?.username ?? "?")[0].toUpperCase()}
          </div>
          <span className="text-xs font-semibold text-text-secondary font-heading">
            {comment.profiles?.username ?? "deleted"}
          </span>
          <span className="text-xs text-text-muted">{timeAgo(comment.created_at)}</span>
        </div>
        <p className="text-sm text-text-primary leading-relaxed whitespace-pre-wrap">{comment.body}</p>
      </div>
    </div>
  );
}
