import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export const metadata: Metadata = {
  title: "DIY Difficulty Levels Explained — Can You Fix It Yourself?",
  description: "Understand AutOwner's 5-level DIY difficulty system. From L1 Beginner to L5 Professional — find out if you can do the repair yourself.",
  alternates: { canonical: "https://www.autowner.com/repair-cost/diy-levels" },
};

const LEVELS = [
  {
    level: 1,
    label: "Beginner",
    desc: "Anyone can do this. No mechanical knowledge needed. Takes minutes, not hours.",
    tools: "No special tools — maybe a screwdriver or wrench you already own.",
    time: "< 30 minutes",
    risk: "Very low — almost impossible to cause damage.",
    examples: "Engine air filter, cabin air filter, battery, MAF sensor, ignition coil.",
    color: "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
    dot: "bg-emerald-500",
  },
  {
    level: 2,
    label: "Easy",
    desc: "Basic DIY. You'll need common hand tools and a willingness to learn. Most people can do these with a YouTube tutorial.",
    tools: "Socket set, wrenches, drain pan — typical home garage tools.",
    time: "30 minutes – 1.5 hours",
    risk: "Low — follow instructions and you'll be fine.",
    examples: "Oil change, spark plugs, oxygen sensor, coolant flush, serpentine belt, throttle body.",
    color: "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
    dot: "bg-emerald-500",
  },
  {
    level: 3,
    label: "Intermediate",
    desc: "Requires some mechanical experience. You'll be working under the car or removing significant components.",
    tools: "Jack + jack stands, torque wrench, specialty sockets — invest in quality.",
    time: "1 – 5 hours",
    risk: "Medium — mistakes can cause damage or safety issues. Take your time.",
    examples: "Brake pads, alternator, starter, water pump, radiator, valve cover gasket, CV axle.",
    color: "bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800",
    dot: "bg-amber-500",
  },
  {
    level: 4,
    label: "Advanced",
    desc: "For experienced DIYers. Requires specialized tools, significant disassembly, and knowledge of vehicle systems.",
    tools: "Spring compressor, hydraulic press, engine support bar — some you may need to rent.",
    time: "2 – 8 hours",
    risk: "High — improper work can lead to serious damage or injury.",
    examples: "Struts, ball joints, control arms, engine mounts, catalytic converter, fuel pump.",
    color: "bg-orange-50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800",
    dot: "bg-orange-500",
  },
  {
    level: 5,
    label: "Professional",
    desc: "Not recommended for DIY. Requires professional certification, specialized equipment, or extreme risk if done wrong.",
    tools: "Professional-grade equipment — A/C machine, engine hoist, alignment rack.",
    time: "3 – 20+ hours (shop time)",
    risk: "Very High — one mistake can destroy your engine or create a safety hazard.",
    examples: "Timing belt, head gasket, AC compressor, clutch, evaporator core, windshield.",
    color: "bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
    dot: "bg-red-500",
  },
];

export default function DiyLevelsPage() {
  return (
    <div className="min-h-screen bg-surface-0 flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto px-5 py-8 w-full">
        <nav className="mb-4 flex items-center gap-2 text-sm text-text-muted font-heading" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <svg className="w-3 h-3 text-surface-border" fill="none" stroke="currentColor" viewBox="0 0 24 24" width={12} height={12}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <span className="text-text-secondary">DIY Difficulty Levels</span>
        </nav>

        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-text-primary mb-3">DIY Difficulty Levels</h1>
          <p className="text-text-muted text-sm sm:text-base leading-relaxed max-w-2xl">
            Every repair on AutOwner is rated on a 5-level DIY difficulty scale. The rating considers required tools, experience, time, and safety risk — not just how many hours the book says it takes.
          </p>
        </div>

        <div className="space-y-4">
          {LEVELS.map((l) => (
            <section key={l.level} className={`rounded-2xl border-2 p-5 sm:p-6 ${l.color}`}>
              <div className="flex items-center gap-3 mb-3">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl text-lg font-heading font-bold shrink-0 text-white" style={{ background: l.dot.replace("bg-", "").includes("emerald") ? "#059669" : l.dot.replace("bg-", "").includes("amber") ? "#d97706" : l.dot.replace("bg-", "").includes("orange") ? "#ea580c" : "#dc2626" }}>
                  {l.level}
                </span>
                <h2 className="text-lg font-heading font-bold">
                  L{l.level} — {l.label}
                </h2>
              </div>

              <p className="text-sm leading-relaxed mb-4 opacity-90">
                {l.desc}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div className="rounded-lg px-4 py-3" style={{ background: "rgba(255,255,255,0.5)" }}>
                  <p className="text-xs font-heading font-bold opacity-70 uppercase tracking-wider mb-1">Tools Needed</p>
                  <p className="text-sm opacity-90">{l.tools}</p>
                </div>
                <div className="rounded-lg px-4 py-3" style={{ background: "rgba(255,255,255,0.5)" }}>
                  <p className="text-xs font-heading font-bold opacity-70 uppercase tracking-wider mb-1">Typical Time</p>
                  <p className="text-sm opacity-90">{l.time}</p>
                </div>
              </div>

              <div className="rounded-lg px-4 py-3 mb-3" style={{ background: "rgba(255,255,255,0.5)" }}>
                <p className="text-xs font-heading font-bold opacity-70 uppercase tracking-wider mb-1">Risk</p>
                <p className="text-sm opacity-90">{l.risk}</p>
              </div>

              <p className="text-xs opacity-70">
                <span className="font-heading font-bold">Examples:</span> {l.examples}
              </p>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
