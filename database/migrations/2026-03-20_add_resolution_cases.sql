CREATE TABLE IF NOT EXISTS resolution_cases (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  booking_id BIGINT UNSIGNED NOT NULL,
  mechanic_id BIGINT UNSIGNED NOT NULL,
  customer_id BIGINT UNSIGNED NOT NULL,
  case_type ENUM('general','complaint') NOT NULL DEFAULT 'general',
  subject VARCHAR(120) NOT NULL,
  sequence_no INT NOT NULL,
  reference VARCHAR(64) NOT NULL,
  status ENUM('open','closed') NOT NULL DEFAULT 'open',
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
