// Server-side data access — ONLY used in server components and API routes.
// All Supabase calls live here so migrating to a different DB only changes this file.
import { createServerSupabase } from "@/lib/supabase-server";
import type { PostWithRelations, Category, CommentWithAuthor, CommentWithPost, Notification, ObdCode, RepairCostRow, RepairCostTier, RepairCostFull } from "@/lib/types";
import { MAKE_TIER, TIER_LABELS } from "@/lib/constants";

// ── Slug helpers ─────────────────────────────────────────

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 200);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function ensureUniqueSlug(
  supabase: any,
  baseSlug: string,
  excludeId?: string,
): Promise<string> {
  let slug = baseSlug;
  let attempt = 0;
  while (attempt < 10) {
    let query = supabase.from("posts").select("id").eq("slug", slug);
    if (excludeId) query = query.neq("id", excludeId);
    const { data } = await query.maybeSingle();
    if (!data) return slug;
    attempt++;
    slug = `${baseSlug}-${attempt}`;
  }
  // Fallback: append random suffix
  const suffix = Math.random().toString(36).substring(2, 8);
  return `${baseSlug}-${suffix}`;
}

// ── Posts ────────────────────────────────────────────────

// Columns for post lists (excludes heavy fields: body, search_vector, quick_answer)
const POST_LIST = "id, title, slug, created_at, updated_at, author_id, category_id, status, source, content_type, vote_score, view_count, comment_count, is_pinned, thumbnail_url, reading_time_minutes";

export async function getPosts(opts: {
  sort?: "hot" | "new" | "popular";
  categorySlug?: string;
  tagSlug?: string;
  search?: string;
  limit?: number;
  page?: number;
  engineId?: string;
  boostEngineId?: string;
}): Promise<{ posts: PostWithRelations[]; totalCount: number }> {
  const supabase = await createServerSupabase();
  const limit = opts.limit ?? 30;
  const page = opts.page ?? 1;
  const offset = (page - 1) * limit;
  const selectCols = "*, profiles(username, avatar_url), categories(name, slug), post_tags(car_tags(name, slug))";

  // Build base query — start with .select() so filters like .eq() resolve on
  // PostgrestFilterBuilder. The select columns are overridden at the end.
  let query = supabase
    .from("posts")
    .select("id")
    .eq("status", "approved")
    .or("is_draft.is.null,is_draft.eq.false");

  if (opts.categorySlug) {
    const { data: cat } = await supabase.from("categories").select("id").eq("slug", opts.categorySlug).single();
    if (cat) query = query.eq("category_id", cat.id);
  }

  if (opts.tagSlug) {
    const { data: tag } = await supabase.from("car_tags").select("id").eq("slug", opts.tagSlug).single();
    if (tag) {
      const { data: postIds } = await supabase.from("post_tags").select("post_id").eq("tag_id", tag.id);
      if (postIds?.length) query = query.in("id", postIds.map(p => p.post_id));
    }
  }

  // Resolve engineId filter — only return posts linked to this engine
  if (opts.engineId) {
    const { data: engineLinks } = await supabase
      .from("post_vehicles")
      .select("post_id")
      .eq("engine_id", opts.engineId);
    if (engineLinks?.length) {
      query = query.in("id", engineLinks.map((l) => l.post_id));
    } else {
      return { posts: [], totalCount: 0 };
    }
  }

  // Resolve boostEngineId into a set of post IDs for hot-sort boosting
  let vehicleBoostPostIds: Set<string> = new Set();
  if (opts.boostEngineId) {
    const { data: boostLinks } = await supabase
      .from("post_vehicles")
      .select("post_id")
      .eq("engine_id", opts.boostEngineId);
    vehicleBoostPostIds = new Set((boostLinks ?? []).map((l) => l.post_id));
  }

  if (opts.search) {
    // Full-text search via tsvector — textSearch automatically orders by relevance.
    query = query.textSearch("search_vector", opts.search, { config: "english" });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, count } = await (query as any)
      .select(selectCols, { count: "estimated" })
      .range(offset, offset + limit - 1);
    return {
      posts: (data as unknown as PostWithRelations[]) ?? [],
      totalCount: count ?? 0,
    };
  }

  if (opts.sort === "new") {
    query = query.order("created_at", { ascending: false });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, count } = await (query as any)
      .select(selectCols, { count: "estimated" })
      .range(offset, offset + limit - 1);
    return {
      posts: (data as unknown as PostWithRelations[]) ?? [],
      totalCount: count ?? 0,
    };
  }

  if (opts.sort === "popular") {
    // Popular sort: posts with the most views first.
    query = query.order("view_count", { ascending: false });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, count } = await (query as any)
      .select(selectCols, { count: "estimated" })
      .range(offset, offset + limit - 1);
    return {
      posts: (data as unknown as PostWithRelations[]) ?? [],
      totalCount: count ?? 0,
    };
  }

  // "hot" sort (default): boost guide/review content.
  // Fetch more than the limit since we re-sort in JS — guide posts may
  // have low vote_score and be outside the first N results.
  // Supabase caps single queries at 1,000 rows.
  query = query.order("vote_score", { ascending: false });

  const fetchSize = Math.min(Math.max(limit * 2, 200), 1000);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, count } = await (query as any)
    .select(selectCols, { count: "estimated" })
    .range(0, fetchSize - 1);

  const results = (data as unknown as PostWithRelations[]) ?? [];

  results.sort((a, b) => {
    // Pinned first, then guide/review + vehicle boost, then vote_score
    const aPinned = a.is_pinned ? 1 : 0;
    const bPinned = b.is_pinned ? 1 : 0;
    if (aPinned !== bPinned) return bPinned - aPinned;

    const aGuideBoost = a.content_type === "guide" || a.content_type === "review" ? 1 : 0;
    const bGuideBoost = b.content_type === "guide" || b.content_type === "review" ? 1 : 0;
    const aVehicleBoost = vehicleBoostPostIds.has(a.id) ? 1 : 0;
    const bVehicleBoost = vehicleBoostPostIds.has(b.id) ? 1 : 0;
    const aBoost = aGuideBoost + aVehicleBoost;
    const bBoost = bGuideBoost + bVehicleBoost;
    if (aBoost !== bBoost) return bBoost - aBoost;
    return (b.vote_score ?? 0) - (a.vote_score ?? 0);
  });

  // Paginate the already-fetched and sorted results.
  // Total count may be higher than what we fetched due to Supabase row cap.
  const paginatedPosts = results.slice(offset, offset + limit);

  return {
    posts: paginatedPosts,
    totalCount: Math.min(count ?? 0, fetchSize),
  };
}

export async function getPostById(id: string): Promise<PostWithRelations | null> {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("posts")
    .select("*, profiles(username, avatar_url), categories(name, slug), post_tags(car_tags(name, slug))")
    .eq("id", id)
    .eq("status", "approved")
    .single();
  return data ? (data as unknown as PostWithRelations) : null;
}

/** Admin: fetch post by ID regardless of status */
export async function getPostByIdAdmin(id: string): Promise<PostWithRelations | null> {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("posts")
    .select("*, profiles(username, avatar_url), categories(name, slug), post_tags(car_tags(name, slug))")
    .eq("id", id)
    .single();
  return data ? (data as unknown as PostWithRelations) : null;
}

/** Fetch post by ID regardless of status (for deleted post page rendering). */
export async function getPostByIdAny(id: string): Promise<PostWithRelations | null> {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("posts")
    .select("*, profiles(username, avatar_url), categories(name, slug), post_tags(car_tags(name, slug))")
    .eq("id", id)
    .single();
  return data ? (data as unknown as PostWithRelations) : null;
}

