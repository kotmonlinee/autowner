import { getCategories } from "@/lib/data/server";
import { warningLights } from "@/lib/warning-lights-data";
import { urlEntry, wrapUrlset, xmlResponse, BASE_URL } from "@/lib/sitemap-utils";

export const revalidate = 3600;

export async function GET() {
  const now = new Date().toISOString();
  const categories = await getCategories();
  const urls: string[] = [];

  // Static pages
  urls.push(urlEntry(BASE_URL, now, "hourly", 1.0));
  urls.push(urlEntry(`${BASE_URL}/community`, now, "hourly", 0.9));
  urls.push(urlEntry(`${BASE_URL}/about`, now, "monthly", 0.4));
  urls.push(urlEntry(`${BASE_URL}/privacy`, now, "yearly", 0.1));
  urls.push(urlEntry(`${BASE_URL}/terms`, now, "yearly", 0.1));
  urls.push(urlEntry(`${BASE_URL}/contact`, now, "yearly", 0.4));
  urls.push(urlEntry(`${BASE_URL}/search`, now, "weekly", 0.4));

  // Tool landing pages
  urls.push(urlEntry(`${BASE_URL}/repair-cost`, now, "weekly", 0.9));
  urls.push(urlEntry(`${BASE_URL}/obd`, now, "weekly", 0.8));
  urls.push(urlEntry(`${BASE_URL}/quote-checker`, now, "weekly", 0.8));
  urls.push(urlEntry(`${BASE_URL}/warning-lights`, now, "weekly", 0.9));
  urls.push(urlEntry(`${BASE_URL}/symptom-checker`, now, "weekly", 0.9));
  urls.push(urlEntry(`${BASE_URL}/recall-check`, now, "weekly", 0.8));

  // Category pages
  for (const cat of categories) {
    urls.push(urlEntry(`${BASE_URL}/?category=${cat.slug}`, now, "daily", 0.7));
  }

  // Warning light detail pages
  for (const l of warningLights) {
    urls.push(urlEntry(`${BASE_URL}/warning-lights/${l.slug}`, now, "monthly", 0.7));
  }

  return xmlResponse(wrapUrlset(urls));
}
