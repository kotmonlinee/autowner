-- Extend vehicle seed data: more models per brand
-- Run after 019_vehicle_seed_data.sql

-- ── Chevrolet ─────────────────────────────────────────────
DO $$
;
v_model_id UUID
;
v_gen_id UUID
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'chevrolet'
;
IF v_make_id IS NULL THEN RETURN
;
-- Silverado 1500
  INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Silverado 1500', 'silverado-1500') ON CONFLICT (make_id, slug) DO NOTHING RETURNING id INTO v_model_id
;
INSERT INTO vehicle_generations (model_id, name, year_start, year_end) VALUES (v_model_id, 'T1XX (4th Gen)', 2019, NULL) ON CONFLICT (model_id, year_start) DO NOTHING RETURNING id INTO v_gen_id
;
INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, 'L84', '5.3L V8', '5.3L', 'Gasoline', 355) ON CONFLICT (generation_id, code) DO NOTHING
;
INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, 'L87', '6.2L V8', '6.2L', 'Gasoline', 420) ON CONFLICT (generation_id, code) DO NOTHING
;
-- Equinox
  INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Equinox', 'equinox') ON CONFLICT (make_id, slug) DO NOTHING RETURNING id INTO v_model_id
;
INSERT INTO vehicle_generations (model_id, name, year_start, year_end) VALUES (v_model_id, '3rd Gen', 2018, NULL) ON CONFLICT (model_id, year_start) DO NOTHING RETURNING id INTO v_gen_id
;
INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, 'L3B', '1.5L I4 Turbo', '1.5L', 'Gasoline', 175) ON CONFLICT (generation_id, code) DO NOTHING
;
-- Malibu
  INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Malibu', 'malibu') ON CONFLICT (make_id, slug) DO NOTHING RETURNING id INTO v_model_id
;
INSERT INTO vehicle_generations (model_id, name, year_start, year_end) VALUES (v_model_id, '9th Gen', 2016, NULL) ON CONFLICT (model_id, year_start) DO NOTHING RETURNING id INTO v_gen_id
;
INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, 'LFV', '1.5L I4 Turbo', '1.5L', 'Gasoline', 160) ON CONFLICT (generation_id, code) DO NOTHING
;
-- Tahoe
  INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Tahoe', 'tahoe') ON CONFLICT (make_id, slug) DO NOTHING RETURNING id INTO v_model_id
;
INSERT INTO vehicle_generations (model_id, name, year_start, year_end) VALUES (v_model_id, 'GMT1YC (5th Gen)', 2021, NULL) ON CONFLICT (model_id, year_start) DO NOTHING RETURNING id INTO v_gen_id
;
INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, 'L84', '5.3L V8', '5.3L', 'Gasoline', 355) ON CONFLICT (generation_id, code) DO NOTHING
;
INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, 'L87', '6.2L V8', '6.2L', 'Gasoline', 420) ON CONFLICT (generation_id, code) DO NOTHING
;
-- ── Volkswagen ─────────────────────────────────────────────
DO $$
;
v_model_id UUID
;
v_gen_id UUID
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'volkswagen'
;
IF v_make_id IS NULL THEN RETURN
;
-- Jetta
  INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Jetta', 'jetta') ON CONFLICT (make_id, slug) DO NOTHING RETURNING id INTO v_model_id
;
INSERT INTO vehicle_generations (model_id, name, year_start, year_end) VALUES (v_model_id, 'A7 (7th Gen)', 2019, NULL) ON CONFLICT (model_id, year_start) DO NOTHING RETURNING id INTO v_gen_id
;
INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, 'EA211', '1.5L I4 Turbo', '1.5L', 'Gasoline', 158) ON CONFLICT (generation_id, code) DO NOTHING
;
-- Tiguan
  INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Tiguan', 'tiguan') ON CONFLICT (make_id, slug) DO NOTHING RETURNING id INTO v_model_id
;
INSERT INTO vehicle_generations (model_id, name, year_start, year_end) VALUES (v_model_id, 'MQB A2 (2nd Gen)', 2018, NULL) ON CONFLICT (model_id, year_start) DO NOTHING RETURNING id INTO v_gen_id
;
INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, 'EA888', '2.0L I4 Turbo', '2.0L', 'Gasoline', 184) ON CONFLICT (generation_id, code) DO NOTHING
;
-- Golf GTI
  INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Golf GTI', 'golf-gti') ON CONFLICT (make_id, slug) DO NOTHING RETURNING id INTO v_model_id
