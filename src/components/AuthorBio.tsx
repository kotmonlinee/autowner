import Avatar from "@/components/Avatar";
import Link from "next/link";

interface AuthorBioProps {
  username?: string;
  avatarUrl?: string | null;
  bio?: string | null;
  postCount?: number;
  isExpert?: boolean;
}

export default function AuthorBio({
  username,
  avatarUrl,
  bio,
  postCount,
  isExpert = false,
}: AuthorBioProps) {
  const displayName = username || "AutOwner";

  return (
    <div className="mt-6 bg-surface-2 rounded-xl border-l-4 border-primary border-t border-r border-b border-surface-border overflow-hidden">
      <div className="p-5">
        <div className="flex items-start gap-4">
          <Avatar
            username={displayName}
            avatarUrl={avatarUrl}
            size="lg"
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h4 className="text-sm font-bold text-text-primary font-heading">
                {displayName}
              </h4>

              {isExpert && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber/10 border border-amber/20 text-amber dark:text-amber-dark text-xs font-bold font-heading uppercase tracking-wider">
                  <svg
                    className="w-3 h-3"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                   width={12} height={12}>
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.86L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  Expert
                </span>
              )}
            </div>

            {isExpert ? (
              <>
                <p className="text-xs text-text-secondary leading-relaxed mt-1">
                  ASE Certified Master Technician with 15+ years of experience in
                  dealerships and independent shops. Specializing in diagnostics,
                  engine repair, and teaching DIYers how to save money by fixing
                  their own cars.
                </p>
                {postCount !== undefined && postCount > 0 && (
                  <p className="text-xs text-text-muted mt-2">
                    {postCount} {postCount === 1 ? "article" : "articles"} published on AutOwner
                  </p>
                )}
              </>
            ) : (
              <>
                <p className="text-xs text-text-secondary leading-relaxed mt-1">
                  {bio || "AutOwner Community Member sharing their automotive knowledge and experience."}
                </p>
                {postCount !== undefined && postCount > 0 && (
                  <p className="text-xs text-text-muted mt-2">
                    {postCount} {postCount === 1 ? "post" : "posts"} on AutOwner
                  </p>
                )}
              </>
            )}

            {username && username !== "unknown" && (
              <Link
                href={`/user/${username}`}
                className="inline-flex items-center gap-1.5 mt-3 text-xs font-bold text-primary hover:underline font-heading"
              >
                View all posts by {displayName}
                <svg
                  className="w-3 h-3"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                 width={12} height={12}>
                  <path d="M5 12h14" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
