-- Staging bootstrap data.
-- This keeps staging usable while leaving the rest of the database empty.

INSERT IGNORE INTO users (
  uuid_public,
  email,
  username,
  phone,
  password_hash,
  role,
  status
) VALUES (
  UUID_TO_BIN(UUID()),
  'admin@smartworkshop.local',
  'admin',
  NULL,
  '$2a$10$bXPeMaQwOR/NdSy.viiUcumvxr8IXRDoBJBdTKdcN1V92ApcsLgPm',
  'admin',
  'active'
);

INSERT IGNORE INTO user_roles (user_id, role)
SELECT id, 'admin'
FROM users
WHERE email = 'admin@smartworkshop.local';

INSERT IGNORE INTO user_profiles (user_id, name, lastname, avatar_url)
SELECT id, 'Admin', 'User', NULL
FROM users
WHERE email = 'admin@smartworkshop.local';

INSERT IGNORE INTO users (
  uuid_public,
  email,
  username,
  phone,
  password_hash,
  role,
  status
) VALUES (
  UUID_TO_BIN(UUID()),
  'mechanic@smartworkshop.local',
  'mechanic',
  NULL,
  '$2a$10$euF2T5Oe7Sd.PVO/wemAbenhnZ7aWIkFwgMxdNkRs2C..SoN6eXfy',
  'mechanic',
  'active'
);

INSERT IGNORE INTO user_roles (user_id, role)
SELECT id, 'mechanic'
FROM users
WHERE email = 'mechanic@smartworkshop.local';

INSERT IGNORE INTO user_profiles (user_id, name, lastname, avatar_url)
SELECT id, 'Mia', 'Mechanic', NULL
FROM users
WHERE email = 'mechanic@smartworkshop.local';

INSERT IGNORE INTO mechanic_profiles (
  user_id,
  display_name,
  legal_name,
  years_experience,
  work_history,
  website_url,
  has_trade_insurance,
  has_public_liability,
  vat_registered,
  business_type,
  application_type,
  lead_postcode,
  application_status,
  account_status,
  password_set_at,
  travel_radius_miles,
  availability_pref,
  referral_source,
  vat_id,
  is_mobile,
  rating_avg,
  jobs_done,
  about
)
SELECT
  id,
  'Mia Mechanic',
  'Mia Mechanic Ltd',
  8,
  NULL,
  NULL,
  1,
  1,
  1,
  'independent_garage',
  'staging_demo',
  'SW1A 1AA',
  'approved',
  'active',
  NOW(),
  25,
  'search',
  'seed',
  NULL,
  1,
  4.8,
  12,
  'Staging demo mechanic account.'
FROM users
WHERE email = 'mechanic@smartworkshop.local';

INSERT IGNORE INTO mechanic_qualifications (user_id, name)
SELECT id, 'NVQ Level 3'
FROM users
WHERE email = 'mechanic@smartworkshop.local';

INSERT IGNORE INTO mechanic_qualifications (user_id, name)
SELECT id, 'EV/HEV Qualification/Training'
FROM users
WHERE email = 'mechanic@smartworkshop.local';

INSERT IGNORE INTO mechanic_memberships (user_id, name)
SELECT id, 'RAC Approved Garage'
FROM users
WHERE email = 'mechanic@smartworkshop.local';

INSERT IGNORE INTO mechanic_accreditations (user_id, name)
SELECT id, 'ATA Level 2'
FROM users
WHERE email = 'mechanic@smartworkshop.local';

INSERT IGNORE INTO mechanic_services_offered (user_id, service_type)
SELECT id, 'mobile_mechanic_service'
FROM users
WHERE email = 'mechanic@smartworkshop.local';

