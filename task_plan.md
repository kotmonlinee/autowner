# AutOwner P0 Fixes — Implementation Plan

## Goal
Fix 5 critical P0 issues from audit.

## Phases

### Phase 1: viewport export → complete
- Added Viewport type import + export to layout.tsx
- themeColor for light/dark mode included

### Phase 2: React cache() on Supabase factories → complete
- createServerSupabase() and createServiceSupabase() wrapped with cache()
- Deduplicates to single client per request

### Phase 3: Full table scan fixes → complete
- getAllRepairSlugs: pagination loop → single .limit(5000) query
- getPopularRepairCosts: added .limit(300) to DB query
- fetchValidRepairSlugs: added .limit(5000)

### Phase 4: width/height on all img/svg → complete
- 89 files, 236 tags updated

### Phase 5: preconnect links → complete
- Added for googletagmanager.com and clarity.ms

### Phase 6: Verify → complete
- TypeScript: zero errors
- Awaiting manual browser test
