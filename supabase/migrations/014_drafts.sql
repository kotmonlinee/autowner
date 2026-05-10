-- Add is_draft column to posts
ALTER TABLE posts ADD COLUMN IF NOT EXISTS is_draft BOOLEAN DEFAULT false;

-- Allow authors to read their own posts regardless of status (needed for drafts)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE policyname = 'Authors can read their own posts'
      AND tablename = 'posts'
  ) THEN
    CREATE POLICY "Authors can read their own posts" ON public.posts
      FOR SELECT USING (auth.uid() = author_id);
  END IF;
END $$;
