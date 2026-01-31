CREATE TABLE IF NOT EXISTS roles (
  role_id INT AUTO_INCREMENT PRIMARY KEY,
  role_name VARCHAR(20) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role_id INT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles(role_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS workshops (
  workshop_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  address VARCHAR(255) NOT NULL,
  postcode VARCHAR(20) NOT NULL,
  phone VARCHAR(40) NOT NULL,
  description TEXT,
  location POINT SRID 4326 NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE SPATIAL INDEX idx_workshops_location ON workshops (location);

CREATE TABLE IF NOT EXISTS workshop_members (
  workshop_member_id INT AUTO_INCREMENT PRIMARY KEY,
  workshop_id INT NOT NULL,
  user_id INT NOT NULL,
  member_role VARCHAR(40) NOT NULL,
  joined_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_workshop_member (workshop_id, user_id),
  CONSTRAINT fk_workshop_members_workshop FOREIGN KEY (workshop_id) REFERENCES workshops(workshop_id),
  CONSTRAINT fk_workshop_members_user FOREIGN KEY (user_id) REFERENCES users(user_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS service_requests (
  request_id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  vehicle_reg VARCHAR(50) NOT NULL,
  vehicle_make VARCHAR(80) NOT NULL,
  vehicle_model VARCHAR(80) NOT NULL,
  issue_description TEXT NOT NULL,
  preferred_date DATE,
  status ENUM('Submitted','Quoted','Accepted','Closed') NOT NULL DEFAULT 'Submitted',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_service_requests_customer FOREIGN KEY (customer_id) REFERENCES users(user_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS quotations (
  quotation_id INT AUTO_INCREMENT PRIMARY KEY,
  request_id INT NOT NULL,
  workshop_id INT NOT NULL,
  mechanic_id INT NOT NULL,
  labour_cost DECIMAL(10,2) NOT NULL,
  parts_cost DECIMAL(10,2) NOT NULL,
  total_cost DECIMAL(10,2) NOT NULL,
  estimated_days INT NOT NULL,
  notes TEXT,
  status ENUM('Submitted','Withdrawn','Accepted','Rejected') NOT NULL DEFAULT 'Submitted',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_quotations_request FOREIGN KEY (request_id) REFERENCES service_requests(request_id),
  CONSTRAINT fk_quotations_workshop FOREIGN KEY (workshop_id) REFERENCES workshops(workshop_id),
  CONSTRAINT fk_quotations_mechanic FOREIGN KEY (mechanic_id) REFERENCES users(user_id),
  CONSTRAINT chk_quotation_total CHECK (total_cost = labour_cost + parts_cost)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS jobs (
  job_id INT AUTO_INCREMENT PRIMARY KEY,
  request_id INT NOT NULL,
  quotation_id INT NOT NULL,
  workshop_id INT NOT NULL,
  assigned_mechanic_id INT NOT NULL,
  status ENUM('Accepted','InProgress','Completed') NOT NULL DEFAULT 'Accepted',
  started_at DATETIME NULL,
  completed_at DATETIME NULL,
  CONSTRAINT fk_jobs_request FOREIGN KEY (request_id) REFERENCES service_requests(request_id),
  CONSTRAINT fk_jobs_quotation FOREIGN KEY (quotation_id) REFERENCES quotations(quotation_id),
  CONSTRAINT fk_jobs_workshop FOREIGN KEY (workshop_id) REFERENCES workshops(workshop_id),
  CONSTRAINT fk_jobs_mechanic FOREIGN KEY (assigned_mechanic_id) REFERENCES users(user_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS job_status_history (
  status_id INT AUTO_INCREMENT PRIMARY KEY,
  job_id INT NOT NULL,
  status VARCHAR(40) NOT NULL,
  updated_by INT NOT NULL,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  comment TEXT,
  CONSTRAINT fk_job_status_history_job FOREIGN KEY (job_id) REFERENCES jobs(job_id),
  CONSTRAINT fk_job_status_history_user FOREIGN KEY (updated_by) REFERENCES users(user_id)
) ENGINE=InnoDB;

CREATE INDEX idx_service_requests_status ON service_requests(status);
CREATE INDEX idx_quotations_request ON quotations(request_id);
CREATE INDEX idx_jobs_workshop ON jobs(workshop_id);
