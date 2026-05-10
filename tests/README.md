# AutOwner Playwright Test Suite

Automated end-to-end tests for [AutOwner](https://www.autowner.com) using Playwright.

## Quick Start

```bash
# Run all tests
npm test

# Run tests with interactive UI
npm run test:ui

# View test report
npm run test:report
```

## Test Structure

```
tests/
  fixtures/
    test-user.ts       # Test credentials (register a real user first)
  homepage.spec.ts     # Homepage loading, navbar, feed, sorting, sidebar, footer
  post-detail.spec.ts  # Post detail page, voting, comments, sharing, breadcrumbs
  auth.spec.ts         # Login/register/reset-password forms and error handling
  auth-protected.spec.ts  # Route guards: /submit, /bookmarks, /settings, /admin
  api.spec.ts          # REST API endpoints (stats, votes, views)
  seo.spec.ts          # robots.txt, sitemap.xml, RSS, about page, 404 page
  interactions.spec.ts # Theme toggle, search, sorting, pagination, cookie consent
```

## Writing New Tests

1. Create a new `.spec.ts` file in `tests/`
2. Import `test` and `expect` from `@playwright/test`:
   ```ts
   import { test, expect } from '@playwright/test';
   ```
3. Use `baseURL` (configured in `playwright.config.ts` as `https://www.autowner.com`) for all page/request URLs.
4. For API-only tests, use the `request` fixture instead of `page`.
5. Run `npx tsc --noEmit` to verify TypeScript compilation before running tests.

## Configuration

- `baseURL`: `https://www.autowner.com` (testing against production)
- `fullyParallel`: `true` (all tests run in parallel)
- `retries`: `0` locally, `2` in CI
- `workers`: `5` locally, `1` in CI
- `timeout`: `60000ms` per test
- `expect.timeout`: `10000ms` per assertion

## CI Setup (GitHub Actions)

Add `.github/workflows/playwright.yml`:

```yaml
name: Playwright Tests
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
jobs:
  test:
    timeout-minutes: 15
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - name: Install dependencies
        run: npm ci
      - name: Install Playwright browsers
        run: npx playwright install chromium --with-deps
      - name: Run tests
        run: npm test
      - name: Upload report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
```

## Notes

- Tests run against production at `https://www.autowner.com`. No local server required.
- The `test-user.ts` fixture contains placeholder credentials. Create a real user account on the site and update the values before running authenticated tests.
- Some tests (pagination) skip gracefully when the expected UI element is not present.
- Page navigation timeouts are set to 45 seconds to accommodate slower network connections.
- In restricted network environments, tests may fail with connection timeouts. Mark affected tests with `test.skip()` and add a note.
