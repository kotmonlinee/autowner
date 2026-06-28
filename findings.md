# Findings

## Audit Results (June 28)
- P0: no viewport export → mobile rendering risk
- P0: all images plain <img>, no width/height → CLS risk
- P0: 3 full table scans in server.ts
- P0: Supabase factories not cached → multiple clients per request
- P1: Navbar tablet gap (640-1023px)
- P1: no preconnect for analytics origins
- P1: loading.tsx hardcoded light mode colors
