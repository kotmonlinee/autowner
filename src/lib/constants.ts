/** Bump when replacing images in /public/warning-lights/ to bust CDN caches. */
export const IMAGE_CACHE_VERSION = "2";

// ── Vehicle Tier Mapping ─────────────────────────────────

export const MAKE_TIER: Record<string, string> = {
  toyota: "economy", honda: "economy", nissan: "economy", hyundai: "economy",
  kia: "economy", subaru: "economy", mazda: "economy", volkswagen: "mid_range",
  ford: "mid_range", chevrolet: "mid_range", gmc: "truck_suv", dodge: "mid_range",
  jeep: "truck_suv", ram: "truck_suv", chrysler: "mid_range", buick: "mid_range",
  bmw: "european", "mercedes-benz": "european", audi: "european",
  porsche: "european", volvo: "european", "land-rover": "european",
  mini: "european", jaguar: "european",
  cadillac: "luxury", lexus: "luxury", acura: "luxury", infiniti: "luxury",
  lincoln: "luxury", genesis: "luxury",
  tesla: "luxury", rivian: "truck_suv", lucid: "luxury",
};

export const TIER_LABELS: Record<string, string> = {
  economy: "Economy",
  mid_range: "Mid-Range",
  luxury: "Luxury",
  truck_suv: "Truck/SUV",
  european: "European",
};

export function formatMoney(n: number): string {
  return `$${n.toLocaleString("en-US")}`;
}
