# Backup Strategy

## Database

### Supabase Pro plan (recommended)

Supabase Pro includes **automatic daily backups** with point-in-time recovery. No
additional configuration required.

### Supabase Free plan

On the free plan, there are no automatic backups. Schedule periodic `pg_dump`
exports to avoid data loss.

#### Export the full database

```bash
pg_dump postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres > backup-$(date +%Y%m%d).sql
```

Replace `[YOUR-PASSWORD]` with the database password (found in Supabase Dashboard
under Project Settings > Database) and `[YOUR-PROJECT-REF]` with your project
reference ID.

#### Automate with cron (macOS/Linux)

```bash
# Run daily at 2:00 AM
0 2 * * * pg_dump postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres > ~/backups/autowner-$(date +\%Y\%m\%d).sql
```

### Restore

```bash
psql postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres < backup-20260505.sql
```

## Code & Assets

### Vercel deployment

Code is deployed via git push to Vercel. The git repository serves as the
primary backup for all source code.

### Uploaded images

Images uploaded via the `/api/upload` endpoint are stored in a Supabase Storage
bucket. These are included in the Supabase daily backups on Pro plan. On the
free plan, periodically download the storage bucket contents via the Supabase
Dashboard or API.

### Environment variables

Store a secure copy of production environment variables outside of the git
repository (e.g., in a password manager). Vercel retains environment variable
history but does not offer a built-in export mechanism.

## Recovery Checklist

1. Restore the database from the latest `pg_dump` backup
2. Re-deploy the latest code from git to Vercel
3. Verify environment variables are set correctly in Vercel
4. Run a smoke test: visit homepage, view a post, sign in
