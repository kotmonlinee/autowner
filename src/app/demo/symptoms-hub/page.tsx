import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// ── Symptom data ─────────────────────────────────────────

const CATEGORIES = [
  { name: "Starting Problems", slug: "starting", count: 6 },
  { name: "Vibration", slug: "vibration", count: 6 },
  { name: "Performance", slug: "performance", count: 6 },
  { name: "Warning Lights", slug: "warning-lights", count: 6 },
  { name: "Temperature", slug: "temperature", count: 4 },
  { name: "Noise", slug: "noise", count: 10 },
  { name: "Smells", slug: "smells", count: 5 },
  { name: "Smoke", slug: "smoke", count: 4 },
  { name: "Leaks", slug: "leaks", count: 5 },
  { name: "Brakes", slug: "brakes", count: 5 },
  { name: "Steering", slug: "steering", count: 5 },
  { name: "Electrical", slug: "electrical", count: 5 },
  { name: "HVAC", slug: "hvac", count: 5 },
];

const HIGHLIGHTS = [
  { name: "Car Won't Start", slug: "car-wont-start", category: "Starting", severity: "high" },
  { name: "Car Shaking When Accelerating", slug: "car-shaking-when-accelerating", category: "Vibration", severity: "medium" },
  { name: "Check Engine Light On", slug: "check-engine-light-on", category: "Warning Lights", severity: "medium" },
  { name: "Engine Overheating", slug: "engine-overheating", category: "Temperature", severity: "critical" },
  { name: "Grinding Noise When Braking", slug: "grinding-noise-when-braking", category: "Noise", severity: "high" },
  { name: "White Smoke from Exhaust", slug: "white-smoke-exhaust", category: "Smoke", severity: "critical" },
  { name: "Oil Leak", slug: "oil-leak", category: "Leaks", severity: "medium" },
  { name: "AC Not Blowing Cold", slug: "ac-not-blowing-cold", category: "HVAC", severity: "low" },
];

// ── Detail page data ─────────────────────────────────────

const EXAMPLE_CAUSES = [
  { repair: "Spark Plug Replacement", probability: 90, severity: "Medium", min: 140, max: 280 },
  { repair: "Ignition Coil Replacement", probability: 85, severity: "Medium", min: 180, max: 390 },
  { repair: "CV Axle Replacement", probability: 75, severity: "High", min: 280, max: 550 },
  { repair: "Engine Mount Replacement", probability: 75, severity: "High", min: 280, max: 540 },
  { repair: "Tire Replacement", probability: 80, severity: "Medium", min: 90, max: 250 },
  { repair: "Fuel Injector Replacement", probability: 65, severity: "Medium", min: 280, max: 550 },
];

const RELATED_OBD = ["P0300", "P0301", "P0302", "P0304"];
const RELATED_LIGHTS = [
  { slug: "check-engine", title: "Check Engine Light (MIL)" },
  { slug: "traction-control", title: "Traction Control Warning" },
];

function formatMoney(n: number) { return `$${n.toLocaleString()}`; }

