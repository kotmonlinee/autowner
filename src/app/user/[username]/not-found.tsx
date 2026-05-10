import Link from "next/link";

export default function UserNotFound() {
  return (
    <div className="min-h-screen bg-surface-0 flex items-center justify-center">
      <div className="max-w-lg mx-auto px-5 py-24 text-center">
        <h1 className="text-4xl font-bold text-text-primary font-heading mb-4">
          User Not Found
        </h1>
        <p className="text-text-muted mb-8 max-w-md mx-auto leading-relaxed">
          This user doesn't exist.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white text-sm font-semibold font-heading rounded-lg hover:bg-primary-glow hover:-translate-y-px transition-all duration-150"
        >
          Back to Homepage
        </Link>
      </div>
    </div>
  );
}
