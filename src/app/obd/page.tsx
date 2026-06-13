import type { Metadata } from "next";
import { getObdCodesPaginated } from "@/lib/data/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import ObdCodeBrowser from "@/components/ObdCodeBrowser";

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
  },
};

export default async function ObdLandingPage() {
  const result = await getObdCodesPaginated(1, 50);
  const initialCodes = result.codes.map((c) => ({
    code: c.code,
    title: c.title,
    severity: (c as any).severity ?? 1,
  }));

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
        <nav className="mb-4 flex items-center gap-2 text-sm text-text-muted font-heading" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <svg className="w-3 h-3 text-surface-border" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <span className="text-text-secondary">OBD Codes</span>
        </nav>

        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-text-primary mb-3">OBD-II Code Decoder</h1>
          <p className="text-text-muted text-sm sm:text-base max-w-2xl mb-4">
            Look up any diagnostic trouble code (DTC) to understand what your check engine light means. Find symptoms, causes, and repair estimates.
          </p>
          <div className="flex flex-wrap items-center gap-3 text-xs text-text-muted font-heading">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary" />
              12,000+ OBD-II codes
            </span>
            <span className="text-surface-border">|</span>
            <Link href="/obd/severity-levels" className="inline-flex items-center gap-1.5 text-primary hover:text-primary-glow transition-colors font-medium">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>
              Severity levels explained
            </Link>
          </div>
        </div>

        <ObdCodeBrowser initialCodes={initialCodes} initialPrefix="" />
      </main>

      <Footer />
    </div>
  );
}