;
INSERT INTO vehicle_generations (model_id, name, year_start, year_end) VALUES (v_model_id, 'Mk8 (8th Gen)', 2022, NULL) ON CONFLICT (model_id, year_start) DO NOTHING RETURNING id INTO v_gen_id
;
INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, 'EA888 Evo4', '2.0L I4 Turbo', '2.0L', 'Gasoline', 241) ON CONFLICT (generation_id, code) DO NOTHING
;
-- Atlas
  INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Atlas', 'atlas') ON CONFLICT (make_id, slug) DO NOTHING RETURNING id INTO v_model_id
;
INSERT INTO vehicle_generations (model_id, name, year_start, year_end) VALUES (v_model_id, '1st Gen', 2018, NULL) ON CONFLICT (model_id, year_start) DO NOTHING RETURNING id INTO v_gen_id
;
INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, 'VR6', '3.6L V6', '3.6L', 'Gasoline', 276) ON CONFLICT (generation_id, code) DO NOTHING
;
INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, 'EA888', '2.0L I4 Turbo', '2.0L', 'Gasoline', 235) ON CONFLICT (generation_id, code) DO NOTHING
;
-- ── Audi ───────────────────────────────────────────────────
DO $$
;
v_model_id UUID
;
v_gen_id UUID
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'audi'
;
IF v_make_id IS NULL THEN RETURN
;
-- A4
  INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'A4', 'a4') ON CONFLICT (make_id, slug) DO NOTHING RETURNING id INTO v_model_id
;
INSERT INTO vehicle_generations (model_id, name, year_start, year_end) VALUES (v_model_id, 'B9.5 (5th Gen Facelift)', 2020, NULL) ON CONFLICT (model_id, year_start) DO NOTHING RETURNING id INTO v_gen_id
;
INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, 'EA888', '2.0L I4 Turbo (40 TFSI)', '2.0L', 'Gasoline', 201) ON CONFLICT (generation_id, code) DO NOTHING
;
-- Q5
  INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Q5', 'q5') ON CONFLICT (make_id, slug) DO NOTHING RETURNING id INTO v_model_id
;
INSERT INTO vehicle_generations (model_id, name, year_start, year_end) VALUES (v_model_id, 'FY (2nd Gen)', 2018, NULL) ON CONFLICT (model_id, year_start) DO NOTHING RETURNING id INTO v_gen_id
;
INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, 'EA888', '2.0L I4 Turbo (45 TFSI)', '2.0L', 'Gasoline', 261) ON CONFLICT (generation_id, code) DO NOTHING
;
-- A3
  INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'A3', 'a3') ON CONFLICT (make_id, slug) DO NOTHING RETURNING id INTO v_model_id
;
INSERT INTO vehicle_generations (model_id, name, year_start, year_end) VALUES (v_model_id, '8Y (4th Gen)', 2022, NULL) ON CONFLICT (model_id, year_start) DO NOTHING RETURNING id INTO v_gen_id
;
INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, 'EA888', '2.0L I4 Turbo (40 TFSI)', '2.0L', 'Gasoline', 201) ON CONFLICT (generation_id, code) DO NOTHING
;
-- ── Mercedes-Benz ──────────────────────────────────────────
DO $$
;
v_model_id UUID
;
v_gen_id UUID
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'mercedes-benz'
;
IF v_make_id IS NULL THEN RETURN
;
-- C-Class
  INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'C-Class', 'c-class') ON CONFLICT (make_id, slug) DO NOTHING RETURNING id INTO v_model_id
;
INSERT INTO vehicle_generations (model_id, name, year_start, year_end) VALUES (v_model_id, 'W206 (5th Gen)', 2022, NULL) ON CONFLICT (model_id, year_start) DO NOTHING RETURNING id INTO v_gen_id
;
INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, 'M254', '2.0L I4 Turbo (C300)', '2.0L', 'Gasoline', 255) ON CONFLICT (generation_id, code) DO NOTHING
;
-- E-Class
  INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'E-Class', 'e-class') ON CONFLICT (make_id, slug) DO NOTHING RETURNING id INTO v_model_id
;
INSERT INTO vehicle_generations (model_id, name, year_start, year_end) VALUES (v_model_id, 'W214 (6th Gen)', 2024, NULL) ON CONFLICT (model_id, year_start) DO NOTHING RETURNING id INTO v_gen_id
;
INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, 'M254', '2.0L I4 Turbo (E350)', '2.0L', 'Gasoline', 255) ON CONFLICT (generation_id, code) DO NOTHING
;
-- GLC
  INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'GLC', 'glc') ON CONFLICT (make_id, slug) DO NOTHING RETURNING id INTO v_model_id
;
INSERT INTO vehicle_generations (model_id, name, year_start, year_end) VALUES (v_model_id, 'X254 (2nd Gen)', 2023, NULL) ON CONFLICT (model_id, year_start) DO NOTHING RETURNING id INTO v_gen_id
;
INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, 'M254', '2.0L I4 Turbo (GLC300)', '2.0L', 'Gasoline', 255) ON CONFLICT (generation_id, code) DO NOTHING
;
-- ── Kia ────────────────────────────────────────────────────
DO $$
;
v_model_id UUID
;
v_gen_id UUID
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'kia'
;
IF v_make_id IS NULL THEN RETURN
;
-- Sportage
  INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Sportage', 'sportage') ON CONFLICT (make_id, slug) DO NOTHING RETURNING id INTO v_model_id
