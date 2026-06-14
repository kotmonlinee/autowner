-- Symptoms Knowledge Graph V1
-- 50 symptoms with cause mappings (bulletproof INSERT format)

CREATE TABLE IF NOT EXISTS symptoms (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('low','medium','high','critical')),
  driving_risk TEXT NOT NULL DEFAULT 'limited' CHECK (driving_risk IN ('safe','limited','unsafe')),
  overview TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_symptoms_category ON symptoms(category);
CREATE INDEX IF NOT EXISTS idx_symptoms_severity ON symptoms(severity);

ALTER TABLE symptoms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read symptoms" ON symptoms FOR SELECT USING (true);

CREATE TABLE IF NOT EXISTS symptom_causes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  symptom_id UUID NOT NULL REFERENCES symptoms(id) ON DELETE CASCADE,
  cause_name TEXT NOT NULL,
  repair_slug TEXT,
  probability INTEGER NOT NULL CHECK (probability BETWEEN 1 AND 100),
  severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('low','medium','high','critical'))
);

CREATE INDEX IF NOT EXISTS idx_symptom_causes_symptom ON symptom_causes(symptom_id);

ALTER TABLE symptom_causes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read symptom causes" ON symptom_causes FOR SELECT USING (true);

-- ============================================================
-- SEED DATA
-- ============================================================

INSERT INTO symptoms (slug, name, category, severity, driving_risk) VALUES
('car-wont-start', 'Car Won''t Start', 'starting', 'high', 'unsafe'),
('car-cranks-but-wont-start', 'Car Cranks But Won''t Start', 'starting', 'high', 'unsafe'),
('no-crank-no-start', 'No Crank No Start', 'starting', 'critical', 'unsafe'),
('slow-cranking', 'Slow Cranking', 'starting', 'medium', 'limited'),
('car-starts-then-dies', 'Car Starts Then Dies', 'starting', 'high', 'limited'),
('hard-starting', 'Hard Starting', 'starting', 'medium', 'limited'),
('car-shaking-when-accelerating', 'Car Shaking When Accelerating', 'vibration', 'medium', 'limited'),
('car-shaking-at-idle', 'Car Shaking At Idle', 'vibration', 'medium', 'safe'),
('steering-wheel-shaking', 'Steering Wheel Shaking', 'vibration', 'medium', 'limited'),
('car-vibrates-at-highway-speeds', 'Car Vibrates At Highway Speeds', 'vibration', 'medium', 'limited'),
('car-shakes-when-braking', 'Car Shakes When Braking', 'vibration', 'high', 'limited'),
('engine-vibration', 'Engine Vibration', 'vibration', 'medium', 'limited'),
('rough-idle', 'Rough Idle', 'performance', 'medium', 'safe'),
('engine-misfire', 'Engine Misfire', 'performance', 'high', 'limited'),
('engine-stalling', 'Engine Stalling', 'performance', 'high', 'unsafe'),
('loss-of-power', 'Loss Of Power', 'performance', 'medium', 'limited'),
('poor-acceleration', 'Poor Acceleration', 'performance', 'medium', 'limited'),
('engine-hesitation', 'Engine Hesitation', 'performance', 'medium', 'limited'),
('check-engine-light-on', 'Check Engine Light On', 'warning_lights', 'medium', 'safe'),
('check-engine-light-flashing', 'Check Engine Light Flashing', 'warning_lights', 'critical', 'unsafe'),
('abs-light-on', 'ABS Light On', 'warning_lights', 'high', 'limited'),
('battery-light-on', 'Battery Light On', 'warning_lights', 'high', 'limited'),
('oil-pressure-light-on', 'Oil Pressure Light On', 'warning_lights', 'critical', 'unsafe'),
('traction-control-light-on', 'Traction Control Light On', 'warning_lights', 'medium', 'safe'),
('engine-overheating', 'Engine Overheating', 'temperature', 'critical', 'unsafe'),
('temperature-gauge-high', 'Temperature Gauge High', 'temperature', 'critical', 'unsafe'),
('coolant-boiling', 'Coolant Boiling', 'temperature', 'critical', 'unsafe'),
('heater-not-working', 'Heater Not Working', 'temperature', 'medium', 'safe'),
('clicking-noise-when-turning', 'Clicking Noise When Turning', 'noise', 'medium', 'safe'),
('grinding-noise-when-braking', 'Grinding Noise When Braking', 'noise', 'high', 'unsafe'),
('squealing-noise', 'Squealing Noise', 'noise', 'medium', 'safe'),
('rattling-noise', 'Rattling Noise', 'noise', 'low', 'safe'),
('knocking-noise', 'Knocking Noise', 'noise', 'critical', 'unsafe'),
('ticking-noise', 'Ticking Noise', 'noise', 'medium', 'safe'),
('whining-noise', 'Whining Noise', 'noise', 'medium', 'limited'),
('humming-noise', 'Humming Noise', 'noise', 'medium', 'safe'),
('popping-noise', 'Popping Noise', 'noise', 'medium', 'limited'),
('clunking-noise', 'Clunking Noise', 'noise', 'medium', 'limited'),
('burning-smell', 'Burning Smell', 'smells', 'high', 'limited'),
('gas-smell', 'Gas Smell', 'smells', 'high', 'unsafe'),
('coolant-smell', 'Coolant Smell', 'smells', 'medium', 'limited'),
('burning-oil-smell', 'Burning Oil Smell', 'smells', 'medium', 'limited'),
('rotten-egg-smell', 'Rotten Egg Smell', 'smells', 'medium', 'limited'),
('white-smoke-exhaust', 'White Smoke from Exhaust', 'smoke', 'critical', 'unsafe'),
('blue-smoke-exhaust', 'Blue Smoke from Exhaust', 'smoke', 'critical', 'unsafe'),
('black-smoke-exhaust', 'Black Smoke from Exhaust', 'smoke', 'high', 'limited'),
('smoke-from-engine-bay', 'Smoke From Engine Bay', 'smoke', 'critical', 'unsafe'),
('oil-leak', 'Oil Leak', 'leaks', 'medium', 'safe'),
('coolant-leak', 'Coolant Leak', 'leaks', 'high', 'limited'),
('transmission-fluid-leak', 'Transmission Fluid Leak', 'leaks', 'high', 'limited'),
('brake-fluid-leak', 'Brake Fluid Leak', 'leaks', 'critical', 'unsafe'),
('power-steering-leak', 'Power Steering Leak', 'leaks', 'medium', 'limited'),
('soft-brake-pedal', 'Soft Brake Pedal', 'brakes', 'critical', 'unsafe'),
('brake-pedal-goes-to-floor', 'Brake Pedal Goes To Floor', 'brakes', 'critical', 'unsafe'),
('brake-pulsation', 'Brake Pulsation', 'brakes', 'high', 'limited'),
('long-stopping-distance', 'Long Stopping Distance', 'brakes', 'critical', 'unsafe'),
('brake-dragging', 'Brake Dragging', 'brakes', 'high', 'limited'),
('car-pulls-to-one-side', 'Car Pulls To One Side', 'steering', 'medium', 'limited');

