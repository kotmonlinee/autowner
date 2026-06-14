import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createServiceSupabase } from "@/lib/supabase-server";
import { formatMoney } from "@/lib/constants";
export const revalidate = 86400;

const SEVERITY_COLORS: Record<string, string> = {
  low: "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800",
  medium: "bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  high: "bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800",
  critical: "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
};

const DRIVING_LABELS: Record<string, string> = {
  safe: "Safe to Drive", limited: "Limited Driving", unsafe: "Do Not Drive",
};

const DRIVING_COLORS: Record<string, string> = {
  safe: "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
  limited: "bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  unsafe: "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createServiceSupabase();
  // Check vehicle_symptoms first
  const { data: vsData } = await supabase.from("vehicle_symptoms").select("title, meta_description, symptom_name").eq("slug", slug).maybeSingle();
  if (vsData) {
    const vs = vsData as any;
    return {
      title: vs.title,
      description: vs.meta_description,
      alternates: { canonical: `https://www.autowner.com/symptoms/${slug}` },
      openGraph: { title: vs.title, description: vs.meta_description, type: "article" },
    };
  }
  const { data } = await supabase.from("symptoms").select("name").eq("slug", slug).maybeSingle();
  if (!data) return { title: "Symptom Not Found" };
  const s = data as any;
  return {
    title: `${s.name}: Causes, Repair Cost & Is It Safe To Drive?`,
    description: `Learn the most common causes of ${s.name.toLowerCase()}, expected repair costs, diagnosis steps, and whether it is safe to continue driving.`,
    alternates: { canonical: `https://www.autowner.com/symptoms/${slug}` },
    openGraph: { title: `${s.name}: Causes, Repair Cost & Is It Safe To Drive?`, description: `Learn what causes ${s.name.toLowerCase()}, how much repairs cost, and whether you can fix it yourself.`, type: "article" },
    twitter: { card: "summary_large_image", title: `${s.name}: Causes, Repair Cost & DIY`, description: `Common causes, repair costs, and diagnosis steps for ${s.name.toLowerCase()}.` },
  };
}