;
INSERT INTO vehicle_generations (model_id, name, year_start, year_end) VALUES (v_model_id, 'NQ5 (5th Gen)', 2023, NULL) ON CONFLICT (model_id, year_start) DO NOTHING RETURNING id INTO v_gen_id
;
INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, 'Smartstream G2.5', '2.5L I4', '2.5L', 'Gasoline', 187) ON CONFLICT (generation_id, code) DO NOTHING
;
-- Telluride
  INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Telluride', 'telluride') ON CONFLICT (make_id, slug) DO NOTHING RETURNING id INTO v_model_id
;
INSERT INTO vehicle_generations (model_id, name, year_start, year_end) VALUES (v_model_id, 'ON (1st Gen)', 2020, NULL) ON CONFLICT (model_id, year_start) DO NOTHING RETURNING id INTO v_gen_id
;
INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, 'Lambda II', '3.8L V6', '3.8L', 'Gasoline', 291) ON CONFLICT (generation_id, code) DO NOTHING
;
-- Sorento
  INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Sorento', 'sorento') ON CONFLICT (make_id, slug) DO NOTHING RETURNING id INTO v_model_id
;
INSERT INTO vehicle_generations (model_id, name, year_start, year_end) VALUES (v_model_id, 'MQ4 (4th Gen)', 2021, NULL) ON CONFLICT (model_id, year_start) DO NOTHING RETURNING id INTO v_gen_id
;
INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, 'Smartstream G2.5', '2.5L I4', '2.5L', 'Gasoline', 191) ON CONFLICT (generation_id, code) DO NOTHING
;
-- ── Mazda ──────────────────────────────────────────────────
DO $$
;
v_model_id UUID
;
v_gen_id UUID
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'mazda'
;
IF v_make_id IS NULL THEN RETURN
;
-- CX-5
  INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'CX-5', 'cx-5') ON CONFLICT (make_id, slug) DO NOTHING RETURNING id INTO v_model_id
;
INSERT INTO vehicle_generations (model_id, name, year_start, year_end) VALUES (v_model_id, 'KF (2nd Gen)', 2017, NULL) ON CONFLICT (model_id, year_start) DO NOTHING RETURNING id INTO v_gen_id
;
INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, 'PY-VPS', '2.5L I4 Turbo', '2.5L', 'Gasoline', 250) ON CONFLICT (generation_id, code) DO NOTHING
;
INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, 'PY-VPR', '2.5L I4', '2.5L', 'Gasoline', 187) ON CONFLICT (generation_id, code) DO NOTHING
;
-- Mazda3
  INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Mazda3', 'mazda3') ON CONFLICT (make_id, slug) DO NOTHING RETURNING id INTO v_model_id
;
INSERT INTO vehicle_generations (model_id, name, year_start, year_end) VALUES (v_model_id, 'BP (4th Gen)', 2019, NULL) ON CONFLICT (model_id, year_start) DO NOTHING RETURNING id INTO v_gen_id
;
INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, 'PY-VPR', '2.5L I4', '2.5L', 'Gasoline', 186) ON CONFLICT (generation_id, code) DO NOTHING
;
INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, 'PY-VPS', '2.5L I4 Turbo', '2.5L', 'Gasoline', 250) ON CONFLICT (generation_id, code) DO NOTHING
;
-- CX-50
  INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'CX-50', 'cx-50') ON CONFLICT (make_id, slug) DO NOTHING RETURNING id INTO v_model_id
;
INSERT INTO vehicle_generations (model_id, name, year_start, year_end) VALUES (v_model_id, 'VA (1st Gen)', 2023, NULL) ON CONFLICT (model_id, year_start) DO NOTHING RETURNING id INTO v_gen_id
;
INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, 'PY-VPS', '2.5L I4 Turbo', '2.5L', 'Gasoline', 256) ON CONFLICT (generation_id, code) DO NOTHING
;
-- ── GMC ────────────────────────────────────────────────────
DO $$
;
v_model_id UUID
;
v_gen_id UUID
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'gmc'
;
IF v_make_id IS NULL THEN RETURN
;
-- Sierra 1500
  INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Sierra 1500', 'sierra-1500') ON CONFLICT (make_id, slug) DO NOTHING RETURNING id INTO v_model_id
