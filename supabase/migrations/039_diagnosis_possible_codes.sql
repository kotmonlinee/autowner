-- The "related diagnoses" query filters on the possibleCodes array inside
-- diagnosis_json. Filtering the whole JSONB document makes the GIN scan (and
-- the sort by view_count) expensive enough to hit statement_timeout on popular
-- codes such as P0420.
--
-- Store just that array in a generated column and index it separately.
ALTER TABLE diagnoses
  ADD COLUMN IF NOT EXISTS possible_codes jsonb
  GENERATED ALWAYS AS (diagnosis_json->'possibleCodes') STORED;

CREATE INDEX IF NOT EXISTS idx_diagnoses_possible_codes
  ON diagnoses USING GIN (possible_codes jsonb_path_ops);

ANALYZE diagnoses;
