import { NextResponse } from "next/server";
import { withRateLimit } from "@/lib/rate-limit";
import { createServiceSupabase } from "@/lib/supabase-server";

const DEEPSEEK_URL = "https://api.deepseek.com/v1/chat/completions";

const SYSTEM_PROMPT = `You are an ASE-certified master technician with 20 years of experience. Diagnose car problems based on user-described symptoms.

When a specific vehicle (make, model, year) is provided, you MUST incorporate vehicle-specific context into ALL fields.
If no vehicle is given, provide a general diagnosis.

Return ONLY valid JSON with this structure:
{
  "title": "Short diagnosis title, include vehicle if known",
  "severity": "low" | "medium" | "high" | "critical",
  "summary": "One-sentence plain-language summary",
  "causes": [{"description": "...", "likelihood": "most likely" | "possible" | "less common"}],
  "whatToDo": "Practical next steps. If vehicle is known, mention model-specific issues. 2-3 sentences.",
  "costEstimate": "Repair cost range in USD specific to vehicle if known. Say 'Varies widely' if uncertain.",
  "possibleCodes": ["P0420"],
  "repairKeywords": ["brake pads", "rotor resurfacing"]
}
Rules: severity: "critical"=stop driving, "high"=serious, "medium"=schedule soon, "low"=monitor. 2-3 causes ordered. Max 4 codes/keywords. Write for non-mechanic.`;

function generateSlug(symptoms: string, vehicle?: string): string {
  const base = symptoms.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").substring(0, 60);
  if (vehicle) return `${base}-${vehicle.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").substring(0, 30)}`;
  return base;
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

    // 1. Check cache: exact symptom match OR similar slug match
    const { data: cached } = await (supabase.from("diagnoses") as any).select("*").eq("slug", slug).maybeSingle();
    if (cached) {
      const cachedData = cached as any;
      await (supabase.from("diagnoses") as any).update({ view_count: (cachedData.view_count || 1) + 1 }).eq("id", cachedData.id);
      return NextResponse.json({
        diagnosis: cachedData.diagnosis_json,
        slug: cachedData.slug,
        cached: true,
      });
    }

    // Also check ILIKE match on symptom_path for similar queries
    const { data: similar } = await (supabase.from("diagnoses") as any).select("*").ilike("symptom_path", `%${symptoms.substring(0, 40)}%`).limit(1).maybeSingle();
    if (similar) {
      const similarData = similar as any;
      await (supabase.from("diagnoses") as any).update({ view_count: (similarData.view_count || 1) + 1 }).eq("id", similarData.id);
      return NextResponse.json({
        diagnosis: similarData.diagnosis_json,
        slug: similarData.slug,
        cached: true,
      });
    }

    // 2. Call AI
    const res = await fetch(DEEPSEEK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}` },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `Diagnose these car symptoms: ${symptoms}` },
        ],
        temperature: 0.3, max_tokens: 800,
      }),
    });

    if (!res.ok) return NextResponse.json({ error: "AI service unavailable" }, { status: 502 });

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content ?? "";
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return NextResponse.json({ error: "Failed to parse diagnosis" }, { status: 500 });

    const diagnosis = JSON.parse(jsonMatch[0]);

    // 3. Save to DB
    await (supabase.from("diagnoses") as any).insert({
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
