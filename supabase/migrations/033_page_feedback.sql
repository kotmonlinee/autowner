-- Page feedback: "Was this helpful?" widget
CREATE TABLE IF NOT EXISTS page_feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_url TEXT NOT NULL,
  helpful BOOLEAN NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_page_feedback_url ON page_feedback(page_url);
CREATE INDEX IF NOT EXISTS idx_page_feedback_created ON page_feedback(created_at DESC);
