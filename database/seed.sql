-- Seed service catalog + pricing (UK-default).
-- Prices are midpoint estimates from provided UK ranges. Currency assumed GBP.

INSERT INTO service_catalog (code, name, category, group_name, subcategory, display_order, description, base_labour_minutes) VALUES
  ('ev_charger_installation', 'EV Charger installation', 'ev', 'ev_chargers', 'ev_chargers', 10, NULL, 240),
  ('repair_automatic_transmission_service', 'Automatic transmission, housing & fluid systems', 'repair', 'repairs', 'automatic_transmissions', 60, NULL, 180),
  ('repair_body_centre_interior_trim', 'Interior/Seats/Seatbelts', 'repair', 'repairs', 'body_centre_sections', 70, NULL, 120),
  ('repair_body_front_bonnet', 'Bonnets', 'repair', 'repairs', 'body_front_sections', 80, NULL, 90),
  ('repair_clutch_replacement', 'Clutch replacement', 'repair', 'repairs', 'clutch_and_controls', 210, 'Vehicles with a manual gearbox only', 300),
  ('repair_brake_discs_pads_front', 'Brake discs & pads replacement - front (both)', 'repair', 'repairs', 'brakes', 110, NULL, 180),
  ('repair_brake_discs_pads_rear', 'Brake discs & pads replacement - rear (both)', 'repair', 'repairs', 'brakes', 120, NULL, 180),
  ('repair_brake_pads_front', 'Brake pads replacement - front (all)', 'repair', 'repairs', 'brakes', 130, NULL, 90),
  ('repair_brake_pads_rear', 'Brake pads replacement - rear (all)', 'repair', 'repairs', 'brakes', 140, NULL, 90),
  ('repair_timing_chain', 'Timing chain replacement', 'repair', 'repairs', 'engines', 310, NULL, 420),
  ('diagnostic_inspection', 'Diagnostic inspection', 'diagnostics', 'diagnostics', 'general', 610, NULL, 60),
  ('repair_oil_filter', 'Engine oil & filter replacement', 'repair', 'repairs', 'engines', 320, NULL, 90),
  ('mot_test_only', 'MOT (test only)', 'repair', 'mots', 'mots', 20, 'Test only', 60),
  ('mot_collection_delivery', 'MOT with collection & delivery', 'repair', 'mots', 'mots', 30, NULL, 90),
  ('repair_water_pump', 'Water pump replacement', 'repair', 'repairs', 'cooling_systems', 410, NULL, 240),
  ('repair_driveshaft_replacement', 'Driveshaft replacement', 'repair', 'repairs', 'driveshafts_propshafts_differentials', 420, NULL, 210),
  ('repair_alternator', 'Alternator replacement', 'repair', 'repairs', 'engine_management_ignitions', 510, NULL, 210),
  ('repair_fuel_pump_replacement', 'Fuel pump replacement', 'repair', 'repairs', 'engine_management_fuels', 500, NULL, 180),
  ('repair_aux_belt', 'Auxiliary drive belt replacement', 'repair', 'repairs', 'engines', 330, NULL, 60),
  ('repair_exhaust_silencer_replacement', 'Exhaust silencer replacement', 'repair', 'repairs', 'exhaust_systems', 530, NULL, 120),
  ('repair_window_regulator', 'Window regulator replacement', 'repair', 'repairs', 'general_electrics', 540, NULL, 120),
  ('repair_air_conditioning_regas', 'Air conditioning re-gas', 'repair', 'repairs', 'heating_air_conditionings', 550, NULL, 60),
  ('repair_manual_gearbox_service', 'Manual gearbox service', 'repair', 'repairs', 'manual_transmissions', 560, NULL, 120),
  ('repair_track_rod_end', 'Track rod end replacement', 'repair', 'repairs', 'steerings', 570, NULL, 90),
  ('repair_shock_absorbers_front', 'Shock absorbers replacement - front (pair)', 'repair', 'repairs', 'suspensions', 710, NULL, 180),
  ('repair_coil_spring_front', 'Coil spring replacement - front (both)', 'repair', 'repairs', 'suspensions', 720, NULL, 180),
  ('repair_starter_motor', 'Starter motor replacement', 'repair', 'repairs', 'engine_management_ignitions', 520, NULL, 150),
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

