import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WarningLightsGrid from "@/components/WarningLightsGrid";
import { warningLights } from "@/lib/warning-lights-data";
import { DEFAULT_OG_IMAGE_META } from "@/lib/constants";
import Breadcrumbs from "@/components/content/Breadcrumbs";
import PageHeader from "@/components/content/PageHeader";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Dashboard Warning Lights Guide",
  description:
    "Identify and understand every dashboard warning light. Learn what each symbol means, how urgent it is, and what it might cost to fix.",
  alternates: { canonical: "https://www.autowner.com/warning-lights" },
  openGraph: {
    title: "Dashboard Warning Lights Guide",
    description: "Identify and understand every dashboard warning light. Learn what each symbol means, how urgent it is, and what it might cost to fix.",
    images: [DEFAULT_OG_IMAGE_META],
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
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Warning Lights" }]} />
        <PageHeader
          eyebrow="Dashboard symbol guide"
          title="Dashboard warning lights"
          description={`Identify ${warningLights.length} common dashboard symbols, understand their urgency, and see what a repair may involve before you continue driving.`}
          aside={
            <div className="border-l-4 border-severity-critical bg-severity-critical-bg p-5">
              <p className="text-[10px] font-heading font-bold uppercase tracking-[0.14em] text-severity-critical">Red means stop</p>
              <p className="mt-2 text-sm leading-6 text-text-secondary">Oil pressure, brake-system, coolant-temperature, and charging warnings can indicate damage or safety risk. Pull over safely and inspect before continuing.</p>
            </div>
          }
        />

        <WarningLightsGrid />
      </main>

      <Footer />
    </div>
  );
}
