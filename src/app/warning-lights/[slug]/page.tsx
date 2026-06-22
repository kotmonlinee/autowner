import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageFeedback from "@/components/PageFeedback";

export const revalidate = 86400;
import WarningLightIcon from "@/components/WarningLightIcon";
import { getRelatedRepairs, TOP_REPAIRS } from "@/lib/internal-linking";
import { getRepairImageUrl } from "@/lib/repair-images";
import { createServiceSupabase } from "@/lib/supabase-server";
import {
  warningLights,
  getWarningLightBySlug,
  type WarningLight,
  type WarningLightSeverity,
} from "@/lib/warning-lights-data";

export function generateStaticParams() {
  return warningLights.map((w) => ({ slug: w.slug }));
}

function generateWarningLightTitle(light: WarningLight): string {
  const t = light.title;
  if (t.includes("Check Engine")) return "Check Engine Light On? Can You Still Drive?";
  if (t.includes("Oil Pressure")) return "Oil Pressure Warning: Stop Driving Immediately";
  if (t.includes("Battery")) return "Battery Warning Light: What It Means & Repair Cost";
  if (t.includes("Brake")) return "Brake Warning Light On? Causes & Repair Costs";
  if (t.includes("ABS")) return "ABS Light On? Causes & Repair Costs";
  if (t.includes("Airbag")) return "Airbag Light On? Causes & Repair Cost";
  if (t.includes("Tire Pressure")) return "TPMS Light: What It Means & Safe Tire Pressure";
  if (t.includes("Coolant")) return "Coolant Temperature Warning: Stop Driving?";
  return `${t}: Symptoms, Causes & Repair Cost`;
}

function generateWarningLightDescription(light: WarningLight): string {
  const desc = `Is your ${light.title} on? Learn what it means, common causes, repair costs, and whether it's safe to keep driving.`;
  return desc.length <= 160 ? desc : desc.substring(0, 160);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const light = getWarningLightBySlug(slug);
  if (!light) return { title: "Warning Light Not Found" };
  const seoTitle = generateWarningLightTitle(light);
  const seoDescription = generateWarningLightDescription(light);
  return {
    title: seoTitle, description: seoDescription,
    alternates: { canonical: `https://www.autowner.com/warning-lights/${light.slug}` },
    openGraph: { title: seoTitle, description: seoDescription },
    twitter: { card: "summary_large_image", title: seoTitle, description: seoDescription, images: ["https://www.autowner.com/og-default.jpg"] },
  };
}