/** Fetch post by slug (for SEO-friendly URLs). */
export async function getPostBySlug(slug: string): Promise<PostWithRelations | null> {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("posts")
    .select("*, profiles(username, avatar_url), categories(name, slug), post_tags(car_tags(name, slug))")
    .eq("slug", slug)
    .eq("status", "approved")
    .single();
  return data ? (data as unknown as PostWithRelations) : null;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export async function getRelatedPosts(categoryId: string, excludeId: string, limit = 5) {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("posts")
    .select("id, slug, title, comment_count, vote_score")
    .eq("category_id", categoryId)
    .eq("status", "approved")
    .neq("id", excludeId)
    .order("vote_score", { ascending: false })
    .limit(limit);
  return data ?? [];
}

export async function getRandomRelatedPosts(categoryId: string, excludeId: string, limit = 3) {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("posts")
    .select("id, slug, title, comment_count, vote_score")
    .eq("category_id", categoryId)
    .eq("status", "approved")
    .neq("id", excludeId)
    .limit(50);
  return shuffle(data ?? []).slice(0, limit);
}

// ── Categories ───────────────────────────────────────────

export async function getTrendingPosts(limit = 5) {
  const supabase = await createServerSupabase();
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const { data } = await supabase
    .from("posts")
    .select("id, slug, title, comment_count")
    .eq("status", "approved")
    .gte("created_at", thirtyDaysAgo)
    .order("comment_count", { ascending: false })
    .limit(limit);
  return data ?? [];
}

export async function getPinnedPosts(limit = 4): Promise<PostWithRelations[]> {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("posts")
    .select("*, profiles(username, avatar_url), categories(name, slug), post_tags(car_tags(name, slug))")
    .eq("is_pinned", true)
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data as unknown as PostWithRelations[]) ?? [];
}

export async function getCategories(): Promise<Category[]> {
  const supabase = await createServerSupabase();
  const { data } = await supabase.from("categories").select("*").order("sort_order");
  return (data as unknown as Category[]) ?? [];
}

export async function getPopularTags(limit = 15) {
  const supabase = await createServerSupabase();
  const { data: tags } = await supabase
    .from("car_tags")
    .select("id, name, slug")
    .order("name");

  if (!tags?.length) return [];

  // Batch all post count queries in parallel instead of N+1 loop
  const counts = await Promise.all(
    tags.map((tag) =>
      supabase
        .from("post_tags")
        .select("id", { count: "exact", head: true })
        .eq("tag_id", tag.id),
    ),
  );

  const result: { id: string; name: string; slug: string; post_count: number }[] = [];
  for (let i = 0; i < tags.length; i++) {
    if (counts[i].count && counts[i].count! > 0) {
      result.push({
        id: tags[i].id,
        name: tags[i].name,
        slug: tags[i].slug,
        post_count: counts[i].count!,
      });
    }
  }

  result.sort((a, b) => b.post_count - a.post_count);
  return result.slice(0, limit);
}

// ── Comments ─────────────────────────────────────────────

export async function insertComment(
  postId: string,
  authorId: string,
  body: string,
  parentId?: string | null,
): Promise<CommentWithAuthor> {
  const supabase = await createServerSupabase();
  const insertData: Record<string, unknown> = { post_id: postId, author_id: authorId, body };
  if (parentId) insertData.parent_id = parentId;
  const { data, error } = await supabase
    .from("comments")
    .insert(insertData)
    .select("*, profiles(username, avatar_url)")
    .single();
  if (error) throw error;
  return data as unknown as CommentWithAuthor;
}

// ── Votes ────────────────────────────────────────────────

export async function processVote(
  userId: string,
  targetType: "post" | "comment",
  targetId: string,
  direction: "up" | "down"
): Promise<{ newScore: number; newVote: string | null }> {
  const supabase = await createServerSupabase();

  const { data: existing } = await supabase
    .from("votes")
    .select("id, direction")
    .eq("user_id", userId)
    .eq("target_type", targetType)
    .eq("target_id", targetId)
    .single();

  let scoreDelta = 0;
  let newVote: string | null = direction;

  if (existing) {
    if (existing.direction === direction) {
      await supabase.from("votes").delete().eq("id", existing.id);
      scoreDelta = direction === "up" ? -1 : 1;
      newVote = null;
    } else {
      await supabase.from("votes").update({ direction }).eq("id", existing.id);
      scoreDelta = direction === "up" ? 2 : -2;
    }
  } else {
    await supabase.from("votes").insert({ user_id: userId, target_type: targetType, target_id: targetId, direction });
    scoreDelta = direction === "up" ? 1 : -1;
  }

  const table = targetType === "post" ? "posts" : "comments";
  const { data: current } = await supabase.from(table).select("vote_score").eq("id", targetId).single();
  const newScore = (current?.vote_score ?? 0) + scoreDelta;
  await supabase.from(table).update({ vote_score: newScore }).eq("id", targetId);

  return { newScore, newVote };
}

// ── Bookmarks ────────────────────────────────────────────

export async function getBookmarkedPosts(userId: string): Promise<PostWithRelations[]> {
  const supabase = await createServerSupabase();

  const { data: bookmarkRows } = await supabase
    .from("bookmarks")
    .select("post_id")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (!bookmarkRows?.length) return [];

  const postIds = bookmarkRows.map((b) => b.post_id);

  // Fetch posts in a second query with all relations.
  // We re-sort by bookmark order in JS since .in() loses ordering.
  const { data: posts } = await supabase
    .from("posts")
    .select("*, profiles(username, avatar_url), categories(name, slug), post_tags(car_tags(name, slug))")
    .in("id", postIds)
    .eq("status", "approved");

  if (!posts?.length) return [];

  // Preserve bookmark order
  const postMap = new Map((posts as unknown as PostWithRelations[]).map((p) => [p.id, p]));
  return postIds
    .map((id) => postMap.get(id))
    .filter(Boolean) as PostWithRelations[];
}

export async function toggleBookmark(userId: string, postId: string): Promise<boolean> {
  const supabase = await createServerSupabase();
  const { data: existing } = await supabase
    .from("bookmarks")
    .select("id")
    .eq("user_id", userId)
    .eq("post_id", postId)
    .single();

  if (existing) {
    await supabase.from("bookmarks").delete().eq("id", existing.id);
    return false;
  } else {
    await supabase.from("bookmarks").insert({ user_id: userId, post_id: postId });
    return true;
  }
}

// ── Posts (mutations) ────────────────────────────────────

export async function createPost(opts: {
  title: string;
  body: string;
  categoryId: string;
  authorId: string;
  tags: { name: string; slug: string }[];
  quickAnswer?: Record<string, unknown> | null;
  engineIds?: string[];
}) {
  const supabase = await createServerSupabase();
  const baseSlug = generateSlug(opts.title);
  const uniqueSlug = await ensureUniqueSlug(supabase, baseSlug || "post");
  const insertData: Record<string, unknown> = {
    title: opts.title,
    body: opts.body,
    slug: uniqueSlug,
    author_id: opts.authorId,
    category_id: opts.categoryId || null,
    source: "user",
    status: "approved",
  };
  if (opts.quickAnswer) {
    insertData.quick_answer = opts.quickAnswer;
  }
  const { data: post, error } = await supabase
    .from("posts")
    .insert(insertData)
    .select("id")
    .single();

  if (error || !post) throw error ?? new Error("Failed to create post");

  for (const tag of opts.tags) {
    const { data: existing } = await supabase.from("car_tags").select("id").eq("slug", tag.slug).single();
    let tagId = existing?.id;
    if (!tagId) {
      const { data: created } = await supabase.from("car_tags").insert({ name: tag.name, slug: tag.slug }).select("id").single();
      tagId = created?.id;
    }
    if (tagId) await supabase.from("post_tags").insert({ post_id: post.id, tag_id: tagId });
  }

  // Link vehicle engines
  if (opts.engineIds?.length) {
    for (const engineId of opts.engineIds) {
      await supabase.from("post_vehicles").upsert(
        { post_id: post.id, engine_id: engineId },
        { onConflict: "post_id,engine_id" },
      );
    }
  }

  return post.id;
}

