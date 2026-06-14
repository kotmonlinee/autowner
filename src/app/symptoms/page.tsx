import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createServiceSupabase } from "@/lib/supabase-server";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Common Car Symptoms — Causes, Repair Costs & Safety",
  description: "Browse 58 common car symptoms organized by category. Learn causes, repair costs, diagnosis steps, and whether it's safe to drive.",
  alternates: { canonical: "https://www.autowner.com/symptoms" },
  openGraph: { title: "Common Car Symptoms — Causes, Repair Costs & Safety", description: "Browse 58 common car symptoms by category. Learn causes, repair costs, and whether it's safe to drive.", type: "website" },
  twitter: { card: "summary_large_image", title: "Car Symptoms: Causes, Repair Costs & Safety", description: "Browse 58 common car symptoms by category." },
};

const CATEGORIES: Record<string, { label: string; emoji: string }> = {
  noise: { label: "Noises & Sounds", emoji: "🔊" },
  smells: { label: "Smells & Odors", emoji: "🌫️" },
  smoke: { label: "Smoke & Steam", emoji: "💨" },
  vibration: { label: "Vibration & Shaking", emoji: "📳" },
  starting: { label: "Starting Problems", emoji: "🔑" },
  performance: { label: "Performance Issues", emoji: "🐌" },
  warning_lights: { label: "Warning Lights", emoji: "🚨" },
  temperature: { label: "Temperature Issues", emoji: "🌡️" },
  leaks: { label: "Fluid Leaks", emoji: "🛢️" },
  brakes: { label: "Brake Issues", emoji: "🛞" },
  steering: { label: "Steering Issues", emoji: "🔧" },
  electrical: { label: "Electrical Problems", emoji: "🔋" },
  hvac: { label: "AC & Heating", emoji: "❄️" },
  transmission: { label: "Transmission Issues", emoji: "⚙️" },
};

const SEV_COLORS: Record<string, string> = {
  critical: "bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400",
  high: "bg-orange-50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-400",
  medium: "bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400",
  low: "bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400",
};

export default async function SymptomsPage() {
  const supabase = await createServiceSupabase();
  const { data } = await supabase.from("symptoms").select("slug, name, category, severity").order("name");
  const symptoms = (data ?? []) as { slug: string; name: string; category: string; severity: string }[];

  const grouped = new Map<string, typeof symptoms>();
  for (const s of symptoms) {
    if (!grouped.has(s.category)) grouped.set(s.category, []);
    grouped.get(s.category)!.push(s);
  }

  // Order by category key to ensure consistent layout
  const orderedCategories = Object.keys(CATEGORIES).filter((k) => grouped.has(k));
  // Add any categories not in our map (fallback)
  for (const k of grouped.keys()) {
    if (!orderedCategories.includes(k)) orderedCategories.push(k);
  }

  return (
    <div className="min-h-screen bg-surface-0 flex flex-col">
      <Navbar />
      <main id="main-content" className="max-w-5xl mx-auto px-5 py-6 flex-1 w-full">
        <nav className="mb-4 flex items-center gap-2 text-sm text-text-muted font-heading" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <svg className="w-3 h-3 text-surface-border" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <span className="text-text-secondary">Symptoms</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-display text-text-primary mb-2">Common Car Symptoms</h1>
        <p className="text-text-muted text-sm sm:text-base mb-8 max-w-2xl">Select a symptom to learn what causes it, how much repairs cost, how to diagnose it, and whether it's safe to keep driving.</p>

        <div className="space-y-10">
          {orderedCategories.map((cat) => {
            const info = CATEGORIES[cat] ?? { label: cat.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()), emoji: "🔧" };
            const items = grouped.get(cat)!;
            return (
              <section key={cat}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{info.emoji}</span>
                  <div>
                    <h2 className="text-lg font-heading font-bold text-text-primary">{info.label}</h2>
                  </div>
                  <span className="ml-auto text-xs text-text-muted font-heading">{items.length} symptoms</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {items.map((s) => (
                    <Link
                      key={s.slug}
                      href={`/symptoms/${s.slug}`}
                      className="group flex items-center gap-3 p-3 rounded-xl bg-surface-1 border border-surface-border hover:border-primary/30 hover:bg-primary/5 transition-all"
                    >
                      <span className="text-sm font-heading font-semibold text-text-primary group-hover:text-primary transition-colors flex-1 min-w-0 truncate">{s.name}</span>
                      {s.severity && (
                        <span className={`inline-block text-[10px] font-heading font-semibold px-1.5 py-0.5 rounded-full shrink-0 ${SEV_COLORS[s.severity] ?? "bg-surface-0 text-text-muted"}`}>
                          {s.severity === "critical" ? "Critical" : s.severity === "high" ? "Serious" : s.severity === "medium" ? "Moderate" : "Low"}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}
