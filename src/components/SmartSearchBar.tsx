"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const OBD_CODE_RE = /^[PCBU]\d{4}$/i;
const QUOTE_KEYWORDS = ["$", "quote", "quoted", "estimate"];
const REPAIR_KEYWORDS = [
  "brake", "brakes",
  "oil",
  "engine",
  "transmission", "trans",
  "ac", "air conditioning",
  "alternator",
  "battery",
  "starter",
  "radiator",
  "water pump",
  "timing belt",
  "head gasket",
  "muffler", "exhaust",
  "catalytic converter",
  "spark plug",
  "fuel pump",
  "struts", "shocks",
  "ball joint",
  "tie rod",
  "wheel bearing",
  "clutch",
  "differential",
  "power steering",
  "compressor",
  "evaporator",
  "heater core",
  "thermostat",
  "serpentine belt",
  "ignition coil",
  "oxygen sensor", "o2 sensor",
  "mass air flow", "maf sensor",
  "egr valve",
  "pcv valve",
  "crankshaft", "camshaft",
  "cv joint", "cv axle",
  "control arm",
  "sway bar",
  "rack and pinion",
  "fuel filter",
  "cabin filter",
  "air filter",
  "tires", "tire",
  "alignment",
  "overheating", "overheat",
];

function matchesOBDCode(input: string): boolean {
  return OBD_CODE_RE.test(input.trim());
}

function containsQuoteKeyword(input: string): boolean {
  const lower = input.toLowerCase();
  return QUOTE_KEYWORDS.some((kw) => lower.includes(kw));
}

function containsRepairKeyword(input: string): boolean {
  const lower = input.toLowerCase();
  return REPAIR_KEYWORDS.some((kw) => lower.includes(kw));
}

export default function SmartSearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    if (matchesOBDCode(trimmed)) {
      router.push(`/obd/${trimmed.toLowerCase()}`);
    } else if (containsQuoteKeyword(trimmed)) {
      router.push("/quote-checker");
    } else if (containsRepairKeyword(trimmed)) {
      router.push(`/repair-cost?q=${encodeURIComponent(trimmed)}`);
    } else {
      router.push(`/community?q=${encodeURIComponent(trimmed)}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-10 max-w-2xl mx-auto flex gap-3"
      role="search"
    >
      <div className="relative flex-1">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          name="search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your repair issue or quote..."
          aria-label="Search repair issues, quotes, or OBD codes"
          className="w-full h-14 pl-12 pr-5 bg-surface-1 border border-surface-border rounded-xl text-text-primary placeholder:text-text-muted text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
        />
      </div>
      <button
        type="submit"
        className="h-14 px-8 bg-primary text-white font-semibold font-heading rounded-xl hover:bg-primary-glow hover:-translate-y-px transition-all duration-150 shadow-sm shadow-primary/25 text-base shrink-0"
      >
        Check Now
      </button>
    </form>
  );
}
