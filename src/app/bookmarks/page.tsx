import type { Metadata } from "next";
import { getBookmarkedPosts, getCurrentUser } from "@/lib/data/server";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import PostFeed from "@/components/PostFeed";
import Footer from "@/components/Footer";
import AnonymousBookmarks from "@/components/AnonymousBookmarks";

export const metadata: Metadata = {
  title: "My Bookmarks — AutOwner",
  description: "Your saved posts on AutOwner.",
};

export default async function BookmarksPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="min-h-screen bg-surface-0 relative flex flex-col">
        <Navbar />
        <main id="main-content" className="max-w-5xl mx-auto px-5 py-6 flex-1 w-full">
          <div className="mb-6 pb-4 border-b border-surface-border">
            <h1 className="text-2xl font-bold text-text-primary font-heading">
              My Bookmarks
            </h1>
            <p className="text-sm text-text-muted mt-1">
              Your saved posts on this device
            </p>
          </div>
          <AnonymousBookmarks />
        </main>
        <Footer />
      </div>
    );
  }

  const bookmarks = await getBookmarkedPosts(user.id);

  return (
    <div className="min-h-screen bg-surface-0 relative flex flex-col">
      <Navbar />
      <main id="main-content" className="max-w-5xl mx-auto px-5 py-6 flex-1 w-full">
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
            <div className="w-20 h-20 mx-auto mb-5 bg-surface-2 rounded-3xl flex items-center justify-center">
              <svg
                className="w-10 h-10 text-text-muted"
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
            <p className="text-lg font-semibold text-text-secondary font-heading mb-1">
              No bookmarks yet
            </p>
            <p className="text-sm text-text-muted mt-1 max-w-xs mx-auto leading-relaxed">
              Found a useful guide or an interesting discussion? Click the bookmark icon on any post to save it here for later. Your wrench-worthy reads are always one click away.
            </p>
            <p className="text-xs text-text-muted mt-3 mb-6">
              Not sure where to start? Browse the most popular posts on the homepage.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-glow hover:-translate-y-px transition-all duration-150 font-heading shadow-sm shadow-primary/20"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l-7 7 7 7" />
              </svg>
              Browse Popular Posts
            </Link>
          </div>
        ) : (
          <PostFeed posts={bookmarks} userId={user.id} />
        )}
      </main>
      <Footer />
    </div>
  );
}
