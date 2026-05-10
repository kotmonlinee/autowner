// Browser-side data access — ONLY used in client components ("use client").
// All Supabase browser calls live here so migrating to a different auth/DB provider
// only changes this file.
import { createClient } from "@/lib/supabase";
import type { Category, CommentWithAuthor, Notification } from "@/lib/types";

// ── Auth ─────────────────────────────────────────────────

export function getBrowserSupabase() {
  return createClient();
}

export async function signIn(email: string, password: string) {
  return createClient().auth.signInWithPassword({ email, password });
}

export async function signUp(email: string, password: string, username: string) {
  return createClient().auth.signUp({ email, password, options: { data: { username } } });
}

export async function signOut() {
  return createClient().auth.signOut();
}

export async function resetPasswordForEmail(email: string) {
  return createClient().auth.resetPasswordForEmail(email, {
    redirectTo: "https://www.autowner.com/auth/update-password",
  });
}

export async function updatePassword(password: string) {
  return createClient().auth.updateUser({ password });
}

export async function getSessionUser() {
  const { data } = await createClient().auth.getUser();
  return data.user ?? null;
}

export function onAuthChange(callback: (user: any | null) => void) {
  const { data: { subscription } } = createClient().auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null);
  });
  return subscription;
}

// ── Read ─────────────────────────────────────────────────

export async function fetchCategories(): Promise<Pick<Category, "id" | "name">[]> {
  const { data } = await createClient()
    .from("categories")
    .select("id, name")
    .order("sort_order");
  return (data as Pick<Category, "id" | "name">[]) ?? [];
}

export async function fetchComments(postId: string): Promise<CommentWithAuthor[]> {
  const { data } = await createClient()
    .from("comments")
    .select("*, profiles(username, avatar_url)")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });
  return (data as CommentWithAuthor[]) ?? [];
}

export async function searchCarTags(query: string): Promise<{ name: string; slug: string }[]> {
  const { data } = await createClient()
    .from("car_tags")
    .select("name, slug")
    .ilike("name", `%${query}%`)
    .limit(5);
  return (data as { name: string; slug: string }[]) ?? [];
}

// ── Vote state (read-only) ───────────────────────────────

export async function getUserVote(
  userId: string,
  targetType: "post" | "comment",
  targetId: string
): Promise<"up" | "down" | null> {
  const { data } = await createClient()
    .from("votes")
    .select("direction")
    .eq("user_id", userId)
    .eq("target_type", targetType)
    .eq("target_id", targetId)
    .single();
  return data?.direction ?? null;
}

// ── Profile (mutations) ─────────────────────────────────

export async function fetchProfile(userId: string) {
  const { data } = await createClient()
    .from("profiles")
    .select("id, username, avatar_url, bio, created_at")
    .eq("id", userId)
    .single();
  return data as { id: string; username: string; avatar_url?: string | null; bio?: string | null; created_at: string } | null;
}

export async function updateUsername(username: string) {
  const { data: { user } } = await createClient().auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const { error } = await createClient().from("profiles").update({ username }).eq("id", user.id);
  if (error) throw error;
}

export async function updateBio(bio: string) {
  const { data: { user } } = await createClient().auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const { error } = await createClient().from("profiles").update({ bio }).eq("id", user.id);
  if (error) throw error;
}

export async function updateAvatarUrl(avatarUrl: string) {
  const { data: { user } } = await createClient().auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const { error } = await createClient().from("profiles").update({ avatar_url: avatarUrl }).eq("id", user.id);
  if (error) throw error;
}

// ── Bookmark state (read-only) ───────────────────────────

export async function getBookmarkState(userId: string, postId: string): Promise<boolean> {
  const { data } = await createClient()
    .from("bookmarks")
    .select("id")
    .eq("user_id", userId)
    .eq("post_id", postId)
    .single();
  return !!data;
}

// ── Notifications ───────────────────────────────────────

export async function fetchNotifications(userId: string, limit = 10): Promise<Notification[]> {
  const { data } = await createClient()
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data as unknown as Notification[]) ?? [];
}

export async function fetchUnreadNotificationCount(userId: string): Promise<number> {
  const { count } = await createClient()
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("is_read", false);
  return count ?? 0;
}

export async function markNotificationRead(id: string): Promise<void> {
  await createClient()
    .from("notifications")
    .update({ is_read: true })
    .eq("id", id);
}

export async function markAllNotificationsRead(userId: string): Promise<void> {
  await createClient()
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", userId)
    .eq("is_read", false);
}
