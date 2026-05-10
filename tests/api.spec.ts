import { test, expect } from '@playwright/test';

test.describe('API Endpoints', () => {
  test('GET /api/stats returns 200 with JSON', async ({ request }) => {
    const response = await request.get('/api/stats');
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');
    const body = await response.json();
    expect(body).toHaveProperty('totalPosts');
  });

  test('GET /api/stats body has expected keys', async ({ request }) => {
    const response = await request.get('/api/stats');
    expect(response.status()).toBe(200);
    const body = await response.json();
    // Stats should include common metrics
    expect(typeof body.totalPosts).toBe('number');
  });

  test('POST /api/votes without auth returns 401', async ({ request }) => {
    const response = await request.post('/api/votes', {
      data: { postId: 'test-post-123', vote: 1 },
    });
    expect(response.status()).toBe(401);
  });

  test('POST /api/views with postId returns 200', async ({ request }) => {
    const response = await request.post('/api/views', {
      data: { postId: 'any' },
    });
    expect(response.status()).toBe(200);
  });
});
