INSERT INTO service_catalog (code, name, category, group_name, subcategory, display_order, description, base_labour_minutes) VALUES
  ('ev_charger_installation', 'EV Charger installation', 'ev', 'ev_chargers', 'ev_chargers', 10, NULL, 240),
  ('tyre_fitting', 'Tyre fitting', 'tyres', 'tyres', 'tyres', 510, NULL, 60),
  ('tyre_replacement_pair', 'Tyre replacement - pair', 'tyres', 'tyres', 'tyres', 520, NULL, 90)
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
  SELECT 'ev_charger_installation' AS code, 399.00 AS price UNION ALL
  SELECT 'tyre_fitting', 85.00 UNION ALL
  SELECT 'tyre_replacement_pair', 190.00
) AS prices
JOIN service_catalog sc ON sc.code = prices.code
ON DUPLICATE KEY UPDATE
  labour_rate_eur = VALUES(labour_rate_eur),
  parts_markup_pct = VALUES(parts_markup_pct),
  travel_fee_eur = VALUES(travel_fee_eur),
  vat_pct = VALUES(vat_pct);
