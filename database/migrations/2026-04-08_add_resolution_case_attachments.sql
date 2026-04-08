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