-- Additional London demo mechanics for staging tests.
INSERT IGNORE INTO users (
  uuid_public,
  email,
  username,
  phone,
  password_hash,
  role,
  status
) VALUES
  (UUID_TO_BIN(UUID()), 'oliver.king@smartworkshop.local', 'oliver_king', NULL, '$2a$10$P6GUUJMnNjZxdCyl0EQhbO4OXH9rUd481tc//A03qci50Rg9fVgEC', 'mechanic', 'active'),
  (UUID_TO_BIN(UUID()), 'priya.shah@smartworkshop.local', 'priya_shah', NULL, '$2a$10$pJyM7nLg4AfiR7Opnj4wy.uEUrqu6agy7lMJ9ABeolU3BR/5tDyxi', 'mechanic', 'active'),
  (UUID_TO_BIN(UUID()), 'marcus.reid@smartworkshop.local', 'marcus_reid', NULL, '$2a$10$li.agC.1/Wxo0BP.6FhWhuAHT4JGaruwnW2BGpnBdTUYz2QKs8WSi', 'mechanic', 'active'),
  (UUID_TO_BIN(UUID()), 'elena.brooks@smartworkshop.local', 'elena_brooks', NULL, '$2a$10$7o5MMQKis4y3dk0C12sMjubWCB67EtwewS0abhRBxQPRSzuxlR7C2', 'mechanic', 'active'),
  (UUID_TO_BIN(UUID()), 'hassan.ali@smartworkshop.local', 'hassan_ali', NULL, '$2a$10$s1VOj6xYLQ5X8SWMfqMn0.39EPozTW4git9.dHQxM36nBiHYUgKtG', 'mechanic', 'active'),
  (UUID_TO_BIN(UUID()), 'chloe.bennett@smartworkshop.local', 'chloe_bennett', NULL, '$2a$10$w5TsxpHEyJWU8Mctgyb/dOv1dPpHmIA.Y1CWau2ZjnAxEJZKbyIGW', 'mechanic', 'active'),
  (UUID_TO_BIN(UUID()), 'daniel.foster@smartworkshop.local', 'daniel_foster', NULL, '$2a$10$HzTJCpYM17VeGm1LaqgGgOnfczAsefoZNV7U73Mf3jSZ1Udw81Ph.', 'mechanic', 'active'),
  (UUID_TO_BIN(UUID()), 'sofia.rossi@smartworkshop.local', 'sofia_rossi', NULL, '$2a$10$s7I2p39rjrsp6/1tr4FWA.cYcCg68rEtgBzi7MOBVU79Y1c5bOUAW', 'mechanic', 'active'),
  (UUID_TO_BIN(UUID()), 'liam.walker@smartworkshop.local', 'liam_walker', NULL, '$2a$10$xBbWg8HXc.mzSXbd1GKSeuYevPYYBwiO88cw7rAyZV5VWt/./lqbm', 'mechanic', 'active'),
  (UUID_TO_BIN(UUID()), 'ava.patel@smartworkshop.local', 'ava_patel', NULL, '$2a$10$Yq08FgVztAqd3mnQB8UTm.95IpCLoCjDPb8hi6FfKF7Ie5uZRYpOa', 'mechanic', 'active');

INSERT IGNORE INTO user_roles (user_id, role)
SELECT id, 'mechanic' FROM users WHERE email = 'oliver.king@smartworkshop.local';
INSERT IGNORE INTO user_roles (user_id, role)
SELECT id, 'mechanic' FROM users WHERE email = 'priya.shah@smartworkshop.local';
INSERT IGNORE INTO user_roles (user_id, role)
SELECT id, 'mechanic' FROM users WHERE email = 'marcus.reid@smartworkshop.local';
INSERT IGNORE INTO user_roles (user_id, role)
SELECT id, 'mechanic' FROM users WHERE email = 'elena.brooks@smartworkshop.local';
INSERT IGNORE INTO user_roles (user_id, role)
SELECT id, 'mechanic' FROM users WHERE email = 'hassan.ali@smartworkshop.local';
INSERT IGNORE INTO user_roles (user_id, role)
SELECT id, 'mechanic' FROM users WHERE email = 'chloe.bennett@smartworkshop.local';
INSERT IGNORE INTO user_roles (user_id, role)
SELECT id, 'mechanic' FROM users WHERE email = 'daniel.foster@smartworkshop.local';
INSERT IGNORE INTO user_roles (user_id, role)
SELECT id, 'mechanic' FROM users WHERE email = 'sofia.rossi@smartworkshop.local';
INSERT IGNORE INTO user_roles (user_id, role)
SELECT id, 'mechanic' FROM users WHERE email = 'liam.walker@smartworkshop.local';
INSERT IGNORE INTO user_roles (user_id, role)
SELECT id, 'mechanic' FROM users WHERE email = 'ava.patel@smartworkshop.local';

INSERT IGNORE INTO user_profiles (user_id, name, lastname, avatar_url)
SELECT id, 'Oliver', 'King', NULL FROM users WHERE email = 'oliver.king@smartworkshop.local';
INSERT IGNORE INTO user_profiles (user_id, name, lastname, avatar_url)
SELECT id, 'Priya', 'Shah', NULL FROM users WHERE email = 'priya.shah@smartworkshop.local';
INSERT IGNORE INTO user_profiles (user_id, name, lastname, avatar_url)
SELECT id, 'Marcus', 'Reid', NULL FROM users WHERE email = 'marcus.reid@smartworkshop.local';
INSERT IGNORE INTO user_profiles (user_id, name, lastname, avatar_url)
SELECT id, 'Elena', 'Brooks', NULL FROM users WHERE email = 'elena.brooks@smartworkshop.local';
INSERT IGNORE INTO user_profiles (user_id, name, lastname, avatar_url)
SELECT id, 'Hassan', 'Ali', NULL FROM users WHERE email = 'hassan.ali@smartworkshop.local';
INSERT IGNORE INTO user_profiles (user_id, name, lastname, avatar_url)
SELECT id, 'Chloe', 'Bennett', NULL FROM users WHERE email = 'chloe.bennett@smartworkshop.local';
INSERT IGNORE INTO user_profiles (user_id, name, lastname, avatar_url)
SELECT id, 'Daniel', 'Foster', NULL FROM users WHERE email = 'daniel.foster@smartworkshop.local';
INSERT IGNORE INTO user_profiles (user_id, name, lastname, avatar_url)
SELECT id, 'Sofia', 'Rossi', NULL FROM users WHERE email = 'sofia.rossi@smartworkshop.local';
INSERT IGNORE INTO user_profiles (user_id, name, lastname, avatar_url)
SELECT id, 'Liam', 'Walker', NULL FROM users WHERE email = 'liam.walker@smartworkshop.local';
INSERT IGNORE INTO user_profiles (user_id, name, lastname, avatar_url)
SELECT id, 'Ava', 'Patel', NULL FROM users WHERE email = 'ava.patel@smartworkshop.local';