;
INSERT INTO vehicle_generations (model_id, name, year_start, year_end) VALUES (v_model_id, 'T1XX (4th Gen)', 2019, NULL) ON CONFLICT (model_id, year_start) DO NOTHING RETURNING id INTO v_gen_id
;
INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, 'L84', '5.3L V8', '5.3L', 'Gasoline', 355) ON CONFLICT (generation_id, code) DO NOTHING
;
INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, 'L87', '6.2L V8', '6.2L', 'Gasoline', 420) ON CONFLICT (generation_id, code) DO NOTHING
;
-- ── Additional models for existing brands ──────────────────

-- Toyota: add Highlander, 4Runner, Tundra, Sienna
DO $$
;
v_model_id UUID
;
v_gen_id UUID
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'toyota'
;
IF v_make_id IS NULL THEN RETURN
;
-- Highlander
  INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Highlander', 'highlander') ON CONFLICT (make_id, slug) DO NOTHING RETURNING id INTO v_model_id
;
INSERT INTO vehicle_generations (model_id, name, year_start, year_end) VALUES (v_model_id, 'XU70 (4th Gen)', 2020, NULL) ON CONFLICT (model_id, year_start) DO NOTHING RETURNING id INTO v_gen_id
;
INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, 'T24A-FTS', '2.4L I4 Turbo', '2.4L', 'Gasoline', 265) ON CONFLICT (generation_id, code) DO NOTHING
;
INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, 'A25A-FXS', '2.5L I4 Hybrid', '2.5L', 'Hybrid', 243) ON CONFLICT (generation_id, code) DO NOTHING
;
-- 4Runner
  INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '4Runner', '4runner') ON CONFLICT (make_id, slug) DO NOTHING RETURNING id INTO v_model_id
;
INSERT INTO vehicle_generations (model_id, name, year_start, year_end) VALUES (v_model_id, 'N280 (5th Gen)', 2010, 2024) ON CONFLICT (model_id, year_start) DO NOTHING RETURNING id INTO v_gen_id
;
INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, '1GR-FE', '4.0L V6', '4.0L', 'Gasoline', 270) ON CONFLICT (generation_id, code) DO NOTHING
;
-- Tundra
  INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Tundra', 'tundra') ON CONFLICT (make_id, slug) DO NOTHING RETURNING id INTO v_model_id
;
INSERT INTO vehicle_generations (model_id, name, year_start, year_end) VALUES (v_model_id, 'XK70 (3rd Gen)', 2022, NULL) ON CONFLICT (model_id, year_start) DO NOTHING RETURNING id INTO v_gen_id
;
INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, 'V35A-FTS', '3.5L V6 Turbo', '3.5L', 'Gasoline', 389) ON CONFLICT (generation_id, code) DO NOTHING
;
INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, 'V35A-FTS Hybrid', '3.5L V6 Turbo Hybrid', '3.5L', 'Hybrid', 437) ON CONFLICT (generation_id, code) DO NOTHING
;
-- Sienna
  INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Sienna', 'sienna') ON CONFLICT (make_id, slug) DO NOTHING RETURNING id INTO v_model_id
;
INSERT INTO vehicle_generations (model_id, name, year_start, year_end) VALUES (v_model_id, 'XL40 (4th Gen)', 2021, NULL) ON CONFLICT (model_id, year_start) DO NOTHING RETURNING id INTO v_gen_id
;
INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, 'A25A-FXS', '2.5L I4 Hybrid', '2.5L', 'Hybrid', 245) ON CONFLICT (generation_id, code) DO NOTHING
;
-- Honda: add Pilot, Odyssey, Ridgeline
DO $$
;
v_model_id UUID
;
v_gen_id UUID
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'honda'
;
IF v_make_id IS NULL THEN RETURN
;
-- Pilot
  INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Pilot', 'pilot') ON CONFLICT (make_id, slug) DO NOTHING RETURNING id INTO v_model_id
;
INSERT INTO vehicle_generations (model_id, name, year_start, year_end) VALUES (v_model_id, '4th Gen', 2023, NULL) ON CONFLICT (model_id, year_start) DO NOTHING RETURNING id INTO v_gen_id
;
INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, 'J35Y6', '3.5L V6', '3.5L', 'Gasoline', 285) ON CONFLICT (generation_id, code) DO NOTHING
;
-- Odyssey
  INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Odyssey', 'odyssey') ON CONFLICT (make_id, slug) DO NOTHING RETURNING id INTO v_model_id
;
INSERT INTO vehicle_generations (model_id, name, year_start, year_end) VALUES (v_model_id, '5th Gen', 2018, NULL) ON CONFLICT (model_id, year_start) DO NOTHING RETURNING id INTO v_gen_id
;
INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, 'J35Y6', '3.5L V6', '3.5L', 'Gasoline', 280) ON CONFLICT (generation_id, code) DO NOTHING
;
-- Ford: add Escape, Bronco, Maverick
DO $$
;
v_model_id UUID
;
v_gen_id UUID
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'ford'
;
IF v_make_id IS NULL THEN RETURN
;
-- Escape
  INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Escape', 'escape') ON CONFLICT (make_id, slug) DO NOTHING RETURNING id INTO v_model_id
