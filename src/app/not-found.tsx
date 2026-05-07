import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface-0 relative flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center">
        <div className="max-w-lg mx-auto px-5 py-24 text-center">
          {/* Wrench + 404 */}
          <div className="mb-8 flex items-center justify-center">
            <div className="relative">
              {/* Large wrench icon */}
              <svg
                className="w-32 h-32 sm:w-40 sm:h-40 text-surface-3"
                viewBox="0 0 100 100"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* Wrench handle */}
                <line x1="18" y1="82" x2="52" y2="48" />
                {/* Wrench head */}
                <circle cx="70" cy="30" r="20" />
                {/* Inner detail */}
                <circle cx="70" cy="30" r="10" strokeWidth="2.5" />
                {/* Jaw opening */}
                <line x1="56" y1="28" x2="65" y2="19" strokeWidth="3" />
                <line x1="52" y1="32" x2="61" y2="23" strokeWidth="3" />
                {/* Bolt detail */}
                <circle cx="70" cy="30" r="4" fill="currentColor" strokeWidth="1" />
                {/* Grip lines on handle */}
                <line x1="22" y1="78" x2="30" y2="70" strokeWidth="2" />
                <line x1="26" y1="82" x2="34" y2="74" strokeWidth="2" />
                <line x1="30" y1="78" x2="38" y2="70" strokeWidth="2" />
              </svg>
            </div>
          </div>

          {/* 404 text */}
          <h1 className="text-8xl sm:text-9xl font-bold text-text-primary font-display mb-4 tracking-tight">
            404
          </h1>

          {/* Car-themed copy */}
          <p className="text-xl sm:text-2xl font-semibold text-text-primary font-heading mb-3">
            This page isn't under the hood.
          </p>

          <p className="text-text-muted mb-10 max-w-md mx-auto leading-relaxed">
            The page you're looking for has been towed, sold for parts, or never
            existed. Let's get you back on the road.
          </p>

          {/* Back to home */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white text-sm font-semibold font-heading rounded-lg hover:bg-primary-glow hover:-translate-y-px transition-all duration-150 shadow-sm shadow-primary/20"
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
              <path d="M5 12h14M12 5l-7 7 7 7" />
            </svg>
            Back to Homepage
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
