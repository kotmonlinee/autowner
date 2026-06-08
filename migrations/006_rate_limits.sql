-- Rate limiting table using Supabase as backing store.
-- Each row represents one action event within a time window.
CREATE TABLE IF NOT EXISTS rate_limits (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  identifier TEXT NOT NULL,
  action TEXT NOT NULL,
  count INTEGER DEFAULT 1,
  window_start TIMESTAMPTZ DEFAULT now(),
  UNIQUE(identifier, action, window_start)
)
;
CREATE INDEX idx_rate_limits_lookup ON rate_limits(identifier, action, window_start DESC);
