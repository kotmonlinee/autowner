# AutOwner Visual Redesign Design

- Date: 2026-11-25
- Status: Draft for product and engineering review
- Scope: Full-site light-theme redesign in three phases
- Selected direction: Roadside Editorial
- Selected homepage structure: Diagnosis Command Center
- Selected content structure: Answer First + Continue Below

## 1. Summary

AutOwner currently functions as a collection of automotive tools, but its visual
language feels like a generic SaaS dashboard. Rounded cards, blue accents,
gradient/glow effects, icon grids, and inconsistent page compositions do not
communicate automotive expertise or help users distinguish diagnosis, cost,
safety, and next-step decisions.

This redesign gives AutOwner a clear identity:

> A practical automotive field guide with the editorial confidence of a
> specialist magazine and the precision of a diagnostic instrument.

The site will use a light-only, warm editorial design system. The homepage will
prioritize immediate diagnosis. High-volume content pages will present the answer
first, followed by contextual paths that encourage useful exploration.

The redesign must improve perceived quality and browsing without changing URLs,
canonicals, indexability, H1s, or server-rendered content.

## 2. Goals

- Make the site feel credible, distinctive, and automotive-specific.
- Make the primary answer and recommended next action obvious within the first
  viewport.
- Establish a reusable design system across all page families.
- Increase meaningful internal navigation without using generic “related posts”
  modules.
- Improve readability and scanning for long automotive content.
- Preserve or improve SEO and Core Web Vitals.
- Prepare ad locations without rendering empty ad containers before approval.
- Support mobile-first use on 360px-wide screens and above.
- Keep the redesign incrementally shippable.

## 3. Non-Goals

- Changing the site’s information architecture or existing URLs.
- Changing canonical URLs, metadata strategy, sitemap generation, or robots rules.
- Changing the underlying diagnosis, repair-cost, OBD, symptom, vehicle, or recall
  data models.
- Adding dark mode.
- Adding user accounts, garage features, or solution pages in this project.
- Loading Google AdSense before approval.
- Replacing server-rendered content with client-only widgets.
- Introducing infinite scroll for indexable primary content.
- Redesigning the authenticated admin interface in the first release.

## 4. Product Principles

### 4.1 Answer before atmosphere

Brand expression must not delay the answer. The H1, safety status, price or
diagnosis summary, and recommended action must be present before decorative
content.

### 4.2 Editorial confidence, not retro decoration

The site should feel like an experienced automotive publication, not a vintage
garage theme. Serif headlines, warm paper, ink, safety orange, and structured
data do the work. Avoid distressed textures, fake metal, racing clichés, and
ornamental chrome.

### 4.3 Data is a visual asset

OBD codes, cost ranges, safety levels, repair time, and tool requirements should
be presented as structured evidence rather than buried in prose.

### 4.4 Contextual exploration over generic discovery

“Continue solving this problem” links must share the same symptom, repair, OBD
code, vehicle, or decision context. Popular-content widgets are not a substitute
for relevant internal linking.

### 4.5 SEO is a hard constraint

The redesign may change wrappers, sequencing, spacing, and visual treatment, but
must not hide or defer indexable content only for visual convenience.

### 4.6 Progressive delivery

The design system and homepage ship first. High-value tool/content templates ship
second. Long-tail and account/community pages ship third.

### 4.7 Preserve the AdSense review environment

The production site is currently under AdSense review. A large visual change can
make the reviewer-facing site move while the review is in progress.

- Development may proceed on a non-production branch or preview.
- Phase 1 is not promoted to the production domain while AdSense review remains
  pending unless the user explicitly accepts the review risk.
- Preview deployments must keep production's robots and indexing behavior unless
  the preview is protected from crawlers.
- No AdSense code is added as part of the redesign.

## 5. Visual Direction

### 5.1 Brand concept

**Roadside Editorial / Automotive Field Manual**

The visual personality combines:

- the confidence of an established automotive publication;
- the clarity of a consumer repair guide;
- the precision of a diagnostic report;
- the safety language of a service manual.

### 5.2 Color system

