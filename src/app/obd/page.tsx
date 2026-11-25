import type { Metadata } from "next";
import { getObdCodesPaginated } from "@/lib/data/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import ObdCodeBrowser from "@/components/ObdCodeBrowser";
import { DEFAULT_OG_IMAGE_META } from "@/lib/constants";
import Breadcrumbs from "@/components/content/Breadcrumbs";
import PageHeader from "@/components/content/PageHeader";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "OBD-II Code Decoder",
  description:
    "Decode diagnostic trouble codes (DTCs) from your vehicle's check engine light. Search by code, find symptoms, causes, fixes, and estimated repair costs.",
  alternates: { canonical: "https://www.autowner.com/obd" },
  openGraph: {
    title: "OBD-II Code Decoder",
    description: "Decode diagnostic trouble codes (DTCs) from your vehicle's check engine light. Find symptoms, causes, and repair costs.",
    type: "website",
    url: "https://www.autowner.com/obd",
    images: [DEFAULT_OG_IMAGE_META],
  },
};

export default async function ObdLandingPage() {
  let initialCodes: { code: string; title: string; severity: number }[] = [];
  try {
    const result = await getObdCodesPaginated(1, 50);
    initialCodes = result.codes.map((c) => ({
      code: c.code,
      title: c.title,
      severity: (c as any).severity ?? 1,
    }));
  } catch {
    // Never fail the build when the database is unavailable; ISR repopulates
    // this list on the next successful render.
  }

  return (
    <div className="min-h-screen bg-surface-0 flex flex-col">
      <Navbar />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://www.autowner.com" },
          { "@type": "ListItem", position: 2, name: "OBD Codes", item: "https://www.autowner.com/obd" },
        ],
      })}} />

      <main id="main-content" className="max-w-4xl mx-auto px-5 py-6 flex-1 w-full">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "OBD Codes" }]} />

        <PageHeader
          eyebrow="Diagnostic trouble code index"
          title="OBD-II code decoder"
          description="Start with the code from the scanner. Understand what it means, how urgently to act, what to verify, and what the repair may cost."
          aside={
            <div className="border border-surface-border bg-text-primary p-5 text-surface-1 shadow-[8px_8px_0_0_#d8d0c2]">
              <p className="text-[10px] font-heading font-bold uppercase tracking-[0.15em] text-primary">Coverage</p>
              <p className="mt-3 font-display text-5xl font-semibold tracking-[-0.04em] text-white">12,100<span className="text-primary">+</span></p>
              <p className="mt-1 text-xs text-white/55">engine, body, chassis, and network codes</p>
              <Link prefetch={false} href="/obd/severity-levels" className="mt-5 flex items-center justify-between border-t border-white/10 pt-3 text-xs font-heading font-bold text-white hover:text-primary">
                Understand severity levels <span aria-hidden="true">→</span>
              </Link>
            </div>
          }
        />

        <ObdCodeBrowser initialCodes={initialCodes} initialPrefix="" />
      </main>

      <Footer />
    </div>
  );
}
