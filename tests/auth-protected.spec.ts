import { test, expect } from '@playwright/test';

test.describe('Auth-Protected Routes', () => {
  test('/submit redirects to /auth/login', async ({ page }) => {
    await page.goto('/submit', { timeout: 45000 });
    await page.waitForURL('**/auth/login**', { timeout: 10000 });
    expect(page.url()).toContain('/auth/login');
  });

  test('/bookmarks redirects to /auth/login', async ({ page }) => {
    await page.goto('/bookmarks', { timeout: 45000 });
    await page.waitForURL('**/auth/login**', { timeout: 10000 });
    expect(page.url()).toContain('/auth/login');
  });

  test('/settings redirects to /auth/login', async ({ page }) => {
    await page.goto('/settings', { timeout: 45000 });
    await page.waitForURL('**/auth/login**', { timeout: 10000 });
    expect(page.url()).toContain('/auth/login');
  });

  test('/admin redirects to /auth/login', async ({ page }) => {
    await page.goto('/admin', { timeout: 45000 });
    await page.waitForURL('**/auth/login**', { timeout: 10000 });
    expect(page.url()).toContain('/auth/login');
  });
});
