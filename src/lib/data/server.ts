// Server-side data access — ONLY used in server components and API routes.
// All Supabase calls live here so migrating to a different DB only changes this file.
import { createServerSupabase } from "@/lib/supabase-server";
import type { PostWithRelations, Category, CommentWithAuthor, CommentWithPost, Notification } from "@/lib/types";

// ── Posts ────────────────────────────────────────────────

export async function getPosts(opts: {
  sort?: "hot" | "new" | "popular";
  categorySlug?: string;
  tagSlug?: string;
  search?: string;
  limit?: number;
  page?: number;
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
    .eq("status", "approved");

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
  query = query.order("vote_score", { ascending: false });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, count } = await (query as any)
    .select(selectCols, { count: "estimated" })
    .limit(200);

  const results = (data as unknown as PostWithRelations[]) ?? [];

  results.sort((a, b) => {
    // Pinned first, then guide/review boost, then vote_score
    const aPinned = a.is_pinned ? 1 : 0;
    const bPinned = b.is_pinned ? 1 : 0;
    if (aPinned !== bPinned) return bPinned - aPinned;

    const aBoost = a.content_type === "guide" || a.content_type === "review" ? 1 : 0;
    const bBoost = b.content_type === "guide" || b.content_type === "review" ? 1 : 0;
    if (aBoost !== bBoost) return bBoost - aBoost;
    return (b.vote_score ?? 0) - (a.vote_score ?? 0);
  });

  // Paginate the already-fetched and sorted results.
  // Hot sort caps at 200 fetched rows, so reflect that in totalCount.
  const paginatedPosts = results.slice(offset, offset + limit);

  return {
    posts: paginatedPosts,
    totalCount: Math.min(count ?? 0, 200),
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
    .select("id, title, comment_count, vote_score")
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
    .select("id, title, comment_count, vote_score")
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
    .select("id, title, comment_count")
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

// ── Comments ─────────────────────────────────────────────

export async function insertComment(postId: string, authorId: string, body: string): Promise<CommentWithAuthor> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("comments")
    .insert({ post_id: postId, author_id: authorId, body })
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
}) {
  const supabase = await createServerSupabase();
  const { data: post, error } = await supabase
    .from("posts")
    .insert({
      title: opts.title,
      body: opts.body,
      author_id: opts.authorId,
      category_id: opts.categoryId || null,
      source: "user",
      status: "approved",
    })
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

  return post.id;
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
    .select("*, profiles(username, avatar_url), categories(name)")
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
  data: { title?: string; body?: string; category_id?: string; status?: string }
) {
  const supabase = await createServerSupabase();
  const updateData: Record<string, string> = {};
  if (data.title !== undefined) updateData.title = data.title;
  if (data.body !== undefined) updateData.body = data.body;
  if (data.category_id !== undefined) updateData.category_id = data.category_id;
  if (data.status !== undefined) updateData.status = data.status;
  const { error } = await supabase.from("posts").update(updateData).eq("id", id);
  if (error) throw error;
}

export async function deletePost(id: string) {
  const supabase = await createServerSupabase();
  // Delete related records first to avoid FK constraint violations
  await supabase.from("post_tags").delete().eq("post_id", id);
  await supabase.from("bookmarks").delete().eq("post_id", id);
  await supabase.from("views").delete().eq("post_id", id);
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
    .select("id, username, avatar_url, bio, created_at")
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
    .select("*, profiles(username, avatar_url), posts(id, title)")
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

// ── Post editing (author-scoped) ─────────────────────────

export async function editOwnPost(
  id: string,
  userId: string,
  data: { title?: string; body?: string },
): Promise<void> {
  const supabase = await createServerSupabase();

  // Verify ownership
  const { data: post } = await supabase
    .from("posts")
    .select("author_id, status")
    .eq("id", id)
    .single();

  if (!post) throw new Error("Post not found");
  if (post.author_id !== userId) throw new Error("You can only edit your own posts");
  if (post.status === "deleted") throw new Error("Cannot edit a deleted post");

  const updateData: Record<string, string> = {};
  if (data.title !== undefined) updateData.title = data.title;
  if (data.body !== undefined) updateData.body = data.body;
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

// ── Auth ─────────────────────────────────────────────────

export async function getCurrentUser() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}
