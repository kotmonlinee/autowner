"use client";

import { useState, useEffect } from "react";
import { fetchVehicleMakes } from "@/lib/data/browser";
import type { NhtsaRecall } from "@/lib/nhtsa";

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: CURRENT_YEAR - 1991 }, (_, i) => String(CURRENT_YEAR - i));

export default function RecallChecker() {
  const [makes, setMakes] = useState<{ name: string; slug: string }[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [recalls, setRecalls] = useState<NhtsaRecall[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchVehicleMakes().then((data) => setMakes(data));
  }, []);

  useEffect(() => {
    if (!selectedMake || !selectedYear) { setModels([]); return; }
    setSelectedModel("");
    fetch(`/api/recalls?action=models&make=${encodeURIComponent(selectedMake)}&year=${selectedYear}`)
      .then((r) => r.json())
      .then((d) => { if (d.models) setModels(d.models); })
      .catch(() => {});
  }, [selectedMake, selectedYear]);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedMake || !selectedModel || !selectedYear) return;
    setLoading(true);
    setError("");
    setRecalls(null);
    try {
      const res = await fetch(
        `/api/recalls?action=search&make=${encodeURIComponent(selectedMake)}&model=${encodeURIComponent(selectedModel)}&year=${selectedYear}`,
      );
      const data = await res.json();
      if (data.error) { setError(data.error); return; }
      setRecalls(data.recalls ?? []);
    } catch {
      setError("Failed to load recall data. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const hasSelection = selectedMake && selectedModel && selectedYear;

  return (
    <div>
      <form onSubmit={handleSearch} className="bg-surface-1 rounded-2xl border border-surface-border p-6 sm:p-8 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1.5 font-heading">
              Make <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedMake}
              onChange={(e) => setSelectedMake(e.target.value)}
              className="w-full h-12 px-4 bg-surface-0 border border-surface-border rounded-xl text-text-primary text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all appearance-none font-heading"
              required
            >
              <option value="">Select make</option>
              {makes.map((m) => (
                <option key={m.slug} value={m.name}>{m.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1.5 font-heading">
              Year <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full h-12 px-4 bg-surface-0 border border-surface-border rounded-xl text-text-primary text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all appearance-none font-heading"
              required
            >
              <option value="">Select year</option>
              {YEARS.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1.5 font-heading">
              Model <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              disabled={!models.length}
              className="w-full h-12 px-4 bg-surface-0 border border-surface-border rounded-xl text-text-primary text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all appearance-none font-heading disabled:opacity-50"
              required
            >
              <option value="">{!selectedMake || !selectedYear ? "Select make & year first" : models.length ? "Select model" : "Loading models..."}</option>
              {models.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !hasSelection}
          className="w-full sm:w-auto px-8 py-3 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-glow hover:-translate-y-px transition-all duration-150 disabled:opacity-50 disabled:hover:translate-y-0 font-heading shadow-sm shadow-primary/20"
        >
          {loading ? "Checking..." : "Check for Recalls"}
        </button>
      </form>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium mb-8">
          {error}
        </div>
      )}

      {recalls !== null && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-heading font-bold text-text-primary">
                {selectedMake} {selectedModel} ({selectedYear})
              </h2>
              <p className="text-sm text-text-muted">
                {recalls.length} open recall{recalls.length !== 1 ? "s" : ""} found
              </p>
            </div>
          </div>

          {recalls.length === 0 ? (
            <div className="text-center py-16 bg-surface-1 rounded-2xl border border-surface-border">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center">
                <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-heading font-bold text-text-primary mb-1">No open recalls found</h3>
              <p className="text-sm text-text-muted max-w-md mx-auto">
                Great news! No safety recalls are currently listed for this vehicle in the NHTSA database.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recalls.map((recall) => (
                <div
                  key={recall.NHTSACampaignNumber}
                  className={`bg-surface-1 rounded-2xl border p-5 sm:p-6 ${
                    recall.parkIt ? "border-red-200 dark:border-red-800 bg-red-50/30 dark:bg-red-950/10"
                    : recall.parkOutSide ? "border-orange-200 dark:border-orange-800 bg-orange-50/30 dark:bg-orange-950/10"
                    : "border-surface-border"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-xs font-mono text-text-muted">{recall.NHTSACampaignNumber}</span>
                        {recall.parkIt && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 font-heading">Park It</span>
                        )}
                        {recall.parkOutSide && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800 font-heading">Park Outside</span>
                        )}
                        {!recall.parkIt && !recall.parkOutSide && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-heading">Recall</span>
                        )}
                      </div>
                      <h3 className="text-base font-heading font-bold text-text-primary">{recall.Component}</h3>
                    </div>
                    <span className="text-xs text-text-muted whitespace-nowrap font-heading">{recall.ReportReceivedDate}</span>
                  </div>

                  <p className="text-sm text-text-secondary leading-relaxed mb-4">{recall.Summary}</p>

                  {recall.Consequence && (
                    <div className="mb-3 p-3 bg-red-500/5 border border-red-500/10 rounded-xl">
                      <p className="text-xs font-heading font-bold text-red-600 dark:text-red-400 uppercase tracking-wider mb-1">Safety Risk</p>
                      <p className="text-sm text-text-secondary leading-relaxed">{recall.Consequence}</p>
                    </div>
                  )}

                  <div className="p-3 bg-surface-0 rounded-xl border border-surface-border">
                    <p className="text-xs font-heading font-bold text-text-primary uppercase tracking-wider mb-1">Remedy</p>
                    <p className="text-sm text-text-secondary leading-relaxed">{recall.Remedy}</p>
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
