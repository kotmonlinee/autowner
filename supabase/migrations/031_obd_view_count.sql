-- Add view_count to obd_codes for tracking page visits
ALTER TABLE obd_codes ADD COLUMN IF NOT EXISTS view_count INTEGER NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_obd_codes_view_count ON obd_codes(view_count DESC);
