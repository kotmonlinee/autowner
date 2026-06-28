-- GIN index for JSONB containment queries on diagnosis_json
-- Speeds up fetchRelatedDiagnoses() which uses @>.contains("diagnosis_json", ...)
CREATE INDEX IF NOT EXISTS idx_diagnoses_jsonb_gin ON diagnoses USING GIN (diagnosis_json);
