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
  '$2a$10$pbXVjfe4Dgc0Cx5m6IA72uB12zroFMoa90C8kf5b1Zu7d3bpPf6vK',
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
  '$2a$10$CQaCFg3M8oXuZxU1y62OxeF/5XnbG51WoW9KRI16KwRZUJ6xrtMdu',
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
SELECT id, 'IMI Level 2'
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
  (UUID_TO_BIN(UUID()), 'oliver.king@smartworkshop.local', 'oliver_king', NULL, '$2a$10$D7mHLfsquGphpCxLKAOOFePxTjSu7NifOKqus042b4HKDE3awzvfa', 'mechanic', 'active'),
  (UUID_TO_BIN(UUID()), 'priya.shah@smartworkshop.local', 'priya_shah', NULL, '$2a$10$xmLkt3impl1flRZNmQWt1OHhdZTt7zPdcqwOL7rY6y4zSChLcdQhy', 'mechanic', 'active'),
  (UUID_TO_BIN(UUID()), 'marcus.reid@smartworkshop.local', 'marcus_reid', NULL, '$2a$10$9jB3mP/dQlFXtg0Rh1o6ye7B5r61yqqCVdqPMR/6SP7kYNmFeVThO', 'mechanic', 'active'),
  (UUID_TO_BIN(UUID()), 'elena.brooks@smartworkshop.local', 'elena_brooks', NULL, '$2a$10$2CTpf4DgBq2Co6q3qm22IONIdKRd0YHlhaMt.hirGBqX81wqsEVFi', 'mechanic', 'active'),
  (UUID_TO_BIN(UUID()), 'hassan.ali@smartworkshop.local', 'hassan_ali', NULL, '$2a$10$819nyms6gCeC2ckqJK4H/OsP63ms4RHHd5n/HtZtgNG.q766xFrZO', 'mechanic', 'active'),
  (UUID_TO_BIN(UUID()), 'chloe.bennett@smartworkshop.local', 'chloe_bennett', NULL, '$2a$10$pc1xvCC.Jl4YY.FySH9tHey1wbnXr1nEWGRpHFCSH3cCXZXn55wgK', 'mechanic', 'active'),
  (UUID_TO_BIN(UUID()), 'daniel.foster@smartworkshop.local', 'daniel_foster', NULL, '$2a$10$FpGCYUrby5lSQPS4P/mueO.9J1gh2QYdZ.cvv.A.O6VBJEidu0N6i', 'mechanic', 'active'),
  (UUID_TO_BIN(UUID()), 'sofia.rossi@smartworkshop.local', 'sofia_rossi', NULL, '$2a$10$RjcQBUJemEGFDat70fML9.bh5jPR3bMmWE8KPemcNqvMIhbMBVtSy', 'mechanic', 'active'),
  (UUID_TO_BIN(UUID()), 'liam.walker@smartworkshop.local', 'liam_walker', NULL, '$2a$10$HL.t61FgC9BFpoflOG05IelK4ZBchPuD2L2QhPgVm4yBOH6Lez4pK', 'mechanic', 'active'),
  (UUID_TO_BIN(UUID()), 'ava.patel@smartworkshop.local', 'ava_patel', NULL, '$2a$10$l5vqzFiOh3rJJ6IK0PHpXuy9pYe9urgStKD2UL2IsE4Hy7Hs2EsD2', 'mechanic', 'active');

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
SELECT u.id, 'EV High Voltage Level 3' FROM users u WHERE u.email = 'oliver.king@smartworkshop.local'
  AND NOT EXISTS (SELECT 1 FROM mechanic_qualifications q WHERE q.user_id = u.id AND q.name = 'EV High Voltage Level 3');
INSERT INTO mechanic_qualifications (user_id, name)
SELECT u.id, 'MOT Tester Certificate' FROM users u WHERE u.email = 'priya.shah@smartworkshop.local'
  AND NOT EXISTS (SELECT 1 FROM mechanic_qualifications q WHERE q.user_id = u.id AND q.name = 'MOT Tester Certificate');
INSERT INTO mechanic_qualifications (user_id, name)
SELECT u.id, 'Brake Systems Specialist' FROM users u WHERE u.email = 'marcus.reid@smartworkshop.local'
  AND NOT EXISTS (SELECT 1 FROM mechanic_qualifications q WHERE q.user_id = u.id AND q.name = 'Brake Systems Specialist');
INSERT INTO mechanic_qualifications (user_id, name)
SELECT u.id, 'Transmission Diagnostics' FROM users u WHERE u.email = 'elena.brooks@smartworkshop.local'
  AND NOT EXISTS (SELECT 1 FROM mechanic_qualifications q WHERE q.user_id = u.id AND q.name = 'Transmission Diagnostics');
INSERT INTO mechanic_qualifications (user_id, name)
SELECT u.id, 'Tyre Fitting Technician' FROM users u WHERE u.email = 'hassan.ali@smartworkshop.local'
  AND NOT EXISTS (SELECT 1 FROM mechanic_qualifications q WHERE q.user_id = u.id AND q.name = 'Tyre Fitting Technician');
INSERT INTO mechanic_qualifications (user_id, name)
SELECT u.id, 'Air Conditioning Service Cert' FROM users u WHERE u.email = 'chloe.bennett@smartworkshop.local'
  AND NOT EXISTS (SELECT 1 FROM mechanic_qualifications q WHERE q.user_id = u.id AND q.name = 'Air Conditioning Service Cert');
INSERT INTO mechanic_qualifications (user_id, name)
SELECT u.id, 'Advanced Engine Diagnostics' FROM users u WHERE u.email = 'daniel.foster@smartworkshop.local'
  AND NOT EXISTS (SELECT 1 FROM mechanic_qualifications q WHERE q.user_id = u.id AND q.name = 'Advanced Engine Diagnostics');
INSERT INTO mechanic_qualifications (user_id, name)
SELECT u.id, 'Body and Trim Repair' FROM users u WHERE u.email = 'sofia.rossi@smartworkshop.local'
  AND NOT EXISTS (SELECT 1 FROM mechanic_qualifications q WHERE q.user_id = u.id AND q.name = 'Body and Trim Repair');
INSERT INTO mechanic_qualifications (user_id, name)
SELECT u.id, 'Mobile Service Specialist' FROM users u WHERE u.email = 'liam.walker@smartworkshop.local'
  AND NOT EXISTS (SELECT 1 FROM mechanic_qualifications q WHERE q.user_id = u.id AND q.name = 'Mobile Service Specialist');
INSERT INTO mechanic_qualifications (user_id, name)
SELECT u.id, 'Hybrid Vehicle Certification' FROM users u WHERE u.email = 'ava.patel@smartworkshop.local'
  AND NOT EXISTS (SELECT 1 FROM mechanic_qualifications q WHERE q.user_id = u.id AND q.name = 'Hybrid Vehicle Certification');

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