;
INSERT INTO vehicle_generations (model_id, name, year_start, year_end) VALUES (v_model_id, 'CX482 (4th Gen)', 2020, NULL) ON CONFLICT (model_id, year_start) DO NOTHING RETURNING id INTO v_gen_id
;
INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, '1.5L EcoBoost', '1.5L I3 Turbo', '1.5L', 'Gasoline', 181) ON CONFLICT (generation_id, code) DO NOTHING
;
INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, '2.0L EcoBoost', '2.0L I4 Turbo', '2.0L', 'Gasoline', 250) ON CONFLICT (generation_id, code) DO NOTHING
;
-- Bronco
  INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Bronco', 'bronco') ON CONFLICT (make_id, slug) DO NOTHING RETURNING id INTO v_model_id
;
INSERT INTO vehicle_generations (model_id, name, year_start, year_end) VALUES (v_model_id, 'U725 (6th Gen)', 2021, NULL) ON CONFLICT (model_id, year_start) DO NOTHING RETURNING id INTO v_gen_id
;
INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, '2.3L EcoBoost', '2.3L I4 Turbo', '2.3L', 'Gasoline', 300) ON CONFLICT (generation_id, code) DO NOTHING
;
INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, '2.7L EcoBoost', '2.7L V6 Turbo', '2.7L', 'Gasoline', 330) ON CONFLICT (generation_id, code) DO NOTHING
;
-- Maverick
  INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Maverick', 'maverick') ON CONFLICT (make_id, slug) DO NOTHING RETURNING id INTO v_model_id
;
INSERT INTO vehicle_generations (model_id, name, year_start, year_end) VALUES (v_model_id, '1st Gen', 2022, NULL) ON CONFLICT (model_id, year_start) DO NOTHING RETURNING id INTO v_gen_id
;
INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, '2.0L EcoBoost', '2.0L I4 Turbo', '2.0L', 'Gasoline', 250) ON CONFLICT (generation_id, code) DO NOTHING
;
INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, '2.5L Hybrid', '2.5L I4 Hybrid', '2.5L', 'Hybrid', 191) ON CONFLICT (generation_id, code) DO NOTHING
;
-- BMW: add X3, 5 Series
DO $$
;
v_model_id UUID
;
v_gen_id UUID
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'bmw'
;
IF v_make_id IS NULL THEN RETURN
;
-- X3
  INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'X3', 'x3') ON CONFLICT (make_id, slug) DO NOTHING RETURNING id INTO v_model_id
;
INSERT INTO vehicle_generations (model_id, name, year_start, year_end) VALUES (v_model_id, 'G01 (3rd Gen)', 2018, NULL) ON CONFLICT (model_id, year_start) DO NOTHING RETURNING id INTO v_gen_id
;
INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, 'B48', '2.0L I4 Turbo (xDrive30i)', '2.0L', 'Gasoline', 248) ON CONFLICT (generation_id, code) DO NOTHING
;
INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, 'B58', '3.0L I6 Turbo (M40i)', '3.0L', 'Gasoline', 382) ON CONFLICT (generation_id, code) DO NOTHING
;
-- 5 Series
  INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '5 Series', '5-series') ON CONFLICT (make_id, slug) DO NOTHING RETURNING id INTO v_model_id
;
INSERT INTO vehicle_generations (model_id, name, year_start, year_end) VALUES (v_model_id, 'G60 (8th Gen)', 2024, NULL) ON CONFLICT (model_id, year_start) DO NOTHING RETURNING id INTO v_gen_id
;
INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, 'B58', '3.0L I6 Turbo (540i)', '3.0L', 'Gasoline', 375) ON CONFLICT (generation_id, code) DO NOTHING
;
-- Hyundai: add Santa Fe, Palisade, Sonata
DO $$
;
v_model_id UUID
;
v_gen_id UUID
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'hyundai'
;
IF v_make_id IS NULL THEN RETURN
;
-- Santa Fe
  INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Santa Fe', 'santa-fe') ON CONFLICT (make_id, slug) DO NOTHING RETURNING id INTO v_model_id
;
INSERT INTO vehicle_generations (model_id, name, year_start, year_end) VALUES (v_model_id, 'MX5 (5th Gen)', 2024, NULL) ON CONFLICT (model_id, year_start) DO NOTHING RETURNING id INTO v_gen_id
;
INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, 'Smartstream G2.5', '2.5L I4 Turbo', '2.5L', 'Gasoline', 277) ON CONFLICT (generation_id, code) DO NOTHING
;
-- Palisade
  INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Palisade', 'palisade') ON CONFLICT (make_id, slug) DO NOTHING RETURNING id INTO v_model_id
