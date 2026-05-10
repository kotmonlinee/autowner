import Link from "next/link";
import VoteButtons from "./VoteButtons";
import Avatar from "./Avatar";
import type { PostWithRelations } from "@/lib/types";

function timeAgo(date: string) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

function readingTime(body: string): string {
  const words = body.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${Math.max(1, minutes)} min read`;
}

function formatCount(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export default function PostCard({
  post,
  userId,
  index = 0,
  isRelevantToUser = false,
  isNew = false,
}: {
  post: PostWithRelations;
  userId?: string;
  index?: number;
  isRelevantToUser?: boolean;
  isNew?: boolean;
}) {
  return (
    <article
      role="article"
      className="group flex gap-4 p-4 bg-surface-1 rounded-xl border border-surface-border hover:border-surface-4 transition-all duration-200 animate-fade-in hover:bg-surface-2/50"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <VoteButtons
        targetType="post"
        targetId={post.id}
        initialScore={post.vote_score}
        userId={userId}
      />

      <div className="flex-1 min-w-0">
        {/* Meta line */}
        <div className="flex items-center gap-2 mb-1.5">
          {post.categories && (
            <Link
              href={`/?category=${post.categories.slug}`}
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-surface-3 text-text-secondary rounded-full text-[10px] font-bold uppercase tracking-wider hover:bg-surface-4 hover:text-primary transition-colors font-heading"
            >
              <span className="w-1 h-1 rounded-full bg-primary" />
              {post.categories.name}
            </Link>
          )}
          {post.is_pinned && (
            <span className="px-1.5 py-0.5 bg-purple-500/10 text-purple-400 rounded text-[10px] font-medium font-heading tracking-wide border border-purple-500/20">
              PINNED
            </span>
          )}
          {post.source === "scraped" && (
            <span className="px-1.5 py-0.5 bg-amber-400/10 text-amber-400 rounded text-[10px] font-medium font-heading tracking-wide border border-amber-400/20">
              AUTO
            </span>
          )}
          {post.content_type === "guide" && (
            <span className="px-1.5 py-0.5 bg-teal-400/10 text-teal-400 rounded text-[10px] font-medium font-heading tracking-wide border border-teal-400/20">
              GUIDE
            </span>
          )}
          {post.content_type === "review" && (
            <span className="px-1.5 py-0.5 bg-amber-500/10 text-amber-500 rounded text-[10px] font-medium font-heading tracking-wide border border-amber-500/20">
              REVIEW
            </span>
          )}
          {isRelevantToUser && (
            <span className="px-1.5 py-0.5 bg-emerald-400/10 text-emerald-400 rounded text-[10px] font-medium font-heading tracking-wide border border-emerald-400/20">
              Your Car
            </span>
          )}
          {isNew && (
            <span className="px-1.5 py-0.5 bg-primary/10 text-primary rounded text-[10px] font-bold font-heading tracking-wide border border-primary/20">
              NEW
            </span>
          )}
        </div>

        {/* Title */}
        <Link href={`/post/${post.id}`} aria-label={`Read: ${post.title}`}>
          <h3 className="text-[15px] font-semibold text-text-primary line-clamp-2 group-hover:text-primary transition-colors duration-150 font-heading leading-snug">
            {post.title}
          </h3>
        </Link>

        {/* Tags */}
        {post.post_tags && post.post_tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {post.post_tags.map(pt => (
              <Link
                key={pt.car_tags.slug}
                href={`/?tag=${pt.car_tags.slug}`}
                className="px-2 py-0.5 bg-surface-3 text-text-muted rounded-md text-[10px] font-medium hover:bg-surface-4 hover:text-text-secondary transition-colors"
              >
                {pt.car_tags.name}
              </Link>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center gap-2.5 mt-2.5 text-xs text-text-muted">
          {post.profiles?.username ? (
            <Link href={`/user/${post.profiles.username}`} className="font-medium text-text-secondary hover:text-primary transition-colors inline-flex items-center gap-1.5">
              <Avatar username={post.profiles.username} avatarUrl={post.profiles.avatar_url} size="sm" />
              {post.profiles.username}
            </Link>
          ) : (
            <span className="font-medium text-text-secondary">unknown</span>
          )}
          <span className="text-surface-border">·</span>
          <span>{formatCount(post.view_count ?? 0)} views</span>
          <span className="text-surface-border">·</span>
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            {post.comment_count}
          </span>
          <span className="text-surface-border">·</span>
          <span>{timeAgo(post.created_at)}</span>
          {(post.content_type === "guide" || post.content_type === "review") && (
            <>
              <span className="text-surface-border">·</span>
              <span>{readingTime(post.body)}</span>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