INSERT IGNORE INTO mechanic_profiles (
  user_id, display_name, legal_name, years_experience, work_history, website_url,
  has_trade_insurance, has_public_liability, vat_registered, business_type,
  application_type, lead_postcode, application_status, account_status,
  password_set_at, travel_radius_miles, availability_pref, referral_source,
  vat_id, is_mobile, rating_avg, jobs_done, about
)
SELECT id, 'Oliver King EV', 'Oliver King EV Services Ltd', 11, NULL, NULL, 1, 1, 1,
       'mobile_specialist', 'staging_demo', 'SW1P 3AD', 'approved', 'active',
       NOW(), 30, 'search', 'seed', NULL, 1, 4.90, 44,
       'EV charger installation and mobile diagnostics in Westminster and nearby.'
FROM users WHERE email = 'oliver.king@smartworkshop.local';
INSERT IGNORE INTO mechanic_profiles (
  user_id, display_name, legal_name, years_experience, work_history, website_url,
  has_trade_insurance, has_public_liability, vat_registered, business_type,
  application_type, lead_postcode, application_status, account_status,
  password_set_at, travel_radius_miles, availability_pref, referral_source,
  vat_id, is_mobile, rating_avg, jobs_done, about
)
SELECT id, 'Priya Shah Diagnostics', 'Priya Shah Diagnostics Ltd', 9, NULL, NULL, 1, 1, 1,
       'diagnostics_center', 'staging_demo', 'SE1 1TJ', 'approved', 'active',
       NOW(), 20, 'map', 'seed', NULL, 0, 4.70, 38,
       'Diagnostics and MOT pre-checks across the South Bank.'
FROM users WHERE email = 'priya.shah@smartworkshop.local';
INSERT IGNORE INTO mechanic_profiles (
  user_id, display_name, legal_name, years_experience, work_history, website_url,
  has_trade_insurance, has_public_liability, vat_registered, business_type,
  application_type, lead_postcode, application_status, account_status,
  password_set_at, travel_radius_miles, availability_pref, referral_source,
  vat_id, is_mobile, rating_avg, jobs_done, about
)
SELECT id, 'Marcus Reid Brakes', 'Marcus Reid Brakes Ltd', 14, NULL, NULL, 1, 1, 1,
       'brake_specialist', 'staging_demo', 'E1 1NL', 'approved', 'active',
       NOW(), 18, 'search', 'seed', NULL, 0, 4.85, 61,
       'Brake discs, pads and suspension work in East London.'
FROM users WHERE email = 'marcus.reid@smartworkshop.local';
INSERT IGNORE INTO mechanic_profiles (
  user_id, display_name, legal_name, years_experience, work_history, website_url,
  has_trade_insurance, has_public_liability, vat_registered, business_type,
  application_type, lead_postcode, application_status, account_status,
  password_set_at, travel_radius_miles, availability_pref, referral_source,
  vat_id, is_mobile, rating_avg, jobs_done, about
)
SELECT id, 'Elena Brooks Transmission', 'Elena Brooks Transmission Ltd', 12, NULL, NULL, 1, 1, 1,
       'transmission_shop', 'staging_demo', 'N7 8JP', 'approved', 'active',
       NOW(), 20, 'search', 'seed', NULL, 0, 4.75, 49,
       'Clutch and transmission specialist for North London drivers.'
FROM users WHERE email = 'elena.brooks@smartworkshop.local';
INSERT IGNORE INTO mechanic_profiles (
  user_id, display_name, legal_name, years_experience, work_history, website_url,
  has_trade_insurance, has_public_liability, vat_registered, business_type,
  application_type, lead_postcode, application_status, account_status,
  password_set_at, travel_radius_miles, availability_pref, referral_source,
  vat_id, is_mobile, rating_avg, jobs_done, about
)
SELECT id, 'Hassan Ali Tyres', 'Hassan Ali Tyres Ltd', 8, NULL, NULL, 1, 1, 1,
       'tyre_center', 'staging_demo', 'W3 6ND', 'approved', 'active',
       NOW(), 15, 'map', 'seed', NULL, 0, 4.60, 27,
       'Tyre fitting and wheel service in West London.'
FROM users WHERE email = 'hassan.ali@smartworkshop.local';
INSERT IGNORE INTO mechanic_profiles (
  user_id, display_name, legal_name, years_experience, work_history, website_url,
  has_trade_insurance, has_public_liability, vat_registered, business_type,
  application_type, lead_postcode, application_status, account_status,
  password_set_at, travel_radius_miles, availability_pref, referral_source,
  vat_id, is_mobile, rating_avg, jobs_done, about
)
SELECT id, 'Chloe Bennett AC', 'Chloe Bennett AC Ltd', 10, NULL, NULL, 1, 1, 1,
       'ac_specialist', 'staging_demo', 'CR0 4RG', 'approved', 'active',
       NOW(), 22, 'search', 'seed', NULL, 0, 4.80, 36,
       'Air conditioning regas and heating diagnostics for South London.'