-- ============================================================
-- CAUSES: Individual INSERTs (most reliable format)
-- ============================================================

-- Car Won't Start
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Battery Replacement', 'battery', 95, 'high' FROM symptoms WHERE slug = 'car-wont-start';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Starter Replacement', 'starter', 90, 'high' FROM symptoms WHERE slug = 'car-wont-start';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Alternator Replacement', 'alternator', 75, 'high' FROM symptoms WHERE slug = 'car-wont-start';
INSERT INTO symptom_causes (symptom_id, cause_name, probability, severity) SELECT id, 'Ignition Switch Failure', 70, 'high' FROM symptoms WHERE slug = 'car-wont-start';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Fuel Pump Replacement', 'fuel_pump', 85, 'high' FROM symptoms WHERE slug = 'car-wont-start';
INSERT INTO symptom_causes (symptom_id, cause_name, probability, severity) SELECT id, 'Crankshaft Position Sensor Failure', 80, 'critical' FROM symptoms WHERE slug = 'car-wont-start';
INSERT INTO symptom_causes (symptom_id, cause_name, probability, severity) SELECT id, 'Camshaft Position Sensor Failure', 70, 'high' FROM symptoms WHERE slug = 'car-wont-start';

-- Car Cranks But Won't Start
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Fuel Pump Replacement', 'fuel_pump', 90, 'high' FROM symptoms WHERE slug = 'car-cranks-but-wont-start';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Spark Plugs Replacement', 'spark_plugs', 85, 'high' FROM symptoms WHERE slug = 'car-cranks-but-wont-start';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Ignition Coil Replacement', 'ignition_coil', 80, 'high' FROM symptoms WHERE slug = 'car-cranks-but-wont-start';
INSERT INTO symptom_causes (symptom_id, cause_name, probability, severity) SELECT id, 'Crankshaft Position Sensor Failure', 80, 'critical' FROM symptoms WHERE slug = 'car-cranks-but-wont-start';
INSERT INTO symptom_causes (symptom_id, cause_name, probability, severity) SELECT id, 'Camshaft Position Sensor Failure', 75, 'high' FROM symptoms WHERE slug = 'car-cranks-but-wont-start';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Fuel Injector Replacement', 'fuel_injector', 70, 'high' FROM symptoms WHERE slug = 'car-cranks-but-wont-start';

-- No Crank No Start
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Battery Replacement', 'battery', 95, 'high' FROM symptoms WHERE slug = 'no-crank-no-start';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Starter Replacement', 'starter', 90, 'high' FROM symptoms WHERE slug = 'no-crank-no-start';
INSERT INTO symptom_causes (symptom_id, cause_name, probability, severity) SELECT id, 'Starter Relay Failure', 80, 'high' FROM symptoms WHERE slug = 'no-crank-no-start';
INSERT INTO symptom_causes (symptom_id, cause_name, probability, severity) SELECT id, 'Ignition Switch Failure', 75, 'high' FROM symptoms WHERE slug = 'no-crank-no-start';
INSERT INTO symptom_causes (symptom_id, cause_name, probability, severity) SELECT id, 'Neutral Safety Switch Failure', 70, 'medium' FROM symptoms WHERE slug = 'no-crank-no-start';
INSERT INTO symptom_causes (symptom_id, cause_name, probability, severity) SELECT id, 'Battery Cable Corrosion', 85, 'medium' FROM symptoms WHERE slug = 'no-crank-no-start';

-- Slow Cranking
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Battery Replacement', 'battery', 95, 'high' FROM symptoms WHERE slug = 'slow-cranking';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Starter Replacement', 'starter', 85, 'high' FROM symptoms WHERE slug = 'slow-cranking';
INSERT INTO symptom_causes (symptom_id, cause_name, probability, severity) SELECT id, 'Battery Cable Corrosion', 80, 'medium' FROM symptoms WHERE slug = 'slow-cranking';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Alternator Replacement', 'alternator', 75, 'medium' FROM symptoms WHERE slug = 'slow-cranking';

