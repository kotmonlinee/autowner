-- Auto-generated from json-car-list (1420 models across 135 brands)
-- Add brands not yet in vehicle_makes, then all their models

-- Add missing brands
INSERT INTO vehicle_makes (name, slug) VALUES
  ('Alpine', 'alpine'),
  ('Audi', 'audi'),
  ('BAIC', 'baic'),
  ('Baojun', 'baojun'),
  ('Bentley', 'bentley'),
  ('BMW', 'bmw'),
  ('Bugatti', 'bugatti'),
  ('BYD', 'byd'),
  ('Cadillac', 'cadillac'),
  ('Changan', 'changan'),
  ('Chery', 'chery'),
  ('Chevrolet', 'chevrolet'),
  ('Chrysler', 'chrysler'),
  ('Citroën', 'citroen'),
  ('Dacia', 'dacia'),
  ('Daewoo', 'daewoo'),
  ('Daihatsu', 'daihatsu'),
  ('Dodge', 'dodge'),
  ('Dongfeng', 'dongfeng'),
  ('Exeed', 'exeed'),
  ('Ferrari', 'ferrari'),
  ('Fiat', 'fiat'),
  ('Fisker', 'fisker'),
  ('Ford', 'ford'),
  ('Genesis', 'genesis'),
  ('Geely', 'geely'),
  ('Haval', 'haval'),
  ('Honda', 'honda'),
  ('Hongqi', 'hongqi'),
  ('Hummer', 'hummer'),
  ('Hyundai', 'hyundai'),
  ('Infiniti', 'infiniti'),
  ('Isuzu', 'isuzu'),
  ('JAC', 'jac'),
  ('Jaguar', 'jaguar'),
  ('Jeep', 'jeep'),
  ('Kia', 'kia'),
  ('Koenigsegg', 'koenigsegg'),
  ('Lamborghini', 'lamborghini'),
  ('Lancia', 'lancia'),
  ('Lexus', 'lexus'),
  ('Lotus', 'lotus'),
  ('Lucid', 'lucid'),
  ('Mahindra', 'mahindra'),
  ('Maserati', 'maserati'),
  ('Maybach', 'maybach'),
  ('Mazda', 'mazda'),
  ('McLaren', 'mclaren'),
  ('Mercedes-Benz', 'mercedes-benz'),
  ('MG', 'mg'),
  ('MINI', 'mini'),
  ('Mitsubishi', 'mitsubishi'),
  ('NIO', 'nio'),
  ('Nissan', 'nissan'),
  ('Opel', 'opel'),
  ('Pagani', 'pagani'),
  ('Perodua', 'perodua'),
  ('Peugeot', 'peugeot'),
  ('Polestar', 'polestar'),
  ('Porsche', 'porsche'),
  ('Proton', 'proton'),
  ('Ram', 'ram'),
  ('Renault', 'renault'),
  ('Rivian', 'rivian'),
  ('Rolls-Royce', 'rolls-royce'),
  ('Rover', 'rover'),
  ('Saab', 'saab'),
  ('Seat', 'seat'),
  ('Seres', 'seres'),
  ('Smart', 'smart'),
  ('Subaru', 'subaru'),
  ('Suzuki', 'suzuki'),
  ('Tesla', 'tesla'),
  ('Toyota', 'toyota'),
  ('VinFast', 'vinfast'),
  ('Volkswagen', 'volkswagen'),
  ('Volvo', 'volvo'),
  ('Voyah', 'voyah'),
  ('Wuling', 'wuling'),
  ('XPeng', 'xpeng'),
  ('Zotye', 'zotye')
