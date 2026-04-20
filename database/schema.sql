-- smartworkshop_schema_int.sql
-- MySQL 8.0, InnoDB, INT/BIGINT AUTO_INCREMENT PKs, no triggers/seeds
-- Database selection is provided by Docker MYSQL_DATABASE (local/staging).

-- ================================
-- Core tables (IDs as BIGINT AUTO_INCREMENT)
-- ================================
CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  uuid_public BINARY(16) UNIQUE, -- opcional si quieres exponer UUID públicamente
  email VARCHAR(320) NOT NULL UNIQUE,
  username VARCHAR(320) NOT NULL UNIQUE,
  phone VARCHAR(32),
  password_hash TEXT NOT NULL,
  role ENUM('user','mechanic','admin') NOT NULL,
  status ENUM('pending','active','suspended','banned') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_login_at TIMESTAMP NULL,
  KEY idx_users_phone (phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS user_profiles (
  user_id BIGINT UNSIGNED PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  lastname VARCHAR(120) NOT NULL,
  avatar_url TEXT,
  CONSTRAINT fk_up_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS user_roles (
  user_id BIGINT UNSIGNED NOT NULL,
  role ENUM('user','mechanic','admin') NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, role),
  CONSTRAINT fk_ur_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Backfill roles for existing users (run once if needed)
-- INSERT IGNORE INTO user_roles (user_id, role)
-- SELECT id, role FROM users;

-- ================================
-- Booking drafts (pre-checkout)
-- ================================
CREATE TABLE IF NOT EXISTS booking_drafts (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  session_id VARCHAR(64) NOT NULL UNIQUE,
  user_id BIGINT UNSIGNED NULL,
  vehicle_json JSON NULL,
  notes TEXT,
  vehicle_drivable ENUM('yes','no') NULL,
  availability_json JSON NULL,
  payment_status ENUM('pending','authorized','paid','failed') NOT NULL DEFAULT 'pending',
  payment_provider VARCHAR(64) NULL,
  payment_amount_eur DECIMAL(10,2) NULL,
  payment_currency CHAR(3) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_draft_user (user_id),
  CONSTRAINT fk_draft_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS booking_draft_items (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  draft_id BIGINT UNSIGNED NOT NULL,
  service_id BIGINT UNSIGNED NOT NULL,
  qty INT NOT NULL DEFAULT 1,
  line_total_eur DECIMAL(10,2) NOT NULL,
  UNIQUE KEY uq_draft_service (draft_id, service_id),
  KEY idx_bdi_draft (draft_id),
  CONSTRAINT fk_bdi_draft FOREIGN KEY (draft_id) REFERENCES booking_drafts(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS password_reset_requests (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  token CHAR(64) NOT NULL UNIQUE,
  expires_at DATETIME NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_pr_user (user_id),
  CONSTRAINT fk_prr_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS email_change_requests (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  new_email VARCHAR(320) NOT NULL,
  token CHAR(64) NOT NULL UNIQUE,
  expires_at DATETIME NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_ecr_user (user_id),
  CONSTRAINT fk_ecr_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS user_security_settings (
  user_id BIGINT UNSIGNED PRIMARY KEY,
  two_factor_email_enabled TINYINT(1) NOT NULL DEFAULT 0,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_uss_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS login_two_factor_challenges (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  challenge_token CHAR(64) NOT NULL UNIQUE,
  code_hash TEXT NOT NULL,
  expires_at DATETIME NOT NULL,
  consumed_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_l2fc_user (user_id, created_at),
  KEY idx_l2fc_expires (expires_at),
  CONSTRAINT fk_l2fc_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS mechanic_profiles (
  user_id BIGINT UNSIGNED PRIMARY KEY,
  display_name VARCHAR(120) NOT NULL,
  legal_name VARCHAR(160) NOT NULL,
  years_experience INT,
  work_history TEXT,
  website_url VARCHAR(255),
  has_trade_insurance TINYINT(1),
  has_public_liability TINYINT(1),
  vat_registered TINYINT(1),
  business_type VARCHAR(64),
  application_type VARCHAR(64),
  lead_postcode VARCHAR(16),
  application_status VARCHAR(64),
  account_status VARCHAR(64),
  password_set_at DATETIME,
  travel_radius_miles INT,
  availability_pref VARCHAR(32),
  referral_source VARCHAR(64),
  vat_id VARCHAR(32),
  is_mobile TINYINT(1) NOT NULL DEFAULT 1,
  rating_avg DECIMAL(3,2) NOT NULL DEFAULT 0.00,
  jobs_done INT NOT NULL DEFAULT 0,
  about TEXT,
  CONSTRAINT fk_mp_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS mechanic_qualifications (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(160) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_mq_user (user_id),
  CONSTRAINT fk_mq_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS mechanic_memberships (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(160) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_mm_user (user_id),
  CONSTRAINT fk_mm_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS mechanic_accreditations (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(160) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_ma_user (user_id),
  CONSTRAINT fk_ma_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS mechanic_services_offered (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  service_type VARCHAR(64) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_mso_user_type (user_id, service_type),
  KEY idx_mso_user (user_id),
  CONSTRAINT fk_mso_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS addresses (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  uuid_public BINARY(16) UNIQUE,
  user_id BIGINT UNSIGNED NOT NULL,
  label VARCHAR(64),
  line1 VARCHAR(160) NOT NULL,
  line2 VARCHAR(160),
  city VARCHAR(100) NOT NULL,
  postal_code VARCHAR(16) NOT NULL,
  country CHAR(2) NOT NULL,
  location POINT NOT NULL SRID 4326,
  SPATIAL INDEX spx_addresses_location (location),
  KEY idx_addr_user (user_id),
  CONSTRAINT fk_addr_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS vehicles (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  uuid_public BINARY(16) UNIQUE,
  user_id BIGINT UNSIGNED NOT NULL,
  license_plate VARCHAR(20) NOT NULL,
  make VARCHAR(64) NOT NULL,
  model VARCHAR(64) NOT NULL,
  year SMALLINT,
  fuel_type VARCHAR(32),
  mileage VARCHAR(32),
  mot_status VARCHAR(64),
  tax_status VARCHAR(64),
  vin VARCHAR(32),
  UNIQUE KEY uq_veh_plate_user (user_id, license_plate),
  KEY idx_veh_user (user_id),
  CONSTRAINT fk_vehicle_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ================================
-- Catalog & pricing
-- ================================
CREATE TABLE IF NOT EXISTS service_catalog (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(64) NOT NULL UNIQUE,
  name VARCHAR(120) NOT NULL,
  category VARCHAR(64) NOT NULL,
  group_name VARCHAR(64) NULL,
  subcategory VARCHAR(64) NULL,
  display_order INT NOT NULL DEFAULT 1000,
  description TEXT,
  base_labour_minutes INT NOT NULL
) ENGINE=InnoDB;

ALTER TABLE booking_draft_items
  ADD CONSTRAINT fk_bdi_service FOREIGN KEY (service_id) REFERENCES service_catalog(id);

CREATE TABLE IF NOT EXISTS service_pricing (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  service_id BIGINT UNSIGNED NOT NULL,
  region VARCHAR(32) NOT NULL DEFAULT 'ES-default',
  labour_rate_eur DECIMAL(10,2) NOT NULL,
  parts_markup_pct DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  travel_fee_eur DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  vat_pct DECIMAL(5,2) NOT NULL DEFAULT 21.00,
  UNIQUE KEY uq_service_region (service_id, region),
  CONSTRAINT fk_sp_service FOREIGN KEY (service_id) REFERENCES service_catalog(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS mechanic_services (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  mechanic_id BIGINT UNSIGNED NOT NULL,
  service_id BIGINT UNSIGNED NOT NULL,
  custom_labour_rate_eur DECIMAL(10,2) NULL,
  enabled TINYINT(1) NOT NULL DEFAULT 1,
  UNIQUE KEY uq_mech_service (mechanic_id, service_id),
  KEY idx_ms_service (service_id),
  CONSTRAINT fk_ms_mech FOREIGN KEY (mechanic_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_ms_service FOREIGN KEY (service_id) REFERENCES service_catalog(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ================================
-- Availability & bookings
-- ================================
CREATE TABLE IF NOT EXISTS availability_slots (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  mechanic_id BIGINT UNSIGNED NOT NULL,
  start_at DATETIME NOT NULL,
  end_at DATETIME NOT NULL,
  status ENUM('free','held','booked') NOT NULL DEFAULT 'free',
  KEY idx_slot_mech_time (mechanic_id, start_at),
  CONSTRAINT chk_slot_time CHECK (start_at < end_at),
  CONSTRAINT fk_slot_mech FOREIGN KEY (mechanic_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS bookings (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  uuid_public BINARY(16) UNIQUE,
  customer_id BIGINT UNSIGNED NOT NULL,
  mechanic_id BIGINT UNSIGNED NULL,
  address_id BIGINT UNSIGNED NOT NULL,
  vehicle_id BIGINT UNSIGNED NOT NULL,
  slot_id BIGINT UNSIGNED NULL,
  status ENUM('requested','accepted','in_progress','completed','disputed','refunded','cancelled') NOT NULL,
  mechanic_cancelled_reason TEXT NULL,
  mechanic_cancelled_at DATETIME NULL,
  subtotal_eur DECIMAL(10,2) NOT NULL,
  vat_eur DECIMAL(10,2) NOT NULL,
  total_eur DECIMAL(10,2) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  notes TEXT,
  KEY idx_booking_customer (customer_id),
  KEY idx_booking_mechanic (mechanic_id),
  KEY idx_booking_status (status),
  KEY idx_booking_created (created_at),
  CONSTRAINT fk_bk_customer FOREIGN KEY (customer_id) REFERENCES users(id),
  CONSTRAINT fk_bk_mechanic FOREIGN KEY (mechanic_id) REFERENCES users(id),
  CONSTRAINT fk_bk_address FOREIGN KEY (address_id) REFERENCES addresses(id),
  CONSTRAINT fk_bk_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles(id),
  CONSTRAINT fk_bk_slot FOREIGN KEY (slot_id) REFERENCES availability_slots(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS booking_offers (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  booking_id BIGINT UNSIGNED NOT NULL,
  mechanic_id BIGINT UNSIGNED NOT NULL,
  status ENUM('pending','accepted','declined','expired') NOT NULL DEFAULT 'pending',
  sent_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  responded_at DATETIME NULL,
  KEY idx_offer_mechanic_status (mechanic_id, status),
  UNIQUE KEY uq_booking_mechanic (booking_id, mechanic_id),
  CONSTRAINT fk_offer_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
  CONSTRAINT fk_offer_mechanic FOREIGN KEY (mechanic_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS booking_items (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  booking_id BIGINT UNSIGNED NOT NULL,
  service_id BIGINT UNSIGNED NOT NULL,
  labour_minutes INT NOT NULL,
  parts_json JSON NULL,
  line_total_eur DECIMAL(10,2) NOT NULL,
  KEY idx_bi_booking (booking_id),
  KEY idx_bi_service (service_id),
  CONSTRAINT fk_bi_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
  CONSTRAINT fk_bi_service FOREIGN KEY (service_id) REFERENCES service_catalog(id)
) ENGINE=InnoDB;

-- ================================
-- Payments, invoices, reviews, messaging
-- ================================
CREATE TABLE IF NOT EXISTS payments (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  booking_id BIGINT UNSIGNED NOT NULL,
  provider VARCHAR(64) NOT NULL,
  status ENUM('authorized','auth_captured','refunded','failed') NOT NULL,
  amount_eur DECIMAL(10,2) NOT NULL,
  currency CHAR(3) NOT NULL DEFAULT 'EUR',
  payment_method VARCHAR(32) NULL,
  card_last4 CHAR(4) NULL,
  provider_ref VARCHAR(128) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_provider_ref (provider, provider_ref),
  CONSTRAINT fk_pay_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS invoices (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  booking_id BIGINT UNSIGNED NOT NULL,
  issuer_mechanic_id BIGINT UNSIGNED NOT NULL,
  buyer_user_id BIGINT UNSIGNED NOT NULL,
  number VARCHAR(64) NOT NULL,
  issued_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  totals_json JSON NOT NULL,
  pdf_url TEXT,
  UNIQUE KEY uq_invoice_booking (booking_id),
  UNIQUE KEY uq_invoice_number (number),
  CONSTRAINT fk_inv_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
  CONSTRAINT fk_inv_issuer FOREIGN KEY (issuer_mechanic_id) REFERENCES users(id),
  CONSTRAINT fk_inv_buyer FOREIGN KEY (buyer_user_id) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS booking_completion_photos (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  booking_id BIGINT UNSIGNED NOT NULL,
  uploaded_by_user_id BIGINT UNSIGNED NOT NULL,
  file_url TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_bcp_booking (booking_id, created_at),
  KEY idx_bcp_user (uploaded_by_user_id),
  CONSTRAINT fk_bcp_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
  CONSTRAINT fk_bcp_user FOREIGN KEY (uploaded_by_user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS booking_completion_parts (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  booking_id BIGINT UNSIGNED NOT NULL,
  description VARCHAR(255) NOT NULL,
  amount_eur DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_bcp2_booking (booking_id, created_at),
  CONSTRAINT fk_bcp2_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS reviews (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  booking_id BIGINT UNSIGNED NOT NULL,
  customer_id BIGINT UNSIGNED NOT NULL,
  mechanic_id BIGINT UNSIGNED NOT NULL,
  rating TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_review_booking (booking_id),
  KEY idx_review_mechanic (mechanic_id),
  CONSTRAINT fk_rev_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
  CONSTRAINT fk_rev_customer FOREIGN KEY (customer_id) REFERENCES users(id),
  CONSTRAINT fk_rev_mechanic FOREIGN KEY (mechanic_id) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS messages (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  booking_id BIGINT UNSIGNED NOT NULL,
  sender_id BIGINT UNSIGNED NOT NULL,
  body TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_msg_booking (booking_id, created_at),
  CONSTRAINT fk_msg_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
  CONSTRAINT fk_msg_sender FOREIGN KEY (sender_id) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS attachments (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  message_id BIGINT UNSIGNED NOT NULL,
  file_url TEXT NOT NULL,
  type VARCHAR(32) NOT NULL,
  KEY idx_att_msg (message_id),
  CONSTRAINT fk_att_msg FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS resolution_cases (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  booking_id BIGINT UNSIGNED NOT NULL,
  mechanic_id BIGINT UNSIGNED NOT NULL,
  customer_id BIGINT UNSIGNED NOT NULL,
  case_type ENUM('general','complaint') NOT NULL DEFAULT 'general',
  subject VARCHAR(120) NOT NULL,
  sequence_no INT NOT NULL,
  reference VARCHAR(64) NOT NULL,
  status ENUM('open','in_progress','closed') NOT NULL DEFAULT 'open',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_resolution_reference (reference),
  UNIQUE KEY uq_resolution_booking_sequence (booking_id, sequence_no),
  KEY idx_resolution_mechanic_status (mechanic_id, status, updated_at),
  KEY idx_resolution_booking (booking_id),
  CONSTRAINT fk_resolution_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
  CONSTRAINT fk_resolution_mechanic FOREIGN KEY (mechanic_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_resolution_customer FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS resolution_case_messages (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  case_id BIGINT UNSIGNED NOT NULL,
  sender_id BIGINT UNSIGNED NOT NULL,
  body TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_resolution_message_case (case_id, created_at),
  CONSTRAINT fk_resolution_message_case FOREIGN KEY (case_id) REFERENCES resolution_cases(id) ON DELETE CASCADE,
  CONSTRAINT fk_resolution_message_sender FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS resolution_case_message_attachments (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  message_id BIGINT UNSIGNED NOT NULL,
  file_url TEXT NOT NULL,
  original_name VARCHAR(255) NULL,
  mime_type VARCHAR(100) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_rcma_message (message_id, created_at),
  CONSTRAINT fk_rcma_message FOREIGN KEY (message_id) REFERENCES resolution_case_messages(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS contact_messages (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NULL,
  message TEXT NOT NULL,
  status ENUM('new', 'in_progress', 'closed', 'spam') NOT NULL DEFAULT 'new',
  source VARCHAR(50) NOT NULL DEFAULT 'home_web',
  ip_address VARCHAR(45) NULL,
  user_agent VARCHAR(255) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_contact_status_created (status, created_at),
  KEY idx_contact_email_created (email, created_at)
) ENGINE=InnoDB;

-- ================================
-- Wallet & payouts
-- ================================
CREATE TABLE IF NOT EXISTS wallets (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  mechanic_id BIGINT UNSIGNED NOT NULL UNIQUE,
  available_eur DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  pending_eur DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  CONSTRAINT fk_wallet_mech FOREIGN KEY (mechanic_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS payouts (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  wallet_id BIGINT UNSIGNED NOT NULL,
  amount_eur DECIMAL(10,2) NOT NULL,
  status ENUM('requested','processing','paid','failed') NOT NULL DEFAULT 'requested',
  provider_ref VARCHAR(128),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_payout_wallet (wallet_id, created_at),
  CONSTRAINT fk_payout_wallet FOREIGN KEY (wallet_id) REFERENCES wallets(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ================================
-- Promotions
-- ================================
CREATE TABLE IF NOT EXISTS promo_codes (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(32) NOT NULL UNIQUE,
  type ENUM('percent','fixed') NOT NULL,
  value DECIMAL(10,2) NOT NULL,
  max_redemptions INT,
  valid_from DATETIME NOT NULL,
  valid_to DATETIME NOT NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS promo_redemptions (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  code_id BIGINT UNSIGNED NOT NULL,
  user_id BIGINT UNSIGNED NOT NULL,
  booking_id BIGINT UNSIGNED NOT NULL,
  amount_eur DECIMAL(10,2) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_pr_user (user_id),
  KEY idx_pr_booking (booking_id),
  CONSTRAINT fk_pr_code FOREIGN KEY (code_id) REFERENCES promo_codes(id) ON DELETE RESTRICT,
  CONSTRAINT fk_pr_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_pr_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ================================
-- Optional audit log
-- ================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  entity VARCHAR(64) NOT NULL,
  entity_id VARBINARY(64) NOT NULL,
  action VARCHAR(32) NOT NULL,
  by_user BIGINT UNSIGNED,
  at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  diff_json JSON,
  KEY idx_audit_entity (entity, at),
  KEY idx_audit_user (by_user)
) ENGINE=InnoDB;

-- ================================
-- UUID helpers (BINARY(16))
-- ================================
-- Backfill UUIDs for existing rows (run once if you already have data)
-- UPDATE users SET uuid_public = UUID_TO_BIN(UUID()) WHERE uuid_public IS NULL;
-- UPDATE addresses SET uuid_public = UUID_TO_BIN(UUID()) WHERE uuid_public IS NULL;
-- UPDATE vehicles SET uuid_public = UUID_TO_BIN(UUID()) WHERE uuid_public IS NULL;
-- UPDATE bookings SET uuid_public = UUID_TO_BIN(UUID()) WHERE uuid_public IS NULL;

-- Read UUIDs as text in queries
-- SELECT BIN_TO_UUID(uuid_public) AS uuid_public FROM users;
-- SELECT BIN_TO_UUID(uuid_public) AS uuid_public FROM addresses;
-- SELECT BIN_TO_UUID(uuid_public) AS uuid_public FROM vehicles;
-- SELECT BIN_TO_UUID(uuid_public) AS uuid_public FROM bookings;