// ── Drafts ────────────────────────────────────────────────

export async function saveDraft(opts: {
  id?: string;
  title: string;
  body: string;
  categoryId: string;
  authorId: string;
  tags: { name: string; slug: string }[];
  quickAnswer?: Record<string, unknown> | null;
  engineIds?: string[];
}): Promise<string> {
  const supabase = await createServerSupabase();

  if (opts.id) {
    // Update existing draft
    // If title changed, regenerate slug
    const { data: existingDraft } = await supabase
      .from("posts")
      .select("title, slug")
      .eq("id", opts.id)
      .single();
    const updateData: Record<string, unknown> = {
      title: opts.title,
      body: opts.body,
      category_id: opts.categoryId || null,
      is_draft: true,
      updated_at: new Date().toISOString(),
    };
    if (existingDraft && existingDraft.title !== opts.title) {
      const baseSlug = generateSlug(opts.title);
      updateData.slug = await ensureUniqueSlug(supabase, baseSlug || "post", opts.id);
    }
    if (opts.quickAnswer !== undefined) {
      updateData.quick_answer = opts.quickAnswer;
    }
    const { error } = await supabase
      .from("posts")
      .update(updateData)
      .eq("id", opts.id)
      .eq("author_id", opts.authorId);

    if (error) throw error;

    // Update tags: delete existing, re-insert
    await supabase.from("post_tags").delete().eq("post_id", opts.id);
    for (const tag of opts.tags) {
      const { data: existing } = await supabase.from("car_tags").select("id").eq("slug", tag.slug).single();
      let tagId = existing?.id;
      if (!tagId) {
        const { data: created } = await supabase.from("car_tags").insert({ name: tag.name, slug: tag.slug }).select("id").single();
        tagId = created?.id;
      }
      if (tagId) await supabase.from("post_tags").insert({ post_id: opts.id, tag_id: tagId });
    }

    // Update vehicle links
    await supabase.from("post_vehicles").delete().eq("post_id", opts.id);
    if (opts.engineIds?.length) {
      for (const engineId of opts.engineIds) {
        await supabase.from("post_vehicles").upsert(
          { post_id: opts.id, engine_id: engineId },
          { onConflict: "post_id,engine_id" },
        );
      }
    }

    return opts.id;
  } else {
    // Insert new draft
    const baseSlug = generateSlug(opts.title);
    const uniqueSlug = await ensureUniqueSlug(supabase, baseSlug || "post");
    const insertData: Record<string, unknown> = {
      title: opts.title,
      body: opts.body,
      slug: uniqueSlug,
      author_id: opts.authorId,
      category_id: opts.categoryId || null,
      source: "user",
      status: "approved",
      is_draft: true,
    };
    if (opts.quickAnswer) {
      insertData.quick_answer = opts.quickAnswer;
    }
    const { data: post, error } = await supabase
      .from("posts")
      .insert(insertData)
      .select("id")
      .single();

    if (error || !post) throw error ?? new Error("Failed to create draft");

    for (const tag of opts.tags) {
      const { data: existing } = await supabase.from("car_tags").select("id").eq("slug", tag.slug).single();
      let tagId = existing?.id;
      if (!tagId) {
        const { data: created } = await supabase.from("car_tags").insert({ name: tag.name, slug: tag.slug }).select("id").single();
        tagId = created?.id;
      }
      if (tagId) await supabase.from("post_tags").insert({ post_id: post.id, tag_id: tagId });
    }

    // Link vehicle engines
    if (opts.engineIds?.length) {
      for (const engineId of opts.engineIds) {
        await supabase.from("post_vehicles").upsert(
          { post_id: post.id, engine_id: engineId },
          { onConflict: "post_id,engine_id" },
        );
      }
    }

    return post.id;
  }
}

export async function getUserDrafts(userId: string): Promise<PostWithRelations[]> {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("posts")
    .select("*, profiles(username, avatar_url), categories(name, slug), post_tags(car_tags(name, slug))")
    .eq("author_id", userId)
    .eq("is_draft", true)
    .order("updated_at", { ascending: false });

  return (data as unknown as PostWithRelations[]) ?? [];
}

export async function publishDraft(id: string, userId: string): Promise<void> {
  const supabase = await createServerSupabase();

  // Verify ownership
  const { data: post } = await supabase
    .from("posts")
    .select("author_id, is_draft")
    .eq("id", id)
    .single();

  if (!post) throw new Error("Draft not found");
  if (post.author_id !== userId) throw new Error("You can only publish your own drafts");

  const { error } = await supabase
    .from("posts")
    .update({
      is_draft: false,
      status: "approved",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw error;
}

export async function deleteDraft(id: string, userId: string): Promise<void> {
  const supabase = await createServerSupabase();

  // Verify ownership
  const { data: post } = await supabase
    .from("posts")
    .select("author_id, is_draft")
    .eq("id", id)
    .single();

  if (!post) throw new Error("Draft not found");
  if (post.author_id !== userId) throw new Error("You can only delete your own drafts");

  // Clean up related records
  await supabase.from("post_tags").delete().eq("post_id", id);
  await supabase.from("bookmarks").delete().eq("post_id", id);
  // views table does not exist — skip
  const { data: comments } = await supabase.from("comments").select("id").eq("post_id", id);
  if (comments?.length) {
    await supabase.from("votes").delete().in("comment_id", comments.map((c) => c.id));
    await supabase.from("comments").delete().eq("post_id", id);
  }
  await supabase.from("votes").delete().eq("target_type", "post").eq("target_id", id);

  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) throw error;
}

// ── Admin ────────────────────────────────────────────────

export async function searchPostsAdmin(query: string): Promise<PostWithRelations[]> {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("posts")
    .select("*, profiles(username, avatar_url), categories(name), post_tags(car_tags(name, slug))")
    .ilike("title", `%${query}%`)
    .order("created_at", { ascending: false })
    .limit(30);
  return (data as unknown as PostWithRelations[]) ?? [];
}

export async function getPendingPosts() {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("posts")
    .select(`${POST_LIST}, profiles(username, avatar_url), categories(name)`)
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(50);
  return data ?? [];
}

export async function updatePostStatus(id: string, status: "approved" | "rejected") {
  const supabase = await createServerSupabase();
  return supabase.from("posts").update({ status }).eq("id", id);
}

export async function togglePin(id: string, currentPinned: boolean) {
  const supabase = await createServerSupabase();
  return supabase.from("posts").update({ is_pinned: !currentPinned }).eq("id", id);
}

export async function updatePost(
  id: string,
  data: { title?: string; body?: string; category_id?: string; status?: string; quick_answer?: Record<string, unknown> | null }
) {
  const supabase = await createServerSupabase();
  const updateData: Record<string, unknown> = {};
  if (data.title !== undefined) {
    updateData.title = data.title;
    // Regenerate slug when title changes
    const { data: existing } = await supabase
      .from("posts")
      .select("title")
      .eq("id", id)
      .single();
    if (existing && data.title !== existing.title) {
      const baseSlug = generateSlug(data.title);
      updateData.slug = await ensureUniqueSlug(supabase, baseSlug || "post", id);
    }
  }
  if (data.body !== undefined) updateData.body = data.body;
  if (data.category_id !== undefined) updateData.category_id = data.category_id;
  if (data.status !== undefined) updateData.status = data.status;
  if (data.quick_answer !== undefined) updateData.quick_answer = data.quick_answer;
  const { error } = await supabase.from("posts").update(updateData).eq("id", id);
  if (error) throw error;
}

export async function deletePost(id: string) {
  const supabase = await createServerSupabase();
  // Delete related records first to avoid FK constraint violations
  await supabase.from("post_tags").delete().eq("post_id", id);
  await supabase.from("bookmarks").delete().eq("post_id", id);
  // views table does not exist — skip
  const { data: comments } = await supabase.from("comments").select("id").eq("post_id", id);
  if (comments?.length) {
    await supabase.from("votes").delete().in("comment_id", comments.map((c) => c.id));
    await supabase.from("comments").delete().eq("post_id", id);
  }
  await supabase.from("votes").delete().eq("target_type", "post").eq("target_id", id);
  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) throw error;
}

