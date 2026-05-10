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
