import type { Metadata } from "next";
import { unstable_cache } from "next/cache";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DiagnosisWizard from "./DiagnosisWizard";
import DiagnosisBrowser from "@/components/DiagnosisBrowser";
import { createServiceSupabase } from "@/lib/supabase-server";
import { DEFAULT_OG_IMAGE, DEFAULT_OG_IMAGE_META } from "@/lib/constants";
import Breadcrumbs from "@/components/content/Breadcrumbs";
import PageHeader from "@/components/content/PageHeader";
import type { Diagnosis } from "@/lib/types";

export const dynamic = "force-dynamic";

const PAGE_TITLE = "Symptom Checker — Car Diagnostics";
const PAGE_DESCRIPTION =
  "Tell us your symptoms. We'll find the cause. Get possible OBD codes, repair suggestions, and cost estimates.";
const OG_DESCRIPTION =
  "Describe your car's symptoms and get possible causes, OBD codes, and estimated repair costs.";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; symptom?: string }>;
}): Promise<Metadata> {
  const sp = await searchParams;
  const base = {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    openGraph: { title: PAGE_TITLE, description: OG_DESCRIPTION, type: "website" as const, images: [DEFAULT_OG_IMAGE_META] },
    twitter: {
      card: "summary_large_image" as const,
      title: "Symptom Checker — Car Diagnostics | AutOwner",
      description: "Describe your car's symptoms and get possible causes and estimated repair costs.",
      images: [DEFAULT_OG_IMAGE],
    },
  };

  // Any parameter other than pagination (prefilled ?symptom=, free-text ?q=,
  // or future params) only drives client-side state, so those URLs are not
  // distinct landing pages and must not be indexed.
  if (Object.keys(sp).some((key) => key !== "page")) {
    return { ...base, robots: { index: false, follow: true } };
  }

  // Pagination is a browsing aid. The diagnosis detail URLs are the search
  // landing pages, so later pages must not add thousands of thin list URLs to
  // the index.
  const page = Math.max(1, parseInt(sp.page || "1", 10) || 1);
  const canonical =
    page > 1
      ? `https://www.autowner.com/symptom-checker?page=${page}`
      : "https://www.autowner.com/symptom-checker";

  return {
    ...base,
    alternates: { canonical },
    ...(page > 1 ? { robots: { index: false, follow: true } } : {}),
  };
}

const PAGE_SIZE = 6;

/**
 * The hub is force-dynamic (it powers the interactive wizard), but the
 * "popular diagnoses" list only changes slowly. Cache it per page for an hour
 * so each request no longer costs two database queries.
 */
const getPopularDiagnoses = unstable_cache(
  async (page: number): Promise<{ popular: Diagnosis[]; totalCount: number }> => {
    const supabase = await createServiceSupabase();
    const [listResult, countResult] = await Promise.all([
      supabase.from("diagnoses")
        .select("slug, symptom_path, diagnosis_json, view_count, vehicle_make, vehicle_model")
        .order("view_count", { ascending: false })
        .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1),
      supabase.from("diagnoses")
        .select("id", { count: "exact", head: true }),
    ]);

    // Throw instead of returning an empty list: unstable_cache would otherwise
    // cache the empty result for the whole TTL, which is how this page went
    // blank after the database outage.
    if (listResult.error || countResult.error) {
      throw new Error(
        listResult.error?.message ?? countResult.error?.message ?? "diagnoses query failed",
      );
    }

    return {
      popular: (listResult.data ?? []) as unknown as Diagnosis[],
      totalCount: countResult.count ?? 0,
    };
  },
  ["popular-diagnoses-v2"],
  { revalidate: 600 },
);

export default async function DiagnosisPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; symptom?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page || "1", 10) || 1);
  const prefilledSymptom = sp.symptom || null;

  let popular: Diagnosis[] = [];
  let totalCount = 0;
  try {
    const cached = await getPopularDiagnoses(page);
    popular = cached.popular;
    totalCount = cached.totalCount;
  } catch { /* diagnoses fetch failed, skip */ }

  return (
    <div className="min-h-screen bg-surface-0 flex flex-col">
      <Navbar />
      <main id="main-content" className="max-w-4xl mx-auto px-5 py-6 w-full flex-1">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Symptom Checker" }]} />
        <PageHeader
          eyebrow="Guided diagnosis"
          title="Symptom checker"
          description="Describe what the vehicle is doing, when it happens, and any conditions you have noticed. The guided path narrows likely causes and verification steps."
          aside={
            <div className="border border-surface-border bg-surface-1">
              <div className="flex items-center justify-between border-b border-surface-border px-4 py-3">
                <p className="text-[9px] font-heading font-bold uppercase tracking-[0.14em] text-primary">Diagnosis path</p>
                <span className="font-mono text-[10px] text-text-muted">4 decisions</span>
              </div>
              <ol className="grid grid-cols-4">
                {["Symptom", "Location", "Conditions", "Vehicle"].map((label, index) => (
                  <li key={label} className="border-r border-surface-border px-2 py-3 text-center last:border-r-0">
                    <span className="block font-mono text-[10px] font-bold text-primary">{String(index + 1).padStart(2, "0")}</span>
                    <span className="mt-1 block truncate text-[8px] font-heading font-bold uppercase tracking-[0.06em] text-text-muted">{label}</span>
                  </li>
                ))}
              </ol>
              <p className="border-t border-surface-border p-3 text-[10px] leading-4 text-text-muted">One answer per screen. Vehicle details are optional.</p>
            </div>
          }
        />
        <DiagnosisWizard prefilledSymptom={prefilledSymptom} />

        <DiagnosisBrowser
          initialDiagnoses={popular}
          initialTotalCount={totalCount}
          initialPage={page}
        />
      </main>
      <Footer />
    </div>
  );
}
