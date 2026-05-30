// Import vehicle makes & models from GitHub json-car-list
// Run: npx tsx scripts/import-vehicles.ts

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const CDN_URL = "https://cdn.jsdelivr.net/gh/getFrontend/json-car-list@main/car-list.json";

const BRAND_SLUGS: Record<string, string> = {
  "acura": "acura", "alfa romeo": "alfa-romeo", "audi": "audi",
  "bmw": "bmw", "buick": "buick", "cadillac": "cadillac",
  "chevrolet": "chevrolet", "chrysler": "chrysler", "dodge": "dodge",
  "ford": "ford", "genesis": "genesis", "gmc": "gmc",
  "honda": "honda", "hyundai": "hyundai", "infiniti": "infiniti",
  "jaguar": "jaguar", "jeep": "jeep", "kia": "kia",
  "land rover": "land-rover", "lexus": "lexus", "mazda": "mazda",
  "mercedes-benz": "mercedes-benz", "mini": "mini", "mitsubishi": "mitsubishi",
  "nissan": "nissan", "porsche": "porsche", "ram": "ram", "ram trucks": "ram",
  "subaru": "subaru", "tesla": "tesla", "toyota": "toyota",
  "volkswagen": "volkswagen", "volvo": "volvo",
  "bentley": "bentley", "ferrari": "ferrari", "lamborghini": "lamborghini",
  "maserati": "maserati", "rolls-royce": "rolls-royce", "aston martin": "aston-martin",
  "lincoln": "lincoln", "rivian": "rivian", "lucid": "lucid",
  "polestar": "polestar", "bugatti": "bugatti", "fisker": "fisker",
  "lotus": "lotus", "mclaren": "mclaren", "scion": "scion",
  "hummer": "hummer", "saab": "saab", "suzuki": "suzuki",
  "daewoo": "daewoo", "daihatsu": "daihatsu", "fiat": "fiat",
  "peugeot": "peugeot", "citroën": "citroen", "citroen": "citroen",
  "opel": "opel", "renault": "renault", "dacia": "dacia",
  "seat": "seat", "skoda": "skoda", "cupra": "cupra",
  "alpine": "alpine", "abarth": "abarth", "lancia": "lancia",
  "smart": "smart", "maybach": "maybach", "pagani": "pagani",
  "koenigsegg": "koenigsegg", "shelby": "shelby",
  "byd": "byd", "nio": "nio",
  "mg": "mg", "rover": "rover", "triumph": "triumph",
  "isuzu": "isuzu", "ssangyong": "ssangyong",
  "ineos": "ineos", "vinfast": "vinfast",
};

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

async function main() {
  console.log("Fetching car list from CDN...");
  const res = await fetch(CDN_URL);
  const data: { brand: string; models: string[] }[] = await res.json();
  console.log(`Got ${data.length} brands`);

  const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

  let totalMakes = 0;
  let totalModels = 0;

  for (const entry of data) {
    const brandName = entry.brand;
    const brandLower = brandName.toLowerCase();
    if (!BRAND_SLUGS[brandLower]) continue;

    const slug = BRAND_SLUGS[brandLower];

    // Upsert make
    const { data: makeData, error: makeError } = await supabase
      .from("vehicle_makes")
      .upsert({ name: brandName, slug }, { onConflict: "slug" })
      .select("id")
      .single();

    if (makeError) {
      console.error(`Failed to upsert make ${brandName}:`, makeError.message);
      continue;
    }

    totalMakes++;
    const makeId = (makeData as { id: string }).id;

    // Prepare model inserts
    const modelRows = entry.models.map((model) => ({
      make_id: makeId,
      name: model,
      slug: slugify(model),
    }));

    // Batch upsert models for this make
    const { error: modelError } = await supabase
      .from("vehicle_models")
      .upsert(modelRows, { onConflict: "make_id, slug", ignoreDuplicates: true });

    if (modelError) {
      console.error(`Failed to insert models for ${brandName}:`, modelError.message);
    } else {
      const count = entry.models.length;
      totalModels += count;
      console.log(`  ${brandName}: ${count} models`);
    }
  }

  console.log(`\nDone. ${totalMakes} makes, ${totalModels} models imported.`);
}

main().catch(console.error);
