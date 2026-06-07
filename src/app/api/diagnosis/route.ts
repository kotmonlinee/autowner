import { NextResponse } from "next/server";
import { withRateLimit } from "@/lib/rate-limit";

const DEEPSEEK_URL = "https://api.deepseek.com/v1/chat/completions";

const SYSTEM_PROMPT = `You are an ASE-certified master technician with 20 years of experience. Diagnose car problems based on user-described symptoms.

Return ONLY valid JSON with this structure:
{
  "title": "Short diagnosis title (e.g., 'Worn Front Brake Pads')",
  "severity": "low" | "medium" | "high" | "critical",
  "summary": "One-sentence plain-language summary of what's wrong",
  "causes": [
    {
      "description": "Description of this possible cause in plain English",
      "likelihood": "most likely" | "possible" | "less common"
    }
  ],
  "whatToDo": "Practical next steps the owner should take, in 2-3 plain sentences. Be specific.",
  "costEstimate": "Typical repair cost range in USD, e.g. '$200–$500'",
  "possibleCodes": ["P0420"],
  "repairKeywords": ["brake pads", "rotor resurfacing"]
}

Rules:
- severity: "critical" = stop driving immediately and tow to shop, "high" = serious, have inspected within days, "medium" = schedule repair soon, "low" = monitor and check at convenience
- causes: list 2-3 possible causes in order from most to least likely. Each with a "likelihood" field.
- whatToDo: practical, actionable advice in plain language. No jargon. Include safety warnings if applicable.
- costEstimate: realistic USD range for a typical shop. Say "Varies widely — get a quote" if uncertain.
- possibleCodes: real OBD-II codes (P/C/B/U + 4 digits). Max 4.
- repairKeywords: common repair names. Max 4.
- Write for a non-mechanic car owner. Use simple, clear language.`;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { symptoms } = body as { symptoms?: string };
    if (!symptoms?.trim()) return NextResponse.json({ error: "Symptoms required" }, { status: 400 });

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
        max_tokens: 800,
      }),
    });

    if (!res.ok) return NextResponse.json({ error: "AI service unavailable" }, { status: 502 });

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content ?? "";
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return NextResponse.json({ error: "Failed to parse diagnosis" }, { status: 500 });

    const diagnosis = JSON.parse(jsonMatch[0]);
    return NextResponse.json({ diagnosis });

  } catch {
    return NextResponse.json({ error: "Diagnosis failed" }, { status: 500 });
  }
}