;
INSERT INTO vehicle_generations (model_id, name, year_start, year_end) VALUES (v_model_id, 'LX2 (1st Gen)', 2020, NULL) ON CONFLICT (model_id, year_start) DO NOTHING RETURNING id INTO v_gen_id
;
INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, 'Lambda II', '3.8L V6', '3.8L', 'Gasoline', 291) ON CONFLICT (generation_id, code) DO NOTHING
;
-- Sonata
  INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Sonata', 'sonata') ON CONFLICT (make_id, slug) DO NOTHING RETURNING id INTO v_model_id
;
INSERT INTO vehicle_generations (model_id, name, year_start, year_end) VALUES (v_model_id, 'DN8 (8th Gen)', 2020, NULL) ON CONFLICT (model_id, year_start) DO NOTHING RETURNING id INTO v_gen_id
;
INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, 'Smartstream G2.5', '2.5L I4', '2.5L', 'Gasoline', 191) ON CONFLICT (generation_id, code) DO NOTHING
;
-- Acura: add MDX, TLX, RDX
DO $$
;
v_model_id UUID
;
v_gen_id UUID
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'acura'
;
IF v_make_id IS NULL THEN RETURN
;
-- MDX
  INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'MDX', 'mdx') ON CONFLICT (make_id, slug) DO NOTHING RETURNING id INTO v_model_id
;
INSERT INTO vehicle_generations (model_id, name, year_start, year_end) VALUES (v_model_id, '4th Gen', 2022, NULL) ON CONFLICT (model_id, year_start) DO NOTHING RETURNING id INTO v_gen_id
;
INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, 'J30AC', '3.0L V6 Turbo', '3.0L', 'Gasoline', 355) ON CONFLICT (generation_id, code) DO NOTHING
;
-- RDX
  INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'RDX', 'rdx') ON CONFLICT (make_id, slug) DO NOTHING RETURNING id INTO v_model_id
;
INSERT INTO vehicle_generations (model_id, name, year_start, year_end) VALUES (v_model_id, '3rd Gen', 2019, NULL) ON CONFLICT (model_id, year_start) DO NOTHING RETURNING id INTO v_gen_id
;
INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, 'K20C4', '2.0L I4 Turbo', '2.0L', 'Gasoline', 272) ON CONFLICT (generation_id, code) DO NOTHING
;
-- Subaru: add Crosstrek, Impreza, Ascent
DO $$
;
v_model_id UUID
;
v_gen_id UUID
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'subaru'
;
IF v_make_id IS NULL THEN RETURN
;
-- Crosstrek
  INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Crosstrek', 'crosstrek') ON CONFLICT (make_id, slug) DO NOTHING RETURNING id INTO v_model_id
;
INSERT INTO vehicle_generations (model_id, name, year_start, year_end) VALUES (v_model_id, '3rd Gen', 2024, NULL) ON CONFLICT (model_id, year_start) DO NOTHING RETURNING id INTO v_gen_id
;
INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, 'FB25', '2.5L H4', '2.5L', 'Gasoline', 182) ON CONFLICT (generation_id, code) DO NOTHING
;
-- Ascent
  INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Ascent', 'ascent') ON CONFLICT (make_id, slug) DO NOTHING RETURNING id INTO v_model_id
;
INSERT INTO vehicle_generations (model_id, name, year_start, year_end) VALUES (v_model_id, 'WM (1st Gen)', 2019, NULL) ON CONFLICT (model_id, year_start) DO NOTHING RETURNING id INTO v_gen_id
;
INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, 'FA24', '2.4L H4 Turbo', '2.4L', 'Gasoline', 260) ON CONFLICT (generation_id, code) DO NOTHING
;
-- Nissan: add Sentra, Pathfinder, Frontier
DO $$
;
v_model_id UUID
;
v_gen_id UUID
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'nissan'
;
IF v_make_id IS NULL THEN RETURN
;
-- Sentra
  INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Sentra', 'sentra') ON CONFLICT (make_id, slug) DO NOTHING RETURNING id INTO v_model_id
;
INSERT INTO vehicle_generations (model_id, name, year_start, year_end) VALUES (v_model_id, 'B18 (8th Gen)', 2020, NULL) ON CONFLICT (model_id, year_start) DO NOTHING RETURNING id INTO v_gen_id
;
INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, 'PR25DD', '2.0L I4', '2.0L', 'Gasoline', 149) ON CONFLICT (generation_id, code) DO NOTHING
;
-- Pathfinder
  INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Pathfinder', 'pathfinder') ON CONFLICT (make_id, slug) DO NOTHING RETURNING id INTO v_model_id
