-- AI Diagnosis cache table
CREATE TABLE IF NOT EXISTS diagnoses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  symptom_path TEXT NOT NULL, -- structured: "category/subcategory/when"
  vehicle_make TEXT,
  vehicle_model TEXT,
  vehicle_year TEXT,
  diagnosis_json JSONB NOT NULL,
  view_count INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now()
)
;
CREATE INDEX IF NOT EXISTS idx_diagnoses_slug ON diagnoses(slug)
;
CREATE INDEX IF NOT EXISTS idx_diagnoses_view_count ON diagnoses(view_count DESC)
;
-- Public read access;
