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

  test('navbar is visible with AUTOWNER text', async ({ page }) => {
    await page.goto('/', { timeout: 45000 });
    const navbar = page.locator('nav').first();
    await expect(navbar).toBeVisible();
    await expect(navbar).toContainText('AUTOWNER');
  });

  test('tool cards are visible', async ({ page }) => {
    await page.goto('/', { timeout: 45000 });

    // All 4 tool card links should be visible
    await expect(page.locator('a[href="/repair-cost"]').first()).toBeVisible({ timeout: 15000 });
    await expect(page.locator('a[href="/quote-checker"]').first()).toBeVisible({ timeout: 15000 });
    await expect(page.locator('a[href="/obd"]').first()).toBeVisible({ timeout: 15000 });
    await expect(page.locator('a[href="/warning-lights"]').first()).toBeVisible({ timeout: 15000 });

    // Verify the tool card headings (h3 elements inside the tools section) are present
    await expect(page.getByRole('heading', { name: 'Repair Cost Estimator' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Quote Checker' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'OBD Codes' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Warning Lights' })).toBeVisible();
  });

  test('community section is visible', async ({ page }) => {
    await page.goto('/', { timeout: 45000 });

    // "Popular Discussions" heading should be visible
    await expect(page.getByText('Popular Discussions')).toBeVisible({ timeout: 15000 });

    // There should be links to post detail pages in the community section
    const postLinks = page.locator('a[href*="/post/"]');
    await expect(postLinks.first()).toBeVisible({ timeout: 15000 });
  });

  test('footer is visible', async ({ page }) => {
    await page.goto('/', { timeout: 45000 });
    const footer = page.locator('footer').first();
    await expect(footer).toBeVisible();
  });
});
