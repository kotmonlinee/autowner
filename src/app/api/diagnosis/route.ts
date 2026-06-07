import { NextResponse } from "next/server";
import { withRateLimit } from "@/lib/rate-limit";

const DEEPSEEK_URL = "https://api.deepseek.com/v1/chat/completions";

const SYSTEM_PROMPT = `You are an ASE-certified master technician with 20 years of experience. Diagnose car problems based on user-described symptoms.

When a specific vehicle (make, model, year) is provided, you MUST incorporate vehicle-specific context into ALL fields:
- title: mention the vehicle, e.g. "Front Brake Pads Worn on 2018 Toyota Camry"
- summary: reference the vehicle
- causes: mention model-specific known issues if applicable (e.g., "2018-2020 Camrys are known for premature inner pad wear")
- costEstimate: give a price appropriate for that specific vehicle, not a generic range
- If no vehicle is given, provide a general diagnosis.

Return ONLY valid JSON with this structure:
{
  "title": "Short diagnosis title, include vehicle if known",
  "severity": "low" | "medium" | "high" | "critical",
  "summary": "One-sentence plain-language summary of what's wrong, reference the vehicle if known",
  "causes": [
    {
      "description": "Description of this possible cause in plain English. Reference model-specific issues if applicable.",
      "likelihood": "most likely" | "possible" | "less common"
    }
  ],
  "whatToDo": "Practical next steps. If vehicle is known, mention whether this is a common issue for that model. 2-3 plain sentences.",
  "costEstimate": "Repair cost range in USD specific to this vehicle if known, e.g. '$350–$550 for a 2018 Toyota Camry'. Say 'Varies widely — get a quote' if uncertain.",
  "possibleCodes": ["P0420"],
  "repairKeywords": ["brake pads", "rotor resurfacing"]
}

Rules:
- severity: "critical" = stop driving immediately, "high" = serious, "medium" = schedule repair soon, "low" = monitor
- causes: 2-3 possible causes ordered most to least likely. Include model-specific known issues if vehicle is provided.
- whatToDo: practical, actionable advice. Note if this is a common or known issue for this specific model.
- costEstimate: for the specific vehicle if known. Otherwise general range.
- possibleCodes: real OBD-II codes (P/C/B/U + 4 digits). Max 4.
- repairKeywords: common repair names. Max 4.
- Write for a non-mechanic car owner. Be conversational and reassuring.`;

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
