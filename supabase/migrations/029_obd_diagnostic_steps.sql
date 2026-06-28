CREATE TABLE IF NOT EXISTS obd_diagnostic_steps (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  obd_code TEXT NOT NULL,
  generated_at TIMESTAMPTZ DEFAULT now(),
  causes JSONB NOT NULL DEFAULT '[]',
  UNIQUE(obd_code)
);

CREATE INDEX idx_obd_diag_code ON obd_diagnostic_steps(obd_code);