-- Pricing: use labour_rate_eur field to store the base price value (GBP).
INSERT INTO service_pricing (service_id, region, labour_rate_eur, parts_markup_pct, travel_fee_eur, vat_pct)
SELECT id, 'UK-default', price, 0.00, 0.00, 20.00
FROM (
  SELECT 'repair_clutch_replacement' AS code, 675.00 AS price UNION ALL
  SELECT 'repair_automatic_transmission_service', 280.00 UNION ALL
  SELECT 'repair_body_centre_interior_trim', 120.00 UNION ALL
  SELECT 'repair_body_front_bonnet', 150.00 UNION ALL
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
  SELECT 'repair_driveshaft_replacement', 310.00 UNION ALL
  SELECT 'repair_alternator', 525.00 UNION ALL
  SELECT 'repair_fuel_pump_replacement', 240.00 UNION ALL
  SELECT 'repair_aux_belt', 110.00 UNION ALL
  SELECT 'repair_exhaust_silencer_replacement', 180.00 UNION ALL
  SELECT 'repair_window_regulator', 165.00 UNION ALL
  SELECT 'repair_air_conditioning_regas', 95.00 UNION ALL
  SELECT 'repair_manual_gearbox_service', 210.00 UNION ALL
  SELECT 'repair_track_rod_end', 140.00 UNION ALL
  SELECT 'repair_shock_absorbers_front', 325.00 UNION ALL
  SELECT 'repair_coil_spring_front', 300.00 UNION ALL
  SELECT 'repair_starter_motor', 375.00 UNION ALL
  SELECT 'repair_turbocharger_replacement', 690.00 UNION ALL
  SELECT 'repair_locking_wheel_nut_removal', 55.00 UNION ALL
  SELECT 'repair_wheel_bearing_front', 260.00 UNION ALL
  SELECT 'repair_wing_mirror_glass', 95.00
  UNION ALL
  SELECT 'ev_charger_installation', 399.00
) AS p
JOIN service_catalog sc ON sc.code = p.code
ON DUPLICATE KEY UPDATE
  labour_rate_eur = VALUES(labour_rate_eur),
  parts_markup_pct = VALUES(parts_markup_pct),
  travel_fee_eur = VALUES(travel_fee_eur),
  vat_pct = VALUES(vat_pct);

