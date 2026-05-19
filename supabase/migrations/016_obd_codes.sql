-- Migrate: 016_obd_codes
-- Creates obd_codes table and seeds P-codes (powertrain DTCs)
-- Data sourced from OBDIICodes open dataset, enriched with automotive repair knowledge

-- ============================================================
-- TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS obd_codes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  severity INTEGER NOT NULL CHECK (severity >= 1 AND severity <= 5),
  symptoms_json JSONB NOT NULL DEFAULT '[]',
  causes_json JSONB NOT NULL DEFAULT '[]',
  fixes_json JSONB NOT NULL DEFAULT '[]',
  min_cost INTEGER DEFAULT NULL,
  max_cost INTEGER DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_obd_codes_code ON obd_codes(code);
CREATE INDEX IF NOT EXISTS idx_obd_codes_severity ON obd_codes(severity);

-- Full text search on title
CREATE INDEX IF NOT EXISTS idx_obd_codes_title_trgm ON obd_codes USING gin (title gin_trgm_ops);

-- ============================================================
-- SEED DATA
-- ============================================================

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0001', 'Fuel Volume Regulator Control Circuit/Open', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation under acceleration", "Rough idle", "Engine stall"]', '["Faulty fuel volume regulator", "Damaged wiring or connectors in fuel regulator circuit", "Faulty ECM/PCM", "Fuel system contamination"]', '["Inspect and replace fuel volume regulator", "Repair damaged wiring/connectors", "Clean fuel system", "Reflash or replace ECM/PCM if necessary"]', 250, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0002', 'Fuel Volume Regulator Control Circuit Range/Performance', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation under acceleration", "Rough idle", "Engine stall"]', '["Faulty fuel volume regulator", "Damaged wiring or connectors in fuel regulator circuit", "Faulty ECM/PCM", "Fuel system contamination"]', '["Inspect and replace fuel volume regulator", "Repair damaged wiring/connectors", "Clean fuel system", "Reflash or replace ECM/PCM if necessary"]', 250, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0003', 'Fuel Volume Regulator Control Circuit Low', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation under acceleration", "Rough idle", "Engine stall"]', '["Faulty fuel volume regulator", "Damaged wiring or connectors in fuel regulator circuit", "Faulty ECM/PCM", "Fuel system contamination"]', '["Inspect and replace fuel volume regulator", "Repair damaged wiring/connectors", "Clean fuel system", "Reflash or replace ECM/PCM if necessary"]', 250, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0004', 'Fuel Volume Regulator Control Circuit High', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation under acceleration", "Rough idle", "Engine stall"]', '["Faulty fuel volume regulator", "Damaged wiring or connectors in fuel regulator circuit", "Faulty ECM/PCM", "Fuel system contamination"]', '["Inspect and replace fuel volume regulator", "Repair damaged wiring/connectors", "Clean fuel system", "Reflash or replace ECM/PCM if necessary"]', 250, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0005', 'Fuel Shutoff ValveAControl Circuit/Open', 4, '["Check Engine Light on", "Engine crank but no start", "Fuel pressure loss", "Engine stall when hot"]', '["Faulty fuel shutoff valve", "Open or shorted wiring", "Blown fuse", "Faulty PCM"]', '["Replace fuel shutoff valve", "Repair wiring harness", "Replace blown fuse", "Reprogram PCM"]', 200, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0006', 'Fuel Shutoff ValveAControl Circuit Low', 4, '["Check Engine Light on", "Engine crank but no start", "Fuel pressure loss", "Engine stall when hot"]', '["Faulty fuel shutoff valve", "Open or shorted wiring", "Blown fuse", "Faulty PCM"]', '["Replace fuel shutoff valve", "Repair wiring harness", "Replace blown fuse", "Reprogram PCM"]', 200, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0007', 'Fuel Shutoff ValveAControl Circuit High', 4, '["Check Engine Light on", "Engine crank but no start", "Fuel pressure loss", "Engine stall when hot"]', '["Faulty fuel shutoff valve", "Open or shorted wiring", "Blown fuse", "Faulty PCM"]', '["Replace fuel shutoff valve", "Repair wiring harness", "Replace blown fuse", "Reprogram PCM"]', 200, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0008', 'Engine Positions System Performance Bank 1', 4, '["Check Engine Light on", "Engine misfire", "Timing chain rattle", "Loss of power", "Poor fuel economy"]', '["Stretched timing chain", "Worn timing chain tensioner", "Faulty camshaft/crankshaft sensor", "VVT system failure"]', '["Replace timing chain and tensioner", "Replace camshaft/crankshaft position sensors", "Check and replace VVT solenoid", "Verify engine timing alignment"]', 800, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0009', 'Engine Position System Performance Bank 2', 4, '["Check Engine Light on", "Engine misfire", "Timing chain rattle", "Loss of power", "Poor fuel economy"]', '["Stretched timing chain", "Worn timing chain tensioner", "Faulty camshaft/crankshaft sensor", "VVT system failure"]', '["Replace timing chain and tensioner", "Replace camshaft/crankshaft position sensors", "Check and replace VVT solenoid", "Verify engine timing alignment"]', 800, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P000A', ' ACamshaft Position Slow Response Bank 1', 3, '["Check Engine Light on", "Sluggish acceleration", "Engine rattle on cold start", "Decreased fuel economy"]', '["Faulty camshaft position actuator (VVT solenoid)", "Low or dirty engine oil", "Clogged VVT oil passages", "Timing chain wear"]', '["Replace VVT solenoid/camshaft actuator", "Perform oil change with correct viscosity", "Clean VVT oil control passages", "Check timing chain and guides"]', 300, 1200)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P000B', ' BCamshaft Position Slow Response Bank 1', 3, '["Check Engine Light on", "Sluggish acceleration", "Engine rattle on cold start", "Decreased fuel economy"]', '["Faulty camshaft position actuator (VVT solenoid)", "Low or dirty engine oil", "Clogged VVT oil passages", "Timing chain wear"]', '["Replace VVT solenoid/camshaft actuator", "Perform oil change with correct viscosity", "Clean VVT oil control passages", "Check timing chain and guides"]', 300, 1200)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P000C', ' ACamshaft Position Slow Response Bank 2', 3, '["Check Engine Light on", "Sluggish acceleration", "Engine rattle on cold start", "Decreased fuel economy"]', '["Faulty camshaft position actuator (VVT solenoid)", "Low or dirty engine oil", "Clogged VVT oil passages", "Timing chain wear"]', '["Replace VVT solenoid/camshaft actuator", "Perform oil change with correct viscosity", "Clean VVT oil control passages", "Check timing chain and guides"]', 300, 1200)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P000D', ' BCamshaft Position Slow Response Bank 2', 3, '["Check Engine Light on", "Sluggish acceleration", "Engine rattle on cold start", "Decreased fuel economy"]', '["Faulty camshaft position actuator (VVT solenoid)", "Low or dirty engine oil", "Clogged VVT oil passages", "Timing chain wear"]', '["Replace VVT solenoid/camshaft actuator", "Perform oil change with correct viscosity", "Clean VVT oil control passages", "Check timing chain and guides"]', 300, 1200)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P000E', 'Fuel Volume Regulator Control Exceeded Learning Limit', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Fuel system contamination or component failure"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P000F', 'Fuel System Over Pressure Relief Valve Activated', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Failed or stuck valve/solenoid/actuator", "Fuel system contamination or component failure"]', '["Replace faulty valve/solenoid/actuator", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0010', ' ACamshaft Position Actuator Circuit (Bank 1)', 3, '["Check Engine Light on", "Rough idle", "Decreased fuel economy", "Engine surging"]', '["Faulty camshaft position actuator solenoid", "Low engine oil level", "Dirty engine oil", "Wiring harness damage"]', '["Replace camshaft position actuator solenoid", "Change engine oil and filter", "Repair wiring/connector", "Check oil pressure"]', 200, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0011', ' ACamshaft Position - Timing Over-Advanced or System Performance (Bank 1)', 3, '["Check Engine Light on", "Rough running engine", "Engine knock/ping", "Decreased power", "Poor fuel economy"]', '["Stuck VVT solenoid", "Low/dirty engine oil", "Clogged oil screen", "Timing chain issue"]', '["Replace VVT solenoid", "Change oil and filter", "Clean oil passages to VVT", "Check timing alignment"]', 250, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0012', ' ACamshaft Position - Timing Over-Retarded (Bank 1)', 3, '["Check Engine Light on", "Rough running engine", "Engine knock/ping", "Decreased power", "Poor fuel economy"]', '["Stuck VVT solenoid", "Low/dirty engine oil", "Clogged oil screen", "Timing chain issue"]', '["Replace VVT solenoid", "Change oil and filter", "Clean oil passages to VVT", "Check timing alignment"]', 250, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0013', ' BCamshaft Position - Actuator Circuit (Bank 1)', 3, '["Check Engine Light on", "Rough idle", "Decreased fuel economy", "Engine surging"]', '["Faulty camshaft position actuator solenoid", "Low engine oil level", "Dirty engine oil", "Wiring harness damage"]', '["Replace camshaft position actuator solenoid", "Change engine oil and filter", "Repair wiring/connector", "Check oil pressure"]', 200, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0014', ' BCamshaft Position - Timing Over-Advanced or System Performance (Bank 1)', 3, '["Check Engine Light on", "Rough running engine", "Engine knock/ping", "Decreased power", "Poor fuel economy"]', '["Stuck VVT solenoid", "Low/dirty engine oil", "Clogged oil screen", "Timing chain issue"]', '["Replace VVT solenoid", "Change oil and filter", "Clean oil passages to VVT", "Check timing alignment"]', 250, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0015', ' BCamshaft Position -Timing Over-Retarded (Bank 1)', 3, '["Check Engine Light on", "Rough running engine", "Engine knock/ping", "Decreased power", "Poor fuel economy"]', '["Stuck VVT solenoid", "Low/dirty engine oil", "Clogged oil screen", "Timing chain issue"]', '["Replace VVT solenoid", "Change oil and filter", "Clean oil passages to VVT", "Check timing alignment"]', 250, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0016', 'Crankshaft Position - Camshaft Position Correlation (Bank 1 Sensor A)', 4, '["Check Engine Light on", "Engine misfire", "Hard starting", "Rough idle", "Timing chain noise"]', '["Stretched/worn timing chain", "Faulty crankshaft position sensor", "Faulty camshaft position sensor", "Jumped timing", "Worn timing guides/tensioners"]', '["Replace timing chain kit (chain, guides, tensioners)", "Replace crankshaft sensor", "Replace camshaft sensor", "Verify and correct engine timing"]', 800, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0017', 'Crankshaft Position - Camshaft Position Correlation (Bank 1 Sensor B)', 4, '["Check Engine Light on", "Engine misfire", "Hard starting", "Rough idle", "Timing chain noise"]', '["Stretched/worn timing chain", "Faulty crankshaft position sensor", "Faulty camshaft position sensor", "Jumped timing", "Worn timing guides/tensioners"]', '["Replace timing chain kit (chain, guides, tensioners)", "Replace crankshaft sensor", "Replace camshaft sensor", "Verify and correct engine timing"]', 800, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0018', 'Crankshaft Position - Camshaft Position Correlation (Bank 2 Sensor A)', 4, '["Check Engine Light on", "Engine misfire", "Hard starting", "Rough idle", "Timing chain noise"]', '["Stretched/worn timing chain", "Faulty crankshaft position sensor", "Faulty camshaft position sensor", "Jumped timing", "Worn timing guides/tensioners"]', '["Replace timing chain kit (chain, guides, tensioners)", "Replace crankshaft sensor", "Replace camshaft sensor", "Verify and correct engine timing"]', 800, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0019', 'Crankshaft Position - Camshaft Position Correlation (Bank 2 Sensor B)', 4, '["Check Engine Light on", "Engine misfire", "Hard starting", "Rough idle", "Timing chain noise"]', '["Stretched/worn timing chain", "Faulty crankshaft position sensor", "Faulty camshaft position sensor", "Jumped timing", "Worn timing guides/tensioners"]', '["Replace timing chain kit (chain, guides, tensioners)", "Replace crankshaft sensor", "Replace camshaft sensor", "Verify and correct engine timing"]', 800, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P001A', ' ACamshaft Profile Control Circuit/Open Bank 1', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P001B', ' ACamshaft Profile Control Circuit Low Bank 1', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P001C', ' ACamshaft Profile Control Circuit High Bank 1', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P001D', ' ACamshaft Profile Control Circuit/Open Bank 2', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P001E', ' ACamshaft Profile Control Circuit Low Bank 2', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P001F', ' ACamshaft Profile Control Circuit High Bank 2', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0020', ' ACamshaft Position Actuator Circuit (Bank 2)', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power"]', '["Damaged, corroded, or shorted wiring in related circuit", "Failed or stuck valve/solenoid/actuator"]', '["Inspect and repair wiring harness and connectors", "Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0021', ' ACamshaft Position - Timing Over-Advanced or System Performance (Bank 2)', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0022', ' ACamshaft Position - Timing Over-Retarded (Bank 2)', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0023', ' BCamshaft Position - Actuator Circuit (Bank 2)', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power"]', '["Damaged, corroded, or shorted wiring in related circuit", "Failed or stuck valve/solenoid/actuator"]', '["Inspect and repair wiring harness and connectors", "Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0024', ' BCamshaft Position - Timing Over-Advanced or System Performance (Bank 2)', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0025', ' BCamshaft Position - Timing Over-Retarded (Bank 2)', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0026', 'Intake Valve Control Solenoid Circuit Range/Performance Bank 1', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit", "Failed or stuck valve/solenoid/actuator"]', '["Inspect and repair wiring harness and connectors", "Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0027', 'Exhaust Valve Control solenoid Circuit Range/Performance Bank 1', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit", "Failed or stuck valve/solenoid/actuator"]', '["Inspect and repair wiring harness and connectors", "Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0028', 'Intake valve Control Solenoid Circuit Range/Performance Bank 2', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit", "Failed or stuck valve/solenoid/actuator"]', '["Inspect and repair wiring harness and connectors", "Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0029', 'Exhaust Valve Control Solenoid Circuit Range/Performance Bank 2', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit", "Failed or stuck valve/solenoid/actuator"]', '["Inspect and repair wiring harness and connectors", "Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P002A', ' BCamshaft Profile Control Circuit/Open Bank 1', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P002B', ' BCamshaft Profile Control Circuit Low Bank 1', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P002C', ' BCamshaft Profile Control Circuit High Bank 1', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P002D', ' BCamshaft Profile Control Circuit/Open Bank 2', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P002E', ' BCamshaft Profile Control Circuit Low Bank 2', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P002F', ' BCamshaft Profile Control Circuit High Bank 2', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0030', 'HO2S Heater Control Circuit (Bank 1 Sensor 1)', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0031', 'HO2S Heater Control Circuit Low (Bank 1 Sensor 1)', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0032', 'HO2S Heater Control Circuit High (Bank 1 Sensor 1)', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0033', 'Turbo Charger Bypass Valve Control Circuit', 4, '["Check Engine Light illuminated", "Loss of boost pressure", "Reduced power", "Turbo whine/whistle"]', '["Damaged, corroded, or shorted wiring in related circuit", "Failed or stuck valve/solenoid/actuator"]', '["Inspect and repair wiring harness and connectors", "Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0034', 'Turbo Charger Bypass Valve Control Circuit Low', 4, '["Check Engine Light illuminated", "Loss of boost pressure", "Reduced power", "Turbo whine/whistle"]', '["Damaged, corroded, or shorted wiring in related circuit", "Failed or stuck valve/solenoid/actuator"]', '["Inspect and repair wiring harness and connectors", "Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0035', 'Turbo Charger Bypass Valve Control Circuit High', 4, '["Check Engine Light illuminated", "Loss of boost pressure", "Reduced power", "Turbo whine/whistle"]', '["Damaged, corroded, or shorted wiring in related circuit", "Failed or stuck valve/solenoid/actuator"]', '["Inspect and repair wiring harness and connectors", "Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0036', 'HO2S Heater Control Circuit (Bank 1 Sensor 2)', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0037', 'HO2S Heater Control Circuit Low (Bank 1 Sensor 2)', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0038', 'HO2S Heater Control Circuit High (Bank 1 Sensor 2)', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0039', 'Turbo/Super Charger Bypass Valve Control Circuit Range/Performance', 4, '["Check Engine Light illuminated", "Loss of boost pressure", "Reduced power", "Turbo whine/whistle"]', '["Damaged, corroded, or shorted wiring in related circuit", "Failed or stuck valve/solenoid/actuator"]', '["Inspect and repair wiring harness and connectors", "Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P003A', 'Turbocharger/Supercharger Boost ControlAPosition Exceeded Learning Limit', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Loss of boost pressure", "Reduced power"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P003B', 'Turbocharger/Supercharger Boost ControlBPosition Exceeded Learning Limit', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Loss of boost pressure", "Reduced power"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P003C', ' ACamshaft Profile Control Performance/Stuck Off Bank 1', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P003D', ' ACamshaft Profile Control Stuck On Bank 1', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P003E', ' ACamshaft Profile Control Performance/Stuck Off Bank 2', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P003F', ' ACamshaft Profile Control Stuck On Bank 2', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0040', 'Upstream Oxygen Sensors Swapped From Bank To Bank', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Faulty sensor (internal failure)"]', '["Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0041', 'Downstream Oxygen Sensors Swapped From Bank To Bank', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Faulty sensor (internal failure)"]', '["Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0042', 'HO2S Heater Control Circuit (Bank 1 Sensor 3)', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0043', 'HO2S Heater Control Circuit Low (Bank 1 Sensor 3)', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0044', 'HO2S Heater Control Circuit High (Bank 1 Sensor 3)', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0045', 'Turbocharger/Supercharger Boost ControlACircuit/Open', 4, '["Check Engine Light illuminated", "Loss of boost pressure", "Reduced power", "Turbo whine/whistle"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0046', 'Turbocharger/Supercharger Boost ControlACircuit Range/Performance', 4, '["Check Engine Light illuminated", "Loss of boost pressure", "Reduced power", "Turbo whine/whistle"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0047', 'Turbocharger/Supercharger Boost ControlACircuit Low', 4, '["Check Engine Light illuminated", "Loss of boost pressure", "Reduced power", "Turbo whine/whistle"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0048', 'Turbocharger/Supercharger Boost ControlACircuit High', 4, '["Check Engine Light illuminated", "Loss of boost pressure", "Reduced power", "Turbo whine/whistle"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0049', 'Turbocharger/Supercharger Turbine Overspeed', 4, '["Check Engine Light illuminated", "Loss of boost pressure", "Reduced power", "Turbo whine/whistle"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P004A', 'Turbocharger/Supercharger Boost ControlBCircuit/Open', 4, '["Check Engine Light illuminated", "Loss of boost pressure", "Reduced power", "Turbo whine/whistle"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P004B', 'Turbocharger/Supercharger Boost ControlBCircuit Range/Performance', 4, '["Check Engine Light illuminated", "Loss of boost pressure", "Reduced power", "Turbo whine/whistle"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P004C', 'Turbocharger/Supercharger Boost ControlBCircuit Low', 4, '["Check Engine Light illuminated", "Loss of boost pressure", "Reduced power", "Turbo whine/whistle"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P004D', 'Turbocharger/Supercharger Boost ControlBCircuit High', 4, '["Check Engine Light illuminated", "Loss of boost pressure", "Reduced power", "Turbo whine/whistle"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P004E', 'Turbocharger/Supercharger Boost ControlACircuit Intermittent/Erratic', 4, '["Check Engine Light illuminated", "Loss of boost pressure", "Reduced power", "Turbo whine/whistle"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P004F', 'Turbocharger/Supercharger Boost ControlBCircuit Intermittent/Erratic', 4, '["Check Engine Light illuminated", "Loss of boost pressure", "Reduced power", "Turbo whine/whistle"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0050', 'HO2S Heater Control Circuit (Bank 2 Sensor 1)', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0051', 'HO2S Heater Control Circuit Low (Bank 2 Sensor 1)', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0052', 'HO2S Heater Control Circuit High (Bank 2 Sensor 1)', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0053', 'HO2S Heater Resistance (Bank 1, Sensor 1)', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Faulty sensor (internal failure)"]', '["Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0054', 'HO2S Heater Resistance (Bank 1, Sensor 2)', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Faulty sensor (internal failure)"]', '["Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0055', 'HO2S Heater Resistance (Bank 1, Sensor 3)', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Faulty sensor (internal failure)"]', '["Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0056', 'HO2S Heater Control Circuit (Bank 2 Sensor 2)', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0057', 'HO2S Heater Control Circuit Low (Bank 2 Sensor 2)', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0058', 'HO2S Heater Control Circuit High (Bank 2 Sensor 2)', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0059', 'HO2S Heater Resistance (Bank 2, Sensor 1)', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Faulty sensor (internal failure)"]', '["Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P005A', ' BCamshaft Profile Control Performance/Stuck Off Bank 1', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P005B', ' BCamshaft Profile Control Stuck On Bank 1', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P005C', ' BCamshaft Profile Control Performance/Stuck Off Bank 2', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P005D', ' BCamshaft Profile Control Stuck On Bank 2', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P005E', 'Turbocharger/Supercharger Boost ControlBSupply Voltage Circuit Low', 4, '["Check Engine Light illuminated", "Loss of boost pressure", "Reduced power", "Turbo whine/whistle", "Battery warning light", "Charging system malfunction"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P005F', 'Turbocharger/Supercharger Boost ControlBSupply Voltage Circuit High', 4, '["Check Engine Light illuminated", "Loss of boost pressure", "Reduced power", "Turbo whine/whistle", "Battery warning light", "Charging system malfunction"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0060', 'HO2S Heater Resistance (Bank 2, Sensor 2)', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Faulty sensor (internal failure)"]', '["Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0061', 'HO2S Heater Resistance (Bank 2, Sensor 3)', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Faulty sensor (internal failure)"]', '["Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0062', 'HO2S Heater Control Circuit (Bank 2 Sensor 3)', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0063', 'HO2S Heater Control Circuit Low (Bank 2 Sensor 3)', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0064', 'HO2S Heater Control Circuit High (Bank 2 Sensor 3)', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0065', 'Air Assisted Injector Control Range/Performance', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0066', 'Air Assisted Injector Control Circuit or Circuit Low', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0067', 'Air Assisted Injector Control Circuit High', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0068', 'MAP/MAF - Throttle Position Correlation', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Erratic throttle response", "Reduced power/limp mode"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0069', 'Manifold Absolute Pressure - Barometric Pressure Correlation', 4, '["Check Engine Light illuminated", "ABS warning light", "Brake system warning"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P006A', 'MAP - Mass or Volume Air Flow Correlation Bank 1', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P006B', 'MAP - Exhaust Pressure Correlation', 3, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P006C', 'MAP - Turbocharger/Supercharger Inlet Pressure Correlation', 4, '["Check Engine Light illuminated", "Loss of boost pressure", "Reduced power", "Turbo whine/whistle"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P006D', 'Barometric Pressure - Turbocharger/Supercharger Inlet Pressure Correlation', 4, '["Check Engine Light illuminated", "Loss of boost pressure", "Reduced power", "Turbo whine/whistle"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P006E', 'Turbocharger/Supercharger Boost ControlASupply Voltage Circuit Low', 4, '["Check Engine Light illuminated", "Loss of boost pressure", "Reduced power", "Turbo whine/whistle", "Battery warning light", "Charging system malfunction"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P006F', 'Turbocharger/Supercharger Boost ControlASupply Voltage Circuit High', 4, '["Check Engine Light illuminated", "Loss of boost pressure", "Reduced power", "Turbo whine/whistle", "Battery warning light", "Charging system malfunction"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0070', 'Ambient Air Temperature Sensor Circuit', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0071', 'Ambient Air Temperature Sensor Range/Performance', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0072', 'Ambient Air Temperature Sensor Circuit Low Input', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0073', 'Ambient Air Temperature Sensor Circuit High Input', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0074', 'Ambient Air Temperature Sensor Circuit Intermittent', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0075', 'Intake Valve Control Solenoid Circuit (Bank 1)', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit", "Failed or stuck valve/solenoid/actuator"]', '["Inspect and repair wiring harness and connectors", "Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0076', 'Intake Valve Control Solenoid Circuit Low (Bank 1)', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit", "Failed or stuck valve/solenoid/actuator"]', '["Inspect and repair wiring harness and connectors", "Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0077', 'Intake Valve Control Solenoid Circuit High (Bank 1)', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit", "Failed or stuck valve/solenoid/actuator"]', '["Inspect and repair wiring harness and connectors", "Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0078', 'Exhaust Valve Control Solenoid Circuit (Bank 1)', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit", "Failed or stuck valve/solenoid/actuator"]', '["Inspect and repair wiring harness and connectors", "Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0079', 'Exhaust Valve Control Solenoid Circuit Low (Bank 1)', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit", "Failed or stuck valve/solenoid/actuator"]', '["Inspect and repair wiring harness and connectors", "Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P007A', 'Charge Air Cooler Temperature Sensor Circuit Bank 1', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P007B', 'Charge Air Cooler Temperature Sensor Circuit Range/Performance Bank 1', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P007C', 'Charge Air Cooler Temperature Sensor Circuit Low Bank 1', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P007D', 'Charge Air Cooler Temperature Sensor Circuit High Bank 1', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P007E', 'Charge Air Cooler Temperature Sensor Circuit Intermittent/Erratic Bank 1', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P007F', 'Charge Air Cooler Temperature Sensor Bank1/Bank2 Correlation', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output"]', '["Faulty sensor (internal failure)"]', '["Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0080', 'Exhaust Valve Control Solenoid Circuit High (Bank 1)', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit", "Failed or stuck valve/solenoid/actuator"]', '["Inspect and repair wiring harness and connectors", "Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0081', 'Intake valve Control Solenoid Circuit (Bank 2)', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit", "Failed or stuck valve/solenoid/actuator"]', '["Inspect and repair wiring harness and connectors", "Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0082', 'Intake Valve Control Solenoid Circuit Low (Bank 2)', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit", "Failed or stuck valve/solenoid/actuator"]', '["Inspect and repair wiring harness and connectors", "Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0083', 'Intake Valve Control Solenoid Circuit High (Bank 2)', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit", "Failed or stuck valve/solenoid/actuator"]', '["Inspect and repair wiring harness and connectors", "Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0084', 'Exhaust Valve Control Solenoid Circuit (Bank 2)', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit", "Failed or stuck valve/solenoid/actuator"]', '["Inspect and repair wiring harness and connectors", "Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0085', 'Exhaust Valve Control Solenoid Circuit Low (Bank 2)', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit", "Failed or stuck valve/solenoid/actuator"]', '["Inspect and repair wiring harness and connectors", "Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0086', 'Exhaust Valve Control Solenoid Circuit High (Bank 2)', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit", "Failed or stuck valve/solenoid/actuator"]', '["Inspect and repair wiring harness and connectors", "Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0087', 'Fuel Rail/System Pressure - Too Low', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit", "Fuel system contamination or component failure"]', '["Inspect and repair wiring harness and connectors", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0088', 'Fuel Rail/System Pressure - Too High', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit", "Fuel system contamination or component failure"]', '["Inspect and repair wiring harness and connectors", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0089', 'Fuel Pressure Regulator 1 Performance', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit", "Fuel system contamination or component failure"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P008A', 'Low Pressure Fuel System Pressure - Too Low', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit", "Fuel system contamination or component failure"]', '["Inspect and repair wiring harness and connectors", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P008B', 'Low Pressure Fuel System Pressure - Too High', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit", "Fuel system contamination or component failure"]', '["Inspect and repair wiring harness and connectors", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P008C', 'Fuel Cooler Pump Control Circuit Open', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit", "Fuel system contamination or component failure"]', '["Inspect and repair wiring harness and connectors", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P008D', 'Fuel Cooler Pump Control Circuit Low', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit", "Fuel system contamination or component failure"]', '["Inspect and repair wiring harness and connectors", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P008E', 'Fuel Cooler Pump Control Circuit High', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit", "Fuel system contamination or component failure"]', '["Inspect and repair wiring harness and connectors", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P008F', 'Engine Coolant Temperature/Fuel Temperature Correlation', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting", "Temperature gauge fluctuation", "Poor heater output"]', '["Fuel system contamination or component failure"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0090', 'Fuel Pressure Regulator 1 Control Circuit', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit", "Fuel system contamination or component failure"]', '["Inspect and repair wiring harness and connectors", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0091', 'Fuel Pressure Regulator 1 Control Circuit Low', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit", "Fuel system contamination or component failure"]', '["Inspect and repair wiring harness and connectors", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0092', 'Fuel Pressure Regulator 1 Control Circuit High', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit", "Fuel system contamination or component failure"]', '["Inspect and repair wiring harness and connectors", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0093', 'Fuel System Leak Detected - Large Leak', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting", "Fuel odor detected", "Difficulty refueling"]', '["Fuel system contamination or component failure"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0094', 'Fuel System Leak Detected - Small Leak', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting", "Fuel odor detected", "Difficulty refueling"]', '["Fuel system contamination or component failure"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0095', 'Intake Air Temperature Sensor 2 Circuit Bank 1', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0096', 'Intake Air Temperature Sensor 2 Circuit Range/Performance Bank 1', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0097', 'Intake Air Temperature Sensor 2 Circuit Low Bank 1', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0098', 'Intake Air Temperature Sensor 2 Circuit High Bank 1', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0099', 'Intake Air Temperature Sensor 2 Circuit Intermittent/Erratic Bank 1', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P009A', 'Intake Air Temperature/Ambient Air Temperature Correlation', 3, '["Check Engine Light illuminated", "Temperature gauge fluctuation", "Poor heater output"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P009B', 'Fuel Pressure Relief Control Circuit/Open', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit", "Fuel system contamination or component failure"]', '["Inspect and repair wiring harness and connectors", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P009C', 'Fuel Pressure Relief Control Circuit Low', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit", "Fuel system contamination or component failure"]', '["Inspect and repair wiring harness and connectors", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P009D', 'Fuel Pressure Relief Control Circuit High', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit", "Fuel system contamination or component failure"]', '["Inspect and repair wiring harness and connectors", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P009E', 'Fuel Pressure Relief Control Performance/Stuck Off', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit", "Fuel system contamination or component failure"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P009F', 'Fuel Pressure Relief Control Stuck On', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Fuel system contamination or component failure"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P00A0', 'Charge Air Cooler Temperature Sensor Circuit Bank 2', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P00A1', 'Charge Air Cooler Temperature Sensor Circuit Range/Performance Bank 2', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P00A2', 'Charge Air Cooler Temperature Sensor Circuit Low Bank 2', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P00A3', 'Charge Air Cooler Temperature Sensor Circuit High Bank 2', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P00A4', 'Charge Air Cooler Temperature Sensor Circuit Intermittent/Erratic Bank 2', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P00A5', 'Intake Air Temperature Sensor 2 Circuit Bank 2', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P00A6', 'Intake Air Temperature Sensor 2 Circuit Range/Performance Bank 2', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P00A7', 'Intake Air Temperature Sensor 2 Circuit Low Bank 2', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P00A8', 'Intake Air Temperature Sensor 2 Circuit High Bank 2', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P00A9', 'Intake Air Temperature Sensor 2 Circuit Intermittent/Erratic Bank 2', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P00AA', 'Intake Air Temperature Sensor 1 Circuit Bank 2', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P00AB', 'Intake Air Temperature Sensor 1 Circuit Range/Performance Bank 2', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P00AC', 'Intake Air Temperature Sensor 1 Circuit Low Bank 2', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P00AD', 'Intake Air Temperature Sensor 1 Circuit High Bank 2', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P00AE', 'Intake Air Temperature Sensor 1 Circuit Intermittent/Erratic Bank 2', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P00AF', 'Turbocharger/Supercharger Boost ControlAModule Performance', 4, '["Check Engine Light illuminated", "Loss of boost pressure", "Reduced power", "Turbo whine/whistle"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty control module (PCM/ECM/TCM)"]', '["Reprogram or replace control module", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P00B0', 'Turbocharger/Supercharger Boost ControlBModule Performance', 4, '["Check Engine Light illuminated", "Loss of boost pressure", "Reduced power", "Turbo whine/whistle"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty control module (PCM/ECM/TCM)"]', '["Reprogram or replace control module", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P00B1', 'Radiator Coolant Temperature Sensor Circuit', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P00B2', 'Radiator Coolant Temperature Sensor Circuit Range/Performance', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P00B3', 'Radiator Coolant Temperature Sensor Circuit Low', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P00B4', 'Radiator Coolant Temperature Sensor Circuit High', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P00B5', 'Radiator Coolant Temperature Sensor Circuit Intermittent/Erratic', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P00B6', 'Radiator Coolant Temperature/Engine Coolant Temperature Correlation', 3, '["Check Engine Light illuminated", "Temperature gauge fluctuation", "Poor heater output"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P00B7', 'Engine Coolant Flow Low/Performance', 3, '["Check Engine Light illuminated", "Temperature gauge fluctuation", "Poor heater output"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P00B8', 'MAP - Mass or Volume Air Flow Correlation Bank 2', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P00B9', 'Low Pressure Fuel System Pressure - Too Low, Low Ambient Temperature', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting", "Temperature gauge fluctuation", "Poor heater output"]', '["Damaged, corroded, or shorted wiring in related circuit", "Fuel system contamination or component failure"]', '["Inspect and repair wiring harness and connectors", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P00BA', 'Low Fuel Pressure - Forced Limited Power', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit", "Fuel system contamination or component failure"]', '["Inspect and repair wiring harness and connectors", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P00BB', 'Fuel Injector Insufficient Flow - Forced Limited Power', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit", "Fuel system contamination or component failure"]', '["Inspect and repair wiring harness and connectors", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P00BC', 'Mass or Volume Air FlowACircuit Range/Performance - Air Flow Too Low', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P00BD', 'Mass or Volume Air FlowACircuit Range/Performance - Air Flow Too High', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P00BE', 'Mass or Volume Air FlowBCircuit Range/Performance - Air Flow Too Low', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P00BF', 'Mass or Volume Air FlowBCircuit Range/Performance - Air Flow Too High', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P00C0', 'P00FF ISO/SAE Reserved', 3, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0100', 'Mass or Volume Air FlowACircuit Malfunction', 3, '["Check Engine Light on", "Engine stalling or hesitation", "Black smoke from exhaust", "Poor fuel economy", "Rough idle"]', '["Dirty or faulty MAF sensor", "Air intake leaks", "Clogged air filter", "Wiring damage", "Faulty PCM"]', '["Clean or replace MAF sensor", "Repair vacuum/intake leaks", "Replace air filter", "Repair wiring harness"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0101', 'Mass or Volume Air FlowACircuit Range/Performance Problem', 3, '["Check Engine Light on", "Engine stalling or hesitation", "Black smoke from exhaust", "Poor fuel economy", "Rough idle"]', '["Dirty or faulty MAF sensor", "Air intake leaks", "Clogged air filter", "Wiring damage", "Faulty PCM"]', '["Clean or replace MAF sensor", "Repair vacuum/intake leaks", "Replace air filter", "Repair wiring harness"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0102', 'Mass or Volume Air FlowACircuit Low Input', 3, '["Check Engine Light on", "Engine stalling or hesitation", "Black smoke from exhaust", "Poor fuel economy", "Rough idle"]', '["Dirty or faulty MAF sensor", "Air intake leaks", "Clogged air filter", "Wiring damage", "Faulty PCM"]', '["Clean or replace MAF sensor", "Repair vacuum/intake leaks", "Replace air filter", "Repair wiring harness"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0103', 'Mass or Volume Air FlowACircuit High Input', 3, '["Check Engine Light on", "Engine stalling or hesitation", "Black smoke from exhaust", "Poor fuel economy", "Rough idle"]', '["Dirty or faulty MAF sensor", "Air intake leaks", "Clogged air filter", "Wiring damage", "Faulty PCM"]', '["Clean or replace MAF sensor", "Repair vacuum/intake leaks", "Replace air filter", "Repair wiring harness"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0104', 'Mass or Volume Air FlowACircuit Intermittent', 3, '["Check Engine Light on", "Engine stalling or hesitation", "Black smoke from exhaust", "Poor fuel economy", "Rough idle"]', '["Dirty or faulty MAF sensor", "Air intake leaks", "Clogged air filter", "Wiring damage", "Faulty PCM"]', '["Clean or replace MAF sensor", "Repair vacuum/intake leaks", "Replace air filter", "Repair wiring harness"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0105', 'Manifold Absolute Pressure/Barometric Pressure Circuit Malfunction', 3, '["Check Engine Light on", "Poor acceleration", "Engine stall", "Rich or lean fuel mixture"]', '["Faulty MAP sensor", "Vacuum leak", "Clogged MAP sensor port", "Wiring issues"]', '["Replace MAP sensor", "Repair vacuum leaks", "Clean MAP sensor port", "Check wiring connections"]', 80, 350)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0106', 'Manifold Absolute Pressure/Barometric Pressure Circuit Range/Performance Problem', 3, '["Check Engine Light on", "Poor acceleration", "Engine stall", "Rich or lean fuel mixture"]', '["Faulty MAP sensor", "Vacuum leak", "Clogged MAP sensor port", "Wiring issues"]', '["Replace MAP sensor", "Repair vacuum leaks", "Clean MAP sensor port", "Check wiring connections"]', 80, 350)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0107', 'Manifold Absolute Pressure/Barometric Pressure Circuit Low Input', 3, '["Check Engine Light on", "Poor acceleration", "Engine stall", "Rich or lean fuel mixture"]', '["Faulty MAP sensor", "Vacuum leak", "Clogged MAP sensor port", "Wiring issues"]', '["Replace MAP sensor", "Repair vacuum leaks", "Clean MAP sensor port", "Check wiring connections"]', 80, 350)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0108', 'Manifold Absolute Pressure/Barometric Pressure Circuit High Input', 3, '["Check Engine Light on", "Poor acceleration", "Engine stall", "Rich or lean fuel mixture"]', '["Faulty MAP sensor", "Vacuum leak", "Clogged MAP sensor port", "Wiring issues"]', '["Replace MAP sensor", "Repair vacuum leaks", "Clean MAP sensor port", "Check wiring connections"]', 80, 350)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0109', 'Manifold Absolute Pressure/Barometric Pressure Circuit Intermittent', 3, '["Check Engine Light on", "Poor acceleration", "Engine stall", "Rich or lean fuel mixture"]', '["Faulty MAP sensor", "Vacuum leak", "Clogged MAP sensor port", "Wiring issues"]', '["Replace MAP sensor", "Repair vacuum leaks", "Clean MAP sensor port", "Check wiring connections"]', 80, 350)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P010A', 'Mass or Volume Air FlowBCircuit', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P010B', 'Mass or Volume Air FlowBCircuit Range/Performance', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P010C', 'Mass or Volume Air FlowBCircuit Low', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P010D', 'Mass or Volume Air FlowBCircuit High', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P010E', 'Mass or Volume Air FlowBCircuit Intermittent/Erratic', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P010F', 'Mass or Volume Air Flow Sensor A/B Correlation', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0110', 'Intake Air Temperature Circuit Malfunction Bank 1', 2, '["Check Engine Light on", "Hard cold starts", "Engine overheating", "Poor fuel economy", "Cooling fan runs constantly"]', '["Faulty IAT sensor (often integrated in MAF)", "Damaged wiring", "Dirty sensor element", "PCM fault"]', '["Replace IAT sensor or MAF assembly", "Repair wiring", "Clean sensor connector", "Check PCM"]', 50, 300)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0111', 'Intake Air Temperature Circuit Range/Performance Problem Bank 1', 2, '["Check Engine Light on", "Hard cold starts", "Engine overheating", "Poor fuel economy", "Cooling fan runs constantly"]', '["Faulty IAT sensor (often integrated in MAF)", "Damaged wiring", "Dirty sensor element", "PCM fault"]', '["Replace IAT sensor or MAF assembly", "Repair wiring", "Clean sensor connector", "Check PCM"]', 50, 300)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0112', 'Intake Air Temperature Circuit Low Input Bank 1', 2, '["Check Engine Light on", "Hard cold starts", "Engine overheating", "Poor fuel economy", "Cooling fan runs constantly"]', '["Faulty IAT sensor (often integrated in MAF)", "Damaged wiring", "Dirty sensor element", "PCM fault"]', '["Replace IAT sensor or MAF assembly", "Repair wiring", "Clean sensor connector", "Check PCM"]', 50, 300)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0113', 'Intake Air Temperature Circuit High Input Bank 1', 2, '["Check Engine Light on", "Hard cold starts", "Engine overheating", "Poor fuel economy", "Cooling fan runs constantly"]', '["Faulty IAT sensor (often integrated in MAF)", "Damaged wiring", "Dirty sensor element", "PCM fault"]', '["Replace IAT sensor or MAF assembly", "Repair wiring", "Clean sensor connector", "Check PCM"]', 50, 300)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0114', 'Intake Air Temperature Circuit Intermittent Bank 1', 2, '["Check Engine Light on", "Hard cold starts", "Engine overheating", "Poor fuel economy", "Cooling fan runs constantly"]', '["Faulty IAT sensor (often integrated in MAF)", "Damaged wiring", "Dirty sensor element", "PCM fault"]', '["Replace IAT sensor or MAF assembly", "Repair wiring", "Clean sensor connector", "Check PCM"]', 50, 300)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0115', 'Engine Coolant Temperature Sensor Circuit 1 Malfunction', 3, '["Check Engine Light on", "Temperature gauge reads incorrectly", "Hard starting", "Cooling fan malfunction", "Poor fuel economy"]', '["Faulty engine coolant temperature (ECT) sensor", "Low coolant level", "Stuck-open thermostat", "Wiring damage"]', '["Replace ECT sensor", "Replace thermostat", "Top up coolant and bleed system", "Repair wiring/connector"]', 80, 400)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0116', 'Engine Coolant Temperature Sensor Circuit 1 Range/Performance Problem', 3, '["Check Engine Light on", "Temperature gauge reads incorrectly", "Hard starting", "Cooling fan malfunction", "Poor fuel economy"]', '["Faulty engine coolant temperature (ECT) sensor", "Low coolant level", "Stuck-open thermostat", "Wiring damage"]', '["Replace ECT sensor", "Replace thermostat", "Top up coolant and bleed system", "Repair wiring/connector"]', 80, 400)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0117', 'Engine Coolant Temperature Sensor Circuit 1 Low Input', 3, '["Check Engine Light on", "Temperature gauge reads incorrectly", "Hard starting", "Cooling fan malfunction", "Poor fuel economy"]', '["Faulty engine coolant temperature (ECT) sensor", "Low coolant level", "Stuck-open thermostat", "Wiring damage"]', '["Replace ECT sensor", "Replace thermostat", "Top up coolant and bleed system", "Repair wiring/connector"]', 80, 400)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0118', 'Engine Coolant Temperature Sensor Circuit 1 High Input', 3, '["Check Engine Light on", "Temperature gauge reads incorrectly", "Hard starting", "Cooling fan malfunction", "Poor fuel economy"]', '["Faulty engine coolant temperature (ECT) sensor", "Low coolant level", "Stuck-open thermostat", "Wiring damage"]', '["Replace ECT sensor", "Replace thermostat", "Top up coolant and bleed system", "Repair wiring/connector"]', 80, 400)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0119', 'Engine Coolant Temperature Sensor Circuit 1 Intermittent', 3, '["Check Engine Light on", "Temperature gauge reads incorrectly", "Hard starting", "Cooling fan malfunction", "Poor fuel economy"]', '["Faulty engine coolant temperature (ECT) sensor", "Low coolant level", "Stuck-open thermostat", "Wiring damage"]', '["Replace ECT sensor", "Replace thermostat", "Top up coolant and bleed system", "Repair wiring/connector"]', 80, 400)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P011A', 'Engine Coolant Temperature Sensor 1/2 Correlation', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output"]', '["Faulty sensor (internal failure)"]', '["Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P011B', 'Coolant Temperature/Intake Air Temperature Correlation', 3, '["Check Engine Light illuminated", "Temperature gauge fluctuation", "Poor heater output"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P011C', 'Charge Air Temperature/Intake Air Temperature Correlation Bank 1', 3, '["Check Engine Light illuminated", "Temperature gauge fluctuation", "Poor heater output"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P011D', 'Charge Air Temperature/Intake Air Temperature Correlation Bank 2', 3, '["Check Engine Light illuminated", "Temperature gauge fluctuation", "Poor heater output"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P011E,', 'P011F ISO/SAE Reserved', 3, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0120', 'Throttle Position Sensor/Switch A Circuit Malfunction', 3, '["Check Engine Light on", "Erratic throttle response", "Limp mode", "Poor acceleration", "Engine surge"]', '["Faulty throttle position sensor (TPS)", "Damaged wiring", "Corroded connectors", "Throttle body issues"]', '["Replace TPS sensor", "Clean throttle body", "Repair wiring harness", "Perform throttle relearn procedure"]', 100, 450)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0121', 'Throttle Position Sensor/Switch A Circuit Range/Performance Problem', 3, '["Check Engine Light on", "Erratic throttle response", "Limp mode", "Poor acceleration", "Engine surge"]', '["Faulty throttle position sensor (TPS)", "Damaged wiring", "Corroded connectors", "Throttle body issues"]', '["Replace TPS sensor", "Clean throttle body", "Repair wiring harness", "Perform throttle relearn procedure"]', 100, 450)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0122', 'Throttle Position Sensor/Switch A Circuit Low Input', 3, '["Check Engine Light on", "Erratic throttle response", "Limp mode", "Poor acceleration", "Engine surge"]', '["Faulty throttle position sensor (TPS)", "Damaged wiring", "Corroded connectors", "Throttle body issues"]', '["Replace TPS sensor", "Clean throttle body", "Repair wiring harness", "Perform throttle relearn procedure"]', 100, 450)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0123', 'Throttle Position Sensor/Switch A Circuit High Input', 3, '["Check Engine Light on", "Erratic throttle response", "Limp mode", "Poor acceleration", "Engine surge"]', '["Faulty throttle position sensor (TPS)", "Damaged wiring", "Corroded connectors", "Throttle body issues"]', '["Replace TPS sensor", "Clean throttle body", "Repair wiring harness", "Perform throttle relearn procedure"]', 100, 450)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0124', 'Throttle Position Sensor/Switch A Circuit Intermittent', 3, '["Check Engine Light on", "Erratic throttle response", "Limp mode", "Poor acceleration", "Engine surge"]', '["Faulty throttle position sensor (TPS)", "Damaged wiring", "Corroded connectors", "Throttle body issues"]', '["Replace TPS sensor", "Clean throttle body", "Repair wiring harness", "Perform throttle relearn procedure"]', 100, 450)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0125', 'Insufficient Coolant Temperature for Closed Loop Fuel Control', 2, '["Check Engine Light on", "Poor fuel economy", "Heater output weak", "Engine runs rich"]', '["Stuck-open thermostat", "Low coolant level", "Faulty ECT sensor", "Insufficient warm-up driving"]', '["Replace thermostat", "Top up and bleed coolant", "Replace ECT sensor", "Clear codes and verify"]', 150, 450)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0126', 'Insufficient Coolant Temperature for Stable Operation', 2, '["Check Engine Light on", "Temperature gauge fluctuates", "Poor fuel economy"]', '["Stuck-open thermostat", "Low coolant", "Faulty ECT sensor"]', '["Replace thermostat", "Top up coolant", "Replace ECT sensor"]', 150, 400)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0127', 'Intake Air Temperature Too High', 3, '["Check Engine Light illuminated", "Temperature gauge fluctuation", "Poor heater output"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0128', 'Coolant Thermostat (Coolant Temperature Below Thermostat Regulating Temperature)', 2, '["Check Engine Light on", "Engine takes too long to warm up", "Poor fuel economy", "Heater blows lukewarm air"]', '["Stuck-open thermostat", "Low coolant level", "Faulty ECT sensor", "Extreme cold weather operation"]', '["Replace thermostat (most common fix)", "Top up and bleed cooling system", "Replace ECT sensor", "Verify proper coolant mixture"]', 150, 450)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0129', 'Barometric Pressure Too Low', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P012A', 'Turbocharger/Supercharger Inlet Pressure Sensor Circuit (Downstream of throttle valve) ', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Erratic throttle response", "Reduced power/limp mode", "Loss of boost pressure"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)", "Failed or stuck valve/solenoid/actuator"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P012B', 'Turbocharger/Supercharger Inlet Pressure Sensor Circuit Range/Performance (Downstream of throttle valve) ', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Erratic throttle response", "Reduced power/limp mode", "Loss of boost pressure"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)", "Failed or stuck valve/solenoid/actuator"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P012C', 'Turbocharger/Supercharger Inlet Pressure Sensor Circuit Low (Downstream of throttle valve)', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Erratic throttle response", "Reduced power/limp mode", "Loss of boost pressure"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)", "Failed or stuck valve/solenoid/actuator"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P012D', 'Turbocharger/Supercharger Inlet Pressure Sensor Circuit High (Downstream of throttle valve) ', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Erratic throttle response", "Reduced power/limp mode", "Loss of boost pressure"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)", "Failed or stuck valve/solenoid/actuator"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P012E', 'Turbocharger/Supercharger Inlet Pressure Sensor Circuit Intermittent/Erratic (Downstream of throttle valve)', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Erratic throttle response", "Reduced power/limp mode", "Loss of boost pressure"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)", "Failed or stuck valve/solenoid/actuator"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P012F', 'Reserved ', 3, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0130', '02 Sensor Circuit Malfunction (Bank I Sensor 1)', 3, '["Check Engine Light on", "Failed emissions test", "Poor fuel economy", "Rough idle", "Rich exhaust smell"]', '["Faulty upstream O2 sensor (Bank 1 Sensor 1)", "Exhaust leak before sensor", "Wiring damage", "Contaminated sensor", "Rich/lean running condition"]', '["Replace upstream O2 sensor", "Repair exhaust leak", "Repair wiring", "Address underlying fuel mixture issue", "Clear codes and verify fix"]', 150, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0131', '02 Sensor Circuit Low Voltage (Bank I Sensor I)', 3, '["Check Engine Light on", "Failed emissions test", "Poor fuel economy", "Rough idle", "Rich exhaust smell"]', '["Faulty upstream O2 sensor (Bank 1 Sensor 1)", "Exhaust leak before sensor", "Wiring damage", "Contaminated sensor", "Rich/lean running condition"]', '["Replace upstream O2 sensor", "Repair exhaust leak", "Repair wiring", "Address underlying fuel mixture issue", "Clear codes and verify fix"]', 150, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0132', '02 Sensor Circuit High Voltage (Bank I Sensor 1)', 3, '["Check Engine Light on", "Failed emissions test", "Poor fuel economy", "Rough idle", "Rich exhaust smell"]', '["Faulty upstream O2 sensor (Bank 1 Sensor 1)", "Exhaust leak before sensor", "Wiring damage", "Contaminated sensor", "Rich/lean running condition"]', '["Replace upstream O2 sensor", "Repair exhaust leak", "Repair wiring", "Address underlying fuel mixture issue", "Clear codes and verify fix"]', 150, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0133', '02 Sensor Circuit Slow Response (Bank 1 Sensor 1)', 3, '["Check Engine Light on", "Failed emissions test", "Poor fuel economy", "Rough idle", "Rich exhaust smell"]', '["Faulty upstream O2 sensor (Bank 1 Sensor 1)", "Exhaust leak before sensor", "Wiring damage", "Contaminated sensor", "Rich/lean running condition"]', '["Replace upstream O2 sensor", "Repair exhaust leak", "Repair wiring", "Address underlying fuel mixture issue", "Clear codes and verify fix"]', 150, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0134', '02 Sensor Circuit No Activity Detected (Bank I Sensor 1)', 3, '["Check Engine Light on", "Failed emissions test", "Poor fuel economy", "Rough idle", "Rich exhaust smell"]', '["Faulty upstream O2 sensor (Bank 1 Sensor 1)", "Exhaust leak before sensor", "Wiring damage", "Contaminated sensor", "Rich/lean running condition"]', '["Replace upstream O2 sensor", "Repair exhaust leak", "Repair wiring", "Address underlying fuel mixture issue", "Clear codes and verify fix"]', 150, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0135', '02 Sensor Heater Circuit Malfunction (Bank 1 Sensor 1)', 3, '["Check Engine Light on", "Failed emissions test", "Poor fuel economy", "Rough idle", "Rich exhaust smell"]', '["Faulty upstream O2 sensor (Bank 1 Sensor 1)", "Exhaust leak before sensor", "Wiring damage", "Contaminated sensor", "Rich/lean running condition"]', '["Replace upstream O2 sensor", "Repair exhaust leak", "Repair wiring", "Address underlying fuel mixture issue", "Clear codes and verify fix"]', 150, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0136', '02 Sensor Circuit Malfunction (Bank I Sensor 2)', 2, '["Check Engine Light on", "Failed emissions test", "No noticeable driveability symptoms"]', '["Faulty downstream O2 sensor (Bank 1 Sensor 2)", "Exhaust leak", "Wiring damage", "Catalytic converter issue"]', '["Replace downstream O2 sensor", "Repair exhaust leak", "Repair wiring", "Check catalytic converter efficiency"]', 120, 450)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0137', '02 Sensor Circuit Low Voltage (Bank I Sensor 2)', 2, '["Check Engine Light on", "Failed emissions test", "No noticeable driveability symptoms"]', '["Faulty downstream O2 sensor (Bank 1 Sensor 2)", "Exhaust leak", "Wiring damage", "Catalytic converter issue"]', '["Replace downstream O2 sensor", "Repair exhaust leak", "Repair wiring", "Check catalytic converter efficiency"]', 120, 450)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0138', '02 Sensor Circuit High Voltage (Bank I Sensor 2)', 2, '["Check Engine Light on", "Failed emissions test", "No noticeable driveability symptoms"]', '["Faulty downstream O2 sensor (Bank 1 Sensor 2)", "Exhaust leak", "Wiring damage", "Catalytic converter issue"]', '["Replace downstream O2 sensor", "Repair exhaust leak", "Repair wiring", "Check catalytic converter efficiency"]', 120, 450)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0139', '02 Sensor Circuit Slow Response (Bank 1 Sensor 2)', 2, '["Check Engine Light on", "Failed emissions test", "No noticeable driveability symptoms"]', '["Faulty downstream O2 sensor (Bank 1 Sensor 2)", "Exhaust leak", "Wiring damage", "Catalytic converter issue"]', '["Replace downstream O2 sensor", "Repair exhaust leak", "Repair wiring", "Check catalytic converter efficiency"]', 120, 450)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P013A', 'O2 Sensor Slow Response - Rich to Lean (Bank 1 Sensor 2) ', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P013B', 'O2 Sensor Slow Response - Lean to Rich (Bank 1 Sensor 2)', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P013C', 'O2 Sensor Slow Response - Rich to Lean (Bank 2 Sensor 2) ', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P013D', 'O2 Sensor Slow Response - Lean to Rich (Bank 2 Sensor 2)', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P013E', 'O2 Sensor Delayed Response - Rich to Lean (Bank 1 Sensor 2)', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Faulty sensor (internal failure)"]', '["Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P013F', 'O2 Sensor Delayed Response - Lean to Rich (Bank 1 Sensor 2)', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Faulty sensor (internal failure)"]', '["Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0140', '02 Sensor Circuit No Activity Detected (Bank 1 Sensor 2)', 2, '["Check Engine Light on", "Failed emissions test", "No noticeable driveability symptoms"]', '["Faulty downstream O2 sensor (Bank 1 Sensor 2)", "Exhaust leak", "Wiring damage", "Catalytic converter issue"]', '["Replace downstream O2 sensor", "Repair exhaust leak", "Repair wiring", "Check catalytic converter efficiency"]', 120, 450)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0141', '02 Sensor Heater Circuit Malfunction (Bank 1 Sensor 2)', 2, '["Check Engine Light on", "Failed emissions test", "No noticeable driveability symptoms"]', '["Faulty downstream O2 sensor (Bank 1 Sensor 2)", "Exhaust leak", "Wiring damage", "Catalytic converter issue"]', '["Replace downstream O2 sensor", "Repair exhaust leak", "Repair wiring", "Check catalytic converter efficiency"]', 120, 450)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0142', '02 Sensor Circuit Malfunction (Bank 1 Sensor 3)', 2, '["Check Engine Light on", "Failed emissions test"]', '["Faulty O2 sensor", "Exhaust leak", "Wiring issue"]', '["Replace O2 sensor", "Repair exhaust leak", "Repair wiring"]', 120, 400)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0143', '02 Sensor Circuit Low Voltage (Bank 1 Sensor 3)', 2, '["Check Engine Light on", "Failed emissions test"]', '["Faulty O2 sensor", "Exhaust leak", "Wiring issue"]', '["Replace O2 sensor", "Repair exhaust leak", "Repair wiring"]', 120, 400)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0144', '02 Sensor Circuit High Voltage (Bank 1 Sensor 3)', 2, '["Check Engine Light on", "Failed emissions test"]', '["Faulty O2 sensor", "Exhaust leak", "Wiring issue"]', '["Replace O2 sensor", "Repair exhaust leak", "Repair wiring"]', 120, 400)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0145', '02 Sensor Circuit Slow Response (Bank 1 Sensor 3)', 2, '["Check Engine Light on", "Failed emissions test"]', '["Faulty O2 sensor", "Exhaust leak", "Wiring issue"]', '["Replace O2 sensor", "Repair exhaust leak", "Repair wiring"]', 120, 400)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0146', '02 Sensor Circuit No Activity Detected (Bank 1 Sensor 3)', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0147', '02 Sensor Heater Circuit Malfunction (Bank 1 Sensor 3)', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0148', 'Fuel Delivery Error ', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Fuel system contamination or component failure"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0149', 'Fuel Timing Error', 4, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting", "Engine rattle/timing noise", "Rough idle"]', '["Fuel system contamination or component failure"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P014A', 'O2 Sensor Delayed Response - Rich to Lean (Bank 2 Sensor 2) ', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Faulty sensor (internal failure)"]', '["Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P014B', 'O2 Sensor Delayed Response - Lean to Rich (Bank 2 Sensor 2)', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Faulty sensor (internal failure)"]', '["Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P014C', 'O2 Sensor Slow Response - Rich to Lean (Bank 1 Sensor 1) ', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P014D', 'O2 Sensor Slow Response - Lean to Rich (Bank 1 Sensor 1) ', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P014E', 'O2 Sensor Slow Response - Rich to Lean (Bank 2 Sensor 1)', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0150', '02 Sensor Circuit Malfunction (Bank 2 Sensor 1)', 3, '["Check Engine Light on", "Failed emissions test", "Poor fuel economy", "Rough idle"]', '["Faulty upstream O2 sensor (Bank 2 Sensor 1)", "Exhaust leak", "Wiring damage", "Rich/lean condition"]', '["Replace upstream O2 sensor Bank 2", "Repair exhaust leak", "Repair wiring", "Address fuel mixture"]', 150, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0151', '02 Sensor Circuit Low Voltage (Bank 2 Sensor 1)', 3, '["Check Engine Light on", "Failed emissions test", "Poor fuel economy", "Rough idle"]', '["Faulty upstream O2 sensor (Bank 2 Sensor 1)", "Exhaust leak", "Wiring damage", "Rich/lean condition"]', '["Replace upstream O2 sensor Bank 2", "Repair exhaust leak", "Repair wiring", "Address fuel mixture"]', 150, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0152', '02 Sensor Circuit High Voltage (Bank 2 Sensor 1)', 3, '["Check Engine Light on", "Failed emissions test", "Poor fuel economy", "Rough idle"]', '["Faulty upstream O2 sensor (Bank 2 Sensor 1)", "Exhaust leak", "Wiring damage", "Rich/lean condition"]', '["Replace upstream O2 sensor Bank 2", "Repair exhaust leak", "Repair wiring", "Address fuel mixture"]', 150, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0153', '02 Sensor Circuit Slow Response (Bank 2 Sensor 1)', 3, '["Check Engine Light on", "Failed emissions test", "Poor fuel economy", "Rough idle"]', '["Faulty upstream O2 sensor (Bank 2 Sensor 1)", "Exhaust leak", "Wiring damage", "Rich/lean condition"]', '["Replace upstream O2 sensor Bank 2", "Repair exhaust leak", "Repair wiring", "Address fuel mixture"]', 150, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0154', '02 Sensor Circuit No Activity Detected (Bank 2 Sensor 1)', 3, '["Check Engine Light on", "Failed emissions test", "Poor fuel economy", "Rough idle"]', '["Faulty upstream O2 sensor (Bank 2 Sensor 1)", "Exhaust leak", "Wiring damage", "Rich/lean condition"]', '["Replace upstream O2 sensor Bank 2", "Repair exhaust leak", "Repair wiring", "Address fuel mixture"]', 150, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0155', '02 Sensor Heater Circuit Malfunction (Bank 2 Sensor 1)', 3, '["Check Engine Light on", "Failed emissions test", "Poor fuel economy", "Rough idle"]', '["Faulty upstream O2 sensor (Bank 2 Sensor 1)", "Exhaust leak", "Wiring damage", "Rich/lean condition"]', '["Replace upstream O2 sensor Bank 2", "Repair exhaust leak", "Repair wiring", "Address fuel mixture"]', 150, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0156', '02 Sensor Circuit Malfunction (Bank 2 Sensor 2)', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0157', '02 Sensor Circuit Low Voltage (Bank 2 Sensor 2)', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Battery warning light", "Charging system malfunction", "Dim lights"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0158', '02 Sensor Circuit High Voltage (Bank 2 Sensor 2)', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Battery warning light", "Charging system malfunction", "Dim lights"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0159', '02 Sensor Circuit Slow Response (Bank 2 Sensor 2)', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P015A', 'O2 Sensor Delayed Response - Rich to Lean (Bank 1 Sensor 1)', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Faulty sensor (internal failure)"]', '["Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P015B', 'O2 Sensor Delayed Response - Lean to Rich (Bank 1 Sensor 1) ', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Faulty sensor (internal failure)"]', '["Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P015C', 'O2 Sensor Delayed Response - Rich to Lean (Bank 2 Sensor 1) ', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Faulty sensor (internal failure)"]', '["Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P015D', 'O2 Sensor Delayed Response - Lean to Rich (Bank 2 Sensor 1) ', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Faulty sensor (internal failure)"]', '["Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P015E	&', 'P015F ISO/SAE Reserved ', 3, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0160', '02 Sensor Circuit No Activity Detected (Bank 2 Sensor 2)', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0161', '02 Sensor Heater Circuit Malfunction (Bank 2 Sensor 2)', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0162', '02 Sensor Circuit Malfunction (Bank 2 Sensor 3)', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0163', '02 Sensor Circuit Low Voltage (Bank 2 Sensor 3)', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Battery warning light", "Charging system malfunction", "Dim lights"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0164', '02 Sensor Circuit High Voltage (Bank 2 Sensor 3)', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Battery warning light", "Charging system malfunction", "Dim lights"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0165', '02 Sensor Circuit Slow Response (Bank 2 Sensor 3)', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0166', '02 Sensor Circuit No Activity Detected (Bank 2 Sensor 3)', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0167', '02 Sensor Heater Circuit Malfunction (Bank 2 Sensor 3)', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0168', 'Temperature Too High', 3, '["Check Engine Light illuminated", "Temperature gauge fluctuation", "Poor heater output"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0169', 'Incorrect Fuel Composition ', 4, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting", "Engine rattle/timing noise", "Rough idle"]', '["Fuel system contamination or component failure"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P016A,', 'P016B, P016C, P016D, P016E, P016F ISO/SAE Reserved', 3, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0170', 'Fuel Trim Malfunction (Bank 1)', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Fuel system contamination or component failure"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0171', 'System too Lean (Bank 1)', 3, '["Check Engine Light on", "Engine hesitation", "Rough idle", "Loss of power", "Engine stalling", "Lean exhaust smell"]', '["Vacuum leak (intake manifold gasket, PCV hose)", "Dirty/faulty MAF sensor", "Clogged fuel filter", "Weak fuel pump", "Faulty O2 sensor", "Intake air leak after MAF"]', '["Smoke test to find vacuum leaks", "Clean or replace MAF sensor", "Replace fuel filter", "Test and replace fuel pump if needed", "Replace O2 sensor", "Repair intake leaks"]', 100, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0172', 'System too Rich (Bank 1)', 3, '["Check Engine Light on", "Black smoke from exhaust", "Poor fuel economy", "Rough idle", "Fuel smell"]', '["Faulty O2 sensor", "Leaking fuel injector", "Faulty fuel pressure regulator", "Clogged air filter", "Faulty MAF sensor", "PCM issue"]', '["Replace faulty O2 sensor", "Replace leaking injector", "Replace fuel pressure regulator", "Replace air filter", "Clean/replace MAF"]', 120, 700)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0173', 'Fuel Trim Malfunction (Bank 2)', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Fuel system contamination or component failure"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0174', 'System too Lean (Bank 2)', 3, '["Check Engine Light on", "Engine hesitation", "Rough idle", "Loss of power", "Lean condition on Bank 2"]', '["Vacuum leak", "Dirty/faulty MAF sensor", "Clogged fuel filter", "Weak fuel pump", "Faulty O2 sensor (Bank 2)"]', '["Smoke test for vacuum leaks", "Clean or replace MAF sensor", "Replace fuel filter", "Test fuel pressure", "Replace O2 sensor Bank 2"]', 100, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0175', 'System too Rich (Bank 2)', 3, '["Check Engine Light on", "Black smoke", "Poor fuel economy", "Fuel smell from exhaust"]', '["Faulty O2 sensor Bank 2", "Leaking fuel injector", "Faulty fuel pressure regulator", "Clogged air filter", "Faulty MAF"]', '["Replace faulty O2 sensor", "Replace leaking injector", "Replace fuel pressure regulator", "Replace air filter", "Clean/replace MAF"]', 120, 700)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0176', 'Fuel Composition Sensor Circuit Malfunction', 4, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting", "Engine rattle/timing noise", "Rough idle"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)", "Fuel system contamination or component failure"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0177', 'Fuel Composition Sensor Circuit Range/Performance', 4, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting", "Engine rattle/timing noise", "Rough idle"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)", "Fuel system contamination or component failure"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0178', 'Fuel Composition Sensor Circuit Low Input', 4, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting", "Engine rattle/timing noise", "Rough idle"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)", "Fuel system contamination or component failure"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0179', 'Fuel Composition Sensor Circuit High Input', 4, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting", "Engine rattle/timing noise", "Rough idle"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)", "Fuel system contamination or component failure"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P017A,', 'P017B, P017C, P017D, P017E, P017F ISO/SAE Reserved', 3, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0180', 'Fuel Temperature Sensor A Circuit Malfunction', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)", "Fuel system contamination or component failure"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0181', 'Fuel Temperature Sensor A Circuit Range/Performance', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)", "Fuel system contamination or component failure"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0182', 'Fuel Temperature Sensor A Circuit Low Input', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)", "Fuel system contamination or component failure"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0183', 'Fuel Temperature Sensor A Circuit High Input', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)", "Fuel system contamination or component failure"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0184', 'Fuel Temperature Sensor A Circuit Intermittent', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)", "Fuel system contamination or component failure"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0185', 'Fuel Temperature Sensor B Circuit Malfunction', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)", "Fuel system contamination or component failure"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0186', 'Fuel Temperature Sensor B Circuit Range/Performance', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)", "Fuel system contamination or component failure"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0187', 'Fuel Temperature Sensor B Circuit Low Input', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)", "Fuel system contamination or component failure"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0188', 'Fuel Temperature Sensor B Circuit High Input', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)", "Fuel system contamination or component failure"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0189', 'Fuel Temperature Sensor B Circuit Intermittent', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)", "Fuel system contamination or component failure"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P018A', 'Fuel Pressure SensorBCircuit ', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)", "Fuel system contamination or component failure"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P018B', 'Fuel Pressure SensorBCircuit Range/Performance', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)", "Fuel system contamination or component failure"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P018C', 'Fuel Pressure SensorBCircuit Low', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)", "Fuel system contamination or component failure"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P018D', 'Fuel Pressure SensorBCircuit High', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)", "Fuel system contamination or component failure"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P018E', 'Fuel Pressure SensorBCircuit Intermittent/Erratic ', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)", "Fuel system contamination or component failure"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P018F', 'Fuel System Over Pressure Relief Valve Frequent Activation', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Failed or stuck valve/solenoid/actuator", "Fuel system contamination or component failure"]', '["Replace faulty valve/solenoid/actuator", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0190', 'Fuel Rail Pressure Sensor A Circuit', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)", "Fuel system contamination or component failure"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0191', 'Fuel Rail Pressure Sensor A Circuit Range/Performance', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)", "Fuel system contamination or component failure"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0192', 'Fuel Rail Pressure Sensor A Circuit Low Input', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)", "Fuel system contamination or component failure"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0193', 'Fuel Rail Pressure Sensor A Circuit High Input', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)", "Fuel system contamination or component failure"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0194', 'Fuel Rail Pressure Sensor A Circuit Intermittent', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)", "Fuel system contamination or component failure"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0195', 'Engine Oil Temperature Sensor Malfunction', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output"]', '["Faulty sensor (internal failure)"]', '["Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0196', 'Engine Oil Temperature Sensor Range/Performance', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0197', 'Engine Oil Temperature Sensor Low', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0198', 'Engine Oil Temperature Sensor High', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0199', 'Engine Oil Temperature Sensor Intermittent', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output"]', '["Faulty sensor (internal failure)"]', '["Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P019A', 'P01FF ISO/SAE Reserved', 3, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0200', 'Injector Circuit Malfunction', 3, '["Check Engine Light flashing", "Engine misfire", "Rough idle", "Loss of power", "Poor fuel economy"]', '["Faulty fuel injector", "Clogged injector", "Wiring harness damage", "Faulty PCM driver circuit"]', '["Replace faulty fuel injector", "Clean fuel injectors (professional service)", "Repair wiring harness", "Replace PCM if driver circuit failed"]', 150, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0201', 'Injector Circuit Malfunction - Cylinder 1', 3, '["Check Engine Light flashing", "Engine misfire", "Rough idle", "Loss of power", "Poor fuel economy"]', '["Faulty fuel injector", "Clogged injector", "Wiring harness damage", "Faulty PCM driver circuit"]', '["Replace faulty fuel injector", "Clean fuel injectors (professional service)", "Repair wiring harness", "Replace PCM if driver circuit failed"]', 150, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0202', 'Injector Circuit Malfunction - Cylinder 2', 3, '["Check Engine Light flashing", "Engine misfire", "Rough idle", "Loss of power", "Poor fuel economy"]', '["Faulty fuel injector", "Clogged injector", "Wiring harness damage", "Faulty PCM driver circuit"]', '["Replace faulty fuel injector", "Clean fuel injectors (professional service)", "Repair wiring harness", "Replace PCM if driver circuit failed"]', 150, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0203', 'Injector Circuit Malfunction - Cylinder 3', 3, '["Check Engine Light flashing", "Engine misfire", "Rough idle", "Loss of power", "Poor fuel economy"]', '["Faulty fuel injector", "Clogged injector", "Wiring harness damage", "Faulty PCM driver circuit"]', '["Replace faulty fuel injector", "Clean fuel injectors (professional service)", "Repair wiring harness", "Replace PCM if driver circuit failed"]', 150, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0204', 'Injector Circuit Malfunction - Cylinder 4', 3, '["Check Engine Light flashing", "Engine misfire", "Rough idle", "Loss of power", "Poor fuel economy"]', '["Faulty fuel injector", "Clogged injector", "Wiring harness damage", "Faulty PCM driver circuit"]', '["Replace faulty fuel injector", "Clean fuel injectors (professional service)", "Repair wiring harness", "Replace PCM if driver circuit failed"]', 150, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0205', 'Injector Circuit Malfunction - Cylinder 5', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0206', 'Injector Circuit Malfunction - Cylinder 6', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0207', 'Injector Circuit Malfunction - Cylinder 7', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0208', 'Injector Circuit Malfunction - Cylinder 8', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0209', 'Injector Circuit Malfunction - Cylinder 9', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P020A', 'Cylinder 1 Injection Timing', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P020B', 'Cylinder 2 Injection Timing', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P020C', 'Cylinder 3 Injection Timing', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P020D', 'Cylinder 4 Injection Timing', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P020E', 'Cylinder 5 Injection Timing', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P020F', 'Cylinder 6 Injection Timing', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0210', 'Injector Circuit Malfunction - Cylinder 10', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0211', 'Injector Circuit Malfunction - Cylinder 11', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0212', 'Injector Circuit Malfunction - Cylinder 12', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0213', 'Cold Start Injector 1 Malfunction', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0214', 'Cold Start Injector 2 Malfunction', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0215', 'Engine Shutoff Solenoid Malfunction', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Failed or stuck valve/solenoid/actuator"]', '["Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0216', 'Injection Timing Control Circuit Malfunction', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0217', 'Engine Overtemp Condition', 3, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0218', 'Transmission Over Temperature Condition', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode", "Temperature gauge fluctuation", "Poor heater output"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0219', 'Engine Overspeed Condition', 3, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P021A', 'Cylinder 7 Injection Timing', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P021B', 'Cylinder 8 Injection Timing', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P021C', 'Cylinder 9 Injection Timing', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P021D', 'Cylinder 10 Injection Timing', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P021E', 'Cylinder 11 Injection Timing', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P021F', 'Cylinder 12 Injection Timing', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0220', 'Throttle/Pedal Position Sensor/Switch B Circuit Malfunction', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0221', 'Throttle/Pedal Position Sensor/Switch B Circuit Range/Performance', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0222', 'Throttle/Pedal Position Sensor/Switch B Circuit Low Input', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0223', 'Throttle/Pedal Position Sensor/Switch B Circuit High Input', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0224', 'Throttle/Pedal Position Sensor/Switch B Circuit Intermittent', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0225', 'Throttle/Pedal Position Sensor/Switch C Circuit Malfunction', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0226', 'Throttle/Pedal Position Sensor/Switch C Circuit Range/Performance', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0227', 'Throttle/Pedal Position Sensor/Switch C Circuit Low Input', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0228', 'Throttle/Pedal Position Sensor/Switch C Circuit High Input', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0229', 'Throttle/Pedal Position Sensor/Switch C Circuit Intermittent', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P022A', 'Charge Air Cooler Bypass ControlACircuit Open', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P022B', 'Charge Air Cooler Bypass ControlACircuit Low', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P022C', 'Charge Air Cooler Bypass ControlACircuit High', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P022D', 'Charge Air Cooler Bypass ControlBCircuit Open', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P022E', 'Charge Air Cooler Bypass ControlBCircuit Low', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P022F', 'Charge Air Cooler Bypass ControlBCircuit High', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0230', 'Fuel Pump Primary Circuit Malfunction', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit", "Fuel system contamination or component failure"]', '["Inspect and repair wiring harness and connectors", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0231', 'Fuel Pump Secondary Circuit Low', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit", "Fuel system contamination or component failure"]', '["Inspect and repair wiring harness and connectors", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0232', 'Fuel Pump Secondary Circuit High', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit", "Fuel system contamination or component failure"]', '["Inspect and repair wiring harness and connectors", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0233', 'Fuel Pump Secondary Circuit Intermittent', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit", "Fuel system contamination or component failure"]', '["Inspect and repair wiring harness and connectors", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0234', 'Engine Turbocharger/Supercharger Overboost Condition', 4, '["Check Engine Light illuminated", "Loss of boost pressure", "Reduced power", "Turbo whine/whistle"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0235', 'Turbocharger Boost Sensor A Circuit Malfunction', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Loss of boost pressure", "Reduced power", "Turbo whine/whistle"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0236', 'Turbocharger Boost Sensor A Circuit Range/Performance', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Loss of boost pressure", "Reduced power", "Turbo whine/whistle"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0237', 'Turbocharger Boost Sensor A Circuit Low', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Loss of boost pressure", "Reduced power", "Turbo whine/whistle"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0238', 'Turbocharger Boost Sensor A Circuit High', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Loss of boost pressure", "Reduced power", "Turbo whine/whistle"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0239', 'Turbocharger Boost Sensor B Circuit Malfunction', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Loss of boost pressure", "Reduced power", "Turbo whine/whistle"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P023A', 'Charge Air Cooler Coolant Pump Control Circuit Open', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting", "Temperature gauge fluctuation", "Poor heater output"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P023B', 'Charge Air Cooler Coolant Pump Control Circuit Low', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting", "Temperature gauge fluctuation", "Poor heater output"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P023C', 'Charge Air Cooler Coolant Pump Control Circuit High', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting", "Temperature gauge fluctuation", "Poor heater output"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P023D', 'Manifold Absolute Pressure - Turbocharger/Supercharger Boost SensorACorrelation', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Loss of boost pressure", "Reduced power", "Turbo whine/whistle"]', '["Faulty sensor (internal failure)"]', '["Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P023E', 'Manifold Absolute Pressure - Turbocharger/Supercharger Boost SensorBCorrelation', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Loss of boost pressure", "Reduced power", "Turbo whine/whistle"]', '["Faulty sensor (internal failure)"]', '["Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P023F', 'Fuel Pump Secondary Circuit/Open ', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit", "Fuel system contamination or component failure"]', '["Inspect and repair wiring harness and connectors", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0240', 'Turbocharger Boost Sensor B Circuit Range/Performance', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Loss of boost pressure", "Reduced power", "Turbo whine/whistle"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0241', 'Turbocharger Boost Sensor B Circuit Low', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Loss of boost pressure", "Reduced power", "Turbo whine/whistle"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0242', 'Turbocharger Boost Sensor B Circuit High', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Loss of boost pressure", "Reduced power", "Turbo whine/whistle"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0243', 'Turbocharger Wastegate Solenoid A Malfunction', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode", "Loss of boost pressure", "Reduced power"]', '["Failed or stuck valve/solenoid/actuator"]', '["Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0244', 'Turbocharger Wastegate Solenoid A Range/Performance', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode", "Loss of boost pressure", "Reduced power"]', '["Damaged, corroded, or shorted wiring in related circuit", "Failed or stuck valve/solenoid/actuator"]', '["Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0245', 'Turbocharger Wastegate Solenoid A Low', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode", "Loss of boost pressure", "Reduced power"]', '["Damaged, corroded, or shorted wiring in related circuit", "Failed or stuck valve/solenoid/actuator"]', '["Inspect and repair wiring harness and connectors", "Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0246', 'Turbocharger Wastegate Solenoid A High', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode", "Loss of boost pressure", "Reduced power"]', '["Damaged, corroded, or shorted wiring in related circuit", "Failed or stuck valve/solenoid/actuator"]', '["Inspect and repair wiring harness and connectors", "Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0247', 'Turbocharger Wastegate Solenoid B Malfunction', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode", "Loss of boost pressure", "Reduced power"]', '["Failed or stuck valve/solenoid/actuator"]', '["Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0248', 'Turbocharger Wastegate Solenoid B Range/Performance', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode", "Loss of boost pressure", "Reduced power"]', '["Damaged, corroded, or shorted wiring in related circuit", "Failed or stuck valve/solenoid/actuator"]', '["Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0249', 'Turbocharger Wastegate Solenoid B Low', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode", "Loss of boost pressure", "Reduced power"]', '["Damaged, corroded, or shorted wiring in related circuit", "Failed or stuck valve/solenoid/actuator"]', '["Inspect and repair wiring harness and connectors", "Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P024A', 'Charge Air Cooler Bypass ControlARange/Performance', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P024B', 'Charge Air Cooler Bypass ControlAStuck', 3, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P024C', 'Charge Air Cooler Bypass Position SensorACircuit', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P024D', 'Charge Air Cooler Bypass Position SensorACircuit Range/Performance', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P024E', 'Charge Air Cooler Bypass Position SensorACircuit Low', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P024F', 'Charge Air Cooler Bypass Position SensorACircuit High', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0250', 'Turbocharger Wastegate Solenoid B High', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode", "Loss of boost pressure", "Reduced power"]', '["Damaged, corroded, or shorted wiring in related circuit", "Failed or stuck valve/solenoid/actuator"]', '["Inspect and repair wiring harness and connectors", "Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0251', 'Injection Pump Fuel Metering Control A Malfunction (Cam/Rotor/Injector)', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Fuel system contamination or component failure"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0252', 'Injection Pump Fuel Metering Control A Range/Performance (Cam/Rotor/Injector)', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit", "Fuel system contamination or component failure"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0253', 'Injection Pump Fuel Metering Control A Low (Cam/Rotor/Injector)', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit", "Fuel system contamination or component failure"]', '["Inspect and repair wiring harness and connectors", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0254', 'Injection Pump Fuel Metering Control A High (Cam/Rotor/Injector)', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit", "Fuel system contamination or component failure"]', '["Inspect and repair wiring harness and connectors", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0255', 'Injection Pump Fuel Metering Control A Intermittent (Cam/Rotor/Injector)', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Fuel system contamination or component failure"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0256', 'Injection Pump Fuel Metering Control B Malfunction (Cam/Rotor/Injector)', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Fuel system contamination or component failure"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0257', 'Injection Pump Fuel Metering Control B Range/Performance Injector)', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit", "Fuel system contamination or component failure"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0258', 'Injection Pump Fuel Metering Control B Low (Cam/Rotor/Injector)', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit", "Fuel system contamination or component failure"]', '["Inspect and repair wiring harness and connectors", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0259', 'Injection Pump Fuel Metering Control B High (Cam/Rotor/Injector)', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit", "Fuel system contamination or component failure"]', '["Inspect and repair wiring harness and connectors", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P025A', 'Fuel Pump Module Control Circuit/Open', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit", "Fuel system contamination or component failure", "Faulty control module (PCM/ECM/TCM)"]', '["Inspect and repair wiring harness and connectors", "Service or replace affected fuel system component", "Reprogram or replace control module", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P025B', 'Fuel Pump Module Control Circuit Range/Performance', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit", "Fuel system contamination or component failure", "Faulty control module (PCM/ECM/TCM)"]', '["Inspect and repair wiring harness and connectors", "Service or replace affected fuel system component", "Reprogram or replace control module", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P025C', 'Fuel Pump Module Control Circuit Low', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit", "Fuel system contamination or component failure", "Faulty control module (PCM/ECM/TCM)"]', '["Inspect and repair wiring harness and connectors", "Service or replace affected fuel system component", "Reprogram or replace control module", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P025D', 'Fuel Pump Module Control Circuit High', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit", "Fuel system contamination or component failure", "Faulty control module (PCM/ECM/TCM)"]', '["Inspect and repair wiring harness and connectors", "Service or replace affected fuel system component", "Reprogram or replace control module", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P025E', '& P025F ISO/SAE Reserved', 3, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0260', 'Injection Pump Fuel Metering ControlBIntermittent (Cam/Rotor/Injector)', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Fuel system contamination or component failure"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0261', 'Cylinder 1 Injector Circuit Low', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0262', 'Cylinder 1 Injector Circuit High', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0263', 'Cylinder 1 Contribution/Balance Fault', 3, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0264', 'Cylinder 2 Injector Circuit Low', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0265', 'Cylinder 2 Injector Circuit High', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0266', 'Cylinder 2 Contribution/Balance Fault', 3, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0267', 'Cylinder 3 Injector Circuit Low', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0268', 'Cylinder 3 Injector Circuit High', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0269', 'Cylinder 3 Contribution/Balance Fault', 3, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P026A,', 'P026B, P026C, P026D, P026E, P026F ISO/SAE Reserved', 3, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0270', 'Cylinder 4 Injector Circuit Low', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0271', 'Cylinder 4 Injector Circuit High', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0272', 'Cylinder 4 Contribution/Balance Fault', 3, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0273', 'Cylinder 5 Injector Circuit Low', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0274', 'Cylinder 5 Injector Circuit High', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0275', 'Cylinder 5 Contribution/Balance Fault', 3, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0276', 'Cylinder 6 Injector Circuit Low', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0277', 'Cylinder 6 Injector Circuit High', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0278', 'Cylinder 6 Contribution/Balance Fault', 3, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0279', 'Cylinder 7 Injector Circuit Low', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P027A,', 'P027B, P027C, P027D, P027E, P027F ISO/SAE Reserved', 3, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0280', 'Cylinder 7 Injector Circuit High', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0281', 'Cylinder 7 Contribution/Balance Fault', 3, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0282', 'Cylinder 8 Injector Circuit Low', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0283', 'Cylinder 8 Injector Circuit High', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0284', 'Cylinder 8 Contribution/Balance Fault', 3, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0285', 'Cylinder 9 Injector Circuit Low', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0286', 'Cylinder 9 Injector Circuit High', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0287', 'Cylinder 9 Contribution/Balance Fault', 3, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0288', 'Cylinder 10 Injector Circuit Low', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0289', 'Cylinder 10 Injector Circuit High', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P028A,', 'P028B, P028C, P028D, P028E, P028F ISO/SAE Reserved', 3, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0290', 'Cylinder 10 Contribution/Balance Fault', 3, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0291', 'Cylinder 11 Injector Circuit Low', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0292', 'Cylinder 11 Injector Circuit High', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0293', 'Cylinder 11 Contribution/Balance Fault', 3, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0294', 'Cylinder 12 Injector Circuit Low', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0295', 'Cylinder 12 Injector Circuit High', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0296', 'Cylinder 12 Contribution/Range Fault', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0297', 'Vehicle Overspeed Condition', 3, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0298', 'Engine Oil Over Temperature Condition', 3, '["Check Engine Light illuminated", "Temperature gauge fluctuation", "Poor heater output"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0299', 'Turbocharger/SuperchargerAUnderboost Condition', 4, '["Check Engine Light illuminated", "Loss of boost pressure", "Reduced power", "Turbo whine/whistle"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P029A', 'Cylinder 1 - Fuel Trim at Max Limit', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Fuel system contamination or component failure"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P029B', 'Cylinder 1 - Fuel Trim at Min Limit', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Fuel system contamination or component failure"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P029C', 'Cylinder 1 - Injector Restricted', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P029D', 'Cylinder 1 - Injector Leaking', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting", "Fuel odor detected", "Difficulty refueling"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P029E', 'Cylinder 2 - Fuel Trim at Max Limit', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Fuel system contamination or component failure"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P029F', 'Cylinder 2 - Fuel Trim at Min Limit', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Fuel system contamination or component failure"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02A0', 'Cylinder 2 - Injector Restricted', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02A1', 'Cylinder 2 - Injector Leaking', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting", "Fuel odor detected", "Difficulty refueling"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02A2', 'Cylinder 3 - Fuel Trim at Max Limit', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Fuel system contamination or component failure"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02A3', 'Cylinder 3 - Fuel Trim at Min Limit', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Fuel system contamination or component failure"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02A4', 'Cylinder 3 - Injector Restricted', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02A5', 'Cylinder 3 - Injector Leaking', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting", "Fuel odor detected", "Difficulty refueling"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02A6', 'Cylinder 4 - Fuel Trim at Max Limit', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Fuel system contamination or component failure"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02A7', 'Cylinder 4 - Fuel Trim at Min Limit', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Fuel system contamination or component failure"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02A8', 'Cylinder 4 - Injector Restricted', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02A9', 'Cylinder 4 - Injector Leaking', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting", "Fuel odor detected", "Difficulty refueling"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02AA', 'Cylinder 5 - Fuel Trim at Max Limit', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Fuel system contamination or component failure"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02AB', 'Cylinder 5 - Fuel Trim at Min Limit', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Fuel system contamination or component failure"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02AC', 'Cylinder 5 - Injector Restricted', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02AD', 'Cylinder 5 - Injector Leaking', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting", "Fuel odor detected", "Difficulty refueling"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02AE', 'Cylinder 6 - Fuel Trim at Max Limit', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Fuel system contamination or component failure"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02AF', 'Cylinder 6 - Fuel Trim at Min Limit', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Fuel system contamination or component failure"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02B0', 'Cylinder 6 - Injector Restricted', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02B1', 'Cylinder 6 - Injector Leaking', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting", "Fuel odor detected", "Difficulty refueling"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02B2', 'Cylinder 7 - Fuel Trim at Max Limit', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Fuel system contamination or component failure"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02B3', 'Cylinder 7 - Fuel Trim at Min Limit', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Fuel system contamination or component failure"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02B4', 'Cylinder 7 - Injector Restricted', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02B5', 'Cylinder 7 - Injector Leaking', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting", "Fuel odor detected", "Difficulty refueling"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02B6', 'Cylinder 8 - Fuel Trim at Max Limit', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Fuel system contamination or component failure"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02B7', 'Cylinder 8 - Fuel Trim at Min Limit', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Fuel system contamination or component failure"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02B8', 'Cylinder 8 - Injector Restricted', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02B9', 'Cylinder 8 - Injector Leaking', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting", "Fuel odor detected", "Difficulty refueling"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02BA', 'Cylinder 9 - Fuel Trim at Max Limit', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Fuel system contamination or component failure"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02BB', 'Cylinder 9 - Fuel Trim at Min Limit', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Fuel system contamination or component failure"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02BC', 'Cylinder 9 - Injector Restricted', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02BD', 'Cylinder 9 - Injector Leaking', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting", "Fuel odor detected", "Difficulty refueling"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02BE', 'Cylinder 10 - Fuel Trim at Max Limit', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Fuel system contamination or component failure"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02BF', 'Cylinder 10 - Fuel Trim at Min Limit', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Fuel system contamination or component failure"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02C0', 'Cylinder 10 - Injector Restricted', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02C1', 'Cylinder 10 - Injector Leaking', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting", "Fuel odor detected", "Difficulty refueling"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02C2', 'Cylinder 11 - Fuel Trim at Max Limit', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Fuel system contamination or component failure"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02C3', 'Cylinder 11 - Fuel Trim at Min Limit', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Fuel system contamination or component failure"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02C4', 'Cylinder 11 - Injector Restricted', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02C5', 'Cylinder 11 - Injector Leaking', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting", "Fuel odor detected", "Difficulty refueling"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02C6', 'Cylinder 12 - Fuel Trim at Max Limit', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Fuel system contamination or component failure"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02C7', 'Cylinder 12 - Fuel Trim at Min Limit', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Fuel system contamination or component failure"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02C8', 'Cylinder 12 - Injector Restricted', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02C9', 'Cylinder 12 - Injector Leaking', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting", "Fuel odor detected", "Difficulty refueling"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02CA', 'Turbocharger/SuperchargerBOverboost Condition', 4, '["Check Engine Light illuminated", "Loss of boost pressure", "Reduced power", "Turbo whine/whistle"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02CB', 'Turbocharger/SuperchargerBUnderboost Condition', 4, '["Check Engine Light illuminated", "Loss of boost pressure", "Reduced power", "Turbo whine/whistle"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02CC', 'Cylinder 1 Fuel Injector Offset Learning At Min Limit', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Fuel system contamination or component failure"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02CD', 'Cylinder 1 Fuel Injector Offset Learning At Max Limit', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Fuel system contamination or component failure"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02CE', 'Cylinder 2 Fuel Injector Offset Learning At Min Limit', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Fuel system contamination or component failure"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02CF', 'Cylinder 2 Fuel Injector Offset Learning At Max Limit', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Fuel system contamination or component failure"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02D0', 'Cylinder 3 Fuel Injector Offset Learning At Min Limit', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Fuel system contamination or component failure"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02D1', 'Cylinder 3 Fuel Injector Offset Learning At Max Limit', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Fuel system contamination or component failure"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02D2', 'Cylinder 4 Fuel Injector Offset Learning At Min Limit', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Fuel system contamination or component failure"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02D3', 'Cylinder 4 Fuel Injector Offset Learning At Max Limit', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Fuel system contamination or component failure"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02D4', 'Cylinder 5 Fuel Injector Offset Learning At Min Limit', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Fuel system contamination or component failure"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02D5', 'Cylinder 5 Fuel Injector Offset Learning At Max Limit', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Fuel system contamination or component failure"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02D6', 'Cylinder 6 Fuel Injector Offset Learning At Min Limit', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Fuel system contamination or component failure"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02D7', 'Cylinder 6 Fuel Injector Offset Learning At Max Limit', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Fuel system contamination or component failure"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02D8', 'Cylinder 7 Fuel Injector Offset Learning At Min Limit', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Fuel system contamination or component failure"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02D9', 'Cylinder 7 Fuel Injector Offset Learning At Max Limit', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Fuel system contamination or component failure"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02DA', 'Cylinder 8 Fuel Injector Offset Learning At Min Limit', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Fuel system contamination or component failure"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02DB', 'Cylinder 8 Fuel Injector Offset Learning At Max Limit', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Fuel system contamination or component failure"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02DC', 'Cylinder 9 Fuel Injector Offset Learning At Min Limit', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Fuel system contamination or component failure"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02DD', 'Cylinder 9 Fuel Injector Offset Learning At Max Limit', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Fuel system contamination or component failure"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02DE', 'Cylinder 10 Fuel Injector Offset Learning At Min Limit', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Fuel system contamination or component failure"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02DF', 'Cylinder 10 Fuel Injector Offset Learning At Max Limit', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Fuel system contamination or component failure"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02E0', 'Diesel Intake Air Flow Control Circuit/Open', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02E1', 'Diesel Intake Air Flow Control Performance', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02E2', 'Diesel Intake Air Flow Control Circuit Low', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02E3', 'Diesel Intake Air Flow Control Circuit High', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02E4', 'Diesel Intake Air Flow Control Stuck Open', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02E5', 'Diesel Intake Air Flow Control Stuck Closed', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02E6', 'Diesel Intake Air Flow Position Sensor Circuit', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02E7', 'Diesel Intake Air Flow Position Sensor Circuit Range/Performance', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02E8', 'Diesel Intake Air Flow Position Sensor Circuit Low', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02E9', 'Diesel Intake Air Flow Position Sensor Circuit High', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02EA', 'Diesel Intake Air Flow Position Sensor Circuit Intermittent/Erratic', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02EB', 'Diesel Intake Air Flow Control Motor Current Range/Performance', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02EC', 'Diesel Intake Air Flow Control System - High Air Flow Detected', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02ED', 'Diesel Intake Air Flow Control System - Low Air Flow Detected', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02EE', 'Cylinder 1 Injector Circuit Range/Performance', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02EF', 'Cylinder 2 Injector Circuit Range/Performance', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02F0', 'Cylinder 3 Injector Circuit Range/Performance', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02F1', 'Cylinder 4 Injector Circuit Range/Performance', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02F2', 'Cylinder 5 Injector Circuit Range/Performance', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02F3', 'Cylinder 6 Injector Circuit Range/Performance', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02F4', 'Cylinder 7 Injector Circuit Range/Performance', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02F5', 'Cylinder 8 Injector Circuit Range/Performance', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02F6', 'Cylinder 9 Injector Circuit Range/Performance', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02F7', 'Cylinder 10 Injector Circuit Range/Performance', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02F8', 'Cylinder 11 Injector Circuit Range/Performance', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02F9', 'Cylinder 12 Injector Circuit Range/Performance', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02FA', 'Diesel Intake Air Flow Position Sensor Minimum/Maximum Stop Performance', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P02FB,', 'P02FC, P02FD, P02FE, P02FF ISO/SAE Reserved', 3, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0300', 'Random/Multiple Cylinder Misfire Detected', 4, '["Flashing Check Engine Light", "Engine shaking/vibration", "Rough idle", "Loss of power", "Poor acceleration", "Increased fuel consumption"]', '["Worn spark plugs", "Faulty ignition coils", "Vacuum leak", "Low fuel pressure", "Clogged injectors", "Low compression", "EGR system fault"]', '["Replace spark plugs", "Replace ignition coil(s)", "Find and repair vacuum leaks", "Clean/replace fuel injectors", "Compression test", "Clean EGR valve"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0301', 'Cylinder 1 Misfire Detected', 4, '["Flashing Check Engine Light", "Engine shaking", "Rough idle", "Loss of power", "Fuel smell from exhaust"]', '["Worn spark plug", "Faulty ignition coil", "Fuel injector issue", "Low cylinder compression", "Vacuum leak affecting specific cylinder", "Burnt exhaust valve"]', '["Replace spark plug for affected cylinder", "Replace ignition coil", "Clean/replace fuel injector", "Compression test and repair if needed", "Replace plug wires if applicable"]', 100, 2000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0302', 'Cylinder 2 Misfire Detected', 4, '["Flashing Check Engine Light", "Engine shaking", "Rough idle", "Loss of power", "Fuel smell from exhaust"]', '["Worn spark plug", "Faulty ignition coil", "Fuel injector issue", "Low cylinder compression", "Vacuum leak affecting specific cylinder", "Burnt exhaust valve"]', '["Replace spark plug for affected cylinder", "Replace ignition coil", "Clean/replace fuel injector", "Compression test and repair if needed", "Replace plug wires if applicable"]', 100, 2000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0303', 'Cylinder 3 Misfire Detected', 4, '["Flashing Check Engine Light", "Engine shaking", "Rough idle", "Loss of power", "Fuel smell from exhaust"]', '["Worn spark plug", "Faulty ignition coil", "Fuel injector issue", "Low cylinder compression", "Vacuum leak affecting specific cylinder", "Burnt exhaust valve"]', '["Replace spark plug for affected cylinder", "Replace ignition coil", "Clean/replace fuel injector", "Compression test and repair if needed", "Replace plug wires if applicable"]', 100, 2000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0304', 'Cylinder 4 Misfire Detected', 4, '["Flashing Check Engine Light", "Engine shaking", "Rough idle", "Loss of power", "Fuel smell from exhaust"]', '["Worn spark plug", "Faulty ignition coil", "Fuel injector issue", "Low cylinder compression", "Vacuum leak affecting specific cylinder", "Burnt exhaust valve"]', '["Replace spark plug for affected cylinder", "Replace ignition coil", "Clean/replace fuel injector", "Compression test and repair if needed", "Replace plug wires if applicable"]', 100, 2000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0305', 'Cylinder 5 Misfire Detected', 4, '["Flashing Check Engine Light", "Engine shaking", "Rough idle", "Loss of power", "Fuel smell from exhaust"]', '["Worn spark plug", "Faulty ignition coil", "Fuel injector issue", "Low cylinder compression", "Vacuum leak affecting specific cylinder", "Burnt exhaust valve"]', '["Replace spark plug for affected cylinder", "Replace ignition coil", "Clean/replace fuel injector", "Compression test and repair if needed", "Replace plug wires if applicable"]', 100, 2000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0306', 'Cylinder 6 Misfire Detected', 4, '["Flashing Check Engine Light", "Engine shaking", "Rough idle", "Loss of power", "Fuel smell from exhaust"]', '["Worn spark plug", "Faulty ignition coil", "Fuel injector issue", "Low cylinder compression", "Vacuum leak affecting specific cylinder", "Burnt exhaust valve"]', '["Replace spark plug for affected cylinder", "Replace ignition coil", "Clean/replace fuel injector", "Compression test and repair if needed", "Replace plug wires if applicable"]', 100, 2000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0307', 'Cylinder 7 Misfire Detected', 4, '["Check Engine Light illuminated", "Engine misfire/rough running", "Flashing Check Engine Light", "Loss of power"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0308', 'Cylinder 8 Misfire Detected', 4, '["Check Engine Light illuminated", "Engine misfire/rough running", "Flashing Check Engine Light", "Loss of power"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0309', 'Cylinder 9 Misfire Detected', 4, '["Check Engine Light illuminated", "Engine misfire/rough running", "Flashing Check Engine Light", "Loss of power"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0310', 'Cylinder 10 Misfire Detected', 4, '["Check Engine Light illuminated", "Engine misfire/rough running", "Flashing Check Engine Light", "Loss of power"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0311', 'Cylinder 11 Misfire Detected', 4, '["Check Engine Light illuminated", "Engine misfire/rough running", "Flashing Check Engine Light", "Loss of power"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0312', 'Cylinder 12 Misfire Detected', 4, '["Check Engine Light illuminated", "Engine misfire/rough running", "Flashing Check Engine Light", "Loss of power"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0313', 'Misfire Detected with Low Fuel', 4, '["Check Engine Light illuminated", "Engine misfire/rough running", "Flashing Check Engine Light", "Loss of power", "Poor fuel economy", "Engine hesitation"]', '["Damaged, corroded, or shorted wiring in related circuit", "Fuel system contamination or component failure"]', '["Inspect and repair wiring harness and connectors", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0314', 'Single Cylinder Misfire (Cylinder not Specified)', 4, '["Check Engine Light illuminated", "Engine misfire/rough running", "Flashing Check Engine Light", "Loss of power"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0315', 'Crankshaft Position System Variation Not Learned', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0316', 'Misfire Detected On Startup (First 1000 Revolutions)', 4, '["Check Engine Light illuminated", "Engine misfire/rough running", "Flashing Check Engine Light", "Loss of power"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0317', 'Rough Road Hardware Not Present', 4, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0318', 'Rough Road Sensor A Signal Circuit', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0319', 'Rough Road Sensor B Signal Circuit ', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P031A', 'P031C, P031D, P031E, P031F ISO/SAE Reserved', 4, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0320', 'Ignition/Distributor Engine Speed Input Circuit Malfunction', 4, '["Check Engine Light illuminated", "Engine misfire/rough running", "Flashing Check Engine Light", "Loss of power"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0321', 'Ignition/Distributor Engine Speed Input Circuit Range/Performance', 4, '["Check Engine Light illuminated", "Engine misfire/rough running", "Flashing Check Engine Light", "Loss of power"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0322', 'Ignition/Distributor Engine Speed Input Circuit No Signal', 4, '["Check Engine Light illuminated", "Engine misfire/rough running", "Flashing Check Engine Light", "Loss of power"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0323', 'Ignition/Distributor Engine Speed Input Circuit Intermittent', 4, '["Check Engine Light illuminated", "Engine misfire/rough running", "Flashing Check Engine Light", "Loss of power"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0324', 'Knock Control System Error', 4, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0325', 'Knock Sensor 1 Circuit Malfunction (Bank 1 or Single Sensor)', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0326', 'Knock Sensor 1 Circuit Range/Performance (Bank 1 or Single Sensor)', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0327', 'Knock Sensor 1 Circuit Low Input (Bank 1 or Single Sensor)', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0328', 'Knock Sensor 1 Circuit High Input (Bank 1 or Single Sensor)', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0329', 'Knock Sensor 1 Circuit Intermittent (Bank 1 or Single Sensor)', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P032A', 'Sensor 3 Circuit Bank 1 ', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P032B', 'Sensor 3 Circuit Range/Performance Bank 1 ', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P032C', 'Sensor 3 Circuit Low Bank 1', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P032E', 'Sensor 3 Circuit Intermittent Bank 1', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0330', 'Knock Sensor 2 Circuit Malfunction (Bank 2)', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0331', 'Knock Sensor 2 Circuit Range/Performance (Bank 2)', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0332', 'Knock Sensor 2 Circuit Low Input (Bank 2)', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0333', 'Knock Sensor 2 Circuit High Input (Bank 2)', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0334', 'Knock Sensor 2 Circuit Intermittent (Bank 2)', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0335', 'Crankshaft Position Sensor A Circuit Malfunction', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0336', 'Crankshaft Position Sensor A Circuit Range/Performance', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0337', 'Crankshaft Position Sensor A Circuit Low Input', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0338', 'Crankshaft Position Sensor A Circuit High Input', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0339', 'Crankshaft Position Sensor A Circuit Intermittent', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P033A', 'Sensor 4 Circuit (Bank 2) ', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P033B', 'Sensor 4 Circuit Range/Performance (Bank 2) ', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P033C', 'Sensor 4 Circuit Low (Bank 2) ', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P033D', 'Sensor 4 Circuit High (Bank 2) ', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P033E', 'Sensor 4 Circuit Intermittent (Bank 2) ', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P033F', 'Reserved', 4, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0340', 'Camshaft Position Sensor Circuit Malfunction (Bank 1)', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0341', 'Camshaft Position Sensor Circuit Range/Performance (Bank 1)', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0342', 'Camshaft Position Sensor A Circuit Low Input (Bank 1)', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0343', 'Camshaft Position Sensor A Circuit High Input (Bank 1)', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0344', 'Camshaft Position Sensor A Circuit Intermittent (Bank 1)', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0345', 'Camshaft Position Sensor A Circuit Malfunction (Bank 2)', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0346', 'Camshaft Position Sensor A Circuit Range/Performance (Bank 2)', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0347', 'Camshaft Position Sensor A Circuit Low Input (Bank 2)', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0348', 'Camshaft Position Sensor A Circuit High Input (Bank 2)', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0349', 'Camshaft Position Sensor A Circuit Intermittent (Bank 2)', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P034A', 'P034C, P034D, P034E, P034F ISO/SAE Reserved ', 4, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0350', 'Ignition Coil Primary/Secondary Circuit Malfunction', 4, '["Check Engine Light illuminated", "Engine misfire/rough running", "Flashing Check Engine Light", "Loss of power"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0351', 'Ignition Coil A Primary/Secondary Circuit Malfunction', 4, '["Check Engine Light illuminated", "Engine misfire/rough running", "Flashing Check Engine Light", "Loss of power"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0352', 'Ignition Coil B Primary/Secondary Circuit Malfunction', 4, '["Check Engine Light illuminated", "Engine misfire/rough running", "Flashing Check Engine Light", "Loss of power"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0353', 'Ignition Coil C Primary/Secondary Circuit Malfunction', 4, '["Check Engine Light illuminated", "Engine misfire/rough running", "Flashing Check Engine Light", "Loss of power"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0354', 'Ignition Coil D Primary/Secondary Circuit Malfunction', 4, '["Check Engine Light illuminated", "Engine misfire/rough running", "Flashing Check Engine Light", "Loss of power"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0355', 'Ignition Coil E Primary/Secondary Circuit Malfunction', 4, '["Check Engine Light illuminated", "Engine misfire/rough running", "Flashing Check Engine Light", "Loss of power"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0356', 'Ignition Coil F Primary/Secondary Circuit Malfunction', 4, '["Check Engine Light illuminated", "Engine misfire/rough running", "Flashing Check Engine Light", "Loss of power"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0357', 'Ignition Coil G Primary/Secondary Circuit Malfunction', 4, '["Check Engine Light illuminated", "Engine misfire/rough running", "Flashing Check Engine Light", "Loss of power"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0358', 'Ignition Coil H Primary/Secondary Circuit Malfunction', 4, '["Check Engine Light illuminated", "Engine misfire/rough running", "Flashing Check Engine Light", "Loss of power"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0359', 'Ignition Coil I Primary/Secondary Circuit Malfunction', 4, '["Check Engine Light illuminated", "Engine misfire/rough running", "Flashing Check Engine Light", "Loss of power"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P035A', 'P035C, P035D, P035D, P035E, P035F ISO/SAE Reserved', 4, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0360', 'Ignition Coil J Primary/Secondary Circuit Malfunction', 4, '["Check Engine Light illuminated", "Engine misfire/rough running", "Flashing Check Engine Light", "Loss of power"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0361', 'Ignition Coil K Primary/Secondary Circuit Malfunction', 4, '["Check Engine Light illuminated", "Engine misfire/rough running", "Flashing Check Engine Light", "Loss of power"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0362', 'Ignition Coil L Primary/Secondary Circuit Malfunction', 4, '["Check Engine Light illuminated", "Engine misfire/rough running", "Flashing Check Engine Light", "Loss of power"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0363', 'Misfire Detected - Fueling Disabled', 4, '["Check Engine Light illuminated", "Engine misfire/rough running", "Flashing Check Engine Light", "Loss of power", "Poor fuel economy", "Engine hesitation"]', '["Fuel system contamination or component failure"]', '["Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0364', 'Reserved', 4, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0365', 'Camshaft Position SensorBCircuit (Bank 1)', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0366', 'Camshaft Position SensorBCircuit Range/Performance (Bank 1)', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0367', 'Camshaft Position SensorBCircuit Low (Bank 1)', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0368', 'Camshaft Position SensorBCircuit High (Bank 1)', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0369', 'Camshaft Position SensorBCircuit Intermittent (Bank 1)', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P036A,', 'P036B, P036C, P036D, P036E, P036F ISO/SAE Reserved ', 4, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0370', 'Timing Reference High Resolution Signal A Malfunction', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0371', 'Timing Reference High Resolution Signal A Too Many Pulses', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0372', 'Timing Reference High Resolution Signal A Too Few Pulses', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0373', 'Timing Reference High Resolution Signal A Intermittent/Erratic Pulses', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0374', 'Timing Reference High Resolution Signal A No Pulses', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0375', 'Timing Reference High Resolution Signal B Malfunction', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0376', 'Timing Reference High Resolution Signal B Too Many Pulses', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0377', 'Timing Reference High Resolution Signal B Too Few Pulses', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0378', 'Timing Reference High Resolution Signal B Intermittent/Erratic Pulses', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0379', 'Timing Reference High Resolution Signal B No Pulses', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P037A', 'P037C ISO/SAE Reserved', 4, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P037E', 'Plug Sense Circuit Low ', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P037F', 'Plug Sense Circuit High', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0380', 'Glow Plug/Heater CircuitA ', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0381', 'Glow Plug/Heater Indicator Circuit Malfunction', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0382', 'Glow Plug/Heater CircuitB ', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0383', 'Glow Plug Control Module Control Circuit Low', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty control module (PCM/ECM/TCM)"]', '["Inspect and repair wiring harness and connectors", "Reprogram or replace control module", "Clear DTC and verify repair with test drive"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0384', 'Glow Plug Control Module Control Circuit High', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty control module (PCM/ECM/TCM)"]', '["Inspect and repair wiring harness and connectors", "Reprogram or replace control module", "Clear DTC and verify repair with test drive"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0385', 'Crankshaft Position Sensor B Circuit Malfunction', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0386', 'Crankshaft Position Sensor B Circuit Range/Performance', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0387', 'Crankshaft Position Sensor B Circuit Low Input', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0388', 'Crankshaft Position Sensor B Circuit High Input', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0389', 'Crankshaft Position Sensor B Circuit Intermittent', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P038A,', 'P038B, P038C, P038D, P038E, P038F ISO/SAE Reserved', 4, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0390', 'Camshaft Position SensorBCircuit (Bank 2)', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0391', 'Camshaft Position SensorBCircuit Range/Performance (Bank 2)', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0392', 'Camshaft Position SensorBCircuit Low (Bank 2)', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0393', 'Camshaft Position SensorBCircuit High (Bank 2)', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0394', 'Camshaft Position SensorBCircuit Intermittent (Bank 2)', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0395', 'P03FF ISO/SAE Reserved', 4, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 100, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0400', 'Exhaust Gas Recirculation Flow Malfunction', 2, '["Check Engine Light on", "Engine knock/ping under load", "Rough idle", "Failed emissions test", "Stalling"]', '["Clogged EGR valve", "Carbon buildup in EGR passages", "Faulty EGR valve", "Faulty DPFE sensor", "Vacuum line issues"]', '["Clean EGR valve and passages", "Replace EGR valve", "Replace DPFE sensor", "Repair vacuum lines", "Perform EGR system relearn"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0401', 'Exhaust Gas Recirculation Flow Insufficient Detected', 2, '["Check Engine Light on", "Engine knock/ping under load", "Rough idle", "Failed emissions test", "Stalling"]', '["Clogged EGR valve", "Carbon buildup in EGR passages", "Faulty EGR valve", "Faulty DPFE sensor", "Vacuum line issues"]', '["Clean EGR valve and passages", "Replace EGR valve", "Replace DPFE sensor", "Repair vacuum lines", "Perform EGR system relearn"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0402', 'Exhaust Gas Recirculation Flow Excessive Detected', 2, '["Check Engine Light on", "Engine knock/ping under load", "Rough idle", "Failed emissions test", "Stalling"]', '["Clogged EGR valve", "Carbon buildup in EGR passages", "Faulty EGR valve", "Faulty DPFE sensor", "Vacuum line issues"]', '["Clean EGR valve and passages", "Replace EGR valve", "Replace DPFE sensor", "Repair vacuum lines", "Perform EGR system relearn"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0403', 'Exhaust Gas Recirculation Circuit Malfunction', 2, '["Check Engine Light on", "Rough idle", "Engine stumble"]', '["Faulty EGR valve solenoid/actuator", "Wiring damage", "PCM fault"]', '["Replace EGR valve", "Repair wiring", "Check PCM outputs"]', 150, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0404', 'Exhaust Gas Recirculation Circuit Range/Performance', 2, '["Check Engine Light on", "Rough idle", "Engine stumble"]', '["Faulty EGR valve solenoid/actuator", "Wiring damage", "PCM fault"]', '["Replace EGR valve", "Repair wiring", "Check PCM outputs"]', 150, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0405', 'Exhaust Gas Recirculation Sensor A Circuit Low', 2, '["Check Engine Light on", "Rough idle", "Engine stumble"]', '["Faulty EGR valve solenoid/actuator", "Wiring damage", "PCM fault"]', '["Replace EGR valve", "Repair wiring", "Check PCM outputs"]', 150, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0406', 'Exhaust Gas Recirculation Sensor A Circuit High', 2, '["Check Engine Light on", "Rough idle", "Engine stumble"]', '["Faulty EGR valve solenoid/actuator", "Wiring damage", "PCM fault"]', '["Replace EGR valve", "Repair wiring", "Check PCM outputs"]', 150, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0407', 'Exhaust Gas Recirculation Sensor B Circuit Low', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Engine knock under load", "Rough idle", "Failed emissions test"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0408', 'Exhaust Gas Recirculation Sensor B Circuit High', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Engine knock under load", "Rough idle", "Failed emissions test"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0409', 'Exhaust Gas Recirculation SensorACircuit', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Engine knock under load", "Rough idle", "Failed emissions test"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P040A', 'Gas Recirculation Temperature SensorACircuit', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P040B', 'Gas Recirculation Temperature SensorACircuit Range/Performance', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P040D', 'Gas Recirculation Temperature SensorACircuit High', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P040F', 'Gas Recirculation Temperature SensorA / BCorrelation', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output"]', '["Faulty sensor (internal failure)"]', '["Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0410', 'Secondary Air Injection System Malfunction', 3, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0411', 'Secondary Air Injection System Incorrect Flow Detected', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0412', 'Secondary Air Injection System Switching Valve A Circuit Malfunction', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit", "Failed or stuck valve/solenoid/actuator"]', '["Inspect and repair wiring harness and connectors", "Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0413', 'Secondary Air Injection System Switching Valve A Circuit Open', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit", "Failed or stuck valve/solenoid/actuator"]', '["Inspect and repair wiring harness and connectors", "Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0414', 'Secondary Air Injection System Switching Valve A Circuit Shorted', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit", "Failed or stuck valve/solenoid/actuator"]', '["Inspect and repair wiring harness and connectors", "Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0415', 'Secondary Air Injection System Switching Valve B Circuit Malfunction', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit", "Failed or stuck valve/solenoid/actuator"]', '["Inspect and repair wiring harness and connectors", "Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0416', 'Secondary Air Injection System Switching Valve B Circuit Open', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit", "Failed or stuck valve/solenoid/actuator"]', '["Inspect and repair wiring harness and connectors", "Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0417', 'Secondary Air Injection System Switching Valve B Circuit Shorted', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit", "Failed or stuck valve/solenoid/actuator"]', '["Inspect and repair wiring harness and connectors", "Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0418', 'Secondary Air Injection System RelayACircuit Malfunction', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0419', 'Secondary Air Injection System RelayBCircuit Malfunction', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P041A', 'Gas Recirculation Temperature SensorBCircuit ', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P041B', 'Gas Recirculation Temperature SensorBCircuit Range/Performance', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P041C', 'Gas Recirculation Temperature SensorBCircuit Low', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P041D', 'Gas Recirculation Temperature SensorBCircuit High', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P041E', 'Gas Recirculation Temperature SensorBCircuit Intermittent/Erratic', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0420', 'Catalyst System Efficiency Below Threshold (Bank 1)', 3, '["Check Engine Light on", "Failed emissions test", "Rotten egg smell from exhaust", "Reduced fuel economy", "Loss of power in severe cases"]', '["Failed catalytic converter (most common)", "Exhaust leak before converter", "Faulty downstream O2 sensor", "Engine misfire damaging converter", "Oil/coolant contamination of converter"]', '["Replace catalytic converter", "Repair exhaust leak", "Replace faulty O2 sensor first (cheaper diagnostic step)", "Fix underlying misfire or contamination issue", "Use catalytic converter cleaner (temporary fix)"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0421', 'Warm Up Catalyst Efficiency Below Threshold (Bank 1)', 3, '["Check Engine Light illuminated", "Rotten egg exhaust smell", "Failed emissions test", "Reduced fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0422', 'Main Catalyst Efficiency Below Threshold (Bank 1)', 3, '["Check Engine Light illuminated", "Rotten egg exhaust smell", "Failed emissions test", "Reduced fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0423', 'Heated Catalyst Efficiency Below Threshold (Bank 1)', 3, '["Check Engine Light illuminated", "Rotten egg exhaust smell", "Failed emissions test", "Reduced fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0424', 'Heated Catalyst Temperature Below Threshold (Bank 1)', 3, '["Check Engine Light illuminated", "Temperature gauge fluctuation", "Poor heater output", "Rotten egg exhaust smell", "Failed emissions test", "Reduced fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0425', 'Catalyst Temperature Sensor (Bank 1, Sensor 1)', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output", "Rotten egg exhaust smell"]', '["Faulty sensor (internal failure)"]', '["Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0426', 'Catalyst Temperature Sensor Range/Performance (Bank 1, Sensor 1)', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output", "Rotten egg exhaust smell"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0427', 'Catalyst Temperature Sensor Low (Bank 1, Sensor 1)', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output", "Rotten egg exhaust smell"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0428', 'Catalyst Temperature Sensor High (Bank 1, Sensor 1)', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output", "Rotten egg exhaust smell"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0429', 'Catalyst Heater Control Circuit (Bank 1)', 3, '["Check Engine Light illuminated", "Rotten egg exhaust smell", "Failed emissions test", "Reduced fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P042A', 'Temperature Sensor Circuit (Bank 1 Sensor 2) ', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P042B', 'Temperature Sensor Circuit Range/Performance (Bank 1 Sensor 2) ', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P042C', 'Temperature Sensor Circuit Low (Bank 1 Sensor 2)', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P042D', 'Temperature Sensor Circuit High (Bank 1 Sensor 2)', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P042E', 'Gas RecirculationAControl Stuck Open', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0430', 'Catalyst System Efficiency Below Threshold (Bank 2)', 3, '["Check Engine Light on", "Failed emissions test", "Rotten egg smell", "Reduced fuel economy"]', '["Failed catalytic converter Bank 2", "Exhaust leak", "Faulty O2 sensor Bank 2", "Engine misfire on Bank 2"]', '["Replace catalytic converter Bank 2", "Repair exhaust leak", "Replace faulty O2 sensor", "Fix underlying engine issues"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0431', 'Warm Up Catalyst Efficiency Below Threshold (Bank 2)', 3, '["Check Engine Light illuminated", "Rotten egg exhaust smell", "Failed emissions test", "Reduced fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0432', 'Main Catalyst Efficiency Below Threshold (Bank 2)', 3, '["Check Engine Light illuminated", "Rotten egg exhaust smell", "Failed emissions test", "Reduced fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0433', 'Heated Catalyst Efficiency Below Threshold (Bank 2)', 3, '["Check Engine Light illuminated", "Rotten egg exhaust smell", "Failed emissions test", "Reduced fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0434', 'Heated Catalyst Temperature Below Threshold (Bank 2)', 3, '["Check Engine Light illuminated", "Temperature gauge fluctuation", "Poor heater output", "Rotten egg exhaust smell", "Failed emissions test", "Reduced fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0435', 'Catalyst Temperature Sensor Circuit Malfunction (Bank 2, Sensor 1)', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output", "Rotten egg exhaust smell"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0436', 'Catalyst Temperature Sensor Circuit Range/Performance (Bank 2, Sensor 1)', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output", "Rotten egg exhaust smell"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0437', 'Catalyst Temperature Sensor Circuit Low (Bank 2, Sensor 1)', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output", "Rotten egg exhaust smell"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0438', 'Catalyst Temperature Sensor Circuit High (Bank 2, Sensor 1)', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output", "Rotten egg exhaust smell"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0439', 'Catalyst Heater Control Circuit (Bank 2)', 3, '["Check Engine Light illuminated", "Rotten egg exhaust smell", "Failed emissions test", "Reduced fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P043A', 'Temperature Sensor Circuit (Bank 2 Sensor 2)', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P043B', 'Temperature Sensor Circuit Range/Performance Bank 2 Sensor 2)', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P043C', 'Temperature Sensor Circuit Low (Bank 2 Sensor 2)', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P043E', 'Emission System Leak Detection Reference Orifice Low Flow', 3, '["Check Engine Light illuminated", "Fuel odor detected", "Difficulty refueling"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0440', 'Evaporative Emission Control System Malfunction', 2, '["Check Engine Light on", "Fuel smell", "Hissing sound from fuel cap area"]', '["Loose or faulty gas cap", "Small EVAP system leak", "Faulty purge valve", "Cracked EVAP hoses"]', '["Tighten or replace gas cap", "Smoke test EVAP system for leaks", "Replace purge valve", "Replace damaged EVAP hoses"]', 15, 400)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0441', 'Evaporative Emission Control System Incorrect Purge Flow', 2, '["Check Engine Light on", "Fuel smell", "Hissing sound from fuel cap area"]', '["Loose or faulty gas cap", "Small EVAP system leak", "Faulty purge valve", "Cracked EVAP hoses"]', '["Tighten or replace gas cap", "Smoke test EVAP system for leaks", "Replace purge valve", "Replace damaged EVAP hoses"]', 15, 400)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0442', 'Evaporative Emission Control System Leak Detected (small leak)', 2, '["Check Engine Light on", "Fuel smell", "Hissing sound from fuel cap area"]', '["Loose or faulty gas cap", "Small EVAP system leak", "Faulty purge valve", "Cracked EVAP hoses"]', '["Tighten or replace gas cap", "Smoke test EVAP system for leaks", "Replace purge valve", "Replace damaged EVAP hoses"]', 15, 400)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0443', 'Evaporative Emission Control System Purge Control Valve Circuit', 2, '["Check Engine Light on", "Fuel smell", "Hard start after refueling"]', '["Faulty EVAP purge control valve", "Wiring damage", "PCM fault"]', '["Replace EVAP purge valve", "Repair wiring", "Check PCM outputs"]', 80, 350)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0444', 'Evaporative Emission Control System Purge Control Valve Circuit Open', 2, '["Check Engine Light on", "Fuel smell", "Hard start after refueling"]', '["Faulty EVAP purge control valve", "Wiring damage", "PCM fault"]', '["Replace EVAP purge valve", "Repair wiring", "Check PCM outputs"]', 80, 350)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0445', 'Evaporative Emission Control System Purge Control Valve Circuit Shorted', 2, '["Check Engine Light on", "Fuel smell", "Hard start after refueling"]', '["Faulty EVAP purge control valve", "Wiring damage", "PCM fault"]', '["Replace EVAP purge valve", "Repair wiring", "Check PCM outputs"]', 80, 350)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0446', 'Evaporative Emission Control System Vent Control Circuit Malfunction', 2, '["Check Engine Light on", "Fuel smell", "Difficulty refueling (pump clicks off)", "Hissing from fuel tank"]', '["Faulty EVAP vent valve/solenoid", "Blocked vent line", "Charcoal canister contamination", "Wiring damage"]', '["Replace EVAP vent valve/solenoid", "Clear blocked vent line", "Replace charcoal canister", "Repair wiring"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0447', 'Evaporative Emission Control System Vent Control Circuit Open', 3, '["Check Engine Light illuminated", "Fuel odor detected", "Difficulty refueling"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0448', 'Evaporative Emission Control System Vent Control Circuit Shorted', 3, '["Check Engine Light illuminated", "Fuel odor detected", "Difficulty refueling"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0449', 'Evaporative Emission Control System Vent Valve/Solenoid Circuit Malfunction', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode", "Fuel odor detected", "Difficulty refueling"]', '["Damaged, corroded, or shorted wiring in related circuit", "Failed or stuck valve/solenoid/actuator"]', '["Inspect and repair wiring harness and connectors", "Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P044A', 'Gas Recirculation SensorCCircuit', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P044C', 'Gas Recirculation SensorCCircuit Low', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P044E', 'Gas Recirculation SensorCCircuit Intermittent/Erratic ', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P044F', 'Air Injection System Switching ValveACircuit High', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit", "Failed or stuck valve/solenoid/actuator"]', '["Inspect and repair wiring harness and connectors", "Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0450', 'Evaporative Emission Control System Pressure Sensor Malfunction', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Fuel odor detected", "Difficulty refueling"]', '["Faulty sensor (internal failure)"]', '["Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0451', 'Evaporative Emission Control System Pressure Sensor Range/Performance', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Fuel odor detected", "Difficulty refueling"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0452', 'Evaporative Emission Control System Pressure Sensor Low Input', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Fuel odor detected", "Difficulty refueling"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0453', 'Evaporative Emission Control System Pressure Sensor High Input', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Fuel odor detected", "Difficulty refueling"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0454', 'Evaporative Emission Control System Pressure Sensor Intermittent', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Fuel odor detected", "Difficulty refueling"]', '["Faulty sensor (internal failure)"]', '["Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0455', 'Evaporative Emission Control System Leak Detected (gross leak)', 2, '["Check Engine Light on", "Strong fuel smell", "Hissing sound from EVAP system"]', '["Loose/missing gas cap", "Large EVAP system leak", "Cracked EVAP hose", "Faulty purge valve stuck open"]', '["Tighten or replace gas cap", "Smoke test EVAP system", "Replace damaged hoses", "Replace purge valve"]', 15, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0456', 'Evaporative Emissions System Small Leak Detected', 1, '["Check Engine Light on", "Slight fuel smell", "No driveability issues"]', '["Loose gas cap (most common)", "Very small EVAP leak", "Aging EVAP hoses", "Faulty purge valve seal"]', '["Tighten gas cap properly (3 clicks minimum)", "Replace gas cap", "Smoke test for tiny leaks", "Replace aging EVAP hoses"]', 15, 250)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0457', 'Evaporative Emission Control System Leak Detected', 3, '["Check Engine Light illuminated", "Fuel odor detected", "Difficulty refueling"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0458', 'Evaporative Emission System Purge Control Valve Circuit Low', 3, '["Check Engine Light illuminated", "Fuel odor detected", "Difficulty refueling"]', '["Damaged, corroded, or shorted wiring in related circuit", "Failed or stuck valve/solenoid/actuator"]', '["Inspect and repair wiring harness and connectors", "Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0459', 'Evaporative Emission System Purge Control Valve Circuit High', 3, '["Check Engine Light illuminated", "Fuel odor detected", "Difficulty refueling"]', '["Damaged, corroded, or shorted wiring in related circuit", "Failed or stuck valve/solenoid/actuator"]', '["Inspect and repair wiring harness and connectors", "Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P045A', 'Gas RecirculationBControl Circuit ', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P045B', 'Gas RecirculationBControl Circuit Range/Performance', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P045C', 'Gas RecirculationBControl Circuit Low ', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P045D', 'Gas RecirculationBControl Circuit High', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P045F', 'Gas RecirculationBControl Stuck Closed', 3, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0460', 'Fuel Level Sensor Circuit Malfunction', 2, '["Inaccurate fuel gauge", "Check Engine Light on", "Fuel gauge reads empty when full"]', '["Faulty fuel level sensor", "Damaged fuel sender unit", "Wiring damage", "Instrument cluster fault"]', '["Replace fuel level sensor (often part of fuel pump assembly)", "Repair wiring", "Replace instrument cluster (rare)"]', 300, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0461', 'Fuel Level Sensor Circuit Range/Performance', 2, '["Inaccurate fuel gauge", "Check Engine Light on", "Fuel gauge reads empty when full"]', '["Faulty fuel level sensor", "Damaged fuel sender unit", "Wiring damage", "Instrument cluster fault"]', '["Replace fuel level sensor (often part of fuel pump assembly)", "Repair wiring", "Replace instrument cluster (rare)"]', 300, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0462', 'Fuel Level Sensor Circuit Low Input', 2, '["Inaccurate fuel gauge", "Check Engine Light on", "Fuel gauge reads empty when full"]', '["Faulty fuel level sensor", "Damaged fuel sender unit", "Wiring damage", "Instrument cluster fault"]', '["Replace fuel level sensor (often part of fuel pump assembly)", "Repair wiring", "Replace instrument cluster (rare)"]', 300, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0463', 'Fuel Level Sensor Circuit High Input', 2, '["Inaccurate fuel gauge", "Check Engine Light on", "Fuel gauge reads empty when full"]', '["Faulty fuel level sensor", "Damaged fuel sender unit", "Wiring damage", "Instrument cluster fault"]', '["Replace fuel level sensor (often part of fuel pump assembly)", "Repair wiring", "Replace instrument cluster (rare)"]', 300, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0464', 'Fuel Level Sensor Circuit Intermittent', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)", "Fuel system contamination or component failure"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0465', 'Purge Flow Sensor Circuit Malfunction', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Fuel odor detected", "Difficulty refueling"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0466', 'Purge Flow Sensor Circuit Range/Performance', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Fuel odor detected", "Difficulty refueling"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0467', 'Purge Flow Sensor Circuit Low Input', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Fuel odor detected", "Difficulty refueling"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0468', 'Purge Flow Sensor Circuit High Input', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Fuel odor detected", "Difficulty refueling"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0469', 'Purge Flow Sensor Circuit Intermittent', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Fuel odor detected", "Difficulty refueling"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P046A', 'Temperature Sensor 1/2 Correlation (Bank 1) ', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output"]', '["Faulty sensor (internal failure)"]', '["Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P046B', 'Temperature Sensor 1/2 Correlation (Bank 2)', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output"]', '["Faulty sensor (internal failure)"]', '["Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P046D', 'Gas Recirculation SensorACircuit Intermittent/Erratic ', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P046E', 'Gas Recirculation SensorBCircuit Range/Performance', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P046F', 'Gas Recirculation SensorBCircuit Intermittent/Erratic', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0470', 'Exhaust Pressure SensorACircuit', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0471', 'Exhaust Pressure SensorACircuit Range/Performance', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0472', 'Exhaust Pressure SensorACircuit Low', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0473', 'Exhaust Pressure SensorACircuit High', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0474', 'Exhaust Pressure SensorACircuit Intermittent', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0475', 'Exhaust Pressure Control ValveA ', 3, '["Check Engine Light illuminated"]', '["Failed or stuck valve/solenoid/actuator"]', '["Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0476', 'Exhaust Pressure Control ValveARange/Performance', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit", "Failed or stuck valve/solenoid/actuator"]', '["Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0477', 'Exhaust Pressure Control ValveALow', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit", "Failed or stuck valve/solenoid/actuator"]', '["Inspect and repair wiring harness and connectors", "Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0478', 'Exhaust Pressure Control ValveAHigh', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit", "Failed or stuck valve/solenoid/actuator"]', '["Inspect and repair wiring harness and connectors", "Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0479', 'Exhaust Pressure Control ValveAIntermittent', 3, '["Check Engine Light illuminated"]', '["Failed or stuck valve/solenoid/actuator"]', '["Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P047A', 'Pressure SensorBCircuit ', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P047B', 'Pressure SensorBCircuit Range/Performance', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P047C', 'Pressure SensorBCircuit Low', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P047D', 'Pressure SensorBCircuit High ', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P047E', 'Pressure SensorBCircuit Intermittent/Erratic', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0480', 'Cooling Fan I Control Circuit Malfunction', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0481', 'Cooling Fan 2 Control Circuit Malfunction', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0482', 'Cooling Fan 3 Control Circuit Malfunction', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0483', 'Cooling Fan Rationality Check Malfunction', 3, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0484', 'Cooling Fan Circuit Over Current ', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0485', 'Cooling Fan Power/Ground Circuit Malfunction', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0486', 'Exhaust Gas Recirculation SensorBCircuit', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Engine knock under load", "Rough idle", "Failed emissions test"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0487', 'Exhaust Gas Recirculation Throttle Control CircuitAOpen', 4, '["Check Engine Light illuminated", "Erratic throttle response", "Reduced power/limp mode", "Engine knock under load", "Rough idle", "Failed emissions test"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0488', 'Exhaust Gas Recirculation Throttle Control CircuitARange/Performance', 4, '["Check Engine Light illuminated", "Erratic throttle response", "Reduced power/limp mode", "Engine knock under load", "Rough idle", "Failed emissions test"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0489', 'Exhaust Gas RecirculationAControl Circuit Low', 3, '["Check Engine Light illuminated", "Engine knock under load", "Rough idle", "Failed emissions test"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P048A', 'Pressure Control ValveAStuck Closed', 3, '["Check Engine Light illuminated"]', '["Failed or stuck valve/solenoid/actuator"]', '["Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P048B', 'Pressure Control Valve Position Sensor/Switch Circuit', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)", "Failed or stuck valve/solenoid/actuator"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P048C', 'Exhaust Pressure Control Valve Position Sensor/Switch Circuit Range/Performance', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)", "Failed or stuck valve/solenoid/actuator"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P048D', 'Exhaust Pressure Control Valve Position Sensor/Switch Circuit Low', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)", "Failed or stuck valve/solenoid/actuator"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P048E', 'Pressure Control Valve Position Sensor/Switch Circuit High', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)", "Failed or stuck valve/solenoid/actuator"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P048F', 'Exhaust Pressure Control Valve Position Sensor/Switch Circuit Intermittent/Erratic', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)", "Failed or stuck valve/solenoid/actuator"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0490', 'Exhaust Gas RecirculationAControl Circuit High', 3, '["Check Engine Light illuminated", "Engine knock under load", "Rough idle", "Failed emissions test"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0491', 'Secondary Air Injection System Insufficient Flow Bank 1', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0492', 'Secondary Air Injection System Insufficient Flow Bank 2', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0493', 'Fan Overspeed', 3, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0494', 'Fan Speed Low', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0495', 'Fan Speed High', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0496', 'EVAP Flow During A Non-Purge Condition', 2, '["Check Engine Light on", "Hard start after refueling", "Rough idle after refueling"]', '["Faulty EVAP purge valve (stuck open)", "EVAP system contamination", "PCM fault"]', '["Replace EVAP purge valve", "Check and clean EVAP lines", "Clear codes and verify"]', 80, 350)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0497', 'Evaporative Emission System Low Purge Flow', 3, '["Check Engine Light illuminated", "Fuel odor detected", "Difficulty refueling"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0498', 'Evaporative Emission System Vent Valve Control Circuit Low', 3, '["Check Engine Light illuminated", "Fuel odor detected", "Difficulty refueling"]', '["Damaged, corroded, or shorted wiring in related circuit", "Failed or stuck valve/solenoid/actuator"]', '["Inspect and repair wiring harness and connectors", "Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0499', 'Evaporative Emission System Vent Valve Control Circuit High', 3, '["Check Engine Light illuminated", "Fuel odor detected", "Difficulty refueling"]', '["Damaged, corroded, or shorted wiring in related circuit", "Failed or stuck valve/solenoid/actuator"]', '["Inspect and repair wiring harness and connectors", "Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P049A', 'Gas RecirculationBFlow', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P049B', 'Gas RecirculationBFlow Insufficient Detected', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P049C', 'Gas RecirculationBFlow Excessive Detected', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P049D', 'Gas RecirculationAControl Position Exceeded Learning Limit', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P049E', 'Gas RecirculationBControl Position Exceeded Learning Limit', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P049F', 'Pressure Control ValveB ', 3, '["Check Engine Light illuminated"]', '["Failed or stuck valve/solenoid/actuator"]', '["Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P04A0', 'Pressure Control ValveBRange/Performance', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit", "Failed or stuck valve/solenoid/actuator"]', '["Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P04A1', 'Pressure Control ValveBLow', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit", "Failed or stuck valve/solenoid/actuator"]', '["Inspect and repair wiring harness and connectors", "Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P04A2', 'Pressure Control ValveBHigh', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit", "Failed or stuck valve/solenoid/actuator"]', '["Inspect and repair wiring harness and connectors", "Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P04A3', 'Pressure Control ValveBIntermittent', 3, '["Check Engine Light illuminated"]', '["Failed or stuck valve/solenoid/actuator"]', '["Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P04A4', 'Pressure Control ValveBStuck Open', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit", "Failed or stuck valve/solenoid/actuator"]', '["Inspect and repair wiring harness and connectors", "Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P04A5', 'Pressure Control ValveBStuck Closed', 3, '["Check Engine Light illuminated"]', '["Failed or stuck valve/solenoid/actuator"]', '["Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P04A6', 'Pressure Control ValveBPosition Sensor/Switch Circuit', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)", "Failed or stuck valve/solenoid/actuator"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P04A7', 'Pressure Control ValveBPosition Sensor/Switch Circuit Range/Performance', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)", "Failed or stuck valve/solenoid/actuator"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P04A8', 'Pressure Control ValveBPosition Sensor/Switch Circuit Low', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)", "Failed or stuck valve/solenoid/actuator"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P04A9', 'Exhaust Pressure Control ValveBPosition Sensor/Switch Circuit High', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)", "Failed or stuck valve/solenoid/actuator"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P04AA', 'Exhaust Pressure Control ValveBPosition Sensor/Switch Circuit Intermittent/Erratic', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)", "Failed or stuck valve/solenoid/actuator"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P04AB', '- P04FF ISO/SAE Reserved', 3, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0500', 'Vehicle Speed SensorAMalfunction', 3, '["Speedometer not working", "Check Engine Light on", "ABS/Traction Control lights on", "Harsh shifting (automatic)"]', '["Faulty vehicle speed sensor (VSS)", "Damaged wiring", "Damaged speedometer gear", "ABS module fault"]', '["Replace vehicle speed sensor", "Repair wiring harness", "Replace speedometer drive gear", "Check ABS module"]', 100, 450)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0501', 'Vehicle Speed SensorARange/Performance', 3, '["Speedometer not working", "Check Engine Light on", "ABS/Traction Control lights on", "Harsh shifting (automatic)"]', '["Faulty vehicle speed sensor (VSS)", "Damaged wiring", "Damaged speedometer gear", "ABS module fault"]', '["Replace vehicle speed sensor", "Repair wiring harness", "Replace speedometer drive gear", "Check ABS module"]', 100, 450)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0502', 'Vehicle Speed SensorALow Input', 3, '["Speedometer not working", "Check Engine Light on", "ABS/Traction Control lights on", "Harsh shifting (automatic)"]', '["Faulty vehicle speed sensor (VSS)", "Damaged wiring", "Damaged speedometer gear", "ABS module fault"]', '["Replace vehicle speed sensor", "Repair wiring harness", "Replace speedometer drive gear", "Check ABS module"]', 100, 450)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0503', 'Vehicle Speed SensorAIntermittent/Erratic/High', 3, '["Speedometer not working", "Check Engine Light on", "ABS/Traction Control lights on", "Harsh shifting (automatic)"]', '["Faulty vehicle speed sensor (VSS)", "Damaged wiring", "Damaged speedometer gear", "ABS module fault"]', '["Replace vehicle speed sensor", "Repair wiring harness", "Replace speedometer drive gear", "Check ABS module"]', 100, 450)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0504', 'Brake SwitchA / BCorrelation', 4, '["Check Engine Light illuminated", "ABS warning light", "Brake system warning"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0505', 'Idle Control System Malfunction', 3, '["Check Engine Light on", "High or low idle speed", "Engine stall when stopping", "Rough idle"]', '["Faulty idle air control (IAC) valve", "Carbon buildup in throttle body", "Vacuum leak", "PCM malfunction"]', '["Clean or replace IAC valve", "Clean throttle body", "Repair vacuum leaks", "Perform idle relearn"]', 100, 450)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0506', 'Idle Control System RPM Lower Than Expected', 2, '["Check Engine Light on", "Engine idle too low/high", "Engine stall", "Rough idle"]', '["Dirty throttle body", "Faulty IAC valve", "Vacuum leak (high idle)", "Clogged air passages (low idle)", "Faulty PCV valve"]', '["Clean throttle body thoroughly", "Replace IAC valve", "Find and repair vacuum leaks", "Replace PCV valve", "Perform idle relearn procedure"]', 50, 350)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0507', 'Idle Control System RPM Higher Than Expected', 2, '["Check Engine Light on", "Engine idle too low/high", "Engine stall", "Rough idle"]', '["Dirty throttle body", "Faulty IAC valve", "Vacuum leak (high idle)", "Clogged air passages (low idle)", "Faulty PCV valve"]', '["Clean throttle body thoroughly", "Replace IAC valve", "Find and repair vacuum leaks", "Replace PCV valve", "Perform idle relearn procedure"]', 50, 350)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0508', 'Idle Air Control System Circuit Low', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0509', 'Idle Air Control System Circuit High', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P050A', 'Cold Start Idle Air Control System Performance', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P050B', 'Cold Start Ignition Timing Performance', 4, '["Check Engine Light illuminated", "Engine misfire/rough running", "Flashing Check Engine Light", "Loss of power", "Engine rattle/timing noise", "Rough idle"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P050C', 'Cold Start Engine Coolant Temperature Performance', 3, '["Check Engine Light illuminated", "Temperature gauge fluctuation", "Poor heater output"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P050D', 'Cold Start Rough Idle', 3, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P050E', 'Cold Start Engine Exhaust Temperature Too Low', 3, '["Check Engine Light illuminated", "Temperature gauge fluctuation", "Poor heater output"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P050F', 'Brake Assist Vacuum Too Low', 4, '["Check Engine Light illuminated", "ABS warning light", "Brake system warning"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0510', 'Closed Throttle Position Switch Malfunction', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Erratic throttle response", "Reduced power/limp mode"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0511', 'Idle Air Control Circuit', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0512', 'Starter Request Circuit', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0513', 'Incorrect Immobilizer Key', 3, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0514', 'Battery Temperature Sensor Circuit Range/Performance', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output", "Battery warning light"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0515', 'Battery Temperature Sensor Circuit', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output", "Battery warning light"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0516', 'Battery Temperature Sensor Circuit Low', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output", "Battery warning light"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0517', 'Battery Temperature Sensor Circuit High', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output", "Battery warning light"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0518', 'Idle Air Control Circuit Intermittent', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0519', 'Idle Air Control System Performance', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P051A', 'Crankcase Pressure Sensor Circuit', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P051B', 'Crankcase Pressure Sensor Circuit Range/Performance', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P051C', 'Crankcase Pressure Sensor Circuit Low', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P051D', 'Crankcase Pressure Sensor Circuit High', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P051E', 'Crankcase Pressure Sensor Circuit Intermittent/Erratic', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P051F', 'Positive Crankcase Ventilation Filter Restriction', 3, '["Check Engine Light illuminated", "Fuel odor detected", "Difficulty refueling"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0520', 'Engine Oil Pressure Sensor/Switch Circuit Malfunction', 4, '["Check Engine Light on", "Oil pressure warning light", "Engine noise/ticking"]', '["Faulty oil pressure sensor/sender", "Low engine oil", "Wiring damage", "Actual low oil pressure (pump failure)"]', '["Check oil level first", "Replace oil pressure sensor", "Repair wiring", "If actual low pressure: replace oil pump"]', 80, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0521', 'Engine Oil Pressure Sensor/Switch Circuit Range/Performance', 4, '["Check Engine Light on", "Oil pressure warning light", "Engine noise/ticking"]', '["Faulty oil pressure sensor/sender", "Low engine oil", "Wiring damage", "Actual low oil pressure (pump failure)"]', '["Check oil level first", "Replace oil pressure sensor", "Repair wiring", "If actual low pressure: replace oil pump"]', 80, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0522', 'Engine Oil Pressure Sensor/Switch Circuit Low Voltage', 4, '["Check Engine Light on", "Oil pressure warning light", "Engine noise/ticking"]', '["Faulty oil pressure sensor/sender", "Low engine oil", "Wiring damage", "Actual low oil pressure (pump failure)"]', '["Check oil level first", "Replace oil pressure sensor", "Repair wiring", "If actual low pressure: replace oil pump"]', 80, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0523', 'Engine Oil Pressure Sensor/Switch Circuit High Voltage', 4, '["Check Engine Light on", "Oil pressure warning light", "Engine noise/ticking"]', '["Faulty oil pressure sensor/sender", "Low engine oil", "Wiring damage", "Actual low oil pressure (pump failure)"]', '["Check oil level first", "Replace oil pressure sensor", "Repair wiring", "If actual low pressure: replace oil pump"]', 80, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0524', 'Engine Oil Pressure Too Low', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0525', 'Cruise Control Servo Control Circuit Range/Performance', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0526', 'Fan Speed Sensor Circuit', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0527', 'Fan Speed Sensor Circuit Range/Performance', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0528', 'Fan Speed Sensor Circuit No Signal', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0529', 'Fan Speed Sensor Circuit Intermittent', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P052A', 'Cold StartACamshaft Position Timing Over-Advanced Bank 1', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P052B', 'Cold StartACamshaft Position Timing Over-Retarded Bank 1', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P052C', 'Cold StartACamshaft Position Timing Over-Advanced Bank 2', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P052D', 'Cold StartACamshaft Position Timing Over-Retarded Bank 2', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P052E', 'Positive Crankcase Ventilation Regulator Valve Performance', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting", "Fuel odor detected", "Difficulty refueling"]', '["Damaged, corroded, or shorted wiring in related circuit", "Failed or stuck valve/solenoid/actuator"]', '["Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P052F', 'ISO/SAE Reserved', 3, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0530', 'A/C Refrigerant Pressure SensorACircuit', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0531', 'A/C Refrigerant Pressure SensorACircuit Range/Performance', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0532', 'A/C Refrigerant Pressure SensorACircuit Low', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0533', 'A/C Refrigerant Pressure SensorACircuit High', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0534', 'Air Conditioner Refrigerant Charge Loss', 3, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0535', 'A/C Evaporator Temperature Sensor Circuit', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output", "Fuel odor detected"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0536', 'A/C Evaporator Temperature Sensor Circuit Range/Performance', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output", "Fuel odor detected"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0537', 'A/C Evaporator Temperature Sensor Circuit Low', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output", "Fuel odor detected"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0538', 'A/C Evaporator Temperature Sensor Circuit High', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output", "Fuel odor detected"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0539', 'A/C Evaporator Temperature Sensor Circuit Intermittent', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output", "Fuel odor detected"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P053A', 'Positive Crankcase Ventilation Heater Control Circuit /Open', 3, '["Check Engine Light illuminated", "Fuel odor detected", "Difficulty refueling"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P053B', 'Positive Crankcase Ventilation Heater Control Circuit Low', 3, '["Check Engine Light illuminated", "Fuel odor detected", "Difficulty refueling"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P053C', 'Positive Crankcase Ventilation Heater Control Circuit High', 3, '["Check Engine Light illuminated", "Fuel odor detected", "Difficulty refueling"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P053D,', 'P053E, P053F ISO/SAE Reserved', 3, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0540', 'Intake Air HeaterACircuit', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0541', 'Intake Air HeaterACircuit Low', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0542', 'Intake Air HeaterACircuit High', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0543', 'Intake Air HeaterACircuit Open', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0544', 'Exhaust Gas Temperature Sensor Circuit (Bank 1 Sensor 1)', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0545', 'Exhaust Gas Temperature Sensor Circuit Low (Bank 1 Sensor 1)', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0546', 'Exhaust Gas Temperature Sensor Circuit High (Bank 1 Sensor 1)', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0547', 'Exhaust Gas Temperature Sensor Circuit (Bank 2 Sensor 1)', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0548', 'Exhaust Gas Temperature Sensor Circuit Low (Bank 2 Sensor 1)', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0549', 'Exhaust Gas Temperature Sensor Circuit High (Bank 2 Sensor 1)', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P054A', 'Cold StartBCamshaft Position Timing Over-Advanced Bank 1', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P054B', 'Cold StartBCamshaft Position Timing Over-Retarded Bank 1', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P054C', 'Cold StartBCamshaft Position Timing Over-Advanced Bank 2', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P054D', 'Cold StartBCamshaft Position Timing Over-Retarded Bank 2', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P054E,', 'P054F ISO/SAE Reserved', 3, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0550', 'Power Steering Pressure Sensor Circuit Malfunction', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0551', 'Power Steering Pressure Sensor Circuit Range/Performance', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0552', 'Power Steering Pressure Sensor Circuit Low Input', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0553', 'Power Steering Pressure Sensor Circuit High Input', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0554', 'Power Steering Pressure Sensor Circuit Intermittent', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0555', 'Brake Booster Pressure Sensor Circuit', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Loss of boost pressure", "Reduced power", "Turbo whine/whistle"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0556', 'Brake Booster Pressure Sensor Circuit Range/Performance', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Loss of boost pressure", "Reduced power", "Turbo whine/whistle"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0557', 'Brake Booster Pressure Sensor Circuit Low', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Loss of boost pressure", "Reduced power", "Turbo whine/whistle"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0558', 'Brake Booster Pressure Sensor Circuit High', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Loss of boost pressure", "Reduced power", "Turbo whine/whistle"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0559', 'Brake Booster Pressure Sensor Circuit Intermittent', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Loss of boost pressure", "Reduced power", "Turbo whine/whistle"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P055A,', 'P055B, P055C, P055D, P055E, P055F ISO/SAE Reserved', 3, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0560', 'System Voltage Malfunction', 3, '["Check Engine Light illuminated", "Battery warning light", "Charging system malfunction", "Dim lights"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0561', 'System Voltage Unstable', 3, '["Check Engine Light illuminated", "Battery warning light", "Charging system malfunction", "Dim lights"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0562', 'System Voltage Low', 3, '["Check Engine Light illuminated", "Battery warning light", "Charging system malfunction", "Dim lights"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0563', 'System Voltage High', 3, '["Check Engine Light illuminated", "Battery warning light", "Charging system malfunction", "Dim lights"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0564', 'Cruise Control Multi-Function InputACircuit', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0565', 'Cruise Control On Signal Malfunction', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0566', 'Cruise Control Off Signal Malfunction', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0567', 'Cruise Control Resume Signal Malfunction', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0568', 'Cruise Control Set Signal Malfunction', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0569', 'Cruise Control Coast Signal Malfunction', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P056A', 'Cruise ControlIncrease DistanceSignal', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P056B', 'Cruise ControlDecrease DistanceSignal', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P056C,', 'P056D, P056E, P056F ISO/SAE Reserved', 3, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0570', 'Cruise Control Accel Signal Malfunction', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0571', 'Cruise Control/Brake Switch A Circuit Malfunction', 4, '["Check Engine Light illuminated", "ABS warning light", "Brake system warning"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0572', 'Cruise Control/Brake Switch A Circuit Low', 4, '["Check Engine Light illuminated", "ABS warning light", "Brake system warning"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0573', 'Cruise Control/Brake Switch A Circuit High', 4, '["Check Engine Light illuminated", "ABS warning light", "Brake system warning"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0574', 'Cruise Control System - Vehicle Speed Too High', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0575', 'Cruise Control Input Circuit', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0576', 'Cruise Control Input Circuit Low', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0577', 'Cruise Control Input Circuit High', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0578', 'Cruise Control Multi-Function InputACircuit Stuck', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0579', 'Cruise Control Multi-Function InputACircuit Range/Performance', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P057A,', 'P057B, P057C, P057D, P057E, P057F ISO/SAE Reserved', 3, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0580', 'Cruise Control Multi-Function InputACircuit Low', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0581', 'Cruise Control Multi-Function InputACircuit High', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0582', 'Cruise Control Vacuum Control Circuit /Open', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0583', 'Cruise Control Vacuum Control Circuit Low', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0584', 'Cruise Control Vacuum Control Circuit High', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0585', 'Cruise Control Multi-Function InputA / BCorrelation', 3, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0586', 'Cruise Control Vent Control Circuit/Open', 3, '["Check Engine Light illuminated", "Fuel odor detected", "Difficulty refueling"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0587', 'Cruise Control Vent Control Circuit Low', 3, '["Check Engine Light illuminated", "Fuel odor detected", "Difficulty refueling"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0588', 'Cruise Control Vent Control Circuit High', 3, '["Check Engine Light illuminated", "Fuel odor detected", "Difficulty refueling"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0589', 'Cruise Control Multi-Function InputBCircuit', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P058A,', 'P058B, P058C, P058D, P058E, P058F ISO/SAE Reserved', 3, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0590', 'Cruise Control Multi-Function InputBCircuit Stuck', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0591', 'Cruise Control Multi-Function InputBCircuit Range/Performance', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0592', 'Cruise Control Multi-Function InputBCircuit Low', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0593', 'Cruise Control Multi-Function InputBCircuit High', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0594', 'Cruise Control Servo Control Circuit/Open', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0595', 'Cruise Control Servo Control Circuit Low', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0596', 'Cruise Control Servo Control Circuit High', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0597', 'Thermostat Heater Control Circuit/Open', 3, '["Check Engine Light illuminated", "Temperature gauge fluctuation", "Poor heater output"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0598', 'Thermostat Heater Control Circuit Low', 3, '["Check Engine Light illuminated", "Temperature gauge fluctuation", "Poor heater output"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0599', 'Thermostat Heater Control Circuit High', 3, '["Check Engine Light illuminated", "Temperature gauge fluctuation", "Poor heater output"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P059A', '- P05FF ISO/SAE Reserved', 3, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0600', 'Serial Communication Link Malfunction', 5, '["Check Engine Light on", "Engine may not start", "Multiple warning lights", "Erratic engine behavior", "Vehicle in limp mode"]', '["Failed PCM/ECM (internal fault)", "Corrupted PCM software/calibration", "Water damage to PCM", "Voltage spike damage"]', '["Reprogram/reflash PCM", "Replace PCM/ECM", "Check all PCM grounds and power connections", "Verify battery and charging system"]', 500, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0601
Internal', 'Control Module Memory Check Sum Error', 4, '["Check Engine Light illuminated"]', '["Faulty control module (PCM/ECM/TCM)"]', '["Reprogram or replace control module", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0602', 'Control Module Programming Error', 5, '["Check Engine Light on", "Engine may not start", "Multiple warning lights", "Erratic engine behavior", "Vehicle in limp mode"]', '["Failed PCM/ECM (internal fault)", "Corrupted PCM software/calibration", "Water damage to PCM", "Voltage spike damage"]', '["Reprogram/reflash PCM", "Replace PCM/ECM", "Check all PCM grounds and power connections", "Verify battery and charging system"]', 500, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0603', 'Internal Control Module Keep Alive Memory (KAM) Error', 5, '["Check Engine Light on", "Engine may not start", "Multiple warning lights", "Erratic engine behavior", "Vehicle in limp mode"]', '["Failed PCM/ECM (internal fault)", "Corrupted PCM software/calibration", "Water damage to PCM", "Voltage spike damage"]', '["Reprogram/reflash PCM", "Replace PCM/ECM", "Check all PCM grounds and power connections", "Verify battery and charging system"]', 500, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0604', 'Internal Control Module Random Access Memory (RAM) Error', 5, '["Check Engine Light on", "Engine may not start", "Multiple warning lights", "Erratic engine behavior", "Vehicle in limp mode"]', '["Failed PCM/ECM (internal fault)", "Corrupted PCM software/calibration", "Water damage to PCM", "Voltage spike damage"]', '["Reprogram/reflash PCM", "Replace PCM/ECM", "Check all PCM grounds and power connections", "Verify battery and charging system"]', 500, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0605', 'Internal Control Module Read Only Memory (ROM) Error', 5, '["Check Engine Light on", "Engine may not start", "Multiple warning lights", "Erratic engine behavior", "Vehicle in limp mode"]', '["Failed PCM/ECM (internal fault)", "Corrupted PCM software/calibration", "Water damage to PCM", "Voltage spike damage"]', '["Reprogram/reflash PCM", "Replace PCM/ECM", "Check all PCM grounds and power connections", "Verify battery and charging system"]', 500, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0606', 'PCM Processor Fault', 5, '["Check Engine Light on", "Engine may not start", "Multiple warning lights", "Erratic engine behavior", "Vehicle in limp mode"]', '["Failed PCM/ECM (internal fault)", "Corrupted PCM software/calibration", "Water damage to PCM", "Voltage spike damage"]', '["Reprogram/reflash PCM", "Replace PCM/ECM", "Check all PCM grounds and power connections", "Verify battery and charging system"]', 500, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0607', 'Control Module Performance', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty control module (PCM/ECM/TCM)"]', '["Reprogram or replace control module", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0608', 'Control Module VSS OutputAMalfunction', 4, '["Check Engine Light illuminated"]', '["Faulty control module (PCM/ECM/TCM)"]', '["Reprogram or replace control module", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0609', 'Control Module VSS OutputBMalfunction', 4, '["Check Engine Light illuminated"]', '["Faulty control module (PCM/ECM/TCM)"]', '["Reprogram or replace control module", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P060A', 'Internal Control Module Monitoring Processor Performance', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty control module (PCM/ECM/TCM)"]', '["Reprogram or replace control module", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P060B', 'Internal Control Module A/D Processing Performance', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty control module (PCM/ECM/TCM)"]', '["Reprogram or replace control module", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P060C', 'Internal Control Module Main Processor Performance', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty control module (PCM/ECM/TCM)"]', '["Reprogram or replace control module", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P060D', 'Internal Control Module Accelerator Pedal Position Performance', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Erratic throttle response", "Reduced power/limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty control module (PCM/ECM/TCM)"]', '["Reprogram or replace control module", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P060E', 'Internal Control Module Throttle Position Performance', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Erratic throttle response", "Reduced power/limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty control module (PCM/ECM/TCM)"]', '["Reprogram or replace control module", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P060F', 'Internal Control Module Coolant Temperature Performance', 4, '["Check Engine Light illuminated", "Temperature gauge fluctuation", "Poor heater output"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty control module (PCM/ECM/TCM)"]', '["Reprogram or replace control module", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0610', 'Control Module Vehicle Options Error', 4, '["Check Engine Light illuminated"]', '["Faulty control module (PCM/ECM/TCM)"]', '["Reprogram or replace control module", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0611', 'Fuel Injector Control Module Performance', 4, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit", "Fuel system contamination or component failure", "Faulty control module (PCM/ECM/TCM)"]', '["Service or replace affected fuel system component", "Reprogram or replace control module", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0612', 'Fuel Injector Control Module Relay Control', 4, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Fuel system contamination or component failure", "Faulty control module (PCM/ECM/TCM)"]', '["Service or replace affected fuel system component", "Reprogram or replace control module", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0613', 'TCM Processor', 4, '["Check Engine Light illuminated"]', '["Faulty control module (PCM/ECM/TCM)"]', '["Reprogram or replace control module", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0614', 'ECM / TCM Incompatible', 4, '["Check Engine Light illuminated"]', '["Faulty control module (PCM/ECM/TCM)"]', '["Reprogram or replace control module", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0615', 'Starter Relay Circuit', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0616', 'Starter Relay Circuit Low', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0617', 'Starter Relay Circuit High', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0618', 'Alternative Fuel Control Module KAM Error', 4, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Fuel system contamination or component failure", "Faulty control module (PCM/ECM/TCM)"]', '["Service or replace affected fuel system component", "Reprogram or replace control module", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0619', 'Alternative Fuel Control Module RAM/ROM Error', 4, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Fuel system contamination or component failure", "Faulty control module (PCM/ECM/TCM)"]', '["Service or replace affected fuel system component", "Reprogram or replace control module", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P061A', 'Control Module Torque Performance', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty control module (PCM/ECM/TCM)"]', '["Reprogram or replace control module", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P061D', 'Control Module Engine Air Mass Performance', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty control module (PCM/ECM/TCM)"]', '["Reprogram or replace control module", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P061E', 'Control Module Brake Signal Performance', 4, '["Check Engine Light illuminated", "ABS warning light", "Brake system warning"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty control module (PCM/ECM/TCM)"]', '["Reprogram or replace control module", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0620', 'Generator Control Circuit Malfunction', 4, '["Check Engine Light on", "Battery warning light", "Charging system malfunction", "Accessories not working"]', '["Faulty alternator", "Wiring damage to alternator circuit", "Blown alternator fuse", "PCM fault"]', '["Replace alternator", "Repair wiring to alternator", "Replace blown fuse", "Check PCM alternator control circuit"]', 300, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0621', 'Generator LampLControl Circuit Malfunction', 4, '["Check Engine Light on", "Battery warning light", "Charging system malfunction", "Accessories not working"]', '["Faulty alternator", "Wiring damage to alternator circuit", "Blown alternator fuse", "PCM fault"]', '["Replace alternator", "Repair wiring to alternator", "Replace blown fuse", "Check PCM alternator control circuit"]', 300, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0622', 'Generator FieldFControl Circuit Malfunction', 4, '["Check Engine Light on", "Battery warning light", "Charging system malfunction", "Accessories not working"]', '["Faulty alternator", "Wiring damage to alternator circuit", "Blown alternator fuse", "PCM fault"]', '["Replace alternator", "Repair wiring to alternator", "Replace blown fuse", "Check PCM alternator control circuit"]', 300, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0623', 'Generator Lamp Control Circuit', 4, '["Check Engine Light illuminated", "Battery warning light", "Charging system malfunction", "Dim lights"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0624', 'Fuel Cap Lamp Control Circuit', 4, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit", "Fuel system contamination or component failure"]', '["Inspect and repair wiring harness and connectors", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0625', 'Generator Field/F Terminal Circuit Low', 4, '["Check Engine Light illuminated", "Battery warning light", "Charging system malfunction", "Dim lights"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0626', 'Generator Field/F Terminal Circuit High', 4, '["Check Engine Light illuminated", "Battery warning light", "Charging system malfunction", "Dim lights"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0627', 'Fuel PumpAControl Circuit /Open', 4, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit", "Fuel system contamination or component failure"]', '["Inspect and repair wiring harness and connectors", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0628', 'Fuel PumpAControl Circuit Low', 4, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit", "Fuel system contamination or component failure"]', '["Inspect and repair wiring harness and connectors", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0629', 'Fuel PumpAControl Circuit High', 4, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit", "Fuel system contamination or component failure"]', '["Inspect and repair wiring harness and connectors", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P062A', 'PumpAControl Circuit Range/Performance', 4, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P062B', 'Internal Control Module Fuel Injector Control Performance', 4, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit", "Fuel system contamination or component failure", "Faulty control module (PCM/ECM/TCM)"]', '["Service or replace affected fuel system component", "Reprogram or replace control module", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P062D', 'Fuel Injector Driver Circuit Performance Bank 1', 4, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit", "Fuel system contamination or component failure"]', '["Inspect and repair wiring harness and connectors", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P062E', 'Fuel Injector Driver Circuit Performance Bank 2', 4, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit", "Fuel system contamination or component failure"]', '["Inspect and repair wiring harness and connectors", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P062F', 'Internal Control Module EEPROM Error', 4, '["Check Engine Light on", "Battery drains quickly", "Starting problems"]', '["Faulty EEPROM in PCM", "PCM memory corruption", "Low battery voltage during PCM write"]', '["Reprogram/reflash PCM", "Replace PCM if reprogramming fails", "Ensure stable battery voltage"]', 500, 2000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0630', 'VIN Not Programmed or Incompatible – ECM/PCM', 4, '["Check Engine Light illuminated"]', '["Faulty control module (PCM/ECM/TCM)"]', '["Reprogram or replace control module", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0631', 'VIN Not Programmed or Incompatible – TCM', 4, '["Check Engine Light illuminated"]', '["Faulty control module (PCM/ECM/TCM)"]', '["Reprogram or replace control module", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0632', 'Odometer Not Programmed – ECM/PCM', 4, '["Check Engine Light illuminated"]', '["Faulty control module (PCM/ECM/TCM)"]', '["Reprogram or replace control module", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0633', 'Immobilizer Key Not Programmed – ECM/PCM', 4, '["Check Engine Light illuminated"]', '["Faulty control module (PCM/ECM/TCM)"]', '["Reprogram or replace control module", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0634', 'PCM/ECM/TCM Internal Temperature Too High', 4, '["Check Engine Light illuminated", "Temperature gauge fluctuation", "Poor heater output"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty control module (PCM/ECM/TCM)"]', '["Inspect and repair wiring harness and connectors", "Reprogram or replace control module", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0635', 'Power Steering Control Circuit', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0636', 'Power Steering Control Circuit Low', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0637', 'Power Steering Control Circuit High', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0638', 'Throttle Actuator Control Range/Performance (Bank 1)', 4, '["Check Engine Light illuminated", "Erratic throttle response", "Reduced power/limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit", "Failed or stuck valve/solenoid/actuator"]', '["Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0639', 'Throttle Actuator Control Range/Performance (Bank 2)', 4, '["Check Engine Light illuminated", "Erratic throttle response", "Reduced power/limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit", "Failed or stuck valve/solenoid/actuator"]', '["Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P063A', 'Voltage Sense Circuit', 4, '["Check Engine Light illuminated", "Battery warning light", "Charging system malfunction", "Dim lights"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P063B', 'Voltage Sense Circuit Range/Performance ', 4, '["Check Engine Light illuminated", "Battery warning light", "Charging system malfunction", "Dim lights"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P063C', 'Voltage Sense Circuit Low', 4, '["Check Engine Light illuminated", "Battery warning light", "Charging system malfunction", "Dim lights"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P063D', 'Voltage Sense Circuit High', 4, '["Check Engine Light illuminated", "Battery warning light", "Charging system malfunction", "Dim lights"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P063E', 'Configuration Throttle Input Not Present ', 4, '["Check Engine Light illuminated", "Erratic throttle response", "Reduced power/limp mode"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P063F', 'Configuration Engine Coolant Temperature Input Not Present', 4, '["Check Engine Light illuminated", "Temperature gauge fluctuation", "Poor heater output"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0640', 'Intake Air Heater Control Circuit', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0641', 'Sensor Reference VoltageACircuit Open', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Battery warning light", "Charging system malfunction", "Dim lights"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0642', 'Sensor Reference VoltageACircuit Low', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Battery warning light", "Charging system malfunction", "Dim lights"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0643', 'Sensor Reference VoltageACircuit High', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Battery warning light", "Charging system malfunction", "Dim lights"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0644', 'Driver Display Serial Communication Circuit', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0645', 'A/C Clutch Relay Control Circuit', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0646', 'A/C Clutch Relay Control Circuit Low', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0647', 'A/C Clutch Relay Control Circuit High', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0648', 'Immobilizer Lamp Control Circuit', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0649', 'Speed Control Lamp Control Circuit', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P064A', 'Pump Control Module', 4, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Faulty control module (PCM/ECM/TCM)"]', '["Service or replace affected fuel system component", "Reprogram or replace control module", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P064B', 'Control Module', 4, '["Check Engine Light illuminated"]', '["Faulty control module (PCM/ECM/TCM)"]', '["Reprogram or replace control module", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P064D', 'Control Module O2 Sensor Processor Performance Bank 1', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)", "Faulty control module (PCM/ECM/TCM)"]', '["Replace faulty sensor", "Reprogram or replace control module", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P064E', 'Control Module O2 Sensor Processor Performance Bank 2', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)", "Faulty control module (PCM/ECM/TCM)"]', '["Replace faulty sensor", "Reprogram or replace control module", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0650', 'Malfunction Indicator Lamp (MIL) Control Circuit Malfunction', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0651', 'Sensor Reference VoltageBCircuit Open', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Battery warning light", "Charging system malfunction", "Dim lights"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0652', 'Sensor Reference VoltageBCircuit Low', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Battery warning light", "Charging system malfunction", "Dim lights"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0653', 'Sensor Reference VoltageBCircuit High', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Battery warning light", "Charging system malfunction", "Dim lights"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0654', 'Engine RPM Output Circuit Malfunction', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0655', 'Engine Hot Lamp Output Control Circuit Malfunction', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0656', 'Fuel Level Output Circuit Malfunction', 4, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting"]', '["Damaged, corroded, or shorted wiring in related circuit", "Fuel system contamination or component failure"]', '["Inspect and repair wiring harness and connectors", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0657', 'Actuator Supply VoltageACircuit/Open', 4, '["Check Engine Light illuminated", "Battery warning light", "Charging system malfunction", "Dim lights"]', '["Damaged, corroded, or shorted wiring in related circuit", "Failed or stuck valve/solenoid/actuator"]', '["Inspect and repair wiring harness and connectors", "Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0658', 'Actuator Supply VoltageACircuit Low', 4, '["Check Engine Light illuminated", "Battery warning light", "Charging system malfunction", "Dim lights"]', '["Damaged, corroded, or shorted wiring in related circuit", "Failed or stuck valve/solenoid/actuator"]', '["Inspect and repair wiring harness and connectors", "Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0659', 'Actuator Supply VoltageACircuit High', 4, '["Check Engine Light illuminated", "Battery warning light", "Charging system malfunction", "Dim lights"]', '["Damaged, corroded, or shorted wiring in related circuit", "Failed or stuck valve/solenoid/actuator"]', '["Inspect and repair wiring harness and connectors", "Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P065A', 'System Performance', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P065C', 'Mechanical Performance', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0660', 'Intake Manifold Tuning Valve Control Circuit/Open Bank 1', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit", "Failed or stuck valve/solenoid/actuator"]', '["Inspect and repair wiring harness and connectors", "Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0661', 'Intake Manifold Tuning Valve Control Circuit Low Bank 1', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit", "Failed or stuck valve/solenoid/actuator"]', '["Inspect and repair wiring harness and connectors", "Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0662', 'Intake Manifold Tuning Valve Control Circuit High Bank 1', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit", "Failed or stuck valve/solenoid/actuator"]', '["Inspect and repair wiring harness and connectors", "Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0663', 'Intake Manifold Tuning Valve Control Circuit/Open Bank 2', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit", "Failed or stuck valve/solenoid/actuator"]', '["Inspect and repair wiring harness and connectors", "Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0664', 'Intake Manifold Tuning Valve Control Circuit Low Bank 2', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit", "Failed or stuck valve/solenoid/actuator"]', '["Inspect and repair wiring harness and connectors", "Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0665', 'Intake Manifold Tuning Valve Control Circuit High Bank 2', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit", "Failed or stuck valve/solenoid/actuator"]', '["Inspect and repair wiring harness and connectors", "Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0666', 'PCM/ECM/TCM Internal Temperature Sensor Circuit', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)", "Faulty control module (PCM/ECM/TCM)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Reprogram or replace control module", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0667', 'PCM/ECM/TCM Internal Temperature Sensor Range/Performance', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)", "Faulty control module (PCM/ECM/TCM)"]', '["Replace faulty sensor", "Reprogram or replace control module", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0668', 'PCM/ECM/TCM Internal Temperature Sensor Circuit Low', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)", "Faulty control module (PCM/ECM/TCM)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Reprogram or replace control module", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0669', 'PCM/ECM/TCM Internal Temperature Sensor Circuit High', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)", "Faulty control module (PCM/ECM/TCM)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Reprogram or replace control module", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P066A', '1 Glow Plug Control Circuit Low', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P066C', '2 Glow Plug Control Circuit Low', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P066F', '3 Glow Plug Control Circuit High', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0670', 'Glow Plug Module Control Circuit', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty control module (PCM/ECM/TCM)"]', '["Inspect and repair wiring harness and connectors", "Reprogram or replace control module", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0671', 'Cylinder 1 Glow Plug Circuit', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0672', 'Cylinder 2 Glow Plug Circuit', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0673', 'Cylinder 3 Glow Plug Circuit', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0674', 'Cylinder 4 Glow Plug Circuit', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0675', 'Cylinder 5 Glow Plug Circuit', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0676', 'Cylinder 6 Glow Plug Circuit', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0677', 'Cylinder 7 Glow Plug Circuit', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0678', 'Cylinder 8 Glow Plug Circuit', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0679', 'Cylinder 9 Glow Plug Circuit', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P067A', '4 Glow Plug Control Circuit Low', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P067B', '4 Glow Plug Control Circuit High ', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P067C', '5 Glow Plug Control Circuit Low', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P067D', '5 Glow Plug Control Circuit High', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P067E', '6 Glow Plug Control Circuit Low', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0680', 'Cylinder 10 Glow Plug Circuit', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0681', 'Cylinder 11 Glow Plug Circuit', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0682', 'Cylinder 12 Glow Plug Circuit', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0683', 'Glow Plug Control Module to PCM Communication Circuit', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty control module (PCM/ECM/TCM)"]', '["Inspect and repair wiring harness and connectors", "Reprogram or replace control module", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0684', 'Glow Plug Control Module to PCM Communication Circuit Range/Performance', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty control module (PCM/ECM/TCM)"]', '["Inspect and repair wiring harness and connectors", "Reprogram or replace control module", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0685', 'ECM/PCM Power Relay Control Circuit Open', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty control module (PCM/ECM/TCM)"]', '["Inspect and repair wiring harness and connectors", "Reprogram or replace control module", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0686', 'ECM/PCM Power Relay Control Circuit Low', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty control module (PCM/ECM/TCM)"]', '["Inspect and repair wiring harness and connectors", "Reprogram or replace control module", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0687', 'ECM/PCM Power Relay Control Circuit High', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty control module (PCM/ECM/TCM)"]', '["Inspect and repair wiring harness and connectors", "Reprogram or replace control module", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0688', 'ECM/PCM Power Relay Sense Circuit Open', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty control module (PCM/ECM/TCM)"]', '["Inspect and repair wiring harness and connectors", "Reprogram or replace control module", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0689', 'ECM/PCM Power Relay Sense Circuit Low', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty control module (PCM/ECM/TCM)"]', '["Inspect and repair wiring harness and connectors", "Reprogram or replace control module", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P068A/PCM', 'Power Relay De-Energized Performance - Too Early', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P068E', '8 Glow Plug Control Circuit Low', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0690', 'ECM/PCM Power Relay Sense Circuit High', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty control module (PCM/ECM/TCM)"]', '["Inspect and repair wiring harness and connectors", "Reprogram or replace control module", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0691', 'Fan 1 Control Circuit Low', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0692', 'Fan 1 Control Circuit High', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0693', 'Fan 2 Control Circuit Low', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0694', 'Fan 2 Control Circuit High', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0695', 'Fan 3 Control Circuit Low', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0696', 'Fan 3 Control Circuit High', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0697', 'Sensor Reference VoltageCCircuit Open', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Battery warning light", "Charging system malfunction", "Dim lights"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0698', 'Sensor Reference VoltageCCircuit Low', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Battery warning light", "Charging system malfunction", "Dim lights"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0699', 'Sensor Reference VoltageCCircuit High', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Battery warning light", "Charging system malfunction", "Dim lights"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P069A', '9 Glow Plug Control Circuit Low ', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P069B', '9 Glow Plug Control Circuit High', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P069C', '10 Glow Plug Control Circuit Low', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P069D', '10 Glow Plug Control Circuit High', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P06A1', 'A/C Compressor Control Circuit Low', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P06A2', 'A/C Compressor Control Circuit High', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P06A3', 'Reference VoltageDCircuit Open', 4, '["Check Engine Light illuminated", "Battery warning light", "Charging system malfunction", "Dim lights"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P06A5', 'Reference VoltageDCircuit High', 4, '["Check Engine Light illuminated", "Battery warning light", "Charging system malfunction", "Dim lights"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P06A7', 'Reference VoltageBCircuit Range/Performance', 4, '["Check Engine Light illuminated", "Battery warning light", "Charging system malfunction", "Dim lights"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P06A8', 'Reference VoltageCCircuit Range/Performance', 4, '["Check Engine Light illuminated", "Battery warning light", "Charging system malfunction", "Dim lights"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P06A9', 'Reference VoltageDCircuit Range/Performance', 4, '["Check Engine Light illuminated", "Battery warning light", "Charging system malfunction", "Dim lights"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P06AA/ECM/TCM', 'Internal TemperatureBToo High', 4, '["Check Engine Light illuminated", "Temperature gauge fluctuation", "Poor heater output"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P06AF', 'Management System - Forced Engine Shutdown', 4, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P06B0', 'Power SupplyACircuit/Open', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P06B2', 'Power SupplyACircuit High', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P06B6', 'Control Module Knock Sensor Processor 1 Performance', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)", "Faulty control module (PCM/ECM/TCM)"]', '["Replace faulty sensor", "Reprogram or replace control module", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P06B8', 'Control Module Non-Volatile Random Access Memory (NVRAM) Error ', 4, '["Check Engine Light illuminated"]', '["Faulty control module (PCM/ECM/TCM)"]', '["Reprogram or replace control module", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P06B9', '1 Glow Plug Circuit Range/Performance', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P06BA', '2 Glow Plug Circuit Range/Performance', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P06BB', '3 Glow Plug Circuit Range/Performance ', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P06BC', '4 Glow Plug Circuit Range/Performance ', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P06BD', '5 Glow Plug Circuit Range/Performance', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P06BF', '7 Glow Plug Circuit Range/Performance', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P06C0', '8 Glow Plug Circuit Range/Performance ', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P06C1', '9 Glow Plug Circuit Range/Performance ', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P06C2', '10 Glow Plug Circuit Range/Performance', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P06C4', '12 Glow Plug Circuit Range/Performance', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P06C5', '1 Glow Plug Incorrect ', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P06C6', '2 Glow Plug Incorrect ', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P06C7', '3 Glow Plug Incorrect ', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P06C8', '4 Glow Plug Incorrect ', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P06C9', '5 Glow Plug Incorrect ', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P06CA', '6 Glow Plug Incorrect', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P06CB', '7 Glow Plug Incorrect', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P06CC', '8 Glow Plug Incorrect', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P06CD', '9 Glow Plug Incorrect ', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P06CE', '10 Glow Plug Incorrect', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P06D0', '12 Glow Plug Incorrect ', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P06D1', 'Control Module Ignition Coil Control Performance', 4, '["Check Engine Light illuminated", "Engine misfire/rough running", "Flashing Check Engine Light", "Loss of power"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty control module (PCM/ECM/TCM)"]', '["Reprogram or replace control module", "Clear DTC and verify repair with test drive"]', 400, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0700', 'Transmission Control System Malfunction', 4, '["Check Engine Light on", "Transmission warning light", "Harsh or delayed shifting", "Transmission stuck in one gear", "Limp mode"]', '["Transmission control system fault (generic - read TCM codes)", "Low transmission fluid", "Faulty shift solenoids", "TCM fault"]', '["Check transmission fluid level and condition", "Scan TCM for specific codes", "Service transmission (fluid and filter change)", "Replace faulty solenoids", "Replace TCM if needed"]', 150, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0701', 'Transmission Control System Range/Performance', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0702', 'Transmission Control System Electrical', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0703', 'Torque Converter/Brake Switch B Circuit Malfunction', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode", "ABS warning light", "Brake system warning"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0704', 'Clutch Switch Input Circuit Malfunction', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0705', 'Transmission Range Sensor A Circuit malfunction (PRNDL Input)', 3, '["Check Engine Light on", "Harsh shifting", "Wrong gear display", "No-start condition", "Transmission limp mode"]', '["Faulty transmission range sensor (neutral safety switch)", "Misadjusted shift linkage", "Wiring damage", "TCM fault"]', '["Replace transmission range sensor", "Adjust shift linkage", "Repair wiring", "Check TCM"]', 150, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0706', 'Transmission Range Sensor A Circuit Range/Performance', 3, '["Check Engine Light on", "Harsh shifting", "Wrong gear display", "No-start condition", "Transmission limp mode"]', '["Faulty transmission range sensor (neutral safety switch)", "Misadjusted shift linkage", "Wiring damage", "TCM fault"]', '["Replace transmission range sensor", "Adjust shift linkage", "Repair wiring", "Check TCM"]', 150, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0707', 'Transmission Range Sensor A Circuit Low Input', 3, '["Check Engine Light on", "Harsh shifting", "Wrong gear display", "No-start condition", "Transmission limp mode"]', '["Faulty transmission range sensor (neutral safety switch)", "Misadjusted shift linkage", "Wiring damage", "TCM fault"]', '["Replace transmission range sensor", "Adjust shift linkage", "Repair wiring", "Check TCM"]', 150, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0708', 'Transmission Range Sensor A Circuit High Input', 3, '["Check Engine Light on", "Harsh shifting", "Wrong gear display", "No-start condition", "Transmission limp mode"]', '["Faulty transmission range sensor (neutral safety switch)", "Misadjusted shift linkage", "Wiring damage", "TCM fault"]', '["Replace transmission range sensor", "Adjust shift linkage", "Repair wiring", "Check TCM"]', 150, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0709', 'Transmission Range Sensor A Circuit Intermittent', 3, '["Check Engine Light on", "Harsh shifting", "Wrong gear display", "No-start condition", "Transmission limp mode"]', '["Faulty transmission range sensor (neutral safety switch)", "Misadjusted shift linkage", "Wiring damage", "TCM fault"]', '["Replace transmission range sensor", "Adjust shift linkage", "Repair wiring", "Check TCM"]', 150, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P070A', 'Transmission Fluid Level Sensor Circuit', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P070B', 'Transmission Fluid Level Sensor Circuit Range/Performance', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P070C', 'Transmission Fluid Level Sensor Circuit Low', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P070D', 'Transmission Fluid Level Sensor Circuit High', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P070E', 'Transmission Fluid Level Sensor Circuit intermittent/Erratic', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P070F', 'Transmission Fluid Level Too Low', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0710', 'Transmission Fluid Temperature Sensor A Circuit Malfunction', 3, '["Check Engine Light on", "Harsh shifting", "Slipping transmission", "Poor fuel economy"]', '["Faulty transmission fluid temperature sensor", "Low transmission fluid", "Wiring damage", "TCM/PCM fault"]', '["Replace transmission fluid temperature sensor", "Check and fill transmission fluid", "Repair wiring", "Check TCM"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0711', 'Transmission Fluid Temperature Sensor A Circuit Range/Performance', 3, '["Check Engine Light on", "Harsh shifting", "Slipping transmission", "Poor fuel economy"]', '["Faulty transmission fluid temperature sensor", "Low transmission fluid", "Wiring damage", "TCM/PCM fault"]', '["Replace transmission fluid temperature sensor", "Check and fill transmission fluid", "Repair wiring", "Check TCM"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0712', 'Transmission Fluid Temperature Sensor A Circuit Low Input', 3, '["Check Engine Light on", "Harsh shifting", "Slipping transmission", "Poor fuel economy"]', '["Faulty transmission fluid temperature sensor", "Low transmission fluid", "Wiring damage", "TCM/PCM fault"]', '["Replace transmission fluid temperature sensor", "Check and fill transmission fluid", "Repair wiring", "Check TCM"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0713', 'Transmission Fluid Temperature Sensor A Circuit High Input', 3, '["Check Engine Light on", "Harsh shifting", "Slipping transmission", "Poor fuel economy"]', '["Faulty transmission fluid temperature sensor", "Low transmission fluid", "Wiring damage", "TCM/PCM fault"]', '["Replace transmission fluid temperature sensor", "Check and fill transmission fluid", "Repair wiring", "Check TCM"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0714', 'Transmission Fluid Temperature Sensor A Circuit Intermittent', 3, '["Check Engine Light on", "Harsh shifting", "Slipping transmission", "Poor fuel economy"]', '["Faulty transmission fluid temperature sensor", "Low transmission fluid", "Wiring damage", "TCM/PCM fault"]', '["Replace transmission fluid temperature sensor", "Check and fill transmission fluid", "Repair wiring", "Check TCM"]', 150, 600)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0715', 'Input/Turbine Speed Sensor A Circuit Malfunction', 3, '["Check Engine Light on", "Harsh or erratic shifting", "TCC lockup issues", "Transmission slip"]', '["Faulty input/turbine speed sensor", "Dirty transmission fluid", "Wiring damage", "Internal transmission damage"]', '["Replace input speed sensor", "Service transmission fluid and filter", "Repair wiring", "Internal transmission inspection if persistent"]', 150, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0716', 'Input/Turbine Speed Sensor A Circuit Range/Performance', 3, '["Check Engine Light on", "Harsh or erratic shifting", "TCC lockup issues", "Transmission slip"]', '["Faulty input/turbine speed sensor", "Dirty transmission fluid", "Wiring damage", "Internal transmission damage"]', '["Replace input speed sensor", "Service transmission fluid and filter", "Repair wiring", "Internal transmission inspection if persistent"]', 150, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0717', 'Input/Turbine Speed Sensor A Circuit No Signal', 3, '["Check Engine Light on", "Harsh or erratic shifting", "TCC lockup issues", "Transmission slip"]', '["Faulty input/turbine speed sensor", "Dirty transmission fluid", "Wiring damage", "Internal transmission damage"]', '["Replace input speed sensor", "Service transmission fluid and filter", "Repair wiring", "Internal transmission inspection if persistent"]', 150, 800)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0718', 'Input/Turbine Speed Sensor A Circuit Intermittent', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0719', 'Torque Converter/Brake Switch B Circuit Low', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode", "ABS warning light", "Brake system warning"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P071A', 'Transmission Mode SwitchACircuit', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P071B', 'Transmission Mode SwitchACircuit Low', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P071C', 'Transmission Mode SwitchACircuit High', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P071D', 'Transmission Mode SwitchBCircuit', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P071E', 'Transmission Mode SwitchBCircuit Low', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P071F', 'Transmission Mode SwitchBCircuit High', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0720', 'Output Speed Sensor Circuit Malfunction', 3, '["Check Engine Light on", "Speedometer not working", "Harsh shifting", "ABS light on"]', '["Faulty output speed sensor (OSS)", "Damaged wiring", "Damaged reluctor ring", "TCM/PCM fault"]', '["Replace output speed sensor", "Repair wiring", "Replace reluctor ring", "Check TCM/PCM"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0721', 'Output Speed Sensor Range/Performance', 3, '["Check Engine Light on", "Speedometer not working", "Harsh shifting", "ABS light on"]', '["Faulty output speed sensor (OSS)", "Damaged wiring", "Damaged reluctor ring", "TCM/PCM fault"]', '["Replace output speed sensor", "Repair wiring", "Replace reluctor ring", "Check TCM/PCM"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0722', 'Output Speed Sensor No Signal', 3, '["Check Engine Light on", "Speedometer not working", "Harsh shifting", "ABS light on"]', '["Faulty output speed sensor (OSS)", "Damaged wiring", "Damaged reluctor ring", "TCM/PCM fault"]', '["Replace output speed sensor", "Repair wiring", "Replace reluctor ring", "Check TCM/PCM"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0723', 'Output Speed Sensor Intermittent', 3, '["Check Engine Light on", "Speedometer not working", "Harsh shifting", "ABS light on"]', '["Faulty output speed sensor (OSS)", "Damaged wiring", "Damaged reluctor ring", "TCM/PCM fault"]', '["Replace output speed sensor", "Repair wiring", "Replace reluctor ring", "Check TCM/PCM"]', 100, 500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0724', 'Torque Converter/Brake Switch B Circuit High', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode", "ABS warning light", "Brake system warning"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0725', 'Engine Speed input Circuit Malfunction', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0726', 'Engine Speed Input Circuit Range/Performance', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0727', 'Engine Speed Input Circuit No Signal', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0728', 'Engine Speed Input Circuit Intermittent', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0729', 'Gear 6 Incorrect Ratio', 4, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P072A', 'Stuck in Neutral', 4, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P072B', 'Stuck In Reverse', 4, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P072C', 'Stuck in Gear 1', 4, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P072D', 'Stuck in Gear 2', 4, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P072E', 'Stuck in Gear 3', 4, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P072F', 'Stuck in Gear 4', 4, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0730', 'Incorrect Gear Ratio', 4, '["Check Engine Light on", "Transmission slipping in specific gear", "Harsh engagement", "Delayed gear change", "Engine revs high without acceleration"]', '["Low or dirty transmission fluid", "Faulty shift solenoid", "Worn clutch packs/bands", "Valve body issues", "Internal transmission damage"]', '["Check and service transmission fluid", "Replace shift solenoid(s)", "Rebuild or replace valve body", "Full transmission rebuild or replacement"]', 200, 5000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0731', 'Gear I Incorrect ratio', 4, '["Check Engine Light on", "Transmission slipping in specific gear", "Harsh engagement", "Delayed gear change", "Engine revs high without acceleration"]', '["Low or dirty transmission fluid", "Faulty shift solenoid", "Worn clutch packs/bands", "Valve body issues", "Internal transmission damage"]', '["Check and service transmission fluid", "Replace shift solenoid(s)", "Rebuild or replace valve body", "Full transmission rebuild or replacement"]', 200, 5000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0732', 'Gear 2 Incorrect ratio', 4, '["Check Engine Light on", "Transmission slipping in specific gear", "Harsh engagement", "Delayed gear change", "Engine revs high without acceleration"]', '["Low or dirty transmission fluid", "Faulty shift solenoid", "Worn clutch packs/bands", "Valve body issues", "Internal transmission damage"]', '["Check and service transmission fluid", "Replace shift solenoid(s)", "Rebuild or replace valve body", "Full transmission rebuild or replacement"]', 200, 5000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0733', 'Gear 3 Incorrect ratio', 4, '["Check Engine Light on", "Transmission slipping in specific gear", "Harsh engagement", "Delayed gear change", "Engine revs high without acceleration"]', '["Low or dirty transmission fluid", "Faulty shift solenoid", "Worn clutch packs/bands", "Valve body issues", "Internal transmission damage"]', '["Check and service transmission fluid", "Replace shift solenoid(s)", "Rebuild or replace valve body", "Full transmission rebuild or replacement"]', 200, 5000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0734', 'Gear 4 Incorrect ratio', 4, '["Check Engine Light on", "Transmission slipping in specific gear", "Harsh engagement", "Delayed gear change", "Engine revs high without acceleration"]', '["Low or dirty transmission fluid", "Faulty shift solenoid", "Worn clutch packs/bands", "Valve body issues", "Internal transmission damage"]', '["Check and service transmission fluid", "Replace shift solenoid(s)", "Rebuild or replace valve body", "Full transmission rebuild or replacement"]', 200, 5000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0735', 'Gear 5 Incorrect ratio', 4, '["Check Engine Light on", "Transmission slipping in specific gear", "Harsh engagement", "Delayed gear change", "Engine revs high without acceleration"]', '["Low or dirty transmission fluid", "Faulty shift solenoid", "Worn clutch packs/bands", "Valve body issues", "Internal transmission damage"]', '["Check and service transmission fluid", "Replace shift solenoid(s)", "Rebuild or replace valve body", "Full transmission rebuild or replacement"]', 200, 5000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0736', 'Reverse incorrect gear ratio', 4, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0737', 'TCM Engine Speed Output Circuit', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty control module (PCM/ECM/TCM)"]', '["Inspect and repair wiring harness and connectors", "Reprogram or replace control module", "Clear DTC and verify repair with test drive"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0738', 'TCM Engine Speed Output Circuit Low', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty control module (PCM/ECM/TCM)"]', '["Inspect and repair wiring harness and connectors", "Reprogram or replace control module", "Clear DTC and verify repair with test drive"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0739', 'TCM Engine Speed Output Circuit High', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty control module (PCM/ECM/TCM)"]', '["Inspect and repair wiring harness and connectors", "Reprogram or replace control module", "Clear DTC and verify repair with test drive"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P073A', 'Stuck in Gear 5', 4, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P073B', 'Stuck in Gear 6', 4, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P073C', 'Stuck in Gear 7', 4, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P073D', 'Unable to Engage Neutral', 4, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P073E', 'Unable to Engage Reverse', 4, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P073F', 'Unable to Engage Gear 1', 4, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0740', 'Torque Converter Clutch Circuit Malfunction', 3, '["Check Engine Light on", "Engine stall when stopping", "Poor fuel economy", "Transmission overheating", "Shudder at highway speeds"]', '["Faulty torque converter clutch (TCC) solenoid", "Stuck TCC", "Low transmission fluid", "Valve body issue", "Worn torque converter"]', '["Replace TCC solenoid", "Service transmission fluid", "Replace valve body", "Replace torque converter", "Inspect transmission for debris"]', 300, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0741', 'Torque Converter Clutch Circuit Performance or Stuck Off', 3, '["Check Engine Light on", "Engine stall when stopping", "Poor fuel economy", "Transmission overheating", "Shudder at highway speeds"]', '["Faulty torque converter clutch (TCC) solenoid", "Stuck TCC", "Low transmission fluid", "Valve body issue", "Worn torque converter"]', '["Replace TCC solenoid", "Service transmission fluid", "Replace valve body", "Replace torque converter", "Inspect transmission for debris"]', 300, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0742', 'Torque Converter Clutch Circuit Stock On', 3, '["Check Engine Light on", "Engine stall when stopping", "Poor fuel economy", "Transmission overheating", "Shudder at highway speeds"]', '["Faulty torque converter clutch (TCC) solenoid", "Stuck TCC", "Low transmission fluid", "Valve body issue", "Worn torque converter"]', '["Replace TCC solenoid", "Service transmission fluid", "Replace valve body", "Replace torque converter", "Inspect transmission for debris"]', 300, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0743', 'Torque Converter Clutch Circuit Electrical', 3, '["Check Engine Light on", "Engine stall when stopping", "Poor fuel economy", "Transmission overheating", "Shudder at highway speeds"]', '["Faulty torque converter clutch (TCC) solenoid", "Stuck TCC", "Low transmission fluid", "Valve body issue", "Worn torque converter"]', '["Replace TCC solenoid", "Service transmission fluid", "Replace valve body", "Replace torque converter", "Inspect transmission for debris"]', 300, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0744', 'Torque Converter Clutch Circuit Intermittent', 3, '["Check Engine Light on", "Engine stall when stopping", "Poor fuel economy", "Transmission overheating", "Shudder at highway speeds"]', '["Faulty torque converter clutch (TCC) solenoid", "Stuck TCC", "Low transmission fluid", "Valve body issue", "Worn torque converter"]', '["Replace TCC solenoid", "Service transmission fluid", "Replace valve body", "Replace torque converter", "Inspect transmission for debris"]', 300, 2500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0745', 'Pressure Control Solenoid A Malfunction', 4, '["Check Engine Light on", "Harsh or delayed shifting", "Transmission slip", "Limp mode"]', '["Faulty pressure control solenoid", "Low/dirty transmission fluid", "Wiring damage", "Valve body issue"]', '["Replace pressure control solenoid", "Service transmission fluid", "Repair wiring", "Rebuild valve body"]', 250, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0746', 'Pressure Control Solenoid A Performance or Stuck Off', 4, '["Check Engine Light on", "Harsh or delayed shifting", "Transmission slip", "Limp mode"]', '["Faulty pressure control solenoid", "Low/dirty transmission fluid", "Wiring damage", "Valve body issue"]', '["Replace pressure control solenoid", "Service transmission fluid", "Repair wiring", "Rebuild valve body"]', 250, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0747', 'Pressure Control Solenoid A Stuck On', 4, '["Check Engine Light on", "Harsh or delayed shifting", "Transmission slip", "Limp mode"]', '["Faulty pressure control solenoid", "Low/dirty transmission fluid", "Wiring damage", "Valve body issue"]', '["Replace pressure control solenoid", "Service transmission fluid", "Repair wiring", "Rebuild valve body"]', 250, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0748', 'Pressure Control Solenoid A Electrical', 4, '["Check Engine Light on", "Harsh or delayed shifting", "Transmission slip", "Limp mode"]', '["Faulty pressure control solenoid", "Low/dirty transmission fluid", "Wiring damage", "Valve body issue"]', '["Replace pressure control solenoid", "Service transmission fluid", "Repair wiring", "Rebuild valve body"]', 250, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0749', 'Pressure Control Solenoid A Intermittent', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Failed or stuck valve/solenoid/actuator"]', '["Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P074A', 'Unable To Engage Gear 2', 4, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P074B', 'Unable To Engage Gear 3', 4, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P074C', 'Unable To Engage Gear 4', 4, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P074D', 'Unable To Engage Gear 5', 4, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P074E', 'Unable To Engage Gear 6', 4, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P074F', 'Unable To Engage Gear 7', 4, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0750', 'Shift Solenoid A Malfunction', 4, '["Check Engine Light on", "Harsh or delayed shifting", "Missing gears", "Transmission limp mode"]', '["Faulty shift solenoid", "Dirty transmission fluid", "Internal transmission wear", "Valve body issue", "Wiring damage"]', '["Replace shift solenoid for affected gear", "Service transmission fluid and filter", "Inspect valve body", "Transmission rebuild if internal wear found"]', 250, 3500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0751', 'Shift Solenoid A Performance or Stuck Off', 4, '["Check Engine Light on", "Harsh or delayed shifting", "Missing gears", "Transmission limp mode"]', '["Faulty shift solenoid", "Dirty transmission fluid", "Internal transmission wear", "Valve body issue", "Wiring damage"]', '["Replace shift solenoid for affected gear", "Service transmission fluid and filter", "Inspect valve body", "Transmission rebuild if internal wear found"]', 250, 3500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0752', 'Shift Solenoid A Stuck On', 4, '["Check Engine Light on", "Harsh or delayed shifting", "Missing gears", "Transmission limp mode"]', '["Faulty shift solenoid", "Dirty transmission fluid", "Internal transmission wear", "Valve body issue", "Wiring damage"]', '["Replace shift solenoid for affected gear", "Service transmission fluid and filter", "Inspect valve body", "Transmission rebuild if internal wear found"]', 250, 3500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0753', 'Shift Solenoid A Electrical', 4, '["Check Engine Light on", "Harsh or delayed shifting", "Missing gears", "Transmission limp mode"]', '["Faulty shift solenoid", "Dirty transmission fluid", "Internal transmission wear", "Valve body issue", "Wiring damage"]', '["Replace shift solenoid for affected gear", "Service transmission fluid and filter", "Inspect valve body", "Transmission rebuild if internal wear found"]', 250, 3500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0754', 'Shift Solenoid A Intermittent', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Failed or stuck valve/solenoid/actuator"]', '["Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0755', 'Shift Solenoid B Malfunction', 4, '["Check Engine Light on", "Harsh or delayed shifting", "Missing gears", "Transmission limp mode"]', '["Faulty shift solenoid", "Dirty transmission fluid", "Internal transmission wear", "Valve body issue", "Wiring damage"]', '["Replace shift solenoid for affected gear", "Service transmission fluid and filter", "Inspect valve body", "Transmission rebuild if internal wear found"]', 250, 3500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0756', 'Shift Solenoid B Performance or Stock Off', 4, '["Check Engine Light on", "Harsh or delayed shifting", "Missing gears", "Transmission limp mode"]', '["Faulty shift solenoid", "Dirty transmission fluid", "Internal transmission wear", "Valve body issue", "Wiring damage"]', '["Replace shift solenoid for affected gear", "Service transmission fluid and filter", "Inspect valve body", "Transmission rebuild if internal wear found"]', 250, 3500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0757', 'Shift Solenoid B Stuck On', 4, '["Check Engine Light on", "Harsh or delayed shifting", "Missing gears", "Transmission limp mode"]', '["Faulty shift solenoid", "Dirty transmission fluid", "Internal transmission wear", "Valve body issue", "Wiring damage"]', '["Replace shift solenoid for affected gear", "Service transmission fluid and filter", "Inspect valve body", "Transmission rebuild if internal wear found"]', 250, 3500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0758', 'Shift Solenoid B Electrical', 4, '["Check Engine Light on", "Harsh or delayed shifting", "Missing gears", "Transmission limp mode"]', '["Faulty shift solenoid", "Dirty transmission fluid", "Internal transmission wear", "Valve body issue", "Wiring damage"]', '["Replace shift solenoid for affected gear", "Service transmission fluid and filter", "Inspect valve body", "Transmission rebuild if internal wear found"]', 250, 3500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0759', 'Shift Solenoid B Intermittent', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Failed or stuck valve/solenoid/actuator"]', '["Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P075A', 'Shift Solenoid G Malfunction', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Failed or stuck valve/solenoid/actuator"]', '["Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P075B', 'Shift Solenoid G Performance/Stuck Off', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit", "Failed or stuck valve/solenoid/actuator"]', '["Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P075C', 'Shift Solenoid G Stuck On', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Failed or stuck valve/solenoid/actuator"]', '["Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P075D', 'Shift Solenoid G Electrical', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Failed or stuck valve/solenoid/actuator"]', '["Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P075E', 'Shift Solenoid G Intermittent', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Failed or stuck valve/solenoid/actuator"]', '["Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P075F', 'Transmission Fluid Level Too High', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0760', 'Shift Solenoid C Malfunction', 4, '["Check Engine Light on", "Harsh or delayed shifting", "Missing gears", "Transmission limp mode"]', '["Faulty shift solenoid", "Dirty transmission fluid", "Internal transmission wear", "Valve body issue", "Wiring damage"]', '["Replace shift solenoid for affected gear", "Service transmission fluid and filter", "Inspect valve body", "Transmission rebuild if internal wear found"]', 250, 3500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0761', 'Shift Solenoid C Performance or Stuck Off', 4, '["Check Engine Light on", "Harsh or delayed shifting", "Missing gears", "Transmission limp mode"]', '["Faulty shift solenoid", "Dirty transmission fluid", "Internal transmission wear", "Valve body issue", "Wiring damage"]', '["Replace shift solenoid for affected gear", "Service transmission fluid and filter", "Inspect valve body", "Transmission rebuild if internal wear found"]', 250, 3500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0762', 'Shift Solenoid C Stuck On', 4, '["Check Engine Light on", "Harsh or delayed shifting", "Missing gears", "Transmission limp mode"]', '["Faulty shift solenoid", "Dirty transmission fluid", "Internal transmission wear", "Valve body issue", "Wiring damage"]', '["Replace shift solenoid for affected gear", "Service transmission fluid and filter", "Inspect valve body", "Transmission rebuild if internal wear found"]', 250, 3500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0763', 'Shift Solenoid C Electrical', 4, '["Check Engine Light on", "Harsh or delayed shifting", "Missing gears", "Transmission limp mode"]', '["Faulty shift solenoid", "Dirty transmission fluid", "Internal transmission wear", "Valve body issue", "Wiring damage"]', '["Replace shift solenoid for affected gear", "Service transmission fluid and filter", "Inspect valve body", "Transmission rebuild if internal wear found"]', 250, 3500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0764', 'Shift Solenoid C Intermittent', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Failed or stuck valve/solenoid/actuator"]', '["Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0765', 'Shift Solenoid D Malfunction', 4, '["Check Engine Light on", "Harsh or delayed shifting", "Missing gears", "Transmission limp mode"]', '["Faulty shift solenoid", "Dirty transmission fluid", "Internal transmission wear", "Valve body issue", "Wiring damage"]', '["Replace shift solenoid for affected gear", "Service transmission fluid and filter", "Inspect valve body", "Transmission rebuild if internal wear found"]', 250, 3500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0766', 'Shift Solenoid D Performance or Stuck Off', 4, '["Check Engine Light on", "Harsh or delayed shifting", "Missing gears", "Transmission limp mode"]', '["Faulty shift solenoid", "Dirty transmission fluid", "Internal transmission wear", "Valve body issue", "Wiring damage"]', '["Replace shift solenoid for affected gear", "Service transmission fluid and filter", "Inspect valve body", "Transmission rebuild if internal wear found"]', 250, 3500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0767', 'Shift Solenoid D Stuck On', 4, '["Check Engine Light on", "Harsh or delayed shifting", "Missing gears", "Transmission limp mode"]', '["Faulty shift solenoid", "Dirty transmission fluid", "Internal transmission wear", "Valve body issue", "Wiring damage"]', '["Replace shift solenoid for affected gear", "Service transmission fluid and filter", "Inspect valve body", "Transmission rebuild if internal wear found"]', 250, 3500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0768', 'Shift Solenoid D Electrical', 4, '["Check Engine Light on", "Harsh or delayed shifting", "Missing gears", "Transmission limp mode"]', '["Faulty shift solenoid", "Dirty transmission fluid", "Internal transmission wear", "Valve body issue", "Wiring damage"]', '["Replace shift solenoid for affected gear", "Service transmission fluid and filter", "Inspect valve body", "Transmission rebuild if internal wear found"]', 250, 3500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0769', 'Shift Solenoid D Intermittent', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Failed or stuck valve/solenoid/actuator"]', '["Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P076A', 'Shift Solenoid H Malfunction', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Failed or stuck valve/solenoid/actuator"]', '["Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P076B', 'Shift Solenoid H Performance/Stuck Off', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit", "Failed or stuck valve/solenoid/actuator"]', '["Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P076C', 'Shift Solenoid H Stuck On', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Failed or stuck valve/solenoid/actuator"]', '["Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P076D', 'Shift Solenoid H Electrical', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Failed or stuck valve/solenoid/actuator"]', '["Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P076E', 'Shift Solenoid H Intermittent', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Failed or stuck valve/solenoid/actuator"]', '["Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P076F', 'Gear 7 Incorrect Ratio', 4, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0770', 'Shift Solenoid E Malfunction', 4, '["Check Engine Light on", "Harsh or delayed shifting", "Missing gears", "Transmission limp mode"]', '["Faulty shift solenoid", "Dirty transmission fluid", "Internal transmission wear", "Valve body issue", "Wiring damage"]', '["Replace shift solenoid for affected gear", "Service transmission fluid and filter", "Inspect valve body", "Transmission rebuild if internal wear found"]', 250, 3500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0771', 'Shift Solenoid E Performance or Stuck Off', 4, '["Check Engine Light on", "Harsh or delayed shifting", "Missing gears", "Transmission limp mode"]', '["Faulty shift solenoid", "Dirty transmission fluid", "Internal transmission wear", "Valve body issue", "Wiring damage"]', '["Replace shift solenoid for affected gear", "Service transmission fluid and filter", "Inspect valve body", "Transmission rebuild if internal wear found"]', 250, 3500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0772', 'Shift Solenoid E Stuck On', 4, '["Check Engine Light on", "Harsh or delayed shifting", "Missing gears", "Transmission limp mode"]', '["Faulty shift solenoid", "Dirty transmission fluid", "Internal transmission wear", "Valve body issue", "Wiring damage"]', '["Replace shift solenoid for affected gear", "Service transmission fluid and filter", "Inspect valve body", "Transmission rebuild if internal wear found"]', 250, 3500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0773', 'Shift Solenoid E Electrical', 4, '["Check Engine Light on", "Harsh or delayed shifting", "Missing gears", "Transmission limp mode"]', '["Faulty shift solenoid", "Dirty transmission fluid", "Internal transmission wear", "Valve body issue", "Wiring damage"]', '["Replace shift solenoid for affected gear", "Service transmission fluid and filter", "Inspect valve body", "Transmission rebuild if internal wear found"]', 250, 3500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0774', 'Shift Solenoid E Intermittent', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Failed or stuck valve/solenoid/actuator"]', '["Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0775', 'Pressure Control Solenoid B Malfunction', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Failed or stuck valve/solenoid/actuator"]', '["Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0776', 'Pressure Control Solenoid B Performance or Stuck Off', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit", "Failed or stuck valve/solenoid/actuator"]', '["Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0777', 'Pressure Control Solenoid B Stuck On', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Failed or stuck valve/solenoid/actuator"]', '["Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0778', 'Pressure Control Solenoid B Electrical', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Failed or stuck valve/solenoid/actuator"]', '["Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0779', 'Pressure Control Solenoid B Intermittent', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Failed or stuck valve/solenoid/actuator"]', '["Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P077A', 'Speed Sensor Circuit - Loss of Direction Signal', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P077B', 'Speed Sensor Circuit - Direction Error', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P077C,', 'P077D, P077E, P077F ISO/SAE Reserved', 4, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0780', 'Shift Malfunction', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0781', '1-2 Shift Malfunction', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0782', '2-3 Shift Malfunction', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0783', '3-4 Shift Malfunction', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0784', '4-5 Shift Malfunction', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0785', 'Shift Timing Solenoid A Malfunction', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Harsh or delayed shifting", "Transmission slippage"]', '["Failed or stuck valve/solenoid/actuator"]', '["Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0786', 'Shift Timing Solenoid A Range/Performance', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Harsh or delayed shifting", "Transmission slippage"]', '["Damaged, corroded, or shorted wiring in related circuit", "Failed or stuck valve/solenoid/actuator"]', '["Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0787', 'Shift Timing Solenoid A Low', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Harsh or delayed shifting", "Transmission slippage"]', '["Damaged, corroded, or shorted wiring in related circuit", "Failed or stuck valve/solenoid/actuator"]', '["Inspect and repair wiring harness and connectors", "Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0788', 'Shift Timing Solenoid A High', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Harsh or delayed shifting", "Transmission slippage"]', '["Damaged, corroded, or shorted wiring in related circuit", "Failed or stuck valve/solenoid/actuator"]', '["Inspect and repair wiring harness and connectors", "Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0789', 'Shift Timing Solenoid A Intermittent', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Harsh or delayed shifting", "Transmission slippage"]', '["Failed or stuck valve/solenoid/actuator"]', '["Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P078A', 'Shift Timing Solenoid B Malfunction', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Harsh or delayed shifting", "Transmission slippage"]', '["Failed or stuck valve/solenoid/actuator"]', '["Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P078B', 'Shift Timing Solenoid B Range/Performance', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Harsh or delayed shifting", "Transmission slippage"]', '["Damaged, corroded, or shorted wiring in related circuit", "Failed or stuck valve/solenoid/actuator"]', '["Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P078C', 'Shift Timing Solenoid B Low', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Harsh or delayed shifting", "Transmission slippage"]', '["Damaged, corroded, or shorted wiring in related circuit", "Failed or stuck valve/solenoid/actuator"]', '["Inspect and repair wiring harness and connectors", "Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P078D', 'Shift Timing Solenoid B High', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Harsh or delayed shifting", "Transmission slippage"]', '["Damaged, corroded, or shorted wiring in related circuit", "Failed or stuck valve/solenoid/actuator"]', '["Inspect and repair wiring harness and connectors", "Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P078E', 'Shift Timing Solenoid B Intermittent', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Harsh or delayed shifting", "Transmission slippage"]', '["Failed or stuck valve/solenoid/actuator"]', '["Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P078F', 'ISO/SAE Reserved', 4, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0790', 'Normal/Performance Switch Circuit Malfunction', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0791', 'Intermediate Shaft Speed Sensor A Circuit', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0792', 'Intermediate Shaft Speed Sensor A Circuit Range/Performance', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0793', 'Intermediate Shaft Speed Sensor A Circuit No Signal', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0794', 'Intermediate Shaft Speed Sensor A Circuit Intermittent', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0795', 'Pressure Control Solenoid C Malfunction', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Failed or stuck valve/solenoid/actuator"]', '["Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0796', 'Pressure Control Solenoid C Performance or Stuck off', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit", "Failed or stuck valve/solenoid/actuator"]', '["Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0797', 'Pressure Control Solenoid C Stuck On', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Failed or stuck valve/solenoid/actuator"]', '["Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0798', 'Pressure Control Solenoid C Electrical', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Failed or stuck valve/solenoid/actuator"]', '["Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0799', 'Pressure Control Solenoid C Intermittent', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Failed or stuck valve/solenoid/actuator"]', '["Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P079A', 'Transmission Friction ElementASlip Detected', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P079B', 'Transmission Friction ElementBSlip Detected', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P079C', 'Transmission Friction ElementCSlip Detected', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P079D', 'Transmission Friction ElementDSlip Detected', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P079E', 'Transmission Friction ElementESlip Detected', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P079F', 'Transmission Friction ElementFSlip Detected', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P07A0', 'Transmission Friction ElementGSlip Detected', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P07A1', 'Transmission Friction ElementHSlip Detected', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P07A2', 'Transmission Friction ElementAPerformance/Stuck Off', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P07A3', 'Transmission Friction ElementAStuck On', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P07A4', 'Transmission Friction ElementBPerformance/Stuck Off', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P07A5', 'Transmission Friction ElementBStuck On', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P07A6', 'Transmission Friction ElementCPerformance/Stuck Off', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P07A7', 'Transmission Friction ElementCStuck On', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P07A8', 'Transmission Friction ElementDPerformance/Stuck Off', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P07A9', 'Transmission Friction ElementDStuck On', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P07AA', 'Transmission Friction ElementEPerformance/Stuck Off', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P07AB', 'Transmission Friction ElementEStuck On', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P07AC', 'Transmission Friction ElementFPerformance/Stuck Off', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P07AD', 'Transmission Friction ElementFStuck On', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P07AE', 'Transmission Friction ElementGPerformance/Stuck Off', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P07AF', 'Transmission Friction ElementGStuck On', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P07B0', 'Transmission Friction ElementHPerformance/Stuck Off', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P07B1', 'Transmission Friction ElementHStuck On', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P07B2', 'Transmission Park Position Sensor/SwitchACircuit Open', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P07B3', 'Transmission Park Position Sensor/SwitchACircuit Low', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P07B4', 'Transmission Park Position Sensor/SwitchACircuit High', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P07B5', 'Transmission Park Position Sensor/SwitchACircuit Performance/Low', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P07B6', 'Transmission Park Position Sensor/SwitchACircuit Performance High', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P07B7', 'Transmission Park Position Sensor/SwitchACircuit Intermittent/Erratic', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P07B8', 'Transmission Park Position Sensor/SwitchBCircuit Open', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P07B9', 'Transmission Park Position Sensor/SwitchBCircuit Low', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P07BA', 'Transmission Park Position Sensor/SwitchBCircuit High', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P07BB', 'Transmission Park Position Sensor/SwitchBCircuit Performance/Low', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P07BC', 'Transmission Park Position Sensor/SwitchBCircuit Performance High', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P07BD', 'Transmission Park Position Sensor/SwitchBCircuit Intermittent/Erratic', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P07BE', 'Transmission Park Position Sensor/SwitchA / BCorrelation', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Failed emissions test", "Poor fuel economy"]', '["Faulty sensor (internal failure)"]', '["Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P07BF', '- P07FF ISO/SAE Reserved ', 4, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 4000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0800', 'Transfer Case Control System (MIL Request)', 4, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0801', 'Reverse Inhibit Control Circuit Malfunction', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 200, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0802', 'Transmission Control System MIL Request Circuit/Open', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 200, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0803', '1-4 Upshift (Skip Shift) Solenoid Control Circuit Malfunction', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit", "Failed or stuck valve/solenoid/actuator"]', '["Inspect and repair wiring harness and connectors", "Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 200, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0804', '1-4 Upshift (Skip Shift) Lamp Control Circuit Malfunction', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 200, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0805', 'Clutch Position Sensor Circuit', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0806', 'Clutch Position Sensor Circuit Range/Performance', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0807', 'Clutch Position Sensor Circuit Low', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0808', 'Clutch Position Sensor Circuit High', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0809', 'Clutch Position Sensor Circuit Intermittent', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P080A', 'Clutch Position Not Learned', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Harsh or delayed shifting", "Transmission slippage"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P080E,', 'P080F ISO/SAE Reserved', 4, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0810', 'Clutch Position Control Error', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Harsh or delayed shifting", "Transmission slippage"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0811', 'Excessive Clutch Slippage', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0812', 'Reverse Input Circuit', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 200, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0813', 'Reverse Output Circuit', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 200, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0814', 'Transmission Range Display Circuit', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 200, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0815', 'Upshift Switch Circuit', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 200, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0816', 'Downshift Switch Circuit', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 200, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0817', 'Starter Disable Circuit', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 200, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0818', 'Driveline Disconnect Switch Input Circuit', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 200, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0819', 'Up and Down Shift Switch to Transmission Range Correlation', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P081A', 'Disable Circuit Low', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 200, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P081B', 'Disable Circuit High', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 200, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P081C', 'Input Circuit', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 200, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P081D', 'Neutral Input Circuit', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 200, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P081E', 'Excessive ClutchBSlippage', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P081F', 'Reserved', 4, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0829', '5-6 Shift Malfunction', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0830', 'Clutch Pedal SwitchACircuit', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode", "Erratic throttle response", "Reduced power/limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 200, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0831', 'Clutch Pedal SwitchACircuit Low', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode", "Erratic throttle response", "Reduced power/limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 200, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0832', 'Clutch Pedal SwitchACircuit High', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode", "Erratic throttle response", "Reduced power/limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 200, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0833', 'Clutch Pedal SwitchBCircuit', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode", "Erratic throttle response", "Reduced power/limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 200, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0834', 'Clutch Pedal SwitchBCircuit Low', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode", "Erratic throttle response", "Reduced power/limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 200, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0835', 'Clutch Pedal SwitchBCircuit High', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode", "Erratic throttle response", "Reduced power/limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 200, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0836', 'Four Wheel Drive (4WD) Switch Circuit', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 200, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0837', 'Four Wheel Drive (4WD) Switch Circuit Range/Performance', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 200, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0838', 'Four Wheel Drive (4WD) Switch Circuit Low', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 200, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0839', 'Four Wheel Drive (4WD) Switch Circuit High', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 200, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P083A', 'Transmission Fluid Pressure Sensor/SwitchGCircuit', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P083B', 'Transmission Fluid Pressure Sensor/SwitchGCircuit Range/Performance', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P083C', 'Transmission Fluid Pressure Sensor/SwitchGCircuit Low', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P083D', 'Transmission Fluid Pressure Sensor/SwitchGCircuit High', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P083E', 'Transmission Fluid Pressure Sensor/SwitchGCircuit Intermittent', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P083F', 'Clutch Pedal SwitchA / BCorrelation', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode", "Erratic throttle response", "Reduced power/limp mode"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0840', 'Transmission Fluid Pressure Sensor/SwitchACircuit', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0841', 'Transmission Fluid Pressure Sensor/SwitchACircuit Range/Performance', 3, '["Check Engine Light on", "Harsh shifting", "Delayed engagement", "Transmission slip"]', '["Faulty transmission fluid pressure sensor", "Low/dirty fluid", "Valve body issue", "Wiring damage"]', '["Replace transmission fluid pressure sensor", "Service transmission", "Repair/replace valve body", "Repair wiring"]', 200, 1200)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0842', 'Transmission Fluid Pressure Sensor/SwitchACircuit Low', 3, '["Check Engine Light on", "Harsh shifting", "Delayed engagement", "Transmission slip"]', '["Faulty transmission fluid pressure sensor", "Low/dirty fluid", "Valve body issue", "Wiring damage"]', '["Replace transmission fluid pressure sensor", "Service transmission", "Repair/replace valve body", "Repair wiring"]', 200, 1200)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0843', 'Transmission Fluid Pressure Sensor/SwitchACircuit High', 3, '["Check Engine Light on", "Harsh shifting", "Delayed engagement", "Transmission slip"]', '["Faulty transmission fluid pressure sensor", "Low/dirty fluid", "Valve body issue", "Wiring damage"]', '["Replace transmission fluid pressure sensor", "Service transmission", "Repair/replace valve body", "Repair wiring"]', 200, 1200)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0844', 'Transmission Fluid Pressure Sensor/SwitchACircuit Intermittent', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0845', 'Transmission Fluid Pressure Sensor/SwitchBCircuit', 3, '["Check Engine Light on", "Harsh shifting", "Delayed engagement", "Transmission slip"]', '["Faulty transmission fluid pressure sensor", "Low/dirty fluid", "Valve body issue", "Wiring damage"]', '["Replace transmission fluid pressure sensor", "Service transmission", "Repair/replace valve body", "Repair wiring"]', 200, 1200)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0846', 'Transmission Fluid Pressure Sensor/SwitchBCircuit Range/Performance', 3, '["Check Engine Light on", "Harsh shifting", "Delayed engagement", "Transmission slip"]', '["Faulty transmission fluid pressure sensor", "Low/dirty fluid", "Valve body issue", "Wiring damage"]', '["Replace transmission fluid pressure sensor", "Service transmission", "Repair/replace valve body", "Repair wiring"]', 200, 1200)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0847', 'Transmission Fluid Pressure Sensor/SwitchBCircuit Low', 3, '["Check Engine Light on", "Harsh shifting", "Delayed engagement", "Transmission slip"]', '["Faulty transmission fluid pressure sensor", "Low/dirty fluid", "Valve body issue", "Wiring damage"]', '["Replace transmission fluid pressure sensor", "Service transmission", "Repair/replace valve body", "Repair wiring"]', 200, 1200)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0848', 'Transmission Fluid Pressure Sensor/SwitchBCircuit High', 3, '["Check Engine Light on", "Harsh shifting", "Delayed engagement", "Transmission slip"]', '["Faulty transmission fluid pressure sensor", "Low/dirty fluid", "Valve body issue", "Wiring damage"]', '["Replace transmission fluid pressure sensor", "Service transmission", "Repair/replace valve body", "Repair wiring"]', 200, 1200)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0849', 'Transmission Fluid Pressure Sensor/SwitchBCircuit Intermittent', 3, '["Check Engine Light on", "Harsh shifting", "Delayed engagement", "Transmission slip"]', '["Faulty transmission fluid pressure sensor", "Low/dirty fluid", "Valve body issue", "Wiring damage"]', '["Replace transmission fluid pressure sensor", "Service transmission", "Repair/replace valve body", "Repair wiring"]', 200, 1200)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P084A', 'Transmission Fluid Pressure Sensor/SwitchHCircuit', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P084B', 'Transmission Fluid Pressure Sensor/SwitchHCircuit Range/Performance', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P084C', 'Transmission Fluid Pressure Sensor/SwitchHCircuit Low', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P084D', 'Transmission Fluid Pressure Sensor/SwitchHCircuit High', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P084E', 'Transmission Fluid Pressure Sensor/SwitchHCircuit Intermittent', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P085F', 'Reserved', 4, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0863', 'TCM Communication Circuit', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty control module (PCM/ECM/TCM)"]', '["Inspect and repair wiring harness and connectors", "Reprogram or replace control module", "Clear DTC and verify repair with test drive"]', 200, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0864', 'TCM Communication Circuit Range/Performance', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty control module (PCM/ECM/TCM)"]', '["Inspect and repair wiring harness and connectors", "Reprogram or replace control module", "Clear DTC and verify repair with test drive"]', 200, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0865', 'TCM Communication Circuit Low', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty control module (PCM/ECM/TCM)"]', '["Inspect and repair wiring harness and connectors", "Reprogram or replace control module", "Clear DTC and verify repair with test drive"]', 200, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0866', 'TCM Communication Circuit High', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty control module (PCM/ECM/TCM)"]', '["Inspect and repair wiring harness and connectors", "Reprogram or replace control module", "Clear DTC and verify repair with test drive"]', 200, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P086A', 'ISO/SAE Reserved', 4, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0870', 'Transmission Fluid Pressure Sensor/SwitchCCircuit', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0871', 'Transmission Fluid Pressure Sensor/SwitchCCircuit Range/Performance', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0872', 'Transmission Fluid Pressure Sensor/SwitchCCircuit Low', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0873', 'Transmission Fluid Pressure Sensor/SwitchCCircuit High', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0874', 'Transmission Fluid Pressure Sensor/SwitchCCircuit Intermittent', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0875', 'Transmission Fluid Pressure Sensor/SwitchDCircuit', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0876', 'Transmission Fluid Pressure Sensor/SwitchDCircuit Range/Performance', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0877', 'Transmission Fluid Pressure Sensor/SwitchDCircuit Low', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0878', 'Transmission Fluid Pressure Sensor/SwitchDCircuit High', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0879', 'Transmission Fluid Pressure Sensor/SwitchDCircuit Intermittent', 4, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P087A,', 'P087B, P087C, P087D, P087E, P087F ISO/SAE Reserved', 4, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0880', 'TCM Power Input Signal', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty control module (PCM/ECM/TCM)"]', '["Reprogram or replace control module", "Clear DTC and verify repair with test drive"]', 200, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0881', 'TCM Power Input Signal Range/Performance', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty control module (PCM/ECM/TCM)"]', '["Reprogram or replace control module", "Clear DTC and verify repair with test drive"]', 200, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0882', 'TCM Power Input Signal Low', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty control module (PCM/ECM/TCM)"]', '["Inspect and repair wiring harness and connectors", "Reprogram or replace control module", "Clear DTC and verify repair with test drive"]', 200, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0883', 'TCM Power Input Signal High', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty control module (PCM/ECM/TCM)"]', '["Inspect and repair wiring harness and connectors", "Reprogram or replace control module", "Clear DTC and verify repair with test drive"]', 200, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0884', 'TCM Power Input Signal Intermittent', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty control module (PCM/ECM/TCM)"]', '["Reprogram or replace control module", "Clear DTC and verify repair with test drive"]', 200, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0885', 'TCM Power Relay Control Circuit/Open', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty control module (PCM/ECM/TCM)"]', '["Inspect and repair wiring harness and connectors", "Reprogram or replace control module", "Clear DTC and verify repair with test drive"]', 200, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0886', 'TCM Power Relay Control Circuit Low', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty control module (PCM/ECM/TCM)"]', '["Inspect and repair wiring harness and connectors", "Reprogram or replace control module", "Clear DTC and verify repair with test drive"]', 200, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0887', 'TCM Power Relay Control Circuit High', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty control module (PCM/ECM/TCM)"]', '["Inspect and repair wiring harness and connectors", "Reprogram or replace control module", "Clear DTC and verify repair with test drive"]', 200, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0888', 'TCM Power Relay Sense Circuit', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty control module (PCM/ECM/TCM)"]', '["Inspect and repair wiring harness and connectors", "Reprogram or replace control module", "Clear DTC and verify repair with test drive"]', 200, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0889', 'TCM Power Relay Sense Circuit Range/Performance', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty control module (PCM/ECM/TCM)"]', '["Inspect and repair wiring harness and connectors", "Reprogram or replace control module", "Clear DTC and verify repair with test drive"]', 200, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P088C', 'ISO/SAE Reserved', 4, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0890', 'TCM Power Relay Sense Circuit Low', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty control module (PCM/ECM/TCM)"]', '["Inspect and repair wiring harness and connectors", "Reprogram or replace control module", "Clear DTC and verify repair with test drive"]', 200, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0891', 'TCM Power Relay Sense Circuit High', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty control module (PCM/ECM/TCM)"]', '["Inspect and repair wiring harness and connectors", "Reprogram or replace control module", "Clear DTC and verify repair with test drive"]', 200, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0892', 'TCM Power Relay Sense Circuit Intermittent', 4, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty control module (PCM/ECM/TCM)"]', '["Inspect and repair wiring harness and connectors", "Reprogram or replace control module", "Clear DTC and verify repair with test drive"]', 200, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0893', 'Multiple Gears Engaged', 4, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0894', 'Transmission Component Slipping', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0895', 'Shift Time Too Short', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0896', 'Shift Time Too Long', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P089A', 'P08FF ISO/SAE Reserved ', 4, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0900', 'Actuator Circuit/Open ', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit", "Failed or stuck valve/solenoid/actuator"]', '["Inspect and repair wiring harness and connectors", "Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 200, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0901', 'Actuator Circuit Range/Performance', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit", "Failed or stuck valve/solenoid/actuator"]', '["Inspect and repair wiring harness and connectors", "Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 200, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0902', 'Actuator Circuit Low', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit", "Failed or stuck valve/solenoid/actuator"]', '["Inspect and repair wiring harness and connectors", "Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 200, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P092E,', 'ISO/SAE Reserved', 3, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P095A', 'ISO/SAE Reserved ', 3, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0962', 'Control SolenoidAControl Circuit Low', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit", "Failed or stuck valve/solenoid/actuator"]', '["Inspect and repair wiring harness and connectors", "Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 200, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0963', 'Control SolenoidAControl Circuit High', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit", "Failed or stuck valve/solenoid/actuator"]', '["Inspect and repair wiring harness and connectors", "Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 200, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0964', 'Control SolenoidBControl Circuit/Open ', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit", "Failed or stuck valve/solenoid/actuator"]', '["Inspect and repair wiring harness and connectors", "Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 200, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0965', 'Control SolenoidBControl Circuit Range/Performance', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit", "Failed or stuck valve/solenoid/actuator"]', '["Inspect and repair wiring harness and connectors", "Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 200, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0966', 'Control SolenoidBControl Circuit Low', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit", "Failed or stuck valve/solenoid/actuator"]', '["Inspect and repair wiring harness and connectors", "Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 200, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0967', 'Control SolenoidBControl Circuit High', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit", "Failed or stuck valve/solenoid/actuator"]', '["Inspect and repair wiring harness and connectors", "Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 200, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0969', 'Control SolenoidCControl Circuit Range/Performance', 4, '["Check Engine Light illuminated", "Harsh or delayed shifting", "Transmission slippage", "Limp mode"]', '["Damaged, corroded, or shorted wiring in related circuit", "Failed or stuck valve/solenoid/actuator"]', '["Inspect and repair wiring harness and connectors", "Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 200, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P096A', 'ISO/SAE Reserved ', 3, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P097A', 'ISO/SAE Reserved', 3, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P098A', 'ISO/SAE Reserved', 3, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0993', 'Fluid Pressure Sensor/SwitchFCircuit Range/Performance', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0995', 'Fluid Pressure Sensor/SwitchFCircuit High', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 200, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P09A0', 'P09FF ISO/SAE Reserved ', 3, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 200, 1500)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0A7E', 'Battery Pack Over Temperature', 3, '["Check Engine Light illuminated", "Temperature gauge fluctuation", "Poor heater output", "Battery warning light", "Charging system malfunction", "Dim lights"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 300, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0A7F', 'Battery Pack Deterioration', 3, '["Check Engine Light illuminated", "Battery warning light", "Charging system malfunction", "Dim lights"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 300, 3000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P0C2F', 'Control Module Drive Motor/Generator - Engine Speed Sensor Performance', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Battery warning light", "Charging system malfunction", "Dim lights"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)", "Faulty control module (PCM/ECM/TCM)"]', '["Replace faulty sensor", "Reprogram or replace control module", "Clear DTC and verify repair with test drive"]', 300, 2000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P2000', 'NOx Adsorber Efficiency Below Threshold Bank 1', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P2001', 'NOx Adsorber Efficiency Below Threshold Bank 2 ', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P2002', 'Diesel Particulate Filter Efficiency Below Threshold Bank 1', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P2003', 'Diesel Particulate Filter Efficiency Below Threshold Bank 2', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P2004', 'Intake Manifold Runner Control Stuck Open Bank 1', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P2005', 'Intake Manifold Runner Control Stuck Open Bank 2', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P2006', 'Intake Manifold Runner Control Stuck Closed Bank 1', 3, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P2007', 'Intake Manifold Runner Control Stuck Closed Bank 2', 3, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P2008', 'Intake Manifold Runner Control Circuit/Open Bank 1', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P2009', 'Intake Manifold Runner Control Circuit Low Bank 1', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P200A', 'Intake Manifold Runner Performance Bank 1', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P200B', 'Intake Manifold Runner Performance Bank 2', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P200C', 'Diesel Particulate Filter Over Temperature Bank 1', 3, '["Check Engine Light illuminated", "Temperature gauge fluctuation", "Poor heater output"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P200D', 'Diesel Particulate Filter Over Temperature Bank 2', 3, '["Check Engine Light illuminated", "Temperature gauge fluctuation", "Poor heater output"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P200E', 'Catalyst System Over Temperature Bank 1', 3, '["Check Engine Light illuminated", "Temperature gauge fluctuation", "Poor heater output", "Rotten egg exhaust smell", "Failed emissions test", "Reduced fuel economy"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P200F', 'Catalyst System Over Temperature Bank 2', 3, '["Check Engine Light illuminated", "Temperature gauge fluctuation", "Poor heater output", "Rotten egg exhaust smell", "Failed emissions test", "Reduced fuel economy"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P2010', 'Intake Manifold Runner Control Circuit High Bank 1', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P2011', 'Intake Manifold Runner Control Circuit/Open Bank 2', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P2012', 'Intake Manifold Runner Control Circuit Low Bank 2', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P2013', 'Intake Manifold Runner Control Circuit High Bank 2', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P2014', 'Intake Manifold Runner Position Sensor/Switch Circuit Bank 1', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P2015', 'Intake Manifold Runner Position Sensor/Switch Circuit Range/Performance Bank 1', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P2016', 'Intake Manifold Runner Position Sensor/Switch Circuit Low Bank 1', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P2017', 'Intake Manifold Runner Position Sensor/Switch Circuit High Bank 1', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P2018', 'Intake Manifold Runner Position Sensor/Switch Circuit Intermittent Bank 1', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P2019', 'Intake Manifold Runner Position Sensor/Switch Circuit Bank 2', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P201A', 'Injection Valve Circuit Range/Performance Bank 2 Unit 1', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit", "Failed or stuck valve/solenoid/actuator"]', '["Inspect and repair wiring harness and connectors", "Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P201B,', 'P201C, P201D, P201E, P201F ISO/SAE Reserved', 3, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P2020', 'Intake Manifold Runner Position Sensor/Switch Circuit Range/Performance Bank 2', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P2021', 'Intake Manifold Runner Position Sensor/Switch Circuit Low Bank 2', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P2022', 'Intake Manifold Runner Position Sensor/Switch Circuit High Bank 2', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P2023', 'Intake Manifold Runner Position Sensor/Switch Circuit Intermittent Bank 2', 4, '["Check Engine Light illuminated", "Engine rattle/timing noise", "Rough idle", "Reduced power", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P2024', 'Evaporative Emissions (EVAP) Fuel Vapor Temperature Sensor Circuit', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)", "Fuel system contamination or component failure"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P2025', 'Evaporative Emissions (EVAP) Fuel Vapor Temperature Sensor Performance', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)", "Fuel system contamination or component failure"]', '["Replace faulty sensor", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P2026', 'Evaporative Emissions (EVAP) Fuel Vapor Temperature Sensor Circuit Low Voltage', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)", "Fuel system contamination or component failure"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P2027', 'Evaporative Emissions (EVAP) Fuel Vapor Temperature Sensor Circuit High Voltage', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)", "Fuel system contamination or component failure"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P2028', 'Evaporative Emissions (EVAP) Fuel Vapor Temperature Sensor Circuit Intermittent', 3, '["Check Engine Light illuminated", "Poor fuel economy", "Engine hesitation", "Hard starting", "Failed emissions test", "Poor fuel economy"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)", "Fuel system contamination or component failure"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Service or replace affected fuel system component", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P2029', 'Fired Heater Disabled', 3, '["Check Engine Light illuminated"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P202A', 'Tank Heater Control Circuit/Open', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P202B', 'Tank Heater Control Circuit Low', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P202C', 'Tank Heater Control Circuit High', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P202D', 'Leakage', 3, '["Check Engine Light illuminated", "Fuel odor detected", "Difficulty refueling"]', '["Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P202E', 'Injection Valve Circuit Range/Performance Bank 1 Unit 1', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit", "Failed or stuck valve/solenoid/actuator"]', '["Inspect and repair wiring harness and connectors", "Replace faulty valve/solenoid/actuator", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P202F/Regeneration', 'Supply Control Circuit Range/Performance', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Inspect and repair wiring harness and connectors", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P2030', 'Fired Heater Performance', 3, '["Check Engine Light illuminated"]', '["Damaged, corroded, or shorted wiring in related circuit"]', '["Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring", "Clear codes and verify repair"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P2031', 'Exhaust Gas Temperature Sensor Circuit Bank 1 Sensor 2', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P2032', 'Exhaust Gas Temperature Sensor Circuit Low Bank 1 Sensor 2', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P2033', 'Exhaust Gas Temperature Sensor Circuit High Bank 1 Sensor 2', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P2034', 'Exhaust Gas Temperature Sensor Circuit Bank 2 Sensor 2', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO obd_codes (code, title, severity, symptoms_json, causes_json, fixes_json, min_cost, max_cost)
VALUES ('P2035', 'Exhaust Gas Temperature Sensor Circuit Low Bank 2 Sensor 2', 3, '["Check Engine Light illuminated", "Failed emissions test", "Poor fuel economy", "Temperature gauge fluctuation", "Poor heater output"]', '["Damaged, corroded, or shorted wiring in related circuit", "Faulty sensor (internal failure)"]', '["Inspect and repair wiring harness and connectors", "Replace faulty sensor", "Clear DTC and verify repair with test drive"]', 150, 1000)
ON CONFLICT (code) DO NOTHING;
