-- symptom_obd_codes and symptom_warning_lights junction tables
-- AutOwner Symptoms Knowledge Graph extension

CREATE TABLE IF NOT EXISTS symptom_obd_codes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  symptom_id UUID NOT NULL REFERENCES symptoms(id) ON DELETE CASCADE,
  obd_code TEXT NOT NULL,
  UNIQUE(symptom_id, obd_code)
);

CREATE INDEX IF NOT EXISTS idx_soc_symptom ON symptom_obd_codes(symptom_id);
ALTER TABLE symptom_obd_codes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read symptom OBD codes" ON symptom_obd_codes FOR SELECT USING (true);

CREATE TABLE IF NOT EXISTS symptom_warning_lights (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  symptom_id UUID NOT NULL REFERENCES symptoms(id) ON DELETE CASCADE,
  warning_light_slug TEXT NOT NULL,
  UNIQUE(symptom_id, warning_light_slug)
);

CREATE INDEX IF NOT EXISTS idx_swl_symptom ON symptom_warning_lights(symptom_id);
ALTER TABLE symptom_warning_lights ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read symptom warning lights" ON symptom_warning_lights FOR SELECT USING (true);

-- Seed OBD codes: map symptoms to relevant OBD-II codes based on cause analysis
INSERT INTO symptom_obd_codes (symptom_id, obd_code) SELECT id, 'P0300' FROM symptoms WHERE slug = 'car-shaking-when-accelerating';
INSERT INTO symptom_obd_codes (symptom_id, obd_code) SELECT id, 'P0301' FROM symptoms WHERE slug = 'car-shaking-when-accelerating';
INSERT INTO symptom_obd_codes (symptom_id, obd_code) SELECT id, 'P0304' FROM symptoms WHERE slug = 'car-shaking-when-accelerating';
INSERT INTO symptom_obd_codes (symptom_id, obd_code) SELECT id, 'P0300' FROM symptoms WHERE slug = 'engine-misfire';
INSERT INTO symptom_obd_codes (symptom_id, obd_code) SELECT id, 'P0301' FROM symptoms WHERE slug = 'engine-misfire';
INSERT INTO symptom_obd_codes (symptom_id, obd_code) SELECT id, 'P0302' FROM symptoms WHERE slug = 'engine-misfire';
INSERT INTO symptom_obd_codes (symptom_id, obd_code) SELECT id, 'P0303' FROM symptoms WHERE slug = 'engine-misfire';
INSERT INTO symptom_obd_codes (symptom_id, obd_code) SELECT id, 'P0420' FROM symptoms WHERE slug = 'check-engine-light-on';
INSERT INTO symptom_obd_codes (symptom_id, obd_code) SELECT id, 'P0171' FROM symptoms WHERE slug = 'check-engine-light-on';
INSERT INTO symptom_obd_codes (symptom_id, obd_code) SELECT id, 'P0174' FROM symptoms WHERE slug = 'check-engine-light-on';
INSERT INTO symptom_obd_codes (symptom_id, obd_code) SELECT id, 'P0300' FROM symptoms WHERE slug = 'check-engine-light-on';
INSERT INTO symptom_obd_codes (symptom_id, obd_code) SELECT id, 'P0300' FROM symptoms WHERE slug = 'check-engine-light-flashing';
INSERT INTO symptom_obd_codes (symptom_id, obd_code) SELECT id, 'P0301' FROM symptoms WHERE slug = 'check-engine-light-flashing';
INSERT INTO symptom_obd_codes (symptom_id, obd_code) SELECT id, 'P0300' FROM symptoms WHERE slug = 'rough-idle';
INSERT INTO symptom_obd_codes (symptom_id, obd_code) SELECT id, 'P0171' FROM symptoms WHERE slug = 'rough-idle';
INSERT INTO symptom_obd_codes (symptom_id, obd_code) SELECT id, 'P0507' FROM symptoms WHERE slug = 'rough-idle';
INSERT INTO symptom_obd_codes (symptom_id, obd_code) SELECT id, 'P0300' FROM symptoms WHERE slug = 'car-shaking-at-idle';
INSERT INTO symptom_obd_codes (symptom_id, obd_code) SELECT id, 'P0115' FROM symptoms WHERE slug = 'engine-overheating';
INSERT INTO symptom_obd_codes (symptom_id, obd_code) SELECT id, 'P0128' FROM symptoms WHERE slug = 'engine-overheating';
INSERT INTO symptom_obd_codes (symptom_id, obd_code) SELECT id, 'P0300' FROM symptoms WHERE slug = 'engine-stalling';
INSERT INTO symptom_obd_codes (symptom_id, obd_code) SELECT id, 'P0335' FROM symptoms WHERE slug = 'engine-stalling';
INSERT INTO symptom_obd_codes (symptom_id, obd_code) SELECT id, 'P0420' FROM symptoms WHERE slug = 'loss-of-power';
INSERT INTO symptom_obd_codes (symptom_id, obd_code) SELECT id, 'P0299' FROM symptoms WHERE slug = 'loss-of-power';
INSERT INTO symptom_obd_codes (symptom_id, obd_code) SELECT id, 'P0171' FROM symptoms WHERE slug = 'poor-acceleration';
INSERT INTO symptom_obd_codes (symptom_id, obd_code) SELECT id, 'P0300' FROM symptoms WHERE slug = 'car-wont-start';
INSERT INTO symptom_obd_codes (symptom_id, obd_code) SELECT id, 'P0335' FROM symptoms WHERE slug = 'car-cranks-but-wont-start';
INSERT INTO symptom_obd_codes (symptom_id, obd_code) SELECT id, 'P0300' FROM symptoms WHERE slug = 'car-cranks-but-wont-start';
INSERT INTO symptom_obd_codes (symptom_id, obd_code) SELECT id, 'P0562' FROM symptoms WHERE slug = 'battery-light-on';
INSERT INTO symptom_obd_codes (symptom_id, obd_code) SELECT id, 'P0300' FROM symptoms WHERE slug = 'engine-hesitation';

