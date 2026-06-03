// Vehicle images hosted locally in public/vehicles/
// Map: `${makeSlug}/${modelSlug}` → local path

const IMAGES: Record<string, string> = {
  "toyota/camry": "/vehicles/toyota-camry.jpg",
  "toyota/corolla": "/vehicles/toyota-corolla.jpg",
  "toyota/rav4": "/vehicles/toyota-rav4.jpg",
  "toyota/tacoma": "/vehicles/toyota-tacoma.jpg",
  "toyota/highlander": "/vehicles/toyota-highlander.jpg",
  "honda/civic": "/vehicles/honda-civic.jpg",
  "honda/accord": "/vehicles/honda-accord.jpg",
  "honda/cr-v": "/vehicles/honda-cr-v.jpg",
  "ford/f-150": "/vehicles/ford-f-150.jpg",
  "ford/mustang": "/vehicles/ford-mustang.jpg",
  "ford/explorer": "/vehicles/ford-explorer.jpg",
  "chevrolet/silverado-1500": "/vehicles/chevrolet-silverado-1500.jpg",
  "bmw/3-series": "/vehicles/bmw-3-series.jpg",
  "jeep/wrangler": "/vehicles/jeep-wrangler.jpg",
  "jeep/grand-cherokee": "/vehicles/jeep-grand-cherokee.jpg",
  "tesla/model-3": "/vehicles/tesla-model-3.jpg",
  "tesla/model-y": "/vehicles/tesla-model-y.jpg",
  "nissan/altima": "/vehicles/nissan-altima.jpg",
  "hyundai/elantra": "/vehicles/hyundai-elantra.jpg",
  "dodge/charger": "/vehicles/dodge-charger.jpg",
  "subaru/outback": "/vehicles/subaru-outback.jpg",
};

export function getVehicleImageUrl(makeSlug: string, modelSlug: string): string | null {
  return IMAGES[`${makeSlug}/${modelSlug}`] ?? null;
}
