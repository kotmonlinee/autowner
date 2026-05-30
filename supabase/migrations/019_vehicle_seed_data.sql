-- Seed: US car makes, models, generations, engines
-- Covers the top brands for US/European car owners market

-- Makes
INSERT INTO vehicle_makes (name, slug, country) VALUES
  ('Toyota', 'toyota', 'Japan'),
  ('Honda', 'honda', 'Japan'),
  ('Ford', 'ford', 'USA'),
  ('Chevrolet', 'chevrolet', 'USA'),
  ('Nissan', 'nissan', 'Japan'),
  ('BMW', 'bmw', 'Germany'),
  ('Mercedes-Benz', 'mercedes-benz', 'Germany'),
  ('Volkswagen', 'volkswagen', 'Germany'),
  ('Audi', 'audi', 'Germany'),
  ('Hyundai', 'hyundai', 'South Korea'),
  ('Kia', 'kia', 'South Korea'),
  ('Subaru', 'subaru', 'Japan'),
  ('Mazda', 'mazda', 'Japan'),
  ('Jeep', 'jeep', 'USA'),
  ('Lexus', 'lexus', 'Japan'),
  ('Dodge', 'dodge', 'USA'),
  ('GMC', 'gmc', 'USA'),
  ('Ram', 'ram', 'USA'),
  ('Tesla', 'tesla', 'USA'),
  ('Volvo', 'volvo', 'Sweden'),
  ('Porsche', 'porsche', 'Germany'),
  ('Land Rover', 'land-rover', 'UK'),
  ('Acura', 'acura', 'Japan'),
  ('Infiniti', 'infiniti', 'Japan'),
  ('Cadillac', 'cadillac', 'USA'),
  ('Buick', 'buick', 'USA'),
  ('Chrysler', 'chrysler', 'USA'),
  ('Mini', 'mini', 'UK'),
  ('Mitsubishi', 'mitsubishi', 'Japan'),
  ('Jaguar', 'jaguar', 'UK')
ON CONFLICT (slug) DO NOTHING;

-- ── Toyota ────────────────────────────────────────────────
DO $$
DECLARE
  v_make_id UUID;
  v_model_id UUID;
  v_gen_id UUID;
BEGIN
  SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'toyota';

  -- Camry
  INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Camry', 'camry') ON CONFLICT (make_id, slug) DO UPDATE SET name = 'Camry' RETURNING id INTO v_model_id;
  INSERT INTO vehicle_generations (model_id, name, year_start, year_end) VALUES (v_model_id, 'XV70 (8th Gen)', 2018, 2024) ON CONFLICT (model_id, year_start) DO NOTHING RETURNING id INTO v_gen_id;
  INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, 'A25A-FKS', '2.5L I4', '2.5L', 'Gasoline', 203) ON CONFLICT (generation_id, code) DO NOTHING;
  INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, 'A25A-FXS', '2.5L I4 Hybrid', '2.5L', 'Hybrid', 208) ON CONFLICT (generation_id, code) DO NOTHING;

  INSERT INTO vehicle_generations (model_id, name, year_start, year_end) VALUES (v_model_id, 'XV50 (7th Gen)', 2012, 2017) ON CONFLICT (model_id, year_start) DO NOTHING RETURNING id INTO v_gen_id;
  INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, '2AR-FE', '2.5L I4', '2.5L', 'Gasoline', 178) ON CONFLICT (generation_id, code) DO NOTHING;

  -- Corolla
  INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Corolla', 'corolla') ON CONFLICT (make_id, slug) DO UPDATE SET name = 'Corolla' RETURNING id INTO v_model_id;
  INSERT INTO vehicle_generations (model_id, name, year_start, year_end) VALUES (v_model_id, 'E210 (12th Gen)', 2019, NULL) ON CONFLICT (model_id, year_start) DO NOTHING RETURNING id INTO v_gen_id;
  INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, 'M20A-FKS', '2.0L I4', '2.0L', 'Gasoline', 169) ON CONFLICT (generation_id, code) DO NOTHING;
  INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, '2ZR-FAE', '1.8L I4', '1.8L', 'Gasoline', 139) ON CONFLICT (generation_id, code) DO NOTHING;

  -- RAV4
  INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'RAV4', 'rav4') ON CONFLICT (make_id, slug) DO UPDATE SET name = 'RAV4' RETURNING id INTO v_model_id;
  INSERT INTO vehicle_generations (model_id, name, year_start, year_end) VALUES (v_model_id, 'XA50 (5th Gen)', 2019, NULL) ON CONFLICT (model_id, year_start) DO NOTHING RETURNING id INTO v_gen_id;
  INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, 'A25A-FKS', '2.5L I4', '2.5L', 'Gasoline', 203) ON CONFLICT (generation_id, code) DO NOTHING;
  INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, 'A25A-FXS', '2.5L I4 Hybrid', '2.5L', 'Hybrid', 219) ON CONFLICT (generation_id, code) DO NOTHING;

  -- Tacoma
  INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Tacoma', 'tacoma') ON CONFLICT (make_id, slug) DO UPDATE SET name = 'Tacoma' RETURNING id INTO v_model_id;
  INSERT INTO vehicle_generations (model_id, name, year_start, year_end) VALUES (v_model_id, 'N300 (4th Gen)', 2024, NULL) ON CONFLICT (model_id, year_start) DO NOTHING RETURNING id INTO v_gen_id;
  INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, 'T24A-FTS', '2.4L I4 Turbo', '2.4L', 'Gasoline', 278) ON CONFLICT (generation_id, code) DO NOTHING;
  INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, 'V35A-FTS', '3.5L V6 Turbo', '3.5L', 'Gasoline', 389) ON CONFLICT (generation_id, code) DO NOTHING;

  INSERT INTO vehicle_generations (model_id, name, year_start, year_end) VALUES (v_model_id, 'N200 (3rd Gen)', 2016, 2023) ON CONFLICT (model_id, year_start) DO NOTHING RETURNING id INTO v_gen_id;
  INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, '2GR-FKS', '3.5L V6', '3.5L', 'Gasoline', 278) ON CONFLICT (generation_id, code) DO NOTHING;
