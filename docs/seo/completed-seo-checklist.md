# AutOwner SEO Completion Checklist

## Completed

- [x] **Dynamic sitemap.xml** -- `/src/app/sitemap.xml/route.ts` generates a live sitemap from all approved posts and categories, including lastmod dates.
- [x] **Robots.txt** -- `/src/app/robots.txt/route.ts` serves a dynamic robots.txt pointing to the sitemap.
- [x] **Open Graph / Twitter Card metadata** -- Every post page renders full OG tags (`og:title`, `og:description`, `og:image`, `og:url`, `og:type`) and Twitter Card tags (`twitter:card`, `twitter:title`, etc.) for rich link previews on social media.
- [x] **Structured data (JSON-LD)** -- Post pages include `Article`, `BreadcrumbList`, and `FAQ` (where applicable) schema.org structured data for rich results in Google Search.
- [x] **Full-text search (Postgres tsvector)** -- Posts table has a `search_vector` column with a GIN index, and the search API uses `ts_rank` + `ts_headline` for relevance-ranked full-text search.
- [x] **RSS feed** -- `/src/app/rss.xml/route.ts` serves an RSS 2.0 feed of approved guide posts for syndication.

## Remaining (User Action Required)

- [ ] **Submit sitemap to Google Search Console**
  1. Go to [Google Search Console](https://search.google.com/search-console)
  2. Verify ownership of your domain (see verification step below)
  3. Navigate to **Indexing > Sitemaps**
  4. Enter the sitemap URL: `https://autowner.com/sitemap.xml`
  5. Click **Submit**
  6. Monitor the **Pages indexed** report over the following weeks to ensure all pages are being crawled and indexed.

- [ ] **Add DNS TXT record for Google Search Console verification**
  - In Search Console, choose **Domain** property type (recommended -- covers all subdomains and protocols).
  - Copy the TXT verification record provided by Google.
  - Add it to your DNS provider (Vercel Domains, Cloudflare, Namecheap, etc.) as a TXT record on the root domain.
  - Wait for DNS propagation (usually < 5 minutes, can take up to 48 hours in rare cases).
  - Click **Verify** in Search Console.

- [ ] **Enable email confirmation in Supabase**
  1. Go to [Supabase Dashboard](https://supabase.com/dashboard) > your project > **Authentication > Providers > Email**.
  2. Enable **Confirm email** or **Confirm email + phone** depending on your preference.
  3. Configure the email template (optional -- Supabase provides sensible defaults).
  4. If you want to use a custom SMTP server for sending emails (recommended for production), configure it under **Authentication > Email Templates > SMTP Settings**.

- [ ] **Run `003_fulltext_search.sql` migration**
  1. Connect to your Supabase project's SQL editor or run via the Supabase CLI.
  2. Execute the contents of `/supabase/migrations/003_fulltext_search.sql`.
  3. Verify the GIN index was created: `SELECT indexname FROM pg_indexes WHERE tablename = 'posts' AND indexdef LIKE '%gin%';`
  4. Test with a sample query: `SELECT title, ts_rank(search_vector, query) AS rank FROM posts, to_tsquery('english', 'brake & pad') query WHERE search_vector @@ query ORDER BY rank DESC;`
