import type { Metadata } from "next";
import { getPosts, getTrendingVehicles } from "@/lib/data/server";
import { createServiceSupabase } from "@/lib/supabase-server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Community",
  description: "Join the AutOwner community. See active discussions and trending vehicles.",
  alternates: { canonical: "https://www.autowner.com/community" },
};

const PAGE_SIZE = 8;

export default async function CommunityPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const query = sp.q?.trim() || "";
  const page = Math.max(1, parseInt(sp.page || "1", 10) || 1);

  const [postsResult, trendingVehicles] = await Promise.all([
    getPosts({
      sort: "new",
      search: query || undefined,
      limit: PAGE_SIZE,
      page,
    }),
    query ? Promise.resolve([]) : getTrendingVehicles(6),
  ]);

  // Count total posts separately for accurate pagination
  const supabase = await createServiceSupabase();
  let countQuery = supabase.from("posts").select("id", { count: "exact", head: true })
    .eq("status", "approved")
    .or("is_draft.is.null,is_draft.eq.false");
  if (query) {
    countQuery = countQuery.textSearch("search_vector", query, { config: "english" });
  }
  const { count } = await countQuery;
  const totalCount = count ?? postsResult.posts.length;

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  return (
    <div className="min-h-screen bg-surface-0 flex flex-col">
      <Navbar />

      <main id="main-content" className="flex-1 max-w-3xl mx-auto px-5 py-8 w-full">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Community" }]} />

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-text-primary font-heading mb-3">
            AutOwner Community
          </h1>
          <p className="text-text-muted text-sm max-w-xl mx-auto leading-relaxed">
            Where car enthusiasts connect, share knowledge, and build their garage.
          </p>
        </div>

        {/* Search */}
        <form action="/community" method="GET" className="mb-6">
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              name="q"
              type="search"
              defaultValue={query}
              placeholder="Search discussions..."
              className="w-full h-11 pl-11 pr-4 bg-surface-1 border border-surface-border rounded-xl text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </form>

        {/* Active Discussions */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-text-primary font-heading">
              {query ? `Results for "${query}"` : "Active Discussions"}
            </h2>
            <span className="text-xs text-text-muted">{totalCount} posts</span>
          </div>

          {postsResult.posts.length === 0 ? (
            <div className="bg-surface-1 rounded-xl border border-surface-border p-8 text-center">
              <p className="text-text-muted text-sm">
                {query ? "No discussions match your search." : "No discussions yet. Be the first to start one!"}
              </p>
              {!query && (
                <Link href="/submit" className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-glow hover:-translate-y-px transition-all duration-150 font-heading shadow-sm shadow-primary/20">
                  Create a Post
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="space-y-2">
                {postsResult.posts.map((post) => {
                  const preview = (post.body ?? "").replace(/[#*`>\-\n]/g, " ").substring(0, 120).trim();
                  const wordCount = (post.body ?? "").split(/\s+/).length;
                  const readMin = Math.max(1, Math.round(wordCount / 200));
                  const typeLabel = post.categories?.name ?? "Article";
                  return (
                  <Link
                    key={post.id}
                    href={`/post/${post.slug || post.id}`}
                    className="block bg-surface-1 rounded-xl border border-surface-border p-5 hover:border-primary/20 hover:bg-surface-2 transition-all duration-150 group"
                  >
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors line-clamp-2 leading-snug font-heading">
                          {post.title}
                        </p>
                      </div>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold font-heading border border-surface-border bg-surface-0 text-text-muted shrink-0">
                        {typeLabel}
                      </span>
                    </div>
                    {preview && (
                      <p className="text-xs text-text-secondary leading-relaxed line-clamp-2 mb-2">{preview}</p>
                    )}
                    <div className="flex items-center gap-3 text-xs text-text-muted">
                      <span>{readMin} min read</span>
                      {(post.view_count ?? 0) > 0 && <span>{post.view_count.toLocaleString()} views</span>}
                    </div>
                  </Link>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  {page > 1 && (
                    <Link
                      href={`/community?${query ? `q=${encodeURIComponent(query)}&` : ""}page=${page - 1}`}
                      className="px-3 py-2 text-sm font-heading font-medium text-text-secondary hover:text-text-primary bg-surface-1 border border-surface-border rounded-lg hover:bg-surface-2 transition-colors"
                    >
                      Previous
                    </Link>
                  )}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <Link
                      key={p}
                      href={`/community?${query ? `q=${encodeURIComponent(query)}&` : ""}page=${p}`}
                      className={`px-3 py-2 text-sm font-heading font-medium rounded-lg transition-colors ${
                        p === page
                          ? "bg-primary text-white"
                          : "text-text-secondary hover:text-text-primary bg-surface-1 border border-surface-border hover:bg-surface-2"
                      }`}
                    >
                      {p}
                    </Link>
                  ))}
                  {page < totalPages && (
                    <Link
                      href={`/community?${query ? `q=${encodeURIComponent(query)}&` : ""}page=${page + 1}`}
                      className="px-3 py-2 text-sm font-heading font-medium text-text-secondary hover:text-text-primary bg-surface-1 border border-surface-border rounded-lg hover:bg-surface-2 transition-colors"
                    >
                      Next
                    </Link>
                  )}
                </div>
              )}
            </>
          )}
        </section>

        {/* Trending Vehicles (hide when searching) */}
        {!query && trendingVehicles.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-text-primary font-heading flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-amber" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
              Trending Vehicles
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {trendingVehicles.map((v) => {
                const eng = v as Record<string, unknown>;
                const gen = eng.vehicle_generations as Record<string, unknown> | null;
                const model = gen?.vehicle_models as Record<string, unknown> | null;
                const make = model?.vehicle_makes as Record<string, unknown> | null;
                const makeName = String(make?.name ?? "");
                const modelName = String(model?.name ?? "");
                const genName = String(gen?.name ?? "");
                const engineCode = String(eng.code ?? "");
                const followerCount = (eng.follower_count as number) ?? 0;

                return (
                  <Link key={eng.id as string} href={`/vehicle/${eng.id}`} className="bg-surface-1 rounded-xl border border-surface-border p-4 hover:border-primary/20 hover:bg-surface-2 transition-all duration-150 group">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-amber/10 flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 text-amber" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 17h14v2H5zM6 10l3-3 3 3 3-3 3 3v5H3v-5l3-3z" />
                          <circle cx="9" cy="17" r="1" /><circle cx="15" cy="17" r="1" />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors font-heading truncate">{makeName} {modelName}</p>
                        <p className="text-xs text-text-muted truncate">{genName} ({engineCode})</p>
                        <div className="flex items-center gap-1 mt-1.5 text-xs text-text-muted">
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                          </svg>
                          <span>{followerCount} {followerCount === 1 ? "owner" : "owners"}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
