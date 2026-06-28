-- Add timestamp columns
ALTER TABLE obd_codes ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();
ALTER TABLE obd_codes ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();
ALTER TABLE repair_costs ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();
ALTER TABLE repair_costs ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();
ALTER TABLE symptoms ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();
ALTER TABLE symptoms ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();
ALTER TABLE vehicle_symptoms ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();
ALTER TABLE vehicle_symptoms ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();
ALTER TABLE diagnoses ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Backfill null values
UPDATE obd_codes SET created_at = '2026-05-07T00:00:00Z', updated_at = '2026-05-07T00:00:00Z' WHERE created_at IS NULL;
UPDATE repair_costs SET created_at = '2026-05-07T00:00:00Z', updated_at = '2026-05-07T00:00:00Z' WHERE created_at IS NULL;
UPDATE symptoms SET created_at = '2026-05-07T00:00:00Z', updated_at = '2026-05-07T00:00:00Z' WHERE created_at IS NULL;
UPDATE vehicle_symptoms SET created_at = '2026-05-07T00:00:00Z', updated_at = '2026-05-07T00:00:00Z' WHERE created_at IS NULL;
UPDATE diagnoses SET updated_at = created_at WHERE updated_at IS NULL;

-- Trigger: auto-update updated_at on every UPDATE
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DO $$
DECLARE
    t text;
BEGIN
    FOR t IN
        SELECT unnest(ARRAY['obd_codes','repair_costs','symptoms','vehicle_symptoms','diagnoses'])
    LOOP
        IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = t || '_updated_at') THEN
            EXECUTE format('CREATE TRIGGER %I_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION update_modified_column()', t, t);
        END IF;
    END LOOP;
END;
$$;
