import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import WarningLightsGrid from "@/components/WarningLightsGrid";
import { warningLights } from "@/lib/warning-lights-data";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Dashboard Warning Lights Guide",
  description:
    "Identify and understand every dashboard warning light. Learn what each symbol means, how urgent it is, and what it might cost to fix.",
  alternates: { canonical: "https://www.autowner.com/warning-lights" },
  openGraph: {
    title: "Dashboard Warning Lights Guide",
    description: "Identify and understand every dashboard warning light. Learn what each symbol means, how urgent it is, and what it might cost to fix.",
  },
};

export default function WarningLightsPage() {
  return (
    <div className="min-h-screen bg-surface-0 flex flex-col">
      <Navbar />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://www.autowner.com" },
              { "@type": "ListItem", position: 2, name: "Dashboard Warning Lights", item: "https://www.autowner.com/warning-lights" },
            ],
          }),
        }}
      />

      <main id="main-content" className="max-w-5xl mx-auto px-5 py-6 w-full flex-1">
        <nav className="mb-4 flex items-center gap-2 text-sm text-text-muted font-heading" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <svg className="w-3 h-3 text-surface-border" fill="none" stroke="currentColor" viewBox="0 0 24 24" width={12} height={12}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <span className="text-text-secondary">Warning Lights</span>
        </nav>

        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-text-primary font-heading mb-3">
            Dashboard Warning Lights
          </h1>
          <p className="text-text-muted text-sm sm:text-base leading-relaxed max-w-2xl">
            Don&apos;t ignore that light on your dashboard. Browse {warningLights.length} common warning lights, learn what they mean, and find out how urgent the issue is and what repairs might cost.
          </p>
        </div>

        <WarningLightsGrid />
      </main>

      <Footer />
    </div>
  );
}
