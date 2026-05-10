import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEngineById, getPostsByEngine, getCurrentUser } from "@/lib/data/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PostCard from "@/components/PostCard";
import Link from "next/link";
import { FollowVehicleButton } from "./FollowVehicleButton";

// ── Helpers ────────────────────────────────────────────────

function formatYearRange(start: number, end: number | null): string {
  return `${start}–${end ?? "Present"}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ engineId: string }>;
}): Promise<Metadata> {
  const engine = await getEngineById((await params).engineId);
  if (!engine) return { title: "Vehicle Not Found — AutOwner" };

  const gen = (engine as Record<string, unknown>).vehicle_generations as Record<string, unknown>;
  const model = gen.vehicle_models as Record<string, unknown>;
  const make = model.vehicle_makes as Record<string, unknown>;

  const title = `${make.name} ${model.name} (${gen.name}) — ${engine.code}`;
  const description = `${engine.name} — ${engine.displacement} ${engine.fuel_type}, ${engine.horsepower} hp. ${formatYearRange(engine.year_start as number, engine.year_end as number | null)}.`;

  return {
    title: `${title} — AutOwner`,
    description,
  };
}

export default async function VehiclePage({
  params,
}: {
  params: Promise<{ engineId: string }>;
}) {
  const { engineId } = await params;
  const [engine, user] = await Promise.all([
    getEngineById(engineId),
    getCurrentUser(),
  ]);

  if (!engine) notFound();

  // Extract typed data from the generic DB result
  const engineData = engine as Record<string, unknown>;
  const gen = engineData.vehicle_generations as Record<string, unknown>;
  const model = gen.vehicle_models as Record<string, unknown>;
  const make = model.vehicle_makes as Record<string, unknown>;

  const makeName = String(make.name ?? "");
  const modelName = String(model.name ?? "");
  const modelSlug = String(model.slug ?? "");
  const makeSlug = String(make.slug ?? "");
  const genName = String(gen.name ?? "");
  const genYearStart = gen.year_start as number;
  const genYearEnd = gen.year_end as number | null;
  const engineCode = String(engineData.code ?? "");
  const engineName = String(engineData.name ?? "");
  const engineDisplacement = String(engineData.displacement ?? "");
  const engineFuelType = String(engineData.fuel_type ?? "");
  const engineHp = engineData.horsepower as number | null;

  const posts = await getPostsByEngine(engineId);

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

  return (
    <div className="min-h-screen bg-surface-0 flex flex-col">
      <Navbar />

      <main id="main-content" className="flex-1 max-w-4xl mx-auto px-5 py-8 w-full">
        {/* Breadcrumb */}
        <nav
          className="mb-6 flex items-center gap-2 text-sm text-text-muted font-heading flex-wrap"
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

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(carJsonLd) }}
        />

        {/* Engine Info Card */}
        <div className="bg-surface-1 rounded-xl border border-surface-border p-6 mb-8">
          <div className="flex items-start gap-5">
            {/* Icon */}
            <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <svg
                className="w-8 h-8 text-primary"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 17h14v2H5zM6 10l3-3 3 3 3-3 3 3v5H3v-5l3-3z" />
                <circle cx="9" cy="17" r="1" />
                <circle cx="15" cy="17" r="1" />
              </svg>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-surface-3 text-text-muted font-heading uppercase tracking-wider">
                  {makeName}
                </span>
                {genYearStart && (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber/10 text-amber border border-amber/20 font-heading">
                    {formatYearRange(genYearStart, genYearEnd)}
                  </span>
                )}
              </div>

              <h1 className="text-2xl font-bold text-text-primary font-heading">
                {makeName} {modelName}
              </h1>
              <p className="text-sm text-text-muted mt-0.5">
                {genName}{" "}
                {genYearStart
                  ? `(${formatYearRange(genYearStart, genYearEnd)})`
                  : ""}
              </p>

              {/* Engine details */}
              <div className="mt-4 p-4 bg-surface-2 rounded-lg border border-surface-border">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-lg font-bold text-text-primary font-heading">
                      {engineCode}
                    </p>
                    <p className="text-sm text-text-secondary mt-0.5">
                      {engineName}
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    {engineDisplacement && (
                      <p className="text-sm font-semibold text-text-primary font-heading">
                        {engineDisplacement}
                      </p>
                    )}
                    {engineFuelType && (
                      <p className="text-xs text-text-muted">
                        {engineFuelType}
                      </p>
                    )}
                    {engineHp && (
                      <p className="text-sm font-bold text-primary font-heading">
                        {engineHp} hp
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Follow button (client component) */}
              <div className="mt-4">
                <FollowVehicleButton
                  engineId={engineId}
                  userId={user?.id ?? null}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Posts tagged with this engine */}
        <div>
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
            Posts about this engine
            {posts.length > 0 && (
              <span className="text-sm font-normal text-text-muted">
                ({posts.length})
              </span>
            )}
          </h2>

          {posts.length === 0 ? (
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
                href="/submit"
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
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
