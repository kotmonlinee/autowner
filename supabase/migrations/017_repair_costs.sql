-- Repair cost reference data
-- 55 common repair jobs across 5 vehicle tiers: economy, mid-range, luxury, truck/SUV, European
-- Prices in USD, based on US market data (RepairPal, AAA, Kelley Blue Book), circa 2024-2025

CREATE TABLE IF NOT EXISTS repair_costs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  repair_slug TEXT NOT NULL,
  repair_name TEXT NOT NULL,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('economy', 'mid_range', 'luxury', 'truck_suv', 'european')),
  -- tier ordering for sorting
  tier_order INTEGER NOT NULL DEFAULT 0,
  min_cost NUMERIC(10,2) NOT NULL,
  max_cost NUMERIC(10,2) NOT NULL,
  avg_cost NUMERIC(10,2) NOT NULL,
  labor_cost NUMERIC(10,2) NOT NULL,
  parts_cost NUMERIC(10,2) NOT NULL,
  confidence_level TEXT NOT NULL DEFAULT 'medium' CHECK (confidence_level IN ('low', 'medium', 'high')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(repair_slug, make, model)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_repair_costs_slug ON repair_costs(repair_slug);
CREATE INDEX IF NOT EXISTS idx_repair_costs_tier ON repair_costs(tier);
CREATE INDEX IF NOT EXISTS idx_repair_costs_make_model ON repair_costs(make, model);
CREATE INDEX IF NOT EXISTS idx_repair_costs_name ON repair_costs USING gin (to_tsvector('english', repair_name));

-- Enable RLS
ALTER TABLE repair_costs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read repair costs" ON repair_costs FOR SELECT USING (true);

-- ============================================================================
-- SEED DATA: 55 repair jobs x 5 tiers = 275 rows
-- Tier 0 = economy (Honda Civic / Toyota Corolla)
-- Tier 1 = mid_range (Ford F-150 / Honda Accord)
-- Tier 2 = luxury (BMW 3 Series / Mercedes C-Class)
-- Tier 3 = truck_suv (Chevy Tahoe / Ram 1500)
-- Tier 4 = european (Audi A4 / Volvo S60)
-- ============================================================================

-- Helper: tier_order mapping -- 0=economy, 1=mid_range, 2=luxury, 3=truck_suv, 4=european

-- 1. Brake Pads - Front
INSERT INTO repair_costs (repair_slug, repair_name, make, model, tier, tier_order, min_cost, max_cost, avg_cost, labor_cost, parts_cost, confidence_level) VALUES
  ('brake_pads_front', 'Brake Pads Replacement - Front', 'Honda', 'Civic', 'economy', 0, 120, 230, 165, 95, 70, 'high'),
  ('brake_pads_front', 'Brake Pads Replacement - Front', 'Ford', 'F-150', 'mid_range', 1, 150, 290, 210, 110, 100, 'high'),
  ('brake_pads_front', 'Brake Pads Replacement - Front', 'BMW', '3 Series', 'luxury', 2, 280, 480, 370, 180, 190, 'high'),
  ('brake_pads_front', 'Brake Pads Replacement - Front', 'Chevrolet', 'Tahoe', 'truck_suv', 3, 180, 340, 250, 130, 120, 'high'),
  ('brake_pads_front', 'Brake Pads Replacement - Front', 'Audi', 'A4', 'european', 4, 270, 460, 355, 175, 180, 'high');

-- 2. Brake Pads - Rear
INSERT INTO repair_costs (repair_slug, repair_name, make, model, tier, tier_order, min_cost, max_cost, avg_cost, labor_cost, parts_cost, confidence_level) VALUES
  ('brake_pads_rear', 'Brake Pads Replacement - Rear', 'Toyota', 'Corolla', 'economy', 0, 110, 220, 155, 90, 65, 'high'),
  ('brake_pads_rear', 'Brake Pads Replacement - Rear', 'Honda', 'Accord', 'mid_range', 1, 140, 270, 195, 105, 90, 'high'),
  ('brake_pads_rear', 'Brake Pads Replacement - Rear', 'Mercedes-Benz', 'C-Class', 'luxury', 2, 260, 460, 350, 170, 180, 'high'),
  ('brake_pads_rear', 'Brake Pads Replacement - Rear', 'Ram', '1500', 'truck_suv', 3, 170, 320, 235, 120, 115, 'high'),
  ('brake_pads_rear', 'Brake Pads Replacement - Rear', 'Volvo', 'S60', 'european', 4, 250, 430, 330, 165, 165, 'high');

-- 3. Rotor Replacement - Front
INSERT INTO repair_costs (repair_slug, repair_name, make, model, tier, tier_order, min_cost, max_cost, avg_cost, labor_cost, parts_cost, confidence_level) VALUES
  ('rotor_front', 'Rotor Replacement - Front', 'Honda', 'Civic', 'economy', 0, 220, 380, 290, 150, 140, 'high'),
  ('rotor_front', 'Rotor Replacement - Front', 'Ford', 'F-150', 'mid_range', 1, 280, 480, 370, 180, 190, 'high'),
  ('rotor_front', 'Rotor Replacement - Front', 'BMW', '3 Series', 'luxury', 2, 450, 780, 600, 280, 320, 'high'),
  ('rotor_front', 'Rotor Replacement - Front', 'Chevrolet', 'Tahoe', 'truck_suv', 3, 320, 560, 430, 200, 230, 'high'),
  ('rotor_front', 'Rotor Replacement - Front', 'Audi', 'A4', 'european', 4, 430, 750, 580, 270, 310, 'high');

-- 4. Rotor Replacement - Rear
INSERT INTO repair_costs (repair_slug, repair_name, make, model, tier, tier_order, min_cost, max_cost, avg_cost, labor_cost, parts_cost, confidence_level) VALUES
  ('rotor_rear', 'Rotor Replacement - Rear', 'Toyota', 'Corolla', 'economy', 0, 200, 360, 270, 145, 125, 'high'),
  ('rotor_rear', 'Rotor Replacement - Rear', 'Honda', 'Accord', 'mid_range', 1, 260, 450, 345, 170, 175, 'high'),
  ('rotor_rear', 'Rotor Replacement - Rear', 'Mercedes-Benz', 'C-Class', 'luxury', 2, 420, 740, 570, 260, 310, 'high'),
  ('rotor_rear', 'Rotor Replacement - Rear', 'Ram', '1500', 'truck_suv', 3, 300, 520, 400, 190, 210, 'high'),
  ('rotor_rear', 'Rotor Replacement - Rear', 'Volvo', 'S60', 'european', 4, 400, 710, 545, 255, 290, 'high');

-- 5. Oil Change - Full Synthetic
INSERT INTO repair_costs (repair_slug, repair_name, make, model, tier, tier_order, min_cost, max_cost, avg_cost, labor_cost, parts_cost, confidence_level) VALUES
  ('oil_change_synthetic', 'Oil Change - Full Synthetic', 'Honda', 'Civic', 'economy', 0, 45, 85, 65, 20, 45, 'high'),
  ('oil_change_synthetic', 'Oil Change - Full Synthetic', 'Ford', 'F-150', 'mid_range', 1, 60, 110, 85, 25, 60, 'high'),
  ('oil_change_synthetic', 'Oil Change - Full Synthetic', 'BMW', '3 Series', 'luxury', 2, 90, 180, 135, 45, 90, 'high'),
  ('oil_change_synthetic', 'Oil Change - Full Synthetic', 'Chevrolet', 'Tahoe', 'truck_suv', 3, 70, 130, 100, 30, 70, 'high'),
  ('oil_change_synthetic', 'Oil Change - Full Synthetic', 'Audi', 'A4', 'european', 4, 85, 170, 128, 40, 88, 'high');

-- 6. Transmission Fluid Change
INSERT INTO repair_costs (repair_slug, repair_name, make, model, tier, tier_order, min_cost, max_cost, avg_cost, labor_cost, parts_cost, confidence_level) VALUES
  ('transmission_fluid', 'Transmission Fluid Change', 'Toyota', 'Corolla', 'economy', 0, 130, 250, 185, 90, 95, 'high'),
  ('transmission_fluid', 'Transmission Fluid Change', 'Honda', 'Accord', 'mid_range', 1, 150, 300, 220, 100, 120, 'high'),
  ('transmission_fluid', 'Transmission Fluid Change', 'Mercedes-Benz', 'C-Class', 'luxury', 2, 280, 500, 385, 180, 205, 'high'),
  ('transmission_fluid', 'Transmission Fluid Change', 'Ram', '1500', 'truck_suv', 3, 180, 350, 260, 120, 140, 'high'),
  ('transmission_fluid', 'Transmission Fluid Change', 'Volvo', 'S60', 'european', 4, 260, 470, 360, 170, 190, 'high');

-- 7. Water Pump Replacement
INSERT INTO repair_costs (repair_slug, repair_name, make, model, tier, tier_order, min_cost, max_cost, avg_cost, labor_cost, parts_cost, confidence_level) VALUES
  ('water_pump', 'Water Pump Replacement', 'Honda', 'Civic', 'economy', 0, 310, 560, 425, 280, 145, 'high'),
  ('water_pump', 'Water Pump Replacement', 'Ford', 'F-150', 'mid_range', 1, 380, 680, 520, 320, 200, 'high'),
  ('water_pump', 'Water Pump Replacement', 'BMW', '3 Series', 'luxury', 2, 620, 1100, 850, 520, 330, 'high'),
  ('water_pump', 'Water Pump Replacement', 'Chevrolet', 'Tahoe', 'truck_suv', 3, 430, 800, 600, 360, 240, 'high'),
  ('water_pump', 'Water Pump Replacement', 'Audi', 'A4', 'european', 4, 600, 1050, 810, 500, 310, 'high');

-- 8. Alternator Replacement
INSERT INTO repair_costs (repair_slug, repair_name, make, model, tier, tier_order, min_cost, max_cost, avg_cost, labor_cost, parts_cost, confidence_level) VALUES
  ('alternator', 'Alternator Replacement', 'Toyota', 'Corolla', 'economy', 0, 320, 580, 440, 180, 260, 'high'),
  ('alternator', 'Alternator Replacement', 'Honda', 'Accord', 'mid_range', 1, 380, 700, 530, 220, 310, 'high'),
  ('alternator', 'Alternator Replacement', 'Mercedes-Benz', 'C-Class', 'luxury', 2, 650, 1200, 910, 380, 530, 'high'),
  ('alternator', 'Alternator Replacement', 'Ram', '1500', 'truck_suv', 3, 420, 800, 600, 250, 350, 'high'),
  ('alternator', 'Alternator Replacement', 'Volvo', 'S60', 'european', 4, 620, 1150, 870, 360, 510, 'high');

-- 9. Starter Replacement
INSERT INTO repair_costs (repair_slug, repair_name, make, model, tier, tier_order, min_cost, max_cost, avg_cost, labor_cost, parts_cost, confidence_level) VALUES
  ('starter', 'Starter Replacement', 'Honda', 'Civic', 'economy', 0, 290, 520, 395, 170, 225, 'high'),
  ('starter', 'Starter Replacement', 'Ford', 'F-150', 'mid_range', 1, 350, 650, 490, 210, 280, 'high'),
  ('starter', 'Starter Replacement', 'BMW', '3 Series', 'luxury', 2, 580, 1050, 800, 350, 450, 'high'),
  ('starter', 'Starter Replacement', 'Chevrolet', 'Tahoe', 'truck_suv', 3, 400, 740, 560, 240, 320, 'high'),
  ('starter', 'Starter Replacement', 'Audi', 'A4', 'european', 4, 560, 1020, 775, 340, 435, 'high');

-- 10. AC Compressor Replacement
INSERT INTO repair_costs (repair_slug, repair_name, make, model, tier, tier_order, min_cost, max_cost, avg_cost, labor_cost, parts_cost, confidence_level) VALUES
  ('ac_compressor', 'AC Compressor Replacement', 'Toyota', 'Corolla', 'economy', 0, 600, 950, 765, 350, 415, 'high'),
  ('ac_compressor', 'AC Compressor Replacement', 'Honda', 'Accord', 'mid_range', 1, 700, 1150, 910, 400, 510, 'high'),
  ('ac_compressor', 'AC Compressor Replacement', 'Mercedes-Benz', 'C-Class', 'luxury', 2, 1200, 2100, 1625, 700, 925, 'high'),
  ('ac_compressor', 'AC Compressor Replacement', 'Ram', '1500', 'truck_suv', 3, 750, 1300, 1010, 420, 590, 'high'),
  ('ac_compressor', 'AC Compressor Replacement', 'Volvo', 'S60', 'european', 4, 1100, 1950, 1500, 650, 850, 'high');

-- 11. Timing Belt Replacement
INSERT INTO repair_costs (repair_slug, repair_name, make, model, tier, tier_order, min_cost, max_cost, avg_cost, labor_cost, parts_cost, confidence_level) VALUES
  ('timing_belt', 'Timing Belt Replacement', 'Honda', 'Civic', 'economy', 0, 450, 800, 610, 380, 230, 'high'),
  ('timing_belt', 'Timing Belt Replacement', 'Ford', 'F-150', 'mid_range', 1, 550, 950, 735, 420, 315, 'high'),
  ('timing_belt', 'Timing Belt Replacement', 'BMW', '3 Series', 'luxury', 2, 850, 1600, 1205, 650, 555, 'high'),
  ('timing_belt', 'Timing Belt Replacement', 'Chevrolet', 'Tahoe', 'truck_suv', 3, 600, 1050, 810, 460, 350, 'high'),
  ('timing_belt', 'Timing Belt Replacement', 'Audi', 'A4', 'european', 4, 820, 1500, 1140, 620, 520, 'high');

-- 12. Spark Plugs Replacement
INSERT INTO repair_costs (repair_slug, repair_name, make, model, tier, tier_order, min_cost, max_cost, avg_cost, labor_cost, parts_cost, confidence_level) VALUES
  ('spark_plugs', 'Spark Plugs Replacement', 'Toyota', 'Corolla', 'economy', 0, 140, 280, 205, 140, 65, 'high'),
  ('spark_plugs', 'Spark Plugs Replacement', 'Honda', 'Accord', 'mid_range', 1, 180, 360, 265, 180, 85, 'high'),
  ('spark_plugs', 'Spark Plugs Replacement', 'Mercedes-Benz', 'C-Class', 'luxury', 2, 320, 600, 450, 280, 170, 'high'),
  ('spark_plugs', 'Spark Plugs Replacement', 'Ram', '1500', 'truck_suv', 3, 200, 420, 300, 200, 100, 'high'),
  ('spark_plugs', 'Spark Plugs Replacement', 'Volvo', 'S60', 'european', 4, 300, 560, 420, 260, 160, 'high');

-- 13. Oxygen Sensor Replacement
INSERT INTO repair_costs (repair_slug, repair_name, make, model, tier, tier_order, min_cost, max_cost, avg_cost, labor_cost, parts_cost, confidence_level) VALUES
  ('oxygen_sensor', 'Oxygen Sensor Replacement', 'Honda', 'Civic', 'economy', 0, 160, 310, 230, 100, 130, 'high'),
  ('oxygen_sensor', 'Oxygen Sensor Replacement', 'Ford', 'F-150', 'mid_range', 1, 190, 380, 280, 120, 160, 'high'),
  ('oxygen_sensor', 'Oxygen Sensor Replacement', 'BMW', '3 Series', 'luxury', 2, 310, 580, 435, 180, 255, 'high'),
  ('oxygen_sensor', 'Oxygen Sensor Replacement', 'Chevrolet', 'Tahoe', 'truck_suv', 3, 210, 420, 305, 135, 170, 'high'),
  ('oxygen_sensor', 'Oxygen Sensor Replacement', 'Audi', 'A4', 'european', 4, 300, 560, 420, 170, 250, 'high');

-- 14. Catalytic Converter Replacement
INSERT INTO repair_costs (repair_slug, repair_name, make, model, tier, tier_order, min_cost, max_cost, avg_cost, labor_cost, parts_cost, confidence_level) VALUES
  ('catalytic_converter', 'Catalytic Converter Replacement', 'Toyota', 'Corolla', 'economy', 0, 900, 1800, 1320, 300, 1020, 'high'),
  ('catalytic_converter', 'Catalytic Converter Replacement', 'Honda', 'Accord', 'mid_range', 1, 1100, 2200, 1615, 350, 1265, 'high'),
  ('catalytic_converter', 'Catalytic Converter Replacement', 'Mercedes-Benz', 'C-Class', 'luxury', 2, 1800, 3500, 2600, 500, 2100, 'high'),
  ('catalytic_converter', 'Catalytic Converter Replacement', 'Ram', '1500', 'truck_suv', 3, 1200, 2500, 1805, 380, 1425, 'high'),
  ('catalytic_converter', 'Catalytic Converter Replacement', 'Volvo', 'S60', 'european', 4, 1700, 3300, 2450, 480, 1970, 'high');

-- 15. Fuel Pump Replacement
INSERT INTO repair_costs (repair_slug, repair_name, make, model, tier, tier_order, min_cost, max_cost, avg_cost, labor_cost, parts_cost, confidence_level) VALUES
  ('fuel_pump', 'Fuel Pump Replacement', 'Honda', 'Civic', 'economy', 0, 400, 720, 550, 280, 270, 'high'),
  ('fuel_pump', 'Fuel Pump Replacement', 'Ford', 'F-150', 'mid_range', 1, 480, 880, 665, 320, 345, 'high'),
  ('fuel_pump', 'Fuel Pump Replacement', 'BMW', '3 Series', 'luxury', 2, 750, 1400, 1055, 480, 575, 'high'),
  ('fuel_pump', 'Fuel Pump Replacement', 'Chevrolet', 'Tahoe', 'truck_suv', 3, 530, 980, 740, 350, 390, 'high'),
  ('fuel_pump', 'Fuel Pump Replacement', 'Audi', 'A4', 'european', 4, 720, 1350, 1015, 460, 555, 'high');

-- 16. Radiator Replacement
INSERT INTO repair_costs (repair_slug, repair_name, make, model, tier, tier_order, min_cost, max_cost, avg_cost, labor_cost, parts_cost, confidence_level) VALUES
  ('radiator', 'Radiator Replacement', 'Toyota', 'Corolla', 'economy', 0, 350, 680, 500, 240, 260, 'high'),
  ('radiator', 'Radiator Replacement', 'Honda', 'Accord', 'mid_range', 1, 420, 820, 605, 285, 320, 'high'),
  ('radiator', 'Radiator Replacement', 'Mercedes-Benz', 'C-Class', 'luxury', 2, 680, 1300, 975, 450, 525, 'high'),
  ('radiator', 'Radiator Replacement', 'Ram', '1500', 'truck_suv', 3, 470, 900, 670, 310, 360, 'high'),
  ('radiator', 'Radiator Replacement', 'Volvo', 'S60', 'european', 4, 650, 1250, 935, 430, 505, 'high');

-- 17. Thermostat Replacement
INSERT INTO repair_costs (repair_slug, repair_name, make, model, tier, tier_order, min_cost, max_cost, avg_cost, labor_cost, parts_cost, confidence_level) VALUES
  ('thermostat', 'Thermostat Replacement', 'Honda', 'Civic', 'economy', 0, 150, 290, 215, 165, 50, 'high'),
  ('thermostat', 'Thermostat Replacement', 'Ford', 'F-150', 'mid_range', 1, 180, 360, 265, 195, 70, 'high'),
  ('thermostat', 'Thermostat Replacement', 'BMW', '3 Series', 'luxury', 2, 310, 580, 435, 310, 125, 'high'),
  ('thermostat', 'Thermostat Replacement', 'Chevrolet', 'Tahoe', 'truck_suv', 3, 200, 400, 295, 210, 85, 'high'),
  ('thermostat', 'Thermostat Replacement', 'Audi', 'A4', 'european', 4, 290, 550, 410, 295, 115, 'high');

-- 18. Battery Replacement
INSERT INTO repair_costs (repair_slug, repair_name, make, model, tier, tier_order, min_cost, max_cost, avg_cost, labor_cost, parts_cost, confidence_level) VALUES
  ('battery', 'Battery Replacement', 'Toyota', 'Corolla', 'economy', 0, 90, 200, 140, 20, 120, 'high'),
  ('battery', 'Battery Replacement', 'Honda', 'Accord', 'mid_range', 1, 110, 250, 175, 25, 150, 'high'),
  ('battery', 'Battery Replacement', 'Mercedes-Benz', 'C-Class', 'luxury', 2, 250, 450, 340, 60, 280, 'high'),
  ('battery', 'Battery Replacement', 'Ram', '1500', 'truck_suv', 3, 130, 300, 210, 30, 180, 'high'),
  ('battery', 'Battery Replacement', 'Volvo', 'S60', 'european', 4, 220, 420, 315, 55, 260, 'high');

-- 19. Serpentine Belt Replacement
INSERT INTO repair_costs (repair_slug, repair_name, make, model, tier, tier_order, min_cost, max_cost, avg_cost, labor_cost, parts_cost, confidence_level) VALUES
  ('serpentine_belt', 'Serpentine Belt Replacement', 'Honda', 'Civic', 'economy', 0, 85, 190, 135, 90, 45, 'high'),
  ('serpentine_belt', 'Serpentine Belt Replacement', 'Ford', 'F-150', 'mid_range', 1, 100, 230, 160, 100, 60, 'high'),
  ('serpentine_belt', 'Serpentine Belt Replacement', 'BMW', '3 Series', 'luxury', 2, 180, 370, 270, 180, 90, 'high'),
  ('serpentine_belt', 'Serpentine Belt Replacement', 'Chevrolet', 'Tahoe', 'truck_suv', 3, 115, 260, 185, 110, 75, 'high'),
  ('serpentine_belt', 'Serpentine Belt Replacement', 'Audi', 'A4', 'european', 4, 170, 350, 255, 170, 85, 'high');

-- 20. Valve Cover Gasket Replacement
INSERT INTO repair_costs (repair_slug, repair_name, make, model, tier, tier_order, min_cost, max_cost, avg_cost, labor_cost, parts_cost, confidence_level) VALUES
  ('valve_cover_gasket', 'Valve Cover Gasket Replacement', 'Toyota', 'Corolla', 'economy', 0, 160, 320, 235, 190, 45, 'high'),
  ('valve_cover_gasket', 'Valve Cover Gasket Replacement', 'Honda', 'Accord', 'mid_range', 1, 200, 400, 290, 230, 60, 'high'),
  ('valve_cover_gasket', 'Valve Cover Gasket Replacement', 'Mercedes-Benz', 'C-Class', 'luxury', 2, 380, 700, 530, 400, 130, 'high'),
  ('valve_cover_gasket', 'Valve Cover Gasket Replacement', 'Ram', '1500', 'truck_suv', 3, 220, 450, 325, 250, 75, 'high'),
  ('valve_cover_gasket', 'Valve Cover Gasket Replacement', 'Volvo', 'S60', 'european', 4, 350, 650, 490, 370, 120, 'high');

-- 21. Head Gasket Replacement
INSERT INTO repair_costs (repair_slug, repair_name, make, model, tier, tier_order, min_cost, max_cost, avg_cost, labor_cost, parts_cost, confidence_level) VALUES
  ('head_gasket', 'Head Gasket Replacement', 'Honda', 'Civic', 'economy', 0, 1500, 2600, 2015, 1550, 465, 'high'),
  ('head_gasket', 'Head Gasket Replacement', 'Ford', 'F-150', 'mid_range', 1, 1800, 3200, 2450, 1800, 650, 'high'),
  ('head_gasket', 'Head Gasket Replacement', 'BMW', '3 Series', 'luxury', 2, 3200, 5500, 4275, 3200, 1075, 'high'),
  ('head_gasket', 'Head Gasket Replacement', 'Chevrolet', 'Tahoe', 'truck_suv', 3, 2100, 3700, 2850, 2050, 800, 'high'),
  ('head_gasket', 'Head Gasket Replacement', 'Audi', 'A4', 'european', 4, 3000, 5200, 4040, 3000, 1040, 'high');

-- 22. Power Steering Pump Replacement
INSERT INTO repair_costs (repair_slug, repair_name, make, model, tier, tier_order, min_cost, max_cost, avg_cost, labor_cost, parts_cost, confidence_level) VALUES
  ('power_steering_pump', 'Power Steering Pump Replacement', 'Toyota', 'Corolla', 'economy', 0, 350, 620, 475, 250, 225, 'high'),
  ('power_steering_pump', 'Power Steering Pump Replacement', 'Honda', 'Accord', 'mid_range', 1, 410, 750, 570, 290, 280, 'high'),
  ('power_steering_pump', 'Power Steering Pump Replacement', 'Mercedes-Benz', 'C-Class', 'luxury', 2, 680, 1250, 950, 480, 470, 'high'),
  ('power_steering_pump', 'Power Steering Pump Replacement', 'Ram', '1500', 'truck_suv', 3, 450, 850, 635, 320, 315, 'high'),
  ('power_steering_pump', 'Power Steering Pump Replacement', 'Volvo', 'S60', 'european', 4, 650, 1200, 910, 460, 450, 'high');

-- 23. Wheel Bearing Replacement
INSERT INTO repair_costs (repair_slug, repair_name, make, model, tier, tier_order, min_cost, max_cost, avg_cost, labor_cost, parts_cost, confidence_level) VALUES
  ('wheel_bearing', 'Wheel Bearing Replacement', 'Honda', 'Civic', 'economy', 0, 220, 430, 315, 160, 155, 'high'),
  ('wheel_bearing', 'Wheel Bearing Replacement', 'Ford', 'F-150', 'mid_range', 1, 270, 520, 385, 190, 195, 'high'),
  ('wheel_bearing', 'Wheel Bearing Replacement', 'BMW', '3 Series', 'luxury', 2, 440, 820, 620, 310, 310, 'high'),
  ('wheel_bearing', 'Wheel Bearing Replacement', 'Chevrolet', 'Tahoe', 'truck_suv', 3, 300, 580, 430, 210, 220, 'high'),
  ('wheel_bearing', 'Wheel Bearing Replacement', 'Audi', 'A4', 'european', 4, 420, 780, 590, 295, 295, 'high');

-- 24. Struts Replacement - Front
INSERT INTO repair_costs (repair_slug, repair_name, make, model, tier, tier_order, min_cost, max_cost, avg_cost, labor_cost, parts_cost, confidence_level) VALUES
  ('struts_front', 'Struts Replacement - Front', 'Toyota', 'Corolla', 'economy', 0, 420, 800, 595, 315, 280, 'high'),
  ('struts_front', 'Struts Replacement - Front', 'Honda', 'Accord', 'mid_range', 1, 500, 950, 710, 360, 350, 'high'),
  ('struts_front', 'Struts Replacement - Front', 'Mercedes-Benz', 'C-Class', 'luxury', 2, 850, 1600, 1205, 580, 625, 'high'),
  ('struts_front', 'Struts Replacement - Front', 'Ram', '1500', 'truck_suv', 3, 550, 1050, 785, 390, 395, 'high'),
  ('struts_front', 'Struts Replacement - Front', 'Volvo', 'S60', 'european', 4, 800, 1500, 1130, 550, 580, 'high');

-- 25. Shocks Replacement - Rear
INSERT INTO repair_costs (repair_slug, repair_name, make, model, tier, tier_order, min_cost, max_cost, avg_cost, labor_cost, parts_cost, confidence_level) VALUES
  ('shocks_rear', 'Shocks Replacement - Rear', 'Honda', 'Civic', 'economy', 0, 280, 550, 405, 210, 195, 'high'),
  ('shocks_rear', 'Shocks Replacement - Rear', 'Ford', 'F-150', 'mid_range', 1, 340, 660, 490, 245, 245, 'high'),
  ('shocks_rear', 'Shocks Replacement - Rear', 'BMW', '3 Series', 'luxury', 2, 560, 1050, 790, 390, 400, 'high'),
  ('shocks_rear', 'Shocks Replacement - Rear', 'Chevrolet', 'Tahoe', 'truck_suv', 3, 370, 730, 540, 265, 275, 'high'),
  ('shocks_rear', 'Shocks Replacement - Rear', 'Audi', 'A4', 'european', 4, 530, 1000, 750, 375, 375, 'high');

-- 26. Tie Rod Ends Replacement
INSERT INTO repair_costs (repair_slug, repair_name, make, model, tier, tier_order, min_cost, max_cost, avg_cost, labor_cost, parts_cost, confidence_level) VALUES
  ('tie_rod_ends', 'Tie Rod Ends Replacement', 'Toyota', 'Corolla', 'economy', 0, 190, 370, 275, 145, 130, 'high'),
  ('tie_rod_ends', 'Tie Rod Ends Replacement', 'Honda', 'Accord', 'mid_range', 1, 230, 450, 335, 170, 165, 'high'),
  ('tie_rod_ends', 'Tie Rod Ends Replacement', 'Mercedes-Benz', 'C-Class', 'luxury', 2, 380, 720, 540, 280, 260, 'high'),
  ('tie_rod_ends', 'Tie Rod Ends Replacement', 'Ram', '1500', 'truck_suv', 3, 260, 510, 380, 195, 185, 'high'),
  ('tie_rod_ends', 'Tie Rod Ends Replacement', 'Volvo', 'S60', 'european', 4, 360, 690, 515, 265, 250, 'high');

-- 27. Ball Joints Replacement
INSERT INTO repair_costs (repair_slug, repair_name, make, model, tier, tier_order, min_cost, max_cost, avg_cost, labor_cost, parts_cost, confidence_level) VALUES
  ('ball_joints', 'Ball Joints Replacement', 'Honda', 'Civic', 'economy', 0, 250, 480, 355, 200, 155, 'high'),
  ('ball_joints', 'Ball Joints Replacement', 'Ford', 'F-150', 'mid_range', 1, 300, 580, 430, 230, 200, 'high'),
  ('ball_joints', 'Ball Joints Replacement', 'BMW', '3 Series', 'luxury', 2, 500, 950, 710, 380, 330, 'high'),
  ('ball_joints', 'Ball Joints Replacement', 'Chevrolet', 'Tahoe', 'truck_suv', 3, 340, 660, 490, 260, 230, 'high'),
  ('ball_joints', 'Ball Joints Replacement', 'Audi', 'A4', 'european', 4, 470, 900, 670, 360, 310, 'high');

-- 28. Control Arms Replacement
INSERT INTO repair_costs (repair_slug, repair_name, make, model, tier, tier_order, min_cost, max_cost, avg_cost, labor_cost, parts_cost, confidence_level) VALUES
  ('control_arms', 'Control Arms Replacement', 'Toyota', 'Corolla', 'economy', 0, 300, 580, 430, 240, 190, 'high'),
  ('control_arms', 'Control Arms Replacement', 'Honda', 'Accord', 'mid_range', 1, 360, 700, 520, 280, 240, 'high'),
  ('control_arms', 'Control Arms Replacement', 'Mercedes-Benz', 'C-Class', 'luxury', 2, 600, 1150, 855, 440, 415, 'high'),
  ('control_arms', 'Control Arms Replacement', 'Ram', '1500', 'truck_suv', 3, 410, 800, 590, 310, 280, 'high'),
  ('control_arms', 'Control Arms Replacement', 'Volvo', 'S60', 'european', 4, 570, 1100, 815, 420, 395, 'high');

-- 29. CV Axle Replacement
INSERT INTO repair_costs (repair_slug, repair_name, make, model, tier, tier_order, min_cost, max_cost, avg_cost, labor_cost, parts_cost, confidence_level) VALUES
  ('cv_axle', 'CV Axle Replacement', 'Honda', 'Civic', 'economy', 0, 280, 550, 405, 210, 195, 'high'),
  ('cv_axle', 'CV Axle Replacement', 'Ford', 'F-150', 'mid_range', 1, 340, 660, 490, 250, 240, 'high'),
  ('cv_axle', 'CV Axle Replacement', 'BMW', '3 Series', 'luxury', 2, 550, 1050, 785, 400, 385, 'high'),
  ('cv_axle', 'CV Axle Replacement', 'Chevrolet', 'Tahoe', 'truck_suv', 3, 380, 740, 550, 280, 270, 'high'),
  ('cv_axle', 'CV Axle Replacement', 'Audi', 'A4', 'european', 4, 520, 1000, 745, 380, 365, 'high');

-- 30. Muffler / Exhaust Replacement
INSERT INTO repair_costs (repair_slug, repair_name, make, model, tier, tier_order, min_cost, max_cost, avg_cost, labor_cost, parts_cost, confidence_level) VALUES
  ('muffler', 'Muffler Replacement', 'Toyota', 'Corolla', 'economy', 0, 180, 400, 280, 130, 150, 'high'),
  ('muffler', 'Muffler Replacement', 'Honda', 'Accord', 'mid_range', 1, 220, 480, 340, 145, 195, 'high'),
  ('muffler', 'Muffler Replacement', 'Mercedes-Benz', 'C-Class', 'luxury', 2, 400, 800, 590, 240, 350, 'high'),
  ('muffler', 'Muffler Replacement', 'Ram', '1500', 'truck_suv', 3, 250, 550, 390, 160, 230, 'high'),
  ('muffler', 'Muffler Replacement', 'Volvo', 'S60', 'european', 4, 380, 760, 560, 230, 330, 'high');

-- 31. EGR Valve Replacement
INSERT INTO repair_costs (repair_slug, repair_name, make, model, tier, tier_order, min_cost, max_cost, avg_cost, labor_cost, parts_cost, confidence_level) VALUES
  ('egr_valve', 'EGR Valve Replacement', 'Honda', 'Civic', 'economy', 0, 230, 450, 335, 155, 180, 'medium'),
  ('egr_valve', 'EGR Valve Replacement', 'Ford', 'F-150', 'mid_range', 1, 270, 540, 395, 180, 215, 'medium'),
  ('egr_valve', 'EGR Valve Replacement', 'BMW', '3 Series', 'luxury', 2, 430, 850, 630, 280, 350, 'medium'),
  ('egr_valve', 'EGR Valve Replacement', 'Chevrolet', 'Tahoe', 'truck_suv', 3, 300, 600, 440, 200, 240, 'medium'),
  ('egr_valve', 'EGR Valve Replacement', 'Audi', 'A4', 'european', 4, 410, 800, 595, 265, 330, 'medium');

-- 32. Mass Air Flow Sensor Replacement
INSERT INTO repair_costs (repair_slug, repair_name, make, model, tier, tier_order, min_cost, max_cost, avg_cost, labor_cost, parts_cost, confidence_level) VALUES
  ('mass_air_flow_sensor', 'Mass Air Flow Sensor Replacement', 'Toyota', 'Corolla', 'economy', 0, 180, 360, 265, 80, 185, 'high'),
  ('mass_air_flow_sensor', 'Mass Air Flow Sensor Replacement', 'Honda', 'Accord', 'mid_range', 1, 210, 430, 310, 95, 215, 'high'),
  ('mass_air_flow_sensor', 'Mass Air Flow Sensor Replacement', 'Mercedes-Benz', 'C-Class', 'luxury', 2, 350, 680, 500, 150, 350, 'high'),
  ('mass_air_flow_sensor', 'Mass Air Flow Sensor Replacement', 'Ram', '1500', 'truck_suv', 3, 240, 480, 350, 110, 240, 'high'),
  ('mass_air_flow_sensor', 'Mass Air Flow Sensor Replacement', 'Volvo', 'S60', 'european', 4, 330, 640, 475, 140, 335, 'high');

-- 33. Ignition Coil Replacement
INSERT INTO repair_costs (repair_slug, repair_name, make, model, tier, tier_order, min_cost, max_cost, avg_cost, labor_cost, parts_cost, confidence_level) VALUES
  ('ignition_coil', 'Ignition Coil Replacement', 'Honda', 'Civic', 'economy', 0, 150, 320, 230, 105, 125, 'high'),
  ('ignition_coil', 'Ignition Coil Replacement', 'Ford', 'F-150', 'mid_range', 1, 180, 390, 280, 125, 155, 'high'),
  ('ignition_coil', 'Ignition Coil Replacement', 'BMW', '3 Series', 'luxury', 2, 300, 600, 440, 200, 240, 'high'),
  ('ignition_coil', 'Ignition Coil Replacement', 'Chevrolet', 'Tahoe', 'truck_suv', 3, 200, 430, 305, 135, 170, 'high'),
  ('ignition_coil', 'Ignition Coil Replacement', 'Audi', 'A4', 'european', 4, 280, 560, 410, 190, 220, 'high');

-- 34. Clutch Replacement
INSERT INTO repair_costs (repair_slug, repair_name, make, model, tier, tier_order, min_cost, max_cost, avg_cost, labor_cost, parts_cost, confidence_level) VALUES
  ('clutch', 'Clutch Replacement', 'Toyota', 'Corolla', 'economy', 0, 800, 1400, 1080, 600, 480, 'high'),
  ('clutch', 'Clutch Replacement', 'Honda', 'Accord', 'mid_range', 1, 950, 1700, 1300, 700, 600, 'high'),
  ('clutch', 'Clutch Replacement', 'Mercedes-Benz', 'C-Class', 'luxury', 2, 1600, 3000, 2250, 1100, 1150, 'high'),
  ('clutch', 'Clutch Replacement', 'Ram', '1500', 'truck_suv', 3, 1100, 2000, 1520, 800, 720, 'high'),
  ('clutch', 'Clutch Replacement', 'Volvo', 'S60', 'european', 4, 1500, 2800, 2100, 1050, 1050, 'high');

-- 35. Fuel Injector Replacement
INSERT INTO repair_costs (repair_slug, repair_name, make, model, tier, tier_order, min_cost, max_cost, avg_cost, labor_cost, parts_cost, confidence_level) VALUES
  ('fuel_injector', 'Fuel Injector Replacement', 'Honda', 'Civic', 'economy', 0, 280, 550, 405, 210, 195, 'high'),
  ('fuel_injector', 'Fuel Injector Replacement', 'Ford', 'F-150', 'mid_range', 1, 340, 660, 490, 250, 240, 'high'),
  ('fuel_injector', 'Fuel Injector Replacement', 'BMW', '3 Series', 'luxury', 2, 550, 1050, 785, 400, 385, 'high'),
  ('fuel_injector', 'Fuel Injector Replacement', 'Chevrolet', 'Tahoe', 'truck_suv', 3, 380, 740, 550, 280, 270, 'high'),
  ('fuel_injector', 'Fuel Injector Replacement', 'Audi', 'A4', 'european', 4, 520, 1000, 745, 380, 365, 'high');

-- 36. Brake Caliper Replacement
INSERT INTO repair_costs (repair_slug, repair_name, make, model, tier, tier_order, min_cost, max_cost, avg_cost, labor_cost, parts_cost, confidence_level) VALUES
  ('brake_caliper', 'Brake Caliper Replacement', 'Toyota', 'Corolla', 'economy', 0, 230, 460, 335, 145, 190, 'high'),
  ('brake_caliper', 'Brake Caliper Replacement', 'Honda', 'Accord', 'mid_range', 1, 280, 550, 405, 170, 235, 'high'),
  ('brake_caliper', 'Brake Caliper Replacement', 'Mercedes-Benz', 'C-Class', 'luxury', 2, 450, 880, 650, 280, 370, 'high'),
  ('brake_caliper', 'Brake Caliper Replacement', 'Ram', '1500', 'truck_suv', 3, 310, 620, 455, 195, 260, 'high'),
  ('brake_caliper', 'Brake Caliper Replacement', 'Volvo', 'S60', 'european', 4, 430, 840, 620, 265, 355, 'high');

-- 37. Cabin Air Filter Replacement
INSERT INTO repair_costs (repair_slug, repair_name, make, model, tier, tier_order, min_cost, max_cost, avg_cost, labor_cost, parts_cost, confidence_level) VALUES
  ('cabin_air_filter', 'Cabin Air Filter Replacement', 'Honda', 'Civic', 'economy', 0, 35, 80, 55, 25, 30, 'high'),
  ('cabin_air_filter', 'Cabin Air Filter Replacement', 'Ford', 'F-150', 'mid_range', 1, 40, 95, 65, 30, 35, 'high'),
  ('cabin_air_filter', 'Cabin Air Filter Replacement', 'BMW', '3 Series', 'luxury', 2, 70, 150, 105, 50, 55, 'high'),
  ('cabin_air_filter', 'Cabin Air Filter Replacement', 'Chevrolet', 'Tahoe', 'truck_suv', 3, 45, 110, 75, 35, 40, 'high'),
  ('cabin_air_filter', 'Cabin Air Filter Replacement', 'Audi', 'A4', 'european', 4, 65, 140, 100, 45, 55, 'high');

-- 38. Engine Air Filter Replacement
INSERT INTO repair_costs (repair_slug, repair_name, make, model, tier, tier_order, min_cost, max_cost, avg_cost, labor_cost, parts_cost, confidence_level) VALUES
  ('engine_air_filter', 'Engine Air Filter Replacement', 'Toyota', 'Corolla', 'economy', 0, 30, 70, 48, 18, 30, 'high'),
  ('engine_air_filter', 'Engine Air Filter Replacement', 'Honda', 'Accord', 'mid_range', 1, 35, 85, 58, 22, 36, 'high'),
  ('engine_air_filter', 'Engine Air Filter Replacement', 'Mercedes-Benz', 'C-Class', 'luxury', 2, 60, 140, 98, 38, 60, 'high'),
  ('engine_air_filter', 'Engine Air Filter Replacement', 'Ram', '1500', 'truck_suv', 3, 40, 100, 68, 25, 43, 'high'),
  ('engine_air_filter', 'Engine Air Filter Replacement', 'Volvo', 'S60', 'european', 4, 55, 130, 90, 35, 55, 'high');

-- 39. PCV Valve Replacement
INSERT INTO repair_costs (repair_slug, repair_name, make, model, tier, tier_order, min_cost, max_cost, avg_cost, labor_cost, parts_cost, confidence_level) VALUES
  ('pcv_valve', 'PCV Valve Replacement', 'Honda', 'Civic', 'economy', 0, 90, 190, 135, 90, 45, 'medium'),
  ('pcv_valve', 'PCV Valve Replacement', 'Ford', 'F-150', 'mid_range', 1, 105, 230, 165, 105, 60, 'medium'),
  ('pcv_valve', 'PCV Valve Replacement', 'BMW', '3 Series', 'luxury', 2, 180, 380, 275, 170, 105, 'medium'),
  ('pcv_valve', 'PCV Valve Replacement', 'Chevrolet', 'Tahoe', 'truck_suv', 3, 120, 260, 185, 115, 70, 'medium'),
  ('pcv_valve', 'PCV Valve Replacement', 'Audi', 'A4', 'european', 4, 170, 360, 260, 160, 100, 'medium');

-- 40. Coolant Flush
INSERT INTO repair_costs (repair_slug, repair_name, make, model, tier, tier_order, min_cost, max_cost, avg_cost, labor_cost, parts_cost, confidence_level) VALUES
  ('coolant_flush', 'Coolant Flush', 'Toyota', 'Corolla', 'economy', 0, 90, 180, 130, 70, 60, 'high'),
  ('coolant_flush', 'Coolant Flush', 'Honda', 'Accord', 'mid_range', 1, 105, 220, 155, 85, 70, 'high'),
  ('coolant_flush', 'Coolant Flush', 'Mercedes-Benz', 'C-Class', 'luxury', 2, 160, 330, 240, 130, 110, 'high'),
  ('coolant_flush', 'Coolant Flush', 'Ram', '1500', 'truck_suv', 3, 120, 250, 180, 95, 85, 'high'),
  ('coolant_flush', 'Coolant Flush', 'Volvo', 'S60', 'european', 4, 150, 310, 225, 120, 105, 'high');

-- 41. Brake Fluid Flush
INSERT INTO repair_costs (repair_slug, repair_name, make, model, tier, tier_order, min_cost, max_cost, avg_cost, labor_cost, parts_cost, confidence_level) VALUES
  ('brake_fluid_flush', 'Brake Fluid Flush', 'Honda', 'Civic', 'economy', 0, 80, 160, 115, 85, 30, 'high'),
  ('brake_fluid_flush', 'Brake Fluid Flush', 'Ford', 'F-150', 'mid_range', 1, 90, 190, 135, 100, 35, 'high'),
  ('brake_fluid_flush', 'Brake Fluid Flush', 'BMW', '3 Series', 'luxury', 2, 150, 300, 220, 160, 60, 'high'),
  ('brake_fluid_flush', 'Brake Fluid Flush', 'Chevrolet', 'Tahoe', 'truck_suv', 3, 105, 220, 155, 115, 40, 'high'),
  ('brake_fluid_flush', 'Brake Fluid Flush', 'Audi', 'A4', 'european', 4, 140, 280, 205, 150, 55, 'high');

-- 42. Power Steering Fluid Flush
INSERT INTO repair_costs (repair_slug, repair_name, make, model, tier, tier_order, min_cost, max_cost, avg_cost, labor_cost, parts_cost, confidence_level) VALUES
  ('power_steering_flush', 'Power Steering Fluid Flush', 'Toyota', 'Corolla', 'economy', 0, 90, 180, 130, 80, 50, 'high'),
  ('power_steering_flush', 'Power Steering Fluid Flush', 'Honda', 'Accord', 'mid_range', 1, 100, 210, 150, 90, 60, 'high'),
  ('power_steering_flush', 'Power Steering Fluid Flush', 'Mercedes-Benz', 'C-Class', 'luxury', 2, 170, 340, 250, 150, 100, 'high'),
  ('power_steering_flush', 'Power Steering Fluid Flush', 'Ram', '1500', 'truck_suv', 3, 115, 240, 170, 100, 70, 'high'),
  ('power_steering_flush', 'Power Steering Fluid Flush', 'Volvo', 'S60', 'european', 4, 160, 320, 235, 140, 95, 'high');

-- 43. Differential Fluid Change
INSERT INTO repair_costs (repair_slug, repair_name, make, model, tier, tier_order, min_cost, max_cost, avg_cost, labor_cost, parts_cost, confidence_level) VALUES
  ('differential_fluid', 'Differential Fluid Change', 'Honda', 'Civic', 'economy', 0, 70, 160, 110, 65, 45, 'high'),
  ('differential_fluid', 'Differential Fluid Change', 'Ford', 'F-150', 'mid_range', 1, 85, 200, 138, 80, 58, 'high'),
  ('differential_fluid', 'Differential Fluid Change', 'BMW', '3 Series', 'luxury', 2, 140, 300, 215, 125, 90, 'high'),
  ('differential_fluid', 'Differential Fluid Change', 'Chevrolet', 'Tahoe', 'truck_suv', 3, 95, 230, 155, 90, 65, 'high'),
  ('differential_fluid', 'Differential Fluid Change', 'Audi', 'A4', 'european', 4, 130, 280, 200, 115, 85, 'high');

-- 44. Transfer Case Fluid Change
INSERT INTO repair_costs (repair_slug, repair_name, make, model, tier, tier_order, min_cost, max_cost, avg_cost, labor_cost, parts_cost, confidence_level) VALUES
  ('transfer_case_fluid', 'Transfer Case Fluid Change', 'Toyota', 'Corolla', 'economy', 0, 70, 150, 105, 60, 45, 'medium'),
  ('transfer_case_fluid', 'Transfer Case Fluid Change', 'Ford', 'F-150', 'mid_range', 1, 80, 180, 125, 70, 55, 'medium'),
  ('transfer_case_fluid', 'Transfer Case Fluid Change', 'BMW', '3 Series', 'luxury', 2, 140, 290, 210, 115, 95, 'medium'),
  ('transfer_case_fluid', 'Transfer Case Fluid Change', 'Chevrolet', 'Tahoe', 'truck_suv', 3, 90, 200, 140, 80, 60, 'medium'),
  ('transfer_case_fluid', 'Transfer Case Fluid Change', 'Audi', 'A4', 'european', 4, 130, 275, 198, 110, 88, 'medium');

-- 45. Drive Belt Replacement
INSERT INTO repair_costs (repair_slug, repair_name, make, model, tier, tier_order, min_cost, max_cost, avg_cost, labor_cost, parts_cost, confidence_level) VALUES
  ('drive_belt', 'Drive Belt Replacement', 'Honda', 'Civic', 'economy', 0, 85, 190, 135, 90, 45, 'high'),
  ('drive_belt', 'Drive Belt Replacement', 'Honda', 'Accord', 'mid_range', 1, 100, 230, 160, 100, 60, 'high'),
  ('drive_belt', 'Drive Belt Replacement', 'Mercedes-Benz', 'C-Class', 'luxury', 2, 180, 370, 270, 180, 90, 'high'),
  ('drive_belt', 'Drive Belt Replacement', 'Ram', '1500', 'truck_suv', 3, 115, 260, 185, 110, 75, 'high'),
  ('drive_belt', 'Drive Belt Replacement', 'Volvo', 'S60', 'european', 4, 170, 350, 255, 170, 85, 'high');

-- 46. Engine Mount Replacement
INSERT INTO repair_costs (repair_slug, repair_name, make, model, tier, tier_order, min_cost, max_cost, avg_cost, labor_cost, parts_cost, confidence_level) VALUES
  ('engine_mount', 'Engine Mount Replacement', 'Toyota', 'Corolla', 'economy', 0, 280, 540, 400, 260, 140, 'high'),
  ('engine_mount', 'Engine Mount Replacement', 'Ford', 'F-150', 'mid_range', 1, 340, 660, 490, 310, 180, 'high'),
  ('engine_mount', 'Engine Mount Replacement', 'BMW', '3 Series', 'luxury', 2, 550, 1050, 785, 480, 305, 'high'),
  ('engine_mount', 'Engine Mount Replacement', 'Chevrolet', 'Tahoe', 'truck_suv', 3, 380, 740, 550, 340, 210, 'high'),
  ('engine_mount', 'Engine Mount Replacement', 'Audi', 'A4', 'european', 4, 520, 1000, 745, 460, 285, 'high');

-- 47. Transmission Mount Replacement
INSERT INTO repair_costs (repair_slug, repair_name, make, model, tier, tier_order, min_cost, max_cost, avg_cost, labor_cost, parts_cost, confidence_level) VALUES
  ('transmission_mount', 'Transmission Mount Replacement', 'Honda', 'Civic', 'economy', 0, 200, 400, 290, 210, 80, 'high'),
  ('transmission_mount', 'Transmission Mount Replacement', 'Honda', 'Accord', 'mid_range', 1, 240, 480, 350, 245, 105, 'high'),
  ('transmission_mount', 'Transmission Mount Replacement', 'Mercedes-Benz', 'C-Class', 'luxury', 2, 400, 780, 580, 390, 190, 'high'),
  ('transmission_mount', 'Transmission Mount Replacement', 'Ram', '1500', 'truck_suv', 3, 270, 540, 395, 270, 125, 'high'),
  ('transmission_mount', 'Transmission Mount Replacement', 'Volvo', 'S60', 'european', 4, 380, 740, 550, 365, 185, 'high');

-- 48. Evaporator Core Replacement
INSERT INTO repair_costs (repair_slug, repair_name, make, model, tier, tier_order, min_cost, max_cost, avg_cost, labor_cost, parts_cost, confidence_level) VALUES
  ('evaporator_core', 'Evaporator Core Replacement', 'Toyota', 'Corolla', 'economy', 0, 800, 1500, 1125, 750, 375, 'medium'),
  ('evaporator_core', 'Evaporator Core Replacement', 'Ford', 'F-150', 'mid_range', 1, 950, 1800, 1350, 880, 470, 'medium'),
  ('evaporator_core', 'Evaporator Core Replacement', 'BMW', '3 Series', 'luxury', 2, 1600, 3000, 2250, 1400, 850, 'medium'),
  ('evaporator_core', 'Evaporator Core Replacement', 'Chevrolet', 'Tahoe', 'truck_suv', 3, 1050, 2000, 1500, 950, 550, 'medium'),
  ('evaporator_core', 'Evaporator Core Replacement', 'Audi', 'A4', 'european', 4, 1500, 2800, 2100, 1300, 800, 'medium');

-- 49. Heater Core Replacement
INSERT INTO repair_costs (repair_slug, repair_name, make, model, tier, tier_order, min_cost, max_cost, avg_cost, labor_cost, parts_cost, confidence_level) VALUES
  ('heater_core', 'Heater Core Replacement', 'Honda', 'Civic', 'economy', 0, 700, 1300, 980, 650, 330, 'medium'),
  ('heater_core', 'Heater Core Replacement', 'Honda', 'Accord', 'mid_range', 1, 850, 1600, 1200, 780, 420, 'medium'),
  ('heater_core', 'Heater Core Replacement', 'Mercedes-Benz', 'C-Class', 'luxury', 2, 1400, 2600, 1950, 1250, 700, 'medium'),
  ('heater_core', 'Heater Core Replacement', 'Ram', '1500', 'truck_suv', 3, 950, 1800, 1350, 850, 500, 'medium'),
  ('heater_core', 'Heater Core Replacement', 'Volvo', 'S60', 'european', 4, 1300, 2400, 1800, 1150, 650, 'medium');

-- 50. Throttle Body Replacement
INSERT INTO repair_costs (repair_slug, repair_name, make, model, tier, tier_order, min_cost, max_cost, avg_cost, labor_cost, parts_cost, confidence_level) VALUES
  ('throttle_body', 'Throttle Body Replacement', 'Toyota', 'Corolla', 'economy', 0, 320, 600, 450, 200, 250, 'high'),
  ('throttle_body', 'Throttle Body Replacement', 'Ford', 'F-150', 'mid_range', 1, 380, 720, 540, 230, 310, 'high'),
  ('throttle_body', 'Throttle Body Replacement', 'BMW', '3 Series', 'luxury', 2, 600, 1150, 855, 370, 485, 'high'),
  ('throttle_body', 'Throttle Body Replacement', 'Chevrolet', 'Tahoe', 'truck_suv', 3, 420, 800, 600, 260, 340, 'high'),
  ('throttle_body', 'Throttle Body Replacement', 'Audi', 'A4', 'european', 4, 570, 1080, 805, 350, 455, 'high');

-- 51. Fuel Filter Replacement
INSERT INTO repair_costs (repair_slug, repair_name, make, model, tier, tier_order, min_cost, max_cost, avg_cost, labor_cost, parts_cost, confidence_level) VALUES
  ('fuel_filter', 'Fuel Filter Replacement', 'Honda', 'Civic', 'economy', 0, 85, 200, 140, 80, 60, 'high'),
  ('fuel_filter', 'Fuel Filter Replacement', 'Honda', 'Accord', 'mid_range', 1, 100, 240, 165, 90, 75, 'high'),
  ('fuel_filter', 'Fuel Filter Replacement', 'Mercedes-Benz', 'C-Class', 'luxury', 2, 180, 400, 285, 145, 140, 'high'),
  ('fuel_filter', 'Fuel Filter Replacement', 'Ram', '1500', 'truck_suv', 3, 115, 270, 190, 105, 85, 'high'),
  ('fuel_filter', 'Fuel Filter Replacement', 'Volvo', 'S60', 'european', 4, 170, 380, 270, 135, 135, 'high');

-- 52. Windshield Replacement
INSERT INTO repair_costs (repair_slug, repair_name, make, model, tier, tier_order, min_cost, max_cost, avg_cost, labor_cost, parts_cost, confidence_level) VALUES
  ('windshield', 'Windshield Replacement', 'Toyota', 'Corolla', 'economy', 0, 220, 420, 315, 115, 200, 'high'),
  ('windshield', 'Windshield Replacement', 'Ford', 'F-150', 'mid_range', 1, 250, 500, 365, 135, 230, 'high'),
  ('windshield', 'Windshield Replacement', 'BMW', '3 Series', 'luxury', 2, 450, 900, 655, 220, 435, 'high'),
  ('windshield', 'Windshield Replacement', 'Chevrolet', 'Tahoe', 'truck_suv', 3, 280, 560, 410, 150, 260, 'high'),
  ('windshield', 'Windshield Replacement', 'Audi', 'A4', 'european', 4, 420, 850, 620, 200, 420, 'high');

-- 53. Window Regulator Replacement
INSERT INTO repair_costs (repair_slug, repair_name, make, model, tier, tier_order, min_cost, max_cost, avg_cost, labor_cost, parts_cost, confidence_level) VALUES
  ('window_regulator', 'Window Regulator Replacement', 'Honda', 'Civic', 'economy', 0, 220, 440, 320, 145, 175, 'high'),
  ('window_regulator', 'Window Regulator Replacement', 'Honda', 'Accord', 'mid_range', 1, 260, 520, 380, 170, 210, 'high'),
  ('window_regulator', 'Window Regulator Replacement', 'Mercedes-Benz', 'C-Class', 'luxury', 2, 450, 900, 660, 280, 380, 'high'),
  ('window_regulator', 'Window Regulator Replacement', 'Ram', '1500', 'truck_suv', 3, 290, 580, 425, 190, 235, 'high'),
  ('window_regulator', 'Window Regulator Replacement', 'Volvo', 'S60', 'european', 4, 420, 850, 620, 260, 360, 'high');

-- 54. Door Lock Actuator Replacement
INSERT INTO repair_costs (repair_slug, repair_name, make, model, tier, tier_order, min_cost, max_cost, avg_cost, labor_cost, parts_cost, confidence_level) VALUES
  ('door_lock_actuator', 'Door Lock Actuator Replacement', 'Toyota', 'Corolla', 'economy', 0, 200, 400, 290, 145, 145, 'high'),
  ('door_lock_actuator', 'Door Lock Actuator Replacement', 'Ford', 'F-150', 'mid_range', 1, 240, 480, 350, 170, 180, 'high'),
  ('door_lock_actuator', 'Door Lock Actuator Replacement', 'BMW', '3 Series', 'luxury', 2, 380, 750, 550, 270, 280, 'high'),
  ('door_lock_actuator', 'Door Lock Actuator Replacement', 'Chevrolet', 'Tahoe', 'truck_suv', 3, 270, 540, 395, 190, 205, 'high'),
  ('door_lock_actuator', 'Door Lock Actuator Replacement', 'Audi', 'A4', 'european', 4, 360, 720, 525, 255, 270, 'high');

-- 55. Blower Motor Replacement
INSERT INTO repair_costs (repair_slug, repair_name, make, model, tier, tier_order, min_cost, max_cost, avg_cost, labor_cost, parts_cost, confidence_level) VALUES
  ('blower_motor', 'Blower Motor Replacement', 'Honda', 'Civic', 'economy', 0, 230, 450, 335, 160, 175, 'high'),
  ('blower_motor', 'Blower Motor Replacement', 'Honda', 'Accord', 'mid_range', 1, 270, 540, 395, 185, 210, 'high'),
  ('blower_motor', 'Blower Motor Replacement', 'Mercedes-Benz', 'C-Class', 'luxury', 2, 430, 850, 630, 300, 330, 'high'),
  ('blower_motor', 'Blower Motor Replacement', 'Ram', '1500', 'truck_suv', 3, 300, 600, 440, 205, 235, 'high'),
  ('blower_motor', 'Blower Motor Replacement', 'Volvo', 'S60', 'european', 4, 410, 800, 595, 280, 315, 'high');

-- Verify seed count: 55 x 5 = 275 rows
DO $$
DECLARE
  cnt INTEGER;
BEGIN
  SELECT count(*) INTO cnt FROM repair_costs;
  RAISE NOTICE 'Repair costs seeded: % rows', cnt;
END $$;
