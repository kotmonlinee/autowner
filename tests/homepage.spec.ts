import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('page loads with status 200', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);
  });

  test('title contains AutOwner', async ({ page }) => {
    await page.goto('/', { timeout: 45000 });
    await expect(page).toHaveTitle(/AutOwner/);
  });

  test('navbar is visible with AutOwner branding', async ({ page }) => {
    await page.goto('/', { timeout: 45000 });
    const navbar = page.locator('nav').first();
    await expect(navbar).toBeVisible();
    await expect(navbar).toContainText('AutOwner');
  });

  test('primary diagnosis tools are visible', async ({ page }) => {
    await page.goto('/', { timeout: 45000 });

    await expect(page.locator('a[href="/repair-cost"]').first()).toBeVisible({ timeout: 15000 });
    await expect(page.locator('a[href="/quote-checker"]').first()).toBeVisible({ timeout: 15000 });
    await expect(page.locator('a[href="/obd"]').first()).toBeVisible({ timeout: 15000 });
    await expect(page.locator('a[href="/warning-lights"]').first()).toBeVisible({ timeout: 15000 });

    await expect(page.getByRole('heading', { name: 'The shortest route to a useful answer.' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Decode a fault code.' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Know the real range.' })).toBeVisible();
  });

  test('homepage renders one crawlable H1 and contextual symptom links', async ({ request }) => {
    const response = await request.get('/');
    const html = await response.text();
    expect(html.match(/<h1\b/g)?.length).toBe(1);
    expect(html).toContain('What&#x27;s wrong with your car?');
    expect(html).toContain('href="/symptoms/car-wont-start"');
    expect(html).toContain('rel="canonical" href="https://www.autowner.com"');
  });

  test('footer is visible', async ({ page }) => {
    await page.goto('/', { timeout: 45000 });
    const footer = page.locator('footer').first();
    await expect(footer).toBeVisible();
  });
});
