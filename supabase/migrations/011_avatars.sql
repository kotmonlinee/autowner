-- Add avatar_url column to profiles table so users can upload a profile picture.
-- You must also create the "avatars" storage bucket in your Supabase dashboard:
--   1. Go to Storage → New Bucket
--   2. Name it "avatars"
--   3. Set it as Public
--   4. Under Policies, allow authenticated users to upload/read
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
