-- Migration: Add products JSONB column to posts
-- Run this against your Supabase SQL editor or via `supabase db push`

ALTER TABLE posts ADD COLUMN IF NOT EXISTS products JSONB;
