import type { Metadata } from "next";
import { getPosts, getCurrentUser, getCategories } from "@/lib/data/server";
import Navbar from "@/components/Navbar";
import PostCard from "@/components/PostCard";
import CategoryFilter from "@/components/CategoryFilter";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Search — AutOwner",
  description: "Search AutOwner for car maintenance guides, repair tutorials, and community discussions.",
  robots: {
    index: false,
    follow: true,
  },
};

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string }> }) {
  const { q, category } = await searchParams;
  const [posts, user, categories] = await Promise.all([
    q || category
      ? getPosts({ search: q, categorySlug: category, limit: 30 }).then(r => r.posts)
      : Promise.resolve([]),
    getCurrentUser(),
    getCategories(),
  ]);

  return (
    <div className="min-h-screen bg-surface-0 relative">
      <Navbar />
      <main id="main-content" className="max-w-3xl mx-auto px-5 py-6 w-full">
        <div className="mb-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h1 className="text-xl font-bold text-text-primary font-heading">
              {q ? `Results for "${q}"` : category ? `Category: ${categories.find(c => c.slug === category)?.name ?? category}` : "Search"}
            </h1>
            <Suspense fallback={<div className="w-40 h-10 bg-surface-2 rounded-lg animate-pulse" />}>
              <CategoryFilter categories={categories.map(c => ({ slug: c.slug, name: c.name }))} />
            </Suspense>
          </div>
          {q && <p className="text-sm text-text-muted mt-1">{posts.length} results found</p>}
        </div>
        <div className="space-y-2">
          {posts.map((post, i) => <PostCard key={post.id} post={post} userId={user?.id} index={i} />)}
        </div>
        {(q || category) && posts.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 bg-surface-2 rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-text-secondary font-heading font-semibold">No results found</p>
            <p className="text-sm text-text-muted mt-1">Try different keywords or category</p>
          </div>
        )}
      </main>
    </div>
  );
}
