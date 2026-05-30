-- RLS policies for vehicle tables (public read access)
-- vehicle_makes, vehicle_models, vehicle_generations, vehicle_engines

ALTER TABLE vehicle_makes ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_engines ENABLE ROW LEVEL SECURITY;

-- Allow public (anon) read access to all vehicle data
CREATE POLICY "Anyone can view vehicle makes" ON vehicle_makes
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view vehicle models" ON vehicle_models
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view vehicle generations" ON vehicle_generations
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view vehicle engines" ON vehicle_engines
  FOR SELECT USING (true);