END $$;

-- ── Honda ─────────────────────────────────────────────────
DO $$
DECLARE
  v_make_id UUID;
  v_model_id UUID;
  v_gen_id UUID;
BEGIN
  SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'honda';

  -- Civic
  INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Civic', 'civic') ON CONFLICT (make_id, slug) DO UPDATE SET name = 'Civic' RETURNING id INTO v_model_id;
  INSERT INTO vehicle_generations (model_id, name, year_start, year_end) VALUES (v_model_id, '11th Gen', 2022, NULL) ON CONFLICT (model_id, year_start) DO NOTHING RETURNING id INTO v_gen_id;
  INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, 'L15B7', '1.5L I4 Turbo', '1.5L', 'Gasoline', 180) ON CONFLICT (generation_id, code) DO NOTHING;
  INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, 'K20C2', '2.0L I4', '2.0L', 'Gasoline', 158) ON CONFLICT (generation_id, code) DO NOTHING;

  INSERT INTO vehicle_generations (model_id, name, year_start, year_end) VALUES (v_model_id, '10th Gen', 2016, 2021) ON CONFLICT (model_id, year_start) DO NOTHING RETURNING id INTO v_gen_id;
  INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, 'L15B7', '1.5L I4 Turbo', '1.5L', 'Gasoline', 174) ON CONFLICT (generation_id, code) DO NOTHING;

  -- Accord
  INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Accord', 'accord') ON CONFLICT (make_id, slug) DO UPDATE SET name = 'Accord' RETURNING id INTO v_model_id;
  INSERT INTO vehicle_generations (model_id, name, year_start, year_end) VALUES (v_model_id, '11th Gen', 2023, NULL) ON CONFLICT (model_id, year_start) DO NOTHING RETURNING id INTO v_gen_id;
  INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, 'L15BE', '1.5L I4 Turbo', '1.5L', 'Gasoline', 192) ON CONFLICT (generation_id, code) DO NOTHING;
  INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, 'LFC2', '2.0L I4 Hybrid', '2.0L', 'Hybrid', 204) ON CONFLICT (generation_id, code) DO NOTHING;

  -- CR-V
  INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'CR-V', 'cr-v') ON CONFLICT (make_id, slug) DO UPDATE SET name = 'CR-V' RETURNING id INTO v_model_id;
  INSERT INTO vehicle_generations (model_id, name, year_start, year_end) VALUES (v_model_id, '6th Gen', 2023, NULL) ON CONFLICT (model_id, year_start) DO NOTHING RETURNING id INTO v_gen_id;
  INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, 'L15BE', '1.5L I4 Turbo', '1.5L', 'Gasoline', 190) ON CONFLICT (generation_id, code) DO NOTHING;
  INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, 'LFC2', '2.0L I4 Hybrid', '2.0L', 'Hybrid', 204) ON CONFLICT (generation_id, code) DO NOTHING;
