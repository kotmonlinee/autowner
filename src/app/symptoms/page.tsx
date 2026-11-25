import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createServiceSupabase } from "@/lib/supabase-server";
import { DEFAULT_OG_IMAGE, DEFAULT_OG_IMAGE_META } from "@/lib/constants";
import Breadcrumbs from "@/components/content/Breadcrumbs";
import PageHeader from "@/components/content/PageHeader";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Common Car Symptoms — Causes, Repair Costs & Safety",
  description: "Browse 58 common car symptoms organized by category. Learn causes, repair costs, diagnosis steps, and whether it's safe to drive.",
  alternates: { canonical: "https://www.autowner.com/symptoms" },
  openGraph: { title: "Common Car Symptoms — Causes, Repair Costs & Safety", description: "Browse 58 common car symptoms by category. Learn causes, repair costs, and whether it's safe to drive.", type: "website", images: [DEFAULT_OG_IMAGE_META] },
  twitter: { card: "summary_large_image", title: "Car Symptoms: Causes, Repair Costs & Safety", description: "Browse 58 common car symptoms by category.", images: [DEFAULT_OG_IMAGE] },
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
  critical: "bg-red-50  text-red-700 ",
  high: "bg-orange-50  text-orange-700 ",
  medium: "bg-amber-50  text-amber-700 ",
  low: "bg-green-50  text-green-700 ",
};

export default async function SymptomsPage() {
  let symptoms: { slug: string; name: string; category: string; severity: string }[] = [];
  try {
    const supabase = await createServiceSupabase();
    const { data } = await supabase.from("symptoms").select("slug, name, category, severity").order("name");
    symptoms = (data ?? []) as { slug: string; name: string; category: string; severity: string }[];
  } catch {
    // Keep the build deployable while the database is unavailable.
  }

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
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Symptoms" }]} />
        <PageHeader
          eyebrow="Symptom index"
          title="Common car symptoms"
          description="Select what the vehicle is doing, then review likely causes, verification steps, repair costs, and driving guidance."
          aside={
            <div className="grid grid-cols-2 border border-surface-border bg-surface-1">
              <div className="border-b border-r border-surface-border p-4">
                <p className="font-display text-3xl font-semibold text-text-primary">{symptoms.length}</p>
                <p className="mt-1 text-[9px] font-heading font-bold uppercase tracking-[0.12em] text-text-muted">common symptoms</p>
              </div>
              <div className="border-b border-surface-border p-4">
                <p className="font-display text-3xl font-semibold text-text-primary">{orderedCategories.length}</p>
                <p className="mt-1 text-[9px] font-heading font-bold uppercase tracking-[0.12em] text-text-muted">categories</p>
              </div>
              <div className="col-span-2 p-4 text-xs leading-5 text-text-secondary">
                Start with an observation. You do not need to know the failed part before using the diagnostic path.
              </div>
            </div>
          }
        />

        <div className="space-y-10">
          {orderedCategories.map((cat) => {
            const info = CATEGORIES[cat] ?? { label: cat.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()), emoji: "🔧" };
            const items = grouped.get(cat)!;
            return (
              <section key={cat}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{info.emoji}</span>
                  <div>
                    <h2 className="font-display text-2xl font-semibold tracking-[-0.025em] text-text-primary">{info.label}</h2>
                  </div>
                  <span className="ml-auto text-xs text-text-muted font-heading">{items.length} symptoms</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {items.map((s) => (
                    <Link prefetch={false}
                      key={s.slug}
                      href={`/symptoms/${s.slug}`}
                      className="group flex items-center gap-3 border border-surface-border bg-surface-1 p-3 transition-colors hover:border-primary/50 hover:bg-primary/5"
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
