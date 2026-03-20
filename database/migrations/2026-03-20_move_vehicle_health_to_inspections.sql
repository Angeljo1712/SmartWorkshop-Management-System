UPDATE service_catalog
SET category = 'inspection',
    group_name = 'inspections',
    subcategory = 'inspections',
    display_order = 705
WHERE code = 'service_vehicle_health';