END $$;

-- ── Ford ──────────────────────────────────────────────────
DO $$
DECLARE
  v_make_id UUID;
  v_model_id UUID;
  v_gen_id UUID;
BEGIN
  SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'ford';

  -- F-150
  INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'F-150', 'f-150') ON CONFLICT (make_id, slug) DO UPDATE SET name = 'F-150' RETURNING id INTO v_model_id;
  INSERT INTO vehicle_generations (model_id, name, year_start, year_end) VALUES (v_model_id, 'P702 (14th Gen)', 2021, NULL) ON CONFLICT (model_id, year_start) DO NOTHING RETURNING id INTO v_gen_id;
  INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, '3.5L EcoBoost', '3.5L V6 Turbo', '3.5L', 'Gasoline', 400) ON CONFLICT (generation_id, code) DO NOTHING;
  INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, '5.0L V8', '5.0L V8', '5.0L', 'Gasoline', 400) ON CONFLICT (generation_id, code) DO NOTHING;
  INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, '3.5L PowerBoost', '3.5L V6 Hybrid', '3.5L', 'Hybrid', 430) ON CONFLICT (generation_id, code) DO NOTHING;

  -- Mustang
  INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Mustang', 'mustang') ON CONFLICT (make_id, slug) DO UPDATE SET name = 'Mustang' RETURNING id INTO v_model_id;
  INSERT INTO vehicle_generations (model_id, name, year_start, year_end) VALUES (v_model_id, 'S650 (7th Gen)', 2024, NULL) ON CONFLICT (model_id, year_start) DO NOTHING RETURNING id INTO v_gen_id;
  INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, '5.0L Coyote', '5.0L V8', '5.0L', 'Gasoline', 480) ON CONFLICT (generation_id, code) DO NOTHING;
  INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, '2.3L EcoBoost', '2.3L I4 Turbo', '2.3L', 'Gasoline', 315) ON CONFLICT (generation_id, code) DO NOTHING;

  -- Explorer
  INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Explorer', 'explorer') ON CONFLICT (make_id, slug) DO UPDATE SET name = 'Explorer' RETURNING id INTO v_model_id;
  INSERT INTO vehicle_generations (model_id, name, year_start, year_end) VALUES (v_model_id, 'U625 (6th Gen)', 2020, NULL) ON CONFLICT (model_id, year_start) DO NOTHING RETURNING id INTO v_gen_id;
  INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, '2.3L EcoBoost', '2.3L I4 Turbo', '2.3L', 'Gasoline', 300) ON CONFLICT (generation_id, code) DO NOTHING;
  INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, '3.0L EcoBoost', '3.0L V6 Turbo', '3.0L', 'Gasoline', 400) ON CONFLICT (generation_id, code) DO NOTHING;
END $$;

-- ── BMW ───────────────────────────────────────────────────
DO $$
DECLARE
  v_make_id UUID;
  v_model_id UUID;
  v_gen_id UUID;
BEGIN
  SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'bmw';

  -- 3 Series
  INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '3 Series', '3-series') ON CONFLICT (make_id, slug) DO UPDATE SET name = '3 Series' RETURNING id INTO v_model_id;
  INSERT INTO vehicle_generations (model_id, name, year_start, year_end) VALUES (v_model_id, 'G20 (7th Gen)', 2019, NULL) ON CONFLICT (model_id, year_start) DO NOTHING RETURNING id INTO v_gen_id;
  INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, 'B48', '2.0L I4 Turbo (330i)', '2.0L', 'Gasoline', 255) ON CONFLICT (generation_id, code) DO NOTHING;
  INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, 'B58', '3.0L I6 Turbo (M340i)', '3.0L', 'Gasoline', 382) ON CONFLICT (generation_id, code) DO NOTHING;
  INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, 'S58', '3.0L I6 Turbo (M3)', '3.0L', 'Gasoline', 473) ON CONFLICT (generation_id, code) DO NOTHING;

  -- X5
  INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'X5', 'x5') ON CONFLICT (make_id, slug) DO UPDATE SET name = 'X5' RETURNING id INTO v_model_id;
  INSERT INTO vehicle_generations (model_id, name, year_start, year_end) VALUES (v_model_id, 'G05 (4th Gen)', 2019, NULL) ON CONFLICT (model_id, year_start) DO NOTHING RETURNING id INTO v_gen_id;
  INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, 'B58', '3.0L I6 Turbo (xDrive40i)', '3.0L', 'Gasoline', 375) ON CONFLICT (generation_id, code) DO NOTHING;
  INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, 'S68', '4.4L V8 Turbo (M60i)', '4.4L', 'Gasoline', 523) ON CONFLICT (generation_id, code) DO NOTHING;
