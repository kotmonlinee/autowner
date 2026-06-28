/**
 * OBD diagnostic steps — simple batched approach.
 * node scripts/gen-diag-v3.js
 */

const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });
const fs = require("fs");

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { db: { schema: "public" } }
);

const AI_URL = "https://api.deepseek.com/v1/chat/completions";
const AI_KEY = process.env.DEEPSEEK_API_KEY;
const BATCH = 5;

const SYS = `ASE master tech. Output ONLY valid JSON for {code, causes:[{i,prob,kw:[],steps:[{t,do,if}]}]}. Keys: i=cause_index, prob=probability (sum 100), kw=symptom_keywords, steps=verification_steps, t=tool_level (no_tools|basic_tools|obd_scanner|shop), do=method (specific & actionable), if=verdict ("If X → Y"). 3-5 steps/cause, 2+ tool levels. DIY audience.`;

async function processCode(obd) {
  const causes = obd.causes_json ?? [];
  if (!causes.length) return null;

  try {
    const res = await fetch(AI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${AI_KEY}` },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: SYS },
          { role: "user", content: `${obd.code} | ${obd.title} | sev ${obd.severity}/5\nS:${JSON.stringify(obd.symptoms_json??[])}\nC:\n${causes.map((c,i)=>`${i}:${c}`).join("\n")}` },
        ],
        temperature: 0.3, max_tokens: 3000,
      }),
    });
    if (!res.ok) return { code: obd.code, err: `HTTP${res.status}`, n: causes.length };

    const data = await res.json();
    const txt = data.choices?.[0]?.message?.content || "";
    const j = JSON.parse(txt.replace(/```json\n?|```/g, "").replace(/,\s*}/g, "}").replace(/,\s*]/g, "]"));

    if (!j.causes?.length) return { code: obd.code, err: "no_causes", n: causes.length };

    const db = j.causes.map(c => ({
      cause_index: c.i ?? 0,
      probability: c.prob ?? 0,
      symptom_keywords: c.kw || [],
      verification_steps: (c.steps || []).map(s => ({
        level: s.t || "basic_tools",
        method: s.do || "",
        verdict: s.if || "",
      })),
    }));

    const { error } = await supabase.from("obd_diagnostic_steps").upsert({
      obd_code: obd.code,
      causes: db,
      generated_at: new Date().toISOString(),
    }, { onConflict: "obd_code" });

    return { code: obd.code, err: error?.message || null, n: db.length };

  } catch (e) {
    return { code: obd.code, err: e.message.substring(0, 60), n: causes.length };
  }
}

async function main() {
  console.log("Fetching codes...");
  let codes = [];
  let p = 0;
  while (true) {
    const { data } = await supabase.from("obd_codes")
      .select("code,title,severity,symptoms_json,causes_json")
      .not("causes_json", "is", null).order("code")
      .range(p * 1000, (p + 1) * 1000 - 1);
    if (!data?.length) break;
    codes = codes.concat(data);
    p++;
  }
  codes = codes.filter(c => (c.causes_json?.length || 0) > 0);

  const T = codes.length;
  console.log(`${T} codes. Batch size: ${BATCH}\n`);

  let ok = 0, fail = 0, t0 = Date.now();

  for (let i = 0; i < T; i += BATCH) {
    const batch = codes.slice(i, i + BATCH);
    const results = await Promise.allSettled(batch.map(processCode));

    for (const r of results) {
      if (r.status === "fulfilled" && r.value) {
        if (r.value.err) fail++; else ok++;
      } else {
        fail++;
      }
    }

    if ((i + BATCH) % 200 === 0 || i + BATCH >= T) {
      const m = ((Date.now() - t0) / 60000).toFixed(1);
      const rate = ((i + batch.length) / ((Date.now() - t0) / 60000)).toFixed(0);
      console.log(`[${Math.min(i+batch.length, T)}/${T} ${(Math.min(i+batch.length,T)/T*100).toFixed(1)}% | ${m}m | ~${rate}/min | ${ok}✓ ${fail}✗]`);
    }
  }

  const m = ((Date.now() - t0) / 60000).toFixed(1);
  console.log(`\nDone in ${m}m. OK:${ok} Failed:${fail}`);
}

main().catch(e => { console.error(e); process.exit(1); });