ON CONFLICT (slug) DO NOTHING
;
-- Alpine
DO $$
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'alpine'
;
IF v_make_id IS NULL THEN RETURN
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'A110', 'a110') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'A110 GT', 'a110-gt') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'A110 R', 'a110-r') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'A110 S', 'a110-s') ON CONFLICT (make_id, slug) DO NOTHING
;
-- Audi
DO $$
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'audi'
;
IF v_make_id IS NULL THEN RETURN
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '100', '100') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '100 Avant', '100-avant') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '80', '80') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '80 Avant', '80-avant') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '80 Cabrio', '80-cabrio') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '90', '90') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'A1', 'a1') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'A2', 'a2') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'A3', 'a3') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'A3 Cabriolet', 'a3-cabriolet') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'A3 Limuzina', 'a3-limuzina') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'A3 Sportback', 'a3-sportback') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'A4', 'a4') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'A4 Allroad', 'a4-allroad') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'A4 Avant', 'a4-avant') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'A4 Cabriolet', 'a4-cabriolet') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'A5', 'a5') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'A5 Cabriolet', 'a5-cabriolet') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'A5 Sportback', 'a5-sportback') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'A6', 'a6') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'A6 Allroad', 'a6-allroad') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'A6 Avant', 'a6-avant') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'A7', 'a7') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'A8', 'a8') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'A8 Long', 'a8-long') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'E5', 'e5') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Q3', 'q3') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Q4 e-tron', 'q4-e-tron') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Q5', 'q5') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Q7', 'q7') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'R8', 'r8') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'RS4 Cabriolet', 'rs4-cabriolet') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'RS4/RS4 Avant', 'rs4-rs4-avant') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'RS5', 'rs5') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'RS6 Avant', 'rs6-avant') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'RS7', 'rs7') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'S3/S3 Sportback', 's3-s3-sportback') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'S4 Cabriolet', 's4-cabriolet') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'S4/S4 Avant', 's4-s4-avant') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'S5/S5 Cabriolet', 's5-s5-cabriolet') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'S6/RS6', 's6-rs6') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'S7', 's7') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'S8', 's8') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'SQ5', 'sq5') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'TT Coupé', 'tt-coupé') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'TT Roadster', 'tt-roadster') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'TTS', 'tts') ON CONFLICT (make_id, slug) DO NOTHING
;
-- BAIC
DO $$
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'baic'
;
IF v_make_id IS NULL THEN RETURN
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'EC5', 'ec5') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'EU-X', 'eu-x') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'EU5', 'eu5') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'EX360', 'ex360') ON CONFLICT (make_id, slug) DO NOTHING
;
-- Baojun
DO $$
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'baojun'
;
IF v_make_id IS NULL THEN RETURN
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '310', '310') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '510', '510') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '530', '530') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'E100', 'e100') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'E200', 'e200') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'E300', 'e300') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'KiWi EV', 'kiwi-ev') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'RC-5', 'rc-5') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'RC-6', 'rc-6') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'RM-5', 'rm-5') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'RS-3', 'rs-3') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'RS-5', 'rs-5') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'RS-7', 'rs-7') ON CONFLICT (make_id, slug) DO NOTHING
;
-- Bentley
DO $$
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'bentley'
;
IF v_make_id IS NULL THEN RETURN
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Arnage', 'arnage') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Azure', 'azure') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Bentayga', 'bentayga') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Brooklands', 'brooklands') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Continental', 'continental') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Continental Flying Spur', 'continental-flying-spur') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Continental GT', 'continental-gt') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Continental GTC', 'continental-gtc') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Flying Spur', 'flying-spur') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Mulsanne', 'mulsanne') ON CONFLICT (make_id, slug) DO NOTHING
;
-- BMW
DO $$
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'bmw'
;
IF v_make_id IS NULL THEN RETURN
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'i3', 'i3') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'i8', 'i8') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'iX', 'ix') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'iX3', 'ix3') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'M3', 'm3') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'M4', 'm4') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'M5', 'm5') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'M6', 'm6') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Rad 1', 'rad-1') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Rad 1 Cabrio', 'rad-1-cabrio') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Rad 1 Coupé', 'rad-1-coupé') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Rad 2', 'rad-2') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Rad 2 Active Tourer', 'rad-2-active-tourer') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Rad 2 Coupé', 'rad-2-coupé') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Rad 2 Gran Tourer', 'rad-2-gran-tourer') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Rad 3', 'rad-3') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Rad 3 Cabrio', 'rad-3-cabrio') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Rad 3 Compact', 'rad-3-compact') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Rad 3 Coupé', 'rad-3-coupé') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Rad 3 GT', 'rad-3-gt') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Rad 3 Touring', 'rad-3-touring') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Rad 4', 'rad-4') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Rad 4 Cabrio', 'rad-4-cabrio') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Rad 4 Gran Coupé', 'rad-4-gran-coupé') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Rad 5', 'rad-5') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Rad 5 GT', 'rad-5-gt') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Rad 5 Touring', 'rad-5-touring') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Rad 6', 'rad-6') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Rad 6 Cabrio', 'rad-6-cabrio') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Rad 6 Coupé', 'rad-6-coupé') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Rad 6 Gran Coupé', 'rad-6-gran-coupé') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Rad 7', 'rad-7') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Rad 8 Coupé', 'rad-8-coupé') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'X1', 'x1') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'X2', 'x2') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'X3', 'x3') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'X4', 'x4') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'X5', 'x5') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'X6', 'x6') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Z3', 'z3') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Z3 Coupé', 'z3-coupé') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Z3 Roadster', 'z3-roadster') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Z4', 'z4') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Z4 Roadster', 'z4-roadster') ON CONFLICT (make_id, slug) DO NOTHING
;
-- Bugatti
DO $$
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'bugatti'
;
IF v_make_id IS NULL THEN RETURN
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Chiron', 'chiron') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Divo', 'divo') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Veyron', 'veyron') ON CONFLICT (make_id, slug) DO NOTHING
;
-- BYD
DO $$
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'byd'
;
IF v_make_id IS NULL THEN RETURN
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Denza', 'denza') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Denza Z9 GT EV', 'denza-z9-gt-ev') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Dolphin', 'dolphin') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Han', 'han') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Seal', 'seal') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Seal 07 DM-i', 'seal-07-dm-i') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Sealion 07 EV', 'sealion-07-ev') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Sealion 7', 'sealion-7') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Song Max', 'song-max') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Tang', 'tang') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Yangwang U8', 'yangwang-u8') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Yangwang U9', 'yangwang-u9') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Yuan Plus', 'yuan-plus') ON CONFLICT (make_id, slug) DO NOTHING
;
-- Cadillac
DO $$
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'cadillac'
;
IF v_make_id IS NULL THEN RETURN
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'ATS', 'ats') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'BLS', 'bls') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'CT5', 'ct5') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'CT6', 'ct6') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'CTS', 'cts') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'DeVille', 'deville') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Eldorado', 'eldorado') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Escalade', 'escalade') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Seville', 'seville') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'SRX', 'srx') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'STS', 'sts') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'XT4', 'xt4') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'XT5', 'xt5') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'XT6', 'xt6') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'XTS', 'xts') ON CONFLICT (make_id, slug) DO NOTHING
;
-- Changan
DO $$
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'changan'
;
IF v_make_id IS NULL THEN RETURN
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Alsvin', 'alsvin') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'BenBen', 'benben') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'CS35', 'cs35') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'CS55', 'cs55') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'CS75 Plus', 'cs75-plus') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Eado', 'eado') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'UNI-E', 'uni-e') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'UNI-K', 'uni-k') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'UNI-T', 'uni-t') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'UNI-V', 'uni-v') ON CONFLICT (make_id, slug) DO NOTHING
;
-- Chery
DO $$
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'chery'
;
IF v_make_id IS NULL THEN RETURN
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Arrizo 5', 'arrizo-5') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Arrizo 5 Plus', 'arrizo-5-plus') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Arrizo 7', 'arrizo-7') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Arrizo 8', 'arrizo-8') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'E5', 'e5') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'QQ', 'qq') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Tiggo 2', 'tiggo-2') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Tiggo 3', 'tiggo-3') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Tiggo 4', 'tiggo-4') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Tiggo 5', 'tiggo-5') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Tiggo 7', 'tiggo-7') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Tiggo 8', 'tiggo-8') ON CONFLICT (make_id, slug) DO NOTHING
;
-- Chevrolet
DO $$
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'chevrolet'
;
IF v_make_id IS NULL THEN RETURN
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Alero', 'alero') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Aveo', 'aveo') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Blazer', 'blazer') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Camaro', 'camaro') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Captiva', 'captiva') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Corvette', 'corvette') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Cruze', 'cruze') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Cruze SW', 'cruze-sw') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Epica', 'epica') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Equinox', 'equinox') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Evanda', 'evanda') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'HHR', 'hhr') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Kalos', 'kalos') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Lacetti', 'lacetti') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Lacetti SW', 'lacetti-sw') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Lumina', 'lumina') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Malibu', 'malibu') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Matiz', 'matiz') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Monte Carlo', 'monte-carlo') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Nubira', 'nubira') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Orlando', 'orlando') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Spark', 'spark') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Suburban', 'suburban') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Tacuma', 'tacuma') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Tahoe', 'tahoe') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Trax', 'trax') ON CONFLICT (make_id, slug) DO NOTHING
;
-- Chrysler
DO $$
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'chrysler'
;
IF v_make_id IS NULL THEN RETURN
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '300C', '300c') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '300M', '300m') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Crossfire', 'crossfire') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Grand Voyager', 'grand-voyager') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Neon', 'neon') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Pacifica', 'pacifica') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Plymouth', 'plymouth') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'PT Cruiser', 'pt-cruiser') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Sebring', 'sebring') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Stratus', 'stratus') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Viper', 'viper') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Vision', 'vision') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Voyager', 'voyager') ON CONFLICT (make_id, slug) DO NOTHING
;
-- Citroën
DO $$
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'citroen'
;
IF v_make_id IS NULL THEN RETURN
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Berlingo', 'berlingo') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'C-Crosser', 'c-crosser') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'C-Elissée', 'c-elissée') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'C-Zero', 'c-zero') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'C1', 'c1') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'C2', 'c2') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'C3', 'c3') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'C3 Aircross', 'c3-aircross') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'C3 Picasso', 'c3-picasso') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'C4', 'c4') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'C4 Aircross', 'c4-aircross') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'C4 Cactus', 'c4-cactus') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'C4 Coupé', 'c4-coupé') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'C4 Grand Picasso', 'c4-grand-picasso') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'C4 Sedan', 'c4-sedan') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'C4 SpaceTourer', 'c4-spacetourer') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'C5', 'c5') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'C5 Break', 'c5-break') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'C5 Tourer', 'c5-tourer') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'C5 X', 'c5-x') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'C6', 'c6') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'C8', 'c8') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'DS3', 'ds3') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'DS4', 'ds4') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'DS5', 'ds5') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Evasion', 'evasion') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Jumper', 'jumper') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Jumpy', 'jumpy') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Nemo', 'nemo') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Saxo', 'saxo') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Xantia', 'xantia') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Xsara', 'xsara') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'ë-C4', 'e-c4') ON CONFLICT (make_id, slug) DO NOTHING
;
-- Dacia
DO $$
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'dacia'
;
IF v_make_id IS NULL THEN RETURN
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Bigster', 'bigster') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Dokker', 'dokker') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Duster', 'duster') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Jogger', 'jogger') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Lodgy', 'lodgy') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Logan', 'logan') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Logan MCV', 'logan-mcv') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Logan Van', 'logan-van') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Sandero', 'sandero') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Solenza', 'solenza') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Spring', 'spring') ON CONFLICT (make_id, slug) DO NOTHING
;
-- Daewoo
DO $$
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'daewoo'
;
IF v_make_id IS NULL THEN RETURN
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Espero', 'espero') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Kalos', 'kalos') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Lacetti', 'lacetti') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Lanos', 'lanos') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Leganza', 'leganza') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Lublin', 'lublin') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Matiz', 'matiz') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Nexia', 'nexia') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Nubira', 'nubira') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Nubira kombi', 'nubira-kombi') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Racer', 'racer') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Rezzo', 'rezzo') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Tacuma', 'tacuma') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Tico', 'tico') ON CONFLICT (make_id, slug) DO NOTHING
;
-- Daihatsu
DO $$
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'daihatsu'
;
IF v_make_id IS NULL THEN RETURN
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Altis', 'altis') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Atrai', 'atrai') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Boon', 'boon') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Copen', 'copen') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Hijet', 'hijet') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Mira', 'mira') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Rocky', 'rocky') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Sirion', 'sirion') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Terios', 'terios') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Thor', 'thor') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Tanto', 'tanto') ON CONFLICT (make_id, slug) DO NOTHING
;
-- Dodge
DO $$
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'dodge'
;
IF v_make_id IS NULL THEN RETURN
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Avenger', 'avenger') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Caliber', 'caliber') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Challenger', 'challenger') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Charger', 'charger') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Dakota', 'dakota') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Durango', 'durango') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Grand Caravan', 'grand-caravan') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Journey', 'journey') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Magnum', 'magnum') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Nitro', 'nitro') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'RAM', 'ram') ON CONFLICT (make_id, slug) DO NOTHING
;
-- Dongfeng
DO $$
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'dongfeng'
;
IF v_make_id IS NULL THEN RETURN
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Fengon E3', 'fengon-e3') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Fengon E5', 'fengon-e5') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Fengon E6', 'fengon-e6') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Junfeng EV', 'junfeng-ev') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Kangdian EV', 'kangdian-ev') ON CONFLICT (make_id, slug) DO NOTHING
;
-- Exeed
DO $$
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'exeed'
;
IF v_make_id IS NULL THEN RETURN
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'TX', 'tx') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'VX', 'vx') ON CONFLICT (make_id, slug) DO NOTHING
;
-- Ferrari
DO $$
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'ferrari'
;
IF v_make_id IS NULL THEN RETURN
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '348', '348') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '360 Modena', '360-modena') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '458 Italia', '458-italia') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '488 GTB', '488-gtb') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '512', '512') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '550 Maranello', '550-maranello') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '575M Maranello', '575m-maranello') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '599 GTB Fiorano', '599-gtb-fiorano') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '612 Scaglietti', '612-scaglietti') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '812 Superfast', '812-superfast') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'California', 'california') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Enzo', 'enzo') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'F12berlinetta', 'f12berlinetta') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'F355', 'f355') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'F430', 'f430') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'FF', 'ff') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'LaFerrari', 'laferrari') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Portofino', 'portofino') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Roma', 'roma') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'SF90 Stradale', 'sf90-stradale') ON CONFLICT (make_id, slug) DO NOTHING
;
-- Fiat
DO $$
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'fiat'
;
IF v_make_id IS NULL THEN RETURN
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '124 Spider', '124-spider') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '500', '500') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '500C', '500c') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '500L', '500l') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '500X', '500x') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '850', '850') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Barchetta', 'barchetta') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Brava', 'brava') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Cinquecento', 'cinquecento') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Coupé', 'coupé') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Croma', 'croma') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Doblo', 'doblo') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Doblo Cargo', 'doblo-cargo') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Doblo Kombi', 'doblo-kombi') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Ducato', 'ducato') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Ducato Van', 'ducato-van') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Freemont', 'freemont') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Fullback', 'fullback') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Grande Punto', 'grande-punto') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Idea', 'idea') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Linea', 'linea') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Marea', 'marea') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Marea Weekend', 'marea-weekend') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Multipla', 'multipla') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Palio', 'palio') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Panda', 'panda') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Panda 4x4', 'panda-4x4') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Punto', 'punto') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Punto Cabrio', 'punto-cabrio') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Punto Evo', 'punto-evo') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Qubo', 'qubo') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Scudo', 'scudo') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Sedici', 'sedici') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Seicento', 'seicento') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Stilo', 'stilo') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Strada', 'strada') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Talento', 'talento') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Tipo', 'tipo') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Ulysse', 'ulysse') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Uno', 'uno') ON CONFLICT (make_id, slug) DO NOTHING
;
-- Fisker
DO $$
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'fisker'
;
IF v_make_id IS NULL THEN RETURN
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Alaska', 'alaska') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Atlantic', 'atlantic') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Karma', 'karma') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Ocean', 'ocean') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Pear', 'pear') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Ronin', 'ronin') ON CONFLICT (make_id, slug) DO NOTHING
;
-- Ford
DO $$
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'ford'
;
IF v_make_id IS NULL THEN RETURN
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'B-MAX', 'b-max') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'C-MAX', 'c-max') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Cougar', 'cougar') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Edge', 'edge') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Escort', 'escort') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Escort Cabrio', 'escort-cabrio') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Escort kombi', 'escort-kombi') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Explorer', 'explorer') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Fiesta', 'fiesta') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Fiesta Courier', 'fiesta-courier') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Focus', 'focus') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Focus C-MAX', 'focus-c-max') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Focus Cabrio', 'focus-cabrio') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Focus kombi', 'focus-kombi') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Galaxy', 'galaxy') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Grand C-MAX', 'grand-c-max') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Ka', 'ka') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Kuga', 'kuga') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Mondeo', 'mondeo') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Mondeo kombi', 'mondeo-kombi') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Mustang', 'mustang') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Orion', 'orion') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Puma', 'puma') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Ranger', 'ranger') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'S-MAX', 's-max') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Sierra', 'sierra') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Streetka', 'streetka') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Tourneo Connect', 'tourneo-connect') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Tourneo Courier', 'tourneo-courier') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Transit', 'transit') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Transit Bus', 'transit-bus') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Transit Connect', 'transit-connect') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Transit Courier', 'transit-courier') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Transit Custom', 'transit-custom') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Transit Van', 'transit-van') ON CONFLICT (make_id, slug) DO NOTHING
;
-- Genesis
DO $$
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'genesis'
;
IF v_make_id IS NULL THEN RETURN
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'G70', 'g70') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'G80', 'g80') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'G90', 'g90') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'GV60', 'gv60') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'GV70', 'gv70') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'GV80', 'gv80') ON CONFLICT (make_id, slug) DO NOTHING
;
-- Geely
DO $$
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'geely'
;
IF v_make_id IS NULL THEN RETURN
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Atlas', 'atlas') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Binrui', 'binrui') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Borui', 'borui') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Emgrand 7', 'emgrand-7') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Emgrand GT', 'emgrand-gt') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Emgrand X7', 'emgrand-x7') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Icon', 'icon') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Okavango', 'okavango') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Panda', 'panda') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Tugella', 'tugella') ON CONFLICT (make_id, slug) DO NOTHING
;
-- Haval
DO $$
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'haval'
;
IF v_make_id IS NULL THEN RETURN
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Big Dog', 'big-dog') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Chulian', 'chulian') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Dargo', 'dargo') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'F7', 'f7') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'F7x', 'f7x') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'H6', 'h6') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'H9', 'h9') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Jolion', 'jolion') ON CONFLICT (make_id, slug) DO NOTHING
;
-- Honda
DO $$
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'honda'
;
IF v_make_id IS NULL THEN RETURN
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Accord', 'accord') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Accord Coupé', 'accord-coupé') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'City', 'city') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Civic', 'civic') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Civic Aerodeck', 'civic-aerodeck') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Civic Coupé', 'civic-coupé') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Civic Tourer', 'civic-tourer') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Civic Type R', 'civic-type-r') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Concerto', 'concerto') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'CR-V', 'cr-v') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'CR-Z', 'cr-z') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Element', 'element') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'FR-V', 'fr-v') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'HR-V', 'hr-v') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Insight', 'insight') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Integra', 'integra') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Jazz', 'jazz') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Legend', 'legend') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Logo', 'logo') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'NSX', 'nsx') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Prelude', 'prelude') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'S2000', 's2000') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Shuttle', 'shuttle') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Stream', 'stream') ON CONFLICT (make_id, slug) DO NOTHING
;
-- Hongqi
DO $$
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'hongqi'
;
IF v_make_id IS NULL THEN RETURN
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'E-HS9', 'e-hs9') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'H5', 'h5') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'H9', 'h9') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'L5', 'l5') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'S9', 's9') ON CONFLICT (make_id, slug) DO NOTHING
;
-- Hummer
DO $$
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'hummer'
;
IF v_make_id IS NULL THEN RETURN
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'H2', 'h2') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'H3', 'h3') ON CONFLICT (make_id, slug) DO NOTHING
;
-- Hyundai
DO $$
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'hyundai'
;
IF v_make_id IS NULL THEN RETURN
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Accent', 'accent') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Atos', 'atos') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Azera', 'azera') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Coupé', 'coupé') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Creta', 'creta') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Elantra', 'elantra') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Galloper', 'galloper') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Genesis', 'genesis') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Getz', 'getz') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Grandeur', 'grandeur') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'H 350', 'h-350') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'H1', 'h1') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'i10', 'i10') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'i20', 'i20') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'i30', 'i30') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'i30 CW', 'i30-cw') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'i40', 'i40') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'i40 CW', 'i40-cw') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Ioniq', 'ioniq') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'ix20', 'ix20') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'ix35', 'ix35') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Kona', 'kona') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Lantra', 'lantra') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Matrix', 'matrix') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Palisade', 'palisade') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Santa Fe', 'santa-fe') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Sonata', 'sonata') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Staria', 'staria') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Terracan', 'terracan') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Tucson', 'tucson') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Veloster', 'veloster') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Venue', 'venue') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'XG 30', 'xg-30') ON CONFLICT (make_id, slug) DO NOTHING
;
-- Infiniti
DO $$
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'infiniti'
;
IF v_make_id IS NULL THEN RETURN
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'EX', 'ex') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'FX', 'fx') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'G', 'g') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'G Coupé', 'g-coupé') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'JX', 'jx') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'M', 'm') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Q', 'q') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Q30', 'q30') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Q50', 'q50') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Q60', 'q60') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Q70', 'q70') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'QX', 'qx') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'QX30', 'qx30') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'QX50', 'qx50') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'QX60', 'qx60') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'QX70', 'qx70') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'QX80', 'qx80') ON CONFLICT (make_id, slug) DO NOTHING
;
-- Isuzu
DO $$
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'isuzu'
;
IF v_make_id IS NULL THEN RETURN
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Amigo', 'amigo') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Ascender', 'ascender') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Axiom', 'axiom') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'D-Max', 'd-max') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Hombre', 'hombre') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'MU-7', 'mu-7') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'MU-X', 'mu-x') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Rodeo', 'rodeo') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Trooper', 'trooper') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'VehiCROSS', 'vehicross') ON CONFLICT (make_id, slug) DO NOTHING
;
-- JAC
DO $$
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'jac'
;
IF v_make_id IS NULL THEN RETURN
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'iEV6S', 'iev6s') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'iEV7S', 'iev7s') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Refine E6', 'refine-e6') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Refine S4', 'refine-s4') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Refine S5', 'refine-s5') ON CONFLICT (make_id, slug) DO NOTHING
;
-- Jaguar
DO $$
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'jaguar'
;
IF v_make_id IS NULL THEN RETURN
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Daimler', 'daimler') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'F-Pace', 'f-pace') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'F-Type', 'f-type') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'S-Type', 's-type') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'X-Type', 'x-type') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'XE', 'xe') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'XF', 'xf') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'XJ', 'xj') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'XK', 'xk') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'XK8', 'xk8') ON CONFLICT (make_id, slug) DO NOTHING
;
-- Jeep
DO $$
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'jeep'
;
IF v_make_id IS NULL THEN RETURN
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Cherokee', 'cherokee') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Commander', 'commander') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Compass', 'compass') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Grand Cherokee', 'grand-cherokee') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Patriot', 'patriot') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Renegade', 'renegade') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Wrangler', 'wrangler') ON CONFLICT (make_id, slug) DO NOTHING
;
-- Kia
DO $$
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'kia'
;
IF v_make_id IS NULL THEN RETURN
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Carens', 'carens') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Carnival', 'carnival') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Ceed', 'ceed') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Ceed SW', 'ceed-sw') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Cerato', 'cerato') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Joice', 'joice') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'K2500', 'k2500') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Magentis', 'magentis') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Niro', 'niro') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Opirus', 'opirus') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Optima', 'optima') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Picanto', 'picanto') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Pregio', 'pregio') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Pride', 'pride') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'ProCeed', 'proceed') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Rio', 'rio') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Rio Combi', 'rio-combi') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Sephia', 'sephia') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Shuma', 'shuma') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Sorento', 'sorento') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Soul', 'soul') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Sportage', 'sportage') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Venga', 'venga') ON CONFLICT (make_id, slug) DO NOTHING
;
-- Koenigsegg
DO $$
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'koenigsegg'
;
IF v_make_id IS NULL THEN RETURN
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Agera', 'agera') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'CC8S', 'cc8s') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'CCX', 'ccx') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Gemera', 'gemera') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Jesko', 'jesko') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'One:1', 'one:1') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Regera', 'regera') ON CONFLICT (make_id, slug) DO NOTHING
;
-- Lamborghini
DO $$
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'lamborghini'
;
IF v_make_id IS NULL THEN RETURN
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Aventador', 'aventador') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Countach', 'countach') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Diablo', 'diablo') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Gallardo', 'gallardo') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Huracán', 'huracán') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Murciélago', 'murciélago') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Reventón', 'reventón') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Sian', 'sian') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Urus', 'urus') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Veneno', 'veneno') ON CONFLICT (make_id, slug) DO NOTHING
;
-- Lancia
DO $$
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'lancia'
;
IF v_make_id IS NULL THEN RETURN
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Delta', 'delta') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Lybra', 'lybra') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Musa', 'musa') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Phedra', 'phedra') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Thesis', 'thesis') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Ypsilon', 'ypsilon') ON CONFLICT (make_id, slug) DO NOTHING
;
-- Lexus
DO $$
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'lexus'
;
IF v_make_id IS NULL THEN RETURN
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'CT', 'ct') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'GS', 'gs') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'GS 300', 'gs-300') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'GX', 'gx') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'IS', 'is') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'IS 200', 'is-200') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'IS 250 C', 'is-250-c') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'IS-F', 'is-f') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'LS', 'ls') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'LX', 'lx') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'NX', 'nx') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'RC F', 'rc-f') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'RX', 'rx') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'RX 300', 'rx-300') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'RX 400h', 'rx-400h') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'RX 450h', 'rx-450h') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'SC 430', 'sc-430') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'UX', 'ux') ON CONFLICT (make_id, slug) DO NOTHING
;
-- Lotus
DO $$
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'lotus'
;
IF v_make_id IS NULL THEN RETURN
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Elan', 'elan') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Elise', 'elise') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Emira', 'emira') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Evija', 'evija') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Evora', 'evora') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Exige', 'exige') ON CONFLICT (make_id, slug) DO NOTHING
;
-- Lucid
DO $$
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'lucid'
;
IF v_make_id IS NULL THEN RETURN
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Air', 'air') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Gravity', 'gravity') ON CONFLICT (make_id, slug) DO NOTHING
;
-- Mahindra
DO $$
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'mahindra'
;
IF v_make_id IS NULL THEN RETURN
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Bolero', 'bolero') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'KUV100', 'kuv100') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Marazzo', 'marazzo') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Scorpio', 'scorpio') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Thar', 'thar') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'TUV300', 'tuv300') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'XUV300', 'xuv300') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'XUV500', 'xuv500') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'XUV700', 'xuv700') ON CONFLICT (make_id, slug) DO NOTHING
;
-- Maserati
DO $$
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'maserati'
;
IF v_make_id IS NULL THEN RETURN
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '3200 GT', '3200-gt') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '4200', '4200') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Ghibli', 'ghibli') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'GranCabrio', 'grancabrio') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'GranTurismo', 'granturismo') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Levante', 'levante') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'MC20', 'mc20') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Quattroporte', 'quattroporte') ON CONFLICT (make_id, slug) DO NOTHING
;
-- Maybach
DO $$
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'maybach'
;
IF v_make_id IS NULL THEN RETURN
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '57', '57') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '57S', '57s') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '62', '62') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '62S', '62s') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'GLS 600', 'gls-600') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Landaulet', 'landaulet') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'S480', 's480') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'S580', 's580') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'S650', 's650') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'S680', 's680') ON CONFLICT (make_id, slug) DO NOTHING
;
-- Mazda
DO $$
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'mazda'
;
IF v_make_id IS NULL THEN RETURN
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '121', '121') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '2', '2') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '3', '3') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '323', '323') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '323 Combi', '323-combi') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '323 Coupé', '323-coupé') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '323 F', '323-f') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '5', '5') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '6', '6') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '6 Combi', '6-combi') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '626', '626') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '626 Combi', '626-combi') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'B-Fighter', 'b-fighter') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'B2500', 'b2500') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'BT', 'bt') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'CX-3', 'cx-3') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'CX-30', 'cx-30') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'CX-5', 'cx-5') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'CX-60', 'cx-60') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'CX-7', 'cx-7') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'CX-9', 'cx-9') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Demio', 'demio') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'MPV', 'mpv') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'MX-3', 'mx-3') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'MX-5', 'mx-5') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'MX-6', 'mx-6') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Premacy', 'premacy') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'RX-7', 'rx-7') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'RX-8', 'rx-8') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Xedox 6', 'xedox-6') ON CONFLICT (make_id, slug) DO NOTHING
;
-- McLaren
DO $$
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'mclaren'
;
IF v_make_id IS NULL THEN RETURN
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '540C', '540c') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '570GT', '570gt') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '570S', '570s') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '600LT', '600lt') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '650S', '650s') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '675LT', '675lt') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '720S', '720s') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '765LT', '765lt') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'GT', 'gt') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'P1', 'p1') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Senna', 'senna') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Speedtail', 'speedtail') ON CONFLICT (make_id, slug) DO NOTHING
;
-- Mercedes-Benz
DO $$
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'mercedes-benz'
;
IF v_make_id IS NULL THEN RETURN
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '100 D', '100-d') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '115', '115') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '124', '124') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '126', '126') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '190', '190') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '190 D', '190-d') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '190 E', '190-e') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '200 - 300', '200---300') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '200 D', '200-d') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '200 E', '200-e') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '210 Van', '210-van') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '210 kombi', '210-kombi') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '230 - 300 CE Coupé', '230---300-ce-coupé') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '260 - 560 SE', '260---560-se') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '260 - 560 SEL', '260---560-sel') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '310 Van', '310-van') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '310 kombi', '310-kombi') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '500 - 600 SEC Coupé', '500---600-sec-coupé') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'A', 'a') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'A L', 'a-l') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'AMG GT', 'amg-gt') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'C', 'c') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'C Sportcoupé', 'c-sportcoupé') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'C T', 'c-t') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Citan', 'citan') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'CLA', 'cla') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'CLC', 'clc') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'CLK Cabrio', 'clk-cabrio') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'CLK Coupé', 'clk-coupé') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'CLS', 'cls') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'E', 'e') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'E Cabrio', 'e-cabrio') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'E Coupé', 'e-coupé') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'E T', 'e-t') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'EQC', 'eqc') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'EQS', 'eqs') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'G', 'g') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'G Cabrio', 'g-cabrio') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'GL', 'gl') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'GLA', 'gla') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'GLB', 'glb') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'GLC', 'glc') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'GLE', 'gle') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'GLK', 'glk') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'LS', 'ls') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'LX', 'lx') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'M', 'm') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'R', 'r') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'S', 's') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'S Coupé', 's-coupé') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'SC', 'sc') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'SL', 'sl') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'SLC', 'slc') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'SLK', 'slk') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'SLR', 'slr') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Sprinter', 'sprinter') ON CONFLICT (make_id, slug) DO NOTHING
;
-- MG
DO $$
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'mg'
;
IF v_make_id IS NULL THEN RETURN
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '3', '3') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '5', '5') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '6', '6') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Astor', 'astor') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Cyberster', 'cyberster') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Gloster', 'gloster') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Hector', 'hector') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'ZS', 'zs') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'ZS EV', 'zs-ev') ON CONFLICT (make_id, slug) DO NOTHING
;
-- MINI
DO $$
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'mini'
;
IF v_make_id IS NULL THEN RETURN
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Cooper', 'cooper') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Cooper Cabrio', 'cooper-cabrio') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Cooper Clubman', 'cooper-clubman') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Cooper D', 'cooper-d') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Cooper D Clubman', 'cooper-d-clubman') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Cooper S', 'cooper-s') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Cooper S Cabrio', 'cooper-s-cabrio') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Cooper S Clubman', 'cooper-s-clubman') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Countryman', 'countryman') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Mini One', 'mini-one') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'One D', 'one-d') ON CONFLICT (make_id, slug) DO NOTHING
;
-- Mitsubishi
DO $$
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'mitsubishi'
;
IF v_make_id IS NULL THEN RETURN
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '3000 GT', '3000-gt') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'ASX', 'asx') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Carisma', 'carisma') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Colt', 'colt') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Colt CC', 'colt-cc') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Eclipse', 'eclipse') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Eclipse Cross', 'eclipse-cross') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Fuso canter', 'fuso-canter') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Galant', 'galant') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Galant Combi', 'galant-combi') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Grandis', 'grandis') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'L200', 'l200') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'L200 Pick up', 'l200-pick-up') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'L200 Pick up Allrad', 'l200-pick-up-allrad') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'L300', 'l300') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Lancer', 'lancer') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Lancer Combi', 'lancer-combi') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Lancer Evo', 'lancer-evo') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Lancer Sportback', 'lancer-sportback') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Outlander', 'outlander') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Pajero', 'pajero') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Pajero Pinin', 'pajero-pinin') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Pajero Pinin Wagon', 'pajero-pinin-wagon') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Pajero Sport', 'pajero-sport') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Pajero Wagon', 'pajero-wagon') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Space Star', 'space-star') ON CONFLICT (make_id, slug) DO NOTHING
;
-- NIO
DO $$
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'nio'
;
IF v_make_id IS NULL THEN RETURN
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'EC6', 'ec6') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'EP9', 'ep9') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'ES6', 'es6') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'ES7', 'es7') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'ES8', 'es8') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'ES9', 'es9') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'ET5', 'et5') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'ET7', 'et7') ON CONFLICT (make_id, slug) DO NOTHING
;
-- Nissan
DO $$
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'nissan'
;
IF v_make_id IS NULL THEN RETURN
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '100 NX', '100-nx') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '200 SX', '200-sx') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '350 Z', '350-z') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '370 Z', '370-z') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Almera', 'almera') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Almera Tino', 'almera-tino') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'GT-R', 'gt-r') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Interstar', 'interstar') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Juke', 'juke') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'King Cab', 'king-cab') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Leaf', 'leaf') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Maxima', 'maxima') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Micra', 'micra') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Murano', 'murano') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Navara', 'navara') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Note', 'note') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'NP300 Pickup', 'np300-pickup') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'NV200', 'nv200') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'NV400', 'nv400') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Pathfinder', 'pathfinder') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Patrol', 'patrol') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Pick Up', 'pick-up') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Primastar', 'primastar') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Primera', 'primera') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Pulsar', 'pulsar') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Qashqai', 'qashqai') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Serena', 'serena') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Terrano', 'terrano') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Tiida', 'tiida') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Trade', 'trade') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Vanette Cargo', 'vanette-cargo') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'X-Trail', 'x-trail') ON CONFLICT (make_id, slug) DO NOTHING
;
-- Opel
DO $$
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'opel'
;
IF v_make_id IS NULL THEN RETURN
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Agila', 'agila') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Ampera', 'ampera') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Antara', 'antara') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Astra', 'astra') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Astra cabrio', 'astra-cabrio') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Astra caravan', 'astra-caravan') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Astra coupé', 'astra-coupé') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Astra Electric', 'astra-electric') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Calibra', 'calibra') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Campo', 'campo') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Cascada', 'cascada') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Corsa', 'corsa') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Crossland', 'crossland') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Frontera', 'frontera') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Grandland', 'grandland') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Insignia', 'insignia') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Insignia kombi', 'insignia-kombi') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Kadett', 'kadett') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Meriva', 'meriva') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Mokka', 'mokka') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Mokka-e', 'mokka-e') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Movano', 'movano') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Omega', 'omega') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Signum', 'signum') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Vectra', 'vectra') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Vectra Caravan', 'vectra-caravan') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Vivaro', 'vivaro') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Vivaro Kombi', 'vivaro-kombi') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Zafira', 'zafira') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Zafira Life', 'zafira-life') ON CONFLICT (make_id, slug) DO NOTHING
;
-- Pagani
DO $$
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'pagani'
;
IF v_make_id IS NULL THEN RETURN
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Huayra', 'huayra') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Huayra BC', 'huayra-bc') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Huayra Imola', 'huayra-imola') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Huayra Roadster', 'huayra-roadster') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Zonda', 'zonda') ON CONFLICT (make_id, slug) DO NOTHING
;
-- Perodua
DO $$
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'perodua'
;
IF v_make_id IS NULL THEN RETURN
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Alza', 'alza') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Aruz', 'aruz') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Axia', 'axia') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Bezza', 'bezza') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Kelisa', 'kelisa') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Kembara', 'kembara') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Myvi', 'myvi') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Viva', 'viva') ON CONFLICT (make_id, slug) DO NOTHING
;
-- Peugeot
DO $$
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'peugeot'
;
IF v_make_id IS NULL THEN RETURN
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '1007', '1007') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '106', '106') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '107', '107') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '108', '108') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '2008', '2008') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '205', '205') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '205 Cabrio', '205-cabrio') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '206', '206') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '206 CC', '206-cc') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '206 SW', '206-sw') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '207', '207') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '207 CC', '207-cc') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '207 SW', '207-sw') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '208', '208') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '3008 Hybrid', '3008-hybrid') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '306', '306') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '307', '307') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '307 CC', '307-cc') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '307 SW', '307-sw') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '308', '308') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '308 CC', '308-cc') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '308 Hybrid', '308-hybrid') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '308 SW', '308-sw') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '309', '309') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '4007', '4007') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '4008', '4008') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '405', '405') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '406', '406') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '407', '407') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '407 SW', '407-sw') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '408', '408') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '5008', '5008') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '5008 Hybrid', '5008-hybrid') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '508', '508') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '508 PSE', '508-pse') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '508 SW', '508-sw') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '605', '605') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '607', '607') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '806', '806') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '807', '807') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Bipper', 'bipper') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'e-2008', 'e-2008') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'e-208', 'e-208') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'RCZ', 'rcz') ON CONFLICT (make_id, slug) DO NOTHING
;
-- Polestar
DO $$
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'polestar'
;
IF v_make_id IS NULL THEN RETURN
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Polestar 1', 'polestar-1') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Polestar 2', 'polestar-2') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Polestar 3', 'polestar-3') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Polestar 4', 'polestar-4') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Polestar 5', 'polestar-5') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Polestar 6', 'polestar-6') ON CONFLICT (make_id, slug) DO NOTHING
;
-- Porsche
DO $$
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'porsche'
;
IF v_make_id IS NULL THEN RETURN
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '911 Carrera', '911-carrera') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '911 Carrera Cabrio', '911-carrera-cabrio') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '911 Targa', '911-targa') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '911 Turbo', '911-turbo') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '924', '924') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '944', '944') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Boxster', 'boxster') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Cayenne', 'cayenne') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Cayman', 'cayman') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Macan', 'macan') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Panamera', 'panamera') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Taycan', 'taycan') ON CONFLICT (make_id, slug) DO NOTHING
;
-- Proton
DO $$
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'proton'
;
IF v_make_id IS NULL THEN RETURN
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Exora', 'exora') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Iriz', 'iriz') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Persona', 'persona') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Preve', 'preve') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Saga', 'saga') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'X50', 'x50') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'X70', 'x70') ON CONFLICT (make_id, slug) DO NOTHING
;
-- Ram
DO $$
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'ram'
;
IF v_make_id IS NULL THEN RETURN
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '1500', '1500') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '1500 TRX', '1500-trx') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '2500', '2500') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '3500', '3500') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'ProMaster', 'promaster') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'ProMaster City', 'promaster-city') ON CONFLICT (make_id, slug) DO NOTHING
;
-- Renault
DO $$
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'renault'
;
IF v_make_id IS NULL THEN RETURN
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Arkana', 'arkana') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Austral', 'austral') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Captur', 'captur') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Clio', 'clio') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Clio Grandtour', 'clio-grandtour') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Espace', 'espace') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Express', 'express') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Fluence', 'fluence') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Grand Espace', 'grand-espace') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Grand Modus', 'grand-modus') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Grand Scenic', 'grand-scenic') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Kadjar', 'kadjar') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Kangoo', 'kangoo') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Kangoo Express', 'kangoo-express') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Kiger', 'kiger') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Koleos', 'koleos') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Laguna', 'laguna') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Laguna Grandtour', 'laguna-grandtour') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Latitude', 'latitude') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Mascott', 'mascott') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Megane E-Tech', 'megane-e-tech') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Mégane', 'mégane') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Mégane CC', 'mégane-cc') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Mégane Combi', 'mégane-combi') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Mégane Coupé', 'mégane-coupé') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Mégane Grandtour', 'mégane-grandtour') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Mégane Scénic', 'mégane-scénic') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Scénic', 'scénic') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Talisman', 'talisman') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Talisman Grandtour', 'talisman-grandtour') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Thalia', 'thalia') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Triber', 'triber') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Twingo', 'twingo') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Wind', 'wind') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Zoé', 'zoé') ON CONFLICT (make_id, slug) DO NOTHING
;
-- Rivian
DO $$
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'rivian'
;
IF v_make_id IS NULL THEN RETURN
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'R1S', 'r1s') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'R1T', 'r1t') ON CONFLICT (make_id, slug) DO NOTHING
;
-- Rolls-Royce
DO $$
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'rolls-royce'
;
IF v_make_id IS NULL THEN RETURN
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Cullinan', 'cullinan') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Dawn', 'dawn') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Ghost', 'ghost') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Phantom', 'phantom') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Wraith', 'wraith') ON CONFLICT (make_id, slug) DO NOTHING
;
-- Rover
DO $$
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'rover'
;
IF v_make_id IS NULL THEN RETURN
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '200', '200') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '214', '214') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '218', '218') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '25', '25') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '400', '400') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '414', '414') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '416', '416') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '620', '620') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '75', '75') ON CONFLICT (make_id, slug) DO NOTHING
;
-- Saab
DO $$
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'saab'
;
IF v_make_id IS NULL THEN RETURN
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '9-3', '9-3') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '9-3 Cabriolet', '9-3-cabriolet') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '9-3 Coupé', '9-3-coupé') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '9-3 SportCombi', '9-3-sportcombi') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '9-5', '9-5') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '9-5 SportCombi', '9-5-sportcombi') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '900', '900') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '900 C', '900-c') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '900 C Turbo', '900-c-turbo') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '9000', '9000') ON CONFLICT (make_id, slug) DO NOTHING
;
-- Seat
DO $$
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'seat'
;
IF v_make_id IS NULL THEN RETURN
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Alhambra', 'alhambra') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Altea', 'altea') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Altea XL', 'altea-xl') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Arona', 'arona') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Arosa', 'arosa') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Ateca', 'ateca') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Cordoba', 'cordoba') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Cordoba Vario', 'cordoba-vario') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Exeo', 'exeo') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Exeo ST', 'exeo-st') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Ibiza', 'ibiza') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Ibiza ST', 'ibiza-st') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Inca', 'inca') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Leon', 'leon') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Leon ST', 'leon-st') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Mii', 'mii') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Tarraco', 'tarraco') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Toledo', 'toledo') ON CONFLICT (make_id, slug) DO NOTHING
;
-- Seres
DO $$
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'seres'
;
IF v_make_id IS NULL THEN RETURN
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '3', '3') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '5', '5') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '7', '7') ON CONFLICT (make_id, slug) DO NOTHING
;
-- Smart
DO $$
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'smart'
;
IF v_make_id IS NULL THEN RETURN
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Cabrio', 'cabrio') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'City-Coupé', 'city-coupé') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Compact Pulse', 'compact-pulse') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Forfour', 'forfour') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Fortwo cabrio', 'fortwo-cabrio') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Fortwo coupé', 'fortwo-coupé') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Roadster', 'roadster') ON CONFLICT (make_id, slug) DO NOTHING
;
-- Subaru
DO $$
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'subaru'
;
IF v_make_id IS NULL THEN RETURN
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'BRZ', 'brz') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Forester', 'forester') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Impreza', 'impreza') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Impreza Wagon', 'impreza-wagon') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Justy', 'justy') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Legacy', 'legacy') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Legacy Outback', 'legacy-outback') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Levorg', 'levorg') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Outback', 'outback') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'SVX', 'svx') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Tribeca', 'tribeca') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Tribeca B9', 'tribeca-b9') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'WRX', 'wrx') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'WRX STI', 'wrx-sti') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'XV', 'xv') ON CONFLICT (make_id, slug) DO NOTHING
;
-- Suzuki
DO $$
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'suzuki'
;
IF v_make_id IS NULL THEN RETURN
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Alto', 'alto') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Baleno', 'baleno') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Baleno kombi', 'baleno-kombi') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Celerio', 'celerio') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Ertiga', 'ertiga') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Grand Vitara', 'grand-vitara') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Grand Vitara XL-7', 'grand-vitara-xl-7') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Ignis', 'ignis') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Jimny', 'jimny') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Kizashi', 'kizashi') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Liana', 'liana') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Samurai', 'samurai') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Splash', 'splash') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Swift', 'swift') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'SX4', 'sx4') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'SX4 Sedan', 'sx4-sedan') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'S-Cross', 's-cross') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Vitara', 'vitara') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Wagon R+', 'wagon-r+') ON CONFLICT (make_id, slug) DO NOTHING
;
-- Tesla
DO $$
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'tesla'
;
IF v_make_id IS NULL THEN RETURN
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Cybercab', 'cybercab') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Cybertruck', 'cybertruck') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Model 3', 'model-3') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Model S', 'model-s') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Model X', 'model-x') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Model Y', 'model-y') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Roadster', 'roadster') ON CONFLICT (make_id, slug) DO NOTHING
;
-- Toyota
DO $$
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'toyota'
;
IF v_make_id IS NULL THEN RETURN
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '4-Runner', '4-runner') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Auris', 'auris') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Avensis', 'avensis') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Avensis Combi', 'avensis-combi') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Avensis Van Verso', 'avensis-van-verso') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Aygo', 'aygo') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Camry', 'camry') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Carina', 'carina') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Celica', 'celica') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Corolla', 'corolla') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Corolla Combi', 'corolla-combi') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Corolla sedan', 'corolla-sedan') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Corolla Verso', 'corolla-verso') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'FJ Cruiser', 'fj-cruiser') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'GT86', 'gt86') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Hiace', 'hiace') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Hiace Van', 'hiace-van') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Highlander', 'highlander') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Hilux', 'hilux') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Land Cruiser', 'land-cruiser') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'MR2', 'mr2') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Paseo', 'paseo') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Picnic', 'picnic') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Prius', 'prius') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'RAV4', 'rav4') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Sequoia', 'sequoia') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Starlet', 'starlet') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Supra', 'supra') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Tundra', 'tundra') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Urban Cruiser', 'urban-cruiser') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Verso', 'verso') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Yaris', 'yaris') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Yaris Cross', 'yaris-cross') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Yaris Verso', 'yaris-verso') ON CONFLICT (make_id, slug) DO NOTHING
;
-- VinFast
DO $$
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'vinfast'
;
IF v_make_id IS NULL THEN RETURN
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'VF 5', 'vf-5') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'VF 6', 'vf-6') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'VF 7', 'vf-7') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'VF 8', 'vf-8') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'VF 9', 'vf-9') ON CONFLICT (make_id, slug) DO NOTHING
;
-- Volkswagen
DO $$
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'volkswagen'
;
IF v_make_id IS NULL THEN RETURN
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Amarok', 'amarok') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Beetle', 'beetle') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Bora', 'bora') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Bora Variant', 'bora-variant') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Caddy', 'caddy') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Caddy Van', 'caddy-van') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'California', 'california') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Caravelle', 'caravelle') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'CC', 'cc') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Crafter', 'crafter') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Crafter Kombi', 'crafter-kombi') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Crafter Van', 'crafter-van') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'CrossTouran', 'crosstouran') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Eos', 'eos') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Fox', 'fox') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Golf', 'golf') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Golf Cabrio', 'golf-cabrio') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Golf Plus', 'golf-plus') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Golf Sportvan', 'golf-sportvan') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Golf Variant', 'golf-variant') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'ID. Buzz', 'id.-buzz') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'ID.3', 'id.3') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'ID.4', 'id.4') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'ID.5', 'id.5') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Jetta', 'jetta') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'LT', 'lt') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Lupo', 'lupo') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Multivan', 'multivan') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'New Beetle', 'new-beetle') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'New Beetle Cabrio', 'new-beetle-cabrio') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Passat', 'passat') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Passat Alltrack', 'passat-alltrack') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Passat CC', 'passat-cc') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Passat Variant', 'passat-variant') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Passat Variant Van', 'passat-variant-van') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Phaeton', 'phaeton') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Polo', 'polo') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Polo Van', 'polo-van') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Polo Variant', 'polo-variant') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Scirocco', 'scirocco') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Sharan', 'sharan') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'T4', 't4') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'T4 Caravelle', 't4-caravelle') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'T4 Multivan', 't4-multivan') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'T5', 't5') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Tera', 'tera') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Tiguan', 'tiguan') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Touareg', 'touareg') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Touran', 'touran') ON CONFLICT (make_id, slug) DO NOTHING
;
-- Volvo
DO $$
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'volvo'
;
IF v_make_id IS NULL THEN RETURN
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '240', '240') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '340', '340') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '360', '360') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '460', '460') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '850', '850') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '850 kombi', '850-kombi') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'C30', 'c30') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'C70', 'c70') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'C70 Cabrio', 'c70-cabrio') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'C70 Coupé', 'c70-coupé') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'S40', 's40') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'S60', 's60') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'S70', 's70') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'S80', 's80') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'S90', 's90') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'V40', 'v40') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'V50', 'v50') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'V60', 'v60') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'V70', 'v70') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'V90', 'v90') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'XC40', 'xc40') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'XC60', 'xc60') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'XC70', 'xc70') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'XC90', 'xc90') ON CONFLICT (make_id, slug) DO NOTHING
;
-- Voyah
DO $$
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'voyah'
;
IF v_make_id IS NULL THEN RETURN
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Dreamer', 'dreamer') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Free', 'free') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Passion', 'passion') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Pro', 'pro') ON CONFLICT (make_id, slug) DO NOTHING
;
-- Wuling
DO $$
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'wuling'
;
IF v_make_id IS NULL THEN RETURN
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Air EV', 'air-ev') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Almaz', 'almaz') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Alvez', 'alvez') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Cortez', 'cortez') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Hongguang Mini EV', 'hongguang-mini-ev') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Victory', 'victory') ON CONFLICT (make_id, slug) DO NOTHING
;
-- XPeng
DO $$
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'xpeng'
;
IF v_make_id IS NULL THEN RETURN
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'G3', 'g3') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'G6', 'g6') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'P5', 'p5') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'P7', 'p7') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'P9', 'p9') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'X9', 'x9') ON CONFLICT (make_id, slug) DO NOTHING
;
-- Zotye
DO $$
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'zotye'
;
IF v_make_id IS NULL THEN RETURN
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'T300', 't300') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'T500', 't500') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'T600', 't600') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'T700', 't700') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'T800', 't800') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Z100', 'z100') ON CONFLICT (make_id, slug) DO NOTHING
;
INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Z500', 'z500') ON CONFLICT (make_id, slug) DO NOTHING;