FROM users WHERE email = 'chloe.bennett@smartworkshop.local';
INSERT IGNORE INTO mechanic_profiles (
  user_id, display_name, legal_name, years_experience, work_history, website_url,
  has_trade_insurance, has_public_liability, vat_registered, business_type,
  application_type, lead_postcode, application_status, account_status,
  password_set_at, travel_radius_miles, availability_pref, referral_source,
  vat_id, is_mobile, rating_avg, jobs_done, about
)
SELECT id, 'Daniel Foster Engine Repair', 'Daniel Foster Engine Repair Ltd', 13, NULL, NULL, 1, 1, 1,
       'engine_repair', 'staging_demo', 'E17 6JF', 'approved', 'active',
       NOW(), 25, 'search', 'seed', NULL, 1, 4.88, 57,
       'Engine repair and mobile maintenance around Walthamstow.'
FROM users WHERE email = 'daniel.foster@smartworkshop.local';
INSERT IGNORE INTO mechanic_profiles (
  user_id, display_name, legal_name, years_experience, work_history, website_url,
  has_trade_insurance, has_public_liability, vat_registered, business_type,
  application_type, lead_postcode, application_status, account_status,
  password_set_at, travel_radius_miles, availability_pref, referral_source,
  vat_id, is_mobile, rating_avg, jobs_done, about
)
SELECT id, 'Sofia Rossi Body Shop', 'Sofia Rossi Body Shop Ltd', 15, NULL, NULL, 1, 1, 1,
       'body_shop', 'staging_demo', 'N8 9DG', 'approved', 'active',
       NOW(), 16, 'map', 'seed', NULL, 0, 4.66, 41,
       'Body and trim specialist covering Crouch End and nearby boroughs.'
FROM users WHERE email = 'sofia.rossi@smartworkshop.local';
INSERT IGNORE INTO mechanic_profiles (
  user_id, display_name, legal_name, years_experience, work_history, website_url,
  has_trade_insurance, has_public_liability, vat_registered, business_type,
  application_type, lead_postcode, application_status, account_status,
  password_set_at, travel_radius_miles, availability_pref, referral_source,
  vat_id, is_mobile, rating_avg, jobs_done, about
)
SELECT id, 'Liam Walker Mobile Service', 'Liam Walker Mobile Service Ltd', 7, NULL, NULL, 1, 1, 1,
       'mobile_mechanic', 'staging_demo', 'SW16 1ER', 'approved', 'active',
       NOW(), 28, 'search', 'seed', NULL, 1, 4.55, 22,
       'Mobile servicing and inspection work in Streatham and South West London.'
FROM users WHERE email = 'liam.walker@smartworkshop.local';
INSERT IGNORE INTO mechanic_profiles (
  user_id, display_name, legal_name, years_experience, work_history, website_url,
  has_trade_insurance, has_public_liability, vat_registered, business_type,
  application_type, lead_postcode, application_status, account_status,
  password_set_at, travel_radius_miles, availability_pref, referral_source,
  vat_id, is_mobile, rating_avg, jobs_done, about
)
SELECT id, 'Ava Patel Hybrid', 'Ava Patel Hybrid Ltd', 9, NULL, NULL, 1, 1, 1,
       'hybrid_specialist', 'staging_demo', 'HA9 8TS', 'approved', 'active',
       NOW(), 20, 'map', 'seed', NULL, 0, 4.79, 33,
       'Hybrid and EV repair specialist in Wembley.'
FROM users WHERE email = 'ava.patel@smartworkshop.local';

INSERT INTO addresses (uuid_public, user_id, label, line1, line2, city, postal_code, country, location)
SELECT UUID_TO_BIN(UUID()), u.id, 'Premises', '14 Great George Street', NULL, 'Westminster', 'SW1P 3AD', 'GB', ST_GeomFromText('POINT(-0.1246 51.5008)', 4326)
FROM users u WHERE u.email = 'oliver.king@smartworkshop.local'
  AND NOT EXISTS (SELECT 1 FROM addresses a WHERE a.user_id = u.id AND a.label = 'Premises');
INSERT INTO addresses (uuid_public, user_id, label, line1, line2, city, postal_code, country, location)
SELECT UUID_TO_BIN(UUID()), u.id, 'Premises', '22 Southwark Street', NULL, 'South Bank', 'SE1 1TJ', 'GB', ST_GeomFromText('POINT(-0.1130 51.5055)', 4326)
FROM users u WHERE u.email = 'priya.shah@smartworkshop.local'
  AND NOT EXISTS (SELECT 1 FROM addresses a WHERE a.user_id = u.id AND a.label = 'Premises');
INSERT INTO addresses (uuid_public, user_id, label, line1, line2, city, postal_code, country, location)
SELECT UUID_TO_BIN(UUID()), u.id, 'Premises', '18 Commercial Road', NULL, 'Whitechapel', 'E1 1NL', 'GB', ST_GeomFromText('POINT(-0.0592 51.5176)', 4326)
FROM users u WHERE u.email = 'marcus.reid@smartworkshop.local'
  AND NOT EXISTS (SELECT 1 FROM addresses a WHERE a.user_id = u.id AND a.label = 'Premises');
