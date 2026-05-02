ALTER TABLE resolution_cases
  MODIFY COLUMN status ENUM('open','in_progress','closed') NOT NULL DEFAULT 'open';
