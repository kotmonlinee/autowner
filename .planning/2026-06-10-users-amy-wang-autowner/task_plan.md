# Task Plan: AutOwner SEO & UI Optimization

## Goal
Optimize AutOwner for SEO visibility (CTR, structured data, sitemap) and polish UI/UX across key pages. Underlying theme: elevate from MVP to production-grade.

## Current Phase
Phase 5: Ongoing refinements

## Phases

### Phase 1: Type System & Data Layer Cleanup → complete
- Added Diagnosis types, removed dead views code, cleaned up `as any` casts
- Migration file reorganization (DDL vs Supabase-specific)

### Phase 2: Sitemap & Performance → complete
- Fixed Supabase 1,000-row limit for diagnoses, posts, getAllRepairSlugs
- Sitemap stable at 20,600 URLs
- CDN cache headers (revalidate=86400) on static pages
- 404 monitoring via not-found.tsx + error_logs table

### Phase 3: Design System & Dark Mode → complete
- Severity color tokens in globals.css via @theme + .dark overrides
- Tailwind dark mode sync: @variant dark class-based (was media-based causing mismatch)
- Logo SVG inline with --color-text-primary, adapts to light/dark
- Warning lights page light mode redesign
- Auth pages (login/register/reset/update): SVG logo, severity tokens, value prop

### Phase 4: Page-by-Page Optimizations → complete
- Community: search + pagination, remove sidebar (Top Contributors, Tool CTAs, Browse Categories, Ask CTA)
- OBD list: P/C/B/U prefix filters with DB-level queries, severity color bars
- Diagnosis detail: full redesign (hero, sections, cards, share, disclaimer)
- Repair cost: Title/Meta SEO optimization ($X-$Y in title), FAQ + JSON-LD schema, Related Warning Lights
- Symptom checker: pagination (24/page), vehicle/repair images, cost preview
- Quote checker + Recall check: vehicle images in Most Checked cards
- Post detail: remove right sidebar
- Search: /api/search endpoint + SmartSearchBar autocomplete dropdown
- Reading history: removed entirely

### Phase 5: Ongoing Refinements → paused
- [x] 404 error monitoring via error_logs
- [x] Repair slug DB validation (prevent 404 links)
- [x] Install planning-with-files skill
- [x] Warning light detail page redesign
- [x] Diagnosis detail page full redesign
- [x] Repair cost Title/Meta/FAQ/Schema/Warning Lights
- [x] Symptom checker pagination + images
- [x] OBD detail page card cleanup + related repairs
- [x] Community page card enrichment
- [x] Aggregated search page (/search)
- [x] Vehicle hub page enrichment + CTA redesign
- [x] /vehicles browse page (73 vehicles)
- [x] Homepage Popular Diagnoses (rejected — keep static)
- [ ] DIY module (content data needed first)
- [ ] Repair Decision module (data needed)
- [ ] Quick Cost Summary above-the-fold (rejected — no CTR benefit)
- [ ] repair-cost route conflict ([slug] vs [make]/[model]/[repair])
- [ ] Newsletter/mail system redesign

## Upcoming Work (user-confirmed priorities)
1. **DIY module** — High SEO potential ("how to replace X", "DIY X cost"). Blocked on content data. User evaluating AI-generated vs manual approach.
2. **Repair Decision** — Urgency, risk, can-I-drive per repair. Blocked on data.
3. **Quick Cost Summary** — Above-fold hero card. Data exists (tier cost), needs design.
4. **Route conflict fix** — repair-cost [slug] vs [make] param naming conflict.

## Decisions Made
| Decision | Rationale |
|----------|-----------|
| Revert sitemap split | Paginated child sitemaps hit Vercel timeouts worse than single file |
| Severity tokens via CSS variables | Single source of truth for colors, 19 files migrated |
| Search: API autocomplete vs full rewrite | Minimal change, max UX gain |
| Remove reading history | 51 posts, tool-focused — not enough content value |
| Skip hero image | User disliked both attempts |

## Errors Encountered
| Error | Resolution |
|-------|------------|
| Dark mode mismatch (Tailwind media vs class-based) | Added @variant dark (&:where(.dark, .dark *)) in globals.css |
| Sitemap split timeout on Vercel | Reverted to single file with existing pagination |
| Build error: extra closing bracket in diagnosis page | Removed orphaned `)}` |
| Repair slug 404s (keyword→slug mapping gaps) | DB-level validation before rendering links |
| bg-severity-critical-bg not rendering correctly | Replaced intermediate CSS var chain with direct @theme hex + .dark override |