// ── Users ────────────────────────────────────────────────

export async function getUserProfile(username: string) {
  const supabase = await createServerSupabase();
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username, avatar_url, bio, created_at, last_active_at")
    .eq("username", username)
    .single();

  if (!profile) return null;

  const [
    { count: postCount },
    { count: commentCount },
  ] = await Promise.all([
    supabase
      .from("posts")
      .select("id", { count: "exact", head: true })
      .eq("author_id", profile.id)
      .eq("status", "approved"),
    supabase
      .from("comments")
      .select("id", { count: "exact", head: true })
      .eq("author_id", profile.id),
  ]);

  return {
    ...profile,
    post_count: postCount ?? 0,
    comment_count: commentCount ?? 0,
  };
}

export async function getUserPosts(username: string): Promise<PostWithRelations[]> {
  const supabase = await createServerSupabase();
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", username)
    .single();

  if (!profile) return [];

  const { data } = await supabase
    .from("posts")
    .select("*, profiles(username, avatar_url), categories(name, slug), post_tags(car_tags(name, slug))")
    .eq("author_id", profile.id)
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  return (data as unknown as PostWithRelations[]) ?? [];
}

export async function getUserComments(username: string): Promise<CommentWithPost[]> {
  const supabase = await createServerSupabase();
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", username)
    .single();

  if (!profile) return [];

  const { data } = await supabase
    .from("comments")
    .select("*, profiles(username, avatar_url), posts(id, slug, title)")
    .eq("author_id", profile.id)
    .order("created_at", { ascending: false })
    .limit(50);

  return (data as unknown as CommentWithPost[]) ?? [];
}

// ── Notifications ───────────────────────────────────────

export async function getNotifications(userId: string, limit = 10): Promise<Notification[]> {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data as unknown as Notification[]) ?? [];
}

export async function getAllNotifications(userId: string): Promise<Notification[]> {
  return getNotifications(userId, 10000);
}

export async function getUnreadNotificationCount(userId: string): Promise<number> {
  const supabase = await createServerSupabase();
  const { count } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("is_read", false);
  return count ?? 0;
}

export async function markNotificationRead(id: string): Promise<void> {
  const supabase = await createServerSupabase();
  await supabase.from("notifications").update({ is_read: true }).eq("id", id);
}

export async function markAllNotificationsRead(userId: string): Promise<void> {
  const supabase = await createServerSupabase();
  await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", userId)
    .eq("is_read", false);
}

export async function insertNotification(opts: {
  userId: string;
  type: string;
  message: string;
  link?: string;
}): Promise<void> {
  const supabase = await createServerSupabase();
  await supabase.from("notifications").insert({
    user_id: opts.userId,
    type: opts.type,
    message: opts.message,
    link: opts.link ?? null,
  });
}

// ── Users (mutations) ──────────────────────────────────

export async function updateUsername(userId: string, username: string) {
  const supabase = await createServerSupabase();
  const { error } = await supabase.from("profiles").update({ username }).eq("id", userId);
  if (error) throw error;
}

export async function updateLastActive(userId: string) {
  const supabase = await createServerSupabase();
  await supabase
    .from("profiles")
    .update({ last_active_at: new Date().toISOString() })
    .eq("id", userId);
}

// ── Post editing (author-scoped) ─────────────────────────

export async function editOwnPost(
  id: string,
  userId: string,
  data: { title?: string; body?: string; category_id?: string | null },
): Promise<void> {
  const supabase = await createServerSupabase();

  // Verify ownership
  const { data: post } = await supabase
    .from("posts")
    .select("author_id, status, title")
    .eq("id", id)
    .single();

  if (!post) throw new Error("Post not found");
  if (post.author_id !== userId) throw new Error("You can only edit your own posts");
  if (post.status === "deleted") throw new Error("Cannot edit a deleted post");

  const updateData: Record<string, unknown> = {};
  if (data.title !== undefined) {
    updateData.title = data.title;
    // Regenerate slug if title changed
    if (data.title !== post.title) {
      const baseSlug = generateSlug(data.title);
      updateData.slug = await ensureUniqueSlug(supabase, baseSlug || "post", id);
    }
  }
  if (data.body !== undefined) updateData.body = data.body;
  if (data.category_id !== undefined) updateData.category_id = data.category_id;
  updateData.updated_at = new Date().toISOString();

  const { error } = await supabase.from("posts").update(updateData).eq("id", id);
  if (error) throw error;
}

