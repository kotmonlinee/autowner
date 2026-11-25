# AutOwner Visual Redesign Implementation Plan

- Date: 2026-11-25
- Design source: `docs/superpowers/specs/2026-11-25-autowner-visual-redesign-design.md`
- Delivery model: Three independently deployable phases
- Production guard: Do not promote Phase 1 to the AdSense-reviewed production
  domain while the current review remains pending unless the user explicitly
  accepts that risk.

## 1. Working Rules

- Preserve all existing routes and canonical URLs.
- Preserve metadata generation and sitemap behavior.
- Preserve exactly one H1 per indexable page.
- Keep primary content server-rendered.
- Do not add AdSense code or visible ad placeholders.
- Keep old semantic color aliases during migration.
- Prefer small shared components over page-local repeated Tailwind trees.
- Run TypeScript checks after each work unit.
- Add or update Playwright coverage before deployment.
- Use 375px, 768px, 1280px, and 1440px as visual review widths.

## 2. Branch and Preview Strategy

Create a non-production branch:

```text
codex/visual-redesign-phase-1
```

Use Vercel preview deployments for visual review. If previews are publicly
crawlable, keep `robots.txt` behavior consistent with production and avoid sitemap
changes.

Do not merge to `main` while the AdSense review is pending unless explicitly
approved. The implementation can be prepared and tested without changing the
domain currently under review.

## 3. Phase 1: Foundation and Homepage

### Task 1: Establish the light-only token foundation

Files:

- `src/app/globals.css`
- `tailwind.config.ts`

Steps:

1. Replace current blue primary values with Roadside Editorial signal orange.
2. Map existing aliases:
   - `surface-0` → paper
   - `surface-1` → surface
   - `surface-2` → raised paper
   - `primary` → signal
   - `primary-dark` → signal-hover
   - `primary-glow` → signal-hover
3. Update text, border, severity, warning, success, and danger tokens to accessible
   light-theme values.
4. Remove dark-mode token overrides.
5. Retain legacy alias names until full rollout is complete.
6. Set `color-scheme: light`.

Verification:

- `npx tsc --noEmit`
- Inspect computed CSS variables in browser.
- Confirm text/background contrast meets WCAG AA.

### Task 2: Replace typography and theme runtime

Files:

- `src/lib/fonts.ts`
- `src/app/layout.tsx`
- `src/components/Navbar.tsx`
- `src/components/ThemeToggle.tsx`

Steps:

1. Replace Russo One and Outfit with Newsreader and Manrope.
2. Keep Manrope as body and UI heading family.
3. Add an explicit display family for editorial H1s.
4. Remove theme initialization script from the root layout.
5. Remove theme toggle imports and all mobile/desktop render branches.
6. Keep the theme toggle component file only until all routes are migrated, then
   delete it.
7. Remove dark mode viewport theme-color entry.

Verification:

- No runtime `.dark` class is added.
- Stale `theme` localStorage values do not change the UI.
- Fonts render without layout obstruction.
- Mobile and desktop navigation contain no empty space where the toggle was.

### Task 3: Shared visual primitives

Create:

```text
src/components/ui/
  Button.tsx
  Surface.tsx
  StatusBadge.tsx
  SectionHeading.tsx
  DataLabel.tsx
  EditorialImage.tsx
```

Steps:

1. Implement variant-based buttons:
   - primary
   - secondary outline
   - quiet text
   - danger
2. Implement surface variants:
   - paper
   - article
   - ink diagnostic panel
3. Implement status variants:
   - success
   - warning
   - danger
   - neutral
4. Implement responsive editorial image wrapper with explicit dimensions.
5. Do not add another component library.

Verification:

- Components render server-side by default.
- Buttons support keyboard focus and disabled states.
- Status badges include text, not color alone.

### Task 4: Header and footer

Files:

- `src/components/Navbar.tsx`
- `src/components/Footer.tsx`
- `src/components/SearchBar.tsx`

Steps:

1. Reduce primary desktop navigation to Diagnose, OBD Codes, Repair Costs,
   Vehicles, and Warning Lights.
