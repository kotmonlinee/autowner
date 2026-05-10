import { test, expect } from '@playwright/test';

test.describe('Authentication Pages', () => {
  test('login page loads', async ({ page }) => {
    const response = await page.goto('/auth/login', { timeout: 45000 });
    expect(response?.status()).toBe(200);
  });

  test('login form has email and password fields', async ({ page }) => {
    await page.goto('/auth/login', { timeout: 45000 });
    const emailInput = page.locator('input[type="email"]').or(page.locator('input[name="email"]'));
    const passwordInput = page.locator('input[type="password"]').or(page.locator('input[name="password"]'));
    await expect(emailInput.first()).toBeVisible({ timeout: 10000 });
    await expect(passwordInput.first()).toBeVisible({ timeout: 10000 });
  });

  test('register page loads', async ({ page }) => {
    const response = await page.goto('/auth/register', { timeout: 45000 });
    expect(response?.status()).toBe(200);
  });

  test('register form has username, email, password fields', async ({ page }) => {
    await page.goto('/auth/register', { timeout: 45000 });
    // Register form uses type="text" for username (no name attribute)
    const usernameInput = page.locator('input[type="text"]')
      .or(page.locator('input[name="username"]'))
      .or(page.locator('input[placeholder*="gearhead" i]'))
      .or(page.locator('input[id*="username" i]'));
    const emailInput = page.locator('input[type="email"]').or(page.locator('input[name="email"]'));
    const passwordInput = page.locator('input[type="password"]').or(page.locator('input[name="password"]'));
    await expect(usernameInput.first()).toBeVisible({ timeout: 10000 });
    await expect(emailInput.first()).toBeVisible({ timeout: 10000 });
    await expect(passwordInput.first()).toBeVisible({ timeout: 10000 });
  });

  test('forgot password page loads', async ({ page }) => {
    const response = await page.goto('/auth/reset-password', { timeout: 45000 });
    expect(response?.status()).toBe(200);
  });

  test('submit invalid login shows error message', async ({ page }) => {
    await page.goto('/auth/login', { timeout: 45000 });
    // Fill in bad credentials
    const emailInput = page.locator('input[type="email"]').or(page.locator('input[name="email"]'));
    const passwordInput = page.locator('input[type="password"]').or(page.locator('input[name="password"]'));
    await emailInput.first().fill('invalid@nonexistent.com');
    await passwordInput.first().fill('wrongpassword');

    // Click the submit button
    const submitButton = page.locator('button[type="submit"]').first();
    await submitButton.click();

    // Should see some error message
    const errorMessage = page.locator('[class*="error"]')
      .or(page.locator('[class*="Error"]'))
      .or(page.locator('text=/invalid/i'))
      .or(page.locator('text=/wrong/i'))
      .or(page.locator('text=/error/i'));
    await expect(errorMessage.first()).toBeVisible({ timeout: 10000 });
  });
});
