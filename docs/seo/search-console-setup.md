# Google Search Console Setup for autowner.com

Follow these steps to add autowner.com to Google Search Console.

## 1. Go to Google Search Console

Open [https://search.google.com/search-console](https://search.google.com/search-console) and sign in with your Google account.

## 2. Add Property

1. Click the dropdown in the top-left corner (next to the Google Search Console logo).
2. Click **Add property**.
3. Choose **URL prefix** as the property type.
4. Enter: `https://www.autowner.com`
5. Click **Continue**.

## 3. Verify Ownership via DNS TXT Record

Google will present several verification methods. Choose **DNS record** (recommended — works with any DNS provider and does not require adding files to the site).

1. Google will show a TXT record value that looks like:
   ```
   google-site-verification=AbCdEfGhIjKlMnOpQrStUvWxYz1234567890
   ```
2. Copy this value.

### Add the TXT record in 阿里云 DNS

1. Log in to your [阿里云 (Alibaba Cloud) console](https://home.console.aliyun.com/).
2. Navigate to **DNS (云解析 DNS)**.
3. Find the domain `autowner.com` in your domain list and click **解析设置 (DNS Settings)**.
4. Click **添加记录 (Add Record)**.
5. Fill in the record details:
   - **记录类型 (Record Type):** TXT
   - **主机记录 (Host Record):** `@` (or leave blank depending on 阿里云 interface — this represents the root domain)
   - **记录值 (Record Value):** Paste the verification string from Google (e.g., `google-site-verification=...`)
   - **TTL:** Leave as default (usually 10 minutes or 600 seconds) or set to `600`
6. Click **确认 (Confirm)** to save the record.

### Wait for DNS propagation

DNS changes can take a few minutes to several hours to propagate. In practice, for 阿里云 DNS, Google usually detects the record within a few minutes.

1. Go back to the Google Search Console verification page.
2. Click **Verify**.
3. If it fails, wait 5-10 minutes and try again. DNS TXT records are cached, but 阿里云 DNS typically propagates quickly within mainland China.

### Troubleshooting DNS verification

If verification fails after 30+ minutes:
- Double-check that the TXT record value was copied exactly (no extra spaces, no missing characters).
- Use `dig TXT autowner.com` in a terminal to confirm the record is live.
- You can also use an online DNS checker like [https://dnschecker.org](https://dnschecker.org).
- If the record is visible via `dig` but Google still won't verify, wait up to 48 hours (Google's TTL for DNS checks). This is rare but can happen.

## 4. Submit Your Sitemap

Once verified and inside the Search Console dashboard for `autowner.com`:

1. In the left sidebar, click **Sitemaps** (under the **Index** section).
2. In the **Add a new sitemap** field, enter: `sitemap.xml`
3. Click **Submit**.

The full sitemap URL will be: `https://www.autowner.com/sitemap.xml`

After submission, Google will show the sitemap status as "Pending" initially. It may take a few hours to a few days for Google to crawl and process the sitemap. Check back periodically to see:
- Number of URLs discovered
- Number of URLs indexed
- Any crawling errors or warnings

## Next Steps

- **Monitor coverage:** Check the **Pages** report under **Indexing** to see which pages are indexed and any indexing errors.
- **Check performance:** The **Performance** report shows clicks, impressions, average position, and CTR for your pages in Google Search results.
- **Core Web Vitals:** Check the **Core Web Vitals** report under **Experience** for page speed and UX metrics.
- **Manual actions and security issues:** Check these periodically to ensure no penalties or hacks have affected the site.
