import type { Metadata } from "next";
import {
  getActiveDiscussions,
  getTrendingVehicles,
} from "@/lib/data/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import Link from "next/link";
import { timeAgo } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Community",
  description:
    "Join the AutOwner community. See active discussions, top contributors, and trending vehicles across the car enthusiast community.",
  alternates: {
    canonical: "https://www.autowner.com/community",
  },
};

export default async function CommunityPage() {
  const [activeDiscussions, trendingVehicles] =
    await Promise.all([
      getActiveDiscussions(8),
      getTrendingVehicles(6),
    ]);

  return (
    <div className="min-h-screen bg-surface-0 flex flex-col">
      <Navbar />

      <main id="main-content" className="flex-1 max-w-5xl mx-auto px-5 py-8 w-full">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Community" }]} />

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

        <div className="max-w-3xl mx-auto space-y-6">
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
                <span className="text-xs text-text-muted">Latest</span>
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
                    No discussions yet. Be the first to start one!
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
      </main>

      <Footer />
    </div>
  );
}