-- Car Starts Then Dies
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Fuel Pump Replacement', 'fuel_pump', 90, 'high' FROM symptoms WHERE slug = 'car-starts-then-dies';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Mass Air Flow Sensor Replacement', 'mass_air_flow_sensor', 85, 'medium' FROM symptoms WHERE slug = 'car-starts-then-dies';
INSERT INTO symptom_causes (symptom_id, cause_name, probability, severity) SELECT id, 'Idle Air Control Valve Failure', 80, 'medium' FROM symptoms WHERE slug = 'car-starts-then-dies';
INSERT INTO symptom_causes (symptom_id, cause_name, probability, severity) SELECT id, 'Crankshaft Position Sensor Failure', 80, 'critical' FROM symptoms WHERE slug = 'car-starts-then-dies';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Throttle Body Replacement', 'throttle_body', 70, 'medium' FROM symptoms WHERE slug = 'car-starts-then-dies';

-- Hard Starting
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Fuel Pump Replacement', 'fuel_pump', 85, 'high' FROM symptoms WHERE slug = 'hard-starting';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Spark Plugs Replacement', 'spark_plugs', 90, 'medium' FROM symptoms WHERE slug = 'hard-starting';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Ignition Coil Replacement', 'ignition_coil', 85, 'medium' FROM symptoms WHERE slug = 'hard-starting';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Fuel Injector Replacement', 'fuel_injector', 80, 'medium' FROM symptoms WHERE slug = 'hard-starting';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Mass Air Flow Sensor Replacement', 'mass_air_flow_sensor', 75, 'medium' FROM symptoms WHERE slug = 'hard-starting';

-- Car Shaking When Accelerating
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Spark Plugs Replacement', 'spark_plugs', 90, 'medium' FROM symptoms WHERE slug = 'car-shaking-when-accelerating';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Ignition Coil Replacement', 'ignition_coil', 85, 'medium' FROM symptoms WHERE slug = 'car-shaking-when-accelerating';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'CV Axle Replacement', 'cv_axle', 75, 'high' FROM symptoms WHERE slug = 'car-shaking-when-accelerating';
INSERT INTO symptom_causes (symptom_id, cause_name, probability, severity) SELECT id, 'Unbalanced Tires', 70, 'low' FROM symptoms WHERE slug = 'car-shaking-when-accelerating';
INSERT INTO symptom_causes (symptom_id, cause_name, probability, severity) SELECT id, 'Worn Tires', 80, 'medium' FROM symptoms WHERE slug = 'car-shaking-when-accelerating';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Engine Mount Replacement', 'engine_mount', 75, 'high' FROM symptoms WHERE slug = 'car-shaking-when-accelerating';

-- Car Shaking At Idle
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Spark Plugs Replacement', 'spark_plugs', 90, 'medium' FROM symptoms WHERE slug = 'car-shaking-at-idle';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Ignition Coil Replacement', 'ignition_coil', 85, 'medium' FROM symptoms WHERE slug = 'car-shaking-at-idle';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Engine Mount Replacement', 'engine_mount', 80, 'high' FROM symptoms WHERE slug = 'car-shaking-at-idle';
INSERT INTO symptom_causes (symptom_id, cause_name, probability, severity) SELECT id, 'Vacuum Leak', 75, 'medium' FROM symptoms WHERE slug = 'car-shaking-at-idle';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Fuel Injector Replacement', 'fuel_injector', 80, 'medium' FROM symptoms WHERE slug = 'car-shaking-at-idle';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Throttle Body Replacement', 'throttle_body', 70, 'medium' FROM symptoms WHERE slug = 'car-shaking-at-idle';

-- Steering Wheel Shaking
INSERT INTO symptom_causes (symptom_id, cause_name, probability, severity) SELECT id, 'Unbalanced Wheels', 90, 'medium' FROM symptoms WHERE slug = 'steering-wheel-shaking';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Rotor Replacement', 'rotor_front', 85, 'high' FROM symptoms WHERE slug = 'steering-wheel-shaking';
INSERT INTO symptom_causes (symptom_id, cause_name, probability, severity) SELECT id, 'Worn Tires', 80, 'medium' FROM symptoms WHERE slug = 'steering-wheel-shaking';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Tie Rod Ends Replacement', 'tie_rod_ends', 75, 'medium' FROM symptoms WHERE slug = 'steering-wheel-shaking';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Wheel Bearing Replacement', 'wheel_bearing', 70, 'medium' FROM symptoms WHERE slug = 'steering-wheel-shaking';

-- Car Vibrates At Highway Speeds
INSERT INTO symptom_causes (symptom_id, cause_name, probability, severity) SELECT id, 'Unbalanced Wheels', 90, 'medium' FROM symptoms WHERE slug = 'car-vibrates-at-highway-speeds';
INSERT INTO symptom_causes (symptom_id, cause_name, probability, severity) SELECT id, 'Worn Tires', 85, 'medium' FROM symptoms WHERE slug = 'car-vibrates-at-highway-speeds';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Wheel Bearing Replacement', 'wheel_bearing', 75, 'medium' FROM symptoms WHERE slug = 'car-vibrates-at-highway-speeds';
INSERT INTO symptom_causes (symptom_id, cause_name, probability, severity) SELECT id, 'Driveshaft Issue', 70, 'high' FROM symptoms WHERE slug = 'car-vibrates-at-highway-speeds';
INSERT INTO symptom_causes (symptom_id, cause_name, probability, severity) SELECT id, 'Wheel Alignment Needed', 80, 'low' FROM symptoms WHERE slug = 'car-vibrates-at-highway-speeds';