INSERT INTO addresses (uuid_public, user_id, label, line1, line2, city, postal_code, country, location)
SELECT UUID_TO_BIN(UUID()), u.id, 'Premises', '9 Holloway Road', NULL, 'Islington', 'N7 8JP', 'GB', ST_GeomFromText('POINT(-0.1033 51.5368)', 4326)
FROM users u WHERE u.email = 'elena.brooks@smartworkshop.local'
  AND NOT EXISTS (SELECT 1 FROM addresses a WHERE a.user_id = u.id AND a.label = 'Premises');
INSERT INTO addresses (uuid_public, user_id, label, line1, line2, city, postal_code, country, location)
SELECT UUID_TO_BIN(UUID()), u.id, 'Premises', '31 High Street', NULL, 'Acton', 'W3 6ND', 'GB', ST_GeomFromText('POINT(-0.2664 51.5139)', 4326)
FROM users u WHERE u.email = 'hassan.ali@smartworkshop.local'
  AND NOT EXISTS (SELECT 1 FROM addresses a WHERE a.user_id = u.id AND a.label = 'Premises');
INSERT INTO addresses (uuid_public, user_id, label, line1, line2, city, postal_code, country, location)
SELECT UUID_TO_BIN(UUID()), u.id, 'Premises', '5 Purley Way', NULL, 'Croydon', 'CR0 4RG', 'GB', ST_GeomFromText('POINT(-0.1010 51.3762)', 4326)
FROM users u WHERE u.email = 'chloe.bennett@smartworkshop.local'
  AND NOT EXISTS (SELECT 1 FROM addresses a WHERE a.user_id = u.id AND a.label = 'Premises');
INSERT INTO addresses (uuid_public, user_id, label, line1, line2, city, postal_code, country, location)
SELECT UUID_TO_BIN(UUID()), u.id, 'Premises', '44 Forest Road', NULL, 'Walthamstow', 'E17 6JF', 'GB', ST_GeomFromText('POINT(-0.0210 51.5849)', 4326)
FROM users u WHERE u.email = 'daniel.foster@smartworkshop.local'
  AND NOT EXISTS (SELECT 1 FROM addresses a WHERE a.user_id = u.id AND a.label = 'Premises');
INSERT INTO addresses (uuid_public, user_id, label, line1, line2, city, postal_code, country, location)
SELECT UUID_TO_BIN(UUID()), u.id, 'Premises', '12 Tottenham Lane', NULL, 'Crouch End', 'N8 9DG', 'GB', ST_GeomFromText('POINT(-0.1200 51.5790)', 4326)
FROM users u WHERE u.email = 'sofia.rossi@smartworkshop.local'
  AND NOT EXISTS (SELECT 1 FROM addresses a WHERE a.user_id = u.id AND a.label = 'Premises');
INSERT INTO addresses (uuid_public, user_id, label, line1, line2, city, postal_code, country, location)
SELECT UUID_TO_BIN(UUID()), u.id, 'Premises', '27 Streatham High Road', NULL, 'Streatham', 'SW16 1ER', 'GB', ST_GeomFromText('POINT(-0.1297 51.4292)', 4326)
FROM users u WHERE u.email = 'liam.walker@smartworkshop.local'
  AND NOT EXISTS (SELECT 1 FROM addresses a WHERE a.user_id = u.id AND a.label = 'Premises');
INSERT INTO addresses (uuid_public, user_id, label, line1, line2, city, postal_code, country, location)
SELECT UUID_TO_BIN(UUID()), u.id, 'Premises', '101 Wembley Park Drive', NULL, 'Wembley', 'HA9 8TS', 'GB', ST_GeomFromText('POINT(-0.2811 51.5560)', 4326)
FROM users u WHERE u.email = 'ava.patel@smartworkshop.local'
  AND NOT EXISTS (SELECT 1 FROM addresses a WHERE a.user_id = u.id AND a.label = 'Premises');

INSERT INTO mechanic_qualifications (user_id, name)
SELECT u.id, 'EV/HEV Qualification/Training' FROM users u WHERE u.email = 'oliver.king@smartworkshop.local'
  AND NOT EXISTS (SELECT 1 FROM mechanic_qualifications q WHERE q.user_id = u.id AND q.name = 'EV/HEV Qualification/Training');
INSERT INTO mechanic_qualifications (user_id, name)
SELECT u.id, 'NVQ Level 3' FROM users u WHERE u.email = 'priya.shah@smartworkshop.local'
  AND NOT EXISTS (SELECT 1 FROM mechanic_qualifications q WHERE q.user_id = u.id AND q.name = 'NVQ Level 3');
INSERT INTO mechanic_qualifications (user_id, name)
SELECT u.id, 'City & Guilds Level 3' FROM users u WHERE u.email = 'marcus.reid@smartworkshop.local'
  AND NOT EXISTS (SELECT 1 FROM mechanic_qualifications q WHERE q.user_id = u.id AND q.name = 'City & Guilds Level 3');
INSERT INTO mechanic_qualifications (user_id, name)
SELECT u.id, 'NVQ Level 2' FROM users u WHERE u.email = 'elena.brooks@smartworkshop.local'
  AND NOT EXISTS (SELECT 1 FROM mechanic_qualifications q WHERE q.user_id = u.id AND q.name = 'NVQ Level 2');