const SEVERITY_CONFIG: Record<WarningLightSeverity, { label: string; bg: string; text: string; border: string; iconBg: string }> = {
  critical: { label: "Critical — Stop driving", bg: "bg-severity-critical-bg", text: "text-severity-critical", border: "border-severity-critical-border", iconBg: "bg-severity-critical-bg text-severity-critical" },
  caution: { label: "Caution — Service soon", bg: "bg-severity-caution-bg", text: "text-severity-caution", border: "border-severity-caution-border", iconBg: "bg-severity-caution-bg text-severity-caution" },
  informational: { label: "Informational — For your awareness", bg: "bg-severity-info-bg", text: "text-severity-info", border: "border-severity-info-border", iconBg: "bg-severity-info-bg text-severity-info" },
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

export default async function WarningLightDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const light = getWarningLightBySlug(slug);
  if (!light) notFound();

  const sev = SEVERITY_CONFIG[light.severity];

  // Fetch OBD code titles
  const supabase = await createServiceSupabase();
  let obdDetails: { code: string; title: string }[] = [];
  if (light.related_obd_codes.length > 0) {
    const { data: obdData } = await supabase.from("obd_codes")
      .select("code, title")
      .in("code", light.related_obd_codes.map((c) => c.toUpperCase()));
    if (obdData) {
      const map = new Map((obdData as unknown as { code: string; title: string }[]).map((r) => [r.code, r.title]));
      obdDetails = light.related_obd_codes.map((code) => ({ code, title: map.get(code.toUpperCase()) || "" })).filter((o) => o.title);
    }
  }

  const faqItems = [
    { question: `What does the ${light.title} mean?`, answer: light.meaning },
    { question: `Can I still drive with the ${light.title} on?`, answer: light.can_drive },
    { question: `How much does it cost to fix the ${light.title}?`, answer: `Repair costs typically range from ${formatCurrency(light.min_cost)} to ${formatCurrency(light.max_cost)}, depending on the underlying cause, your vehicle make and model, and local labor rates. Always get multiple quotes for an accurate price.` },
    { question: `What causes the ${light.title} to come on?`, answer: light.causes.join(". ") + "." },
  ];

  const faqJsonLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqItems.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) };
  const articleJsonLd = { "@context": "https://schema.org", "@type": "Article", headline: light.title, description: light.meaning.substring(0, 160), datePublished: new Date().toISOString(), publisher: { "@type": "Organization", name: "AutOwner" } };
  const breadcrumbJsonLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://www.autowner.com/" }, { "@type": "ListItem", position: 2, name: "Warning Lights", item: "https://www.autowner.com/warning-lights" }, { "@type": "ListItem", position: 3, name: light.title }] };

  return (
    <div className="min-h-screen bg-surface-0 flex flex-col">
      <Navbar />

      <main id="main-content" className="max-w-3xl mx-auto px-5 py-8 w-full flex-1">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-text-muted font-heading" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/warning-lights" className="hover:text-primary transition-colors">Warning Lights</Link>
          <span className="mx-2">/</span>
          <span className="text-text-secondary">{light.title}</span>
        </nav>

        {/* ── Hero ── */}
        <div className={`${sev.bg} rounded-3xl border-2 ${sev.border} p-8 mb-8 text-center`}>
          <div className={`inline-flex items-center justify-center w-24 h-24 rounded-3xl ${sev.iconBg} border-2 ${sev.border} mb-5`}>
            <WarningLightIcon slug={light.slug} size={56} severity={light.severity} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary mb-3">{light.title}</h1>
          <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border-2 ${sev.border} ${sev.text} font-heading`}>
            <span className={`w-2.5 h-2.5 rounded-full ${sev.text} bg-current animate-pulse`} />
            {sev.label}
          </span>
        </div>

        {/* ── What It Means ── */}
        <div className="bg-surface-1 rounded-2xl border border-surface-border p-5 mb-6 border-l-4" style={{ borderLeftColor: `var(--severity-${light.severity === 'informational' ? 'info' : light.severity})` }}>
          <h2 className="text-lg font-heading font-bold text-text-primary mb-3">What It Means</h2>
          <p className="text-text-primary leading-relaxed text-sm">{light.meaning}</p>
        </div>

        {/* ── Can I Still Drive? ── */}
        <div className={`${sev.bg} rounded-2xl border ${sev.border} p-5 mb-6`}>
          <h2 className="text-lg font-heading font-bold text-text-primary mb-3">Can I Still Drive?</h2>
          <p className="text-sm text-text-secondary leading-relaxed">{light.can_drive}</p>
        </div>

        {/* ── Common Causes + Cost side by side ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-surface-1 rounded-2xl border border-surface-border p-5">
            <h2 className="text-sm font-heading font-bold text-text-primary mb-3">Common Causes</h2>
            <ul className="space-y-2">
              {light.causes.map((cause, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-text-secondary">
                  <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${sev.text} bg-current`} />
                  <span>{cause}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-surface-1 rounded-2xl border border-surface-border p-5">
            <h2 className="text-sm font-heading font-bold text-text-primary mb-3">Estimated Repair Cost</h2>
            <p className="text-2xl font-heading font-bold text-text-primary mb-3">
              {formatCurrency(light.min_cost)} – {formatCurrency(light.max_cost)}
            </p>
            <p className="text-xs text-text-muted">Estimate varies by vehicle make, model, year, and shop labor rates. Always get multiple quotes.</p>
            <Link href="/repair-cost" className="inline-flex items-center gap-1 mt-3 text-xs font-heading font-semibold text-primary hover:text-primary-glow transition-colors">
              See all repair cost estimates
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </Link>
          </div>
        </div>

        {/* ── Related OBD Codes ── */}
        {obdDetails.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-heading font-bold text-text-primary mb-3">Related OBD-II Codes</h2>
            <div className="space-y-2">
              {obdDetails.map((obd) => (
                <Link key={obd.code} href={`/obd/${obd.code.toLowerCase()}`} className="group flex items-center gap-3 px-4 py-2.5 rounded-xl bg-surface-1 border border-surface-border border-l-4 border-l-primary/40 hover:border-primary/30 hover:border-l-primary hover:bg-primary/5 transition-all">
                  <span className="text-sm font-mono font-bold text-primary shrink-0">{obd.code.toUpperCase()}</span>
                  <span className="h-4 w-px bg-surface-border shrink-0" />
                  <span className="text-xs text-text-secondary truncate flex-1 min-w-0">{obd.title}</span>
                  <svg className="w-3.5 h-3.5 text-text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── Related Repairs ── */}
        <div className="mb-6">
          <h2 className="text-sm font-heading font-bold text-text-primary mb-3">Related Repairs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {TOP_REPAIRS.slice(0, 6).map((repair) => {
              const img = getRepairImageUrl(repair.slug);
              return (
                <Link key={repair.slug} href={`/repair-cost/${repair.slug}`} className="group flex items-center gap-3 p-2 rounded-xl bg-surface-1 border border-surface-border hover:border-primary/30 hover:bg-primary/5 transition-all">
                  <div className="w-12 h-10 rounded-lg overflow-hidden shrink-0 bg-surface-2">
                    {img && <img src={img} alt={repair.name} className="w-full h-full object-cover" loading="lazy" />}
                  </div>
                  <span className="text-sm font-medium text-text-primary font-heading truncate flex-1 min-w-0">{repair.name}</span>
                  <svg className="w-3.5 h-3.5 text-text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                </Link>
              );
            })}
          </div>
        </div>

        {/* ── FAQ ── */}
        <section className="mb-6 pt-6 border-t border-surface-border" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-lg font-heading font-bold text-text-primary mb-4">Frequently Asked Questions</h2>
          <div className="space-y-2">
            {faqItems.map((item, i) => (
              <details key={i} className="group bg-surface-1 rounded-xl border border-surface-border">
                <summary className="flex items-center justify-between px-5 py-3.5 cursor-pointer text-sm font-heading font-semibold text-text-primary hover:text-primary transition-colors">
                  {item.question}
                  <svg className="w-4 h-4 text-text-muted group-open:rotate-180 transition-transform shrink-0 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9" /></svg>
                </summary>
                <p className="px-5 pb-4 text-sm text-text-secondary leading-relaxed">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ── Back ── */}
        <Link href="/warning-lights" className="inline-flex items-center gap-1.5 text-sm font-heading font-semibold text-primary hover:text-primary-glow transition-colors">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
          Back to all warning lights
        </Link>
        <PageFeedback />
      </main>

      <Footer />
    </div>
  );
}
