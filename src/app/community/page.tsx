import type { Metadata } from "next";
import {
  getActiveDiscussions,
  getTopContributors,
  getTrendingVehicles,
  getCategories,
} from "@/lib/data/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import Avatar from "@/components/Avatar";
import { timeAgo } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Community — AutOwner",
  description:
    "Join the AutOwner community. See active discussions, top contributors, and trending vehicles across the car enthusiast community.",
  alternates: {
    canonical: "https://www.autowner.com/community",
  },
};

export default async function CommunityPage() {
  const [activeDiscussions, topContributors, trendingVehicles, categories] =
    await Promise.all([
      getActiveDiscussions(8),
      getTopContributors(8),
      getTrendingVehicles(6),
      getCategories(),
    ]);

  return (
    <div className="min-h-screen bg-surface-0 flex flex-col">
      <Navbar />

      <main id="main-content" className="flex-1 max-w-5xl mx-auto px-5 py-8 w-full">
        {/* Hero */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-text-primary font-heading mb-3">
            AutOwner Community
          </h1>
          <p className="text-text-muted text-sm max-w-xl mx-auto leading-relaxed">
            Where car enthusiasts connect, share knowledge, and build their
            garage. Find discussions about your vehicle, learn from top
            contributors, and discover trending cars.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left column: Active Discussions + Trending Vehicles */}
          <div className="lg:col-span-2 space-y-6">
            {/* Active Discussions */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-text-primary font-heading flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-primary"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  Active Discussions
                </h2>
                <span className="text-xs text-text-muted">This week</span>
              </div>

              {activeDiscussions.length === 0 ? (
                <div className="bg-surface-1 rounded-xl border border-surface-border p-8 text-center">
                  <svg
                    className="w-12 h-12 mx-auto mb-3 text-text-muted"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  <p className="text-text-muted text-sm">
                    No active discussions this week. Be the first to start one!
                  </p>
                  <Link
                    href="/submit"
                    className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-glow hover:-translate-y-px transition-all duration-150 font-heading shadow-sm shadow-primary/20"
                  >
                    Create a Post
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {activeDiscussions.map((post) => (
                    <Link
                      key={post.id}
                      href={`/post/${post.slug || post.id}`}
                      className="block bg-surface-1 rounded-xl border border-surface-border p-4 hover:border-primary/20 hover:bg-surface-2 transition-all duration-150 group"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors line-clamp-2 leading-snug font-heading">
                            {post.title}
                          </p>
                          <p className="text-xs text-text-muted mt-1">
                            {timeAgo(post.created_at)}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 text-xs font-semibold text-text-muted shrink-0 bg-surface-3 px-2.5 py-1 rounded-full">
                          <svg
                            className="w-3.5 h-3.5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          {post.comment_count}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>

            {/* Trending Vehicles */}
            <section>
              <h2 className="text-lg font-bold text-text-primary font-heading flex items-center gap-2 mb-4">
                <svg
                  className="w-5 h-5 text-amber"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
                Trending Vehicles
              </h2>

              {trendingVehicles.length === 0 ? (
                <div className="bg-surface-1 rounded-xl border border-surface-border p-6 text-center">
                  <p className="text-text-muted text-sm">
                    No trending vehicles yet. Add your car to get started!
                  </p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-3">
                  {trendingVehicles.map((v) => {
                    const eng = v as Record<string, unknown>;
                    const gen =
                      eng.vehicle_generations as Record<string, unknown> | null;
                    const model =
                      gen?.vehicle_models as Record<string, unknown> | null;
                    const make =
                      model?.vehicle_makes as Record<string, unknown> | null;
                    const makeName = String(make?.name ?? "");
                    const modelName = String(model?.name ?? "");
                    const genName = String(gen?.name ?? "");
                    const engineCode = String(eng.code ?? "");
                    const followerCount = (eng.follower_count as number) ?? 0;

                    return (
                      <Link
                        key={eng.id as string}
                        href={`/vehicle/${eng.id}`}
                        className="bg-surface-1 rounded-xl border border-surface-border p-4 hover:border-primary/20 hover:bg-surface-2 transition-all duration-150 group"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-amber/10 flex items-center justify-center shrink-0">
                            <svg
                              className="w-5 h-5 text-amber"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M5 17h14v2H5zM6 10l3-3 3 3 3-3 3 3v5H3v-5l3-3z" />
                              <circle cx="9" cy="17" r="1" />
                              <circle cx="15" cy="17" r="1" />
                            </svg>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors font-heading truncate">
                              {makeName} {modelName}
                            </p>
                            <p className="text-xs text-text-muted truncate">
                              {genName} ({engineCode})
                            </p>
                            <div className="flex items-center gap-1 mt-1.5 text-xs text-text-muted">
                              <svg
                                className="w-3.5 h-3.5"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                              </svg>
                              <span>
                                {followerCount}{" "}
                                {followerCount === 1 ? "owner" : "owners"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </section>
          </div>

          {/* Right column: Top Contributors */}
          <aside className="space-y-6">
            {/* Top Contributors */}
            <div className="bg-surface-1 rounded-xl border border-surface-border p-5">
              <h2 className="text-sm font-bold text-text-primary font-heading flex items-center gap-2 mb-4">
                <svg
                  className="w-4.5 h-4.5 text-primary"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                Top Contributors
                <span className="text-xs font-normal text-text-muted ml-auto">
                  30 days
                </span>
              </h2>

              {topContributors.length === 0 ? (
                <p className="text-xs text-text-muted text-center py-4">
                  No contributors yet. Be the first to join the conversation!
                </p>
              ) : (
                <div className="space-y-3">
                  {topContributors.map((user, i) => (
                    <div
                      key={user.id}
                      className="flex items-center gap-3"
                    >
                      <span className="text-xs font-bold text-text-muted font-heading w-5 shrink-0 tabular-nums text-right">
                        {(i + 1).toString().padStart(2, "0")}
                      </span>
                      <Link href={`/user/${user.username}`}>
                        <Avatar
                          username={user.username}
                          avatarUrl={user.avatar_url}
                          size="sm"
                        />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/user/${user.username}`}
                          className="text-sm font-semibold text-text-secondary hover:text-primary transition-colors font-heading truncate block"
                        >
                          {user.username}
                        </Link>
                        <span className="text-xs text-text-muted">
                          {user.comment_count}{" "}
                          {user.comment_count === 1
                            ? "comment"
                            : "comments"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Browse Categories */}
            <div className="bg-surface-1 rounded-xl border border-surface-border p-5">
              <h2 className="text-sm font-bold text-text-primary font-heading flex items-center gap-2 mb-4">
                <svg
                  className="w-4.5 h-4.5 text-text-muted"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                Browse Categories
              </h2>

              <div className="space-y-1">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/?category=${cat.slug}`}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-surface-2 transition-all duration-150 font-heading"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-primary/5 border border-primary/15 rounded-xl p-5 text-center">
              <h3 className="text-sm font-bold text-text-primary font-heading mb-2">
                Have a question about your car?
              </h3>
              <p className="text-xs text-text-muted mb-4">
                Get answers from experienced owners and mechanics in the community.
              </p>
              <Link
                href="/submit"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary-glow hover:-translate-y-px transition-all duration-150 font-heading shadow-sm shadow-primary/20"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Ask a Question
              </Link>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