INSERT INTO mechanic_qualifications (user_id, name)
SELECT u.id, 'City & Guilds Level 2' FROM users u WHERE u.email = 'hassan.ali@smartworkshop.local'
  AND NOT EXISTS (SELECT 1 FROM mechanic_qualifications q WHERE q.user_id = u.id AND q.name = 'City & Guilds Level 2');
INSERT INTO mechanic_qualifications (user_id, name)
SELECT u.id, 'NVQ Level 1' FROM users u WHERE u.email = 'chloe.bennett@smartworkshop.local'
  AND NOT EXISTS (SELECT 1 FROM mechanic_qualifications q WHERE q.user_id = u.id AND q.name = 'NVQ Level 1');
INSERT INTO mechanic_qualifications (user_id, name)
SELECT u.id, 'City & Guilds Level 1' FROM users u WHERE u.email = 'daniel.foster@smartworkshop.local'
  AND NOT EXISTS (SELECT 1 FROM mechanic_qualifications q WHERE q.user_id = u.id AND q.name = 'City & Guilds Level 1');
INSERT INTO mechanic_qualifications (user_id, name)
SELECT u.id, 'Other Qualification' FROM users u WHERE u.email = 'sofia.rossi@smartworkshop.local'
  AND NOT EXISTS (SELECT 1 FROM mechanic_qualifications q WHERE q.user_id = u.id AND q.name = 'Other Qualification');
INSERT INTO mechanic_qualifications (user_id, name)
SELECT u.id, 'EV/HEV Qualification/Training' FROM users u WHERE u.email = 'liam.walker@smartworkshop.local'
  AND NOT EXISTS (SELECT 1 FROM mechanic_qualifications q WHERE q.user_id = u.id AND q.name = 'EV/HEV Qualification/Training');
INSERT INTO mechanic_qualifications (user_id, name)
SELECT u.id, 'NVQ Level 3' FROM users u WHERE u.email = 'ava.patel@smartworkshop.local'
  AND NOT EXISTS (SELECT 1 FROM mechanic_qualifications q WHERE q.user_id = u.id AND q.name = 'NVQ Level 3');

INSERT INTO mechanic_accreditations (user_id, name)
SELECT u.id, 'IRTEC Accredited / Qualified Technician' FROM users u WHERE u.email = 'oliver.king@smartworkshop.local'
  AND NOT EXISTS (SELECT 1 FROM mechanic_accreditations a WHERE a.user_id = u.id AND a.name = 'IRTEC Accredited / Qualified Technician');
INSERT INTO mechanic_accreditations (user_id, name)
SELECT u.id, 'ATA Level 2' FROM users u WHERE u.email = 'priya.shah@smartworkshop.local'
  AND NOT EXISTS (SELECT 1 FROM mechanic_accreditations a WHERE a.user_id = u.id AND a.name = 'ATA Level 2');
INSERT INTO mechanic_accreditations (user_id, name)
SELECT u.id, 'ATA Level 3' FROM users u WHERE u.email = 'marcus.reid@smartworkshop.local'
  AND NOT EXISTS (SELECT 1 FROM mechanic_accreditations a WHERE a.user_id = u.id AND a.name = 'ATA Level 3');
INSERT INTO mechanic_accreditations (user_id, name)
SELECT u.id, 'ATA Level 4' FROM users u WHERE u.email = 'elena.brooks@smartworkshop.local'
  AND NOT EXISTS (SELECT 1 FROM mechanic_accreditations a WHERE a.user_id = u.id AND a.name = 'ATA Level 4');
INSERT INTO mechanic_accreditations (user_id, name)
SELECT u.id, 'Other Accreditation' FROM users u WHERE u.email = 'hassan.ali@smartworkshop.local'
  AND NOT EXISTS (SELECT 1 FROM mechanic_accreditations a WHERE a.user_id = u.id AND a.name = 'Other Accreditation');
INSERT INTO mechanic_accreditations (user_id, name)
SELECT u.id, 'IRTEC Accredited / Qualified Technician' FROM users u WHERE u.email = 'chloe.bennett@smartworkshop.local'
  AND NOT EXISTS (SELECT 1 FROM mechanic_accreditations a WHERE a.user_id = u.id AND a.name = 'IRTEC Accredited / Qualified Technician');
INSERT INTO mechanic_accreditations (user_id, name)
SELECT u.id, 'ATA Level 2' FROM users u WHERE u.email = 'daniel.foster@smartworkshop.local'
  AND NOT EXISTS (SELECT 1 FROM mechanic_accreditations a WHERE a.user_id = u.id AND a.name = 'ATA Level 2');
INSERT INTO mechanic_accreditations (user_id, name)
SELECT u.id, 'ATA Level 3' FROM users u WHERE u.email = 'sofia.rossi@smartworkshop.local'
  AND NOT EXISTS (SELECT 1 FROM mechanic_accreditations a WHERE a.user_id = u.id AND a.name = 'ATA Level 3');
