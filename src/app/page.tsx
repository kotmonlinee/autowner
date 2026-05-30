import type { Metadata } from "next";
import { getTrendingPosts, getRecentActivityCount } from "@/lib/data/server";
import { TOP_OBD_CODES, TOP_REPAIRS } from "@/lib/internal-linking";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CommonRepairCosts from "@/components/CommonRepairCosts";
import SmartSearchBar from "@/components/SmartSearchBar";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Repair Cost Checker & OBD Code Lookup",
  description:
    "Check repair costs, decode OBD trouble codes, identify warning lights, and verify mechanic quotes. Free tools for car owners.",
  alternates: {
    canonical: "https://www.autowner.com",
  },
  openGraph: {
    siteName: "AutOwner",
    type: "website",
    title: "Repair Cost Checker & OBD Code Lookup",
    description:
      "Check repair costs, decode OBD trouble codes, identify warning lights, and verify mechanic quotes. Free tools for car owners.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Repair Cost Checker & OBD Code Lookup",
    description:
      "Check repair costs, verify mechanic quotes, decode warning lights and OBD codes.",
  },
};

const tools = [
  {
    title: "Repair Cost Estimator",
    description: "See what repairs should cost",
    href: "/repair-cost",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-7 h-7"
      >
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    title: "Quote Checker",
    description: "Is your mechanic&apos;s quote fair?",
    href: "/quote-checker",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-7 h-7"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    title: "OBD Codes",
    description: "Decode check engine light codes",
    href: "/obd",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-7 h-7"
      >
        <rect x="2" y="6" width="20" height="12" rx="2" />
        <circle cx="12" cy="12" r="2" />
        <path d="M6 12h.01" />
      </svg>
    ),
  },
  {
    title: "Warning Lights",
    description: "Understand dashboard warning lights",
    href: "/warning-lights",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-7 h-7"
      >
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
];

