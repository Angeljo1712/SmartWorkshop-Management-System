INSERT INTO service_catalog (code, name, category, group_name, subcategory, display_order, description, base_labour_minutes) VALUES
  ('repair_automatic_transmission_service', 'Automatic transmission, housing & fluid systems', 'repair', 'repairs', 'automatic_transmissions', 60, NULL, 180),
  ('repair_body_centre_interior_trim', 'Interior/Seats/Seatbelts', 'repair', 'repairs', 'body_centre_sections', 70, NULL, 120),
  ('repair_body_front_bonnet', 'Bonnets', 'repair', 'repairs', 'body_front_sections', 80, NULL, 90),
  ('repair_driveshaft_replacement', 'Driveshaft replacement', 'repair', 'repairs', 'driveshafts_propshafts_differentials', 420, NULL, 210),
  ('repair_fuel_pump_replacement', 'Fuel pump replacement', 'repair', 'repairs', 'engine_management_fuels', 500, NULL, 180),
  ('repair_exhaust_silencer_replacement', 'Exhaust silencer replacement', 'repair', 'repairs', 'exhaust_systems', 530, NULL, 120),
  ('repair_window_regulator', 'Window regulator replacement', 'repair', 'repairs', 'general_electrics', 540, NULL, 120),
  ('repair_air_conditioning_regas', 'Air conditioning re-gas', 'repair', 'repairs', 'heating_air_conditionings', 550, NULL, 60),
  ('repair_manual_gearbox_service', 'Manual gearbox service', 'repair', 'repairs', 'manual_transmissions', 560, NULL, 120),
  ('repair_track_rod_end', 'Track rod end replacement', 'repair', 'repairs', 'steerings', 570, NULL, 90),
  ('repair_turbocharger_replacement', 'Turbocharger replacement', 'repair', 'repairs', 'turbocharger_intercoolers', 730, NULL, 300),
  ('repair_locking_wheel_nut_removal', 'Locking wheel nut removal (one)', 'repair', 'repairs', 'vehicle_securities', 740, NULL, 45),
  ('repair_wheel_bearing_front', 'Front wheel bearing replacement', 'repair', 'repairs', 'wheel_bearings', 750, NULL, 150),
  ('repair_wing_mirror_glass', 'Wing mirror glass replacement', 'repair', 'repairs', 'wing_mirrors', 760, NULL, 60)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  category = VALUES(category),
  group_name = VALUES(group_name),
  subcategory = VALUES(subcategory),
  display_order = VALUES(display_order),
  description = VALUES(description),
  base_labour_minutes = VALUES(base_labour_minutes);

INSERT INTO service_pricing (service_id, region, labour_rate_eur, parts_markup_pct, travel_fee_eur, vat_pct)
SELECT sc.id, 'UK-default', prices.price, 0.00, 0.00, 20.00
FROM (
  SELECT 'repair_automatic_transmission_service' AS code, 280.00 AS price UNION ALL
  SELECT 'repair_body_centre_interior_trim', 120.00 UNION ALL
  SELECT 'repair_body_front_bonnet', 150.00 UNION ALL
  SELECT 'repair_driveshaft_replacement', 310.00 UNION ALL
  SELECT 'repair_fuel_pump_replacement', 240.00 UNION ALL
  SELECT 'repair_exhaust_silencer_replacement', 180.00 UNION ALL
  SELECT 'repair_window_regulator', 165.00 UNION ALL
  SELECT 'repair_air_conditioning_regas', 95.00 UNION ALL
  SELECT 'repair_manual_gearbox_service', 210.00 UNION ALL
  SELECT 'repair_track_rod_end', 140.00 UNION ALL
  SELECT 'repair_turbocharger_replacement', 690.00 UNION ALL
  SELECT 'repair_locking_wheel_nut_removal', 55.00 UNION ALL
  SELECT 'repair_wheel_bearing_front', 260.00 UNION ALL
  SELECT 'repair_wing_mirror_glass', 95.00
) AS prices
JOIN service_catalog sc ON sc.code = prices.code
ON DUPLICATE KEY UPDATE
  labour_rate_eur = VALUES(labour_rate_eur),
  parts_markup_pct = VALUES(parts_markup_pct),
  travel_fee_eur = VALUES(travel_fee_eur),
  vat_pct = VALUES(vat_pct);