END $$;

-- ── More brands (abbreviated) ──────────────────────────────────

DO $$
DECLARE
  v_make_id UUID;
  v_model_id UUID;
  v_gen_id UUID;
BEGIN
  -- Hyundai / Elantra
  SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'hyundai';
  INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Elantra', 'elantra') ON CONFLICT (make_id, slug) DO NOTHING RETURNING id INTO v_model_id;
  INSERT INTO vehicle_generations (model_id, name, year_start, year_end) VALUES (v_model_id, 'CN7 (7th Gen)', 2021, NULL) ON CONFLICT (model_id, year_start) DO NOTHING RETURNING id INTO v_gen_id;
  INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, 'Smartstream G2.0', '2.0L I4', '2.0L', 'Gasoline', 147) ON CONFLICT (generation_id, code) DO NOTHING;

  -- Hyundai / Tucson
  INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Tucson', 'tucson') ON CONFLICT (make_id, slug) DO NOTHING RETURNING id INTO v_model_id;
  INSERT INTO vehicle_generations (model_id, name, year_start, year_end) VALUES (v_model_id, 'NX4 (4th Gen)', 2022, NULL) ON CONFLICT (model_id, year_start) DO NOTHING RETURNING id INTO v_gen_id;
  INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, 'Smartstream G2.5', '2.5L I4', '2.5L', 'Gasoline', 187) ON CONFLICT (generation_id, code) DO NOTHING;

  -- Subaru / Outback
  SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'subaru';
  INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Outback', 'outback') ON CONFLICT (make_id, slug) DO NOTHING RETURNING id INTO v_model_id;
  INSERT INTO vehicle_generations (model_id, name, year_start, year_end) VALUES (v_model_id, 'BT (6th Gen)', 2020, NULL) ON CONFLICT (model_id, year_start) DO NOTHING RETURNING id INTO v_gen_id;
  INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, 'FA24', '2.4L H4 Turbo', '2.4L', 'Gasoline', 260) ON CONFLICT (generation_id, code) DO NOTHING;
  INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, 'FB25', '2.5L H4', '2.5L', 'Gasoline', 182) ON CONFLICT (generation_id, code) DO NOTHING;

  -- Subaru / Forester
  INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Forester', 'forester') ON CONFLICT (make_id, slug) DO NOTHING RETURNING id INTO v_model_id;
  INSERT INTO vehicle_generations (model_id, name, year_start, year_end) VALUES (v_model_id, 'SK (5th Gen)', 2019, NULL) ON CONFLICT (model_id, year_start) DO NOTHING RETURNING id INTO v_gen_id;
  INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, 'FB25', '2.5L H4', '2.5L', 'Gasoline', 182) ON CONFLICT (generation_id, code) DO NOTHING;

  -- Tesla / Model 3
  SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'tesla';
  INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Model 3', 'model-3') ON CONFLICT (make_id, slug) DO NOTHING RETURNING id INTO v_model_id;
  INSERT INTO vehicle_generations (model_id, name, year_start, year_end) VALUES (v_model_id, 'Highland', 2024, NULL) ON CONFLICT (model_id, year_start) DO NOTHING RETURNING id INTO v_gen_id;
  INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, '3D1', 'Single Motor RWD', 'N/A', 'Electric', 271) ON CONFLICT (generation_id, code) DO NOTHING;
  INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, '3D3', 'Dual Motor AWD', 'N/A', 'Electric', 394) ON CONFLICT (generation_id, code) DO NOTHING;

  -- Tesla / Model Y
  INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Model Y', 'model-y') ON CONFLICT (make_id, slug) DO NOTHING RETURNING id INTO v_model_id;
  INSERT INTO vehicle_generations (model_id, name, year_start, year_end) VALUES (v_model_id, 'Juniper', 2025, NULL) ON CONFLICT (model_id, year_start) DO NOTHING RETURNING id INTO v_gen_id;
  INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, '3D5', 'Single Motor RWD', 'N/A', 'Electric', 295) ON CONFLICT (generation_id, code) DO NOTHING;
  INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, '3D7', 'Dual Motor AWD', 'N/A', 'Electric', 384) ON CONFLICT (generation_id, code) DO NOTHING;

  -- Jeep / Wrangler
  SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'jeep';
  INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Wrangler', 'wrangler') ON CONFLICT (make_id, slug) DO NOTHING RETURNING id INTO v_model_id;
  INSERT INTO vehicle_generations (model_id, name, year_start, year_end) VALUES (v_model_id, 'JL (4th Gen)', 2018, NULL) ON CONFLICT (model_id, year_start) DO NOTHING RETURNING id INTO v_gen_id;
  INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, '3.6L Pentastar', '3.6L V6', '3.6L', 'Gasoline', 285) ON CONFLICT (generation_id, code) DO NOTHING;
  INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, '2.0L Turbo', '2.0L I4 Turbo', '2.0L', 'Gasoline', 270) ON CONFLICT (generation_id, code) DO NOTHING;

  -- Dodge / Charger
  SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'dodge';
  INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Charger', 'charger') ON CONFLICT (make_id, slug) DO NOTHING RETURNING id INTO v_model_id;
  INSERT INTO vehicle_generations (model_id, name, year_start, year_end) VALUES (v_model_id, 'LD (7th Gen)', 2015, 2023) ON CONFLICT (model_id, year_start) DO NOTHING RETURNING id INTO v_gen_id;
  INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, '3.6L Pentastar', '3.6L V6', '3.6L', 'Gasoline', 292) ON CONFLICT (generation_id, code) DO NOTHING;
  INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, '6.2L HEMI', '6.2L V8 Supercharged', '6.2L', 'Gasoline', 707) ON CONFLICT (generation_id, code) DO NOTHING;

  -- Lexus / RX
  SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'lexus';
  INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'RX', 'rx') ON CONFLICT (make_id, slug) DO NOTHING RETURNING id INTO v_model_id;
  INSERT INTO vehicle_generations (model_id, name, year_start, year_end) VALUES (v_model_id, 'ALA10 (5th Gen)', 2023, NULL) ON CONFLICT (model_id, year_start) DO NOTHING RETURNING id INTO v_gen_id;
  INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, 'T24A-FTS', '2.4L I4 Turbo (RX350)', '2.4L', 'Gasoline', 275) ON CONFLICT (generation_id, code) DO NOTHING;
  INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, 'A25A-FXS', '2.5L I4 Hybrid (RX350h)', '2.5L', 'Hybrid', 246) ON CONFLICT (generation_id, code) DO NOTHING;

  -- Nissan / Altima
  SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'nissan';
  INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Altima', 'altima') ON CONFLICT (make_id, slug) DO NOTHING RETURNING id INTO v_model_id;
  INSERT INTO vehicle_generations (model_id, name, year_start, year_end) VALUES (v_model_id, 'L34 (6th Gen)', 2019, NULL) ON CONFLICT (model_id, year_start) DO NOTHING RETURNING id INTO v_gen_id;
  INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, 'KR20DDET', '2.0L I4 Turbo', '2.0L', 'Gasoline', 248) ON CONFLICT (generation_id, code) DO NOTHING;
  INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, 'PR25DD', '2.5L I4', '2.5L', 'Gasoline', 188) ON CONFLICT (generation_id, code) DO NOTHING;

  -- Nissan / Rogue
  INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Rogue', 'rogue') ON CONFLICT (make_id, slug) DO NOTHING RETURNING id INTO v_model_id;
  INSERT INTO vehicle_generations (model_id, name, year_start, year_end) VALUES (v_model_id, 'T33 (3rd Gen)', 2021, NULL) ON CONFLICT (model_id, year_start) DO NOTHING RETURNING id INTO v_gen_id;
  INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, 'PR25DD', '1.5L I3 Turbo', '1.5L', 'Gasoline', 201) ON CONFLICT (generation_id, code) DO NOTHING;
END $$;
