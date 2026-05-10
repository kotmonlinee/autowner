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

export async function changePassword(currentPassword: string, newPassword: string) {
  const supabase = createClient();

  // Get current user to retrieve email for verification
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user?.email) throw new Error("Not authenticated");

  // Verify current password by signing in
  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email: userData.user.email,
    password: currentPassword,
  });
  if (verifyError) throw new Error("Current password is incorrect");

  // Update to the new password
  const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
  if (updateError) throw updateError;
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

// ── Vehicle Database (browser) ─────────────────────────────

export async function fetchVehicleMakes() {
  const { data } = await createClient()
    .from("vehicle_makes")
    .select("*")
    .order("name");
  return (data as unknown as { id: string; name: string; slug: string; country: string | null; created_at: string }[]) ?? [];
}

export async function fetchVehicleModels(makeSlug: string) {
  const { data: make } = await createClient()
    .from("vehicle_makes")
    .select("id")
    .eq("slug", makeSlug)
    .single();
  if (!make) return [];
  const { data } = await createClient()
    .from("vehicle_models")
    .select("*")
    .eq("make_id", (make as { id: string }).id)
    .order("name");
  return (data as unknown as { id: string; name: string; slug: string; make_id: string }[]) ?? [];
}

export async function fetchVehicleGenerations(modelSlug: string, makeSlug: string) {
  const { data: make } = await createClient()
    .from("vehicle_makes")
    .select("id, name")
    .eq("slug", makeSlug)
    .single();
  if (!make) return [];
  const makeRecord = make as { id: string; name: string };
  const { data: model } = await createClient()
    .from("vehicle_models")
    .select("id, name")
    .eq("slug", modelSlug)
    .eq("make_id", makeRecord.id)
    .single();
  if (!model) return [];
  const modelRecord = model as { id: string; name: string };
  const { data: generations } = await createClient()
    .from("vehicle_generations")
    .select("*, vehicle_engines(*)")
    .eq("model_id", (model as { id: string }).id)
    .order("year_start", { ascending: false });
  return ((generations as unknown as any[]) ?? []).map((gen) => ({
    ...gen,
    model_name: modelRecord.name,
    make_name: makeRecord.name,
  }));
}

export async function searchVehicles(query: string) {
  const q = `%${query}%`;
  const supabase = createClient();

  const [makesRes, modelsRes, enginesRes, enginesByCodeRes] = await Promise.all([
    supabase.from("vehicle_makes").select("id, name, slug").ilike("name", q).limit(5),
    supabase.from("vehicle_models").select("id, name, slug, make_id, vehicle_makes(name, slug)").ilike("name", q).limit(10),
    supabase.from("vehicle_engines").select("id, code, name, displacement, fuel_type, horsepower, vehicle_generations(id, name, year_start, year_end, vehicle_models(id, name, slug, vehicle_makes(name, slug)))").ilike("name", q).limit(10),
    supabase.from("vehicle_engines").select("id, code, name, displacement, fuel_type, horsepower, vehicle_generations(id, name, year_start, year_end, vehicle_models(id, name, slug, vehicle_makes(name, slug)))").ilike("code", q).limit(5),
  ]);

  const allEngines = [...(enginesRes.data ?? []), ...(enginesByCodeRes.data ?? [])] as unknown as Record<string, unknown>[];
  const deduped = allEngines.filter(
    (e, i, arr) => arr.findIndex((x) => (x as Record<string, unknown>).id === (e as Record<string, unknown>).id) === i
  );

  return {
    makes: makesRes.data ?? [],
    models: modelsRes.data ?? [],
    engines: deduped,
  };
}

export async function fetchEngineById(engineId: string) {
  const { data } = await createClient()
    .from("vehicle_engines")
    .select("*, vehicle_generations!inner(name, year_start, year_end, vehicle_models!inner(name, slug, vehicle_makes!inner(name, slug)))")
    .eq("id", engineId)
    .single();
  return data as Record<string, unknown> | null;
}

export async function fetchUserVehicles(userId: string) {
  const { data } = await createClient()
    .from("user_vehicles")
    .select("*, vehicle_engines(id, code, name, displacement, fuel_type, horsepower, vehicle_generations(name, year_start, year_end, vehicle_models(name, slug, vehicle_makes(name, slug))))")
    .eq("user_id", userId)
    .order("is_primary", { ascending: false })
    .order("created_at", { ascending: false });
  return (data as unknown as any[]) ?? [];
}

export async function addUserVehicle(
  userId: string,
  engineId: string,
  year: number,
  nickname?: string | null,
) {
  // Check if this is the first vehicle
  const { count } = await createClient()
    .from("user_vehicles")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);
  const isPrimary = count === 0;

  const { data, error } = await createClient()
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
  const { error } = await createClient()
    .from("user_vehicles")
    .delete()
    .eq("id", vehicleId)
    .eq("user_id", userId);
  if (error) throw error;
}

export async function setPrimaryVehicle(vehicleId: string, userId: string) {
  const supabase = createClient();
  await supabase
    .from("user_vehicles")
    .update({ is_primary: false })
    .eq("user_id", userId);
  const { error } = await supabase
    .from("user_vehicles")
    .update({ is_primary: true })
    .eq("id", vehicleId)
    .eq("user_id", userId);
  if (error) throw error;
}
