-- Add products JSONB column to posts
ALTER TABLE posts ADD COLUMN IF NOT EXISTS products JSONB;
