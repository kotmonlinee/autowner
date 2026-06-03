// Vehicle images from Unsplash (free, no attribution required per Unsplash license)
// Direct CDN URLs — no API calls, always available globally via Cloudflare

export const VEHICLE_IMAGES: Record<string, string> = {
  // Toyota
  "toyota/camry": "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600&h=400&fit=crop&auto=format",
  "toyota/corolla": "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=600&h=400&fit=crop&auto=format",
  "toyota/rav4": "https://images.unsplash.com/photo-1568844293986-ca4c5d38e4c0?w=600&h=400&fit=crop&auto=format",
  "toyota/tacoma": "https://images.unsplash.com/photo-1612544448445-b8232cff3b6c?w=600&h=400&fit=crop&auto=format",
  "toyota/highlander": "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&h=400&fit=crop&auto=format",
  "toyota/4runner": "https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=600&h=400&fit=crop&auto=format",

  // Honda
  "honda/civic": "https://images.unsplash.com/photo-1606611013016-969c19ba27b8?w=600&h=400&fit=crop&auto=format",
  "honda/accord": "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&h=400&fit=crop&auto=format",
  "honda/cr-v": "https://images.unsplash.com/photo-1563720223185-1103d51638ae?w=600&h=400&fit=crop&auto=format",

  // Ford
  "ford/f-150": "https://images.unsplash.com/photo-1583267746897-2cf415887172?w=600&h=400&fit=crop&auto=format",
  "ford/mustang": "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?w=600&h=400&fit=crop&auto=format",
  "ford/explorer": "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&h=400&fit=crop&auto=format",

  // BMW
  "bmw/3-series": "https://images.unsplash.com/photo-1556189250-72ba954cfc2b?w=600&h=400&fit=crop&auto=format",
  "bmw/x3": "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&h=400&fit=crop&auto=format",

  // Chevrolet
  "chevrolet/silverado-1500": "https://images.unsplash.com/photo-1605559424843-9e4c935ceb39?w=600&h=400&fit=crop&auto=format",
  "chevrolet/equinox": "https://images.unsplash.com/photo-1612544448445-b8232cff3b6c?w=600&h=400&fit=crop&auto=format",

  // Jeep
  "jeep/wrangler": "https://images.unsplash.com/photo-1536599018102-9c8033a38b14?w=600&h=400&fit=crop&auto=format",
  "jeep/grand-cherokee": "https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=600&h=400&fit=crop&auto=format",

  // Tesla
  "tesla/model-3": "https://images.unsplash.com/photo-1560958089-b8792e07f4d5?w=600&h=400&fit=crop&auto=format",
  "tesla/model-y": "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=600&h=400&fit=crop&auto=format",
};

export function getVehicleImageUrl(makeSlug: string, modelSlug: string): string | null {
  return VEHICLE_IMAGES[`${makeSlug}/${modelSlug}`] ?? null;
}
