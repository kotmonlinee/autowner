-- Vehicle database: Make → Model → Generation → Engine
-- User garage + post-vehicle linking

CREATE TABLE IF NOT EXISTS vehicle_makes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  country TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS vehicle_models (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  make_id UUID REFERENCES vehicle_makes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  UNIQUE(make_id, slug)
);

CREATE TABLE IF NOT EXISTS vehicle_generations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  model_id UUID REFERENCES vehicle_models(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  year_start INTEGER NOT NULL,
  year_end INTEGER,
  UNIQUE(model_id, year_start)
);

CREATE TABLE IF NOT EXISTS vehicle_engines (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  generation_id UUID REFERENCES vehicle_generations(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  displacement TEXT,
  fuel_type TEXT,
  horsepower INTEGER,
  UNIQUE(generation_id, code)
);

CREATE TABLE IF NOT EXISTS user_vehicles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  engine_id UUID REFERENCES vehicle_engines(id) ON DELETE SET NULL,
  year INTEGER,
  nickname TEXT,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS post_vehicles (
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  engine_id UUID REFERENCES vehicle_engines(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, engine_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_vehicle_models_make ON vehicle_models(make_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_generations_model ON vehicle_generations(model_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_engines_generation ON vehicle_engines(generation_id);
CREATE INDEX IF NOT EXISTS idx_user_vehicles_user ON user_vehicles(user_id);
CREATE INDEX IF NOT EXISTS idx_post_vehicles_post ON post_vehicles(post_id);

-- RLS
ALTER TABLE vehicle_makes ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_engines ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_vehicles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read makes" ON vehicle_makes FOR SELECT USING (true);
CREATE POLICY "Anyone can read models" ON vehicle_models FOR SELECT USING (true);
CREATE POLICY "Anyone can read generations" ON vehicle_generations FOR SELECT USING (true);
CREATE POLICY "Anyone can read engines" ON vehicle_engines FOR SELECT USING (true);
CREATE POLICY "Users can manage own vehicles" ON user_vehicles FOR ALL USING (auth.uid() = user_id);

-- Seed data: Top 10 makes
INSERT INTO vehicle_makes (name, slug, country) VALUES
  ('Toyota', 'toyota', 'Japan'),
  ('Honda', 'honda', 'Japan'),
  ('Ford', 'ford', 'USA'),
  ('Chevrolet', 'chevrolet', 'USA'),
  ('BMW', 'bmw', 'Germany'),
  ('Mercedes-Benz', 'mercedes-benz', 'Germany'),
  ('Volkswagen', 'volkswagen', 'Germany'),
  ('Nissan', 'nissan', 'Japan'),
  ('Subaru', 'subaru', 'Japan'),
  ('Tesla', 'tesla', 'USA'),
  ('Audi', 'audi', 'Germany'),
  ('Hyundai', 'hyundai', 'South Korea'),
  ('Kia', 'kia', 'South Korea'),
  ('Mazda', 'mazda', 'Japan'),
  ('Jeep', 'jeep', 'USA');

-- Seed: Core models per make (2-3 each for the most popular)
-- Toyota
INSERT INTO vehicle_models (make_id, name, slug) SELECT id, 'Camry', 'camry' FROM vehicle_makes WHERE slug = 'toyota';
INSERT INTO vehicle_models (make_id, name, slug) SELECT id, 'Corolla', 'corolla' FROM vehicle_makes WHERE slug = 'toyota';
INSERT INTO vehicle_models (make_id, name, slug) SELECT id, 'RAV4', 'rav4' FROM vehicle_makes WHERE slug = 'toyota';
-- Honda
INSERT INTO vehicle_models (make_id, name, slug) SELECT id, 'Civic', 'civic' FROM vehicle_makes WHERE slug = 'honda';
INSERT INTO vehicle_models (make_id, name, slug) SELECT id, 'Accord', 'accord' FROM vehicle_makes WHERE slug = 'honda';
INSERT INTO vehicle_models (make_id, name, slug) SELECT id, 'CR-V', 'cr-v' FROM vehicle_makes WHERE slug = 'honda';
-- Ford
INSERT INTO vehicle_models (make_id, name, slug) SELECT id, 'F-150', 'f-150' FROM vehicle_makes WHERE slug = 'ford';
INSERT INTO vehicle_models (make_id, name, slug) SELECT id, 'Mustang', 'mustang' FROM vehicle_makes WHERE slug = 'ford';
-- BMW
INSERT INTO vehicle_models (make_id, name, slug) SELECT id, '3 Series', '3-series' FROM vehicle_makes WHERE slug = 'bmw';
INSERT INTO vehicle_models (make_id, name, slug) SELECT id, '5 Series', '5-series' FROM vehicle_makes WHERE slug = 'bmw';
INSERT INTO vehicle_models (make_id, name, slug) SELECT id, 'X3', 'x3' FROM vehicle_makes WHERE slug = 'bmw';
-- Tesla
INSERT INTO vehicle_models (make_id, name, slug) SELECT id, 'Model 3', 'model-3' FROM vehicle_makes WHERE slug = 'tesla';
INSERT INTO vehicle_models (make_id, name, slug) SELECT id, 'Model Y', 'model-y' FROM vehicle_makes WHERE slug = 'tesla';

-- Seed: Generations for key models
-- Camry XV70 (2018-2024)
INSERT INTO vehicle_generations (model_id, name, year_start, year_end)
  SELECT id, 'XV70', 2018, 2024 FROM vehicle_models WHERE slug = 'camry';
INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower)
  SELECT id, 'A25A-FKS', '2.5L Dynamic Force I4', '2.5L', 'Gasoline', 203 FROM vehicle_generations WHERE name = 'XV70';

-- Civic 11th Gen (2021-)
INSERT INTO vehicle_generations (model_id, name, year_start)
  SELECT id, '11th Gen (FE/FL)', 2021 FROM vehicle_models WHERE slug = 'civic';
INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower)
  SELECT id, 'L15B7', '1.5L Turbo I4', '1.5L', 'Gasoline', 180 FROM vehicle_generations WHERE name = '11th Gen (FE/FL)';
INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower)
  SELECT id, 'K20C2', '2.0L I4', '2.0L', 'Gasoline', 158 FROM vehicle_generations WHERE name = '11th Gen (FE/FL)';

-- F-150 14th Gen (2021-)
INSERT INTO vehicle_generations (model_id, name, year_start)
  SELECT id, '14th Gen (P702)', 2021 FROM vehicle_models WHERE slug = 'f-150';
INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower)
  SELECT id, '3.5L EcoBoost', '3.5L V6 Turbo', '3.5L', 'Gasoline', 400 FROM vehicle_generations WHERE name = '14th Gen (P702)';
INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower)
  SELECT id, '5.0L Coyote', '5.0L V8', '5.0L', 'Gasoline', 400 FROM vehicle_generations WHERE name = '14th Gen (P702)';

-- BMW 3 Series G20 (2019-)
INSERT INTO vehicle_generations (model_id, name, year_start)
  SELECT id, 'G20/G21', 2019 FROM vehicle_models WHERE slug = '3-series';
INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower)
  SELECT id, 'B48B20', '2.0L TwinPower Turbo I4', '2.0L', 'Gasoline', 255 FROM vehicle_generations WHERE name = 'G20/G21';
INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower)
  SELECT id, 'B58B30', '3.0L TwinPower Turbo I6', '3.0L', 'Gasoline', 382 FROM vehicle_generations WHERE name = 'G20/G21';

-- Tesla Model 3 (2017-)
INSERT INTO vehicle_generations (model_id, name, year_start)
  SELECT id, '1st Gen', 2017 FROM vehicle_models WHERE slug = 'model-3';
INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower)
  SELECT id, 'Model 3 SR', 'Standard Range RWD', 'N/A', 'Electric', 283 FROM vehicle_generations WHERE name = '1st Gen';
INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower)
  SELECT id, 'Model 3 LR', 'Long Range AWD', 'N/A', 'Electric', 346 FROM vehicle_generations WHERE name = '1st Gen';
