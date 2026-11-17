#!/usr/bin/env node
/**
 * Submit URLs to IndexNow (Bing, Yandex and other participating engines).
 *
 * Usage:
 *   node scripts/submit-indexnow.mjs                 # hub pages + tools
 *   node scripts/submit-indexnow.mjs /obd/p0420 ...  # specific paths or URLs
 *   node scripts/submit-indexnow.mjs --from-sitemap --limit 5000
 *
 * IndexNow accepts at most 10,000 URLs per request; this script batches.
 */
import { readFileSync } from "node:fs";

const HOST = "www.autowner.com";
const ORIGIN = `https://${HOST}`;
const KEY = readFileSync(
  new URL("../public/5959da12ee2be00a4662a8e87f5957f2.txt", import.meta.url),
  "utf8",
).trim();

const DEFAULT_URLS = [
  "/",
  "/obd",
  "/obd/severity-levels",
  "/repair-cost",
  "/repair-cost/diy-levels",
  "/symptoms",
  "/symptom-checker",
  "/warning-lights",
  "/vehicles",
  "/recall-check",
  "/quote-checker",
  "/about",
  "/contact",
];

async function sitemapUrls(limit) {
  const indexXml = await (await fetch(`${ORIGIN}/sitemap.xml`)).text();
  const shards = [...indexXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const urls = [];

  for (const shard of shards) {
    const xml = await (await fetch(shard)).text();
    for (const match of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      urls.push(match[1]);
      if (urls.length >= limit) return urls;
    }
  }
  return urls;
}

async function submit(urls) {
  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: HOST,
      key: KEY,
      keyLocation: `${ORIGIN}/${KEY}.txt`,
      urlList: urls,
    }),
  });

  console.log(`submitted ${urls.length} URL(s) → HTTP ${res.status}`);
  if (!res.ok) console.error((await res.text()).slice(0, 500));
  return res.ok;
}

const args = process.argv.slice(2);
let urls;

if (args.includes("--from-sitemap")) {
  const limitIndex = args.indexOf("--limit");
  const limit = limitIndex >= 0 ? parseInt(args[limitIndex + 1], 10) : 5000;
  urls = await sitemapUrls(Number.isFinite(limit) ? limit : 5000);
} else if (args.length > 0) {
  urls = args.map((url) => (url.startsWith("http") ? url : `${ORIGIN}${url}`));
} else {
  urls = DEFAULT_URLS.map((path) => `${ORIGIN}${path}`);
}

for (let i = 0; i < urls.length; i += 10000) {
  await submit(urls.slice(i, i + 10000));
}