-- Car Shakes When Braking
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Rotor Replacement', 'rotor_front', 90, 'high' FROM symptoms WHERE slug = 'car-shakes-when-braking';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Brake Pads Replacement', 'brake_pads_front', 80, 'medium' FROM symptoms WHERE slug = 'car-shakes-when-braking';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Brake Caliper Replacement', 'brake_caliper', 75, 'high' FROM symptoms WHERE slug = 'car-shakes-when-braking';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Wheel Bearing Replacement', 'wheel_bearing', 70, 'medium' FROM symptoms WHERE slug = 'car-shakes-when-braking';

-- Engine Vibration
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Engine Mount Replacement', 'engine_mount', 90, 'high' FROM symptoms WHERE slug = 'engine-vibration';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Spark Plugs Replacement', 'spark_plugs', 85, 'medium' FROM symptoms WHERE slug = 'engine-vibration';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Ignition Coil Replacement', 'ignition_coil', 85, 'medium' FROM symptoms WHERE slug = 'engine-vibration';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Fuel Injector Replacement', 'fuel_injector', 80, 'medium' FROM symptoms WHERE slug = 'engine-vibration';
INSERT INTO symptom_causes (symptom_id, cause_name, probability, severity) SELECT id, 'Vacuum Leak', 75, 'medium' FROM symptoms WHERE slug = 'engine-vibration';

-- Rough Idle
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Spark Plugs Replacement', 'spark_plugs', 90, 'medium' FROM symptoms WHERE slug = 'rough-idle';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Ignition Coil Replacement', 'ignition_coil', 85, 'medium' FROM symptoms WHERE slug = 'rough-idle';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Throttle Body Replacement', 'throttle_body', 80, 'medium' FROM symptoms WHERE slug = 'rough-idle';
INSERT INTO symptom_causes (symptom_id, cause_name, probability, severity) SELECT id, 'Vacuum Leak', 75, 'medium' FROM symptoms WHERE slug = 'rough-idle';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Fuel Injector Replacement', 'fuel_injector', 80, 'medium' FROM symptoms WHERE slug = 'rough-idle';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Mass Air Flow Sensor Replacement', 'mass_air_flow_sensor', 85, 'medium' FROM symptoms WHERE slug = 'rough-idle';

-- Engine Misfire
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Spark Plugs Replacement', 'spark_plugs', 95, 'high' FROM symptoms WHERE slug = 'engine-misfire';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Ignition Coil Replacement', 'ignition_coil', 90, 'high' FROM symptoms WHERE slug = 'engine-misfire';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Fuel Injector Replacement', 'fuel_injector', 85, 'high' FROM symptoms WHERE slug = 'engine-misfire';
INSERT INTO symptom_causes (symptom_id, cause_name, probability, severity) SELECT id, 'Intake Manifold Gasket Leak', 70, 'high' FROM symptoms WHERE slug = 'engine-misfire';
INSERT INTO symptom_causes (symptom_id, cause_name, probability, severity) SELECT id, 'Low Compression', 60, 'critical' FROM symptoms WHERE slug = 'engine-misfire';

-- Engine Stalling
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Fuel Pump Replacement', 'fuel_pump', 90, 'high' FROM symptoms WHERE slug = 'engine-stalling';
INSERT INTO symptom_causes (symptom_id, cause_name, probability, severity) SELECT id, 'Crankshaft Position Sensor Failure', 85, 'critical' FROM symptoms WHERE slug = 'engine-stalling';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Mass Air Flow Sensor Replacement', 'mass_air_flow_sensor', 85, 'medium' FROM symptoms WHERE slug = 'engine-stalling';
INSERT INTO symptom_causes (symptom_id, cause_name, probability, severity) SELECT id, 'Idle Air Control Valve Failure', 80, 'medium' FROM symptoms WHERE slug = 'engine-stalling';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Throttle Body Replacement', 'throttle_body', 75, 'medium' FROM symptoms WHERE slug = 'engine-stalling';

-- Loss Of Power
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Catalytic Converter Replacement', 'catalytic_converter', 85, 'high' FROM symptoms WHERE slug = 'loss-of-power';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Fuel Pump Replacement', 'fuel_pump', 85, 'high' FROM symptoms WHERE slug = 'loss-of-power';
INSERT INTO symptom_causes (symptom_id, cause_name, probability, severity) SELECT id, 'Turbocharger Failure', 70, 'critical' FROM symptoms WHERE slug = 'loss-of-power';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Mass Air Flow Sensor Replacement', 'mass_air_flow_sensor', 80, 'medium' FROM symptoms WHERE slug = 'loss-of-power';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Oxygen Sensor Replacement', 'oxygen_sensor', 75, 'medium' FROM symptoms WHERE slug = 'loss-of-power';

-- Poor Acceleration
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Spark Plugs Replacement', 'spark_plugs', 90, 'medium' FROM symptoms WHERE slug = 'poor-acceleration';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Ignition Coil Replacement', 'ignition_coil', 85, 'medium' FROM symptoms WHERE slug = 'poor-acceleration';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Fuel Pump Replacement', 'fuel_pump', 80, 'high' FROM symptoms WHERE slug = 'poor-acceleration';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Catalytic Converter Replacement', 'catalytic_converter', 75, 'high' FROM symptoms WHERE slug = 'poor-acceleration';
INSERT INTO symptom_causes (symptom_id, cause_name, probability, severity) SELECT id, 'Transmission Issue', 65, 'critical' FROM symptoms WHERE slug = 'poor-acceleration';

