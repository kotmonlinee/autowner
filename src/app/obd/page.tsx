import type { Metadata } from "next";
import { getTopObdCodes, getObdCodesPaginated, searchObdCodes } from "@/lib/data/server";
import { createServiceSupabase } from "@/lib/supabase-server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Pagination from "@/components/Pagination";
import Link from "next/link";
import { redirect } from "next/navigation";

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

function severityBadgeClass(severity: number): string {
  if (severity >= 5) return "bg-severity-critical-bg text-severity-critical border-severity-critical-border";
  if (severity >= 4) return "bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800";
  if (severity >= 3) return "bg-yellow-50 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800";
  return "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800";
}

function severityBar(severity: number): string {
  if (severity >= 5) return "bg-red-500";
  if (severity >= 4) return "bg-orange-500";
  if (severity >= 3) return "bg-yellow-500";
  return "bg-green-500";
}

function severityLabel(severity: number): string {
  if (severity >= 5) return "5";
  if (severity >= 4) return "4";
  if (severity >= 3) return "3";
  return "1-2";
}

const PREFIXES = [
  { key: "", label: "All" },
  { key: "P", label: "P — Powertrain" },
  { key: "C", label: "C — Chassis" },
  { key: "B", label: "B — Body" },
  { key: "U", label: "U — Network" },
];