export async function softDeleteOwnPost(id: string, userId: string): Promise<void> {
  const supabase = await createServerSupabase();

  const { data: post } = await supabase
    .from("posts")
    .select("author_id")
    .eq("id", id)
    .single();

  if (!post) throw new Error("Post not found");
  // Only the author or an admin can soft-delete. Admin check is done by the API route.
  if (post.author_id !== userId) throw new Error("You can only delete your own posts");

  const { error } = await supabase
    .from("posts")
    .update({ status: "deleted", updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

// ── Comment editing (author-scoped) ──────────────────────

export async function editOwnComment(
  id: string,
  userId: string,
  body: string,
): Promise<void> {
  const supabase = await createServerSupabase();

  const { data: comment } = await supabase
    .from("comments")
    .select("author_id")
    .eq("id", id)
    .single();

  if (!comment) throw new Error("Comment not found");
  if (comment.author_id !== userId) throw new Error("You can only edit your own comments");

  const { error } = await supabase
    .from("comments")
    .update({ body })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteOwnComment(id: string, userId: string): Promise<void> {
  const supabase = await createServerSupabase();

  const { data: comment } = await supabase
    .from("comments")
    .select("author_id")
    .eq("id", id)
    .single();

  if (!comment) throw new Error("Comment not found");
  if (comment.author_id !== userId) throw new Error("You can only delete your own comments");

  // Clean up votes on this comment first
  await supabase.from("votes").delete().eq("target_type", "comment").eq("target_id", id);
  // Delete the comment (hard delete — comments are lightweight; the trigger handles comment_count)
  const { error } = await supabase.from("comments").delete().eq("id", id);
  if (error) throw error;
}

// ── Reports ───────────────────────────────────────────────

export async function getPendingReports() {
  const supabase = await createServerSupabase();
  const { data: reports } = await supabase
    .from("reports")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(50);

  if (!reports?.length) return [];

  // Batch-fetch reporter usernames
  const reporterIds = [...new Set(reports.map((r) => r.reporter_id).filter(Boolean))];
  const { data: profiles } = reporterIds.length
    ? await supabase.from("profiles").select("id, username").in("id", reporterIds)
    : { data: [] };

  const usernameMap = new Map((profiles ?? []).map((p) => [p.id, p.username]));

  return reports.map((r) => ({
    ...r,
    reporter_username: usernameMap.get(r.reporter_id) ?? null,
  }));
}

export async function resolveReport(id: string, status: "resolved" | "dismissed") {
  const supabase = await createServerSupabase();
  return supabase.from("reports").update({ status }).eq("id", id);
}

// ── Admin: User Ban Management ──────────────────────────

export async function banUser(userId: string, reason?: string) {
  const supabase = await createServerSupabase();
  const { error } = await supabase
    .from("profiles")
    .update({
      is_banned: true,
      banned_at: new Date().toISOString(),
      ban_reason: reason ?? null,
    })
    .eq("id", userId);
  if (error) throw error;
}

export async function unbanUser(userId: string) {
  const supabase = await createServerSupabase();
  const { error } = await supabase
    .from("profiles")
    .update({
      is_banned: false,
      banned_at: null,
      ban_reason: null,
    })
    .eq("id", userId);
  if (error) throw error;
}

export async function getAllUsers(search?: string, limit = 50) {
  const supabase = await createServerSupabase();
  let query = supabase
    .from("profiles")
    .select("id, username, avatar_url, created_at, is_banned, banned_at, ban_reason")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (search) {
    query = query.ilike("username", `%${search}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  if (!data?.length) return [];

  // Batch all post count queries in parallel instead of N+1 loop
  const postCounts = await Promise.all(
    data.map((p) =>
      supabase
        .from("posts")
        .select("id", { count: "exact", head: true })
        .eq("author_id", p.id),
    ),
  );

  return data.map((p, i) => ({
    id: p.id,
    username: p.username,
    avatar_url: p.avatar_url,
    created_at: p.created_at,
    is_banned: p.is_banned ?? false,
    banned_at: p.banned_at ?? null,
    ban_reason: p.ban_reason ?? null,
    post_count: postCounts[i].count ?? 0,
  }));
}

// ── Admin: Car Tag Management ───────────────────────────

export async function getAllCarTags() {
  const supabase = await createServerSupabase();
  const { data: tags } = await supabase
    .from("car_tags")
    .select("id, name, slug")
    .order("name");

  if (!tags?.length) return [];

  // Batch all post count queries in parallel instead of N+1 loop
  const counts = await Promise.all(
    tags.map((tag) =>
      supabase
        .from("post_tags")
        .select("id", { count: "exact", head: true })
        .eq("tag_id", tag.id),
    ),
  );

  return tags.map((tag, i) => ({
    id: tag.id,
    name: tag.name,
    slug: tag.slug,
    post_count: counts[i].count ?? 0,
  }));
}

export async function renameCarTag(id: string, name: string) {
  const supabase = await createServerSupabase();
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const { error } = await supabase
    .from("car_tags")
    .update({ name, slug })
    .eq("id", id);
  if (error) throw error;
}

export async function mergeCarTag(fromId: string, toId: string) {
  const supabase = await createServerSupabase();

  // Get all post_tag associations for the source tag
  const { data: postTags } = await supabase
    .from("post_tags")
    .select("id, post_id")
    .eq("tag_id", fromId);

  if (postTags?.length) {
    // For each post_tag, either update to target or delete if duplicate
    for (const pt of postTags) {
      const { data: existing } = await supabase
        .from("post_tags")
        .select("id")
        .eq("post_id", pt.post_id)
        .eq("tag_id", toId)
        .maybeSingle();

      if (existing) {
        // Duplicate — delete this association
        await supabase.from("post_tags").delete().eq("id", pt.id);
      } else {
        // Update to target tag
        await supabase.from("post_tags").update({ tag_id: toId }).eq("id", pt.id);
      }
    }
  }

  // Delete the source tag
  await supabase.from("car_tags").delete().eq("id", fromId);
}

export async function deleteCarTag(id: string) {
  const supabase = await createServerSupabase();
  // Delete all post_tag associations for this tag
  await supabase.from("post_tags").delete().eq("tag_id", id);
  // Delete the tag itself
  await supabase.from("car_tags").delete().eq("id", id);
}

// ── Auth ─────────────────────────────────────────────────

export async function getCurrentUser() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// ── Vehicle Database ──────────────────────────────────────

export async function getVehicleMakes() {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("vehicle_makes")
    .select("*")
    .order("name");
  return data ?? [];
}

export async function getVehicleModels(makeSlug: string) {
  const supabase = await createServerSupabase();
  const { data: make } = await supabase
    .from("vehicle_makes")
    .select("id")
    .eq("slug", makeSlug)
    .single();
  if (!make) return [];
  const { data } = await supabase
    .from("vehicle_models")
    .select("*")
    .eq("make_id", make.id)
    .order("name");
  return data ?? [];
}

export async function getVehicleGenerations(modelSlug: string, makeSlug: string) {
  const supabase = await createServerSupabase();
  const { data: make } = await supabase
    .from("vehicle_makes")
    .select("id")
    .eq("slug", makeSlug)
    .single();
  if (!make) return [];
  const { data: model } = await supabase
    .from("vehicle_models")
    .select("id, name")
    .eq("slug", modelSlug)
    .eq("make_id", make.id)
    .single();
  if (!model) return [];
  const { data: generations } = await supabase
    .from("vehicle_generations")
    .select("*, vehicle_engines(*)")
    .eq("model_id", model.id)
    .order("year_start", { ascending: false });
  return (generations ?? []).map((gen: Record<string, unknown>) => ({
    ...gen,
    model_name: model.name,
    make_name: (make as Record<string, unknown>).name,
  }));
}

export async function searchVehicles(query: string) {
  const supabase = await createServerSupabase();
  const q = `%${query}%`;

  // Search makes
  const { data: makes } = await supabase
    .from("vehicle_makes")
    .select("id, name, slug")
    .ilike("name", q)
    .limit(5);

  // Search models + join make
  const { data: models } = await supabase
    .from("vehicle_models")
    .select("id, name, slug, make_id, vehicle_makes(name, slug)")
    .ilike("name", q)
    .limit(10);

  // Search engines + join generation + model + make
  const { data: engines } = await supabase
    .from("vehicle_engines")
    .select("id, code, name, displacement, fuel_type, horsepower, vehicle_generations(id, name, year_start, year_end, vehicle_models(id, name, slug, vehicle_makes(name, slug)))")
    .ilike("name", q)
    .limit(10);

  // Also search engines by code
  const { data: enginesByCode } = await supabase
    .from("vehicle_engines")
    .select("id, code, name, displacement, fuel_type, horsepower, vehicle_generations(id, name, year_start, year_end, vehicle_models(id, name, slug, vehicle_makes(name, slug)))")
    .ilike("code", q)
    .limit(5);

  const allEngines = [...(engines ?? []), ...(enginesByCode ?? [])] as unknown as Record<string, unknown>[];
  return {
    makes: makes ?? [],
    models: models ?? [],
    engines: allEngines.filter(
      (e, i, arr) => arr.findIndex((x) => (x as Record<string, unknown>).id === (e as Record<string, unknown>).id) === i
    ),
  };
}

export async function getEngineById(engineId: string) {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("vehicle_engines")
    .select("*, vehicle_generations!inner(name, year_start, year_end, vehicle_models!inner(name, slug, vehicle_makes!inner(name, slug)))")
    .eq("id", engineId)
    .single();
  return data as Record<string, unknown> | null;
}

export async function getUserVehicles(userId: string) {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("user_vehicles")
    .select("*, vehicle_engines(*, vehicle_generations(name, year_start, year_end, vehicle_models(name, slug, vehicle_makes(name, slug))))")
    .eq("user_id", userId)
    .order("is_primary", { ascending: false })
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function addUserVehicle(
  userId: string,
  engineId: string,
  year: number,
  nickname?: string | null,
) {
  const supabase = await createServerSupabase();

  // If this is the first vehicle, make it primary automatically
  const { count } = await supabase
    .from("user_vehicles")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);
  const isPrimary = count === 0;

  const { data, error } = await supabase
    .from("user_vehicles")
    .insert({
      user_id: userId,
      engine_id: engineId,
      year,
      nickname: nickname ?? null,
      is_primary: isPrimary,
    })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function removeUserVehicle(vehicleId: string, userId: string) {
  const supabase = await createServerSupabase();
  const { error } = await supabase
    .from("user_vehicles")
    .delete()
    .eq("id", vehicleId)
    .eq("user_id", userId);
  if (error) throw error;
}

export async function setPrimaryVehicle(vehicleId: string, userId: string) {
  const supabase = await createServerSupabase();
  // Reset all vehicles for this user
  await supabase
    .from("user_vehicles")
    .update({ is_primary: false })
    .eq("user_id", userId);
  // Set the selected one as primary
  const { error } = await supabase
    .from("user_vehicles")
    .update({ is_primary: true })
    .eq("id", vehicleId)
    .eq("user_id", userId);
  if (error) throw error;
}

export async function getPostsByEngine(engineId: string) {
  const supabase = await createServerSupabase();
  const { data: links } = await supabase
    .from("post_vehicles")
    .select("post_id")
    .eq("engine_id", engineId);
  if (!links?.length) return [];
  const postIds = links.map((l) => l.post_id);
  const { data } = await supabase
    .from("posts")
    .select("*, profiles(username, avatar_url), categories(name, slug), post_tags(car_tags(name, slug))")
    .in("id", postIds)
    .eq("status", "approved")
    .order("created_at", { ascending: false });
  return (data as unknown as import("@/lib/types").PostWithRelations[]) ?? [];
}

export async function linkPostVehicle(postId: string, engineId: string) {
  const supabase = await createServerSupabase();
  const { error } = await supabase
    .from("post_vehicles")
    .upsert({ post_id: postId, engine_id: engineId }, { onConflict: "post_id,engine_id" });
  if (error) throw error;
}

export async function unlinkPostVehicles(postId: string) {
  const supabase = await createServerSupabase();
  const { error } = await supabase
    .from("post_vehicles")
    .delete()
    .eq("post_id", postId);
  if (error) throw error;
}

// ── Vehicle Stats & Discussions ──────────────────────────

export async function getVehicleStats(engineId: string): Promise<{
  postCount: number;
  commentCount: number;
  followerCount: number;
}> {
  const supabase = await createServerSupabase();

  // Post count: number of posts linked to this engine
  const { count: postCount } = await supabase
    .from("post_vehicles")
    .select("id", { count: "exact", head: true })
    .eq("engine_id", engineId);

  // Comment count: sum of comment_count across all linked posts
  const { data: links } = await supabase
    .from("post_vehicles")
    .select("post_id")
    .eq("engine_id", engineId);

  let commentCount = 0;
  if (links?.length) {
    const postIds = links.map((l) => l.post_id);
    const { data: posts } = await supabase
      .from("posts")
      .select("comment_count")
      .in("id", postIds)
      .eq("status", "approved");
    commentCount = (posts ?? []).reduce((sum, p) => sum + (p.comment_count ?? 0), 0);
  }

  // Follower count: number of users who added this vehicle
  const { count: followerCount } = await supabase
    .from("user_vehicles")
    .select("id", { count: "exact", head: true })
    .eq("engine_id", engineId);

  return {
    postCount: postCount ?? 0,
    commentCount,
    followerCount: followerCount ?? 0,
  };
}

export async function getVehicleDiscussions(engineId: string): Promise<PostWithRelations[]> {
  const supabase = await createServerSupabase();
  const { data: links } = await supabase
    .from("post_vehicles")
    .select("post_id")
    .eq("engine_id", engineId);

  if (!links?.length) return [];

  const postIds = links.map((l) => l.post_id);
  const { data } = await supabase
    .from("posts")
    .select("*, profiles(username, avatar_url), categories(name, slug), post_tags(car_tags(name, slug))")
    .in("id", postIds)
    .eq("status", "approved")
    .order("comment_count", { ascending: false });

  return (data as unknown as PostWithRelations[]) ?? [];
}

// ── Community Page Data ───────────────────────────────────

export async function getActiveDiscussions(limit = 5) {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("posts")
    .select("id, slug, title, comment_count, created_at")
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}

export async function getTopContributors(limit = 10) {
  const supabase = await createServerSupabase();
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const { data } = await supabase
    .from("comments")
    .select("author_id, profiles(username, avatar_url)")
    .gte("created_at", thirtyDaysAgo);

  const commentsData = (data as unknown as Record<string, unknown>[]) ?? [];
  if (!commentsData.length) return [];

  // Aggregate comment counts by author
  const counts = new Map<string, { count: number; username: string; avatar_url: string | null }>();
  for (const c of commentsData) {
    const authorId = c.author_id as string;
    if (!authorId) continue;
    const existing = counts.get(authorId);
    const profiles = c.profiles as Record<string, unknown> | null;
    if (existing) {
      existing.count++;
    } else {
      counts.set(authorId, {
        count: 1,
        username: (profiles?.username as string) ?? "unknown",
        avatar_url: (profiles?.avatar_url as string) ?? null,
      });
    }
  }

  return Array.from(counts.entries())
    .map(([id, info]) => ({ id, username: info.username, avatar_url: info.avatar_url, comment_count: info.count }))
    .sort((a, b) => b.comment_count - a.comment_count)
    .slice(0, limit);
}

export async function getTrendingVehicles(limit = 8) {
  const supabase = await createServerSupabase();

  // Count followers per engine and return the top
  const { data: vehicleData } = await supabase
    .from("user_vehicles")
    .select("engine_id");

  if (!vehicleData?.length) return [];

  const counts = new Map<string, number>();
  for (const v of vehicleData) {
    counts.set(v.engine_id, (counts.get(v.engine_id) ?? 0) + 1);
  }

  // Sort by follower count and take top
  const sorted = Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);

  // Batch fetch engine details in parallel instead of N+1 loop
  const engineResults = await Promise.all(
    sorted.map(([engineId]) =>
      supabase
        .from("vehicle_engines")
        .select("id, code, name, displacement, fuel_type, horsepower, vehicle_generations(name, year_start, year_end, vehicle_models(name, slug, vehicle_makes(name, slug)))")
        .eq("id", engineId)
        .single(),
    ),
  );

  const result = [];
  for (let i = 0; i < sorted.length; i++) {
    const engineData = engineResults[i].data;
    if (engineData) {
      result.push({ ...(engineData as unknown as Record<string, unknown>), follower_count: sorted[i][1] });
    }
  }

  return result;
}

export async function getPostVehicles(postId: string) {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("post_vehicles")
    .select("engine_id, vehicle_engines(id, code, name, displacement, fuel_type, horsepower, vehicle_generations(name, year_start, year_end, vehicle_models(name, slug, vehicle_makes(name, slug))))")
    .eq("post_id", postId);
  return (data as unknown as { engine_id: string; vehicle_engines: Record<string, unknown> | null }[]) ?? [];
}

// ── OBD Codes ──────────────────────────────────────────────

export async function getObdCode(code: string): Promise<ObdCode | null> {
  const supabase = await createServerSupabase();
  const normalized = code.toUpperCase().trim();
  const { data, error } = await supabase
    .from("obd_codes")
    .select("*")
    .eq("code", normalized)
    .maybeSingle();

  if (error || !data) return null;

  const row = data as Record<string, unknown>;
  return {
    code: String(row.code ?? ""),
    title: String(row.title ?? ""),
    severity: Number(row.severity ?? 3),
    symptoms: parseJsonArray(row.symptoms_json),
    causes: parseJsonArray(row.causes_json),
    fixes: parseJsonArray(row.fixes_json),
    min_cost: row.min_cost != null ? Number(row.min_cost) : null,
    max_cost: row.max_cost != null ? Number(row.max_cost) : null,
  };
}

function parseJsonArray(val: unknown): string[] {
  if (Array.isArray(val)) return val.map((v) => String(v));
  if (typeof val === "string") {
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) ? parsed.map((v: unknown) => String(v)) : [];
    } catch {
      return [];
    }
  }
  return [];
}

export async function getRelatedObdCodes(code: string, limit = 5): Promise<Pick<ObdCode, "code" | "title" | "severity">[]> {
  const supabase = await createServerSupabase();
  const normalized = code.toUpperCase().trim();

  // Determine prefix for related codes:
  // - P-codes: use first 3 characters (e.g., "P04" for "P0420")
  // - C/B/U codes: use first character
  let prefix: string;
  if (/^[P]\d{4}$/i.test(normalized)) {
    prefix = normalized.substring(0, 3);
  } else {
    prefix = normalized.charAt(0);
  }

  const { data } = await supabase
    .from("obd_codes")
    .select("code, title, severity")
    .ilike("code", `${prefix}%`)
    .neq("code", normalized)
    .order("severity", { ascending: false })
    .order("code", { ascending: true })
    .limit(limit + 5);

  const results = (data as unknown as Pick<ObdCode, "code" | "title" | "severity">[]) ?? [];

  // Deduplicate by code just in case
  const seen = new Set<string>();
  const unique: Pick<ObdCode, "code" | "title" | "severity">[] = [];
  for (const row of results) {
    if (!seen.has(row.code)) {
      seen.add(row.code);
      unique.push(row);
    }
  }

  return unique.slice(0, limit);
}

export async function searchObdCodes(query: string): Promise<Pick<ObdCode, "code" | "title" | "severity">[]> {
  const supabase = await createServerSupabase();
  const trimmed = query.trim().toUpperCase();
  if (!trimmed) return [];

  // Try exact code match first
  const { data: exact } = await supabase
    .from("obd_codes")
    .select("code, title, severity")
    .eq("code", trimmed)
    .limit(1);

  if (exact && exact.length > 0) {
    return (exact as unknown as Pick<ObdCode, "code" | "title" | "severity">[]);
  }

  // Prefix search
  const { data: prefix } = await supabase
    .from("obd_codes")
    .select("code, title, severity")
    .ilike("code", `${trimmed}%`)
    .order("severity", { ascending: false })
    .limit(15);

  if (!prefix || prefix.length === 0) {
    // Fallback: description search
    const { data: desc } = await supabase
      .from("obd_codes")
      .select("code, title, severity")
      .ilike("title", `%${query}%`)
      .order("severity", { ascending: false })
      .limit(15);
    return (desc as unknown as Pick<ObdCode, "code" | "title" | "severity">[]) ?? [];
  }

  return (prefix as unknown as Pick<ObdCode, "code" | "title" | "severity">[]);
}

export async function getTopObdCodes(limit = 20): Promise<Pick<ObdCode, "code" | "title" | "severity">[]> {
  const supabase = await createServerSupabase();
  const allCodes: Pick<ObdCode, "code" | "title" | "severity">[] = [];

  for (let offset = 0; offset < limit; offset += 1000) {
    const { data } = await supabase
      .from("obd_codes")
      .select("code, title, severity")
      .order("code", { ascending: true })
      .range(offset, offset + 999);
    if (!data || data.length === 0) break;
    allCodes.push(...(data as unknown as Pick<ObdCode, "code" | "title" | "severity">[]));
  }

  return allCodes.slice(0, limit);
}

export async function getObdCodesPaginated(page: number, pageSize = 50): Promise<{
  codes: Pick<ObdCode, "code" | "title" | "severity">[];
  totalCount: number;
}> {
  const supabase = await createServerSupabase();
  const offset = (page - 1) * pageSize;

  const [{ data, error }, { count }] = await Promise.all([
    supabase
      .from("obd_codes")
      .select("code, title, severity")
      .order("code", { ascending: true })
      .range(offset, offset + pageSize - 1),
    supabase
      .from("obd_codes")
      .select("code", { count: "exact", head: true }),
  ]);

  if (error) throw error;
  return {
    codes: (data as unknown as Pick<ObdCode, "code" | "title" | "severity">[]) ?? [],
    totalCount: count ?? 0,
  };
}

// ── Repair Costs ───────────────────────────────────────────


const TIER_VEHICLES: Record<string, { make: string; model: string }[]> = {
  economy: [
    { make: "Honda", model: "Civic" },
    { make: "Toyota", model: "Corolla" },
  ],
  mid_range: [
    { make: "Ford", model: "F-150" },
    { make: "Honda", model: "Accord" },
  ],
  luxury: [
    { make: "BMW", model: "3 Series" },
    { make: "Mercedes-Benz", model: "C-Class" },
  ],
  truck_suv: [
    { make: "Chevrolet", model: "Tahoe" },
    { make: "Ram", model: "1500" },
  ],
  european: [
    { make: "Audi", model: "A4" },
    { make: "Volvo", model: "S60" },
  ],
};

// ── Vehicle-specific repair cost ─────────────────────────

export async function getVehicleRepairCost(
  makeSlug: string, modelSlug: string, repairSlug: string,
): Promise<{
  make: { name: string; slug: string };
  model: { name: string; slug: string };
  repair: RepairCostFull;
  tier: string;
  tierLabel: string;
} | null> {
  const supabase = await createServerSupabase();
  const [makeRes, modelRes, repairData] = await Promise.all([
    supabase.from("vehicle_makes").select("name, slug").eq("slug", makeSlug).single(),
    supabase.from("vehicle_models").select("name, slug, vehicle_makes!inner(slug)").eq("slug", modelSlug).eq("vehicle_makes.slug", makeSlug).single(),
    getRepairCosts(repairSlug),
  ]);
  const make = makeRes.data as { name: string; slug: string } | null;
  const model = modelRes.data as { name: string; slug: string } | null;
  if (!make || !model || !repairData) return null;
  const tier = MAKE_TIER[makeSlug] ?? "mid_range";
  return { make, model, repair: repairData, tier, tierLabel: TIER_LABELS[tier] ?? tier };
}

export async function getRepairCosts(slug: string): Promise<RepairCostFull | null> {
  const supabase = await createServerSupabase();

  // Normalize slug: convert URL dashes to underscores (DB convention)
  // Also try original slug as fallback
  const dbSlug = slug.replace(/-/g, "_");

  let { data, error } = await supabase
    .from("repair_costs")
    .select("*")
    .or(`repair_slug.eq.${dbSlug},repair_slug.eq.${slug}`)
    .order("min_cost", { ascending: true });

  if (error || !data || data.length === 0) {
    // Fuzzy fallback: try ILIKE match
    const fuzzy = await supabase
      .from("repair_costs")
      .select("*")
      .ilike("repair_slug", `%${dbSlug}%`)
      .order("min_cost", { ascending: true });
    data = fuzzy.data;
  }

  if (!data || data.length === 0) return null;

  const rows = data as unknown as RepairCostRow[];
  const tiers: Record<string, RepairCostTier> = {};

  let overallMin = Infinity;
  let overallMax = -Infinity;
  let totalAvg = 0;
  let tierCount = 0;

  for (const row of rows) {
    const tierKey = row.tier;
    tiers[tierKey] = {
      tier: tierKey,
      tierLabel: TIER_LABELS[tierKey] ?? tierKey,
      vehicles: TIER_VEHICLES[tierKey] ?? [{ make: row.make, model: row.model }],
      min: row.min_cost,
      max: row.max_cost,
      avg: row.avg_cost,
      labor: row.labor_cost,
      parts: row.parts_cost,
      confidence: row.confidence_level,
    };

    if (row.min_cost < overallMin) overallMin = row.min_cost;
    if (row.max_cost > overallMax) overallMax = row.max_cost;
    totalAvg += row.avg_cost;
    tierCount++;
  }

  const overallAvg = tierCount > 0 ? Math.round(totalAvg / tierCount) : 0;

  return {
    slug,
    name: rows[0].repair_name,
    tiers,
    overallMin: overallMin === Infinity ? 0 : overallMin,
    overallMax: overallMax === -Infinity ? 0 : overallMax,
    overallAvg,
    confidence: rows[0].confidence_level,
  };
}

export async function searchRepairCosts(query: string): Promise<Pick<RepairCostRow, "repair_name" | "repair_slug">[]> {
  const supabase = await createServerSupabase();
  if (!query.trim()) return [];

  const { data } = await supabase
    .from("repair_costs")
    .select("repair_slug, repair_name")
    .ilike("repair_name", `%${query.trim()}%`)
    .order("repair_name")
    .limit(30);

  if (!data || data.length === 0) return [];

  // Deduplicate by slug
  const seen = new Set<string>();
  const result: Pick<RepairCostRow, "repair_name" | "repair_slug">[] = [];
  for (const row of data as unknown as Pick<RepairCostRow, "repair_name" | "repair_slug">[]) {
    if (seen.has(row.repair_slug)) continue;
    seen.add(row.repair_slug);
    result.push(row);
  }
  return result;
}

export async function getAllRepairSlugs(): Promise<string[]> {
  const supabase = await createServerSupabase();
  const slugs = new Set<string>();
  const BATCH = 1000;
  let offset = 0;

  while (true) {
    const { data } = await supabase
      .from("repair_costs")
      .select("repair_slug")
      .range(offset, offset + BATCH - 1);
    if (!data || data.length === 0) break;

    for (const row of data as unknown as { repair_slug: string }[]) {
      slugs.add(row.repair_slug.replace(/_/g, "-"));
    }
    if (data.length < BATCH) break;
    offset += BATCH;
  }

  return Array.from(slugs).sort();
}

function slugToKeywords(slug: string): string[] {
  return slug.toLowerCase().replace(/_/g, "-").split("-").filter((w) => w.length > 0);
}

/**
 * Count how many distinct repair slugs match each category's keywords.
 */
export async function getRepairCategoryCounts(
  categories: { slug: string; keywords: string[] }[]
): Promise<Record<string, number>> {
  const allSlugs = await getAllRepairSlugs();
  const counts: Record<string, number> = {};

  for (const cat of categories) {
    const matching = allSlugs.filter((slug) =>
      cat.keywords.some((kw) => {
        const kwDash = kw.replace(/_/g, "-");
        return slug.includes(kwDash);
      })
    );
    counts[cat.slug] = matching.length;
  }

  return counts;
}

/**
 * Return popular repair types with their overall cost ranges.
 * Popularity is approximated by how many distinct tier/make/model rows exist per repair.
 */
// ── Vehicle Repair Cross Pages ────────────────────────────

export async function getVehicleRepairSlugs(limit = 100): Promise<{ makeSlug: string; modelSlug: string; makeName: string; modelName: string }[]> {
  const supabase = await createServerSupabase();
  // Top US models by sales popularity, grouped by brand
  const POPULAR_ORDER = [
    "f-150", "silverado-1500", "ram-1500", "tacoma", "tundra",
    "civic", "accord", "camry", "corolla", "altima", "sentra",
    "rav4", "cr-v", "rogue", "equinox", "escape", "tucson", "sportage",
    "3-series", "c-class", "a4", "model-3", "model-y",
    "wrangler", "grand-cherokee", "explorer", "highlander", "pilot",
    "mustang", "charger", "outback", "forester", "cx-5",
  ];
  const { data } = await supabase
    .from("vehicle_models")
    .select("slug, name, vehicle_makes!inner(slug, name)")
    .limit(300);
  const all = ((data as unknown as any[]) ?? []).map((m) => ({
    modelSlug: m.slug,
    modelName: m.name,
    makeSlug: m.vehicle_makes.slug,
    makeName: m.vehicle_makes.name,
  }));
  // Sort: known popular models first, then alphabetically
  all.sort((a, b) => {
    const ai = POPULAR_ORDER.indexOf(a.modelSlug);
    const bi = POPULAR_ORDER.indexOf(b.modelSlug);
    if (ai >= 0 && bi >= 0) return ai - bi;
    if (ai >= 0) return -1;
    if (bi >= 0) return 1;
    return a.modelName.localeCompare(b.modelName);
  });
  return all.slice(0, limit);
}

// ── Homepage Activity ──────────────────────────────────────

export async function getRecentActivityCount(): Promise<{ newArticles: number; newDiscussions: number }> {
  const supabase = await createServerSupabase();
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [
    { count: articleCount },
    { count: commentCount },
  ] = await Promise.all([
    supabase
      .from("posts")
      .select("id", { count: "exact", head: true })
      .eq("status", "approved")
      .gte("created_at", sevenDaysAgo),
    supabase
      .from("comments")
      .select("id", { count: "exact", head: true })
      .gte("created_at", sevenDaysAgo),
  ]);

  return {
    newArticles: articleCount ?? 0,
    newDiscussions: commentCount ?? 0,
  };
}

export async function getPopularRepairCosts(limit = 10): Promise<{
  name: string;
  slug: string;
  minCost: number;
  maxCost: number;
  avgCost: number;
  tierCount: number;
}[]> {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("repair_costs")
    .select("repair_slug, repair_name, min_cost, max_cost, avg_cost");

  if (!data || data.length === 0) return [];

  const rows = data as unknown as {
    repair_slug: string;
    repair_name: string;
    min_cost: number;
    max_cost: number;
    avg_cost: number;
  }[];

  // Group by slug
  const groups = new Map<string, {
    name: string;
    costs: { min: number; max: number; avg: number }[];
  }>();

  for (const row of rows) {
    const slug = row.repair_slug;
    const existing = groups.get(slug);
    if (existing) {
      existing.costs.push({ min: row.min_cost, max: row.max_cost, avg: row.avg_cost });
    } else {
      groups.set(slug, {
        name: row.repair_name,
        costs: [{ min: row.min_cost, max: row.max_cost, avg: row.avg_cost }],
      });
    }
  }

  // Sort by number of entries (tier count) descending = most documented = most popular
  const sorted = Array.from(groups.entries())
    .sort((a, b) => b[1].costs.length - a[1].costs.length)
    .slice(0, limit);

  return sorted.map(([slug, info]) => {
    const minCost = Math.min(...info.costs.map((c) => c.min));
    const maxCost = Math.max(...info.costs.map((c) => c.max));
    const avgCost = Math.round(
      info.costs.reduce((sum, c) => sum + c.avg, 0) / info.costs.length
    );
    return {
      name: info.name,
      slug: slug.replace(/_/g, "-"),
      minCost,
      maxCost,
      avgCost,
      tierCount: info.costs.length,
    };
  });
}