INSERT INTO mechanic_accreditations (user_id, name)
SELECT u.id, 'ATA Level 4' FROM users u WHERE u.email = 'liam.walker@smartworkshop.local'
  AND NOT EXISTS (SELECT 1 FROM mechanic_accreditations a WHERE a.user_id = u.id AND a.name = 'ATA Level 4');
INSERT INTO mechanic_accreditations (user_id, name)
SELECT u.id, 'IRTEC Accredited / Qualified Technician' FROM users u WHERE u.email = 'ava.patel@smartworkshop.local'
  AND NOT EXISTS (SELECT 1 FROM mechanic_accreditations a WHERE a.user_id = u.id AND a.name = 'IRTEC Accredited / Qualified Technician');

INSERT INTO mechanic_memberships (user_id, name)
SELECT u.id, 'RMIF' FROM users u WHERE u.email = 'oliver.king@smartworkshop.local'
  AND NOT EXISTS (SELECT 1 FROM mechanic_memberships m WHERE m.user_id = u.id AND m.name = 'RMIF');
INSERT INTO mechanic_memberships (user_id, name)
SELECT u.id, 'IMI' FROM users u WHERE u.email = 'priya.shah@smartworkshop.local'
  AND NOT EXISTS (SELECT 1 FROM mechanic_memberships m WHERE m.user_id = u.id AND m.name = 'IMI');
INSERT INTO mechanic_memberships (user_id, name)
SELECT u.id, 'Other Membership' FROM users u WHERE u.email = 'marcus.reid@smartworkshop.local'
  AND NOT EXISTS (SELECT 1 FROM mechanic_memberships m WHERE m.user_id = u.id AND m.name = 'Other Membership');
INSERT INTO mechanic_memberships (user_id, name)
SELECT u.id, 'RAC Approved Garage' FROM users u WHERE u.email = 'elena.brooks@smartworkshop.local'
  AND NOT EXISTS (SELECT 1 FROM mechanic_memberships m WHERE m.user_id = u.id AND m.name = 'RAC Approved Garage');
INSERT INTO mechanic_memberships (user_id, name)
SELECT u.id, 'Autofirst Network' FROM users u WHERE u.email = 'hassan.ali@smartworkshop.local'
  AND NOT EXISTS (SELECT 1 FROM mechanic_memberships m WHERE m.user_id = u.id AND m.name = 'Autofirst Network');
INSERT INTO mechanic_memberships (user_id, name)
SELECT u.id, 'RMIF' FROM users u WHERE u.email = 'chloe.bennett@smartworkshop.local'
  AND NOT EXISTS (SELECT 1 FROM mechanic_memberships m WHERE m.user_id = u.id AND m.name = 'RMIF');
INSERT INTO mechanic_memberships (user_id, name)
SELECT u.id, 'IMI' FROM users u WHERE u.email = 'daniel.foster@smartworkshop.local'
  AND NOT EXISTS (SELECT 1 FROM mechanic_memberships m WHERE m.user_id = u.id AND m.name = 'IMI');
INSERT INTO mechanic_memberships (user_id, name)
SELECT u.id, 'Other Membership' FROM users u WHERE u.email = 'sofia.rossi@smartworkshop.local'
  AND NOT EXISTS (SELECT 1 FROM mechanic_memberships m WHERE m.user_id = u.id AND m.name = 'Other Membership');
INSERT INTO mechanic_memberships (user_id, name)
SELECT u.id, 'RAC Approved Garage' FROM users u WHERE u.email = 'liam.walker@smartworkshop.local'
  AND NOT EXISTS (SELECT 1 FROM mechanic_memberships m WHERE m.user_id = u.id AND m.name = 'RAC Approved Garage');
INSERT INTO mechanic_memberships (user_id, name)
SELECT u.id, 'Autofirst Network' FROM users u WHERE u.email = 'ava.patel@smartworkshop.local'
  AND NOT EXISTS (SELECT 1 FROM mechanic_memberships m WHERE m.user_id = u.id AND m.name = 'Autofirst Network');

INSERT IGNORE INTO mechanic_services_offered (user_id, service_type)
SELECT id, 'ev_specialist' FROM users WHERE email = 'oliver.king@smartworkshop.local';
INSERT IGNORE INTO mechanic_services_offered (user_id, service_type)
SELECT id, 'mot_testing' FROM users WHERE email = 'priya.shah@smartworkshop.local';
INSERT IGNORE INTO mechanic_services_offered (user_id, service_type)
SELECT id, 'brakes_and_suspension' FROM users WHERE email = 'marcus.reid@smartworkshop.local';
INSERT IGNORE INTO mechanic_services_offered (user_id, service_type)
SELECT id, 'transmission_repair' FROM users WHERE email = 'elena.brooks@smartworkshop.local';
INSERT IGNORE INTO mechanic_services_offered (user_id, service_type)
SELECT id, 'tyre_fitting' FROM users WHERE email = 'hassan.ali@smartworkshop.local';
INSERT IGNORE INTO mechanic_services_offered (user_id, service_type)
SELECT id, 'air_conditioning' FROM users WHERE email = 'chloe.bennett@smartworkshop.local';
INSERT IGNORE INTO mechanic_services_offered (user_id, service_type)
SELECT id, 'engine_repair' FROM users WHERE email = 'daniel.foster@smartworkshop.local';
INSERT IGNORE INTO mechanic_services_offered (user_id, service_type)
SELECT id, 'body_repair' FROM users WHERE email = 'sofia.rossi@smartworkshop.local';
INSERT IGNORE INTO mechanic_services_offered (user_id, service_type)
SELECT id, 'mobile_service' FROM users WHERE email = 'liam.walker@smartworkshop.local';
INSERT IGNORE INTO mechanic_services_offered (user_id, service_type)
SELECT id, 'hybrid_ev' FROM users WHERE email = 'ava.patel@smartworkshop.local';

