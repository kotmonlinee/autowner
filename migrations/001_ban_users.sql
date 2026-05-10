-- Migration: Add ban columns to profiles
-- Run this against your Supabase SQL editor or via `supabase db push`

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_banned BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS banned_at TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS ban_reason TEXT;