-- Engine Hesitation
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Mass Air Flow Sensor Replacement', 'mass_air_flow_sensor', 85, 'medium' FROM symptoms WHERE slug = 'engine-hesitation';
INSERT INTO symptom_causes (symptom_id, cause_name, probability, severity) SELECT id, 'Throttle Position Sensor Failure', 80, 'medium' FROM symptoms WHERE slug = 'engine-hesitation';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Fuel Pump Replacement', 'fuel_pump', 80, 'high' FROM symptoms WHERE slug = 'engine-hesitation';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Fuel Injector Replacement', 'fuel_injector', 80, 'medium' FROM symptoms WHERE slug = 'engine-hesitation';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Spark Plugs Replacement', 'spark_plugs', 85, 'medium' FROM symptoms WHERE slug = 'engine-hesitation';

-- Check Engine Light On
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Oxygen Sensor Replacement', 'oxygen_sensor', 85, 'medium' FROM symptoms WHERE slug = 'check-engine-light-on';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Spark Plugs Replacement', 'spark_plugs', 90, 'medium' FROM symptoms WHERE slug = 'check-engine-light-on';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Catalytic Converter Replacement', 'catalytic_converter', 80, 'high' FROM symptoms WHERE slug = 'check-engine-light-on';
INSERT INTO symptom_causes (symptom_id, cause_name, probability, severity) SELECT id, 'EVAP System Leak', 75, 'low' FROM symptoms WHERE slug = 'check-engine-light-on';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Mass Air Flow Sensor Replacement', 'mass_air_flow_sensor', 85, 'medium' FROM symptoms WHERE slug = 'check-engine-light-on';
INSERT INTO symptom_causes (symptom_id, cause_name, probability, severity) SELECT id, 'Loose Fuel Cap', 70, 'low' FROM symptoms WHERE slug = 'check-engine-light-on';

-- Check Engine Light Flashing
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Spark Plugs Replacement', 'spark_plugs', 95, 'critical' FROM symptoms WHERE slug = 'check-engine-light-flashing';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Ignition Coil Replacement', 'ignition_coil', 90, 'critical' FROM symptoms WHERE slug = 'check-engine-light-flashing';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Fuel Injector Replacement', 'fuel_injector', 85, 'high' FROM symptoms WHERE slug = 'check-engine-light-flashing';
INSERT INTO symptom_causes (symptom_id, cause_name, probability, severity) SELECT id, 'Low Compression', 70, 'critical' FROM symptoms WHERE slug = 'check-engine-light-flashing';

-- ABS Light On
INSERT INTO symptom_causes (symptom_id, cause_name, probability, severity) SELECT id, 'ABS Sensor Failure', 90, 'medium' FROM symptoms WHERE slug = 'abs-light-on';
INSERT INTO symptom_causes (symptom_id, cause_name, probability, severity) SELECT id, 'ABS Module Failure', 75, 'critical' FROM symptoms WHERE slug = 'abs-light-on';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Brake Fluid Service Needed', 'brake_fluid_flush', 70, 'medium' FROM symptoms WHERE slug = 'abs-light-on';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Wheel Bearing Replacement', 'wheel_bearing', 75, 'medium' FROM symptoms WHERE slug = 'abs-light-on';

-- Battery Light On
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Alternator Replacement', 'alternator', 95, 'high' FROM symptoms WHERE slug = 'battery-light-on';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Battery Replacement', 'battery', 90, 'high' FROM symptoms WHERE slug = 'battery-light-on';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Serpentine Belt Replacement', 'serpentine_belt', 85, 'medium' FROM symptoms WHERE slug = 'battery-light-on';
INSERT INTO symptom_causes (symptom_id, cause_name, probability, severity) SELECT id, 'Battery Cable Corrosion', 80, 'medium' FROM symptoms WHERE slug = 'battery-light-on';

-- Oil Pressure Light On
INSERT INTO symptom_causes (symptom_id, cause_name, probability, severity) SELECT id, 'Oil Pressure Sensor Failure', 85, 'high' FROM symptoms WHERE slug = 'oil-pressure-light-on';
INSERT INTO symptom_causes (symptom_id, cause_name, probability, severity) SELECT id, 'Oil Pump Failure', 80, 'critical' FROM symptoms WHERE slug = 'oil-pressure-light-on';
INSERT INTO symptom_causes (symptom_id, cause_name, probability, severity) SELECT id, 'Engine Wear', 60, 'critical' FROM symptoms WHERE slug = 'oil-pressure-light-on';

-- Traction Control Light On
INSERT INTO symptom_causes (symptom_id, cause_name, probability, severity) SELECT id, 'Wheel Speed Sensor Failure', 90, 'medium' FROM symptoms WHERE slug = 'traction-control-light-on';
INSERT INTO symptom_causes (symptom_id, cause_name, probability, severity) SELECT id, 'Steering Angle Sensor Failure', 80, 'medium' FROM symptoms WHERE slug = 'traction-control-light-on';
INSERT INTO symptom_causes (symptom_id, cause_name, probability, severity) SELECT id, 'ABS Module Failure', 75, 'high' FROM symptoms WHERE slug = 'traction-control-light-on';

-- Engine Overheating
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Thermostat Replacement', 'thermostat', 90, 'high' FROM symptoms WHERE slug = 'engine-overheating';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Water Pump Replacement', 'water_pump', 90, 'high' FROM symptoms WHERE slug = 'engine-overheating';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Radiator Replacement', 'radiator', 85, 'high' FROM symptoms WHERE slug = 'engine-overheating';
INSERT INTO symptom_causes (symptom_id, cause_name, probability, severity) SELECT id, 'Cooling Fan Failure', 80, 'high' FROM symptoms WHERE slug = 'engine-overheating';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Head Gasket Replacement', 'head_gasket', 60, 'critical' FROM symptoms WHERE slug = 'engine-overheating';

