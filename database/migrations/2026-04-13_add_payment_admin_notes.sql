CREATE TABLE IF NOT EXISTS payment_admin_notes (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  payment_kind VARCHAR(32) NOT NULL,
  record_id BIGINT UNSIGNED NOT NULL,
  admin_id BIGINT UNSIGNED NOT NULL,
  note TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_payment_admin_notes_lookup (payment_kind, record_id, created_at),
  KEY idx_payment_admin_notes_admin (admin_id, created_at),
  CONSTRAINT fk_payment_admin_notes_admin FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;
