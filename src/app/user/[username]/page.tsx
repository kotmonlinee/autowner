import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getUserProfile, getUserPosts, getUserComments, getCurrentUser } from "@/lib/data/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PostCard from "@/components/PostCard";

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

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const profile = await getUserProfile(username);
  if (!profile) return { title: "User Not Found — AutOwner" };
  return {
    title: `${profile.username} — AutOwner`,
    description: `${profile.username} is a member of AutOwner with ${profile.post_count} post${profile.post_count === 1 ? "" : "s"} and ${profile.comment_count} comment${profile.comment_count === 1 ? "" : "s"}.`,
    openGraph: {
      title: `${profile.username} — AutOwner`,
      description: `View ${profile.username}'s profile, posts, and activity on AutOwner.`,
    },
  };
}

export default async function UserProfilePage({
  params,
  searchParams,
}: {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { username } = await params;
  const { tab } = await searchParams;

  const [profile, currentUser] = await Promise.all([
    getUserProfile(username),
    getCurrentUser(),
  ]);

  if (!profile) notFound();

  const isOwnProfile = currentUser?.id === profile.id;
  const activeTab = tab === "comments" ? "comments" : "posts";

  // Fetch data for the active tab
  const [posts, comments] = await Promise.all([
    activeTab === "posts" ? getUserPosts(username) : Promise.resolve([]),
    activeTab === "comments" ? getUserComments(username) : Promise.resolve([]),
  ]);

  return (
    <div className="min-h-screen bg-surface-0 relative flex flex-col">
      <Navbar />
      <main id="main-content" className="max-w-4xl mx-auto px-5 py-6 flex-1 w-full">
        {/* Profile Header */}
        <div className="bg-surface-1 rounded-xl border border-surface-border p-6 mb-6">
          <div className="flex items-start gap-4">
            {/* Avatar placeholder */}
            <div className="w-16 h-16 rounded-full bg-surface-4 flex items-center justify-center text-2xl font-bold text-text-secondary shrink-0 ring-2 ring-surface-border">
              {profile.username[0].toUpperCase()}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-text-primary font-heading">
                  {profile.username}
                </h1>
                {isOwnProfile && (
                  <Link
                    href="/settings"
                    className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-text-muted hover:text-primary bg-surface-3 hover:bg-surface-4 rounded-lg border border-surface-border transition-colors"
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    Edit Profile
                  </Link>
                )}
              </div>
              <p className="text-sm text-text-muted mt-1">
                Joined {formatDate(profile.created_at)}
              </p>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-surface-border">
            <div className="bg-surface-2 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-text-primary font-heading">
                {profile.post_count}
              </p>
              <p className="text-xs text-text-muted mt-1 uppercase tracking-wide font-medium">
                Post{profile.post_count === 1 ? "" : "s"}
              </p>
            </div>
            <div className="bg-surface-2 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-text-primary font-heading">
                {profile.comment_count}
              </p>
              <p className="text-xs text-text-muted mt-1 uppercase tracking-wide font-medium">
                Comment{profile.comment_count === 1 ? "" : "s"}
              </p>
            </div>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-0 mb-5 border-b border-surface-border">
          <Link
            href={`/user/${username}`}
            className={`px-5 py-2.5 text-sm font-semibold font-heading transition-colors border-b-2 -mb-px ${
              activeTab === "posts"
                ? "border-primary text-primary"
                : "border-transparent text-text-muted hover:text-text-secondary"
            }`}
          >
            Posts
          </Link>
          <Link
            href={`/user/${username}?tab=comments`}
            className={`px-5 py-2.5 text-sm font-semibold font-heading transition-colors border-b-2 -mb-px ${
              activeTab === "comments"
                ? "border-primary text-primary"
                : "border-transparent text-text-muted hover:text-text-secondary"
            }`}
          >
            Comments
          </Link>
        </div>

        {/* Posts tab */}
        {activeTab === "posts" && (
          <>
            <h2 className="text-lg font-semibold text-text-primary font-heading mb-4">
              Posts by {profile.username}
            </h2>

            {posts.length === 0 ? (
              <div className="bg-surface-1 rounded-xl border border-surface-border p-10 text-center">
                <svg
                  className="w-12 h-12 text-text-muted mx-auto mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                  />
                </svg>
                <p className="text-text-muted text-sm">No posts yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {posts.map((post, i) => (
                  <PostCard key={post.id} post={post} index={i} />
                ))}
              </div>
            )}
          </>
        )}

        {/* Comments tab */}
        {activeTab === "comments" && (
          <>
            <h2 className="text-lg font-semibold text-text-primary font-heading mb-4">
              Comments by {profile.username}
            </h2>

            {comments.length === 0 ? (
              <div className="bg-surface-1 rounded-xl border border-surface-border p-10 text-center">
                <svg
                  className="w-12 h-12 text-text-muted mx-auto mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <p className="text-text-muted text-sm">No comments yet</p>
              </div>
            ) : (
              <div className="space-y-1 bg-surface-1 rounded-xl border border-surface-border divide-y divide-surface-border">
                {comments.map((comment) => (
                  <div key={comment.id} className="p-4 hover:bg-surface-2/50 transition-colors">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs font-semibold text-text-secondary font-heading">
                        {profile.username}
                      </span>
                      <span className="text-xs text-text-muted">
                        {timeAgo(comment.created_at)}
                      </span>
                    </div>
                    <p className="text-sm text-text-primary leading-relaxed whitespace-pre-wrap mb-2">
                      {comment.body}
                    </p>
                    {comment.posts && (
                      <Link
                        href={`/post/${comment.posts.id}`}
                        className="inline-flex items-center gap-1 text-xs text-text-muted hover:text-primary transition-colors"
                      >
                        <svg
                          className="w-3 h-3"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                        </svg>
                        <span className="line-clamp-1">
                          Re: {comment.posts.title}
                        </span>
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