export default function DemoSymptomsHub() {
  return (
    <div className="min-h-screen bg-surface-0 flex flex-col">
      <Navbar />

      {/* ━━━━━━━━ HUB PAGE ━━━━━━━━ */}
      <main className="flex-1 max-w-5xl mx-auto px-5 py-8 w-full">
        <p className="text-xs font-heading font-bold text-text-muted uppercase tracking-wider mb-6">
          Demo: Symptoms Hub
        </p>

        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-5xl font-display font-bold text-text-primary tracking-tight mb-4">
            What's wrong with{" "}
            <span className="text-primary">your car</span>?
          </h1>
          <p className="text-text-muted text-lg mb-6 max-w-xl mx-auto">
            Tell us what you're experiencing. We'll help you find the cause, estimate the repair cost, and decide if you can fix it yourself.
          </p>
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={20} height={20}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
              <input
                type="search"
                placeholder='Describe your symptom (e.g. "car shakes when braking")'
                className="w-full h-14 pl-12 pr-5 bg-surface-1 border border-surface-border rounded-xl text-text-primary placeholder:text-text-muted text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            <Link href="/symptom-checker" className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-glow transition-all font-heading shadow-sm shadow-primary/20">
              Diagnose with AI
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width={16} height={16}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </Link>
          </div>
        </div>

        {/* Top Symptoms */}
        <section className="mb-10">
          <h2 className="text-sm font-heading font-bold text-text-primary uppercase tracking-wider mb-4">Common Symptoms</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {HIGHLIGHTS.map((s) => (
              <Link key={s.slug} href={`/demo/symptoms-hub#detail`}
                className="group flex items-center gap-3 p-4 bg-surface-1 rounded-xl border border-surface-border hover:border-primary/30 hover:shadow-sm transition-all">
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-heading font-semibold text-text-primary group-hover:text-primary transition-colors line-clamp-2">{s.name}</span>
                  <span className="text-[10px] text-text-muted font-heading">{s.category}</span>
                </div>
                <svg className="w-4 h-4 text-text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width={16} height={16}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
              </Link>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="mb-10">
          <h2 className="text-sm font-heading font-bold text-text-primary uppercase tracking-wider mb-4">Browse by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {CATEGORIES.map((cat) => (
              <Link key={cat.slug} href={`/demo/symptoms-hub#${cat.slug}`}
                className="group flex items-center justify-between p-4 bg-surface-1 rounded-xl border border-surface-border hover:border-primary/30 transition-all">
                <span className="text-sm font-heading font-medium text-text-primary group-hover:text-primary transition-colors">{cat.name}</span>
                <span className="text-xs text-text-muted font-heading">{cat.count}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Divider */}
        <div className="border-t-2 border-primary/20 pt-12 mt-8 mb-6">
          <p className="text-xs font-heading font-bold text-text-muted uppercase tracking-wider mb-6">
            Demo: Symptom Detail Page (car-shaking-when-accelerating)
          </p>
        </div>

        {/* ━━━━━━━━ DETAIL PAGE ━━━━━━━━ */}
        <div id="detail">
          {/* Breadcrumb */}
          <nav className="mb-4 flex items-center gap-2 text-sm text-text-muted font-heading">
            <span className="hover:text-primary transition-colors">Home</span>
            <svg className="w-3 h-3 text-surface-border" fill="none" stroke="currentColor" viewBox="0 0 24 24" width={12} height={12}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            <span className="hover:text-primary transition-colors">Symptoms</span>
            <svg className="w-3 h-3 text-surface-border" fill="none" stroke="currentColor" viewBox="0 0 24 24" width={12} height={12}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            <span className="text-text-secondary">Car Shaking When Accelerating</span>
          </nav>

          {/* SECTION 1: Hero */}
          <div className="bg-surface-1 rounded-2xl border border-surface-border p-6 sm:p-8 mb-6">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary mb-2">Car Shaking When Accelerating</h1>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold font-heading border bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />Medium Severity
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold font-heading border bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />Limited Driving
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-text-muted font-heading uppercase tracking-wider">Typical Repair Cost</p>
                <p className="text-2xl font-heading font-bold text-text-primary">$140 – $550</p>
                <p className="text-[10px] text-text-muted">varies by cause — see breakdown below</p>
              </div>
            </div>
            <Link href="/symptom-checker" className="inline-flex items-center gap-1.5 text-sm font-heading font-semibold text-primary hover:text-primary-glow transition-colors">
              Not sure this matches? Describe YOUR symptoms for a personalized diagnosis →
            </Link>
          </div>

          {/* SECTION 2: What This Means */}
          <div className="bg-surface-1 rounded-2xl border border-surface-border p-5 sm:p-6 mb-6 border-l-4 border-l-primary/40">
            <h2 className="text-lg font-heading font-bold text-text-primary mb-3">What This Means</h2>
            <p className="text-sm text-text-secondary leading-relaxed mb-3">
              When your car shakes or vibrates during acceleration, the issue typically stems from the engine, drivetrain, or suspension system. This symptom usually indicates that one or more components responsible for smooth power delivery or wheel rotation are worn, unbalanced, or failing.
            </p>
            <p className="text-sm text-text-secondary leading-relaxed">
              The shaking is often most noticeable between 30–60 mph and may worsen under hard acceleration. In most cases, the underlying cause is repairable and does not require engine or transmission replacement — but delaying diagnosis can turn a simple fix into a more expensive problem.
            </p>
          </div>

          {/* SECTION 3: Most Common Causes */}
          <div className="bg-surface-1 rounded-2xl border border-surface-border p-5 sm:p-6 mb-6">
            <h2 className="text-lg font-heading font-bold text-text-primary mb-4">Most Common Causes</h2>
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
                  {EXAMPLE_CAUSES.map((c, i) => (
                    <tr key={i} className="border-b border-surface-border last:border-0 hover:bg-surface-0/50 transition-colors">
                      <td className="py-2.5 px-3">
                        <Link href={`/repair-cost/${c.repair.toLowerCase().replace(/ /g, "-")}`} className="text-sm font-heading font-medium text-primary hover:text-primary-glow transition-colors">{c.repair}</Link>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <div className="w-12 h-1.5 bg-surface-3 rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: `${c.probability}%` }} />
                          </div>
                          <span className="text-xs font-heading text-text-secondary">{c.probability}%</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold font-heading ${
                          c.severity === "High" ? "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400" : "bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400"
                        }`}>{c.severity}</span>
                      </td>
                      <td className="py-2.5 px-3 text-right text-sm font-heading font-bold text-text-primary">{formatMoney(c.min)} – {formatMoney(c.max)}</td>
                      <td className="py-2.5 px-1">
                        <svg className="w-3.5 h-3.5 text-text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width={14} height={14}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SECTION 4: DIY Difficulty + Cost */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            <div className="bg-surface-1 rounded-2xl border border-surface-border p-5 text-center">
              <span className="text-3xl font-heading font-bold text-primary">L3</span>
              <p className="text-xs text-text-muted font-heading mt-1">DIY Difficulty</p>
              <p className="text-[10px] text-text-muted mt-0.5">Intermediate — Some experience helps</p>
              <Link href="/repair-cost/diy-levels" className="inline-flex items-center gap-0.5 text-[10px] text-primary font-heading mt-2 hover:text-primary-glow">What's this? →</Link>
            </div>
            <div className="bg-surface-1 rounded-2xl border border-surface-border p-5 text-center">
              <p className="text-xl font-heading font-bold text-text-primary">2 – 5 hours</p>
              <p className="text-xs text-text-muted font-heading mt-1">DIY Time</p>
            </div>
            <div className="bg-surface-1 rounded-2xl border border-surface-border p-5 text-center">
              <span className="inline-flex items-center gap-1.5 text-lg font-heading font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />Medium
              </span>
              <p className="text-xs text-text-muted font-heading mt-1">Risk Level</p>
            </div>
          </div>

          {/* SECTION 5: Related OBD Codes */}
          <div className="bg-surface-1 rounded-2xl border border-surface-border p-5 sm:p-6 mb-6">
            <h2 className="text-lg font-heading font-bold text-text-primary mb-3">Related OBD-II Codes</h2>
            <p className="text-xs text-text-muted mb-3">These diagnostic codes are commonly associated with this symptom:</p>
            <div className="flex flex-wrap gap-2">
              {RELATED_OBD.map((code) => (
                <Link key={code} href={`/obd/${code.toLowerCase()}`}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-0 border border-surface-border text-sm font-mono font-bold text-primary hover:border-primary/40 hover:bg-primary/5 transition-colors">
                  {code}
                  <svg className="w-3 h-3 text-text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width={12} height={12}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                </Link>
              ))}
            </div>
          </div>

          {/* SECTION 6: Related Warning Lights */}
          <div className="bg-surface-1 rounded-2xl border border-surface-border p-5 sm:p-6 mb-6">
            <h2 className="text-lg font-heading font-bold text-text-primary mb-3">Related Warning Lights</h2>
            <div className="space-y-2">
              {RELATED_LIGHTS.map((l) => (
                <Link key={l.slug} href={`/warning-lights/${l.slug}`}
                  className="group flex items-center gap-3 px-4 py-2.5 rounded-xl bg-surface-0 border border-surface-border hover:border-primary/30 hover:bg-primary/5 transition-all">
                  <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-surface-2">
                    <img src={`/warning-lights/${l.slug}.jpg`} alt={l.title} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <span className="text-sm font-heading font-semibold text-text-primary truncate flex-1">{l.title}</span>
                  <svg className="w-3.5 h-3.5 text-text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width={14} height={14}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                </Link>
              ))}
            </div>
          </div>

          {/* SECTION 7: Can I Continue Driving */}
          <div className="bg-orange-50/50 dark:bg-orange-950/10 rounded-2xl border border-orange-200 dark:border-orange-800 p-5 sm:p-6 mb-6">
            <h2 className="text-lg font-heading font-bold text-text-primary mb-3">Can I Continue Driving?</h2>
            <p className="text-sm text-text-secondary leading-relaxed mb-3">
              <strong className="text-orange-700 dark:text-orange-400">Limited driving only.</strong> You can drive short distances to a repair shop, but avoid highway speeds and hard acceleration. The shaking may worsen over time as the underlying component continues to wear.
            </p>
            <p className="text-sm text-text-secondary leading-relaxed">
              Continuing to drive with a severe misfire or failing CV axle can cause additional damage to the catalytic converter, transmission, or suspension components — significantly increasing repair costs.
            </p>
          </div>

          {/* CTA: Full Diagnosis */}
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 sm:p-6 text-center mb-6">
            <h2 className="text-lg font-heading font-bold text-text-primary mb-2">Not Sure This Is Your Issue?</h2>
            <p className="text-sm text-text-secondary mb-4">Describe your exact symptoms to our AI. It'll identify possible causes, OBD codes, and repair costs in seconds.</p>
            <Link href="/symptom-checker" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-glow transition-all font-heading shadow-sm shadow-primary/20">
              Diagnose Your Symptoms
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width={16} height={16}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </Link>
          </div>

          {/* SECTION 8: FAQ */}
          <div className="bg-surface-1 rounded-2xl border border-surface-border p-5 sm:p-6 mb-4">
            <h2 className="text-lg font-heading font-bold text-text-primary mb-4">Frequently Asked Questions</h2>
            <div className="space-y-2">
              {[
                { q: "Why does my car shake when I accelerate?", a: "The most common cause is worn spark plugs or ignition coils causing engine misfire. CV axle failure, unbalanced tires, or worn engine mounts can also cause shaking during acceleration." },
                { q: "How much does it cost to fix a car that shakes when accelerating?", a: "Cost varies by cause. Spark plug replacement costs $140–$280. CV axle replacement costs $280–$550. Engine mount replacement costs $280–$540. A proper diagnosis is recommended to avoid replacing the wrong part." },
                { q: "Is it safe to drive a car that shakes when accelerating?", a: "Limited driving only. Short distances to a repair shop at low speeds are generally OK. Avoid highway driving and hard acceleration as the shaking indicates a component is failing and could cause further damage." },
                { q: "Can bad spark plugs cause shaking when accelerating?", a: "Yes — worn spark plugs are the most common cause. When spark plugs fail to ignite the fuel mixture properly, the engine misfires, causing vibration that's most noticeable under load (acceleration)." },
                { q: "How do I diagnose car shaking when accelerating?", a: "Start by checking for a flashing check engine light (indicates active misfire). Use an OBD-II scanner to read codes. Inspect spark plugs and ignition coils. Check CV axle boots for tears. Test engine mounts by observing engine movement when revving." },
                { q: "Can I fix this myself?", a: "Spark plugs and ignition coils are DIY-friendly (L2 Easy). CV axles require more experience (L3 Intermediate). Engine mounts are advanced (L4). See our DIY guide for each repair's difficulty level." },
              ].map((faq, i) => (
                <details key={i} className="group bg-surface-0 rounded-xl border border-surface-border">
                  <summary className="flex items-center gap-2 cursor-pointer list-none px-4 py-3 min-h-[44px] font-heading font-semibold text-sm text-text-primary hover:text-primary transition-colors">
                    <svg className="w-4 h-4 shrink-0 transition-transform group-open:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24" width={16} height={16}><polyline points="9 18 15 12 9 6" /></svg>
                    {faq.q}
                  </summary>
                  <p className="px-4 pb-4 ml-6 text-sm text-text-secondary leading-relaxed">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
