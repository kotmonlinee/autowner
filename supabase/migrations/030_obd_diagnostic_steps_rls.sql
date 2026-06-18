-- Allow anonymous read access to obd_diagnostic_steps
ALTER TABLE obd_diagnostic_steps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read diagnostic steps" ON obd_diagnostic_steps
  FOR SELECT
  USING (true);