2. Make `Check a Quote` the only persistent primary CTA for signed-out users.
3. Move community/account items to the secondary mobile menu and footer.
4. Add the active-section underline.
5. Replace the large SVG logo lockup with a lighter brand mark and wordmark.
6. Rewrite footer into Diagnose, Learn, Company, and Legal groups.
7. Compress the newsletter form and keep it above the link groups.
8. Remove the theme toggle.

Verification:

- Keyboard tab order follows visual order.
- Mobile menu closes after navigation.
- Header height remains at most 64px.
- No horizontal overflow at 320px.

### Task 5: Homepage command center

Files:

- `src/app/page.tsx`
- `src/components/SmartSearchBar.tsx`
- New homepage modules under `src/components/home/`

Steps:

1. Replace the centered generic hero with a 60/40 split command center.
2. Keep one H1 in initial HTML.
3. Add symptom, OBD, repair, and vehicle search support messaging.
4. Add symptom quick links.
5. Build the ink diagnostic preview panel from real product data shapes.
6. Replace six equal tool cards with:
   - primary Symptom Checker card;
   - OBD module;
   - Repair Cost module;
   - compact list for Quote Checker, Warning Lights, and Recall Check.
7. Add symptom-category discovery.
8. Add two editorial modules:
   - repair-cost watch;
   - popular vehicle problems.
9. Add the trust and methodology disclosure.

Verification:

- H1 and search form are present in raw HTML.
- No vehicle image grid loads above the fold.
- No ad slot or blank ad reservation renders.
- Contextual links are real anchors.
- Mobile stacks in the specified order.

### Task 6: Phase 1 quality gate

Automated:

- TypeScript.
- Targeted ESLint.
- Playwright desktop/mobile homepage tests.
- Raw HTML checks for H1 and canonical.

Manual:

- 375px and 1440px visual inspection.
- Keyboard-only navigation.
- Reduced-motion behavior.
- No dark theme activation.
- No horizontal scrolling.

## 4. Phase 2: Core Templates

### Task 7: Shared content components

Create:

```text
src/components/content/
  Breadcrumbs.tsx
  PageHeader.tsx
  QuickVerdict.tsx
  DecisionPath.tsx
  CostSummary.tsx
  DiagnosticDataPanel.tsx
  ContentSection.tsx
  ContinueSolving.tsx
  TrustDisclosure.tsx
  FaqList.tsx
  AdSlot.tsx
  QuoteCta.tsx
```

Rules:

- Main content and H1 remain outside client-only boundaries.
- `ContinueSolving` accepts explicit related-link objects.
- `AdSlot` returns `null` while disabled.
- FAQ uses native disclosure controls.

### Task 8: Repair-cost template

Files:

- `src/app/repair-cost/[slug]/page.tsx`
- Extracted repair-cost components

Steps:

1. Preserve generated metadata and canonical.
2. Reorder visible content to the Answer First structure.
3. Move price, confidence, and decision content before long explanations.
4. Replace icon-heavy sections with data rows and editorial surfaces.
5. Keep vehicle-specific and generic modes.
6. Add contextual exploration after the main content.
7. Add disabled ad slot positions in code only.

### Task 9: OBD template

Files:

- `src/app/obd/[code]/page.tsx`
- `src/components/ObdDiagnosticFunnel.tsx`
- `src/components/ObdCodeBrowser.tsx`

Steps:

1. Put code meaning and driving guidance before the interactive funnel.
2. Refactor cause cards to shared diagnostic panels.
3. Keep verification steps and probable-cause ranking.
4. Add contextual repair, symptom, diagnosis, and vehicle links.
5. Preserve FAQ and structured data.

### Task 10: Symptom and AI diagnosis templates

Files:

- `src/app/symptoms/[slug]/page.tsx`
- `src/app/symptom-checker/[slug]/page.tsx`

Steps:

1. Put safety status and the most useful answer first.
2. Convert cause lists to a consistent evidence hierarchy.
3. Preserve server-rendered cause text.
4. Add decision strip before long cost detail.
5. Add contextual exploration at the end.
6. Preserve AI disclosure and disclaimers.

