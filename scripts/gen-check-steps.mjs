/**
 * Generate check_steps (Do You Need This Repair?) for all 108 repair types.
 * Stored in diy_difficulty.check_steps JSONB.
 * Usage: node scripts/gen-check-steps.mjs
 */
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const DK = process.env.DEEPSEEK_API_KEY;

const SYSTEM = `You are an ASE-certified master technician. For each repair type, generate a 3-stage diagnostic checklist that a car owner can use to determine if they need this repair.

## Output format: a JSON object with one key "check_steps" containing an array of 3 stage objects:

{
  "check_steps": [
    {
      "stage": "early_warning",
      "symptom": "<what the owner notices first, written for non-mechanics>",
      "action": "<what to do — continue driving is OK, monitor, or schedule checkup>",
      "if_ignored": "<what could happen if left untreated>"
    },
    {
      "stage": "moderate",
      "symptom": "<escalated symptoms the owner would notice>",
      "action": "<timeframe for repair, risks of continued driving, DIY possible?>",
      "if_ignored": "<consequences of waiting longer>"
    },
    {
      "stage": "critical",
      "symptom": "<severe symptoms — noise, smoke, stalling, warning lights>",
      "action": "<stop driving immediately, tow to shop, emergency>",
      "if_ignored": "<catastrophic damage estimate or safety risk>"
    }
  ]
}

## Rules:
- Write for a car OWNER, not a mechanic. No jargon.
- Symptom: something the driver can see, hear, smell, or feel
- Action: concrete, actionable advice
- If_ignored: specific consequence with approximate cost impact when possible
- Return ONLY the JSON object, no markdown, no explanation`;

async function main() {
  // Get all unique repair names from diy_difficulty
  const { data: repairs } = await s.from("diy_difficulty").select("repair_slug, repair_name").order("repair_name");
  console.log(`Generating check_steps for ${repairs.length} repairs...`);

  let ok = 0, fail = 0;
  for (const r of repairs) {
    try {
      const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${DK}` },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [{ role: "system", content: SYSTEM }, { role: "user", content: r.repair_name }],
          temperature: 0.3, max_tokens: 2000,
        }),
      });
      const data = await res.json();
      const content = data.choices?.[0]?.message?.content || "";
      const parsed = JSON.parse(content.replace(/```json\n?|```/g, "").trim());

      if (parsed.check_steps && Array.isArray(parsed.check_steps) && parsed.check_steps.length >= 2) {
        await s.from("diy_difficulty").update({ check_steps: parsed.check_steps }).eq("repair_slug", r.repair_slug);
        ok++;
      } else {
        fail++;
      }
    } catch (e) {
      fail++;
      console.error(`  ${r.repair_name}: ${e.message.substring(0, 50)}`);
    }
  }
  console.log(`Done: ${ok}✓ ${fail}✗`);
}
main();