;
INSERT INTO vehicle_generations (model_id, name, year_start, year_end) VALUES (v_model_id, 'R53 (5th Gen)', 2022, NULL) ON CONFLICT (model_id, year_start) DO NOTHING RETURNING id INTO v_gen_id
;
INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, 'VQ35DD', '3.5L V6', '3.5L', 'Gasoline', 284) ON CONFLICT (generation_id, code) DO NOTHING
;
-- Lexus: add ES, NX, GX
DO $$
;
v_model_id UUID
;
v_gen_id UUID
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'lexus'
;
IF v_make_id IS NULL THEN RETURN
;
-- ES
  INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'ES', 'es') ON CONFLICT (make_id, slug) DO NOTHING RETURNING id INTO v_model_id
;
INSERT INTO vehicle_generations (model_id, name, year_start, year_end) VALUES (v_model_id, 'XZ10 (7th Gen)', 2019, NULL) ON CONFLICT (model_id, year_start) DO NOTHING RETURNING id INTO v_gen_id
;
INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, 'A25A-FKS', '2.5L I4 (ES250)', '2.5L', 'Gasoline', 203) ON CONFLICT (generation_id, code) DO NOTHING
;
INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, '2GR-FKS', '3.5L V6 (ES350)', '3.5L', 'Gasoline', 302) ON CONFLICT (generation_id, code) DO NOTHING
;
-- NX
  INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'NX', 'nx') ON CONFLICT (make_id, slug) DO NOTHING RETURNING id INTO v_model_id
;
INSERT INTO vehicle_generations (model_id, name, year_start, year_end) VALUES (v_model_id, 'AZ20 (2nd Gen)', 2022, NULL) ON CONFLICT (model_id, year_start) DO NOTHING RETURNING id INTO v_gen_id
;
INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, 'T24A-FTS', '2.4L I4 Turbo (NX350)', '2.4L', 'Gasoline', 275) ON CONFLICT (generation_id, code) DO NOTHING
;
INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, 'A25A-FXS', '2.5L I4 Hybrid (NX350h)', '2.5L', 'Hybrid', 240) ON CONFLICT (generation_id, code) DO NOTHING
;
-- Porsche: add 911, Cayenne, Macan
DO $$
;
v_model_id UUID
;
v_gen_id UUID
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'porsche'
;
IF v_make_id IS NULL THEN RETURN
;
-- 911
  INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '911', '911') ON CONFLICT (make_id, slug) DO NOTHING RETURNING id INTO v_model_id
;
INSERT INTO vehicle_generations (model_id, name, year_start, year_end) VALUES (v_model_id, '992 (8th Gen)', 2020, NULL) ON CONFLICT (model_id, year_start) DO NOTHING RETURNING id INTO v_gen_id
;
INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, '9A2 Evo', '3.0L H6 Turbo', '3.0L', 'Gasoline', 379) ON CONFLICT (generation_id, code) DO NOTHING
;
-- Cayenne
  INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Cayenne', 'cayenne') ON CONFLICT (make_id, slug) DO NOTHING RETURNING id INTO v_model_id
;
INSERT INTO vehicle_generations (model_id, name, year_start, year_end) VALUES (v_model_id, '9YA (3rd Gen)', 2019, NULL) ON CONFLICT (model_id, year_start) DO NOTHING RETURNING id INTO v_gen_id
;
INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, 'V6 Turbo', '3.0L V6 Turbo', '3.0L', 'Gasoline', 348) ON CONFLICT (generation_id, code) DO NOTHING
;
-- Macan
  INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Macan', 'macan') ON CONFLICT (make_id, slug) DO NOTHING RETURNING id INTO v_model_id
;
INSERT INTO vehicle_generations (model_id, name, year_start, year_end) VALUES (v_model_id, '95B (1st Gen)', 2019, NULL) ON CONFLICT (model_id, year_start) DO NOTHING RETURNING id INTO v_gen_id
;
INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, 'EA888', '2.0L I4 Turbo', '2.0L', 'Gasoline', 261) ON CONFLICT (generation_id, code) DO NOTHING
;
-- Volvo: add XC90, XC60, S60
DO $$
;
v_model_id UUID
;
v_gen_id UUID
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'volvo'
;
IF v_make_id IS NULL THEN RETURN
;
-- XC90
  INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'XC90', 'xc90') ON CONFLICT (make_id, slug) DO NOTHING RETURNING id INTO v_model_id
