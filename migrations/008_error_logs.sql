CREATE TABLE IF NOT EXISTS error_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  message TEXT NOT NULL,
  stack TEXT,
  url TEXT,
  user_id UUID,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
)
;
CREATE INDEX idx_error_logs_created ON error_logs(created_at DESC);
