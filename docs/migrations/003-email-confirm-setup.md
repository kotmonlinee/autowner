# Email Confirmation Setup

## Step 1: Run the full-text search migration

Open the [Supabase SQL Editor](https://supabase.com/dashboard/project/_/sql/new) for your project and run:

```sql
-- Add a generated tsvector column for full-text search
ALTER TABLE posts ADD COLUMN IF NOT EXISTS search_vector tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(body, '')), 'B')
  ) STORED;

-- Create GIN index for fast full-text search
CREATE INDEX IF NOT EXISTS idx_posts_search ON posts USING GIN(search_vector);
```

Alternatively, run the migration file from the terminal:

```bash
supabase db push
```

Or copy/paste the contents of `supabase/migrations/003_fulltext_search.sql` into the SQL Editor.

## Step 2: Enable email confirmations in Supabase

1. Go to [Supabase Dashboard](https://supabase.com/dashboard) → select your project
2. Navigate to **Authentication** → **Settings** → **Email**
3. Enable **"Confirm email"** (also labeled "Enable email confirmations" in some UI versions)
4. Click **Save**

This requires users to click a link in a confirmation email before they can sign in. The `/auth/confirm` route handles the verification callback.

## Step 3: Verify

1. Register a new account — you should see a "Check your email" message instead of being immediately logged in.
2. Check the email (in development, emails are captured by Supabase's local email server at http://localhost:54324).
3. Click the confirmation link — it should redirect you to the home page, authenticated.