;
INSERT INTO vehicle_generations (model_id, name, year_start, year_end) VALUES (v_model_id, 'SPA (2nd Gen)', 2016, NULL) ON CONFLICT (model_id, year_start) DO NOTHING RETURNING id INTO v_gen_id
;
INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, 'B420T', '2.0L I4 Turbo (B5)', '2.0L', 'Mild Hybrid', 247) ON CONFLICT (generation_id, code) DO NOTHING
;
INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, 'T8', '2.0L I4 PHEV', '2.0L', 'Plug-in Hybrid', 455) ON CONFLICT (generation_id, code) DO NOTHING
;
-- XC60
  INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'XC60', 'xc60') ON CONFLICT (make_id, slug) DO NOTHING RETURNING id INTO v_model_id
;
INSERT INTO vehicle_generations (model_id, name, year_start, year_end) VALUES (v_model_id, 'SPA (2nd Gen)', 2018, NULL) ON CONFLICT (model_id, year_start) DO NOTHING RETURNING id INTO v_gen_id
;
INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, 'B420T', '2.0L I4 Turbo (B5)', '2.0L', 'Mild Hybrid', 247) ON CONFLICT (generation_id, code) DO NOTHING
;
-- Cadillac: add Escalade, CT5
DO $$
;
v_model_id UUID
;
v_gen_id UUID
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'cadillac'
;
IF v_make_id IS NULL THEN RETURN
;
-- Escalade
  INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Escalade', 'escalade') ON CONFLICT (make_id, slug) DO NOTHING RETURNING id INTO v_model_id
;
INSERT INTO vehicle_generations (model_id, name, year_start, year_end) VALUES (v_model_id, 'GMT1YL (5th Gen)', 2021, NULL) ON CONFLICT (model_id, year_start) DO NOTHING RETURNING id INTO v_gen_id
;
INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, 'L87', '6.2L V8', '6.2L', 'Gasoline', 420) ON CONFLICT (generation_id, code) DO NOTHING
;
-- Ram: add 1500
DO $$
;
v_model_id UUID
;
v_gen_id UUID
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'ram'
;
IF v_make_id IS NULL THEN RETURN
;
-- 1500
  INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, '1500', '1500') ON CONFLICT (make_id, slug) DO NOTHING RETURNING id INTO v_model_id
;
INSERT INTO vehicle_generations (model_id, name, year_start, year_end) VALUES (v_model_id, 'DT (5th Gen)', 2019, NULL) ON CONFLICT (model_id, year_start) DO NOTHING RETURNING id INTO v_gen_id
;
INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, '5.7L HEMI', '5.7L V8', '5.7L', 'Gasoline', 395) ON CONFLICT (generation_id, code) DO NOTHING
;
INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, '3.6L Pentastar', '3.6L V6 eTorque', '3.6L', 'Mild Hybrid', 305) ON CONFLICT (generation_id, code) DO NOTHING
;
-- Jeep: add Grand Cherokee
DO $$
;
v_model_id UUID
;
v_gen_id UUID
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'jeep'
;
IF v_make_id IS NULL THEN RETURN
;
-- Grand Cherokee
  INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Grand Cherokee', 'grand-cherokee') ON CONFLICT (make_id, slug) DO NOTHING RETURNING id INTO v_model_id
;
INSERT INTO vehicle_generations (model_id, name, year_start, year_end) VALUES (v_model_id, 'WL (5th Gen)', 2021, NULL) ON CONFLICT (model_id, year_start) DO NOTHING RETURNING id INTO v_gen_id
;
INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, '3.6L Pentastar', '3.6L V6', '3.6L', 'Gasoline', 293) ON CONFLICT (generation_id, code) DO NOTHING
;
INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, '2.0L Turbo PHEV', '2.0L I4 PHEV (4xe)', '2.0L', 'Plug-in Hybrid', 375) ON CONFLICT (generation_id, code) DO NOTHING
;
-- Chrysler: add Pacifica
DO $$
;
v_model_id UUID
;
v_gen_id UUID
;
SELECT id INTO v_make_id FROM vehicle_makes WHERE slug = 'chrysler'
;
IF v_make_id IS NULL THEN RETURN
;
-- Pacifica
  INSERT INTO vehicle_models (make_id, name, slug) VALUES (v_make_id, 'Pacifica', 'pacifica') ON CONFLICT (make_id, slug) DO NOTHING RETURNING id INTO v_model_id
;
INSERT INTO vehicle_generations (model_id, name, year_start, year_end) VALUES (v_model_id, 'RU (2nd Gen)', 2017, NULL) ON CONFLICT (model_id, year_start) DO NOTHING RETURNING id INTO v_gen_id
;
INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, '3.6L Pentastar', '3.6L V6', '3.6L', 'Gasoline', 287) ON CONFLICT (generation_id, code) DO NOTHING
;
INSERT INTO vehicle_engines (generation_id, code, name, displacement, fuel_type, horsepower) VALUES (v_gen_id, '3.6L Pentastar PHEV', '3.6L V6 PHEV', '3.6L', 'Plug-in Hybrid', 260) ON CONFLICT (generation_id, code) DO NOTHING;
