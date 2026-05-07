import type { Metadata } from "next";
import { getBookmarkedPosts, getCurrentUser } from "@/lib/data/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import PostFeed from "@/components/PostFeed";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "My Bookmarks — AutOwner",
  description: "Your saved posts on AutOwner.",
};

export default async function BookmarksPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login?next=/bookmarks");
  }

  const bookmarks = await getBookmarkedPosts(user.id);

  return (
    <div className="min-h-screen bg-surface-0 relative flex flex-col">
      <Navbar />
      <div className="max-w-7xl mx-auto px-5 py-6 flex-1">
        <div className="mb-6 pb-4 border-b border-surface-border">
          <h1 className="text-2xl font-bold text-text-primary font-heading">
            My Bookmarks
          </h1>
          <p className="text-sm text-text-muted mt-1">
            {bookmarks.length > 0
              ? `${bookmarks.length} saved post${bookmarks.length !== 1 ? "s" : ""}`
              : "Posts you save will appear here"}
          </p>
        </div>

        {bookmarks.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 bg-surface-2 rounded-2xl flex items-center justify-center">
              <svg
                className="w-8 h-8 text-text-muted"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            </div>
            <p className="text-lg font-semibold text-text-secondary font-heading">
              No bookmarks yet
            </p>
            <p className="text-sm text-text-muted mt-1 mb-6">
              Save posts by clicking the bookmark icon on any post
            </p>
            <Link
              href="/"
              className="inline-block px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-glow hover:-translate-y-px transition-all duration-150 font-heading shadow-sm shadow-primary/20"
            >
              Browse Posts
            </Link>
          </div>
        ) : (
          <PostFeed posts={bookmarks} userId={user.id} />
        )}
      </div>
      <Footer />
    </div>
  );
}
