import { getPendingPosts, updatePostStatus, togglePin, searchPostsAdmin } from "@/lib/data/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Link from "next/link";
import DeleteButton from "./edit/[id]/DeleteButton";

interface AdminStats {
  totalPosts: number;
  totalUsers: number;
  totalComments: number;
  totalVotes: number;
  postsByCategory: { name: string; slug: string; count: number }[];
  postsByContentType: Record<string, number>;
  postsBySource: { user: number; scraped: number };
}

async function getAdminStats(): Promise<AdminStats> {
  const supabase = await createServerSupabase();

  const [
    { count: totalPosts },
    { count: totalUsers },
    { count: totalComments },
    { count: totalVotes },
  ] = await Promise.all([
    supabase.from("posts").select("id", { count: "exact", head: true }),
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("comments").select("id", { count: "exact", head: true }),
    supabase.from("votes").select("id", { count: "exact", head: true }),
  ]);

  const [{ count: userCount }, { count: scrapedCount }] = await Promise.all([
    supabase.from("posts").select("id", { count: "exact", head: true }).eq("source", "user"),
    supabase.from("posts").select("id", { count: "exact", head: true }).eq("source", "scraped"),
  ]);

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("sort_order");

  const postsByCategory: { name: string; slug: string; count: number }[] = [];
  for (const cat of categories ?? []) {
    const { count } = await supabase
      .from("posts")
      .select("id", { count: "exact", head: true })
      .eq("category_id", cat.id);
    postsByCategory.push({ name: cat.name, slug: cat.slug, count: count ?? 0 });
  }

  const { data: contentTypeData } = await supabase.from("posts").select("content_type");
  const postsByContentType: Record<string, number> = {};
  for (const row of contentTypeData ?? []) {
    const type = row.content_type ?? "unclassified";
    postsByContentType[type] = (postsByContentType[type] ?? 0) + 1;
  }

  return {
    totalPosts: totalPosts ?? 0,
    totalUsers: totalUsers ?? 0,
    totalComments: totalComments ?? 0,
    totalVotes: totalVotes ?? 0,
    postsByCategory,
    postsByContentType,
    postsBySource: { user: userCount ?? 0, scraped: scrapedCount ?? 0 },
  };
}

interface RecentUser {
  id: string;
  username: string;
  created_at: string;
  post_count: number;
}

async function getRecentUsers(limit = 20): Promise<RecentUser[]> {
  const supabase = await createServerSupabase();

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, username, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (!profiles?.length) return [];

  // Fetch post counts for each user
  const users: RecentUser[] = [];
  for (const p of profiles) {
    const { count } = await supabase
      .from("posts")
      .select("id", { count: "exact", head: true })
      .eq("author_id", p.id);
    users.push({
      id: p.id,
      username: p.username,
      created_at: p.created_at,
      post_count: count ?? 0,
    });
  }

  return users;
}

