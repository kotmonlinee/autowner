import PostCard from "./PostCard";
import type { PostWithRelations } from "@/lib/types";

export default function PostFeed({
  posts,
  userId,
}: {
  posts: PostWithRelations[];
  userId?: string;
}) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 mx-auto mb-4 bg-surface-2 rounded-2xl flex items-center justify-center">
          <svg className="w-8 h-8 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        </div>
        <p className="text-lg font-semibold text-text-secondary font-heading">No posts yet</p>
        <p className="text-sm text-text-muted mt-1">Be the first to start a discussion!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {posts.map((post, i) => (
        <PostCard key={post.id} post={post} userId={userId} index={i} />
      ))}
    </div>
  );
}