INSERT IGNORE INTO mechanic_services (mechanic_id, service_id)
SELECT u.id, sc.id FROM users u JOIN service_catalog sc ON sc.code = 'ev_charger_installation'
WHERE u.email = 'oliver.king@smartworkshop.local';
INSERT IGNORE INTO mechanic_services (mechanic_id, service_id)
SELECT u.id, sc.id FROM users u JOIN service_catalog sc ON sc.code = 'diagnostic_inspection'
WHERE u.email = 'priya.shah@smartworkshop.local';
INSERT IGNORE INTO mechanic_services (mechanic_id, service_id)
SELECT u.id, sc.id FROM users u JOIN service_catalog sc ON sc.code = 'repair_brake_discs_pads_front'
WHERE u.email = 'marcus.reid@smartworkshop.local';
INSERT IGNORE INTO mechanic_services (mechanic_id, service_id)
SELECT u.id, sc.id FROM users u JOIN service_catalog sc ON sc.code = 'repair_clutch_replacement'
WHERE u.email = 'elena.brooks@smartworkshop.local';
INSERT IGNORE INTO mechanic_services (mechanic_id, service_id)
SELECT u.id, sc.id FROM users u JOIN service_catalog sc ON sc.code = 'tyre_fitting'
WHERE u.email = 'hassan.ali@smartworkshop.local';
INSERT IGNORE INTO mechanic_services (mechanic_id, service_id)
SELECT u.id, sc.id FROM users u JOIN service_catalog sc ON sc.code = 'repair_air_conditioning_regas'
WHERE u.email = 'chloe.bennett@smartworkshop.local';
INSERT IGNORE INTO mechanic_services (mechanic_id, service_id)
SELECT u.id, sc.id FROM users u JOIN service_catalog sc ON sc.code = 'repair_timing_chain'
WHERE u.email = 'daniel.foster@smartworkshop.local';
INSERT IGNORE INTO mechanic_services (mechanic_id, service_id)
SELECT u.id, sc.id FROM users u JOIN service_catalog sc ON sc.code = 'repair_body_front_bonnet'
WHERE u.email = 'sofia.rossi@smartworkshop.local';
INSERT IGNORE INTO mechanic_services (mechanic_id, service_id)
SELECT u.id, sc.id FROM users u JOIN service_catalog sc ON sc.code = 'service_full'
WHERE u.email = 'liam.walker@smartworkshop.local';
INSERT IGNORE INTO mechanic_services (mechanic_id, service_id)
SELECT u.id, sc.id FROM users u JOIN service_catalog sc ON sc.code = 'inspection_standard'
WHERE u.email = 'ava.patel@smartworkshop.local';

INSERT IGNORE INTO wallets (mechanic_id, available_eur, pending_eur)
SELECT id, 0.00, 0.00 FROM users WHERE email = 'oliver.king@smartworkshop.local';
INSERT IGNORE INTO wallets (mechanic_id, available_eur, pending_eur)
SELECT id, 0.00, 0.00 FROM users WHERE email = 'priya.shah@smartworkshop.local';
INSERT IGNORE INTO wallets (mechanic_id, available_eur, pending_eur)
SELECT id, 0.00, 0.00 FROM users WHERE email = 'marcus.reid@smartworkshop.local';
INSERT IGNORE INTO wallets (mechanic_id, available_eur, pending_eur)
SELECT id, 0.00, 0.00 FROM users WHERE email = 'elena.brooks@smartworkshop.local';
INSERT IGNORE INTO wallets (mechanic_id, available_eur, pending_eur)
SELECT id, 0.00, 0.00 FROM users WHERE email = 'hassan.ali@smartworkshop.local';
INSERT IGNORE INTO wallets (mechanic_id, available_eur, pending_eur)
SELECT id, 0.00, 0.00 FROM users WHERE email = 'chloe.bennett@smartworkshop.local';
INSERT IGNORE INTO wallets (mechanic_id, available_eur, pending_eur)
SELECT id, 0.00, 0.00 FROM users WHERE email = 'daniel.foster@smartworkshop.local';
INSERT IGNORE INTO wallets (mechanic_id, available_eur, pending_eur)
SELECT id, 0.00, 0.00 FROM users WHERE email = 'sofia.rossi@smartworkshop.local';
INSERT IGNORE INTO wallets (mechanic_id, available_eur, pending_eur)
SELECT id, 0.00, 0.00 FROM users WHERE email = 'liam.walker@smartworkshop.local';
INSERT IGNORE INTO wallets (mechanic_id, available_eur, pending_eur)
SELECT id, 0.00, 0.00 FROM users WHERE email = 'ava.patel@smartworkshop.local';