-- Additional services (diagnostics, servicing & MOT, pre-purchase inspections)
INSERT INTO service_catalog (code, name, category, group_name, subcategory, display_order, description, base_labour_minutes) VALUES
  ('diag_car_wont_start', 'Car won''t start inspection', 'diagnostics', 'diagnostics', 'general', 620, NULL, 60),
  ('diag_plugin_inspection', 'Plug-in diagnostic inspection', 'diagnostics', 'diagnostics', 'general', 630, NULL, 60),
  ('diag_abs_warning_light', 'ABS Warning Light Inspection', 'diagnostics', 'diagnostics', 'general', 631, NULL, 60),
  ('diag_air_conditioning_system', 'Air conditioning system inspection', 'diagnostics', 'diagnostics', 'general', 632, NULL, 60),
  ('diag_battery_warning_light', 'Battery Warning Light Inspection', 'diagnostics', 'diagnostics', 'general', 633, NULL, 60),
  ('diag_pulls_left_right', 'Pulling System Inspection', 'diagnostics', 'diagnostics', 'general', 634, NULL, 60),
  ('diag_bulb_failure', 'Bulb Failure Inspection', 'diagnostics', 'diagnostics', 'general', 635, NULL, 60),
  ('diag_car_smoking', 'Car Smoking Inspection', 'diagnostics', 'diagnostics', 'general', 636, NULL, 60),
  ('diag_car_leaking_oil', 'Car Leaking Oil Inspection', 'diagnostics', 'diagnostics', 'general', 637, NULL, 60),
  ('diag_car_overheating', 'Car Overheating Inspection', 'diagnostics', 'diagnostics', 'general', 638, NULL, 60),
  ('diag_car_shuddering', 'Car Shuddering/Vibrating Inspection', 'diagnostics', 'diagnostics', 'general', 639, NULL, 60),
  ('diag_car_steering', 'Car Steering Inspection', 'diagnostics', 'diagnostics', 'general', 640, NULL, 60),
  ('diag_catalytic_converter', 'Catalytic Converter Inspection', 'diagnostics', 'diagnostics', 'general', 641, NULL, 60),
  ('diag_central_locking', 'Central Locking Inspection', 'diagnostics', 'diagnostics', 'general', 642, NULL, 60),
  ('diag_convertible_roof', 'Convertible roof fault diagnostic', 'diagnostics', 'diagnostics', 'general', 643, NULL, 60),
  ('diag_cooling_system', 'Cooling System Inspection', 'diagnostics', 'diagnostics', 'general', 644, NULL, 60),
  ('diag_cooling_heating', 'Cooling and Heating Inspection', 'diagnostics', 'diagnostics', 'general', 645, NULL, 60),
  ('diag_cruise_control', 'Cruise Control Inspection', 'diagnostics', 'diagnostics', 'general', 646, NULL, 60),
  ('diag_door_open', 'Door Open Inspection', 'diagnostics', 'diagnostics', 'general', 647, NULL, 60),
  ('diag_electronic_throttle', 'Electronic Throttle Control Inspection', 'diagnostics', 'diagnostics', 'general', 648, NULL, 60),
  ('diag_engine_warning_light', 'Engine Warning Light Inspection', 'diagnostics', 'diagnostics', 'general', 649, NULL, 60),
  ('diag_fuel_filler_cap', 'Fuel Filler Cap Inspection', 'diagnostics', 'diagnostics', 'general', 650, NULL, 60),
  ('diag_gear_selector_transmission', 'Gear Selector And Transmission Inspection', 'diagnostics', 'diagnostics', 'general', 651, NULL, 60),
  ('diag_handbrake', 'Handbrake Inspection', 'diagnostics', 'diagnostics', 'general', 652, NULL, 60),
  ('diag_noise_all_speeds', 'Noise At All Speeds Inspection', 'diagnostics', 'diagnostics', 'general', 653, NULL, 60),
  ('diag_noise_low_speeds', 'Noise At Slow Speeds Inspection', 'diagnostics', 'diagnostics', 'general', 654, NULL, 60),
  ('diag_noise_inside_car', 'Noise Inside Car Inspection', 'diagnostics', 'diagnostics', 'general', 655, NULL, 60),
  ('diag_noise_under_bonnet', 'Noise Under Bonnet Inspection', 'diagnostics', 'diagnostics', 'general', 656, NULL, 60),
  ('diag_noise_when_braking', 'Noise When Braking Inspection', 'diagnostics', 'diagnostics', 'general', 657, NULL, 60),
  ('diag_noise_when_starting', 'Noise When Starting Inspection', 'diagnostics', 'diagnostics', 'general', 658, NULL, 60),
  ('diag_oil_level_pressure', 'Oil Level And Pressure Inspection', 'diagnostics', 'diagnostics', 'general', 659, NULL, 60),
  ('diag_overdrive', 'Overdrive Inspection', 'diagnostics', 'diagnostics', 'general', 660, NULL, 60),
  ('diag_power_steering', 'Power Steering Inspection', 'diagnostics', 'diagnostics', 'general', 661, NULL, 60),
  ('diag_reduced_engine_power', 'Reduced Engine Power Inspection', 'diagnostics', 'diagnostics', 'general', 662, NULL, 60),
  ('diag_srs_airbag', 'SRS/Airbags Inspection', 'diagnostics', 'diagnostics', 'general', 663, NULL, 60),
  ('diag_seatbelts', 'Seatbelts Inspection', 'diagnostics', 'diagnostics', 'general', 664, NULL, 60),
  ('diag_suspension', 'Suspension Inspection', 'diagnostics', 'diagnostics', 'general', 665, NULL, 60),
  ('diag_suspension_noise', 'Suspension Noise Inspection', 'diagnostics', 'diagnostics', 'general', 666, NULL, 60),
  ('diag_traction_control', 'Traction Control Inspection', 'diagnostics', 'diagnostics', 'general', 667, NULL, 60),
  ('diag_transmission_fluid_temp', 'Transmission Fluid Temperature Inspection', 'diagnostics', 'diagnostics', 'general', 668, NULL, 60),
  ('diag_tyre_pressure_warning', 'Tyre pressure warning light inspection (TPMS)', 'diagnostics', 'diagnostics', 'general', 669, NULL, 60),
  ('diag_warning_light', 'Warning Light Inspection', 'diagnostics', 'diagnostics', 'general', 670, NULL, 60),
  ('diag_washer_system', 'Washer System Inspection', 'diagnostics', 'diagnostics', 'general', 671, NULL, 60),
  ('diag_water_car', 'Water Coming into Car Inspection', 'diagnostics', 'diagnostics', 'general', 672, NULL, 60),
  ('diag_windows', 'Windows Inspection', 'diagnostics', 'diagnostics', 'general', 673, NULL, 60),
  ('service_major', 'Major Service', 'service', 'services', 'services', 410, NULL, 240),
  ('service_full', 'Full Service', 'service', 'services', 'services', 420, NULL, 180),
  ('service_interim', 'Interim Service', 'service', 'services', 'services', 430, NULL, 120),
  ('service_vehicle_health', 'Vehicle Health Check', 'inspection', 'inspections', 'inspections', 705, 'Only £30 when booked with other work', 45),
  ('mot_collection_delivery_plus', 'MOT with collection & delivery', 'service', 'mots', 'mots', 40, 'Only £19 when booked with a service', 90),
  ('tyre_fitting', 'Tyre fitting', 'tyres', 'tyres', 'tyres', 510, NULL, 60),
  ('tyre_replacement_pair', 'Tyre replacement - pair', 'tyres', 'tyres', 'tyres', 520, NULL, 90),
  ('inspection_premium', 'Premium Pre-purchase Inspection', 'inspection', 'inspections', 'inspections', 710, NULL, 180),
  ('inspection_standard', 'Standard Pre-purchase Inspection', 'inspection', 'inspections', 'inspections', 720, NULL, 150),
  ('inspection_basic', 'Basic Pre-purchase Inspection', 'inspection', 'inspections', 'inspections', 730, NULL, 120)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  category = VALUES(category),
  group_name = VALUES(group_name),
  subcategory = VALUES(subcategory),
  display_order = VALUES(display_order),
  description = VALUES(description),
  base_labour_minutes = VALUES(base_labour_minutes);