export default async function HomePage() {
  const trendingPosts = await getTrendingPosts(5);
  const activity = await getRecentActivityCount();

  return (
    <div className="min-h-screen bg-surface-0 flex flex-col">
      <Navbar />

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                name: "AutOwner",
                url: "https://www.autowner.com",
                description:
                  "Check repair costs, decode OBD trouble codes, identify warning lights, and verify mechanic quotes. Free tools for car owners.",
                logo: {
                  "@type": "ImageObject",
                  url: "https://www.autowner.com/og-image.png",
                  width: 1200,
                  height: 630,
                },
                foundingDate: "2024",
                knowsAbout: [
                  "Car Repair",
                  "OBD-II Diagnostic Trouble Codes",
                  "Dashboard Warning Lights",
                  "Auto Maintenance",
                  "Mechanic Quote Verification",
                ],
              },
              {
                "@type": "WebSite",
                name: "AutOwner",
                url: "https://www.autowner.com",
                description:
                  "Check repair costs, decode OBD trouble codes, identify warning lights, and verify mechanic quotes. Free tools for car owners.",
                potentialAction: {
                  "@type": "SearchAction",
                  target: {
                    "@type": "EntryPoint",
                    urlTemplate:
                      "https://www.autowner.com/search?q={search_term_string}",
                  },
                  "query-input": "required name=search_term_string",
                },
              },
            ],
          }),
        }}
      />

      {/* ── Hero Section ─────────────────────────────────── */}
      <section className="relative w-full bg-surface-0" aria-labelledby="hero-heading">
        <div className="max-w-5xl mx-auto px-5 pt-20 pb-16 sm:pt-28 sm:pb-24 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-semibold font-heading tracking-wide mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Car ownership made easier
          </div>

          <h1
            id="hero-heading"
            className="text-4xl sm:text-5xl lg:text-6xl font-display text-text-primary tracking-wide leading-tight"
          >
            AUTO
            <span className="text-primary">WNER</span>
          </h1>

          <p className="mt-5 text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed font-heading">
            Check repair costs, verify mechanic quotes, decode warning lights and
            OBD codes.
          </p>

          {/* Search */}
          <SmartSearchBar />
        </div>

        {/* Bottom gradient separator */}
        <div className="h-px bg-gradient-to-r from-transparent via-surface-border to-transparent" />
      </section>

      {/* ── Site Activity Banner ────────────────────────── */}
      <section className="w-full bg-surface-0" aria-label="Site activity">
        <div className="max-w-5xl mx-auto px-5 pb-2">
          <div className="flex items-center justify-center gap-2.5 py-2.5 px-5 bg-primary/[0.04] dark:bg-primary/5 border border-primary/10 dark:border-primary/15 rounded-xl text-sm text-text-secondary font-heading">
            <svg
              className="w-4 h-4 text-primary shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
            <span>
              This week:{" "}
              <strong className="text-text-primary">{activity.newArticles} new article{activity.newArticles !== 1 ? "s" : ""}</strong>
              {", "}
              <strong className="text-text-primary">{activity.newDiscussions} new discussion{activity.newDiscussions !== 1 ? "s" : ""}</strong>
            </span>
          </div>
        </div>
      </section>

      {/* ── Tool Cards Section ───────────────────────────── */}
      <section className="w-full bg-surface-0" aria-labelledby="tools-heading">
        <div className="max-w-5xl mx-auto px-5 py-16 sm:py-20 lg:py-24">
          <div className="text-center mb-12">
            <h2
              id="tools-heading"
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text-primary font-heading"
            >
              Everything you need
            </h2>
            <p className="mt-3 text-text-muted max-w-xl mx-auto text-base sm:text-lg">
              Four powerful tools to help you make informed decisions about your
              car.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:gap-6">
            {tools.map((tool) => {
              const isQuoteChecker = tool.href === "/quote-checker";
              return (
              <Link
                key={tool.href}
                href={tool.href}
                className={`group flex flex-col p-6 sm:p-7 bg-surface-1 rounded-2xl border transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${
                  isQuoteChecker
                    ? "border-l-4 border-l-primary border-primary/20 bg-primary/[0.03] hover:border-primary/40"
                    : "border-surface-border hover:border-primary/30"
                }`}
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-white transition-colors duration-200">
                  {tool.icon}
                </div>

                {/* Title row with badge */}
                <div className="flex items-center gap-2.5 mb-2">
                  <h3 className="text-lg sm:text-xl font-bold text-text-primary font-heading group-hover:text-primary transition-colors duration-150">
                    {tool.title}
                  </h3>
                  {isQuoteChecker && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide bg-primary/15 text-primary border border-primary/25 font-heading">
                      Try it free
                    </span>
                  )}
                </div>

                <p className="text-text-muted text-sm sm:text-base leading-relaxed">
                  {tool.description}
                </p>

                {/* Arrow */}
                <span className="inline-flex items-center gap-1.5 mt-5 text-sm font-medium text-primary font-heading opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200">
                  Get started
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </span>
              </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Popular Searches ─────────────────────────────── */}
      <section className="w-full bg-surface-0" aria-labelledby="popular-heading">
        <div className="max-w-5xl mx-auto px-5 py-12 sm:py-16">
          <div className="text-center mb-8">
            <h2
              id="popular-heading"
              className="text-xl sm:text-2xl font-bold text-text-primary font-heading"
            >
              Popular Searches
            </h2>
            <p className="mt-2 text-text-muted text-sm">
              Jump to the most commonly searched repairs and diagnostic codes
            </p>
          </div>

          <div className="mb-8">
            <h3 className="text-xs font-heading font-bold text-text-muted uppercase tracking-wider mb-3">
              Top OBD-II Codes
            </h3>
            <div className="flex flex-wrap gap-2">
              {TOP_OBD_CODES.map((obd) => (
                <Link
                  key={obd.code}
                  href={`/obd/${obd.code.toLowerCase()}`}
                  className="inline-flex items-center px-3 py-1.5 rounded-lg bg-surface-1 border border-surface-border text-xs font-mono font-medium text-primary hover:border-primary/30 hover:bg-primary/5 hover:-translate-y-px transition-all duration-150"
                  title={obd.title}
                >
                  {obd.code}
                </Link>
              ))}
            </div>
            <Link
              href="/obd"
              className="inline-flex items-center gap-1.5 mt-3 text-xs font-semibold text-primary hover:text-primary-glow transition-colors font-heading"
            >
              View all 12,000+ codes
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>

          <div>
            <h3 className="text-xs font-heading font-bold text-text-muted uppercase tracking-wider mb-3">
              Top Repair Costs
            </h3>
            <div className="flex flex-wrap gap-2">
              {TOP_REPAIRS.map((repair) => (
                <Link
                  key={repair.slug}
                  href={`/repair-cost/${repair.slug}`}
                  className="inline-flex items-center px-3 py-1.5 rounded-lg bg-surface-1 border border-surface-border text-xs font-medium text-primary hover:border-primary/30 hover:bg-primary/5 hover:-translate-y-px transition-all duration-150 font-heading"
                >
                  {repair.name}
                </Link>
              ))}
            </div>
            <Link
              href="/repair-cost"
              className="inline-flex items-center gap-1.5 mt-3 text-xs font-semibold text-primary hover:text-primary-glow transition-colors font-heading"
            >
              Compare all repair costs
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Common Repair Costs Section ───────────────────── */}
      <CommonRepairCosts />

      {/* ── Community Section ────────────────────────────── */}
      <section
        className="w-full bg-surface-1 border-y border-surface-border"
        aria-labelledby="community-heading"
      >
        <div className="max-w-5xl mx-auto px-5 py-16 sm:py-20 lg:py-24">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2
                id="community-heading"
                className="text-2xl sm:text-3xl font-bold text-text-primary font-heading"
              >
                Popular Discussions
              </h2>
              <p className="mt-2 text-text-muted text-sm sm:text-base">
                Join the conversation with fellow car enthusiasts.
              </p>
            </div>
            <Link
              href="/community"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-primary font-heading hover:text-primary-glow transition-colors shrink-0"
            >
              View all discussions
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>

          {trendingPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-text-muted">
                No trending discussions right now. Check back soon.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {trendingPosts.map((post, i) => (
                <Link
                  key={post.id}
                  href={`/post/${post.slug || post.id}`}
                  className="group flex items-center gap-4 sm:gap-5 p-4 sm:p-5 bg-surface-0 rounded-xl border border-surface-border hover:border-primary/20 hover:shadow-sm transition-all duration-150"
                >
                  {/* Rank number */}
                  <span className="w-8 h-8 rounded-lg bg-surface-1 border border-surface-border flex items-center justify-center text-xs font-bold text-text-muted font-heading shrink-0 group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/20 transition-colors">
                    {(i + 1).toString().padStart(2, "0")}
                  </span>

                  {/* Title */}
                  <span className="flex-1 min-w-0 text-sm sm:text-base font-medium text-text-secondary group-hover:text-text-primary truncate transition-colors font-heading">
                    {post.title}
                  </span>

                  {/* Comment count */}
                  <span className="hidden sm:flex items-center gap-1.5 text-xs text-text-muted shrink-0">
                    <svg
                      className="w-3.5 h-3.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    {post.comment_count}
                  </span>
                </Link>
              ))}
            </div>
          )}

          {/* Mobile "View all" link */}
          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/community"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary font-heading hover:text-primary-glow transition-colors"
            >
              View all discussions
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
