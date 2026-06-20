import { NextResponse } from "next/server";
import { withRateLimit } from "@/lib/rate-limit";
import { createServiceSupabase } from "@/lib/supabase-server";
import type { Diagnosis } from "@/lib/types";

const DEEPSEEK_URL = "https://api.deepseek.com/v1/chat/completions";

const SYSTEM_PROMPT_BASE = `You are an ASE-certified master technician with 20 years of experience. Diagnose car problems based on user-described symptoms.

When a specific vehicle (make, model, year) is provided, you MUST incorporate vehicle-specific context into ALL fields.
If no vehicle is given, provide a general diagnosis.

The user may also provide diagnostic context — use it to refine your diagnosis:
- Check engine light status (off/on/flashing): A flashing CEL indicates an active misfire that will damage the catalytic converter.
- Problem duration (just started/days/weeks): Helps distinguish sudden failures from gradual wear.
- Odometer reading: Use to determine if the issue aligns with known service intervals (e.g., timing belt at 90k).
- Recent repair work: A symptom that started right after a repair often points to an installation error or disturbed component.

CRITICAL — Repair matching: You will be given a catalog of available repairs. Each cause MUST have a "repair_slug" from the catalog, or null if nothing matches.

CRITICAL — Consistency: Every OBD code in "possibleCodes" must have at least one corresponding repair in "matchedRepairSlugs". matchedRepairSlugs collects all non-null repair_slug values from causes.

CRITICAL — Verification steps: Each cause MUST have 3 verification_steps, ordered from easiest (no tools) to hardest (professional equipment). Write specific, actionable steps — never vague like "check the sensor".

Return ONLY valid JSON with this structure:
{
  "title": "Short diagnosis title, include vehicle if known",
  "severity": "low" | "medium" | "high" | "critical",
  "summary": "2-3 sentence plain-language summary of the diagnosis, explaining what's happening and why",
  "causes": [
    {
      "description": "Detailed cause description, written for car owner to understand",
      "likelihood": "most likely" | "possible" | "less common",
      "verification_steps": [
        "Step 1: Easiest check — no tools needed (eyes, ears, hands)",
        "Step 2: Intermediate check — basic tools or OBD scanner",
        "Step 3: Professional verification — shop equipment if needed"
      ],
      "repair_slug": "exact_slug_from_catalog_or_null"
    }
  ],
  "whatToDo": "Practical next steps. If vehicle is known, mention model-specific issues. 2-3 sentences.",
  "costEstimate": "Repair cost range in USD specific to vehicle if known. Say 'Varies widely' if uncertain.",
  "possibleCodes": ["P0420"],
  "matchedRepairSlugs": ["brake_pads_front"],
  "faq": [
    {"question": "How urgent is this repair?", "answer": "Specific urgency based on severity and symptoms"},
    {"question": "Can I drive with this issue?", "answer": "Clear yes/no with explanation of risks"},
    {"question": "What happens if I ignore this?", "answer": "Progression of symptoms and potential damage/cost if untreated"}
  ]
}
Rules: severity: "critical"=stop driving immediately, "high"=get inspected within days, "medium"=schedule soon, "low"=monitor. 2-3 causes ordered by likelihood. Max 4 codes. 3 faq items. Write for non-mechanic.`;

function hashStr(s: string): string {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h).toString(36).padStart(6, "0");
}

function generateSlug(symptoms: string, vehicle?: string): string {
  // Extract key terms for readable prefix
  const parts = symptoms.match(/Symptom: ([^.]+)\. Location: ([^.]+)\. When: ([^.]+)\./);
  const baseParts: string[] = [];
  if (parts) {
    baseParts.push(parts[1].trim(), parts[2].trim(), parts[3].trim());
  } else {
    baseParts.push(symptoms.substring(0, 40));
  }
  if (vehicle) baseParts.push(vehicle);

  // Hash the full input (including context fields like mileage, CEL, duration, etc.) for uniqueness
  const hash = hashStr(symptoms + (vehicle ?? ""));

  return `${baseParts.join(" ")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/(^-|-$)/g, "")
    .substring(0, 64)}-${hash}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { symptoms, make, model, year } = body as { symptoms?: string; make?: string; model?: string; year?: string };
    if (!symptoms?.trim()) return NextResponse.json({ error: "Symptoms required" }, { status: 400 });

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const limited = await withRateLimit(ip, "diagnosis:ai", 10, 60);
    if (limited) return limited;

    const vehicleStr = [make, model, year].filter(Boolean).join(" ");
    const slug = generateSlug(symptoms, vehicleStr || undefined);
    const supabase = await createServiceSupabase();

    // Check cache: slug is now fully deterministic from all input fields (including context)
    const { data: cached } = await supabase.from("diagnoses").select("*").eq("slug", slug).maybeSingle();
    if (cached) {
      const cachedData = cached as unknown as Diagnosis;
      await supabase.from("diagnoses").update({ view_count: (cachedData.view_count || 1) + 1 }).eq("id", cachedData.id);
      return NextResponse.json({
        diagnosis: cachedData.diagnosis_json,
        slug: cachedData.slug,
        cached: true,
      });
    }

    // 2. Fetch repair catalog for AI matching
    const { data: repairCatalog } = await supabase.from("diy_difficulty").select("repair_slug, repair_name").order("repair_name");
    const repairList = (repairCatalog ?? []).map((r: any) => `- ${r.repair_slug} (${r.repair_name})`).join("\n");
    const systemPrompt = SYSTEM_PROMPT_BASE + `\n\nAvailable repairs in our catalog (pick from these for matchedRepairSlugs):\n${repairList}`;

    // 3. Call AI
    const res = await fetch(DEEPSEEK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}` },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Diagnose these car symptoms: ${symptoms}` },
        ],
        temperature: 0.3, max_tokens: 4000,
      }),
    });

    if (!res.ok) return NextResponse.json({ error: "AI service unavailable" }, { status: 502 });

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content ?? "";
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return NextResponse.json({ error: "Failed to parse diagnosis" }, { status: 500 });

    const diagnosis = JSON.parse(jsonMatch[0]);

    // 3. Save to DB
    await supabase.from("diagnoses").insert({
      slug,
      symptom_path: symptoms.substring(0, 200),
      vehicle_make: make || null,
      vehicle_model: model || null,
      vehicle_year: year || null,
      diagnosis_json: diagnosis,
      view_count: 1,
    });

    return NextResponse.json({ diagnosis, slug, cached: false });

  } catch {
    return NextResponse.json({ error: "Diagnosis failed" }, { status: 500 });
  }
}
