import type { Metadata } from "next";
import { getPosts, getPinnedPosts, getCurrentUser, getCategories } from "@/lib/data/server";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import PostFeed from "@/components/PostFeed";
import SortToggle from "@/components/SortToggle";
import Pagination from "@/components/Pagination";
import FeaturedCarousel from "@/components/FeaturedCarousel";
import Footer from "@/components/Footer";
import CategoryBar from "@/components/CategoryBar";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const categorySlug = params.category;

  if (categorySlug) {
    const categories = await getCategories();
    const category = categories.find((c) => c.slug === categorySlug);
    const categoryName = category?.name ?? categorySlug;

    return {
      title: `${categoryName} — AutOwner`,
      description: `Browse ${categoryName} articles, guides, and discussions on AutOwner. Find expert advice, DIY tutorials, and community knowledge for car maintenance, repair, detailing, and modifications.`,
      alternates: {
        canonical: `https://www.autowner.com?category=${categorySlug}`,
      },
    };
  }

  return {
    title: "AutOwner — Car Aftermarket Community",
    description:
      "AutOwner is the home garage community for car enthusiasts. Find expert guides on DIY repair, maintenance, detailing, buying advice, and modifications. Join discussions, share your build, and learn from ASE-certified mechanics and fellow gearheads.",
    alternates: {
      canonical: "https://www.autowner.com",
    },
  };
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const sort = (params.sort ?? "hot") as "hot" | "new" | "popular";
  const categorySlug = params.category;
  const tagSlug = params.tag;
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);

  const [{ posts, totalCount }, pinnedPosts, user, categories] = await Promise.all([
    getPosts({ sort, categorySlug, tagSlug, page }),
    getPinnedPosts(4),
    getCurrentUser(),
    getCategories(),
  ]);

  const activeCategoryName = categorySlug
    ? posts?.[0]?.categories?.name ?? categorySlug
    : undefined;

  return (
    <div className="min-h-screen bg-surface-0 relative flex flex-col">
      <Navbar />
      <div className="max-w-7xl mx-auto px-5 py-6 flex gap-8 flex-1">
        <Sidebar active={categorySlug} />
        <main id="main-content" className="flex-1 min-w-0 relative z-[1]">
          <CategoryBar categories={categories} active={categorySlug} />
          <FeaturedCarousel posts={pinnedPosts} />
          {activeCategoryName && (
            <div className="mb-5 pb-4 border-b border-surface-border">
              <p className="text-xs font-bold uppercase tracking-widest text-text-muted font-heading mb-1">Browsing</p>
              <h2 className="text-xl font-bold text-text-primary font-heading">{activeCategoryName}</h2>
            </div>
          )}
          <div className="flex items-center justify-between mb-5">
            <SortToggle />
            {posts.length > 0 && <span className="text-xs text-text-muted">{posts.length} posts</span>}
          </div>
          <PostFeed posts={posts} userId={user?.id} />
          <Pagination page={page} totalCount={totalCount} />
        </main>
      </div>
      <Footer />
    </div>
  );
}
