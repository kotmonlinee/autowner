// NHTSA API client — server-side only
// Free US government API, no key required
// Docs: https://api.nhtsa.gov

const BASE = "https://api.nhtsa.gov";

export interface NhtsaRecall {
  NHTSACampaignNumber: string;
  Manufacturer: string;
  Component: string;
  Summary: string;
  Consequence: string;
  Remedy: string;
  ReportReceivedDate: string;
  parkIt: boolean;
  parkOutSide: boolean;
  overTheAirUpdate: boolean;
  ModelYear: string;
  Make: string;
  Model: string;
}

interface NhtsaResponse {
  Count: number;
  Message: string;
  results: NhtsaRecall[];
}

export interface VehicleMakesResponse {
  Count: number;
  results: { make: string }[];
}

export async function searchRecalls(
  make: string,
  model: string,
  year: string,
): Promise<NhtsaRecall[]> {
  const params = new URLSearchParams({ make, model, modelYear: year });
  const url = `${BASE}/recalls/recallsByVehicle?${params}`;

  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) return [];

  const data: NhtsaResponse = await res.json();
  return data.results ?? [];
}

export async function getVehicleMakes(): Promise<string[]> {
  const url = `${BASE}/products/vehicle/makes?issueType=r`;
  const res = await fetch(url, { next: { revalidate: 86400 } });

  if (!res.ok) return [];

  const data: VehicleMakesResponse = await res.json();
  return (data.results ?? []).map((r) => r.make).sort();
}

export async function getVehicleModels(
  make: string,
  year: string,
): Promise<string[]> {
  const params = new URLSearchParams({ make, modelYear: year });
  const url = `${BASE}/products/vehicle/models?${params}&issueType=r`;
  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) return [];

  const data: { Count: number; results: { model: string }[] } = await res.json();
  return [...new Set((data.results ?? []).map((r) => r.model))].sort();
}
