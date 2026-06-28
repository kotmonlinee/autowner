"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { fetchVehicleMakes } from "@/lib/data/browser";

const CURR_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: CURR_YEAR - 1991 }, (_, i) => String(CURR_YEAR - i));

interface Recall {
  NHTSACampaignNumber: string;
  Component: string;
  Summary: string;
  Consequence: string;
  Remedy: string;
  ReportReceivedDate: string;
  parkIt: boolean;
  parkOutSide: boolean;
}

export default function RecallForm() {
  const searchParams = useSearchParams();
  const initialMake = searchParams.get("make") ?? "";
  const initialModel = searchParams.get("model") ?? "";
  const initialYear = searchParams.get("year") ?? "";

  const [makes, setMakes] = useState<{ name: string; slug: string }[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [make, setMake] = useState(initialMake);
  const [model, setModel] = useState(initialModel);
  const [year, setYear] = useState(initialYear);
  const [recalls, setRecalls] = useState<Recall[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchVehicleMakes().then(setMakes);
  }, []);

  useEffect(() => {
    setModels([]);
    if (!make || !year) { setModel(""); return; }
    fetch(`/api/recalls?action=models&make=${encodeURIComponent(make)}&year=${year}`)
      .then((r) => r.json())
      .then((d) => {
        const list = d.models ?? [];
        setModels(list);
        // Case-insensitive match for pre-filled model from URL
        setModel((prev) => {
          if (!prev) return "";
          const match = list.find((m: string) => m.toLowerCase() === prev.toLowerCase());
          return match ?? prev;
        });
      });
  }, [make, year]);

  const doSearch = async (m: string, mo: string, y: string) => {
    setLoading(true);
    setError("");
    setRecalls(null);
    try {
      const r = await fetch(`/api/recalls?action=search&make=${encodeURIComponent(m)}&model=${encodeURIComponent(mo)}&year=${y}`);
      const d = await r.json();
      if (d.error) { setError(d.error); return; }
      setRecalls(d.recalls ?? []);
    } catch {
      setError("Failed to load recall data.");
    } finally {
      setLoading(false);
    }
  };

  // Sync URL params to state and auto-search when all three are present
  useEffect(() => {
    setMake(initialMake);
    setModel(initialModel);
    setYear(initialYear);
  }, [initialMake, initialModel, initialYear]);

  useEffect(() => {
    if (initialMake && initialModel && initialYear) {
      doSearch(initialMake, initialModel, initialYear);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialMake, initialModel, initialYear]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!make || !model || !year) return;
    doSearch(make, model, year);
  };

  if (!makes.length) {
    return (
      <div className="text-center py-12">
        <div className="w-8 h-8 mx-auto mb-3 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <p className="text-sm text-text-muted">Loading vehicle makes...</p>
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={handleSearch} className="bg-surface-1 rounded-2xl border border-surface-border p-6 sm:p-8 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1.5 font-heading">
              Make <span className="text-red-500">*</span>
            </label>
            <select value={make} onChange={(e) => setMake(e.target.value)}
              className="w-full h-12 px-4 bg-surface-0 border border-surface-border rounded-xl text-text-primary text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all appearance-none font-heading" required>
              <option value="">Select make</option>
              {makes.map((m) => <option key={m.slug} value={m.name}>{m.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1.5 font-heading">
              Year <span className="text-red-500">*</span>
            </label>
            <select value={year} onChange={(e) => setYear(e.target.value)}
              className="w-full h-12 px-4 bg-surface-0 border border-surface-border rounded-xl text-text-primary text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all appearance-none font-heading" required>
              <option value="">Select year</option>
              {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1.5 font-heading">
              Model <span className="text-red-500">*</span>
            </label>
            <select value={model} onChange={(e) => setModel(e.target.value)}
              disabled={!models.length}
              className="w-full h-12 px-4 bg-surface-0 border border-surface-border rounded-xl text-text-primary text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all appearance-none font-heading disabled:opacity-50" required>
              <option value="">{!make || !year ? "Select make & year first" : models.length ? "Select model" : "Loading..."}</option>
              {models.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>
        <button type="submit" disabled={loading || !make || !model || !year}
          className="w-full sm:w-auto px-8 py-3 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-glow hover:-translate-y-px transition-all duration-150 disabled:opacity-50 disabled:hover:translate-y-0 font-heading shadow-sm shadow-primary/20">
          {loading ? "Checking..." : "Check for Recalls"}
        </button>
      </form>

      {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium mb-8">{error}</div>}

      {recalls !== null && (
        <section>
          <h2 className="text-xl font-heading font-bold text-text-primary mb-1">{make} {model} ({year})</h2>
          <p className="text-sm text-text-muted mb-6">{recalls.length} open recall{recalls.length !== 1 ? "s" : ""}</p>

          {recalls.length === 0 ? (
            <div className="text-center py-16 bg-surface-1 rounded-2xl border border-surface-border">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-severity-info-bg border border-severity-info-border flex items-center justify-center">
                <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" width={32} height={32}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-heading font-bold text-text-primary mb-1">No open recalls</h3>
              <p className="text-sm text-text-muted">No safety recalls are listed for this vehicle in the NHTSA database.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recalls.map((r) => (
                <div key={r.NHTSACampaignNumber}
                  className={`bg-surface-1 rounded-2xl border p-5 sm:p-6 ${r.parkIt ? "border-severity-critical-border bg-red-50/30 dark:bg-red-950/10" : r.parkOutSide ? "border-orange-200 dark:border-orange-800 bg-orange-50/30 dark:bg-orange-950/10" : "border-surface-border"}`}>
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-text-muted">{r.NHTSACampaignNumber}</span>
                        {r.parkIt && <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-severity-critical-bg text-severity-critical border border-severity-critical-border font-heading">Park It</span>}
                        {r.parkOutSide && <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800 font-heading">Park Outside</span>}
                        {!r.parkIt && !r.parkOutSide && <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-severity-caution-bg text-severity-caution border border-severity-caution-border font-heading">Recall</span>}
                      </div>
                      <h3 className="text-base font-heading font-bold text-text-primary">{r.Component}</h3>
                    </div>
                    <span className="text-xs text-text-muted font-heading">{r.ReportReceivedDate}</span>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed mb-4">{r.Summary}</p>
                  {r.Consequence && (
                    <div className="mb-3 p-3 bg-red-500/5 border border-red-500/10 rounded-xl">
                      <p className="text-xs font-heading font-bold text-severity-critical uppercase tracking-wider mb-1">Safety Risk</p>
                      <p className="text-sm text-text-secondary leading-relaxed">{r.Consequence}</p>
                    </div>
                  )}
                  <div className="p-3 bg-surface-0 rounded-xl border border-surface-border">
                    <p className="text-xs font-heading font-bold text-text-primary uppercase tracking-wider mb-1">Remedy</p>
                    <p className="text-sm text-text-secondary leading-relaxed">{r.Remedy}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
