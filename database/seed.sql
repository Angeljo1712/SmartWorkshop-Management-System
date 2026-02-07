-- Seed service catalog + pricing (UK-default).
-- Prices are midpoint estimates from provided UK ranges. Currency assumed GBP.

INSERT INTO service_catalog (code, name, category, description, base_labour_minutes) VALUES
  ('repair_clutch_replacement', 'Clutch replacement', 'repair', 'Vehicles with a manual gearbox only', 300),
  ('repair_brake_discs_pads_front', 'Brake discs & pads replacement - front (both)', 'repair', NULL, 180),
  ('repair_brake_discs_pads_rear', 'Brake discs & pads replacement - rear (both)', 'repair', NULL, 180),
  ('repair_brake_pads_front', 'Brake pads replacement - front (all)', 'repair', NULL, 90),
  ('repair_brake_pads_rear', 'Brake pads replacement - rear (all)', 'repair', NULL, 90),
  ('repair_timing_chain', 'Timing chain replacement', 'repair', NULL, 420),
  ('diagnostic_inspection', 'Diagnostic inspection', 'diagnostics', NULL, 60),
  ('repair_oil_filter', 'Engine oil & filter replacement', 'repair', NULL, 90),
  ('mot_test_only', 'MOT (test only)', 'repair', 'Test only', 60),
  ('mot_collection_delivery', 'MOT with collection & delivery', 'repair', NULL, 90),
  ('repair_water_pump', 'Water pump replacement', 'repair', NULL, 240),
  ('repair_alternator', 'Alternator replacement', 'repair', NULL, 210),
  ('repair_aux_belt', 'Auxiliary drive belt replacement', 'repair', NULL, 60),
  ('repair_shock_absorbers_front', 'Shock absorbers replacement - front (pair)', 'repair', NULL, 180),
  ('repair_coil_spring_front', 'Coil spring replacement - front (both)', 'repair', NULL, 180),
  ('repair_starter_motor', 'Starter motor replacement', 'repair', NULL, 150)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  category = VALUES(category),
  description = VALUES(description),
  base_labour_minutes = VALUES(base_labour_minutes);

-- Pricing: use labour_rate_eur field to store the base price value (GBP).
INSERT INTO service_pricing (service_id, region, labour_rate_eur, parts_markup_pct, travel_fee_eur, vat_pct)
SELECT id, 'UK-default', price, 0.00, 0.00, 20.00
FROM (
  SELECT 'repair_clutch_replacement' AS code, 675.00 AS price UNION ALL
  SELECT 'repair_brake_discs_pads_front', 300.00 UNION ALL
  SELECT 'repair_brake_discs_pads_rear', 270.00 UNION ALL
  SELECT 'repair_brake_pads_front', 145.00 UNION ALL
  SELECT 'repair_brake_pads_rear', 135.00 UNION ALL
  SELECT 'repair_timing_chain', 1150.00 UNION ALL
  SELECT 'diagnostic_inspection', 60.00 UNION ALL
  SELECT 'repair_oil_filter', 155.00 UNION ALL
  SELECT 'mot_test_only', 50.00 UNION ALL
  SELECT 'mot_collection_delivery', 90.00 UNION ALL
  SELECT 'repair_water_pump', 350.00 UNION ALL
  SELECT 'repair_alternator', 525.00 UNION ALL
  SELECT 'repair_aux_belt', 110.00 UNION ALL
  SELECT 'repair_shock_absorbers_front', 325.00 UNION ALL
  SELECT 'repair_coil_spring_front', 300.00 UNION ALL
  SELECT 'repair_starter_motor', 375.00
) AS p
JOIN service_catalog sc ON sc.code = p.code
ON DUPLICATE KEY UPDATE
  labour_rate_eur = VALUES(labour_rate_eur),
  parts_markup_pct = VALUES(parts_markup_pct),
  travel_fee_eur = VALUES(travel_fee_eur),
  vat_pct = VALUES(vat_pct);

-- Additional services (diagnostics, servicing & MOT, pre-purchase inspections)
INSERT INTO service_catalog (code, name, category, description, base_labour_minutes) VALUES
  ('diag_car_wont_start', 'Car won''t start inspection', 'diagnostics', NULL, 60),
  ('diag_plugin_inspection', 'Plug-in diagnostic inspection', 'diagnostics', NULL, 60),
  ('service_major', 'Major Service', 'service', NULL, 240),
  ('service_full', 'Full Service', 'service', NULL, 180),
  ('service_interim', 'Interim Service', 'service', NULL, 120),
  ('service_vehicle_health', 'Vehicle Health Check', 'service', 'Only £30 when booked with other work', 45),
  ('mot_collection_delivery_plus', 'MOT with collection & delivery', 'service', 'Only £19 when booked with a service', 90),
  ('inspection_premium', 'Premium Pre-purchase Inspection', 'inspection', NULL, 180),
  ('inspection_standard', 'Standard Pre-purchase Inspection', 'inspection', NULL, 150),
  ('inspection_basic', 'Basic Pre-purchase Inspection', 'inspection', NULL, 120)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  category = VALUES(category),
  description = VALUES(description),
  base_labour_minutes = VALUES(base_labour_minutes);

INSERT INTO service_pricing (service_id, region, labour_rate_eur, parts_markup_pct, travel_fee_eur, vat_pct)
SELECT sc.id, 'UK-default', p.price, 0.00, 0.00, 20.00
FROM (
  SELECT 'diag_car_wont_start' AS code, 66.39 AS price UNION ALL
  SELECT 'diag_plugin_inspection', 66.39 UNION ALL
  SELECT 'service_major', 208.25 UNION ALL
  SELECT 'service_full', 152.86 UNION ALL
  SELECT 'service_interim', 123.45 UNION ALL
  SELECT 'service_vehicle_health', 50.00 UNION ALL
  SELECT 'mot_collection_delivery_plus', 98.00 UNION ALL
  SELECT 'inspection_premium', 163.95 UNION ALL
  SELECT 'inspection_standard', 114.29 UNION ALL
  SELECT 'inspection_basic', 94.87
) AS p
JOIN service_catalog sc ON sc.code = p.code
ON DUPLICATE KEY UPDATE
  labour_rate_eur = VALUES(labour_rate_eur),
  parts_markup_pct = VALUES(parts_markup_pct),
  travel_fee_eur = VALUES(travel_fee_eur),
  vat_pct = VALUES(vat_pct);
