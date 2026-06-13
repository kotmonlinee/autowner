import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Sparkles, DollarSign, ShieldAlert, AlertTriangle, ChevronRight } from "lucide-react";

export default function DemoObdWhatsNext() {
  return (
    <div className="min-h-screen bg-surface-0 flex flex-col">
      <Navbar />
      <main className="max-w-3xl mx-auto px-5 py-8 flex-1 w-full">
        <p className="text-xs font-heading font-bold text-text-muted uppercase tracking-wider mb-6">
          Demo: OBD Detail Page (Header Context + "What's Next" Section)
        </p>

        {/* ── Simulated OBD Page Header ── */}
        <div className="bg-surface-1 rounded-xl border border-surface-border p-6 mb-8">
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-3xl font-heading font-bold text-text-primary tracking-wider">P0420</h1>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold font-heading border bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              Critical
            </span>
          </div>
          <p className="text-xl font-heading font-semibold text-text-primary mb-2">Catalyst System Efficiency Below Threshold</p>
          <p className="text-sm text-text-secondary">Commonly triggered by faulty catalytic converter or oxygen sensor. Symptoms may include check engine light, decreased fuel economy, sulfur/rotten egg smell. This is a critical issue — do not continue driving.</p>
        </div>

        {/* ── Can I Still Drive? ── */}
        <div className="bg-red-50 dark:bg-red-950/30 rounded-2xl border-2 border-red-200 dark:border-red-800 p-5 mb-4">
          <h2 className="text-base font-heading font-bold text-text-primary mb-2">Can you still drive with P0420?</h2>
          <p className="text-sm text-text-secondary mb-3">
            <span className="mr-1.5">⚠️</span>
            Short-distance driving is usually OK, but have this diagnosed within a week to prevent further damage.
          </p>
          <p className="text-sm font-semibold text-text-primary">
            Typical repair cost: $500 – $2,000
          </p>
        </div>

        {/* ── Existing page content would continue here ── */}
        <div className="text-center py-8 text-text-muted text-sm border-2 border-dashed border-surface-border rounded-xl mb-8">
          ...existing page content (symptoms, causes, fixes, related codes)...
        </div>

        {/* ── NEW: What's Next Decision Cards ── */}
        <div className="border-t-2 border-primary/20 pt-8 mt-4">
          <p className="text-sm font-heading font-bold text-text-primary mb-1">What's Next?</p>
          <p className="text-xs text-text-muted mb-5">Based on your P0420 code, here's what we recommend:</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            {/* Card 1: Confirm with AI */}
            <Link href="/symptom-checker" className="group bg-surface-1 rounded-2xl border border-surface-border hover:border-primary/30 hover:shadow-md hover:-translate-y-1 transition-all p-5 flex flex-col">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-sm font-heading font-bold text-text-primary mb-2 group-hover:text-primary transition-colors">Confirm with AI</h3>
              <p className="text-xs text-text-muted leading-relaxed mb-4 flex-1">Not sure this is really P0420? Describe your symptoms for a second opinion.</p>
              <div className="bg-primary/5 rounded-lg px-3 py-2 text-xs text-text-muted mb-3">
                <span className="font-semibold text-text-primary">Top related symptoms:</span> Check engine light, poor fuel economy, sulfur smell
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-heading font-bold text-primary mt-auto group-hover:gap-1.5 transition-all">
                Diagnose Symptoms
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </Link>

            {/* Card 2: Repair Cost Detail */}
            <Link href="/repair-cost/catalytic-converter" className="group bg-surface-1 rounded-2xl border border-surface-border hover:border-primary/30 hover:shadow-md hover:-translate-y-1 transition-all p-5 flex flex-col">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center mb-3">
                <DollarSign className="w-5 h-5 text-blue-500" />
              </div>
              <h3 className="text-sm font-heading font-bold text-text-primary mb-2 group-hover:text-primary transition-colors">Repair Cost Breakdown</h3>
              <p className="text-xs text-text-muted leading-relaxed mb-4 flex-1">See labor vs. parts costs, compare quotes, and find out what a fair price looks like.</p>
              <div className="bg-surface-0 rounded-lg px-3 py-2 border border-surface-border mb-3">
                <div className="flex justify-between text-xs">
                  <span className="text-text-muted">Est. Range</span>
                  <span className="font-bold text-text-primary">$500 – $2,000</span>
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-text-muted">Avg Cost</span>
                  <span className="font-bold text-text-primary">$1,100</span>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-heading font-bold text-primary mt-auto group-hover:gap-1.5 transition-all">
                View Cost Details
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </Link>

            {/* Card 3: Check Recalls */}
            <Link href="/recall-check" className="group bg-surface-1 rounded-2xl border border-surface-border hover:border-primary/30 hover:shadow-md hover:-translate-y-1 transition-all p-5 flex flex-col">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center mb-3">
                <ShieldAlert className="w-5 h-5 text-amber-500" />
              </div>
              <h3 className="text-sm font-heading font-bold text-text-primary mb-2 group-hover:text-primary transition-colors">Check for Recalls</h3>
              <p className="text-xs text-text-muted leading-relaxed mb-4 flex-1">Make sure your catalytic converter issue isn't covered by a manufacturer recall — it's free to fix.</p>
              <div className="bg-surface-0 rounded-lg px-3 py-2 border border-surface-border mb-3">
                <div className="flex items-center gap-2 text-xs">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span className="text-text-secondary">NHTSA recalls are <strong className="text-text-primary">free</strong> at dealerships</span>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-heading font-bold text-primary mt-auto group-hover:gap-1.5 transition-all">
                Search Recalls
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>

          {/* Quick links row */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-text-muted">
            <span>Or explore:</span>
            <Link href="/symptom-checker" className="text-primary hover:text-primary-glow font-heading font-medium">AI Diagnosis</Link>
            <span>·</span>
            <Link href="/repair-cost" className="text-primary hover:text-primary-glow font-heading font-medium">All Repair Costs</Link>
            <span>·</span>
            <Link href="/obd" className="text-primary hover:text-primary-glow font-heading font-medium">Browse OBD Codes</Link>
            <span>·</span>
            <Link href="/vehicles" className="text-primary hover:text-primary-glow font-heading font-medium">Browse by Vehicle</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
