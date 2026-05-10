import { test, expect } from '@playwright/test';

test.describe('Post Detail Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to homepage first to find a post link
    await page.goto('/', { timeout: 45000 });
  });

  test('navigate to first post and verify detail page loads', async ({ page }) => {
    // Find the first post link
    const firstPost = page.locator('a[href*="/post/"]').first();
    await expect(firstPost).toBeVisible({ timeout: 15000 });
    const postHref = await firstPost.getAttribute('href');
    expect(postHref).toBeTruthy();

    // Navigate to the post
    await firstPost.click();
    await page.waitForLoadState('domcontentloaded');

    // Post detail page should have a title/heading
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible({ timeout: 10000 });
  });

  test('vote buttons are visible', async ({ page }) => {
    const firstPost = page.locator('a[href*="/post/"]').first();
    await expect(firstPost).toBeVisible({ timeout: 15000 });
    await firstPost.click();
    await page.waitForLoadState('domcontentloaded');

    // Vote buttons — often upvote/downvote
    const voteButton = page.locator('[aria-label*="vote" i]')
      .or(page.locator('[aria-label*="upvote" i]'))
      .or(page.locator('button:has-text("▲")'))
      .or(page.locator('button:has-text("▼")'));
    await expect(voteButton.first()).toBeVisible({ timeout: 10000 });
  });

  test('comment section is present', async ({ page }) => {
    const firstPost = page.locator('a[href*="/post/"]').first();
    await expect(firstPost).toBeVisible({ timeout: 15000 });
    await firstPost.click();
    await page.waitForLoadState('domcontentloaded');

    // Comment section — look for comment-related elements
    const commentSection = page.locator('text=/comments/i')
      .or(page.locator('[class*="comment"]'))
      .or(page.locator('form textarea'));
    // At least one of these should be visible
    await expect(commentSection.first()).toBeVisible({ timeout: 10000 });
  });

  test('share buttons are visible', async ({ page }) => {
    const firstPost = page.locator('a[href*="/post/"]').first();
    await expect(firstPost).toBeVisible({ timeout: 15000 });
    await firstPost.click();
    await page.waitForLoadState('domcontentloaded');

    // Share buttons or share section
    const shareButton = page.locator('text=/share/i')
      .or(page.locator('[aria-label*="share" i]'));
    await expect(shareButton.first()).toBeVisible({ timeout: 10000 });
  });

  test('breadcrumb navigation works', async ({ page }) => {
    const firstPost = page.locator('a[href*="/post/"]').first();
    await expect(firstPost).toBeVisible({ timeout: 15000 });
    await firstPost.click();
    await page.waitForLoadState('domcontentloaded');

    // Breadcrumbs often use nav with aria-label or have links preceding the main content
    const breadcrumb = page.locator('nav[aria-label*="breadcrumb" i]')
      .or(page.locator('[class*="breadcrumb"]'))
      .or(page.locator('nav a[href="/"]'));
    await expect(breadcrumb.first()).toBeVisible({ timeout: 10000 });
  });
});