| Token | Value | Purpose |
|---|---|---|
| `paper` | `#F4F0E8` | Primary page background |
| `surface` | `#FFFDF8` | Article and form surface |
| `ink` | `#141617` | Primary text and dark data panels |
| `ink-soft` | `#2B2D2D` | Secondary dark surfaces |
| `text-secondary` | `#5F5B54` | Body-secondary text |
| `text-muted` | `#777168` | Captions and metadata |
| `border` | `#D8D0C2` | Default borders and dividers |
| `border-strong` | `#BDB3A2` | Emphasized boundaries |
| `signal` | `#E6531D` | Primary CTA and critical editorial accent |
| `signal-hover` | `#C94513` | Primary CTA hover |
| `signal-soft` | `#FBE9E1` | Soft emphasis background |
| `warning` | `#C8871D` | Caution status |
| `warning-soft` | `#F8EED8` | Caution background |
| `success` | `#247553` | Success and safe-to-drive state |
| `success-soft` | `#E6F0EA` | Success background |
| `danger` | `#C43D32` | Stop-driving and destructive state |
| `danger-soft` | `#F8E7E4` | Danger background |

Rules:

- Blue is no longer the primary brand color.
- Orange is used for primary actions, selected navigation, and important numbers.
- Large orange sections are prohibited.
- Status colors must be paired with text or icons, never color alone.
- WCAG AA contrast is required for text and controls.

### 5.3 Typography

| Role | Font | Notes |
|---|---|---|
| Display | `Newsreader` | H1, homepage hero, editorial feature titles |
| Heading | `Manrope` | H2/H3, cards, forms, navigation |
| Body | `Manrope` | Article copy and controls |
| Data | System monospace | OBD codes, numeric labels, small technical metadata |

Typography scale:

- Homepage H1: 56–72px desktop, 40–48px mobile, line-height 0.98–1.05
- Article H1: 44–56px desktop, 34–40px mobile
- H2: 30–36px desktop, 26–30px mobile
- H3: 20–24px
- Body: 16px desktop, 16px mobile, line-height 1.65–1.75
- Metadata: 12–13px
- Avoid uppercase paragraphs and excessive letter spacing

Russo One and Outfit are removed. Manrope remains the interface and body family.

### 5.4 Geometry and spacing

- Base spacing unit: 4px
- Common spacing steps: 8, 12, 16, 24, 32, 48, 64, 80px
- Homepage maximum width: 1180px
- Hub/list maximum width: 1180px
- Reading column: 720–760px
- Standard desktop grid: 12 columns
- Standard radius: 6px for controls, 8–12px for data panels and article media
- Cards must not exceed 12px radius
- Shadows are restricted to overlays, menus, and focused floating controls
- Default cards use paper/surface contrast and a 1px hairline

### 5.5 Surface rhythm

Pages should alternate between:

- paper background;
- unframed editorial sections;
- surface-colored reading panels;
- ink-colored diagnostic modules.

Repeated identical rounded cards must not be used as the primary layout
mechanism.

### 5.6 Iconography and imagery

- Use line icons with a consistent 1.75 stroke.
- Do not put every icon inside a bright colored square.
- Use existing editorial photographs from:
  - `public/vehicles`
  - `public/repairs`
  - `public/warning-lights`
- Vehicle imagery should use editorial crop ratios, not small generic thumbnails.
- Missing imagery falls back to a structured diagnostic graphic or typographic
  data panel, not a generic car icon alone.

### 5.7 Motion

- Motion is functional: menus, disclosure, result transitions, and loading state.
- No looping background animation.
- No glow pulse behind primary CTAs.
- Respect `prefers-reduced-motion`.
- Initial page content must render without motion-dependent visibility.

### 5.8 Token compatibility

The existing codebase has hundreds of references to the current surface, primary,
amber, severity, and `dark:` utilities. Rewriting every route at once would create
an uncontrolled regression risk.

Phase 1 keeps the existing semantic aliases while replacing their values:

- `surface-0`, `surface-1`, and `surface-2` map to the new paper/surface system.
- `primary` maps to `signal` so existing actions immediately adopt the new brand.
- `amber`, severity, and text tokens map to the new accessible light values.
- Legacy utility names remain temporarily even when their visual meaning changes.
- New components use the new semantic names directly where practical.
- A final cleanup removes obsolete aliases only after all three phases are live.

This compatibility layer allows a safe first release without editing every route
at the same time.

## 6. Light-Only Theme

