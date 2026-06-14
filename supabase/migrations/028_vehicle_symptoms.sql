-- Vehicle-specific symptom articles
CREATE TABLE IF NOT EXISTS vehicle_symptoms (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  vehicle_make TEXT NOT NULL,
  vehicle_model TEXT NOT NULL,
  make_slug TEXT NOT NULL,
  model_slug TEXT NOT NULL,
  symptom_slug TEXT NOT NULL REFERENCES symptoms(slug),
  symptom_name TEXT NOT NULL,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  h1 TEXT NOT NULL,
  meta_description TEXT NOT NULL,
  overview TEXT NOT NULL,
  causes JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_vs_slug ON vehicle_symptoms(slug);
CREATE INDEX IF NOT EXISTS idx_vs_make_model ON vehicle_symptoms(make_slug, model_slug);
CREATE INDEX IF NOT EXISTS idx_vs_symptom ON vehicle_symptoms(symptom_slug);
CREATE INDEX IF NOT EXISTS idx_vs_category ON vehicle_symptoms(category);

ALTER TABLE vehicle_symptoms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read vehicle symptoms" ON vehicle_symptoms FOR SELECT USING (true);
