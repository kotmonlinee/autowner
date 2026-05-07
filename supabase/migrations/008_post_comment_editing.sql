-- Add 'deleted' value to post_status enum (idempotent).
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumtypid = 'post_status'::regtype AND enumlabel = 'deleted') THEN
    ALTER TYPE post_status ADD VALUE 'deleted';
  END IF;
END $$;
