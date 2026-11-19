import { test, expect } from '@playwright/test';

test.describe('SEO and Static Pages', () => {
  test('/robots.txt returns 200 with Allow text', async ({ request }) => {
    const response = await request.get('/robots.txt');
    expect(response.status()).toBe(200);
    const text = await response.text();
    expect(text).toContain('Allow');
  });

  test('/sitemap.xml returns 200 with application/xml content-type', async ({ request }) => {
    const response = await request.get('/sitemap.xml');
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/xml');
    const xml = await response.text();
    expect(xml.match(/<lastmod>/g)?.length).toBe(7);
  });

  test('search pages are not indexable or listed in sitemaps', async ({ request }) => {
    const searchResponse = await request.get('/search');
    expect(await searchResponse.text()).toContain('name="robots" content="noindex, follow"');

    const sitemapResponse = await request.get('/sitemap/0');
    expect(await sitemapResponse.text()).not.toContain('https://www.autowner.com/search</loc>');
  });

  test('symptom-checker pagination is not indexable', async ({ request }) => {
    const response = await request.get('/symptom-checker?page=2');
    expect(await response.text()).toContain('name="robots" content="noindex, follow"');
  });

  test('quote checker renders its H1 in the initial HTML', async ({ request }) => {
    const response = await request.get('/quote-checker');
    const html = await response.text();
    expect(html.match(/<h1\b/g)?.length).toBe(1);
    expect(html).toContain("Check If a Mechanic&#x27;s Repair Quote Is Fair");
  });

  test('diagnosis titles use one brand suffix and include vehicle context', async ({ request }) => {
    const response = await request.get('/symptom-checker/unusual-noise-or-sound-from-the-wheels-or-brakes-while-driving-ford-mustang-2020');
    const html = await response.text();
    const title = html.match(/<title>([^<]+)<\/title>/)?.[1] ?? '';
    expect(title).toMatch(/Ford|vehicle/i);
    expect(title.match(/AutOwner/g)?.length ?? 0).toBe(1);
    expect(title.length).toBeLessThanOrEqual(60);
  });

  test('/rss.xml returns 200 with XML content', async ({ request }) => {
    const response = await request.get('/rss.xml');
    expect(response.status()).toBe(200);
    const text = await response.text();
    expect(text).toContain('<rss');
  });

  test('/about returns 200 with About AutOwner text', async ({ page }) => {
    const response = await page.goto('/about');
    expect(response?.status()).toBe(200);
    await expect(page.locator('body')).toContainText('AutOwner');
  });

  test('/nonexistent-page returns 404', async ({ page }) => {
    const response = await page.goto('/nonexistent-page');
    // Next.js returns 404 status for not-found pages
    expect(response?.status()).toBe(404);
  });
});