- The site no longer follows the operating-system color scheme for a dark theme.
- Remove the theme initialization script.
- Remove the theme toggle from navigation.
- Remove `ThemeToggle` from every mobile and desktop navigation branch.
- A stale `theme=dark` localStorage value must not affect rendering.
- Set the document color scheme to light.
- Existing `dark:` utility classes may remain temporarily during rollout but no
  runtime path may apply the `.dark` class.
- Remove dead dark-theme tokens and variants after all three phases are complete.

## 7. Navigation

### 7.1 Desktop header

Structure:

```text
AutOwner logo
Diagnose
OBD Codes
Repair Costs
Vehicles
Warning Lights
Search
Check a Quote
```

Behavior:

- Height: 64px.
- Sticky with a paper background and a 1px bottom border.
- The active section uses an orange underline, not a filled button.
- Search opens an expanded search field on focus/click.
- `Check a Quote` is the only persistent primary CTA.
- Community and account links move to the secondary menu/footer.

### 7.2 Mobile header

- Height: 60–64px.
- Logo, search icon, and menu button.
- Search opens a full-width field beneath the header.
- Menu uses a full-width paper panel.
- Primary navigation order:
  1. Diagnose
  2. OBD Codes
  3. Repair Costs
  4. Vehicles
  5. Warning Lights
  6. Check a Quote
- Account, community, and legal links follow as secondary items.

### 7.3 Footer

Four groups:

- Diagnose
- Learn
- Company
- Legal

Keep the newsletter form as a compact section above the link groups. Do not use a
large media-style footer with oversized logo and unnecessary social placeholders.

## 8. Homepage

### 8.1 Page order

```text
Header
Diagnosis command center
Tool directory
Start with what you notice
Editorial features
Trust and methodology
Footer
```

### 8.2 Diagnosis command center

Desktop layout:

- 60% editorial copy and search
- 40% diagnostic preview panel

Left column:

- Eyebrow: `Vehicle symptoms / diagnostics`
- H1: `Start with what your car is doing.`
- Supporting copy: explain symptom, OBD, vehicle, and next-step coverage
- Main search: accepts symptoms, OBD codes, repair names, and vehicles
- Quick symptom chips: noise, warning light, no start, fluid leak, vibration

Right column:

- Ink-colored diagnostic preview
- Example OBD/symptom title
- Severity indicator
- Likely cause
- Verification step
- Cost range
- DIY/shop recommendation

The preview is illustrative but must be based on real product capabilities. It
must not imply a live diagnosis.

Mobile:

- Copy and search appear first.
- The diagnostic preview follows below the form.
- Chips wrap into no more than three visual rows.

### 8.3 Tool directory

Do not render six equal colored cards.

Use:

- One large primary card for `Symptom Checker`.
- One compact diagnostic-code module for OBD.
- One cost module for Repair Costs.
- A shared list for Quote Checker, Warning Lights, and Recall Check.

Each module needs:

- tool name;
- one-line outcome;
- direct CTA;
- no generic marketing copy longer than two lines.

### 8.4 Start with what you notice

Use real symptom categories as linked rows or chips:

- Noises
- Smells
- Warning lights
- Starting problems
- Braking and steering
- Leaks and smoke

Each links to an indexable symptom or diagnosis hub.

### 8.5 Editorial features

Two modules:

1. `Repair cost watch`
   - three current repair-cost data callouts;
   - links to repair-cost detail pages.
2. `Popular vehicle problems`
   - controlled list based on actual vehicle/issue data;
   - no arbitrary trending calculation without an explainable source.

### 8.6 Trust section

Short disclosure:

- what data powers the tools;
- where AI is used;
- how repair-cost ranges are produced;
- that safety-critical decisions require professional inspection;
- links to About, Editorial Policy, Privacy, and Contact.

## 9. Core Content Templates

### 9.1 Shared structure

All indexable core pages use:

```text
Page shell
Breadcrumb
Page header with exactly one H1
Quick answer / verdict
Decision or safety block
Primary content
Evidence and data
Continue solving this problem
FAQ
Footer
```

The H1 and primary answer must be in the initial server-rendered HTML.

### 9.2 Repair cost page

Order:

1. Breadcrumb
2. H1 and concise explanation
3. Cost summary with range, average, confidence
4. Decision strip: DIY / shop / confirm first
5. Pre-repair checks
6. Parts and labor breakdown
7. What affects price
8. Vehicle-specific cost
9. Related OBD/symptoms
10. Quote Checker
11. Related repairs
12. FAQ

