import { getTrendingPosts } from "@/lib/data/server";
import Link from "next/link";

export default async function TrendingPosts() {
  const posts = await getTrendingPosts(5);

  if (posts.length === 0) {
    return (
      <div className="mt-4 pt-3 border-t border-surface-border">
        <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted font-heading mb-3 px-2">
          Trending
        </p>
        <p className="text-xs text-text-muted px-2">No trending posts</p>
      </div>
    );
  }

  return (
    <div className="mt-4 pt-3 border-t border-surface-border">
      <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted font-heading mb-3 px-2">
        Trending
      </p>
      <ol className="space-y-0.5">
        {posts.map((post, i) => (
          <li key={post.id}>
            <Link
              href={`/post/${post.slug || post.id}`}
              className="flex items-start gap-2.5 px-3 py-2 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-surface-2 transition-all duration-150 border-l-2 border-transparent"
            >
              <span className="text-xs font-bold text-text-muted font-heading w-5 shrink-0 tabular-nums">
                {(i + 1).toString().padStart(2, "0")}
              </span>
              <span className="flex-1 min-w-0 truncate leading-snug">
                {post.title}
              </span>
              <span className="flex items-center gap-1 text-xs text-text-muted shrink-0">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {post.comment_count}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
