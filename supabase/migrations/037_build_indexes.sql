-- Indexes for generateStaticParams ORDER BY during Vercel build
-- Without these, sorting 12K+ rows during SSG causes build timeout → ISR disabled

CREATE INDEX IF NOT EXISTS idx_obd_codes_severity ON obd_codes(severity DESC);
CREATE INDEX IF NOT EXISTS idx_diagnoses_view_count ON diagnoses(view_count DESC);