export default async function AdminPage({ searchParams }: { searchParams?: Promise<{ q?: string }> }) {
  const sp = await Promise.resolve(searchParams);
  const searchQuery = sp?.q ?? "";
  const [posts, stats, searchResults, users] = await Promise.all([
    getPendingPosts(),
    getAdminStats(),
    searchQuery ? searchPostsAdmin(searchQuery) : Promise.resolve(null),
    getRecentUsers(),
  ]);

  return (
    <div>
      {/* ── Stats Overview ── */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary font-heading mb-1">Admin Dashboard</h1>
        <p className="text-sm text-text-muted mb-4">Content overview and review queue</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <StatCard label="Total Posts" value={stats.totalPosts} />
          <StatCard label="Users" value={stats.totalUsers} />
          <StatCard label="Comments" value={stats.totalComments} />
          <StatCard label="Votes" value={stats.totalVotes} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Source breakdown */}
          <div className="bg-surface-1 rounded-xl border border-surface-border p-4">
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3 font-heading">
              Posts by Source
            </h3>
            <div className="space-y-2">
              <SourceRow label="User-submitted" count={stats.postsBySource.user} color="bg-primary" />
              <SourceRow label="Scraped" count={stats.postsBySource.scraped} color="bg-amber-400" />
            </div>
          </div>

          {/* Category breakdown */}
          <div className="bg-surface-1 rounded-xl border border-surface-border p-4">
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3 font-heading">
              Posts by Category
            </h3>
            <div className="space-y-1.5">
              {stats.postsByCategory
                .sort((a, b) => b.count - a.count)
                .map((cat) => (
                  <div key={cat.slug} className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary truncate mr-2">{cat.name}</span>
                    <span className="text-text-primary font-bold font-heading tabular-nums">{cat.count}</span>
                  </div>
                ))}
            </div>
          </div>

          {/* Content type breakdown */}
          <div className="bg-surface-1 rounded-xl border border-surface-border p-4">
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3 font-heading">
              Posts by Type
            </h3>
            <div className="space-y-1.5">
              {Object.entries(stats.postsByContentType)
                .sort(([, a], [, b]) => b - a)
                .map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary truncate mr-2 capitalize">{type}</span>
                    <span className="text-text-primary font-bold font-heading tabular-nums">{count}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Review Queue ── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-text-primary font-heading">Content Review</h2>
          <p className="text-sm text-text-muted mt-1">Review and approve scraped content</p>
        </div>
        <form action={async () => {
          "use server";
          const { getCurrentUser } = await import("@/lib/data/server");
          const user = await getCurrentUser();
          if (!user) redirect("/auth/login");
          await fetch(`${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/api/scrape`, {
            method: "POST",
            headers: { "x-scrape-secret": process.env.SCRAPE_API_SECRET! },
          });
          revalidatePath("/admin");
          revalidatePath("/");
        }}>
          <button className="px-4 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-glow hover:-translate-y-px transition-all duration-150 font-heading shadow-sm shadow-primary/20">
            Trigger Scrape
          </button>
        </form>
      </div>

      <div className="space-y-2">
        {posts?.length === 0 && (
          <div className="bg-surface-1 rounded-xl border border-surface-border p-12 text-center">
            <p className="text-text-secondary font-heading font-semibold">No posts pending review</p>
            <p className="text-sm text-text-muted mt-1">All scraped content has been processed</p>
          </div>
        )}
        {posts?.map((post: any) => (
          <div key={post.id} className="bg-surface-1 rounded-xl border border-surface-border p-4 flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <Link href={`/post/${post.id}`} className="font-semibold text-text-primary hover:text-primary transition-colors font-heading">{post.title}</Link>
              <div className="flex items-center gap-3 text-xs text-text-muted mt-1.5">
                <span className="px-1.5 py-0.5 bg-surface-3 rounded text-[10px] font-bold uppercase font-heading">{post.categories?.name}</span>
                <span className="px-1.5 py-0.5 bg-amber-400/10 text-amber-400 rounded text-[10px] font-bold uppercase border border-amber-400/20">{post.source}</span>
                <span>{new Date(post.created_at).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-4 shrink-0">
              <Link
                href={`/admin/edit/${post.id}`}
                className="px-4 py-2 bg-surface-3 text-text-secondary rounded-lg text-sm font-bold hover:bg-surface-4 hover:text-text-primary transition-colors font-heading border border-surface-border"
              >
                Edit
              </Link>
              <form action={async () => {
                "use server";
                await togglePin(post.id, post.is_pinned ?? false);
                revalidatePath("/admin");
              }}>
                <button className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors font-heading border ${
                  post.is_pinned
                    ? "bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500/20"
                    : "bg-surface-3 text-text-muted border-surface-border hover:bg-surface-4 hover:text-text-secondary"
                }`}>
                  {post.is_pinned ? "Unpin" : "Pin"}
                </button>
              </form>
              <form action={async () => {
                "use server";
                await updatePostStatus(post.id, "approved");
                revalidatePath("/admin");
              }}>
                <button className="px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-lg text-sm font-bold hover:bg-emerald-500/20 transition-colors font-heading border border-emerald-500/20">Approve</button>
              </form>
              <form action={async () => {
                "use server";
                await updatePostStatus(post.id, "rejected");
                revalidatePath("/admin");
              }}>
                <button className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg text-sm font-bold hover:bg-red-500/20 transition-colors font-heading border border-red-500/20">Reject</button>
              </form>
              <DeleteButton postId={post.id} redirectTo="/admin" />
            </div>
          </div>
        ))}
      </div>

      {/* ── Manage All Posts ── */}
      <div className="mt-12 pt-8 border-t border-surface-border">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-text-primary font-heading">Manage Posts</h2>
            <p className="text-sm text-text-muted mt-1">Search and edit any post regardless of status</p>
          </div>
        </div>

        <form method="get" action="/admin" className="mb-6">
          <div className="flex gap-2">
            <input
              type="search"
              name="q"
              defaultValue={searchQuery}
              placeholder="Search posts by title..."
              className="flex-1 px-4 py-2.5 bg-surface-1 border border-surface-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors placeholder:text-text-muted"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary-glow hover:-translate-y-px transition-all duration-150 font-heading shadow-sm shadow-primary/20"
            >
              Search
            </button>
            {searchQuery && (
              <a
                href="/admin"
                className="px-4 py-2.5 text-sm font-bold text-text-muted hover:text-text-secondary transition-colors font-heading"
              >
                Clear
              </a>
            )}
          </div>
        </form>

        {searchResults === null && !searchQuery && (
          <div className="bg-surface-1 rounded-xl border border-surface-border p-12 text-center">
            <p className="text-text-secondary font-heading font-semibold">Search for posts</p>
            <p className="text-sm text-text-muted mt-1">Enter a title keyword to find and manage posts</p>
          </div>
        )}

        {searchResults !== null && searchResults.length === 0 && (
          <div className="bg-surface-1 rounded-xl border border-surface-border p-12 text-center">
            <p className="text-text-secondary font-heading font-semibold">No posts found</p>
            <p className="text-sm text-text-muted mt-1">No posts match &quot;{searchQuery}&quot;</p>
          </div>
        )}

        {searchResults && searchResults.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-text-muted mb-3">{searchResults.length} post{searchResults.length !== 1 ? "s" : ""} found</p>
            {searchResults.map((post: any) => (
              <div key={post.id} className="bg-surface-1 rounded-xl border border-surface-border p-4 flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <Link href={`/post/${post.id}`} className="font-semibold text-text-primary hover:text-primary transition-colors font-heading">{post.title}</Link>
                  <div className="flex items-center gap-3 text-xs text-text-muted mt-1.5">
                    <span className="px-1.5 py-0.5 bg-surface-3 rounded text-[10px] font-bold uppercase font-heading">{post.categories?.name ?? "none"}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase border ${
                      post.status === "approved"
                        ? "bg-emerald-400/10 text-emerald-400 border-emerald-400/20"
                        : post.status === "rejected"
                        ? "bg-red-400/10 text-red-400 border-red-400/20"
                        : "bg-amber-400/10 text-amber-400 border-amber-400/20"
                    }`}>{post.status}</span>
                    <span className="px-1.5 py-0.5 bg-amber-400/10 text-amber-400 rounded text-[10px] font-bold uppercase border border-amber-400/20">{post.source}</span>
                    <span>{new Date(post.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4 shrink-0">
                  <Link
                    href={`/admin/edit/${post.id}`}
                    className="px-4 py-2 bg-surface-3 text-text-secondary rounded-lg text-sm font-bold hover:bg-surface-4 hover:text-text-primary transition-colors font-heading border border-surface-border"
                  >
                    Edit
                  </Link>
                  <DeleteButton postId={post.id} redirectTo="/admin" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Recent Users ── */}
      <div className="mt-12 pt-8 border-t border-surface-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-text-primary font-heading">Recent Users</h2>
            <p className="text-sm text-text-muted mt-1">Recently joined members and their post counts</p>
          </div>
        </div>

        {users.length === 0 ? (
          <div className="bg-surface-1 rounded-xl border border-surface-border p-12 text-center">
            <p className="text-text-secondary font-heading font-semibold">No users yet</p>
            <p className="text-sm text-text-muted mt-1">User registrations will appear here</p>
          </div>
        ) : (
          <div className="bg-surface-1 rounded-xl border border-surface-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-border bg-surface-2/50">
                  <th className="text-left px-4 py-3 text-xs font-bold text-text-muted uppercase tracking-wider font-heading">
                    Username
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-text-muted uppercase tracking-wider font-heading">
                    Joined
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-bold text-text-muted uppercase tracking-wider font-heading">
                    Posts
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-bold text-text-muted uppercase tracking-wider font-heading">
                    Profile
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-surface-2/30 transition-colors">
                    <td className="px-4 py-3">
                      <span className="text-text-primary font-semibold font-heading">{user.username}</span>
                    </td>
                    <td className="px-4 py-3 text-text-muted whitespace-nowrap">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-text-primary font-bold font-heading tabular-nums">
                        {user.post_count}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/user/${user.username}`}
                        className="text-primary hover:text-primary-glow text-xs font-bold font-heading transition-colors"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-surface-1 rounded-xl border border-surface-border p-4">
      <p className="text-xs text-text-muted uppercase tracking-wider font-bold font-heading mb-1">{label}</p>
      <p className="text-2xl font-bold text-text-primary font-heading tabular-nums">{value.toLocaleString()}</p>
    </div>
  );
}

function SourceRow({ label, count, color }: { label: string; count: number; color: string }) {
  const max = 100; // arbitrary visual scale
  const pct = Math.min((count / Math.max(count + 5, 1)) * max, max);
  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-1">
        <span className="text-text-secondary">{label}</span>
        <span className="text-text-primary font-bold font-heading tabular-nums">{count}</span>
      </div>
      <div className="h-1.5 bg-surface-3 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
