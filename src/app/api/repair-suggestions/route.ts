import { createServiceSupabase } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

interface RepairSuggestion {
  display: string;
  raw: string;
}

/**
 * Clean a repair_name for display:
 * - Strip " - Front", " - Rear", " - Front/Rear", " - Left", " - Right" suffixes
 * - Strip trailing " Replacement" for nicer display names
 * - Trim whitespace
 */
function cleanRepairName(name: string): string {
  return name
    .replace(/\s*-\s*(Front|Rear|Front\/Rear|Left|Right)\s*$/i, "")
    .replace(/\s+Replacement$/i, "")
    .trim();
}

/**
 * GET /api/repair-suggestions?q=brake
 *
 * Returns deduplicated repair type suggestions from the repair_costs table.
 * Searches repair_name for the query, deduplicates by cleaned display name,
 * and returns both the cleaned display name and the original raw name.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim() ?? "";

    if (!q || q.length < 2) {
      return NextResponse.json({ suggestions: [] });
    }

    const supabase = await createServiceSupabase();

    // Search repair_costs for matching repair_name
    const { data, error } = await supabase
      .from("repair_costs")
      .select("repair_name")
      .ilike("repair_name", `%${q}%`)
      .order("repair_name")
      .limit(100);

    if (error || !data) {
      return NextResponse.json({ suggestions: [] });
    }

    const rows = data as unknown as { repair_name: string }[];

    // Deduplicate by cleaned display name (first occurrence wins for the raw name)
    const seen = new Set<string>();
    const suggestions: RepairSuggestion[] = [];

    for (const row of rows) {
      const display = cleanRepairName(row.repair_name);
      const key = display.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        suggestions.push({ display, raw: row.repair_name });
        if (suggestions.length >= 50) break;
      }
    }

    return NextResponse.json({ suggestions });
  } catch {
    return NextResponse.json({ suggestions: [] });
  }
}
