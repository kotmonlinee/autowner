import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SmartSearchBar from "@/components/SmartSearchBar";
import { DEFAULT_OG_IMAGE, DEFAULT_OG_IMAGE_META } from "@/lib/constants";

export const metadata: Metadata = {
  title: { absolute: "AutOwner — What's Wrong with Your Car?" },
  description:
    "AI-powered car diagnosis, OBD-II code lookup, repair cost estimates, and mechanic quote verification.",
  alternates: { canonical: "https://www.autowner.com" },
  openGraph: {
    siteName: "AutOwner",
    type: "website",
    title: "AutOwner — What's Wrong with Your Car?",
    description:
      "AI-powered car diagnosis, OBD-II code lookup, repair cost estimates, and mechanic quote verification.",
    images: [DEFAULT_OG_IMAGE_META],
  },
  twitter: {
    card: "summary_large_image",
    title: "Repair Cost Checker & OBD Code Lookup | AutOwner",
    description:
      "Check repair costs, verify mechanic quotes, decode warning lights and OBD codes.",
    images: [DEFAULT_OG_IMAGE],
  },
};

const symptomLinks = [
  { label: "Unusual noise", href: "/symptoms/car-shaking-at-idle", detail: "Knocking, grinding, humming" },
  { label: "Warning light", href: "/symptoms/check-engine-light-on", detail: "Decode the dashboard" },
  { label: "Strange smell", href: "/symptoms/burning-smell", detail: "Fuel, oil, coolant, rubber" },
  { label: "Will not start", href: "/symptoms/car-wont-start", detail: "Battery, starter, fuel, ignition" },
  { label: "Braking issue", href: "/symptoms/brake-pedal-goes-to-floor", detail: "Pedal, noise, pulling" },
  { label: "Fluid leak", href: "/symptoms/brake-fluid-leak", detail: "Identify the fluid first" },
];

