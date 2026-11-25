import type { Metadata } from "next";
import { DEFAULT_OG_IMAGE, DEFAULT_OG_IMAGE_META } from "@/lib/constants";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageFeedback from "@/components/PageFeedback";

export const revalidate = 7776000;
export const dynamic = "force-static";
import WarningLightIcon from "@/components/WarningLightIcon";
import { TOP_REPAIRS } from "@/lib/internal-linking";
import { createServiceSupabase } from "@/lib/supabase-server";
import { type WarningLightSeverity } from "@/lib/warning-lights-data";
import { getWarningLightBySlug, getAllWarningLights, type WarningLightRow } from "@/lib/data/server";
import Breadcrumbs from "@/components/content/Breadcrumbs";
import PageHeader from "@/components/content/PageHeader";
import QuickVerdict from "@/components/content/QuickVerdict";
import CostSummary from "@/components/content/CostSummary";
import ContentSection from "@/components/content/ContentSection";
import ContinueSolving from "@/components/content/ContinueSolving";
import FaqList from "@/components/content/FaqList";

export async function generateStaticParams() {
  const lights = await getAllWarningLights();
  return lights.map((w) => ({ slug: w.slug }));
}

function generateWarningLightTitle(light: WarningLightRow): string {
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

function generateWarningLightDescription(light: WarningLightRow): string {
  const desc = `Is your ${light.title} on? Learn what it means, common causes, repair costs, and whether it's safe to keep driving.`;
  return desc.length <= 160 ? desc : desc.substring(0, 160);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const light = await getWarningLightBySlug(slug);
  if (!light) return { title: "Warning Light Not Found", robots: { index: false, follow: false } };
  const seoTitle = generateWarningLightTitle(light);
  const seoDescription = generateWarningLightDescription(light);
  return {
    title: seoTitle, description: seoDescription,
    alternates: { canonical: `https://www.autowner.com/warning-lights/${light.slug}` },
    openGraph: { title: seoTitle, description: seoDescription, images: [DEFAULT_OG_IMAGE_META] },
    twitter: { card: "summary_large_image", title: seoTitle, description: seoDescription, images: [DEFAULT_OG_IMAGE] },
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
  const light = await getWarningLightBySlug(slug);
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
  const articleJsonLd = { "@context": "https://schema.org", "@type": "Article", headline: light.title, description: light.meaning.substring(0, 160), datePublished: light.created_at, dateModified: light.updated_at || light.created_at, publisher: { "@type": "Organization", name: "AutOwner" } };
  const breadcrumbJsonLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://www.autowner.com/" }, { "@type": "ListItem", position: 2, name: "Warning Lights", item: "https://www.autowner.com/warning-lights" }, { "@type": "ListItem", position: 3, name: light.title }] };

  return (
    <div className="min-h-screen bg-surface-0 flex flex-col">
      <Navbar />

      <main id="main-content" className="max-w-3xl mx-auto px-5 py-8 w-full flex-1">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Warning Lights", href: "/warning-lights" }, { label: light.title }]} />
        <PageHeader
          eyebrow="Dashboard warning guide"
          title={light.title}
          description={light.meaning}
          aside={
            <div className={`border-2 ${sev.border} ${sev.bg} p-6 text-center`}>
              <div className={`mx-auto flex h-24 w-24 items-center justify-center border ${sev.border} ${sev.iconBg}`}>
                <WarningLightIcon slug={light.slug} size={56} severity={light.severity} />
              </div>
              <p className={`mt-4 text-xs font-heading font-bold uppercase tracking-[0.12em] ${sev.text}`}>{sev.label}</p>
            </div>
          }
        />

        <QuickVerdict
          label="Driving guidance"
          title={light.can_drive}
          tone={light.severity === "critical" ? "critical" : light.severity === "caution" ? "caution" : "safe"}
          facts={[
            { label: "Urgency", value: sev.label.split(" — ")[0] },
            { label: "Repair range", value: `${formatCurrency(light.min_cost)}–${formatCurrency(light.max_cost)}` },
            { label: "Likely area", value: light.causes[0] ?? "Inspect the system" },
            { label: "Next action", value: light.severity === "critical" ? "Stop and inspect" : "Verify the cause" },
          ]}
        >
          Treat the light as evidence, not a diagnosis. Confirm the affected system and the exact fault before replacing parts.
        </QuickVerdict>

        <div className="mb-7 grid gap-5 md:grid-cols-[1.15fr_.85fr]">
          <ContentSection eyebrow="Possible source" title="Common causes">
            <ul className="divide-y divide-surface-border border-y border-surface-border">
              {light.causes.map((cause, i) => (
                <li key={i} className="flex items-start gap-3 py-3 text-sm text-text-secondary">
                  <span className={`mt-2 h-1.5 w-1.5 shrink-0 ${sev.text} bg-current`} />
                  <span>{cause}</span>
                </li>
              ))}
            </ul>
          </ContentSection>
          <CostSummary
            label="Estimated repair cost"
            range={`${formatCurrency(light.min_cost)} – ${formatCurrency(light.max_cost)}`}
            confidence="Varies by vehicle, fault, location, and parts strategy"
          >
            <Link prefetch={false} href="/repair-cost" className="inline-flex items-center justify-between gap-5 text-xs font-heading font-bold text-primary">
              Compare repair estimates <span aria-hidden="true">→</span>
            </Link>
          </CostSummary>
        </div>

        <ContinueSolving
          title="Continue from the warning to the evidence"
          intro="Use the scanner code or the most plausible repair to confirm the system before replacing parts."
          links={[
            ...obdDetails.slice(0, 3).map((obd) => ({
              href: `/obd/${obd.code.toLowerCase()}`,
              label: `${obd.code.toUpperCase()}: ${obd.title}`,
              description: "Review the code meaning, driving risk, causes, and verification checks.",
              meta: "related OBD code",
            })),
            ...TOP_REPAIRS.slice(0, 3).map((repair) => ({
              href: `/repair-cost/${repair.slug}`,
              label: repair.name,
              description: "Compare typical parts, labor, and the repair decision.",
              meta: "repair cost",
            })),
          ]}
        />

        {/* ── FAQ ── */}
        <ContentSection eyebrow="Before you clear the warning" title="Warning-light questions">
          <FaqList items={faqItems} />
        </ContentSection>

        {/* ── Back ── */}
        <Link prefetch={false} href="/warning-lights" className="inline-flex items-center gap-1.5 text-sm font-heading font-semibold text-primary hover:text-primary-glow transition-colors">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={16} height={16}><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
          Back to all warning lights
        </Link>
        <PageFeedback />
      </main>

      <Footer />
    </div>
  );
}