-- Temperature Gauge High
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Thermostat Replacement', 'thermostat', 90, 'high' FROM symptoms WHERE slug = 'temperature-gauge-high';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Water Pump Replacement', 'water_pump', 85, 'high' FROM symptoms WHERE slug = 'temperature-gauge-high';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Radiator Replacement', 'radiator', 85, 'high' FROM symptoms WHERE slug = 'temperature-gauge-high';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Coolant Flush', 'coolant_flush', 80, 'low' FROM symptoms WHERE slug = 'temperature-gauge-high';

-- Coolant Boiling
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Head Gasket Replacement', 'head_gasket', 70, 'critical' FROM symptoms WHERE slug = 'coolant-boiling';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Thermostat Replacement', 'thermostat', 85, 'high' FROM symptoms WHERE slug = 'coolant-boiling';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Radiator Replacement', 'radiator', 80, 'high' FROM symptoms WHERE slug = 'coolant-boiling';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Water Pump Replacement', 'water_pump', 80, 'high' FROM symptoms WHERE slug = 'coolant-boiling';

-- Heater Not Working
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Heater Core Replacement', 'heater_core', 80, 'medium' FROM symptoms WHERE slug = 'heater-not-working';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Thermostat Replacement', 'thermostat', 85, 'high' FROM symptoms WHERE slug = 'heater-not-working';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Coolant Flush', 'coolant_flush', 75, 'low' FROM symptoms WHERE slug = 'heater-not-working';
INSERT INTO symptom_causes (symptom_id, cause_name, probability, severity) SELECT id, 'Blend Door Actuator Failure', 70, 'medium' FROM symptoms WHERE slug = 'heater-not-working';

-- Noise symptoms (10)
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'CV Axle Replacement', 'cv_axle', 90, 'high' FROM symptoms WHERE slug = 'clicking-noise-when-turning';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Tie Rod Ends Replacement', 'tie_rod_ends', 80, 'medium' FROM symptoms WHERE slug = 'clicking-noise-when-turning';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Wheel Bearing Replacement', 'wheel_bearing', 75, 'medium' FROM symptoms WHERE slug = 'clicking-noise-when-turning';

INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Brake Pads Replacement', 'brake_pads_front', 95, 'high' FROM symptoms WHERE slug = 'grinding-noise-when-braking';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Rotor Replacement', 'rotor_front', 90, 'high' FROM symptoms WHERE slug = 'grinding-noise-when-braking';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Brake Caliper Replacement', 'brake_caliper', 75, 'high' FROM symptoms WHERE slug = 'grinding-noise-when-braking';

INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Brake Pads Replacement', 'brake_pads_front', 90, 'medium' FROM symptoms WHERE slug = 'squealing-noise';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Serpentine Belt Replacement', 'serpentine_belt', 85, 'medium' FROM symptoms WHERE slug = 'squealing-noise';
INSERT INTO symptom_causes (symptom_id, cause_name, probability, severity) SELECT id, 'Belt Tensioner Failure', 80, 'medium' FROM symptoms WHERE slug = 'squealing-noise';

INSERT INTO symptom_causes (symptom_id, cause_name, probability, severity) SELECT id, 'Loose Heat Shield', 85, 'low' FROM symptoms WHERE slug = 'rattling-noise';
INSERT INTO symptom_causes (symptom_id, cause_name, probability, severity) SELECT id, 'Exhaust System Issue', 80, 'medium' FROM symptoms WHERE slug = 'rattling-noise';
INSERT INTO symptom_causes (symptom_id, cause_name, probability, severity) SELECT id, 'Sway Bar Link Failure', 80, 'medium' FROM symptoms WHERE slug = 'rattling-noise';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Engine Mount Replacement', 'engine_mount', 75, 'high' FROM symptoms WHERE slug = 'rattling-noise';

INSERT INTO symptom_causes (symptom_id, cause_name, probability, severity) SELECT id, 'Engine Knock', 90, 'critical' FROM symptoms WHERE slug = 'knocking-noise';
INSERT INTO symptom_causes (symptom_id, cause_name, probability, severity) SELECT id, 'Rod Bearing Failure', 70, 'critical' FROM symptoms WHERE slug = 'knocking-noise';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Spark Plugs Replacement', 'spark_plugs', 60, 'medium' FROM symptoms WHERE slug = 'knocking-noise';

INSERT INTO symptom_causes (symptom_id, cause_name, probability, severity) SELECT id, 'Valve Adjustment Needed', 80, 'medium' FROM symptoms WHERE slug = 'ticking-noise';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Oil Change Needed', 'oil_change_synthetic', 85, 'low' FROM symptoms WHERE slug = 'ticking-noise';
INSERT INTO symptom_causes (symptom_id, cause_name, probability, severity) SELECT id, 'Lifter Issue', 75, 'medium' FROM symptoms WHERE slug = 'ticking-noise';

INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Power Steering Pump Replacement', 'power_steering_pump', 85, 'medium' FROM symptoms WHERE slug = 'whining-noise';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Wheel Bearing Replacement', 'wheel_bearing', 80, 'medium' FROM symptoms WHERE slug = 'whining-noise';
INSERT INTO symptom_causes (symptom_id, cause_name, probability, severity) SELECT id, 'Transmission Issue', 70, 'critical' FROM symptoms WHERE slug = 'whining-noise';

INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Wheel Bearing Replacement', 'wheel_bearing', 85, 'medium' FROM symptoms WHERE slug = 'humming-noise';
INSERT INTO symptom_causes (symptom_id, cause_name, probability, severity) SELECT id, 'Worn Tires', 80, 'medium' FROM symptoms WHERE slug = 'humming-noise';
INSERT INTO symptom_causes (symptom_id, cause_name, probability, severity) SELECT id, 'Differential Issue', 70, 'high' FROM symptoms WHERE slug = 'humming-noise';

INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Ball Joints Replacement', 'ball_joints', 85, 'high' FROM symptoms WHERE slug = 'popping-noise';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'CV Axle Replacement', 'cv_axle', 80, 'high' FROM symptoms WHERE slug = 'popping-noise';
INSERT INTO symptom_causes (symptom_id, cause_name, probability, severity) SELECT id, 'Exhaust System Issue', 75, 'medium' FROM symptoms WHERE slug = 'popping-noise';

INSERT INTO symptom_causes (symptom_id, cause_name, probability, severity) SELECT id, 'Sway Bar Link Failure', 85, 'medium' FROM symptoms WHERE slug = 'clunking-noise';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Control Arms Replacement', 'control_arms', 80, 'high' FROM symptoms WHERE slug = 'clunking-noise';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Struts Replacement', 'struts_front', 75, 'high' FROM symptoms WHERE slug = 'clunking-noise';

-- Smells
INSERT INTO symptom_causes (symptom_id, cause_name, probability, severity) SELECT id, 'Oil Leak onto Exhaust', 90, 'high' FROM symptoms WHERE slug = 'burning-smell';
INSERT INTO symptom_causes (symptom_id, cause_name, probability, severity) SELECT id, 'Brake Issue', 85, 'high' FROM symptoms WHERE slug = 'burning-smell';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Clutch Replacement', 'clutch', 80, 'high' FROM symptoms WHERE slug = 'burning-smell';

INSERT INTO symptom_causes (symptom_id, cause_name, probability, severity) SELECT id, 'EVAP System Leak', 90, 'medium' FROM symptoms WHERE slug = 'gas-smell';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Fuel Injector Replacement', 'fuel_injector', 85, 'high' FROM symptoms WHERE slug = 'gas-smell';
INSERT INTO symptom_causes (symptom_id, cause_name, probability, severity) SELECT id, 'Fuel Line Leak', 80, 'critical' FROM symptoms WHERE slug = 'gas-smell';

INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Radiator Replacement', 'radiator', 85, 'high' FROM symptoms WHERE slug = 'coolant-smell';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Heater Core Replacement', 'heater_core', 85, 'high' FROM symptoms WHERE slug = 'coolant-smell';
INSERT INTO symptom_causes (symptom_id, cause_name, probability, severity) SELECT id, 'Coolant Leak', 80, 'medium' FROM symptoms WHERE slug = 'coolant-smell';

INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Valve Cover Gasket Replacement', 'valve_cover_gasket', 90, 'medium' FROM symptoms WHERE slug = 'burning-oil-smell';
INSERT INTO symptom_causes (symptom_id, cause_name, probability, severity) SELECT id, 'Oil Leak onto Exhaust', 85, 'high' FROM symptoms WHERE slug = 'burning-oil-smell';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'PCV Valve Replacement', 'pcv_valve', 80, 'low' FROM symptoms WHERE slug = 'burning-oil-smell';

INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Catalytic Converter Replacement', 'catalytic_converter', 90, 'high' FROM symptoms WHERE slug = 'rotten-egg-smell';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Oxygen Sensor Replacement', 'oxygen_sensor', 85, 'medium' FROM symptoms WHERE slug = 'rotten-egg-smell';
INSERT INTO symptom_causes (symptom_id, cause_name, probability, severity) SELECT id, 'Fuel System Issue', 75, 'medium' FROM symptoms WHERE slug = 'rotten-egg-smell';

-- Smoke
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Head Gasket Replacement', 'head_gasket', 90, 'critical' FROM symptoms WHERE slug = 'white-smoke-exhaust';
INSERT INTO symptom_causes (symptom_id, cause_name, probability, severity) SELECT id, 'Intake Manifold Gasket Leak', 80, 'high' FROM symptoms WHERE slug = 'white-smoke-exhaust';

INSERT INTO symptom_causes (symptom_id, cause_name, probability, severity) SELECT id, 'Valve Seal Failure', 85, 'critical' FROM symptoms WHERE slug = 'blue-smoke-exhaust';
INSERT INTO symptom_causes (symptom_id, cause_name, probability, severity) SELECT id, 'Piston Ring Failure', 80, 'critical' FROM symptoms WHERE slug = 'blue-smoke-exhaust';
INSERT INTO symptom_causes (symptom_id, cause_name, probability, severity) SELECT id, 'Turbocharger Failure', 75, 'critical' FROM symptoms WHERE slug = 'blue-smoke-exhaust';

INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Fuel Injector Replacement', 'fuel_injector', 90, 'high' FROM symptoms WHERE slug = 'black-smoke-exhaust';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Mass Air Flow Sensor Replacement', 'mass_air_flow_sensor', 85, 'medium' FROM symptoms WHERE slug = 'black-smoke-exhaust';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Oxygen Sensor Replacement', 'oxygen_sensor', 80, 'medium' FROM symptoms WHERE slug = 'black-smoke-exhaust';

INSERT INTO symptom_causes (symptom_id, cause_name, probability, severity) SELECT id, 'Oil Leak onto Hot Engine', 90, 'high' FROM symptoms WHERE slug = 'smoke-from-engine-bay';
INSERT INTO symptom_causes (symptom_id, cause_name, probability, severity) SELECT id, 'Coolant Leak onto Hot Engine', 85, 'high' FROM symptoms WHERE slug = 'smoke-from-engine-bay';
INSERT INTO symptom_causes (symptom_id, cause_name, probability, severity) SELECT id, 'Electrical Short', 80, 'critical' FROM symptoms WHERE slug = 'smoke-from-engine-bay';

