import { createServerSupabase } from "@/lib/supabase-server";
import { withRateLimit } from "@/lib/rate-limit";
import { NextResponse } from "next/server";

export interface QuoteCheckRequest {
  repairType: string;
  make: string;
  model: string;
  year: number;
  quoteAmount: number;
  state?: string;
}

export interface QuoteCheckResponse {
  assessment: "Fair" | "Slightly High" | "Overpriced" | "Below Average" | "Insufficient Data";
  quoteAmount: number;
  minCost: number | null;
  maxCost: number | null;
  avgCost: number | null;
  tier: string;
  disclaimer: string;
}

type Assessment = QuoteCheckResponse["assessment"];

const DISCLAIMER =
  "This is an estimate only. Actual prices vary by location, vehicle condition, and shop rates.";

/**
 * Heuristic to determine a vehicle's cost tier based on the make name.
 * This is a fallback when a more granular tier cannot be determined from the database.
 */
const LUXURY_MAKES = new Set([
  "bmw", "mercedes-benz", "mercedes", "audi", "porsche", "lexus", "cadillac",
  "lincoln", "land rover", "range rover", "jaguar", "maserati", "bentley",
  "rolls-royce", "aston martin", "ferrari", "lamborghini", "mclaren",
  "alfa romeo", "genesis", "acura", "infiniti", "volvo",
]);

const EXOTIC_MAKES = new Set([
  "ferrari", "lamborghini", "mclaren", "bentley", "rolls-royce",
  "aston martin", "maserati", "bugatti", "koenigsegg", "pagani",
]);

function determineTier(make: string): string {
  const normalized = make.toLowerCase().trim();
  if (EXOTIC_MAKES.has(normalized)) return "exotic";
  if (LUXURY_MAKES.has(normalized)) return "luxury";
  return "standard";
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function computeAssessment(
  quote: number,
  min: number | null,
  max: number | null
): Assessment {
  if (min === null || max === null) return "Insufficient Data";

  if (quote > max * 1.2) return "Overpriced";
  if (quote >= min && quote <= max) return "Fair";
  if (quote < min) return "Below Average";
  // quote > max && quote <= max * 1.2
  return "Slightly High";
}

export async function POST(request: Request) {
  try {
    const body: QuoteCheckRequest = await request.json();
    const { repairType, make, model, year, quoteAmount, state } = body;

    // Validate required fields
    if (!repairType || !make || !model || !year || quoteAmount == null || quoteAmount <= 0) {
      return NextResponse.json(
        { error: "Missing required fields: repairType, make, model, year, quoteAmount" },
        { status: 400 }
      );
    }

    // Rate limit: 20 requests per minute per IP
    const identifier =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anonymous";
    const limited = await withRateLimit(identifier, "quote-check", 20, 60);
    if (limited) return limited;

    const supabase = await createServerSupabase();
    const repairSlug = slugify(repairType);
    const tier = determineTier(make);

    // Try to find a matching repair cost row
    // Match by repair type slug and vehicle tier
    let { data: costData, error } = await supabase
      .from("repair_costs")
      .select("*")
      .eq("repair_slug", repairSlug)
      .eq("tier", tier)
      .maybeSingle();

    // If no match on the specific tier, try with "standard" tier as fallback
    if (!costData && tier !== "standard") {
      const fallback = await supabase
        .from("repair_costs")
        .select("*")
        .eq("repair_slug", repairSlug)
        .eq("tier", "standard")
        .maybeSingle();
      costData = fallback.data;
      error = fallback.error;
    }

    // If still no match, try partial match on repair_slug using ILIKE
    if (!costData) {
      const fuzzy = await supabase
        .from("repair_costs")
        .select("*")
        .ilike("repair_slug", `%${repairSlug}%`)
        .limit(1)
        .maybeSingle();
      costData = fuzzy.data;
      error = fuzzy.error;
    }

    if (error) {
      console.error("Error querying repair_costs:", error);
      return NextResponse.json(
        { error: "Failed to query repair cost data" },
        { status: 500 }
      );
    }

    // Extract cost ranges from the matched row, or return insufficient data
    const minCost: number | null = costData?.min_cost ?? null;
    const maxCost: number | null = costData?.max_cost ?? null;
    const avgCost: number | null = costData?.avg_cost ?? null;
    const matchedTier: string = costData?.tier ?? tier;

    const assessment = computeAssessment(quoteAmount, minCost, maxCost);

    const response: QuoteCheckResponse = {
      assessment,
      quoteAmount,
      minCost,
      maxCost,
      avgCost,
      tier: matchedTier,
      disclaimer: DISCLAIMER,
    };

    return NextResponse.json(response);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
