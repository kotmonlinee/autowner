import { NextResponse } from "next/server";
import { withRateLimit } from "@/lib/rate-limit";

const DEEPSEEK_URL = "https://api.deepseek.com/v1/chat/completions";

const SYSTEM_PROMPT = `You are an ASE-certified master technician. Diagnose car problems based on user-described symptoms.

Return ONLY valid JSON with this structure:
{
  "title": "Short diagnosis title",
  "severity": "low" | "medium" | "high" | "critical",
  "description": "2-3 sentence explanation of the likely cause and what the owner should do",
  "possibleCodes": ["P0420", ...],
  "repairKeywords": ["catalytic converter", "oxygen sensor", ...]
}

Rules:
- severity: "critical" = stop driving immediately, "high" = serious risk/damage, "medium" = moderate concern, "low" = minor
- possibleCodes: real OBD-II codes (P/C/B/U + 4 digits) most likely associated with these symptoms. Max 4 codes.
- repairKeywords: common repair names/phrases associated with the fix. Max 4 items.
- Be specific and actionable. No generic advice.`;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { symptoms } = body as { symptoms?: string };
    if (!symptoms?.trim()) return NextResponse.json({ error: "Symptoms required" }, { status: 400 });

    // Rate limit: 10 AI diagnoses per minute per IP
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const limited = await withRateLimit(ip, "diagnosis:ai", 10, 60);
    if (limited) return limited;

    const res = await fetch(DEEPSEEK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `Diagnose these car symptoms: ${symptoms}` },
        ],
        temperature: 0.3,
        max_tokens: 500,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: "AI service unavailable" }, { status: 502 });
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content ?? "";
    // Extract JSON from response (DeepSeek may wrap in markdown)
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return NextResponse.json({ error: "Failed to parse diagnosis" }, { status: 500 });

    const diagnosis = JSON.parse(jsonMatch[0]);
    return NextResponse.json({ diagnosis });

  } catch {
    return NextResponse.json({ error: "Diagnosis failed" }, { status: 500 });
  }
}
