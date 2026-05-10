import { getEngineById, getPostsByEngine, getVehicleStats } from "@/lib/data/server";
import Link from "next/link";

interface SimilarOwnersProps {
  engineId: string;
}

export default async function SimilarOwners({ engineId }: SimilarOwnersProps) {
  const engine = await getEngineById(engineId);
  if (!engine) return null;

  const engineData = engine as Record<string, unknown>;
  const gen = engineData.vehicle_generations as Record<string, unknown>;
  const model = gen.vehicle_models as Record<string, unknown>;
  const make = model.vehicle_makes as Record<string, unknown>;

  const makeName = String(make.name ?? "");
  const modelName = String(model.name ?? "");
  const genName = String(gen.name ?? "");
  const engineCode = String(engineData.code ?? "");
  const vehicleName = `${makeName} ${modelName}`;

  const [stats, posts] = await Promise.all([
    getVehicleStats(engineId),
    getPostsByEngine(engineId),
  ]);

  const recentTitles = posts.slice(0, 3).map((p) => ({ id: p.id, title: p.title }));

  return (
    <div className="bg-surface-1 rounded-xl border border-surface-border p-5">
      <h4 className="text-xs font-bold uppercase tracking-widest text-text-muted font-heading mb-4">
        Your Garage
      </h4>

      {/* Vehicle info */}
      <div className="flex items-start gap-3 mb-4">
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <svg
            className="w-4.5 h-4.5 text-primary"
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
        <div className="min-w-0">
          <p className="text-xs font-semibold text-text-secondary font-heading truncate">
            {vehicleName}
          </p>
          <p className="text-[10px] text-text-muted truncate">
            {genName} ({engineCode})
          </p>
        </div>
      </div>

      {/* Social proof */}
      <p className="text-xs text-text-muted mb-3">
        <span className="font-semibold text-text-secondary">
          {stats.followerCount}
        </span>{" "}
        {stats.followerCount === 1 ? "owner" : "owners"} of the {vehicleName}{" "}
        {stats.followerCount === 1 ? "follows" : "follow"} this vehicle
      </p>

      {/* Recent posts for this vehicle */}
      {recentTitles.length > 0 && (
        <>
          <div className="h-px bg-surface-border mb-3" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted font-heading mb-2">
            Recent {vehicleName} posts
          </p>
          <div className="space-y-1.5">
            {recentTitles.map((post, i) => (
              <Link
                key={post.id}
                href={`/post/${post.id}`}
                className="flex items-start gap-2 group"
              >
                <span className="text-[10px] font-bold text-text-muted mt-0.5 font-heading tabular-nums shrink-0">
                  {(i + 1).toString().padStart(2, "0")}
                </span>
                <span className="text-xs text-text-secondary group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                  {post.title}
                </span>
              </Link>
            ))}
          </div>
        </>
      )}

      {/* Link to vehicle community page */}
      <Link
        href={`/vehicle/${engineId}`}
        className="mt-4 flex items-center justify-center gap-1.5 w-full py-2 text-xs font-semibold text-primary bg-primary/5 border border-primary/10 rounded-lg hover:bg-primary/10 transition-colors font-heading"
      >
        <svg
          className="w-3.5 h-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
        View {vehicleName} community
      </Link>
    </div>
  );
}
