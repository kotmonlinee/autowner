import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export const metadata: Metadata = {
  title: "OBD-II Severity Levels Explained — What Each Level Means",
  description:
    "Understand OBD-II severity levels from 1 (minor) to 5 (critical). Learn what each level means, whether you can keep driving, and when to get repairs.",
  alternates: { canonical: "https://www.autowner.com/obd/severity-levels" },
};

interface SeverityLevel {
  level: number;
  label: string;
  bg: string;
  text: string;
  border: string;
  darkBg: string;
  darkText: string;
  darkBorder: string;
  description: string;
  driving: string;
  examples: string;
}

const LEVELS: SeverityLevel[] = [
  {
    level: 5,
    label: "Critical",
    bg: "#fef2f2", text: "#dc2626", border: "#fecaca",
    darkBg: "#450a0a", darkText: "#fca5a5", darkBorder: "#7f1d1d",
    description:
      "A severe fault that can cause immediate engine, transmission, or safety system damage. Continuing to drive is dangerous — both to you and your vehicle.",
    driving: "Stop driving immediately. Have the vehicle towed to a repair shop.",
    examples: "Misfire severe enough to damage the catalytic converter, transmission failure, brake system failure.",
  },
  {
    level: 4,
    label: "Serious",
    bg: "#fff7ed", text: "#ea580c", border: "#fed7aa",
    darkBg: "#431407", darkText: "#fdba74", darkBorder: "#7c2d12",
    description:
      "A significant fault affecting drivability, emissions, or fuel economy. The car may still run, but prolonged driving risks further damage and higher repair costs.",
    driving: "Drive gently to a repair shop as soon as possible. Avoid long trips and heavy loads.",
    examples: "Catalyst efficiency below threshold (P0420/P0430), EGR system faults, EVAP major leaks.",
  },
  {
    level: 3,
    label: "Moderate",
    bg: "#fefce8", text: "#ca8a04", border: "#fde68a",
    darkBg: "#422006", darkText: "#fde047", darkBorder: "#713f12",
    description:
      "A noticeable issue to address soon. May affect emissions, fuel economy, or performance, but the vehicle is generally safe to drive in the short term.",
    driving: "Schedule a diagnosis within the next week. Normal daily driving is acceptable.",
    examples: "Oxygen sensor slow response, small EVAP leaks, minor fuel trim deviations.",
  },
  {
    level: 2,
    label: "Minor",
    bg: "#f0fdf4", text: "#16a34a", border: "#bbf7d0",
    darkBg: "#052e16", darkText: "#86efac", darkBorder: "#14532d",
    description:
      "A manageable fault with limited impact on operation. The vehicle remains safe and functional, but the issue should be resolved to prevent escalation.",
    driving: "Safe to drive normally. Schedule a repair at your next convenience.",
    examples: "Loose or missing gas cap, minor sensor circuit faults, non-critical electrical codes.",
  },
  {
    level: 1,
    label: "Low",
    bg: "#f0fdf4", text: "#16a34a", border: "#bbf7d0",
    darkBg: "#052e16", darkText: "#86efac", darkBorder: "#14532d",
    description:
      "The lowest-severity diagnostic code. Often informational or a very minor deviation. Typically no noticeable symptoms.",
    driving: "No driving restrictions. Address at your next scheduled maintenance.",
    examples: "Pending codes not yet fully triggered, manufacturer-specific informational codes.",
  },
];

