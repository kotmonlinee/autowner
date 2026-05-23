import type { Metadata } from "next";
import { getPosts, getCurrentUser, getCategories } from "@/lib/data/server";
import Navbar from "@/components/Navbar";
import PostCard from "@/components/PostCard";
import CategoryFilter from "@/components/CategoryFilter";
import Pagination from "@/components/Pagination";
import SearchTracker from "@/components/SearchTracker";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Search — AutOwner",
  description: "Search AutOwner for car maintenance guides, repair tutorials, and community discussions.",
  robots: {
    index: false,
    follow: true,
  },
};

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string; page?: string }> }) {
  const { q, category, page: pageStr } = await searchParams;
  const page = Math.max(1, parseInt(pageStr ?? "1", 10) || 1);

  const [{ posts, totalCount }, user, categories] = await Promise.all([
    q || category
      ? getPosts({ search: q, categorySlug: category, page, limit: 30 })
      : Promise.resolve({ posts: [], totalCount: 0 }),
    getCurrentUser(),
    getCategories(),
  ]);

  return (
    <div className="min-h-screen bg-surface-0 relative">
      <Navbar />
      {q && <SearchTracker query={q} />}
      <main id="main-content" className="max-w-3xl mx-auto px-5 py-6 w-full">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Search" }]} />
        <div className="mb-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h1 className="text-xl font-bold text-text-primary font-heading">
              {q ? `Results for "${q}"` : category ? `Category: ${categories.find(c => c.slug === category)?.name ?? category}` : "Search"}
            </h1>
            <Suspense fallback={<div className="w-40 h-10 bg-surface-2 rounded-lg animate-pulse" />}>
              <CategoryFilter categories={categories.map(c => ({ slug: c.slug, name: c.name }))} />
            </Suspense>
          </div>
          {q && <p className="text-sm text-text-muted mt-1">{totalCount} results found</p>}
        </div>
        <div className="space-y-2">
          {posts.map((post, i) => <PostCard key={post.id} post={post} userId={user?.id} index={i} />)}
        </div>
        {(q || category) && <Pagination page={page} totalCount={totalCount} basePath="/search" />}
        {(q || category) && posts.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-5 bg-surface-2 rounded-3xl flex items-center justify-center">
              <svg className="w-10 h-10 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-lg font-semibold text-text-secondary font-heading mb-1">No results found</p>
            <p className="text-sm text-text-muted mt-1 max-w-xs mx-auto leading-relaxed">
              We couldn&apos;t find anything matching your search. Here are a few things to try:
            </p>
            <ul className="text-sm text-text-muted mt-3 mb-2 space-y-1.5 max-w-xs mx-auto text-left list-disc list-inside">
              <li>Try fewer or more general keywords</li>
              <li>Try a different category or remove the category filter</li>
              <li>Check for typos in your search terms</li>
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}