### Task 11: Quote Checker

Files:

- `src/app/quote-checker/page.tsx`
- `src/app/quote-checker/layout.tsx`

Steps:

1. Keep server-rendered H1 and introduction outside Suspense.
2. Refactor the form into smaller sections without changing behavior.
3. Keep result output server-safe and readable.
4. Do not add ads inside the form or result.
5. Add ad-capable positions only after FAQ.

### Task 12: Primary hubs

Files:

- `/obd`
- `/symptoms`
- `/repair-cost`
- `/vehicles`
- `/warning-lights`

Steps:

1. Use common page headers and filtering patterns.
2. Reduce identical card-grid layouts.
3. Use crawlable pagination anchors.
4. Keep H1 and introductory content in initial HTML.
5. Avoid loading all records or images in the first viewport.

## 5. Phase 3: Long-Tail and Utility Pages

### Task 13: Remaining public routes

- Vehicle detail
- Warning-light detail
- Recall Check
- Symptom Checker index
- Search
- Community
- Post detail
- About/Contact/Legal

Use the same shared surfaces, typography, status badges, forms, and direct-link
rules.

### Task 14: Account and authentication

- Auth login/register/reset
- Settings
- Bookmarks
- Drafts
- Submit

Keep these pages function-first. Do not add editorial modules where they would
distract from the task. Keep noindex rules unchanged.

### Task 15: Theme cleanup

1. Search for `.dark` and `dark:` usage.
2. Remove dead dark variants.
3. Delete `ThemeToggle.tsx`.
4. Remove unused font variables.
5. Remove legacy color aliases only after all routes have migrated.

Verification:

- No runtime or CSS dark theme remains.
- No stale imports.
- No page falls back to the old blue/gradient surfaces.

## 6. SEO Regression Suite

Extend `tests/seo.spec.ts`:

- Each core template returns one H1 in raw HTML.
- Canonical is self-referencing.
- Utility pages remain noindex.
- Ads-disabled state contains no ad DOM.
- Sitemap routes remain 200 and do not include noindex utility pages.
- Search and paginated utility pages remain non-indexable.

Compare before/after:

- title;
- description;
- canonical;
- robots;
- H1 count;
- main content word count;
- internal link count.

## 7. Visual Regression Suite

Capture representative pages:

- Homepage
- One generic repair-cost page
- One vehicle repair-cost page
- One OBD page
- One generic symptom page
- One vehicle symptom page
- One AI diagnosis page
- Quote Checker
- One hub page

At widths:

- 375px
- 768px
- 1280px
- 1440px

Reject changes with clipped text, overlap, horizontal overflow, unexpected blank
space, or an ad placeholder.

## 8. Deployment Gates

### Phase 1 gate

- Design system, header, footer, and homepage pass visual review.
- SEO invariants pass.
- Untouched pages remain coherent.
- AdSense review status is respected.

### Phase 2 gate

- All core templates pass raw HTML and visual tests.
- Contextual exploration is relevant and crawlable.
- Ad-disabled mode has no DOM or spacing.
- Mobile readability passes.

### Phase 3 gate

- No old visual language remains.
- Dark code and obsolete aliases are removed.
- Final cross-site crawl finds no missing H1 or unexpected noindex.

## 9. Rollback Strategy

- Deploy phases independently.
- Keep each phase in a separate commit group or pull request.
- If a phase causes SEO or usability regression, revert that phase without
  reverting the content/data fixes.
- Preserve the prior deployment until post-release crawl checks pass.

## 10. Completion Criteria

The redesign is complete when:

- all public pages use the light Roadside Editorial system;
- homepage follows Diagnosis Command Center;
- core content pages follow Answer First + Continue Below;
- navigation is reduced and mobile-friendly;
- contextual exploration increases useful internal browsing;
- no SEO field or raw-HTML invariant regressed;
- no AdSense code or visible ad placeholder exists before approval;
- all three phases have passed automated and manual verification.
