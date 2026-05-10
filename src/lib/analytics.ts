// Server-side event tracking — inserts directly into user_events table.
// For client-side tracking, use analytics-client.ts which calls POST /api/events.
import { createServiceSupabase } from "@/lib/supabase-server";

export interface AnalyticsEvent {
  userId?: string;
  anonymousId?: string;
  eventType: string;
  targetType?: string;
  targetId?: string;
  metadata?: Record<string, unknown>;
}

const VALID_EVENT_TYPES = new Set([
  "view_post",
  "search",
  "bookmark",
  "vote",
  "comment",
  "select_vehicle",
  "follow_vehicle",
  "register",
  "login",
]);

/**
 * Track an event server-side. Inserts directly into user_events using the
 * service role client, which bypasses RLS.
 *
 * For client-side usage, send a POST to /api/events instead.
 */
export async function trackEvent(event: AnalyticsEvent): Promise<void> {
  if (!event.eventType) return;

  // Validate known event types (skip unknown — noiseless ignore)
  if (!VALID_EVENT_TYPES.has(event.eventType)) {
    console.warn(`[analytics] Unknown event type: ${event.eventType}`);
    return;
  }

  // At least one identifier is required
  if (!event.userId && !event.anonymousId) {
    console.warn("[analytics] Skipping event with no userId or anonymousId");
    return;
  }

  try {
    const supabase = await createServiceSupabase();
    await supabase.from("user_events").insert({
      user_id: event.userId ?? null,
      anonymous_id: event.anonymousId ?? null,
      event_type: event.eventType,
      target_type: event.targetType ?? null,
      target_id: event.targetId ?? null,
      metadata: event.metadata ?? null,
    });
  } catch (error) {
    // Fail silently — analytics is best-effort
    console.error("[analytics] Failed to track event:", error);
  }
}