Desktop may use a 240px contextual rail after the first article section. The first
release uses the bottom exploration module; the rail is tested only on qualifying
high-traffic pages.

### 9.3 OBD code page

Order:

1. Code and severity
2. One-sentence meaning
3. Can-you-drive guidance
4. Likely causes
5. Verification checks
6. Repair and cost
7. DIY/shop decision
8. Related diagnoses, symptoms, and vehicles
9. FAQ

Avoid placing the interactive symptom selector before the basic meaning of the
code.

### 9.4 Symptom page

Order:

1. H1 and safety status
2. Common causes
3. Lowest-cost verification steps
4. DIY / observe / shop decision
5. Repair costs
6. Related OBD codes
7. Vehicle-specific variants
8. Continue solving this problem

### 9.5 AI diagnosis page

Order:

1. H1 with vehicle context
2. Severity and driving guidance
3. Likely causes
4. Verification steps
5. What to do next
6. Repair cost and options
7. Related OBD codes and repairs
8. Try another diagnosis
9. FAQ and AI disclosure

### 9.6 Quote Checker

- Server-render H1 and explanatory copy.
- Keep the form immediately after the introduction.
- Keep the interactive search-param section inside Suspense only after the
  server-rendered H1.
- Do not place ads inside the form or result flow.
- After a result, show contextual repair guidance and quote questions.

### 9.7 Hub/list pages

- Use editorial section headings instead of grids of identical cards.
- First viewport includes H1, search/filter, and a concise explanation.
- Lists use rows, data tables, or asymmetric modules where appropriate.
- Pagination used for indexed content must use crawlable anchor links and
  preserve canonical rules.

## 10. Contextual Exploration

### 10.1 Module

Name: `Continue solving this problem`

Candidate links, in priority order:

1. Alternative cause or related symptom
2. Verification or diagnostic step
3. Repair guide or repair cost
4. Related OBD code
5. Same-vehicle issue
6. Quote Checker

Rules:

- Use existing relationships from diagnosis/cause/repair/vehicle/OBD data.
- Never fill empty positions with unrelated popular content.
- Limit to six links.
- Render as semantic `<a>` elements.
- Explain why each link is relevant in one short sentence.

### 10.2 Optional desktop rail

The desktop rail is not part of the initial implementation.

It may be tested after the base template is live:

- sticky within the article;
- 220–240px wide;
- includes on-page navigation, next best action, and related quote checking;
- never wraps or hides the primary article;
- mobile falls back to the bottom exploration module.

## 11. Ad-Ready Layout

AdSense is not active during review.

### 11.1 Placeholder behavior

- `AdSlot` components are not rendered until `adsEnabled` is true.
- No visible blank space is reserved before approval.
- No “Advertisement” placeholder is shown during review.
- Slots collapse when an enabled ad has no fill.

### 11.2 Allowed positions

- After the first complete content section, not above H1 or primary answer.
- Before FAQ on long article pages.
- Never inside forms, diagnostic steps, results, tables, or primary CTA groups.
- Desktop articles may eventually include one rail ad; it is excluded from the
  first release.

### 11.3 Density

- Desktop: maximum two content ads per page.
- Mobile: at least two complete content sections between ads.
- No sticky mobile anchor ads in the first release.
- No ad that visually resembles a tool result, CTA, or navigation card.

## 12. Responsive Design

Breakpoints are implementation details, but behavior is fixed:

- 320–639px: single column; search first; data tables become stacked key-value
  rows or horizontally accessible tables when necessary.
- 640–1023px: single-column article with wider media; navigation remains compact.
- 1024px+: multi-column homepage and optional contextual desktop rail.

Mobile requirements:

- Body text remains at least 16px.
- Tap targets at least 44px.
- No critical horizontal scrolling.
- Diagnostic panels stack without duplicating content.
- Sticky header must not consume more than 64px.

## 13. Component Architecture

Create or refactor toward these bounded components:

- `SiteHeader`
- `SiteFooter`
- `Breadcrumbs`
- `PageHeader`
- `QuickVerdict`
- `DecisionPath`
- `CostSummary`
- `DiagnosticDataPanel`
- `EditorialFeatureCard`
- `ToolDirectory`
- `ContentSection`
- `ContinueSolving`
- `TrustDisclosure`
- `FaqList`
- `AdSlot`
- `QuoteCta`

