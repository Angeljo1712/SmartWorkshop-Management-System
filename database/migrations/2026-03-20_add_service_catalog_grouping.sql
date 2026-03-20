ALTER TABLE service_catalog
  ADD COLUMN group_name VARCHAR(64) NULL AFTER category,
  ADD COLUMN subcategory VARCHAR(64) NULL AFTER group_name,
  ADD COLUMN display_order INT NOT NULL DEFAULT 1000 AFTER subcategory;

UPDATE service_catalog
SET
  group_name = CASE
    WHEN code IN ('mot_test_only', 'mot_collection_delivery', 'mot_collection_delivery_plus') THEN 'mots'
    WHEN category = 'service' THEN 'services'
    WHEN category = 'diagnostics' THEN 'diagnostics'
    WHEN category = 'inspection' THEN 'inspections'
    WHEN category = 'repair' THEN 'repairs'
    ELSE category
  END,
  subcategory = CASE
    WHEN code = 'repair_clutch_replacement' THEN 'clutch_and_controls'
    WHEN code IN ('repair_brake_discs_pads_front', 'repair_brake_discs_pads_rear', 'repair_brake_pads_front', 'repair_brake_pads_rear') THEN 'brakes'
    WHEN code IN ('repair_timing_chain', 'repair_oil_filter', 'repair_aux_belt') THEN 'engines'
    WHEN code = 'repair_water_pump' THEN 'cooling_systems'
    WHEN code IN ('repair_alternator', 'repair_starter_motor') THEN 'engine_management_ignitions'
    WHEN code IN ('repair_shock_absorbers_front', 'repair_coil_spring_front') THEN 'suspensions'
    WHEN code IN ('mot_test_only', 'mot_collection_delivery', 'mot_collection_delivery_plus') THEN 'mots'
    WHEN category = 'service' THEN 'services'
    WHEN category = 'diagnostics' THEN 'general'
    WHEN category = 'inspection' THEN 'inspections'
    ELSE NULL
  END,
  display_order = CASE
    WHEN code = 'mot_test_only' THEN 20
    WHEN code = 'mot_collection_delivery' THEN 30
    WHEN code = 'mot_collection_delivery_plus' THEN 40
    WHEN code = 'repair_brake_discs_pads_front' THEN 110
    WHEN code = 'repair_brake_discs_pads_rear' THEN 120
    WHEN code = 'repair_brake_pads_front' THEN 130
    WHEN code = 'repair_brake_pads_rear' THEN 140
    WHEN code = 'repair_clutch_replacement' THEN 210
    WHEN code = 'repair_timing_chain' THEN 310
    WHEN code = 'repair_oil_filter' THEN 320
    WHEN code = 'repair_aux_belt' THEN 330
    WHEN code = 'service_major' THEN 410
    WHEN code = 'service_full' THEN 420
    WHEN code = 'service_interim' THEN 430
    WHEN code = 'service_vehicle_health' THEN 440
    WHEN code = 'repair_water_pump' THEN 510
    WHEN code = 'repair_alternator' THEN 610
    WHEN code = 'repair_starter_motor' THEN 620
    WHEN code = 'diagnostic_inspection' THEN 710
    WHEN code = 'diag_car_wont_start' THEN 720
    WHEN code = 'diag_plugin_inspection' THEN 730
    WHEN code = 'repair_shock_absorbers_front' THEN 810
    WHEN code = 'repair_coil_spring_front' THEN 820
    WHEN code = 'inspection_premium' THEN 910
    WHEN code = 'inspection_standard' THEN 920
    WHEN code = 'inspection_basic' THEN 930
    ELSE 1000
  END;
