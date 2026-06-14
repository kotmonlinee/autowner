import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getEngineById,
  getPostsByEngine,
  getVehicleStats,
  getVehicleDiscussions,
  getCurrentUser,
} from "@/lib/data/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PostCard from "@/components/PostCard";
import Link from "next/link";
import { FollowVehicleButton } from "./FollowVehicleButton";

export const revalidate = 86400;

// ── Helpers ────────────────────────────────────────────────

function formatYearRange(start: number, end: number | null): string {
  return `${start}–${end ?? "Present"}`;
}

function formatCount(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toLocaleString();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ engineId: string }>;
}): Promise<Metadata> {
  const engine = await getEngineById((await params).engineId);
  if (!engine) return { title: "Vehicle Not Found" };

  const gen = (engine as Record<string, unknown>).vehicle_generations as Record<string, unknown>;
  const model = gen.vehicle_models as Record<string, unknown>;
  const make = model.vehicle_makes as Record<string, unknown>;

  const title = `${make.name} ${model.name} (${gen.name}) — ${engine.code}`;
  const description = `${engine.name} — ${engine.displacement} ${engine.fuel_type}, ${engine.horsepower} hp. ${formatYearRange(engine.year_start as number, engine.year_end as number | null)}.`;

  return {
    title,
    description,
    alternates: { canonical: `https://www.autowner.com/vehicle/${(await params).engineId}` },
    openGraph: { title, description, type: "article" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function VehiclePage({
  params,
}: {
  params: Promise<{ engineId: string }>;
}) {
  const { engineId } = await params;
  const [engine, user, stats, recentPosts, discussions] = await Promise.all([
    getEngineById(engineId),
    getCurrentUser(),
    getVehicleStats(engineId),
    getPostsByEngine(engineId),
    getVehicleDiscussions(engineId),
  ]);

  if (!engine) notFound();

  // Extract typed data from the generic DB result
  const engineData = engine as Record<string, unknown>;
  const gen = engineData.vehicle_generations as Record<string, unknown>;
  const model = gen.vehicle_models as Record<string, unknown>;
  const make = model.vehicle_makes as Record<string, unknown>;

  const makeName = String(make.name ?? "");
  const modelName = String(model.name ?? "");
  const genName = String(gen.name ?? "");
  const genYearStart = gen.year_start as number;
  const genYearEnd = gen.year_end as number | null;
  const engineCode = String(engineData.code ?? "");
  const engineName = String(engineData.name ?? "");
  const engineDisplacement = String(engineData.displacement ?? "");
  const engineFuelType = String(engineData.fuel_type ?? "");
  const engineHp = engineData.horsepower as number | null;

  const breadcrumb = [
    { name: "Home", href: "/" },
    { name: makeName || "Makes", href: `/vehicle` },
    { name: `${makeName} ${modelName}`, href: `/vehicle` },
    {
      name: `${genName} ${engineCode}`,
      href: `/vehicle/${engineId}`,
    },
  ];

  // ── Structured Data (Car schema) ──────────────────────────
  const carJsonLd = {
    "@context": "https://schema.org",
    "@type": "Car",
    name: `${makeName} ${modelName} (${genName})`,
    description: `${engineName} — ${engineDisplacement} ${engineFuelType}, ${engineHp} hp`,
    brand: { "@type": "Brand", name: makeName },
    model: modelName,
    vehicleModelDate: genYearStart,
    vehicleEngine: {
      "@type": "EngineSpecification",
      name: engineCode,
      engineDisplacement,
      fuelType: engineFuelType,
      enginePower: engineHp
        ? { "@type": "QuantitativeValue", value: engineHp, unitText: "hp" }
        : undefined,
    },
  };

  const heroName = `${makeName} ${modelName}`;
  const heroSubtitle = `${genName}${genYearStart ? ` (${formatYearRange(genYearStart, genYearEnd)})` : ""}`;

  return (
    <div className="min-h-screen bg-surface-0 flex flex-col">
      <Navbar />

      <main id="main-content" className="flex-1 w-full">
        {/* ── Hero Section ───────────────────────────────────── */}
        <div className="relative overflow-hidden bg-surface-1 border-b border-surface-border">
          {/* Decorative gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-amber/5 pointer-events-none" />

          <div className="max-w-5xl mx-auto px-5 py-10 md:py-14 relative">
            {/* Breadcrumb */}
            <nav
              className="mb-5 flex items-center gap-2 text-sm text-text-muted font-heading flex-wrap"
              aria-label="Breadcrumb"
            >
              {breadcrumb.map((crumb, i) => (
                <span key={crumb.name} className="flex items-center gap-2">
                  {i > 0 && (
                    <svg
                      className="w-3 h-3 text-surface-border shrink-0"
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
                  )}
                  {i < breadcrumb.length - 1 ? (
                    <Link
                      href={crumb.href}
                      className="hover:text-primary transition-colors"
                    >
                      {crumb.name}
                    </Link>
                  ) : (
                    <span className="text-text-secondary truncate">
                      {crumb.name}
                    </span>
                  )}
                </span>
              ))}
            </nav>

            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div className="flex-1">
                {/* Make badge */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-surface-3 text-text-muted font-heading uppercase tracking-wider">
                    {makeName}
                  </span>
                  {genYearStart && (
                    <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-amber/10 text-amber border border-amber/20 font-heading">
                      {formatYearRange(genYearStart, genYearEnd)}
                    </span>
                  )}
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-text-primary font-heading mb-1">
                  {heroName}
                </h1>
                <p className="text-text-muted text-sm mb-3">{heroSubtitle}</p>

                {/* Engine specs inline */}
                <div className="flex flex-wrap items-center gap-3 text-sm text-text-secondary">
                  <span className="font-semibold text-text-primary font-heading">
                    {engineCode}
                  </span>
                  {engineDisplacement && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-text-muted" />
                      <span>{engineDisplacement}</span>
                    </>
                  )}
                  {engineFuelType && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-text-muted" />
                      <span>{engineFuelType}</span>
                    </>
                  )}
                  {engineHp && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-text-muted" />
                      <span className="font-bold text-primary font-heading">
                        {engineHp} hp
                      </span>
                    </>
                  )}
                  <span className="w-1 h-1 rounded-full bg-text-muted" />
                  <span>{engineName}</span>
                </div>

                {/* Social proof */}
                <p className="mt-4 text-sm text-text-muted">
                  <span className="font-bold text-text-secondary">
                    {formatCount(stats.followerCount)}
                  </span>{" "}
                  {stats.followerCount === 1 ? "owner" : "owners"} following
                  this vehicle
                </p>
              </div>

              {/* Follow button + CTA */}
              <div className="shrink-0 flex flex-col items-start md:items-end gap-3">
                <FollowVehicleButton
                  engineId={engineId}
                  userId={user?.id ?? null}
                />
                <Link
                  href={`/submit?engine_id=${engineId}`}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-primary bg-primary/5 border border-primary/15 rounded-lg hover:bg-primary/10 transition-colors font-heading"
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Ask a Question
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ── Quick Stats Grid ────────────────────────────────── */}
        <div className="max-w-5xl mx-auto px-5 -mt-5 relative z-10">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-surface-1 rounded-xl border border-surface-border p-5 text-center hover:border-primary/20 transition-colors">
              <p className="text-2xl font-bold text-text-primary font-heading">
                {formatCount(stats.postCount)}
              </p>
              <p className="text-xs text-text-muted mt-1 font-heading uppercase tracking-wider">
                {stats.postCount === 1 ? "Post" : "Posts"}
              </p>
            </div>
            <div className="bg-surface-1 rounded-xl border border-surface-border p-5 text-center hover:border-primary/20 transition-colors">
              <p className="text-2xl font-bold text-text-primary font-heading">
                {formatCount(stats.commentCount)}
              </p>
              <p className="text-xs text-text-muted mt-1 font-heading uppercase tracking-wider">
                {stats.commentCount === 1 ? "Comment" : "Comments"}
              </p>
            </div>
            <div className="bg-surface-1 rounded-xl border border-surface-border p-5 text-center hover:border-primary/20 transition-colors">
              <p className="text-2xl font-bold text-text-primary font-heading">
                {formatCount(stats.followerCount)}
              </p>
              <p className="text-xs text-text-muted mt-1 font-heading uppercase tracking-wider">
                {stats.followerCount === 1 ? "Owner" : "Owners"}
              </p>
            </div>
          </div>
        </div>

        {/* ── Content Grid ────────────────────────────────────── */}
        <div className="max-w-5xl mx-auto px-5 py-8">
          {/* Structured Data */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(carJsonLd) }}
          />

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left column: Posts */}
            <div className="lg:col-span-2 space-y-8">
              {/* Recent Posts */}
              <section>
                <h2 className="text-lg font-bold text-text-primary font-heading mb-4 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-text-muted"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                  Recent Posts
                  {recentPosts.length > 0 && (
                    <span className="text-sm font-normal text-text-muted">
                      ({recentPosts.length})
                    </span>
                  )}
                </h2>

                {recentPosts.length === 0 ? (
                  <div className="bg-surface-1 rounded-xl border border-surface-border p-8 text-center">
                    <svg
                      className="w-12 h-12 mx-auto mb-3 text-text-muted"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                    <p className="text-text-muted text-sm font-medium">
                      No posts yet for this engine.
                    </p>
                    <p className="text-text-muted text-xs mt-1">
                      Be the first to write about the {makeName} {modelName}{" "}
                      {engineCode}!
                    </p>
                    <Link
                      href={`/submit?engine_id=${engineId}`}
                      className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-glow hover:-translate-y-px transition-all duration-150 font-heading shadow-sm shadow-primary/20"
                    >
                      <svg
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                      Create a Post
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentPosts.map((post) => (
                      <PostCard key={post.id} post={post} />
                    ))}
                  </div>
                )}
              </section>

              {/* Popular Discussions */}
              {discussions.length > 0 && (
                <section>
                  <h2 className="text-lg font-bold text-text-primary font-heading mb-4 flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-amber"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                    </svg>
                    Popular Discussions
                  </h2>

                  <div className="space-y-3">
                    {discussions.map((post) => (
                      <PostCard key={post.id} post={post} />
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Right column: Sidebar */}
            <aside className="space-y-5">
              {/* About this vehicle */}
              <div className="bg-surface-1 rounded-xl border border-surface-border p-5">
                <h3 className="text-sm font-bold text-text-primary font-heading mb-3 flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-text-muted"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                  About This Vehicle
                </h3>

                <dl className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <dt className="text-text-muted">Make</dt>
                    <dd className="font-semibold text-text-primary font-heading">
                      {makeName}
                    </dd>
                  </div>
                  <div className="flex justify-between text-sm">
                    <dt className="text-text-muted">Model</dt>
                    <dd className="font-semibold text-text-primary font-heading">
                      {modelName}
                    </dd>
                  </div>
                  <div className="flex justify-between text-sm">
                    <dt className="text-text-muted">Generation</dt>
                    <dd className="font-semibold text-text-primary font-heading">
                      {genName}
                    </dd>
                  </div>
                  {genYearStart && (
                    <div className="flex justify-between text-sm">
                      <dt className="text-text-muted">Years</dt>
                      <dd className="font-semibold text-text-primary font-heading">
                        {formatYearRange(genYearStart, genYearEnd)}
                      </dd>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <dt className="text-text-muted">Engine Code</dt>
                    <dd className="font-semibold text-text-primary font-heading">
                      {engineCode}
                    </dd>
                  </div>
                  {engineDisplacement && (
                    <div className="flex justify-between text-sm">
                      <dt className="text-text-muted">Displacement</dt>
                      <dd className="font-semibold text-text-primary font-heading">
                        {engineDisplacement}
                      </dd>
                    </div>
                  )}
                  {engineFuelType && (
                    <div className="flex justify-between text-sm">
                      <dt className="text-text-muted">Fuel Type</dt>
                      <dd className="font-semibold text-text-primary font-heading">
                        {engineFuelType}
                      </dd>
                    </div>
                  )}
                  {engineHp && (
                    <div className="flex justify-between text-sm">
                      <dt className="text-text-muted">Horsepower</dt>
                      <dd className="font-bold text-primary font-heading">
                        {engineHp} hp
                      </dd>
                    </div>
                  )}
                </dl>
              </div>

              {/* Ask a Question CTA */}
              <div className="bg-primary/5 border border-primary/15 rounded-xl p-5 text-center">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <svg
                    className="w-5 h-5 text-primary"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                </div>
                <h3 className="text-sm font-bold text-text-primary font-heading mb-1">
                  Have a question about your {modelName}?
                </h3>
                <p className="text-xs text-text-muted mb-4">
                  Get answers from {formatCount(stats.followerCount)} owners
                  and experienced mechanics.
                </p>
                <Link
                  href={`/submit?engine_id=${engineId}`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary-glow hover:-translate-y-px transition-all duration-150 font-heading shadow-sm shadow-primary/20"
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Ask a Question
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