INSERT INTO service_pricing (service_id, region, labour_rate_eur, parts_markup_pct, travel_fee_eur, vat_pct)
SELECT sc.id, 'UK-default', p.price, 0.00, 0.00, 20.00
FROM (
  SELECT 'diag_car_wont_start' AS code, 66.39 AS price UNION ALL
  SELECT 'diag_plugin_inspection', 66.39 UNION ALL
  SELECT 'diag_abs_warning_light', 66.39 UNION ALL
  SELECT 'diag_air_conditioning_system', 66.39 UNION ALL
  SELECT 'diag_battery_warning_light', 66.39 UNION ALL
  SELECT 'diag_pulls_left_right', 66.39 UNION ALL
  SELECT 'diag_bulb_failure', 66.39 UNION ALL
  SELECT 'diag_car_smoking', 66.39 UNION ALL
  SELECT 'diag_car_leaking_oil', 66.39 UNION ALL
  SELECT 'diag_car_overheating', 66.39 UNION ALL
  SELECT 'diag_car_shuddering', 66.39 UNION ALL
  SELECT 'diag_car_steering', 66.39 UNION ALL
  SELECT 'diag_catalytic_converter', 66.39 UNION ALL
  SELECT 'diag_central_locking', 66.39 UNION ALL
  SELECT 'diag_convertible_roof', 66.39 UNION ALL
  SELECT 'diag_cooling_system', 66.39 UNION ALL
  SELECT 'diag_cooling_heating', 66.39 UNION ALL
  SELECT 'diag_cruise_control', 66.39 UNION ALL
  SELECT 'diag_door_open', 66.39 UNION ALL
  SELECT 'diag_electronic_throttle', 66.39 UNION ALL
  SELECT 'diag_engine_warning_light', 66.39 UNION ALL
  SELECT 'diag_fuel_filler_cap', 66.39 UNION ALL
  SELECT 'diag_gear_selector_transmission', 66.39 UNION ALL
  SELECT 'diag_handbrake', 66.39 UNION ALL
  SELECT 'diag_noise_all_speeds', 66.39 UNION ALL
  SELECT 'diag_noise_low_speeds', 66.39 UNION ALL
  SELECT 'diag_noise_inside_car', 66.39 UNION ALL
  SELECT 'diag_noise_under_bonnet', 66.39 UNION ALL
  SELECT 'diag_noise_when_braking', 66.39 UNION ALL
  SELECT 'diag_noise_when_starting', 66.39 UNION ALL
  SELECT 'diag_oil_level_pressure', 66.39 UNION ALL
  SELECT 'diag_overdrive', 66.39 UNION ALL
  SELECT 'diag_power_steering', 66.39 UNION ALL
  SELECT 'diag_reduced_engine_power', 66.39 UNION ALL
  SELECT 'diag_srs_airbag', 66.39 UNION ALL
  SELECT 'diag_seatbelts', 66.39 UNION ALL
  SELECT 'diag_suspension', 66.39 UNION ALL
  SELECT 'diag_suspension_noise', 66.39 UNION ALL
  SELECT 'diag_traction_control', 66.39 UNION ALL
  SELECT 'diag_transmission_fluid_temp', 66.39 UNION ALL
  SELECT 'diag_tyre_pressure_warning', 66.39 UNION ALL
  SELECT 'diag_warning_light', 66.39 UNION ALL
  SELECT 'diag_washer_system', 66.39 UNION ALL
  SELECT 'diag_water_car', 66.39 UNION ALL
  SELECT 'diag_windows', 66.39 UNION ALL
  SELECT 'service_major', 208.25 UNION ALL
  SELECT 'service_full', 152.86 UNION ALL
  SELECT 'service_interim', 123.45 UNION ALL
  SELECT 'service_vehicle_health', 50.00 UNION ALL
  SELECT 'mot_collection_delivery_plus', 98.00 UNION ALL
  SELECT 'tyre_fitting', 85.00 UNION ALL
  SELECT 'tyre_replacement_pair', 190.00 UNION ALL
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
