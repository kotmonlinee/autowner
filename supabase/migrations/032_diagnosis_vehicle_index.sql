-- Speed up vehicle hub page: WHERE vehicle_make = X AND vehicle_model = Y ORDER BY view_count DESC
CREATE INDEX IF NOT EXISTS idx_diagnoses_vehicle_make_model ON diagnoses(vehicle_make, vehicle_model);
CREATE INDEX IF NOT EXISTS idx_diagnoses_vehicle_view ON diagnoses(vehicle_make, vehicle_model, view_count DESC);

-- Lightweight view: extracts title/severity from JSONB, avoids loading full diagnosis_json
CREATE OR REPLACE VIEW diagnosis_summaries AS
SELECT
  slug,
  diagnosis_json->>'title' AS title,
  diagnosis_json->>'severity' AS severity,
  view_count,
  vehicle_make,
  vehicle_model,
  created_at
FROM diagnoses;