const sectionLabel = "text-[11px] font-heading font-bold uppercase tracking-[0.14em] text-text-muted";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-surface-0">
      <Navbar />

      <main className="flex-1">
        <section className="border-b border-surface-border">
          <div className="mx-auto grid max-w-[1180px] gap-12 px-5 pb-16 pt-14 sm:pt-20 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:pb-20">
            <div>
              <p className={sectionLabel}>Vehicle symptoms / diagnostics</p>
              <h1 className="mt-4 max-w-[680px] font-display text-5xl font-semibold leading-[0.98] tracking-[-0.045em] text-text-primary sm:text-6xl lg:text-[72px]">
                What&apos;s wrong with your car?
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-text-secondary sm:text-lg">
                Start with the symptom, warning light, or trouble code. AutOwner
                helps you understand the likely cause, what it should cost, and
                what to do next.
              </p>
              <SmartSearchBar />
              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs font-heading font-semibold">
                <Link prefetch={false} href="/symptom-checker" className="text-primary hover:underline">
                  Use the symptom wizard
                </Link>
                <Link prefetch={false} href="/obd" className="text-text-secondary hover:text-text-primary hover:underline">
                  Look up an OBD code
                </Link>
                <Link prefetch={false} href="/quote-checker" className="text-text-secondary hover:text-text-primary hover:underline">
                  Check a mechanic&apos;s quote
                </Link>
              </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-text-secondary/20 bg-text-primary text-surface-1 shadow-[12px_12px_0_0_#d8d0c2]">
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
                <span className="text-[10px] font-heading font-bold uppercase tracking-[0.15em] text-white/55">
                  Diagnostic preview
                </span>
                <span className="rounded-sm bg-primary px-2 py-1 text-[10px] font-heading font-bold uppercase tracking-wider text-white">
                  Service soon
                </span>
              </div>
              <div className="p-5 sm:p-6">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <p className="font-mono text-4xl font-bold tracking-tight text-primary">P0420</p>
                    <p className="mt-2 max-w-sm text-sm leading-6 text-white/75">
                      Catalyst system efficiency below threshold
                    </p>
                  </div>
                  <svg viewBox="0 0 48 48" className="h-12 w-12 shrink-0 text-primary" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <circle cx="24" cy="24" r="18" />
                    <path d="M15 27h5l3-9 4 15 3-6h3" />
                  </svg>
                </div>

                <div className="mt-7 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-white/10 bg-white/10">
                  {[
                    ["Likely area", "Catalytic converter"],
                    ["Verify first", "Check for exhaust leaks"],
                    ["Typical repair", "$400–$1,500"],
                    ["Best next step", "Diagnose before replacing"],
                  ].map(([label, value]) => (
                    <div key={label} className="bg-text-primary p-4">
                      <p className="text-[10px] font-heading font-bold uppercase tracking-[0.12em] text-white/45">{label}</p>
                      <p className="mt-1.5 text-sm font-heading font-semibold text-white/90">{value}</p>
                    </div>
                  ))}
                </div>

                <Link
                  prefetch={false}
                  href="/obd/p0420"
                  className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-sm font-heading font-semibold text-white transition-colors hover:text-primary"
                >
                  See the complete diagnostic path
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-surface-border bg-surface-1">
          <div className="mx-auto max-w-[1180px] px-5 py-14 sm:py-16">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <p className={sectionLabel}>Choose your starting point</p>
                <h2 className="mt-2 font-display text-3xl font-semibold tracking-[-0.03em] text-text-primary sm:text-4xl">
                  The shortest route to a useful answer.
                </h2>
              </div>
              <p className="max-w-md text-sm leading-6 text-text-secondary">
                Start with the symptom when you do not know the cause. Start with a
                code when the scanner already found one.
              </p>
            </div>

            <div className="mt-8 grid gap-3 lg:grid-cols-12">
              <Link
                prefetch={false}
                href="/symptom-checker"
                className="group flex min-h-64 flex-col justify-between rounded-lg bg-text-primary p-6 text-surface-1 lg:col-span-5"
              >
                <div>
                  <span className="text-[10px] font-heading font-bold uppercase tracking-[0.15em] text-primary">Primary diagnostic tool</span>
                  <h3 className="mt-5 font-display text-3xl font-semibold tracking-[-0.03em]">Tell us what the car is doing.</h3>
                  <p className="mt-3 max-w-md text-sm leading-6 text-white/65">
                    Select the symptoms, location, and driving conditions. We will show likely causes and steps to verify them.
                  </p>
                </div>
                <span className="mt-8 inline-flex items-center gap-2 text-sm font-heading font-bold text-white group-hover:text-primary">
                  Start a diagnosis <span aria-hidden="true">→</span>
                </span>
              </Link>

              <Link
                prefetch={false}
                href="/obd"
                className="group rounded-lg border border-surface-border bg-surface-0 p-6 transition-colors hover:border-primary/50 lg:col-span-4"
              >
                <p className={sectionLabel}>12,100+ trouble codes</p>
                <h3 className="mt-4 font-display text-3xl font-semibold tracking-[-0.03em] text-text-primary">Decode a fault code.</h3>
                <p className="mt-3 text-sm leading-6 text-text-secondary">
                  Meaning, likely causes, verification steps, repair ranges, and whether the vehicle is safe to drive.
                </p>
                <span className="mt-8 inline-flex items-center gap-2 text-sm font-heading font-bold text-primary">
                  Search OBD codes <span aria-hidden="true">→</span>
                </span>
              </Link>

              <Link
                prefetch={false}
                href="/repair-cost"
                className="group rounded-lg border border-surface-border bg-surface-0 p-6 transition-colors hover:border-primary/50 lg:col-span-3"
              >
                <p className={sectionLabel}>Repair estimates</p>
                <h3 className="mt-4 font-display text-3xl font-semibold tracking-[-0.03em] text-text-primary">Know the real range.</h3>
                <p className="mt-3 text-sm leading-6 text-text-secondary">
                  Compare parts, labor, and typical prices across vehicle classes.
                </p>
                <span className="mt-8 inline-flex items-center gap-2 text-sm font-heading font-bold text-primary">
                  Browse repairs <span aria-hidden="true">→</span>
                </span>
              </Link>
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {[
                ["Check a quote", "/quote-checker", "See whether a mechanic's estimate is fair."],
                ["Warning lights", "/warning-lights", "Understand urgency before you drive."],
                ["Recall lookup", "/recall-check", "Search open safety recalls by vehicle."],
              ].map(([title, href, description]) => (
                <Link
                  prefetch={false}
                  key={href}
                  href={href}
                  className="group flex items-start justify-between gap-5 rounded-md border border-surface-border px-4 py-4 transition-colors hover:bg-surface-2"
                >
                  <div>
                    <h3 className="text-sm font-heading font-bold text-text-primary">{title}</h3>
                    <p className="mt-1 text-xs leading-5 text-text-muted">{description}</p>
                  </div>
                  <span className="text-primary transition-transform group-hover:translate-x-0.5" aria-hidden="true">→</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-[1180px] px-5 py-14 sm:py-16">
            <div className="grid gap-8 lg:grid-cols-[.72fr_1.28fr]">
              <div>
                <p className={sectionLabel}>Start with what you notice</p>
                <h2 className="mt-2 max-w-sm font-display text-4xl font-semibold leading-tight tracking-[-0.035em] text-text-primary">
                  You do not need to know the part before you start.
                </h2>
                <p className="mt-4 max-w-sm text-sm leading-6 text-text-secondary">
                  Begin with the observation. The diagnostic path will narrow the
                  system, likely cause, and safest next step.
                </p>
                <Link prefetch={false} href="/symptoms" className="mt-6 inline-flex text-sm font-heading font-bold text-primary hover:underline">
                  Browse all symptoms →
                </Link>
              </div>
              <div className="grid border-l border-t border-surface-border sm:grid-cols-2">
                {symptomLinks.map((item) => (
                  <Link
                    prefetch={false}
                    key={item.href}
                    href={item.href}
                    className="group min-h-32 border-b border-r border-surface-border p-5 transition-colors hover:bg-surface-1"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-heading text-base font-bold text-text-primary group-hover:text-primary">{item.label}</h3>
                      <span className="text-text-muted transition-transform group-hover:translate-x-0.5" aria-hidden="true">→</span>
                    </div>
                    <p className="mt-3 text-xs leading-5 text-text-muted">{item.detail}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-surface-border bg-surface-1">
          <div className="mx-auto grid max-w-[1180px] gap-8 px-5 py-14 lg:grid-cols-2">
            <div>
              <p className={sectionLabel}>Repair cost watch</p>
              <h2 className="mt-2 font-display text-3xl font-semibold tracking-[-0.03em] text-text-primary">What common repairs typically cost.</h2>
              <div className="mt-5 divide-y divide-surface-border border-y border-surface-border">
                {[
                  ["Battery replacement", "$90–$450", "/repair-cost/battery"],
                  ["Alternator replacement", "$400–$900", "/repair-cost/alternator"],
                  ["Brake caliper replacement", "$300–$800", "/repair-cost/brake-caliper"],
                ].map(([name, cost, href]) => (
                  <Link prefetch={false} key={href} href={href} className="grid grid-cols-[1fr_auto_auto] items-center gap-4 py-4 text-sm transition-colors hover:text-primary">
                    <span className="font-heading font-semibold text-text-primary">{name}</span>
                    <span className="font-mono text-xs text-text-secondary">{cost}</span>
                    <span aria-hidden="true">→</span>
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <p className={sectionLabel}>Vehicle research</p>
              <h2 className="mt-2 font-display text-3xl font-semibold tracking-[-0.03em] text-text-primary">Start with the car you own.</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {[
                  ["Ford F-150", "/vehicles/ford/f-150"],
                  ["Honda Civic", "/vehicles/honda/civic"],
                  ["Toyota Camry", "/vehicles/toyota/camry"],
                ].map(([name, href]) => (
                  <Link prefetch={false} key={href} href={href} className="flex min-h-28 flex-col justify-between rounded-md border border-surface-border bg-surface-0 p-4 transition-colors hover:border-primary/50">
                    <span className="font-display text-xl font-semibold text-text-primary">{name}</span>
                    <span className="text-xs font-heading font-bold text-primary">Costs, codes &amp; issues →</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-[1180px] px-5 py-12">
            <div className="grid gap-6 rounded-lg border border-surface-border bg-surface-1 p-6 sm:grid-cols-[1fr_auto] sm:items-center sm:p-8">
              <div>
                <p className={sectionLabel}>How the information is built</p>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-text-secondary">
                  AutOwner combines structured trouble-code and repair data with AI-assisted explanations. Cost ranges are estimates, and safety-critical problems require an in-person inspection.
                </p>
              </div>
              <Link prefetch={false} href="/about" className="text-sm font-heading font-bold text-primary hover:underline">
                About our method →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
