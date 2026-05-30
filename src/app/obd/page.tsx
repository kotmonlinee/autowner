import type { Metadata } from "next";
import { getTopObdCodes, getObdCodesPaginated, searchObdCodes } from "@/lib/data/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Pagination from "@/components/Pagination";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "OBD-II Code Decoder",
  description:
    "Decode diagnostic trouble codes (DTCs) from your vehicle's check engine light. Search by code, find symptoms, causes, fixes, and estimated repair costs.",
  alternates: {
    canonical: "https://www.autowner.com/obd",
  },
  openGraph: {
    title: "OBD-II Code Decoder",
    description:
      "Decode diagnostic trouble codes (DTCs) from your vehicle's check engine light. Find symptoms, causes, and repair costs.",
    type: "website",
    url: "https://www.autowner.com/obd",
    images: [
      {
        url: "https://www.autowner.com/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "OBD-II Code Decoder",
      },
    ],
  },
};

function severityBadgeClass(severity: number): string {
  if (severity >= 5) return "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800";
  if (severity >= 4) return "bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800";
  if (severity >= 3) return "bg-yellow-50 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800";
  return "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800";
}

function severityLabel(severity: number): string {
  if (severity >= 5) return "5";
  if (severity >= 4) return "4";
  if (severity >= 3) return "3";
  return "1-2";
}

export default async function ObdLandingPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q, page: pageParam } = await searchParams;
  const query = q?.trim() || "";
  const results = query ? await searchObdCodes(query) : [];

  // Direct redirect when exactly one result matches
  if (results.length === 1) {
    redirect(`/obd/${results[0].code.toLowerCase()}`);
  }

  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);
  const topCodes = query ? [] : await getTopObdCodes(20);
  const { codes: paginatedCodes, totalCount } = query
    ? { codes: [] as Awaited<ReturnType<typeof getObdCodesPaginated>>["codes"], totalCount: 0 }
    : await getObdCodesPaginated(page, 50);

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
              { "@type": "ListItem", position: 2, name: "OBD Codes", item: "https://www.autowner.com/obd" },
            ],
          }),
        }}
      />

      <main id="main-content" className="max-w-4xl mx-auto px-5 py-6 flex-1 w-full">
        {/* Breadcrumb */}
        <nav
          className="mb-4 flex items-center gap-2 text-sm text-text-muted font-heading"
          aria-label="Breadcrumb"
        >
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <svg
            className="w-3 h-3 text-surface-border"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
          <span className="text-text-secondary">OBD Codes</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-text-primary mb-3">
            OBD-II Code Decoder
          </h1>
          <p className="text-text-muted text-sm sm:text-base max-w-xl mx-auto">
            Look up any diagnostic trouble code (DTC) to understand what your
            check engine light means. Find symptoms, causes, and repair estimates.
          </p>
        </div>

        {/* Search Box */}
        <form action="/obd" method="GET" className="max-w-xl mx-auto mb-8">
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              name="q"
              type="search"
              defaultValue={query}
              placeholder="Enter OBD code (e.g. P0420, P0300, P0171)..."
              className="w-full h-14 pl-12 pr-5 bg-surface-1 border border-surface-border rounded-xl text-text-primary placeholder:text-text-muted text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          <p className="mt-2 text-xs text-text-muted text-center">
            Try codes like P0420, P0300, P0171, P0442, P0455, P0011
          </p>
        </form>

        {/* Search Results */}
        {query && (
          <section className="mb-8">
            <h2 className="text-lg font-heading font-bold text-text-primary mb-1">
              Results for &ldquo;{query}&rdquo;
            </h2>
            <p className="text-sm text-text-muted mb-4">{results.length} code{results.length !== 1 ? "s" : ""} found</p>

            {results.length === 0 ? (
              <div className="text-center py-12 bg-surface-1 rounded-xl border border-surface-border">
                <p className="text-text-muted text-sm">No codes found matching &ldquo;{query}&rdquo;.</p>
                <p className="text-text-muted text-xs mt-1">Try searching by code (e.g. P0420) or by description keyword.</p>
              </div>
            ) : (
              <div className="grid gap-2">
                {results.map((c) => (
                  <Link
                    key={c.code}
                    href={`/obd/${c.code.toLowerCase()}`}
                    className="group flex items-center gap-4 p-4 bg-surface-1 rounded-xl border border-surface-border hover:border-primary/20 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-150 max-w-full overflow-hidden"
                  >
                    <span className="text-lg font-mono font-bold text-text-primary group-hover:text-primary transition-colors shrink-0 w-20">
                      {c.code}
                    </span>
                    <span className="flex-1 min-w-0 text-sm text-text-secondary line-clamp-2">
                      {c.title}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold font-heading border shrink-0 ${severityBadgeClass(c.severity)}`}
                    >
                      S{severityLabel(c.severity)}
                    </span>
                    <svg
                      className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors shrink-0"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </Link>
                ))}
              </div>
            )}
          </section>
        )}

        {/* All Codes Browser */}
        {!query && (
          <section>
            <h2 className="text-lg font-heading font-bold text-text-primary mb-4">
              All Diagnostic Codes
            </h2>

            {paginatedCodes.length === 0 ? (
              <div className="text-center py-12 bg-surface-1 rounded-xl border border-surface-border">
                <p className="text-text-muted text-sm">No codes available. Check back soon.</p>
              </div>
            ) : (
              <>
                <div className="grid gap-2">
                  {paginatedCodes.map((c) => (
                    <Link
                      key={c.code}
                      href={`/obd/${c.code.toLowerCase()}`}
                      className="group flex items-center gap-4 p-4 bg-surface-1 rounded-xl border border-surface-border hover:border-primary/20 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-150 max-w-full overflow-hidden"
                    >
                      <span className="text-lg font-mono font-bold text-text-primary group-hover:text-primary transition-colors shrink-0 w-20">
                        {c.code}
                      </span>
                      <span className="flex-1 min-w-0 text-sm text-text-secondary line-clamp-2">
                        {c.title}
                      </span>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold font-heading border shrink-0 ${severityBadgeClass(c.severity)}`}
                      >
                        S{severityLabel(c.severity)}
                      </span>
                      <svg
                        className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </Link>
                  ))}
                </div>

                <Pagination
                  page={page}
                  totalCount={totalCount}
                  limit={50}
                  basePath="/obd"
                />
              </>
            )}
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
