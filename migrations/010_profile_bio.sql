-- Add bio column to profiles table so users can write a short description.
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio TEXT;