-- Seed Warning Lights
INSERT INTO symptom_warning_lights (symptom_id, warning_light_slug) SELECT id, 'check-engine' FROM symptoms WHERE slug = 'car-shaking-when-accelerating';
INSERT INTO symptom_warning_lights (symptom_id, warning_light_slug) SELECT id, 'traction-control' FROM symptoms WHERE slug = 'car-shaking-when-accelerating';
INSERT INTO symptom_warning_lights (symptom_id, warning_light_slug) SELECT id, 'check-engine' FROM symptoms WHERE slug = 'engine-misfire';
INSERT INTO symptom_warning_lights (symptom_id, warning_light_slug) SELECT id, 'check-engine' FROM symptoms WHERE slug = 'check-engine-light-on';
INSERT INTO symptom_warning_lights (symptom_id, warning_light_slug) SELECT id, 'check-engine' FROM symptoms WHERE slug = 'check-engine-light-flashing';
INSERT INTO symptom_warning_lights (symptom_id, warning_light_slug) SELECT id, 'check-engine' FROM symptoms WHERE slug = 'engine-stalling';
INSERT INTO symptom_warning_lights (symptom_id, warning_light_slug) SELECT id, 'check-engine' FROM symptoms WHERE slug = 'rough-idle';
INSERT INTO symptom_warning_lights (symptom_id, warning_light_slug) SELECT id, 'battery-charging' FROM symptoms WHERE slug = 'battery-light-on';
INSERT INTO symptom_warning_lights (symptom_id, warning_light_slug) SELECT id, 'oil-pressure' FROM symptoms WHERE slug = 'oil-pressure-light-on';
INSERT INTO symptom_warning_lights (symptom_id, warning_light_slug) SELECT id, 'check-engine' FROM symptoms WHERE slug = 'poor-acceleration';
INSERT INTO symptom_warning_lights (symptom_id, warning_light_slug) SELECT id, 'check-engine' FROM symptoms WHERE slug = 'engine-hesitation';
INSERT INTO symptom_warning_lights (symptom_id, warning_light_slug) SELECT id, 'check-engine' FROM symptoms WHERE slug = 'loss-of-power';
INSERT INTO symptom_warning_lights (symptom_id, warning_light_slug) SELECT id, 'coolant-temperature' FROM symptoms WHERE slug = 'engine-overheating';
INSERT INTO symptom_warning_lights (symptom_id, warning_light_slug) SELECT id, 'coolant-temperature' FROM symptoms WHERE slug = 'temperature-gauge-high';
INSERT INTO symptom_warning_lights (symptom_id, warning_light_slug) SELECT id, 'brake-system' FROM symptoms WHERE slug = 'soft-brake-pedal';
INSERT INTO symptom_warning_lights (symptom_id, warning_light_slug) SELECT id, 'brake-system' FROM symptoms WHERE slug = 'brake-pedal-goes-to-floor';
INSERT INTO symptom_warning_lights (symptom_id, warning_light_slug) SELECT id, 'brake-system' FROM symptoms WHERE slug = 'long-stopping-distance';
INSERT INTO symptom_warning_lights (symptom_id, warning_light_slug) SELECT id, 'abs' FROM symptoms WHERE slug = 'abs-light-on';
INSERT INTO symptom_warning_lights (symptom_id, warning_light_slug) SELECT id, 'check-engine' FROM symptoms WHERE slug = 'car-shaking-at-idle';
INSERT INTO symptom_warning_lights (symptom_id, warning_light_slug) SELECT id, 'battery-charging' FROM symptoms WHERE slug = 'car-wont-start';
INSERT INTO symptom_warning_lights (symptom_id, warning_light_slug) SELECT id, 'oil-pressure' FROM symptoms WHERE slug = 'car-wont-start';
