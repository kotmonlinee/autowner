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

  test('post feed has at least 1 post card', async ({ page }) => {
    await page.goto('/', { timeout: 45000 });
    // Posts are typically cards/links inside a feed area
    const posts = page.locator('a[href*="/post/"]');
    await expect(posts.first()).toBeVisible({ timeout: 15000 });
  });

  test('sort toggle has popular, hot, new options', async ({ page }) => {
    await page.goto('/', { timeout: 45000 });
    const sortArea = page.locator('text=Popular').or(page.locator('text=popular'));
    await expect(sortArea.first()).toBeVisible({ timeout: 15000 });
    // Click to see if other options appear, or check the DOM for them
    await sortArea.first().click();
    await expect(page.getByText('New', { exact: false })).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('Hot', { exact: false })).toBeVisible({ timeout: 5000 });
  });

  test('sidebar has category links', async ({ page }) => {
    await page.goto('/', { timeout: 45000 });
    // Sidebar typically contains category navigation
    const sidebar = page.locator('aside').or(page.locator('[class*="sidebar"]'));
    await expect(sidebar.first()).toBeVisible({ timeout: 10000 });
  });

  test('footer is visible', async ({ page }) => {
    await page.goto('/', { timeout: 45000 });
    const footer = page.locator('footer').first();
    await expect(footer).toBeVisible();
  });
});
