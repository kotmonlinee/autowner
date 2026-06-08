import { createServiceSupabase } from "@/lib/supabase-server";
import { urlEntry, wrapUrlset, xmlResponse, BASE_URL } from "@/lib/sitemap-utils";

export const revalidate = 3600;

export async function GET() {
  const now = new Date().toISOString();
  const supabase = await createServiceSupabase();
  const urls: string[] = [];
  const BATCH = 1000;
  let offset = 0;

  while (true) {
    const { data } = await supabase.from("diagnoses")
      .select("slug, created_at")
      .order("created_at", { ascending: false })
      .range(offset, offset + BATCH - 1);
    if (!data || data.length === 0) break;
    for (const d of data) {
      urls.push(urlEntry(`${BASE_URL}/symptom-checker/${d.slug}`, d.created_at ?? now, "monthly", 0.6));
    }
    if (data.length < BATCH) break;
    offset += BATCH;
  }

  return xmlResponse(wrapUrlset(urls));
}