-- Leaks
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Valve Cover Gasket Replacement', 'valve_cover_gasket', 90, 'medium' FROM symptoms WHERE slug = 'oil-leak';
INSERT INTO symptom_causes (symptom_id, cause_name, probability, severity) SELECT id, 'Oil Pan Gasket Failure', 85, 'high' FROM symptoms WHERE slug = 'oil-leak';
INSERT INTO symptom_causes (symptom_id, cause_name, probability, severity) SELECT id, 'Rear Main Seal Failure', 80, 'critical' FROM symptoms WHERE slug = 'oil-leak';

INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Radiator Replacement', 'radiator', 90, 'high' FROM symptoms WHERE slug = 'coolant-leak';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Water Pump Replacement', 'water_pump', 85, 'high' FROM symptoms WHERE slug = 'coolant-leak';
INSERT INTO symptom_causes (symptom_id, cause_name, probability, severity) SELECT id, 'Heater Hose Failure', 80, 'medium' FROM symptoms WHERE slug = 'coolant-leak';

INSERT INTO symptom_causes (symptom_id, cause_name, probability, severity) SELECT id, 'Transmission Pan Gasket Failure', 85, 'high' FROM symptoms WHERE slug = 'transmission-fluid-leak';
INSERT INTO symptom_causes (symptom_id, cause_name, probability, severity) SELECT id, 'Transmission Seal Failure', 80, 'high' FROM symptoms WHERE slug = 'transmission-fluid-leak';

INSERT INTO symptom_causes (symptom_id, cause_name, probability, severity) SELECT id, 'Brake Line Failure', 90, 'critical' FROM symptoms WHERE slug = 'brake-fluid-leak';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Brake Caliper Replacement', 'brake_caliper', 85, 'critical' FROM symptoms WHERE slug = 'brake-fluid-leak';
INSERT INTO symptom_causes (symptom_id, cause_name, probability, severity) SELECT id, 'Master Cylinder Failure', 90, 'critical' FROM symptoms WHERE slug = 'brake-fluid-leak';

INSERT INTO symptom_causes (symptom_id, cause_name, probability, severity) SELECT id, 'Power Steering Hose Failure', 85, 'high' FROM symptoms WHERE slug = 'power-steering-leak';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Power Steering Pump Replacement', 'power_steering_pump', 80, 'high' FROM symptoms WHERE slug = 'power-steering-leak';
INSERT INTO symptom_causes (symptom_id, cause_name, probability, severity) SELECT id, 'Steering Rack Failure', 75, 'critical' FROM symptoms WHERE slug = 'power-steering-leak';

-- Brakes
INSERT INTO symptom_causes (symptom_id, cause_name, probability, severity) SELECT id, 'Air in Brake Lines', 90, 'high' FROM symptoms WHERE slug = 'soft-brake-pedal';
INSERT INTO symptom_causes (symptom_id, cause_name, probability, severity) SELECT id, 'Master Cylinder Failure', 85, 'critical' FROM symptoms WHERE slug = 'soft-brake-pedal';

INSERT INTO symptom_causes (symptom_id, cause_name, probability, severity) SELECT id, 'Master Cylinder Failure', 95, 'critical' FROM symptoms WHERE slug = 'brake-pedal-goes-to-floor';
INSERT INTO symptom_causes (symptom_id, cause_name, probability, severity) SELECT id, 'Brake Line Failure', 90, 'critical' FROM symptoms WHERE slug = 'brake-pedal-goes-to-floor';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Brake Caliper Replacement', 'brake_caliper', 85, 'critical' FROM symptoms WHERE slug = 'brake-pedal-goes-to-floor';

INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Rotor Replacement', 'rotor_front', 90, 'high' FROM symptoms WHERE slug = 'brake-pulsation';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Brake Pads Replacement', 'brake_pads_front', 80, 'medium' FROM symptoms WHERE slug = 'brake-pulsation';

INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Brake Pads Replacement', 'brake_pads_front', 85, 'high' FROM symptoms WHERE slug = 'long-stopping-distance';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Rotor Replacement', 'rotor_front', 85, 'high' FROM symptoms WHERE slug = 'long-stopping-distance';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Brake Fluid Service Needed', 'brake_fluid_flush', 80, 'medium' FROM symptoms WHERE slug = 'long-stopping-distance';

INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Brake Caliper Replacement', 'brake_caliper', 90, 'high' FROM symptoms WHERE slug = 'brake-dragging';
INSERT INTO symptom_causes (symptom_id, cause_name, probability, severity) SELECT id, 'Brake Hose Failure', 80, 'high' FROM symptoms WHERE slug = 'brake-dragging';

-- Car Pulls To One Side
INSERT INTO symptom_causes (symptom_id, cause_name, probability, severity) SELECT id, 'Wheel Alignment Needed', 90, 'medium' FROM symptoms WHERE slug = 'car-pulls-to-one-side';
INSERT INTO symptom_causes (symptom_id, cause_name, repair_slug, probability, severity) SELECT id, 'Brake Caliper Replacement', 'brake_caliper', 80, 'high' FROM symptoms WHERE slug = 'car-pulls-to-one-side';
INSERT INTO symptom_causes (symptom_id, cause_name, probability, severity) SELECT id, 'Worn Tires', 80, 'medium' FROM symptoms WHERE slug = 'car-pulls-to-one-side';
