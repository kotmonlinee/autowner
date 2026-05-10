import type { Metadata } from "next";
import { getCurrentUser, getReadingHistory } from "@/lib/data/server";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnonymousHistory from "@/components/AnonymousHistory";

export const metadata: Metadata = {
  title: "Reading History — AutOwner",
  description: "Posts you have recently viewed on AutOwner.",
};

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

export default async function HistoryPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="min-h-screen bg-surface-0 relative flex flex-col">
        <Navbar />
        <main id="main-content" className="max-w-7xl mx-auto px-5 py-6 flex-1 w-full">
          <div className="mb-6 pb-4 border-b border-surface-border">
            <h1 className="text-2xl font-bold text-text-primary font-heading">
              Reading History
            </h1>
            <p className="text-sm text-text-muted mt-1">
              Recently viewed posts on this device
            </p>
          </div>
          <AnonymousHistory />
        </main>
        <Footer />
      </div>
    );
  }

  const history = await getReadingHistory(user.id);

  return (
    <div className="min-h-screen bg-surface-0 relative flex flex-col">
      <Navbar />
      <main id="main-content" className="max-w-4xl mx-auto px-5 py-6 flex-1 w-full">
        <div className="mb-6 pb-4 border-b border-surface-border flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-primary font-heading">
              Reading History
            </h1>
            <p className="text-sm text-text-muted mt-1">
              {history.length > 0
                ? `${history.length} recently viewed post${history.length !== 1 ? "s" : ""}`
                : "Posts you view will appear here"}
            </p>
          </div>
        </div>

        {history.length === 0 ? (
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-lg font-semibold text-text-secondary font-heading mb-1">
              No reading history yet
            </p>
            <p className="text-sm text-text-muted mt-1 max-w-xs mx-auto leading-relaxed">
              Your reading history tracks posts you have viewed. Once you start exploring, your recently viewed posts will show up here so you can easily find them again.
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-glow hover:-translate-y-px transition-all duration-150 font-heading shadow-sm shadow-primary/20"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l-7 7 7 7" />
              </svg>
              Browse Posts
            </Link>
          </div>
        ) : (
          <div className="space-y-1">
            {history.map((entry) => (
              <Link
                key={entry.postId}
                href={`/post/${entry.postId}`}
                className="flex items-center justify-between gap-4 p-3.5 bg-surface-1 rounded-lg border border-surface-border hover:border-surface-4 hover:bg-surface-2/50 transition-all duration-150"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <svg
                    className="w-4 h-4 text-text-muted shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-sm text-text-primary font-medium truncate hover:text-primary transition-colors">
                    {entry.title}
                  </span>
                </div>
                <span className="text-xs text-text-muted shrink-0">
                  {timeAgo(entry.viewedAt)}
                </span>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