export default async function SeverityLevelsPage({
  searchParams,
}: {
  searchParams: Promise<{ level?: string }>;
}) {
  const sp = await searchParams;
  const activeLevel = (() => {
    const p = parseInt(sp.level || "", 10);
    return p >= 1 && p <= 5 ? p : null;
  })();

  return (
    <div className="min-h-screen bg-surface-0 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto px-5 py-8 w-full">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-text-muted font-heading" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/obd" className="hover:text-primary transition-colors">OBD Codes</Link>
          <span className="mx-2">/</span>
          <span className="text-text-secondary">Severity Levels</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-text-primary tracking-tight mb-2">
            OBD-II Severity Levels
          </h1>
          <p className="text-text-muted text-sm leading-relaxed max-w-2xl">
            Every diagnostic trouble code is rated 1–5. The higher the level, the more urgent the repair.
            {activeLevel && (
              <span>
                {" "}
                You came from a{" "}
                <span className="font-heading font-bold" style={{ color: LEVELS.find((l) => l.level === activeLevel)?.text }}>
                  Level {activeLevel}
                </span>{" "}
                code.
              </span>
            )}
          </p>
        </div>

        {/* Severity spectrum */}
        <div className="mb-2">
          <div className="flex gap-1.5 mb-1.5 px-1">
            {LEVELS.map((l) => {
              const isActive = activeLevel === l.level;
              return (
                <a
                  key={l.level}
                  href={`#level-${l.level}`}
                  className="relative flex-1 h-3 rounded-full transition-all duration-300 hover:scale-y-[2.2] cursor-pointer"
                  style={{
                    background: l.text,
                    transform: isActive ? "scaleY(2.4)" : undefined,
                    boxShadow: isActive ? `0 0 14px ${l.text}99` : undefined,
                    zIndex: isActive ? 2 : 1,
                  }}
                  title={`Level ${l.level} — ${l.label}`}
                >
                  <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-heading font-bold text-text-muted whitespace-nowrap">
                    {l.level}
                  </span>
                </a>
              );
            })}
          </div>
          <div className="flex justify-between px-1">
            <span className="text-[10px] font-heading text-text-muted">Minor</span>
            <span className="text-[10px] font-heading text-text-muted">Critical</span>
          </div>
        </div>

        {/* Cards */}
        <div className="space-y-4 mt-8">
          {LEVELS.map((l) => {
            const isActive = activeLevel === l.level;
            return (
              <section
                key={l.level}
                id={`level-${l.level}`}
                className={`severity-card severity-card--l${l.level} rounded-2xl border-2 p-5 sm:p-6 transition-all duration-300 ${
                  isActive ? "severity-card--active" : ""
                }`}
                style={{
                  background: l.bg,
                  borderColor: isActive ? l.text : l.border,
                  ...(isActive ? { boxShadow: `0 0 0 4px ${l.text}33` } : {}),
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className="severity-card__badge inline-flex items-center justify-center w-10 h-10 rounded-xl text-lg font-heading font-bold shrink-0"
                    style={{ background: l.text, color: "#fff" }}
                  >
                    {l.level}
                  </span>
                  <h2 className="text-lg font-heading font-bold severity-card__heading" style={{ color: l.text }}>
                    {l.label}
                  </h2>
                  {isActive && (
                    <span
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-heading font-bold border animate-pulse"
                      style={{ color: l.text, borderColor: l.text }}
                    >
                      Your code
                    </span>
                  )}
                </div>

                <p className="text-sm leading-relaxed mb-3 severity-card__desc" style={{ color: l.text, opacity: 0.8 }}>
                  {l.description}
                </p>

                <div
                  className="severity-card__drive rounded-lg px-4 py-3 mb-3"
                  style={{ background: l.level >= 4 ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.5)" }}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-sm font-heading font-bold shrink-0" style={{ color: l.text }}>
                      {l.level >= 4 ? "⛔" : l.level >= 3 ? "⚠️" : "✅"}
                    </span>
                    <div>
                      <span className="text-sm font-heading font-bold" style={{ color: l.text }}>
                        Can you drive?
                      </span>
                      <p className="text-sm mt-0.5" style={{ color: l.text, opacity: 0.85 }}>
                        {l.driving}
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-xs severity-card__examples" style={{ color: l.text, opacity: 0.65 }}>
                  <span className="font-heading font-bold">Common examples:</span> {l.examples}
                </p>
              </section>
            );
          })}
        </div>

        {/* Bottom CTAs */}
        <div className="mt-10 p-6 rounded-2xl bg-surface-1 border border-surface-border text-center">
          <p className="text-sm text-text-secondary mb-4">
            Not sure what your code means? Look it up or let AI help.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/obd"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-0 border border-surface-border text-sm font-heading font-bold text-text-primary hover:border-primary/20 transition-colors"
            >
              Browse OBD Codes
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width={14} height={14}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </Link>
            <Link
              href="/symptom-checker"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-heading font-bold hover:bg-primary-glow hover:-translate-y-px transition-all shadow-sm shadow-primary/20"
            >
              AI Symptom Checker
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width={14} height={14}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </Link>
          </div>
        </div>
      </main>

      <Footer />

      {/* Dark mode overrides */}
      <style dangerouslySetInnerHTML={{ __html: LEVELS.map((l) => `
        .dark .severity-card--l${l.level} {
          background: ${l.darkBg} !important;
          border-color: ${l.darkBorder} !important;
        }
        .dark .severity-card--l${l.level} .severity-card__heading,
        .dark .severity-card--l${l.level} .severity-card__desc,
        .dark .severity-card--l${l.level} .severity-card__examples {
          color: ${l.darkText} !important;
        }
        .dark .severity-card--l${l.level} .severity-card__badge {
          background: ${l.darkText} !important;
        }
        .dark .severity-card--l${l.level} .severity-card__drive {
          background: ${l.level >= 4 ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.2)"} !important;
        }
      `).join("\n") }} />
    </div>
  );
}
