import PostCard from "./PostCard";
import Link from "next/link";
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
        {/* Car + wrench illustration */}
        <div className="w-20 h-20 mx-auto mb-5 bg-surface-2 rounded-3xl flex items-center justify-center">
          <svg className="w-10 h-10 text-text-muted" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            {/* Car body */}
            <path d="M10 28h28v-6a4 4 0 00-4-4H14a4 4 0 00-4 4v6z" />
            <path d="M10 28v4a2 2 0 002 2h2a2 2 0 002-2v-2" />
            <path d="M32 28v4a2 2 0 002 2h2a2 2 0 002-2v-2" />
            {/* Windshield */}
            <path d="M32 18l-6-6h-4l-6 6" />
            {/* Wheels */}
            <circle cx="14" cy="34" r="3" />
            <circle cx="34" cy="34" r="3" />
            {/* Wrench accent */}
            <path d="M44 12l-6 6-2-2 6-6a3 3 0 012 2z" strokeWidth="2" />
            {/* Headlight */}
            <rect x="6" y="24" width="2" height="2" rx="0.5" fill="currentColor" stroke="none" />
          </svg>
        </div>
        <p className="text-lg font-semibold text-text-secondary font-heading mb-1">
          Nothing in the garage yet
        </p>
        <p className="text-sm text-text-muted mt-1 max-w-xs mx-auto leading-relaxed">
          This space is waiting for its first build thread, repair guide, or community discussion. Pop the hood and get things started.
        </p>
        <Link
          href="/submit"
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-glow hover:-translate-y-px transition-all duration-150 font-heading shadow-sm shadow-primary/20"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Create the First Post
        </Link>
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
