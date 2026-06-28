CREATE TABLE IF NOT EXISTS warning_lights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  severity text NOT NULL CHECK (severity IN ('critical','caution','informational')),
  meaning text NOT NULL,
  causes text[] NOT NULL DEFAULT '{}',
  can_drive text NOT NULL,
  min_cost integer NOT NULL DEFAULT 0,
  max_cost integer NOT NULL DEFAULT 0,
  icon text NOT NULL DEFAULT '',
  related_obd_codes text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE warning_lights ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read warning lights" ON warning_lights FOR SELECT USING (true);

-- Trigger for updated_at
CREATE TRIGGER warning_lights_updated_at BEFORE UPDATE ON warning_lights
  FOR EACH ROW EXECUTE FUNCTION update_modified_column();
