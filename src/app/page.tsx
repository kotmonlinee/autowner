import type { Metadata } from "next";
import { getPosts, getPinnedPosts, getCurrentUser, getCategories, getUserVehicles, getEngineById } from "@/lib/data/server";
import { createServerSupabase } from "@/lib/supabase-server";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import PostFeed from "@/components/PostFeed";
import SortToggle from "@/components/SortToggle";
import Pagination from "@/components/Pagination";
import FeaturedCarousel from "@/components/FeaturedCarousel";
import Footer from "@/components/Footer";
import CategoryBar from "@/components/CategoryBar";
import WelcomeBanner from "@/components/WelcomeBanner";
import Link from "next/link";

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

function buildVehicleDisplayName(v: Record<string, unknown>): string {
  const eng = v.vehicle_engines as Record<string, unknown> | null;
  if (!eng) return "your vehicle";
  const gen = eng.vehicle_generations as Record<string, unknown> | null | undefined;
  const model = gen?.vehicle_models as Record<string, unknown> | null | undefined;
  const make = model?.vehicle_makes as Record<string, unknown> | null | undefined;
  const parts = [make?.name as string, model?.name as string].filter(Boolean);
  if (v.year) parts.push(`(${v.year})`);
  return parts.join(" ") || (eng.name as string) || (eng.code as string) || "your vehicle";
}

function buildEngineDisplayName(engine: Record<string, unknown>): string {
  const gen = engine.vehicle_generations as Record<string, unknown> | null;
  const model = gen?.vehicle_models as Record<string, unknown> | null;
  const make = model?.vehicle_makes as Record<string, unknown> | null;
  const parts = [make?.name as string, model?.name as string].filter(Boolean);
  return parts.join(" ") || (engine.name as string) || (engine.code as string) || "your vehicle";
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
  const myVehicle = params.my_vehicle === "1";
  const showWelcome = params.welcome === "1";
  const engineIdParam = params.engine_id;

  const [user, categories] = await Promise.all([
    getCurrentUser(),
    getCategories(),
  ]);

  // Resolve primary vehicle for filtering and relevance
  let primaryEngineId: string | null = null;
  let primaryVehicleName: string | null = null;
  if (user) {
    const vehicles = (await getUserVehicles(user.id)) as Record<string, unknown>[];
    const primary = vehicles.find((v) => v.is_primary === true);
    if (primary?.engine_id) {
      primaryEngineId = primary.engine_id as string;
      primaryVehicleName = buildVehicleDisplayName(primary);
    }
  }

  // Determine the effective filter engine ID:
  // - my_vehicle=1 + logged-in primary vehicle → DB engine ID
  // - my_vehicle=1 + anonymous (engine_id param) → param engine ID
  // - engine_id param without my_vehicle → still filter (anonymous direct link)
  let filterEngineId: string | null = null;
  let filterVehicleName: string | null = null;

  if (myVehicle && primaryEngineId) {
    filterEngineId = primaryEngineId;
    filterVehicleName = primaryVehicleName;
  } else if (myVehicle && engineIdParam) {
    filterEngineId = engineIdParam;
    // Resolve engine name for anonymous filter banner
    const engineInfo = await getEngineById(engineIdParam);
    if (engineInfo) {
      filterVehicleName = buildEngineDisplayName(engineInfo);
    }
  } else if (engineIdParam) {
    // engine_id without my_vehicle still filters (e.g., direct link from vehicle page)
    filterEngineId = engineIdParam;
    const engineInfo = await getEngineById(engineIdParam);
    if (engineInfo) {
      filterVehicleName = buildEngineDisplayName(engineInfo);
    }
  }

  // Fetch matching post IDs for the relevance badge (Feature 2)
  let matchingPostIds: string[] = [];
  if (primaryEngineId) {
    const supabase = await createServerSupabase();
    const { data: links } = await supabase
      .from("post_vehicles")
      .select("post_id")
      .eq("engine_id", primaryEngineId);
    matchingPostIds = (links ?? []).map((l) => l.post_id);
  }

  // Set up getPosts params
  const engineId = filterEngineId ?? undefined;
  const boostEngineId = !myVehicle && primaryEngineId ? primaryEngineId : undefined;

  const [{ posts, totalCount }, pinnedPosts] = await Promise.all([
    getPosts({ sort, categorySlug, tagSlug, page, engineId, boostEngineId }),
    getPinnedPosts(4),
  ]);

  const activeCategoryName = categorySlug
    ? posts?.[0]?.categories?.name ?? categorySlug
    : undefined;

  // Build clear-filter href preserving other params
  const clearParams = new URLSearchParams();
  if (params.sort) clearParams.set("sort", params.sort);
  if (params.category) clearParams.set("category", params.category);
  if (params.tag) clearParams.set("tag", params.tag);
  if (params.page) clearParams.set("page", params.page);
  const clearFilterHref = clearParams.toString() ? `/?${clearParams.toString()}` : "/";

  return (
    <div className="min-h-screen bg-surface-0 relative flex flex-col">
      <Navbar />
      <div className="max-w-7xl mx-auto px-5 py-6 flex gap-8 flex-1">
        <Sidebar active={categorySlug} />
        <main id="main-content" className="flex-1 min-w-0 relative z-[1]">
          <CategoryBar categories={categories} active={categorySlug} />
          <FeaturedCarousel posts={pinnedPosts} />

          {/* Welcome banner for new registrations */}
          {showWelcome && <WelcomeBanner />}

          {/* My Vehicle filter banner */}
          {filterEngineId && filterVehicleName && (
            <div className="mb-5 p-3.5 bg-amber-400/5 border border-amber-400/20 rounded-xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-amber-400/15 flex items-center justify-center shrink-0">
                  <svg
                    className="w-4 h-4 text-amber-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 17h14v2H5zM6 10l3-3 3 3 3-3 3 3v5H3v-5l3-3z" />
                    <circle cx="9" cy="17" r="1" />
                    <circle cx="15" cy="17" r="1" />
                  </svg>
                </div>
                <span className="text-sm text-amber-300 font-medium truncate">
                  Showing results for your {filterVehicleName}
                </span>
              </div>
              <Link
                href={clearFilterHref}
                className="shrink-0 text-xs text-amber-400 hover:text-amber-300 font-medium transition-colors"
              >
                Clear filter
              </Link>
            </div>
          )}

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
          <PostFeed posts={posts} userId={user?.id} matchingPostIds={matchingPostIds} />
          <Pagination page={page} totalCount={totalCount} />
        </main>
      </div>
      <Footer />
    </div>
  );
}
