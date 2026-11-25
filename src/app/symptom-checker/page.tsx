import type { Metadata } from "next";
import { unstable_cache } from "next/cache";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DiagnosisWizard from "./DiagnosisWizard";
import DiagnosisBrowser from "@/components/DiagnosisBrowser";
import { createServiceSupabase } from "@/lib/supabase-server";
import { DEFAULT_OG_IMAGE, DEFAULT_OG_IMAGE_META } from "@/lib/constants";
import Breadcrumbs from "@/components/content/Breadcrumbs";
import PageHeader from "@/components/content/PageHeader";

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
  async (page: number): Promise<{ popular: any[]; totalCount: number }> => {
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
      popular: (listResult.data ?? []) as unknown as any[],
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

  let popular: any[] = [];
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
            <div className="grid grid-cols-2 border border-surface-border bg-surface-1">
              <div className="border-b border-r border-surface-border p-4">
                <p className="font-display text-3xl font-semibold text-text-primary">{totalCount.toLocaleString()}</p>
                <p className="mt-1 text-[9px] font-heading font-bold uppercase tracking-[0.12em] text-text-muted">saved diagnoses</p>
              </div>
              <div className="border-b border-surface-border p-4">
                <p className="font-display text-3xl font-semibold text-text-primary">1</p>
                <p className="mt-1 text-[9px] font-heading font-bold uppercase tracking-[0.12em] text-text-muted">guided path</p>
              </div>
              <div className="col-span-2 p-4 text-xs leading-5 text-text-secondary">Start with the observation. Scanner codes can be added when available.</div>
            </div>
          }
        />
        <DiagnosisWizard prefilledSymptom={prefilledSymptom} />

        {/* Diagnoses by Vehicle */}
        <section className="mb-10 mt-8 border-y border-surface-border bg-surface-1 px-5 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <h2 className="text-sm font-heading font-bold text-text-primary uppercase tracking-wider mb-1">Diagnoses by Vehicle</h2>
              <p className="text-xs text-text-muted">Browse problem diagnoses for your specific make and model.</p>
            </div>
            <Link prefetch={false} href="/vehicles" className="flex shrink-0 items-center justify-between gap-4 bg-primary px-5 py-2.5 text-sm font-semibold font-heading text-white transition-colors hover:bg-primary-dark sm:inline-flex">
              Browse All Vehicles
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

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
