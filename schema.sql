SET NAMES utf8mb4;                                                                                                                                                                                     
  SET sql_mode = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';                                                                                                                
                                                                                                                                                                                                         
  CREATE DATABASE IF NOT EXISTS smartworkshop                                                                                                                                          
    CHARACTER SET utf8mb4                                                                                                                                                                                
    COLLATE utf8mb4_unicode_ci;                                                                                                                                                                          
  USE smartworkshop;                                                                                                                                                                   
                                                                                                                                                                                                         
  CREATE TABLE workshops (                                                                                                                                                                               
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,                                                                                                                                                          
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL,                                                                                                                                                                         
    phone VARCHAR(32) NULL,                                                                                                                                                                              
    address_line1 VARCHAR(255) NULL,                                                                                                                                                                     
    address_line2 VARCHAR(255) NULL,                                                                                                                                                                     
    city VARCHAR(120) NULL,                                                                                                                                                                              
    postcode VARCHAR(20) NULL,                                                                                                                                                                           
    country VARCHAR(80) NOT NULL DEFAULT 'UK',                                                                                                                                                           
    is_active TINYINT(1) NOT NULL DEFAULT 1,                                                                                                                                                             
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),                                                                                                                                        
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),                                                                                                         
    PRIMARY KEY (id),                                                                                                                                                                                    
    UNIQUE KEY uq_workshops_email (email)                                                                                                                                                                
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;                                                                                                                                    
                                                                                                                                                                                                         
  CREATE TABLE users (                                                                                                                                                                                   
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,                                                                                                                                                          
    email VARCHAR(255) NOT NULL,                                                                                                                                                                         
    password_hash VARCHAR(255) NOT NULL,                                                                                                                                                                 
    full_name VARCHAR(150) NOT NULL,                                                                                                                                                                     
    phone VARCHAR(32) NULL,                                                                                                                                                                              
    role ENUM('customer','mechanic','admin') NOT NULL,                                                                                                                                                   
    is_active TINYINT(1) NOT NULL DEFAULT 1,                                                                                                                                                             
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),                                                                                                                                        
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),                                                                                                         
    PRIMARY KEY (id),                                                                                                                                                                                    
    UNIQUE KEY uq_users_email (email)                                                                                                                                                                    
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;                                                                                                                                    
                                                                                                                                                                                                         
  CREATE TABLE workshop_users (                                                                                                                                                                          
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,                                                                                                                                                          
    workshop_id BIGINT UNSIGNED NOT NULL,                                                                                                                                                                
    user_id BIGINT UNSIGNED NOT NULL,                                                                                                                                                                    
    workshop_role ENUM('admin','mechanic') NOT NULL,                                                                                                                                                     
    is_active TINYINT(1) NOT NULL DEFAULT 1,                                                                                                                                                             
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),                                                                                                                                        
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),                                                                                                         
    PRIMARY KEY (id),                                                                                                                                                                                    
    UNIQUE KEY uq_workshop_users (workshop_id, user_id),                                                                                                                                                 
    KEY idx_workshop_users_user (user_id),                                                                                                                                                               
    CONSTRAINT fk_workshop_users_workshop                                                                                                                                                                
      FOREIGN KEY (workshop_id) REFERENCES workshops(id)                                                                                                                                                 
      ON UPDATE RESTRICT ON DELETE RESTRICT,                                                                                                                                                             
    CONSTRAINT fk_workshop_users_user                                                                                                                                                                    
      FOREIGN KEY (user_id) REFERENCES users(id)                                                                                                                                                         
      ON UPDATE RESTRICT ON DELETE RESTRICT                                                                                                                                                              
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;                                                                                                                                    
                                                                                                                                                                                                         
  CREATE TABLE vehicles (                                                                                                                                                                                
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,                                                                                                                                                          
    customer_user_id BIGINT UNSIGNED NOT NULL,                                                                                                                                                           
    make VARCHAR(80) NOT NULL,                                                                                                                                                                           
    model VARCHAR(80) NOT NULL,                                                                                                                                                                          
    year SMALLINT UNSIGNED NULL,                                                                                                                                                                         
    vin VARCHAR(32) NULL,                                                                                                                                                                                
    registration_number VARCHAR(32) NULL,                                                                                                                                                                
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),                                                                                                                                        
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),                                                                                                         
    PRIMARY KEY (id),
    KEY idx_vehicles_customer (customer_user_id),                                                                                                                                                        
    CONSTRAINT fk_vehicles_customer                                                                                                                                                                      
      FOREIGN KEY (customer_user_id) REFERENCES users(id)                                                                                                                                                
      ON UPDATE RESTRICT ON DELETE RESTRICT                                                                                                                                                              
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;                                                                                                                                    
                                                                                                                                                                                                         
  CREATE TABLE service_requests (                                                                                                                                                                        
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,                                                                                                                                                          
    workshop_id BIGINT UNSIGNED NOT NULL,                                                                                                                                                                
    customer_user_id BIGINT UNSIGNED NOT NULL,
    vehicle_id BIGINT UNSIGNED NOT NULL,                                                                                                                                                                 
    title VARCHAR(200) NOT NULL,                                                                                                                                                                         
    description TEXT NULL,                                                                                                                                                                               
    status ENUM('draft','submitted','in_review','quoted','accepted','rejected','cancelled','completed') NOT NULL DEFAULT 'draft',                                                                        
    preferred_date DATE NULL,                                                                                                                                                                            
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),                                                                                                                                        
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),                                                                                                         
    PRIMARY KEY (id),                                                                                                                                                                                    
    KEY idx_service_requests_workshop_status_created (workshop_id, status, created_at),                                                                                                                  
    KEY idx_service_requests_customer (customer_user_id),                                                                                                                                                
    KEY idx_service_requests_vehicle (vehicle_id),                                                                                                                                                       
    CONSTRAINT fk_service_requests_workshop                                                                                                                                                              
      FOREIGN KEY (workshop_id) REFERENCES workshops(id)                                                                                                                                                 
      ON UPDATE RESTRICT ON DELETE RESTRICT,                                                                                                                                                             
    CONSTRAINT fk_service_requests_customer                                                                                                                                                              
      FOREIGN KEY (customer_user_id) REFERENCES users(id)
      ON UPDATE RESTRICT ON DELETE RESTRICT,                                                                                                                                                             
    CONSTRAINT fk_service_requests_vehicle                                                                                                                                                               
      FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)                                                                                                                                                   
      ON UPDATE RESTRICT ON DELETE RESTRICT                                                                                                                                                              
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;                                                                                                                                    
                                                                                                                                                                                                         
  CREATE TABLE quotations (                                                                                                                                                                              
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,                                                                                                                                                          
    service_request_id BIGINT UNSIGNED NOT NULL,                                                                                                                                                         
    workshop_id BIGINT UNSIGNED NOT NULL,                                                                                                                                                                
    mechanic_user_id BIGINT UNSIGNED NOT NULL,                                                                                                                                                           
    price DECIMAL(10,2) NOT NULL,                                                                                                                                                                        
    currency CHAR(3) NOT NULL DEFAULT 'GBP',                                                                                                                                                             
    status ENUM('draft','sent','accepted','rejected','expired') NOT NULL DEFAULT 'draft',                                                                                                                
    valid_until DATE NULL,                                                                                                                                                                               
    notes TEXT NULL,                                                                                                                                                                                     
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),                                                                                                                                        
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),                                                                                                         
    PRIMARY KEY (id),                                                                                                                                                                                    
    KEY idx_quotations_service_request_status (service_request_id, status),                                                                                                                              
    KEY idx_quotations_workshop (workshop_id),                                                                                                                                                           
    KEY idx_quotations_mechanic (mechanic_user_id),                                                                                                                                                      
    CONSTRAINT fk_quotations_service_request                                                                                                                                                             
      FOREIGN KEY (service_request_id) REFERENCES service_requests(id)                                                                                                                                   
      ON UPDATE RESTRICT ON DELETE RESTRICT,                                                                                                                                                             
    CONSTRAINT fk_quotations_workshop                                                                                                                                                                    
      FOREIGN KEY (workshop_id) REFERENCES workshops(id)                                                                                                                                                 
      ON UPDATE RESTRICT ON DELETE RESTRICT,                                                                                                                                                             
    CONSTRAINT fk_quotations_mechanic                                                                                                                                                                    
      FOREIGN KEY (mechanic_user_id) REFERENCES users(id)                                                                                                                                                
      ON UPDATE RESTRICT ON DELETE RESTRICT                                                                                                                                                              
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;                                                                                                                                    
                                                                                                                                                                                                         
  CREATE TABLE jobs (                                                                                                                                                                                    
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,                                                                                                                                                          
    quotation_id BIGINT UNSIGNED NOT NULL,                                                                                                                                                               
    workshop_id BIGINT UNSIGNED NOT NULL,                                                                                                                                                                
    customer_user_id BIGINT UNSIGNED NOT NULL,
    vehicle_id BIGINT UNSIGNED NOT NULL,                                                                                                                                                                 
    status ENUM('scheduled','in_progress','paused','completed','cancelled') NOT NULL DEFAULT 'scheduled',                                                                                                
    scheduled_start DATETIME(3) NULL,                                                                                                                                                                    
    scheduled_end DATETIME(3) NULL,                                                                                                                                                                      
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),                                                                                                                                        
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),                                                                                                         
    PRIMARY KEY (id),                                                                                                                                                                                    
    KEY idx_jobs_workshop_status (workshop_id, status),                                                                                                                                                  
    KEY idx_jobs_customer (customer_user_id),                                                                                                                                                            
    KEY idx_jobs_vehicle (vehicle_id),                                                                                                                                                                   
    CONSTRAINT fk_jobs_quotation                                                                                                                                                                         
      FOREIGN KEY (quotation_id) REFERENCES quotations(id)                                                                                                                                               
      ON UPDATE RESTRICT ON DELETE RESTRICT,                                                                                                                                                             
    CONSTRAINT fk_jobs_workshop
      FOREIGN KEY (workshop_id) REFERENCES workshops(id)                                                                                                                                                 
      ON UPDATE RESTRICT ON DELETE RESTRICT,                                                                                                                                                             
    CONSTRAINT fk_jobs_customer                                                                                                                                                                          
      FOREIGN KEY (customer_user_id) REFERENCES users(id)
      ON UPDATE RESTRICT ON DELETE RESTRICT,                                                                                                                                                             
    CONSTRAINT fk_jobs_vehicle                                                                                                                                                                           
      FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)                                                                                                                                                   
      ON UPDATE RESTRICT ON DELETE RESTRICT                                                                                                                                                              
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;                                                                                                                                    
                                                                                                                                                                                                         
  CREATE TABLE attachments (                                                                                                                                                                             
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,                                                                                                                                                          
    service_request_id BIGINT UNSIGNED NULL,                                                                                                                                                             
    quotation_id BIGINT UNSIGNED NULL,                                                                                                                                                                   
    file_name VARCHAR(255) NOT NULL,                                                                                                                                                                     
    file_type VARCHAR(100) NULL,                                                                                                                                                                         
    file_size_bytes BIGINT UNSIGNED NULL,                                                                                                                                                                
    storage_key VARCHAR(255) NOT NULL,                                                                                                                                                                   
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),                                                                                                                                        
    PRIMARY KEY (id),
    KEY idx_attachments_service_request (service_request_id),                                                                                                                                            
    KEY idx_attachments_quotation (quotation_id),                                                                                                                                                        
    CONSTRAINT fk_attachments_service_request                                                                                                                                                            
      FOREIGN KEY (service_request_id) REFERENCES service_requests(id)                                                                                                                                   
      ON UPDATE RESTRICT ON DELETE SET NULL,                                                                                                                                                             
    CONSTRAINT fk_attachments_quotation
      FOREIGN KEY (quotation_id) REFERENCES quotations(id)                                                                                                                                               
      ON UPDATE RESTRICT ON DELETE SET NULL                                                                                                                                                              
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;                                                                                                                                    
                                                                                                                                                                                                         
  INSERT INTO workshops (name, email, phone, address_line1, city, postcode, country)                                                                                                                     
  VALUES ('SmartWorkshop Central', 'contact@smartworkshop.example', '+44 20 7946 0001', '12 High Street', 'London', 'SW1A 1AA', 'UK');                                                                   
                                                                                                                                                                                                         
  INSERT INTO users (email, password_hash, full_name, phone, role, is_active)                                                                                                                            
  VALUES                                                                                                                                                                                                 
    ('admin@smartworkshop.example', '$2b$10$REPLACE_ME_ADMIN', 'Alex Admin', '+44 20 7946 0002', 'admin', 1),                                                                                            
    ('mech@smartworkshop.example', '$2b$10$REPLACE_ME_MECH', 'Mia Mechanic', '+44 20 7946 0003', 'mechanic', 1),                                                                                         
    ('customer@smartworkshop.example', '$2b$10$REPLACE_ME_CUSTOMER', 'Chris Customer', '+44 20 7946 0004', 'customer', 1);                                                                               
                                                                                                                                                                                                         
  INSERT INTO workshop_users (workshop_id, user_id, workshop_role)                                                                                                                                       
  VALUES                                                                                                                                                                                                 
    (1, 1, 'admin'),                                                                                                                                                                                     
    (1, 2, 'mechanic');                                                                                                                                                                                  
                                                                                                                                                                                                         
  INSERT INTO vehicles (customer_user_id, make, model, year, vin, registration_number)                                                                                                                   
  VALUES (3, 'Ford', 'Fiesta', 2018, 'WF0DXXGAKD8A12345', 'AB18 CDE');                                                                                                                                   
                                                                                                                                                                                                         
  INSERT INTO service_requests (workshop_id, customer_user_id, vehicle_id, title, description, status, preferred_date)                                                                                   
  VALUES (1, 3, 1, 'Brake inspection', 'Squealing noise when braking at low speed.', 'submitted', DATE_ADD(CURDATE(), INTERVAL 7 DAY));