export default async function SymptomPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createServiceSupabase();

  // Check if this is a vehicle-specific symptom article
  const { data: vehicleSymptom } = await supabase.from("vehicle_symptoms").select("*").eq("slug", slug).maybeSingle();
  const vs = vehicleSymptom as any;

  const { data: symptom } = await supabase.from("symptoms").select("*").eq("slug", vs ? vs.symptom_slug : slug).maybeSingle();
  if (!symptom) notFound();

  const s = symptom as any;

  // Fetch causes
  const { data: causes } = await supabase.from("symptom_causes")
    .select("*").eq("symptom_id", s.id).order("probability", { ascending: false });

  const causeList = (causes ?? []) as any[];
  const seen = new Set<string>();
  const uniqueCauses: any[] = [];
  for (const c of causeList) { if (!seen.has(c.cause_name)) { seen.add(c.cause_name); uniqueCauses.push(c); } }

  // Repair cost lookup
  const linkedSlugs = [...new Set(uniqueCauses.filter((c: any) => c.repair_slug).map((c: any) => c.repair_slug))];
  const costMap = new Map<string, { min: number; max: number }>();
  if (linkedSlugs.length > 0) {
    const dbSlugs = linkedSlugs.map((s) => s.replace(/-/g, "_"));
    const { data: costs } = await supabase.from("repair_costs").select("repair_slug, min_cost, max_cost").in("repair_slug", [...linkedSlugs, ...dbSlugs]);
    for (const rc of (costs ?? []) as any[]) {
      if (!costMap.has(rc.repair_slug) || rc.min_cost < costMap.get(rc.repair_slug)!.min) costMap.set(rc.repair_slug, { min: rc.min_cost, max: rc.max_cost });
    }
  }

  const causesWithPrices = uniqueCauses.map((c: any) => {
    const cost = c.repair_slug ? costMap.get(c.repair_slug) ?? costMap.get(c.repair_slug.replace(/-/g, "_")) : null;
    return { ...c, repair_cost_min: cost?.min ?? null, repair_cost_max: cost?.max ?? null };
  });

  const costsWithData = causesWithPrices.filter((c: any) => c.repair_cost_min != null);
  const costMin = costsWithData.length > 0 ? Math.min(...costsWithData.map((c: any) => c.repair_cost_min!)) : null;
  const costMax = costsWithData.length > 0 ? Math.max(...costsWithData.map((c: any) => c.repair_cost_max!)) : null;

  // Related OBD codes — from symptom_obd_codes junction table + obd_codes for titles
  let obdCodes: { code: string; title: string }[] = [];
  const { data: obdJunction } = await supabase.from("symptom_obd_codes").select("obd_code").eq("symptom_id", s.id);
  const obdCodeList = ((obdJunction ?? []) as any[]).map((r: any) => r.obd_code);
  if (obdCodeList.length > 0) {
    const { data: obdData } = await supabase.from("obd_codes").select("code, title").in("code", obdCodeList).order("code");
    obdCodes = (obdData ?? []) as unknown as { code: string; title: string }[];
  }

  // Related warning lights — from symptom_warning_lights junction table + static data for titles
  interface WarningLight { slug: string; title: string; }
  const WARNING_LIGHT_TITLES: Record<string, string> = {
    "check-engine": "Check Engine Light (MIL)",
    "battery-charging": "Battery Charging Warning",
    "oil-pressure": "Oil Pressure Warning",
    "coolant-temperature": "Coolant Temperature Warning",
    "brake-system": "Brake System Warning",
    "abs": "ABS Warning",
    "traction-control": "Traction Control Warning",
    "airbag": "Airbag / SRS Warning",
    "tpms": "Tire Pressure (TPMS)",
    "power-steering": "Power Steering Warning",
    "low-fuel": "Low Fuel Level",
  };
  const warningLights: { slug: string; title: string }[] = [];
  const { data: warningJunction } = await supabase.from("symptom_warning_lights").select("warning_light_slug").eq("symptom_id", s.id);
  const warningSlugs = ((warningJunction ?? []) as any[]).map((r: any) => r.warning_light_slug);
  for (const wSlug of warningSlugs) {
    const title = WARNING_LIGHT_TITLES[wSlug] ?? wSlug.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase());
    warningLights.push({ slug: wSlug, title });
  }

  // DIY difficulty — batch query all linked repairs
  const repSlugs = uniqueCauses.filter((c: any) => c.repair_slug).map((c: any) => c.repair_slug);
  const diyLevels: number[] = [];
  if (repSlugs.length > 0) {
    const { data: diyData } = await supabase.from("diy_difficulty").select("repair_slug, difficulty_level").in("repair_slug", repSlugs);
    const diyMap = new Map((diyData ?? []).map((r: any) => [r.repair_slug, r.difficulty_level]));
    for (const slug of repSlugs) {
      const lvl = diyMap.get(slug);
      if (lvl != null) diyLevels.push(lvl);
    }
  }
  const diyMin = diyLevels.length > 0 ? Math.min(...diyLevels) : null;
  const diyMax = diyLevels.length > 0 ? Math.max(...diyLevels) : null;

  // Related vehicle-specific symptom pages
  let relatedVehicles: { slug: string; vehicle_make: string; vehicle_model: string }[] = [];
  if (!vs) {
    const { data: vData } = await supabase.from("vehicle_symptoms")
      .select("slug, vehicle_make, vehicle_model")
      .eq("symptom_slug", slug)
      .order("vehicle_make").order("vehicle_model")
      .limit(24);
    relatedVehicles = (vData ?? []) as any[];
  }

  // Related diagnoses — match via shared repair slugs, filter by vehicle if applicable
  let relatedDiagnoses: { slug: string; title: string; severity: string }[] = [];
  try {
    const causeSlugs = uniqueCauses.filter((c: any) => c.repair_slug).map((c: any) => c.repair_slug);
    if (causeSlugs.length > 0) {
      let query = supabase.from("diagnoses")
        .select("slug, diagnosis_json, vehicle_make, vehicle_model, view_count")
        .order("view_count", { ascending: false })
        .limit(200);
      if (vs) query = query.eq("vehicle_make", vs.vehicle_make).eq("vehicle_model", vs.vehicle_model);
      const { data: diagData } = await query;
      const slugSet = new Set(causeSlugs);
      relatedDiagnoses = ((diagData ?? []) as any[])
        .filter((d: any) => {
          const matched = d.diagnosis_json?.matchedRepairSlugs ?? [];
          return matched.some((rs: string) => slugSet.has(rs));
        })
        .slice(0, 3)
        .map((d: any) => ({
          slug: d.slug,
          title: d.diagnosis_json?.title ?? "Car Diagnosis",
          severity: d.diagnosis_json?.severity ?? "medium",
        }));
    }
  } catch { /* keep empty */ }

  // Category descriptions
  const catDesc: Record<string, string> = {
    vibration: "engine, drivetrain, or suspension systems",
    noise: "brakes, suspension, or drivetrain components",
    starting: "battery, starter, fuel system, or ignition components",
    warning_lights: "emissions, sensor, or electrical systems",
    temperature: "cooling system",
    smells: "fluids, exhaust, or electrical components",
    smoke: "engine, turbo, or fuel system",
    leaks: "gaskets, seals, or hoses",
    brakes: "brake hydraulic system or pads/rotors",
    performance: "fuel, ignition, or air intake systems",
    steering: "steering or suspension components",
    electrical: "battery, alternator, or wiring",
    hvac: "air conditioning or heating system",
    transmission: "transmission or drivetrain",
  };

  // FAQ — prefer AI-generated from DB, fall back to template
  let faqFromDb: { q: string; a: string }[] | null = null;
  if (s.faq_items) {
    try { faqFromDb = JSON.parse(s.faq_items); } catch { /* keep null */ }
  }
  const faqItems = faqFromDb ?? [
    { q: `What causes ${vs ? `${s.name.toLowerCase()} on a ${vs.vehicle_make} ${vs.vehicle_model}` : s.name.toLowerCase()}?`, a: vs?.causes?.length ? `The most common causes for ${vs.vehicle_make} ${vs.vehicle_model} include ${vs.causes.slice(0, 3).map((c: any) => `${c.cause.toLowerCase()} (${c.probability}% probability, ${c.cost})`).join("; ")}. A proper diagnosis is highly recommended before replacing any parts, as fixing the wrong cause wastes time and money.` : `The most common causes include ${causesWithPrices.slice(0, 3).map((c: any, i: number) => `${c.cause_name.toLowerCase()} (${c.probability}% probability${c.repair_cost_min ? `, repair cost ${formatMoney(c.repair_cost_min)}–${formatMoney(c.repair_cost_max)}` : ""})`).join("; ")}. A proper diagnosis is highly recommended before replacing any parts, as fixing the wrong cause wastes time and money.` },
    { q: `How much does it cost to fix ${s.name.toLowerCase()}?`, a: costMin != null && costMax != null ? `Repair costs typically range from ${formatMoney(costMin)} to ${formatMoney(costMax)}, depending on the underlying cause and your vehicle.` : `Costs vary widely depending on the cause. Get a professional diagnosis first.` },
    { q: `Is it safe to drive with ${s.name.toLowerCase()}?`, a: s.driving_risk === "unsafe" ? "No. Have the vehicle towed to a repair shop immediately." : s.driving_risk === "limited" ? "Limited driving only. Short distances to a repair shop at low speeds are generally OK." : "Yes, you can typically continue driving, but schedule a diagnosis soon." },
    { q: `Can I fix ${s.name.toLowerCase()} myself?`, a: diyMin != null && diyMax != null ? `It depends on the cause. DIY difficulty ranges from L${diyMin} to L${diyMax} for this symptom. ${diyMax! <= 2 ? "All common causes are beginner-friendly." : diyMin! <= 2 ? "Some causes are easy DIY, but others require professional help. Check the causes table above." : "Most causes require significant mechanical experience or professional equipment."}` : "It depends on the cause. Check each cause above for its DIY difficulty level. Simple fixes may be DIY-friendly; complex repairs require a professional." },
    { q: `What should I check first for ${s.name.toLowerCase()}?`, a: "Start with a visual inspection and OBD-II scan. Check the most likely causes from the table above, beginning with the highest-probability item. This saves time and money by avoiding unnecessary part replacement." },
    { q: `How long does it take to fix ${s.name.toLowerCase()}?`, a: `Repair time depends on the cause. Simple DIY repairs (L1–L2) take under 1 hour, intermediate repairs (L3) take 1–4 hours, and advanced to professional jobs (L4–L5) can take 3–20+ hours. Check each cause's repair page above for specific time estimates.` },
    { q: `Will ${s.name.toLowerCase()} cause further damage if I ignore it?`, a: s.severity === "critical" || s.severity === "high" ? "Yes. Delaying repair can cause cascading damage to related components, significantly increasing the final repair cost. Address this symptom as soon as possible." : "While you may be able to drive for a while, ignoring symptoms allows underlying issues to worsen. What starts as a minor repair can become a major expense." },
    { q: `What should I do if I'm not sure which cause is responsible?`, a: `If you can't pinpoint the exact cause from the table above, describe your symptoms to our AI diagnosis tool — it asks about your specific vehicle, symptoms, and conditions to narrow down the possibilities. Alternatively, a professional mechanic can run targeted tests (compression test, fuel pressure test, smoke test) to isolate the problem without guesswork.` },
  ];

  const faqJsonLd = {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } })),
  };

  const pageTitle = vs ? vs.title : `${s.name}: Causes, Repair Cost & Is It Safe To Drive?`;
  const pageDesc = vs ? vs.meta_description : `Learn the most common causes of ${s.name.toLowerCase()}, expected repair costs, diagnosis steps, and whether it is safe to continue driving.`;
  const articleJsonLd = {
    "@context": "https://schema.org", "@type": "Article",
    headline: pageTitle,
    description: pageDesc.substring(0, 160),
    publisher: { "@type": "Organization", name: "AutOwner" },
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: vs ? [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.autowner.com" },
      { "@type": "ListItem", position: 2, name: "Symptoms", item: "https://www.autowner.com/symptoms" },
      { "@type": "ListItem", position: 3, name: `${vs.vehicle_make} ${vs.vehicle_model}`, item: `https://www.autowner.com/symptoms/${vs.slug}` },
    ] : [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.autowner.com" },
      { "@type": "ListItem", position: 2, name: "Symptoms", item: "https://www.autowner.com/symptoms" },
      { "@type": "ListItem", position: 3, name: s.name, item: `https://www.autowner.com/symptoms/${slug}` },
    ],
  };

  return (
    <div className="min-h-screen bg-surface-0 flex flex-col">
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <main className="flex-1 max-w-3xl mx-auto px-5 py-8 w-full">
        <nav className="mb-4 flex items-center gap-2 text-sm text-text-muted font-heading" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <svg className="w-3 h-3 text-surface-border" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <Link href="/symptoms" className="hover:text-primary transition-colors">Symptoms</Link>
          {vs && (
            <>
              <svg className="w-3 h-3 text-surface-border" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              <span className="text-text-secondary">{vs.vehicle_make} {vs.vehicle_model}</span>
            </>
          )}
          <svg className="w-3 h-3 text-surface-border" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <span className="text-text-secondary truncate">{vs ? vs.symptom_name : s.name}</span>
        </nav>

        {/* 1. Hero */}
        <div className="bg-surface-1 rounded-2xl border border-surface-border p-5 sm:p-8 mb-6">
          <div className="mb-5">
            {vs && (
              <p className="text-xs text-text-muted font-heading mb-2">{vs.vehicle_make} {vs.vehicle_model}</p>
            )}
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary mb-3">{vs ? vs.h1 : s.name}</h1>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold font-heading border ${SEVERITY_COLORS[s.severity]}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${s.severity === "critical" ? "bg-red-500" : s.severity === "high" ? "bg-orange-500" : s.severity === "medium" ? "bg-amber-500" : "bg-emerald-500"}`} />
                {s.severity === "critical" ? "Critical" : s.severity === "high" ? "Serious" : s.severity === "medium" ? "Moderate" : "Low"}
              </span>
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold font-heading border ${DRIVING_COLORS[s.driving_risk]}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${s.driving_risk === "unsafe" ? "bg-red-500" : s.driving_risk === "limited" ? "bg-amber-500" : "bg-emerald-500"}`} />
                {DRIVING_LABELS[s.driving_risk]}
              </span>
            </div>
          </div>
          <Link href="/symptom-checker" className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/20 rounded-xl hover:bg-primary/10 hover:border-primary/40 transition-all group">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-heading font-bold text-primary block group-hover:text-primary-glow transition-colors">Get a Personalized AI Diagnosis</span>
              <span className="text-xs text-text-muted">Describe your specific symptoms for an AI-powered diagnosis with repair costs and OBD codes</span>
            </div>
            <svg className="w-5 h-5 text-primary shrink-0 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
          </Link>
        </div>

        {/* Related Diagnoses */}
        {relatedDiagnoses.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xs font-heading font-bold text-text-muted uppercase tracking-wider mb-3">Related AI Diagnoses</h2>
            <div className="space-y-2">
              {relatedDiagnoses.map((d) => (
                <Link key={d.slug} href={`/symptom-checker/${d.slug}`} className="flex items-center gap-3 p-3 rounded-xl bg-surface-1 border border-surface-border hover:border-primary/30 hover:bg-primary/5 transition-all group">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${d.severity === "critical" ? "bg-red-500" : d.severity === "high" ? "bg-orange-500" : d.severity === "medium" ? "bg-amber-500" : "bg-emerald-500"}`} />
                  <span className="text-sm font-heading font-semibold text-text-primary group-hover:text-primary transition-colors truncate flex-1">{d.title}</span>
                  <svg className="w-4 h-4 text-text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 2. What This Means */}
        <div className="bg-surface-1 rounded-2xl border border-surface-border p-5 sm:p-6 mb-6 border-l-4 border-l-primary/40">
          <h2 className="text-lg font-heading font-bold text-text-primary mb-3">What This Means</h2>
          {vs?.overview ? (
            <p className="text-sm text-text-secondary leading-relaxed">{vs.overview}</p>
          ) : s.overview ? (
            <p className="text-sm text-text-secondary leading-relaxed">{s.overview}</p>
          ) : (
            (() => {
              const top3 = causesWithPrices.slice(0, 3);
              const highSeverityText = causesWithPrices[0]?.repair_cost_min != null
                ? `This should be diagnosed within a few days. While short-distance driving may be possible, delaying repair can turn a ${formatMoney(causesWithPrices[0].repair_cost_min)} fix into a much more expensive problem.`
                : "This should be diagnosed within a few days. While short-distance driving may be possible, delaying repair can turn a simple fix into a much more expensive problem.";
              const defaultText = costMin != null && costMax != null
                ? `This is usually manageable in the short term. Repair costs range from ${formatMoney(costMin)} to ${formatMoney(costMax)} depending on which cause is responsible — see the breakdown below.`
                : "This is usually manageable in the short term. See the breakdown below for common causes and their repair costs.";
              return (<>
                <p className="text-sm text-text-secondary leading-relaxed mb-3">
                  When you experience <strong className="text-text-primary">{s.name.toLowerCase()}</strong>, the root cause typically involves the {catDesc[s.category] ?? "vehicle"}. The most likely culprit is <strong className="text-text-primary">{top3[0]?.cause_name?.toLowerCase() || "a mechanical issue"}</strong> ({top3[0]?.probability || "?"}% probability), followed by {top3[1]?.cause_name?.toLowerCase() || "other potential causes"} ({top3[1]?.probability || "?"}%) and {top3[2]?.cause_name?.toLowerCase() || "additional factors"} ({top3[2]?.probability || "?"}%).
                </p>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {s.severity === "critical" ? "This is a critical issue — continuing to drive may cause severe engine or safety system damage. Have the vehicle towed to a repair shop immediately."
                  : s.severity === "high" ? highSeverityText
                  : s.severity === "low" ? "This is typically a manageable issue. You can continue driving normally, but schedule a diagnosis at your convenience. Left unchecked, even minor symptoms can lead to more significant repairs."
                  : defaultText}
                </p>
              </>);
            })()
          )}
        </div>

        {/* 3. Can I Continue Driving */}
        <div className={`rounded-2xl border-2 p-5 sm:p-6 mb-6 border-l-[6px] ${s.driving_risk === "unsafe" ? "bg-red-50/40 dark:bg-red-950/15 border-red-400 dark:border-red-600" : s.driving_risk === "limited" ? "bg-orange-50/40 dark:bg-orange-950/15 border-orange-400 dark:border-orange-600" : "bg-emerald-50/40 dark:bg-emerald-950/15 border-emerald-400 dark:border-emerald-600"}`}>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">{s.driving_risk === "unsafe" ? "🚨" : s.driving_risk === "limited" ? "⚠️" : "✅"}</span>
            <div>
              <h2 className="text-lg font-heading font-bold text-text-primary">Can I Continue Driving?</h2>
              <span className={`text-sm font-heading font-bold ${s.driving_risk === "unsafe" ? "text-red-700 dark:text-red-400" : s.driving_risk === "limited" ? "text-orange-700 dark:text-orange-400" : "text-emerald-700 dark:text-emerald-400"}`}>
                {s.driving_risk === "unsafe" ? "Do Not Drive — Tow Required" : s.driving_risk === "limited" ? "Limited Driving Only" : "Safe to Drive"}
              </span>
            </div>
          </div>
          {s.driving_advice ? (
            <div className="text-sm text-text-secondary leading-relaxed space-y-2">
              {s.driving_advice.split(/\n\n|\n/).filter(Boolean).map((para: string, i: number) => (
                <p key={i}>{para.trim()}</p>
              ))}
            </div>
          ) : s.driving_risk === "unsafe" ? (
            <div className="text-sm text-text-secondary leading-relaxed space-y-2">
              <p>This symptom indicates a serious safety risk or the potential for catastrophic engine or drivetrain damage. Continuing to operate the vehicle could cause further damage to critical components and create a dangerous situation for you and other drivers.</p>
              <p>Have the vehicle towed to a qualified repair shop immediately. The cost of a tow is far less than the cost of an engine rebuild or transmission replacement. If you must move the vehicle a short distance, do so only at very low speed and for emergency purposes only.</p>
            </div>
          ) : s.driving_risk === "limited" ? (
            <div className="text-sm text-text-secondary leading-relaxed space-y-2">
              <p>You can drive short distances to a repair shop at low speeds, but avoid highway driving, hard acceleration, and heavy loads. Schedule a diagnosis as soon as possible — ideally within the next few days.</p>
              <p>Continuing to drive with this symptom may worsen the underlying condition. What starts as an affordable fix can escalate into a significantly more expensive repair if components fail completely while driving. Monitor for any change in severity and stop driving immediately if the symptom worsens.</p>
            </div>
          ) : (
            <div className="text-sm text-text-secondary leading-relaxed space-y-2">
              <p>You can continue normal driving, but the symptom should be diagnosed at your earliest convenience. Use the causes table above to understand what might be happening and schedule a professional inspection if needed.</p>
              <p>Even minor symptoms can indicate developing problems. What starts as a subtle vibration or intermittent noise can progress to component failure if left unaddressed for weeks or months. Early diagnosis typically costs far less than emergency repairs.</p>
            </div>
          )}
        </div>

        {/* 4. Most Common Fixes */}
        <div id="causes" className="bg-surface-1 rounded-2xl border border-surface-border p-5 sm:p-6 mb-6 scroll-mt-20">
          <h2 className="text-lg font-heading font-bold text-text-primary mb-4">Most Common Fixes</h2>
          {vs?.causes ? (
            <div className="space-y-2 mb-4">
              {vs.causes.map((c: any, i: number) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-surface-0 border border-surface-border">
                  <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 text-sm font-bold font-heading">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-heading font-semibold text-text-primary block">{c.cause}</span>
                    <span className="text-xs text-text-muted">{c.probability}% probability · {c.cost}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-border">
                  <th className="text-left py-2 px-3 text-xs font-heading font-bold text-text-muted uppercase tracking-wider">Cause</th>
                  <th className="text-center py-2 px-3 text-xs font-heading font-bold text-text-muted uppercase tracking-wider">Probability</th>
                  <th className="text-center py-2 px-3 text-xs font-heading font-bold text-text-muted uppercase tracking-wider">Severity</th>
                  <th className="text-right py-2 px-3 text-xs font-heading font-bold text-text-muted uppercase tracking-wider">Repair Cost</th>
                  <th className="w-8"></th>
                </tr>
              </thead>
              <tbody>
                {causesWithPrices.map((c: any, i: number) => (
                  <tr key={i} className="border-b border-surface-border last:border-0 hover:bg-surface-0/50 transition-colors">
                    <td className="py-2.5 px-3">
                      {c.repair_slug ? (
                        <Link href={`/repair-cost/${c.repair_slug.replace(/_/g, "-")}`} className="text-sm font-heading font-medium text-primary hover:text-primary-glow transition-colors">{c.cause_name}</Link>
                      ) : (
                        <span className="text-sm font-heading font-medium text-text-primary">{c.cause_name}</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <div className="w-12 h-1.5 bg-surface-3 rounded-full overflow-hidden"><div className="h-full bg-primary rounded-full" style={{ width: `${c.probability}%` }} /></div>
                        <span className="text-xs font-heading text-text-secondary">{c.probability}%</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold font-heading ${c.severity === "critical" ? "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400" : c.severity === "high" ? "bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-400" : "bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400"}`}>{c.severity}</span>
                    </td>
                    <td className="py-2.5 px-3 text-right text-sm font-heading">
                      {c.repair_cost_min != null ? <span className="font-bold text-text-primary">{formatMoney(c.repair_cost_min)} – {formatMoney(c.repair_cost_max)}</span> : <span className="text-text-muted text-xs">Varies by vehicle</span>}
                    </td>
                    <td className="py-2.5 px-1">{c.repair_slug && <svg className="w-3.5 h-3.5 text-text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 5. DIY Difficulty */}
        {diyMin != null && diyMax != null && (
          <div className="bg-surface-1 rounded-2xl border border-surface-border p-5 sm:p-6 mb-6 border-l-4 border-l-primary/40">
            <h2 className="text-lg font-heading font-bold text-text-primary mb-3">DIY Difficulty</h2>
            <p className="text-sm text-text-secondary mb-4">
              The repairs associated with {s.name.toLowerCase()} range from{" "}
              <strong className="text-primary">{diyMax! <= 2 ? "Easy" : diyMin! >= 4 ? "Hard" : "Moderate"}</strong>{" "}
              difficulty (L{diyMin}{diyMin !== diyMax ? `–L${diyMax}` : ""} on our 5-level scale).
              {diyMax! <= 2 ? " All common causes can be tackled with basic hand tools and minimal experience." :
               diyMin! >= 4 ? " These repairs require specialized tools, significant mechanical experience, and in some cases professional certification." :
               " The difficulty varies by cause — some repairs are DIY-friendly, while others require professional equipment and experience."}
              {" "}Check the causes table above and click through to each repair for specific time estimates, required tools, safety notes, and step-by-step guidance.
            </p>
            <Link href="/repair-cost/diy-levels" className="inline-flex items-center gap-1.5 text-xs font-heading font-semibold text-primary hover:text-primary-glow transition-colors">Understand our 5-level DIY system →</Link>
          </div>
        )}

        {/* 6. How To Diagnose */}
        <div className="bg-surface-1 rounded-2xl border border-surface-border p-5 sm:p-6 mb-6">
          <h2 className="text-lg font-heading font-bold text-text-primary mb-4">How To Diagnose</h2>
          {s.diagnosis_steps ? (
            <div className="text-sm text-text-secondary leading-relaxed [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-3 [&_li]:mb-2 [&_strong]:text-text-primary" dangerouslySetInnerHTML={{ __html: s.diagnosis_steps }} />
          ) : (
          <ol className="space-y-3 text-sm text-text-secondary leading-relaxed list-decimal pl-5">
            <li><strong className="text-text-primary">Visual inspection.</strong> Check for obvious signs — leaking fluids, worn or damaged components, loose connections, or corrosion around the relevant system.</li>
            <li><strong className="text-text-primary">Scan for trouble codes.</strong> Use an OBD-II scanner to check for diagnostic trouble codes. Even if the check engine light is not on, pending codes may provide clues.</li>
            {s.category === "vibration" && <li><strong className="text-text-primary">Road test.</strong> Note when the shaking occurs — during acceleration, braking, at idle, or at specific speeds. Check if it changes with engine RPM (drivetrain) or road speed (wheels/tires).</li>}
            {s.category === "noise" && <li><strong className="text-text-primary">Isolate the noise.</strong> Note when the sound occurs — at idle, during acceleration, when turning, or when braking. Try to determine which area (engine bay, wheels, underbody) it comes from.</li>}
            {s.category === "starting" && <li><strong className="text-text-primary">Test battery and starter.</strong> Check battery voltage (12.4–12.7V with engine off). If you hear a click but no crank, suspect the starter. If cranking is normal but engine won't fire, focus on fuel and ignition.</li>}
            {s.category === "leaks" && <li><strong className="text-text-primary">Identify the fluid.</strong> Check the color and location: brown/black = oil, green/orange = coolant, red = transmission fluid, clear/yellow = brake fluid. Place cardboard under the car overnight to locate the source.</li>}
            {s.category === "brakes" && <li><strong className="text-text-primary">Inspect brake components.</strong> Check brake pad thickness, rotor surface for grooves or warping, and look for fluid leaks around calipers and brake lines. Test brake pedal feel with engine off and running.</li>}
            {s.category === "temperature" && <li><strong className="text-text-primary">Check coolant level and condition.</strong> Look for low coolant in the reservoir, visible leaks around hoses and radiator, and check if the cooling fan turns on when the engine reaches operating temperature.</li>}
            {s.category === "performance" && <li><strong className="text-text-primary">Check air and fuel delivery.</strong> Inspect the air filter for clogging. Listen for vacuum leaks (hissing sound). Check fuel trim data with an OBD-II scanner — abnormal values point to fuel delivery or sensor issues.</li>}
            {s.category === "smoke" && <li><strong className="text-text-primary">Identify smoke color.</strong> White smoke = coolant in combustion chamber (head gasket). Blue/gray smoke = burning oil (valve seals, piston rings, turbo). Black smoke = running too rich (fuel injector, MAF sensor, O2 sensor).</li>}
            {s.category === "smells" && <li><strong className="text-text-primary">Identify the smell.</strong> Burning rubber = slipping belt or brake issue. Gasoline = fuel leak or EVAP problem. Sweet/maple syrup = coolant leak. Burning oil = oil leaking onto exhaust. Rotten egg/sulfur = catalytic converter failure.</li>}
            {s.category === "warning_lights" && <li><strong className="text-text-primary">Read the trouble code first.</strong> Use an OBD-II scanner to retrieve the specific diagnostic trouble code. The code tells you which system triggered the light — don't guess without scanning first.</li>}
            {s.category === "electrical" && <li><strong className="text-text-primary">Test voltage and connections.</strong> Check battery voltage (12.4–12.7V off, 13.7–14.7V running). Inspect fuses related to the affected circuit. Look for corroded terminals or damaged wiring.</li>}
            {s.category === "hvac" && <li><strong className="text-text-primary">Check blower and temperature.</strong> Turn fan through all speeds — if only some speeds work, suspect the blower resistor. If air isn't cold, check for refrigerant leaks. If air isn't hot, check coolant level and thermostat.</li>}
            {s.category === "transmission" && <li><strong className="text-text-primary">Check fluid level and condition.</strong> With engine warm and running, check transmission fluid on the dipstick. Dark/burnt-smelling fluid indicates internal wear. Low fluid may cause slipping or harsh shifting.</li>}
            <li><strong className="text-text-primary">Check the most likely causes first.</strong> Based on the probability table above, start with the highest-probability cause and work downward.</li>
            <li><strong className="text-text-primary">Consult a professional if unsure.</strong> If the diagnosis is inconclusive or requires specialized equipment, have a certified mechanic perform a professional diagnosis.</li>
          </ol>
          )}
        </div>

        {/* 7. Related OBD Codes */}
        {obdCodes.length > 0 && (
          <div className="bg-surface-1 rounded-2xl border border-surface-border p-5 sm:p-6 mb-6">
            <h2 className="text-lg font-heading font-bold text-text-primary mb-3">Related OBD-II Codes</h2>
            <p className="text-xs text-text-muted mb-3">These diagnostic trouble codes are commonly associated with this symptom:</p>
            <div className="space-y-1.5">
              {obdCodes.map((obd) => (
                <Link key={obd.code} href={`/obd/${obd.code.toLowerCase()}`} className="group flex items-center gap-3 px-4 py-2.5 rounded-xl bg-surface-0 border border-surface-border hover:border-primary/30 hover:bg-primary/5 transition-all">
                  <span className="text-sm font-mono font-bold text-primary shrink-0">{obd.code}</span>
                  <span className="h-4 w-px bg-surface-border shrink-0" />
                  <span className="text-xs text-text-secondary truncate flex-1">{obd.title}</span>
                  <svg className="w-3.5 h-3.5 text-text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 8. Related Warning Lights */}
        {warningLights.length > 0 && (
          <div className="bg-surface-1 rounded-2xl border border-surface-border p-5 sm:p-6 mb-6">
            <h2 className="text-lg font-heading font-bold text-text-primary mb-3">Related Warning Lights</h2>
            <div className="space-y-2">
              {warningLights.slice(0, 5).map((l) => (
                <Link key={l.slug} href={`/warning-lights/${l.slug}`} className="group flex items-center gap-3 px-4 py-2.5 rounded-xl bg-surface-0 border border-surface-border hover:border-primary/30 hover:bg-primary/5 transition-all">
                  <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-surface-2"><img src={`/warning-lights/${l.slug}.jpg`} alt={l.title} className="w-full h-full object-cover" loading="lazy" /></div>
                  <span className="text-sm font-heading font-semibold text-text-primary truncate flex-1">{l.title}</span>
                  <svg className="w-3.5 h-3.5 text-text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Related Vehicles */}
        {!vs && relatedVehicles.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-heading font-bold text-text-primary mb-3">See This Symptom on Specific Vehicles</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {relatedVehicles.map((rv) => (
                <Link key={rv.slug} href={`/symptoms/${rv.slug}`} className="flex items-center gap-2 p-2.5 rounded-lg bg-surface-1 border border-surface-border hover:border-primary/30 hover:bg-primary/5 transition-all group">
                  <span className="text-sm font-heading font-medium text-text-primary group-hover:text-primary transition-colors truncate">{rv.vehicle_make} {rv.vehicle_model}</span>
                  <svg className="w-3.5 h-3.5 text-text-muted shrink-0 group-hover:text-primary group-hover:translate-x-0.5 transition-all" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 10. FAQ */}
        <div className="bg-surface-1 rounded-2xl border border-surface-border p-5 sm:p-6 mb-4">
          <h2 className="text-lg font-heading font-bold text-text-primary mb-4">Frequently Asked Questions</h2>
          <div className="space-y-2">
            {faqItems.map((faq, i) => (
              <details key={i} className="group bg-surface-0 rounded-xl border border-surface-border">
                <summary className="flex items-center gap-2 cursor-pointer list-none px-4 py-3 min-h-[44px] font-heading font-semibold text-sm text-text-primary hover:text-primary transition-colors">
                  <svg className="w-4 h-4 shrink-0 transition-transform group-open:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" /></svg>
                  {faq.q}
                </summary>
                <p className="px-4 pb-4 ml-6 text-sm text-text-secondary leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