Rules:

- Components accept semantic data, not page-specific JSX trees.
- Server components are the default.
- Interactive behavior is isolated in small client components.
- No page-specific duplicated styles for the same component concept.
- Existing high-volume page files should shrink as markup is extracted.

## 14. SEO Constraints

The redesign must satisfy all of the following:

- Existing URLs do not change.
- Canonical URLs do not change.
- H1 remains exactly one per indexable page and appears in initial HTML.
- Titles and descriptions are not replaced by client-only values.
- Core answer text remains server-rendered.
- Content is not hidden with `display:none` to improve visual density.
- Contextual links are normal anchors.
- Indexable pagination remains crawlable.
- Sitemaps and robots rules are unchanged.
- Main content is not loaded only after hydration.
- Sticky rails never duplicate an H1 or primary answer.
- Ads never appear before core content.

## 15. Performance and Accessibility

- Prefer CSS transforms and opacity for motion.
- Do not add a large icon or component library for decorative needs.
- Use existing images with explicit dimensions and responsive loading.
- Avoid loading every vehicle image on the homepage.
- Target no significant layout shift from fonts, images, or ad slots.
- Keyboard navigation must follow visual order.
- Focus styles must remain visible.
- Color contrast must meet WCAG AA.
- Status colors always include text labels.
- Reduced-motion preferences are respected.

## 16. Rollout

### Phase 1: Foundation and homepage

- Replace the color and type tokens.
- Remove dark theme runtime.
- Implement header, footer, buttons, form controls, surfaces, status styles.
- Implement design system primitives.
- Rebuild the homepage in Diagnosis Command Center form.
- Add visual regression and SEO tests.
- Keep compatibility aliases used by untouched pages.
- Do not promote the branch to production while AdSense review is pending unless
  explicitly approved.

Exit criteria:

- Homepage matches the selected direction.
- H1 and primary search are present in raw HTML.
- Header/footer work on mobile.
- No canonical, robots, or metadata changes.
- Untouched routes remain visually coherent through the compatibility tokens.
- Production indexing behavior is unchanged in any preview exposed to crawlers.

### Phase 2: Core templates

- Repair cost
- OBD detail
- Symptom detail
- AI diagnosis detail
- Quote Checker
- Primary hub pages
- Continue Solving module
- Ad-ready placements with ads disabled

Exit criteria:

- All core templates use shared components.
- One H1 in raw HTML on every template.
- Core answer appears before contextual modules.
- Internal links are crawlable.
- Mobile and desktop tests pass.

### Phase 3: Long-tail and secondary pages

- Vehicles
- Warning lights
- Recall Check
- Symptoms hub
- OBD hub
- Community
- Search
- Account and authentication
- Legal and utility pages
- Remove remaining dark-theme styles

Exit criteria:

- No page uses the old blue/gradient/card-grid language.
- Utility and noindex pages remain noindex.
- All page families share the new visual system.
- Dead design tokens and unused theme code are removed.

## 17. Testing

### Automated

- TypeScript and ESLint.
- Raw HTML SEO tests for status, H1 count, canonical, and robots.
- Playwright visual checks at 375px, 768px, 1280px, and 1440px.
- Keyboard navigation and visible focus.
- Links rendered without JavaScript.
- Ad disabled state produces no DOM space.

### Manual

- Homepage at 360px and 1440px.
- OBD, symptom, AI diagnosis, repair-cost, and Quote Checker at mobile and
  desktop widths.
- Long titles and very short titles.
- Missing vehicle/repair images.
- High-severity, caution, and informational status states.
- Long content tables and FAQ sections.
- No horizontal scrolling or clipped controls.

## 18. Acceptance Criteria

- The full site uses a light-only Roadside Editorial design system.
- The homepage follows Diagnosis Command Center structure.
- High-volume content pages follow Answer First + Continue Below structure.
- Header navigation is reduced and mobile-friendly.
- Existing URLs, canonicals, metadata, sitemap, and robots behavior are unchanged.
- Core answers and H1s remain server-rendered.
- Six contextual internal links are available where relevant.
- No AdSense code or visible ad placeholder is rendered before approval.
- Dark theme switching and runtime `.dark` activation are removed.
- The three rollout phases can be deployed independently without requiring a
  full-site return to the old design.
