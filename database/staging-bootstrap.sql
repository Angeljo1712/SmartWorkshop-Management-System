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