export default async function ObdLandingPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; prefix?: string }>;
}) {
  const sp = await searchParams;
  const query = sp.q?.trim() || "";
  const prefix = sp.prefix?.toUpperCase() || "";
  const results = query ? await searchObdCodes(query) : [];

  if (results.length === 1) {
    redirect(`/obd/${results[0].code.toLowerCase()}`);
  }

  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);
  const supabase = await createServiceSupabase();

  // Top codes: pick 6 from each prefix for variety
  let topCodes: Awaited<ReturnType<typeof getTopObdCodes>> = [];
  if (!query && !prefix) {
    const allTop = await getTopObdCodes(200);
    const grouped: Record<string, typeof allTop> = { P: [], C: [], B: [], U: [] };
    for (const c of allTop) {
      const pfx = c.code[0].toUpperCase();
      if (grouped[pfx] && grouped[pfx].length < 6) grouped[pfx].push(c);
      if (Object.values(grouped).every((g) => g.length >= 6)) break;
    }
    topCodes = Object.values(grouped).flat();
  }

  // Fetch codes: direct query for prefix, paginated for all
  let filteredCodes: Awaited<ReturnType<typeof getObdCodesPaginated>>["codes"] = [];
  let totalCount = 0;
  const PAGE_SIZE = 50;

  if (!query) {
    if (prefix) {
      const offset = (page - 1) * PAGE_SIZE;
      const [{ data }, { count }] = await Promise.all([
        supabase.from("obd_codes")
          .select("code, title, severity")
          .ilike("code", `${prefix}%`)
          .order("code", { ascending: true })
          .range(offset, offset + PAGE_SIZE - 1),
        supabase.from("obd_codes")
          .select("id", { count: "exact", head: true })
          .ilike("code", `${prefix}%`),
      ]);
      filteredCodes = (data ?? []) as unknown as typeof filteredCodes;
      totalCount = count ?? 0;
    } else {
      const result = await getObdCodesPaginated(page, PAGE_SIZE);
      filteredCodes = result.codes;
      totalCount = result.totalCount;
    }
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
        <nav className="mb-4 flex items-center gap-2 text-sm text-text-muted font-heading" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="text-surface-border">/</span>
          <span className="text-text-secondary">OBD Codes</span>
        </nav>

        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-text-primary mb-3">OBD-II Code Decoder</h1>
          <p className="text-text-muted text-sm sm:text-base max-w-xl mx-auto">
            Look up any diagnostic trouble code (DTC) to understand what your check engine light means. Find symptoms, causes, and repair estimates.
          </p>
        </div>

        {/* Search */}
        <form action="/obd" method="GET" className="max-w-xl mx-auto mb-6">
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input name="q" type="search" defaultValue={query} placeholder="Enter OBD code (e.g. P0420, P0300, P0171)..." className="w-full h-14 pl-12 pr-5 bg-surface-1 border border-surface-border rounded-xl text-text-primary placeholder:text-text-muted text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
          </div>
        </form>

        {/* Search Results */}
        {query && (
          <section className="mb-8">
            <h2 className="text-lg font-heading font-bold text-text-primary mb-1">Results for &ldquo;{query}&rdquo;</h2>
            <p className="text-sm text-text-muted mb-4">{results.length} code{results.length !== 1 ? "s" : ""} found</p>
            {results.length === 0 ? (
              <div className="text-center py-12 bg-surface-1 rounded-xl border border-surface-border">
                <p className="text-text-muted text-sm">No codes found matching &ldquo;{query}&rdquo;.</p>
                <p className="text-text-muted text-xs mt-1">Try searching by code (e.g. P0420) or by description keyword.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {results.map((c) => (
                  <Link key={c.code} href={`/obd/${c.code.toLowerCase()}`}
                    className="group flex items-center gap-3 p-3 bg-surface-1 rounded-xl border border-surface-border hover:border-primary/20 hover:shadow-sm transition-all overflow-hidden">
                    <span className={`w-1 self-stretch rounded-full shrink-0 ${severityBar(c.severity)}`} />
                    <span className="text-base font-mono font-bold text-text-primary group-hover:text-primary transition-colors shrink-0 w-20">{c.code}</span>
                    <span className="flex-1 min-w-0 text-sm text-text-secondary truncate">{c.title}</span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold font-heading border shrink-0 ${severityBadgeClass(c.severity)}`}>S{severityLabel(c.severity)}</span>
                  </Link>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Most Common Codes */}
        {!query && !prefix && topCodes.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-heading font-bold text-text-primary mb-4">Most Common Codes</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {topCodes.map((c) => (
                <Link key={c.code} href={`/obd/${c.code.toLowerCase()}`}
                  className="group flex items-center gap-2 p-3 bg-surface-1 rounded-xl border border-surface-border hover:border-primary/20 hover:shadow-sm hover:-translate-y-0.5 transition-all overflow-hidden">
                  <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${severityBar(c.severity)}`} />
                  <div className="min-w-0">
                    <span className="text-sm font-mono font-bold text-text-primary group-hover:text-primary transition-colors">{c.code}</span>
                    <p className="text-[11px] text-text-muted truncate">{c.title}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* All Codes Browser */}
        {!query && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-heading font-bold text-text-primary">All Diagnostic Codes</h2>
              {prefix && <Link href="/obd" className="text-xs text-primary hover:text-primary-glow font-heading font-medium">Clear filter</Link>}
            </div>

            {/* Prefix filter tabs */}
            <div className="flex flex-wrap gap-2 mb-4">
              {PREFIXES.map((p) => (
                <Link key={p.key || "all"} href={p.key ? `/obd?prefix=${p.key}` : "/obd"}
                  className={`px-3 py-1.5 rounded-lg text-xs font-heading font-semibold transition-colors ${
                    prefix === p.key || (!prefix && !p.key)
                      ? "bg-primary text-white"
                      : "bg-surface-1 text-text-secondary border border-surface-border hover:border-primary/30 hover:text-text-primary"
                  }`}
                >
                  {p.label}
                </Link>
              ))}
            </div>

            {filteredCodes.length === 0 ? (
              <div className="text-center py-12 bg-surface-1 rounded-xl border border-surface-border">
                <p className="text-text-muted text-sm">No codes found for this prefix.</p>
              </div>
            ) : (
              <>
                <div className="space-y-1.5">
                  {filteredCodes.map((c) => (
                    <Link key={c.code} href={`/obd/${c.code.toLowerCase()}`}
                      className="group flex items-center gap-3 px-4 py-3 bg-surface-1 rounded-xl border border-surface-border hover:border-primary/20 hover:shadow-sm transition-all overflow-hidden">
                      <span className={`w-1 h-8 rounded-full shrink-0 ${severityBar(c.severity)}`} />
                      <span className="text-sm font-mono font-bold text-text-primary group-hover:text-primary transition-colors shrink-0 w-20">{c.code}</span>
                      <span className="flex-1 min-w-0 text-sm text-text-secondary truncate">{c.title}</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold font-heading border shrink-0 ${severityBadgeClass(c.severity)}`}>S{severityLabel(c.severity)}</span>
                    </Link>
                  ))}
                </div>

                {!prefix && (
                  <Pagination page={page} totalCount={totalCount} limit={50} basePath={prefix ? `/obd?prefix=${prefix}` : "/obd"} />
                )}
              </>
            )}
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
