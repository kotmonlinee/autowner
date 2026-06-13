-- AutOwner DIY Difficulty Knowledge Graph v1.0
-- 5-level system: L1 Beginner → L2 Easy → L3 Intermediate → L4 Advanced → L5 Professional

CREATE TABLE IF NOT EXISTS diy_difficulty (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  repair_slug TEXT NOT NULL UNIQUE,
  repair_name TEXT NOT NULL,
  difficulty_level INTEGER NOT NULL CHECK (difficulty_level BETWEEN 1 AND 5),
  difficulty_label TEXT NOT NULL,
  diy_friendly TEXT NOT NULL CHECK (diy_friendly IN ('Yes', 'Maybe', 'No')),
  est_time TEXT NOT NULL,
  risk_level TEXT NOT NULL CHECK (risk_level IN ('Low', 'Medium', 'High', 'Very High')),
  tools TEXT NOT NULL,
  safety TEXT NOT NULL,
  has_variability BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE diy_difficulty ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read DIY difficulty" ON diy_difficulty FOR SELECT USING (true);

CREATE INDEX IF NOT EXISTS idx_diy_level ON diy_difficulty(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_diy_slug ON diy_difficulty(repair_slug);

-- Seed data: 55 repairs
INSERT INTO diy_difficulty (repair_slug, repair_name, difficulty_level, difficulty_label, diy_friendly, est_time, risk_level, tools, safety, has_variability) VALUES
('brake_pads_front', 'Brake Pads Replacement - Front', 3, 'Intermediate', 'Yes', '1.5–2h', 'High', 'Jack + jack stands, Lug wrench, Caliper tool, Torque wrench, Brake grease', 'Always use jack stands. Pump brakes before driving. If pedal feels soft, re-bleed immediately.', FALSE),
('brake_pads_rear', 'Brake Pads Replacement - Rear', 3, 'Intermediate', 'Yes', '1.5–2h', 'High', 'Jack + jack stands, Lug wrench, Caliper tool, Torque wrench, Brake grease', 'Always use jack stands. Pump brakes before driving. If pedal feels soft, re-bleed immediately.', FALSE),
('rotor_front', 'Rotor Replacement - Front', 3, 'Intermediate', 'Yes', '2–2.5h', 'High', 'Jack + jack stands, Torque wrench, Breaker bar', 'Clean rotors with brake cleaner. Bed in new pads properly.', FALSE),
('rotor_rear', 'Rotor Replacement - Rear', 3, 'Intermediate', 'Yes', '2–2.5h', 'High', 'Jack + jack stands, Torque wrench, Breaker bar', 'Clean rotors with brake cleaner. Bed in new pads properly.', FALSE),
('oil_change_synthetic', 'Oil Change - Full Synthetic', 2, 'Easy', 'Yes', '30–45min', 'Low', 'Drain pan, Filter wrench, Funnel, Socket set', 'Let engine cool. Dispose of used oil at a recycling center.', FALSE),
('transmission_fluid', 'Transmission Fluid Change', 3, 'Intermediate', 'Yes', '1–1.5h', 'Medium', 'Drain pan, Fluid pump, Torque wrench', 'Some modern transmissions require scan tools for fluid temp monitoring.', TRUE),
('water_pump', 'Water Pump Replacement', 3, 'Intermediate', 'Yes', '2–4h', 'Medium', 'Socket set, Torque wrench, Coolant, Gasket scraper', 'Properly bleed cooling system. Some pumps are timing-belt driven.', TRUE),
('alternator', 'Alternator Replacement', 3, 'Intermediate', 'Yes', '1.5–3h', 'Medium', 'Socket set, Serpentine belt tool, Multimeter', 'Disconnect battery negative first. Belt routing is critical.', FALSE),
('starter', 'Starter Replacement', 3, 'Intermediate', 'Yes', '1.5–3h', 'Medium', 'Socket set, Extensions, Jack stands (some models)', 'Disconnect battery. Starter is heavy.', FALSE),
('ac_compressor', 'AC Compressor Replacement', 5, 'Professional', 'No', '3–5h', 'Very High', 'A/C manifold gauge, Vacuum pump, Recovery machine', 'EPA certification required. Improper handling is illegal and dangerous.', FALSE),
('timing_belt', 'Timing Belt Replacement', 5, 'Professional', 'No', '4–8h', 'Very High', 'Cam lock tools, Torque wrench, Timing kit', 'One tooth off = engine destruction on interference engines.', FALSE),
('spark_plugs', 'Spark Plugs Replacement', 2, 'Easy', 'Yes', '30min–1h', 'Medium', 'Spark plug socket, Torque wrench, Dielectric grease', 'Use torque wrench — over-tightening strips threads.', FALSE),
('oxygen_sensor', 'Oxygen Sensor Replacement', 2, 'Easy', 'Yes', '15–30min', 'Low', 'O2 sensor socket, Penetrating oil', 'Exhaust must be cold. Dont get anti-seize on the sensor tip.', FALSE),
('catalytic_converter', 'Catalytic Converter Replacement', 4, 'Advanced', 'No', '2–4h', 'Medium', 'Jack stands, Penetrating oil, Exhaust hanger tool', 'Check local emissions laws — some states require certified installers.', FALSE),
('fuel_pump', 'Fuel Pump Replacement', 4, 'Advanced', 'Maybe', '1.5–6h', 'High', 'Fuel line disconnect tool, Fire extinguisher', 'Vehicles with access panel under rear seat are much easier.', TRUE),
('radiator', 'Radiator Replacement', 3, 'Intermediate', 'Yes', '2–3h', 'Medium', 'Socket set, Drain pan, Coolant, Transmission line disconnect tool', 'Coolant is toxic. Dispose properly. Bleed system thoroughly.', FALSE),
('thermostat', 'Thermostat Replacement', 3, 'Intermediate', 'Yes', '1.5–3h', 'Medium', 'Socket set, Coolant, Gasket scraper, RTV sealant', 'Let engine cool completely. Properly bleed cooling system after.', FALSE),
('battery', 'Battery Replacement', 1, 'Beginner', 'Yes', '10–15min', 'Low', '10mm wrench, Terminal cleaner', 'Disconnect negative terminal first. Reconnect negative last.', FALSE),
('serpentine_belt', 'Serpentine Belt Replacement', 2, 'Easy', 'Yes', '30min–1h', 'Medium', 'Serpentine belt tool or breaker bar, Belt routing diagram', 'Take a photo of the belt routing before removing.', FALSE),
('valve_cover_gasket', 'Valve Cover Gasket Replacement', 3, 'Intermediate', 'Yes', '2–5h', 'Medium', 'Socket set, Torque wrench, Gasket scraper, RTV', 'Follow torque sequence. V6/V8 engines significantly harder than inline-4.', TRUE),
('head_gasket', 'Head Gasket Replacement', 5, 'Professional', 'No', '10–20h', 'Very High', 'Engine hoist, Machine shop resurface, Full gasket kit', 'Requires major engine disassembly. Head must be machined flat.', FALSE),
('power_steering_pump', 'Power Steering Pump Replacement', 3, 'Intermediate', 'Yes', '1.5–3h', 'Medium', 'Socket set, Pulley puller, Power steering fluid', 'Bleed system after install.', FALSE),
('wheel_bearing', 'Wheel Bearing Replacement', 4, 'Advanced', 'Maybe', '2–4h', 'Medium', 'Hydraulic press or hub assembly, Torque wrench', 'Press-fit bearings require a shop press. Bolt-in hubs are DIY-friendly.', FALSE),
('struts_front', 'Struts Replacement - Front', 4, 'Advanced', 'Maybe', '3–5h', 'High', 'Spring compressor, Torque wrench, Breaker bar', 'Spring compressors can be lethal. Never cheap out on this tool.', FALSE),
('shocks_rear', 'Shocks Replacement - Rear', 3, 'Intermediate', 'Yes', '1.5–2.5h', 'Medium', 'Socket set, Jack stands, Torque wrench', 'Use jack stands. Rear shocks are usually straightforward bolt-in.', FALSE),
('tie_rod_ends', 'Tie Rod Ends Replacement', 3, 'Intermediate', 'Yes', '1–2h', 'Medium', 'Tie rod separator, Torque wrench', 'Count turns. Get alignment immediately after.', FALSE),
('ball_joints', 'Ball Joints Replacement', 4, 'Advanced', 'Maybe', '2–4h', 'Medium', 'Ball joint press, Torque wrench', 'Press-fit joints require a press tool. Get alignment after.', FALSE),
('control_arms', 'Control Arms Replacement', 4, 'Advanced', 'Maybe', '2–4h', 'Medium', 'Breaker bar, Torque wrench', 'Requires alignment after. Pre-load suspension before final torque.', FALSE),
('cv_axle', 'CV Axle Replacement', 3, 'Intermediate', 'Yes', '1.5–3h', 'Medium', 'Axle nut socket (large), Pry bar, Torque wrench, Transmission fluid', 'Drain transmission fluid first. Dont damage the axle seal.', FALSE),
('muffler', 'Muffler Replacement', 3, 'Intermediate', 'Maybe', '1–3h', 'Low', 'Penetrating oil, Exhaust hanger tool, Socket set', 'Rusty exhaust hardware can significantly increase repair time. May require welding.', FALSE),
('egr_valve', 'EGR Valve Replacement', 3, 'Intermediate', 'Yes', '1–1.5h', 'Low', 'Socket set, Carbon cleaner, Gasket', 'Let engine cool. EGR gets extremely hot.', FALSE),
('mass_air_flow_sensor', 'Mass Air Flow Sensor Replacement', 1, 'Beginner', 'Yes', '5–10min', 'Low', 'Screwdriver', 'Dont touch the sensor element. Use MAF cleaner only.', FALSE),
('ignition_coil', 'Ignition Coil Replacement', 1, 'Beginner', 'Yes', '10–20min', 'Low', 'Socket set', 'Disconnect battery first. Replace one coil at a time.', FALSE),
('clutch', 'Clutch Replacement', 5, 'Professional', 'No', '6–10h', 'Very High', 'Transmission jack, Flywheel resurface, Alignment tool', 'Requires transmission removal. Heavy components.', FALSE),
('fuel_injector', 'Fuel Injector Replacement', 3, 'Intermediate', 'Maybe', '1.5–3h', 'Medium', 'Fuel line disconnect tool, O-ring kit, Torque wrench', 'Depressurize fuel system. GDI injectors operate at extremely high pressure.', FALSE),
('brake_caliper', 'Brake Caliper Replacement', 3, 'Intermediate', 'Yes', '1.5–2h', 'High', 'Caliper tool, Brake bleeder kit, Torque wrench, Brake fluid', 'Brake bleeding is mandatory after caliper replacement.', FALSE),
('cabin_air_filter', 'Cabin Air Filter Replacement', 1, 'Beginner', 'Yes', '5–10min', 'Low', 'None — glovebox access', 'Note filter direction arrow before removing old one.', FALSE),
('engine_air_filter', 'Engine Air Filter Replacement', 1, 'Beginner', 'Yes', '5min', 'Low', 'None — clips or screws', 'Make sure no debris falls into the intake.', FALSE),
('pcv_valve', 'PCV Valve Replacement', 2, 'Easy', 'Yes', '15min–1.5h', 'Low', 'Pliers, Socket set', 'Some turbocharged engines require removing valve cover.', TRUE),
('coolant_flush', 'Coolant Flush', 2, 'Easy', 'Yes', '1–1.5h', 'Low', 'Drain pan, Funnel, Coolant, Distilled water', 'Never open a hot radiator cap. Coolant is toxic to pets.', FALSE),
('brake_fluid_flush', 'Brake Fluid Flush', 3, 'Intermediate', 'Yes', '1–1.5h', 'Medium', 'Brake bleeder kit or vacuum bleeder, Brake fluid', 'Bleed all 4 corners in correct order. Brake fluid strips paint.', FALSE),
('power_steering_flush', 'Power Steering Fluid Flush', 2, 'Easy', 'Yes', '30min', 'Low', 'Fluid pump or turkey baster, Power steering fluid', 'Use the correct fluid type for your vehicle.', FALSE),
('differential_fluid', 'Differential Fluid Change', 3, 'Intermediate', 'Yes', '30min–1h', 'Low', 'Drain pan, Fluid pump, Specific gear oil, Torque wrench', 'Make sure you can remove the fill plug BEFORE draining.', FALSE),
('transfer_case_fluid', 'Transfer Case Fluid Change', 3, 'Intermediate', 'Yes', '30min–1h', 'Low', 'Drain pan, Fluid pump, Specific gear oil, Torque wrench', 'Make sure you can remove the fill plug BEFORE draining.', FALSE),
('drive_belt', 'Drive Belt Replacement', 2, 'Easy', 'Yes', '30min–1h', 'Medium', 'Serpentine belt tool or breaker bar, Belt routing diagram', 'Take a photo of the belt routing before removing.', FALSE),
('engine_mount', 'Engine Mount Replacement', 4, 'Advanced', 'Maybe', '2–4h', 'High', 'Engine support bar or floor jack + wood block, Torque wrench', 'You are supporting the weight of the engine — failure can cause injury.', FALSE),
('transmission_mount', 'Transmission Mount Replacement', 3, 'Intermediate', 'Yes', '1.5–2.5h', 'Medium', 'Floor jack + wood block, Socket set, Torque wrench', 'Support the transmission with a jack before removing mount.', FALSE),
('evaporator_core', 'Evaporator Core Replacement', 5, 'Professional', 'No', '8–12h', 'Very High', 'A/C machine, Full dash removal tools', 'Entire dashboard must come out. A/C system requires professional service.', FALSE),
('heater_core', 'Heater Core Replacement', 5, 'Professional', 'No', '6–10h', 'Very High', 'Cooling system tools, Dash removal tools', 'Usually requires dashboard removal. Professional strongly recommended.', FALSE),
('throttle_body', 'Throttle Body Replacement', 2, 'Easy', 'Yes', '30min–1h', 'Low', 'Socket set, Throttle body cleaner', 'May require throttle relearn procedure on some vehicles.', FALSE),
('fuel_filter', 'Fuel Filter Replacement', 2, 'Easy', 'Maybe', '20min–3h', 'Medium', 'Fuel line disconnect tool, Safety glasses', 'Depressurize fuel system first. Some modern cars have filter integrated in fuel pump.', TRUE),
('windshield', 'Windshield Replacement', 5, 'Professional', 'No', '1–2h (shop time)', 'Very High', 'Urethane adhesive, Suction cups, Calibration equipment', 'Professional installation required for seal integrity. ADAS cameras need recalibration.', FALSE),
('window_regulator', 'Window Regulator Replacement', 3, 'Intermediate', 'Yes', '1–2h', 'Low', 'Trim removal tool, Socket set', 'Wear gloves — door panel edges are sharp. Support window glass.', FALSE),
('door_lock_actuator', 'Door Lock Actuator Replacement', 3, 'Intermediate', 'Yes', '1–2h', 'Low', 'Trim removal tool, Torx bits', 'Take photos of linkage connections before disconnecting.', FALSE),
('blower_motor', 'Blower Motor Replacement', 2, 'Easy', 'Yes', '30min–1h', 'Low', 'Socket set or screwdriver', 'Disconnect battery. Usually under passenger dash.', FALSE);
