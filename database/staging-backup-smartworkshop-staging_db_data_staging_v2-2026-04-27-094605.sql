-- MySQL dump 10.13  Distrib 8.0.36, for Linux (x86_64)
--
-- Host: localhost    Database: smartworkshop_staging
-- ------------------------------------------------------
-- Server version	8.0.36

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `addresses`
--

DROP TABLE IF EXISTS `addresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `addresses` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid_public` binary(16) DEFAULT NULL,
  `user_id` bigint unsigned NOT NULL,
  `label` varchar(64) DEFAULT NULL,
  `line1` varchar(160) NOT NULL,
  `line2` varchar(160) DEFAULT NULL,
  `city` varchar(100) NOT NULL,
  `postal_code` varchar(16) NOT NULL,
  `country` char(2) NOT NULL,
  `location` point NOT NULL /*!80003 SRID 4326 */,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid_public` (`uuid_public`),
  SPATIAL KEY `spx_addresses_location` (`location`),
  KEY `idx_addr_user` (`user_id`),
  CONSTRAINT `fk_addr_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `addresses`
--

LOCK TABLES `addresses` WRITE;
/*!40000 ALTER TABLE `addresses` DISABLE KEYS */;
INSERT INTO `addresses` VALUES (5,_binary '�^\�=�\��\�T�	�',4,'Primary','19 Claycorn Court, Station Way','Claygate','Esher','KT10 0QR','GB',_binary '\�\0\0\0\0\0	�?�J�I@�++MJAֿ'),(6,_binary 'N2\�=�\��\�T�	�',1,'Primary','Flat 19 Claycorn Court, Station Way, Esher, Kt10 0QR, GB, GB','GB','GB','GB','GB',_binary '\�\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0'),(16,_binary '>L\�?Z\�\�\�Пl�',3,'Contact','Roehampton Lane',NULL,'London','SW15 4DT','GB',_binary '\�\0\0\0\0\0�1zn�I@[�\�eϿ'),(17,_binary '>�\�:?Z\�\�\�Пl�',3,'Premises','34 Clapham High Street','Clapham','London','SW4 7UR','GB',_binary '\�\0\0\0\0\0��~\�l�I@��\��\���');
/*!40000 ALTER TABLE `addresses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attachments`
--

DROP TABLE IF EXISTS `attachments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attachments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `message_id` bigint unsigned NOT NULL,
  `file_url` text NOT NULL,
  `type` varchar(32) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_att_msg` (`message_id`),
  CONSTRAINT `fk_att_msg` FOREIGN KEY (`message_id`) REFERENCES `messages` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attachments`
--

LOCK TABLES `attachments` WRITE;
/*!40000 ALTER TABLE `attachments` DISABLE KEYS */;
/*!40000 ALTER TABLE `attachments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `audit_logs`
--

DROP TABLE IF EXISTS `audit_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `audit_logs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `entity` varchar(64) NOT NULL,
  `entity_id` varbinary(64) NOT NULL,
  `action` varchar(32) NOT NULL,
  `by_user` bigint unsigned DEFAULT NULL,
  `at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `diff_json` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_audit_entity` (`entity`,`at`),
  KEY `idx_audit_user` (`by_user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_logs`
--

LOCK TABLES `audit_logs` WRITE;
/*!40000 ALTER TABLE `audit_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `audit_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `availability_slots`
--

DROP TABLE IF EXISTS `availability_slots`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `availability_slots` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `mechanic_id` bigint unsigned NOT NULL,
  `start_at` datetime NOT NULL,
  `end_at` datetime NOT NULL,
  `status` enum('free','held','booked') NOT NULL DEFAULT 'free',
  PRIMARY KEY (`id`),
  KEY `idx_slot_mech_time` (`mechanic_id`,`start_at`),
  CONSTRAINT `fk_slot_mech` FOREIGN KEY (`mechanic_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `chk_slot_time` CHECK ((`start_at` < `end_at`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `availability_slots`
--

LOCK TABLES `availability_slots` WRITE;
/*!40000 ALTER TABLE `availability_slots` DISABLE KEYS */;
/*!40000 ALTER TABLE `availability_slots` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `booking_completion_parts`
--

DROP TABLE IF EXISTS `booking_completion_parts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `booking_completion_parts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `booking_id` bigint unsigned NOT NULL,
  `description` varchar(255) NOT NULL,
  `amount_eur` decimal(10,2) NOT NULL DEFAULT '0.00',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_bcp2_booking` (`booking_id`,`created_at`),
  CONSTRAINT `fk_bcp2_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking_completion_parts`
--

LOCK TABLES `booking_completion_parts` WRITE;
/*!40000 ALTER TABLE `booking_completion_parts` DISABLE KEYS */;
INSERT INTO `booking_completion_parts` VALUES (1,1,'No parts',0.00,'2026-04-21 22:56:13');
/*!40000 ALTER TABLE `booking_completion_parts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `booking_completion_photos`
--

DROP TABLE IF EXISTS `booking_completion_photos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `booking_completion_photos` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `booking_id` bigint unsigned NOT NULL,
  `uploaded_by_user_id` bigint unsigned NOT NULL,
  `file_url` text NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_bcp_booking` (`booking_id`,`created_at`),
  KEY `idx_bcp_user` (`uploaded_by_user_id`),
  CONSTRAINT `fk_bcp_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_bcp_user` FOREIGN KEY (`uploaded_by_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking_completion_photos`
--

LOCK TABLES `booking_completion_photos` WRITE;
/*!40000 ALTER TABLE `booking_completion_photos` DISABLE KEYS */;
INSERT INTO `booking_completion_photos` VALUES (1,1,3,'/uploads/booking-completion/booking-1-1776812173653-156735739.jpg','2026-04-21 22:56:13'),(2,1,3,'/uploads/booking-completion/booking-1-1776812173654-418999105.jpg','2026-04-21 22:56:13'),(3,1,3,'/uploads/booking-completion/booking-1-1776812173658-67419210.jpg','2026-04-21 22:56:13');
/*!40000 ALTER TABLE `booking_completion_photos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `booking_draft_items`
--

DROP TABLE IF EXISTS `booking_draft_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `booking_draft_items` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `draft_id` bigint unsigned NOT NULL,
  `service_id` bigint unsigned NOT NULL,
  `qty` int NOT NULL DEFAULT '1',
  `line_total_eur` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_draft_service` (`draft_id`,`service_id`),
  KEY `idx_bdi_draft` (`draft_id`),
  KEY `fk_bdi_service` (`service_id`),
  CONSTRAINT `fk_bdi_draft` FOREIGN KEY (`draft_id`) REFERENCES `booking_drafts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_bdi_service` FOREIGN KEY (`service_id`) REFERENCES `service_catalog` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking_draft_items`
--

LOCK TABLES `booking_draft_items` WRITE;
/*!40000 ALTER TABLE `booking_draft_items` DISABLE KEYS */;
INSERT INTO `booking_draft_items` VALUES (1,1,22,1,95.00),(2,1,4,1,150.00),(3,2,85,1,114.29),(4,3,84,1,163.95),(5,5,86,1,94.87);
/*!40000 ALTER TABLE `booking_draft_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `booking_drafts`
--

DROP TABLE IF EXISTS `booking_drafts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `booking_drafts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `session_id` varchar(64) NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `vehicle_json` json DEFAULT NULL,
  `notes` text,
  `vehicle_drivable` enum('yes','no') DEFAULT NULL,
  `availability_json` json DEFAULT NULL,
  `payment_status` enum('pending','authorized','paid','failed') NOT NULL DEFAULT 'pending',
  `payment_provider` varchar(64) DEFAULT NULL,
  `payment_amount_eur` decimal(10,2) DEFAULT NULL,
  `payment_currency` char(3) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `session_id` (`session_id`),
  KEY `idx_draft_user` (`user_id`),
  CONSTRAINT `fk_draft_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking_drafts`
--

LOCK TABLES `booking_drafts` WRITE;
/*!40000 ALTER TABLE `booking_drafts` DISABLE KEYS */;
INSERT INTO `booking_drafts` VALUES (1,'916b0115-1146-4cd7-a4e2-95643fc533001776778286883',NULL,NULL,NULL,NULL,NULL,'pending',NULL,NULL,NULL,'2026-04-21 13:31:48','2026-04-21 13:31:48'),(2,'92ce8325-4dcd-45b6-9b95-dd7a8b8ebfa41776787376213',NULL,NULL,NULL,NULL,NULL,'pending',NULL,NULL,NULL,'2026-04-21 16:03:13','2026-04-21 16:03:13'),(3,'92f88163-a562-4c4c-833b-67ae092e29dd1776789525637',4,'{\"make\": \"TOYOTA\", \"model\": \"COROLLA\", \"colour\": \"SILVER\", \"fuelType\": \"PETROL\", \"postcode\": \"KT10 0QR\", \"yearOfManufacture\": 2005, \"registrationNumber\": \"KL05USC\"}',NULL,'no','[{\"day\": \"23rd\", \"slots\": [\"8-10 AM\"], \"weekday\": \"Thursday\", \"iso_date\": \"2026-04-23\"}]','paid','mock',196.74,'GBP','2026-04-21 16:38:48','2026-04-21 16:40:02'),(5,'d0419929-da6c-4c5d-ab58-54dae83c3b8c1776969836775',NULL,NULL,NULL,NULL,NULL,'pending',NULL,NULL,NULL,'2026-04-23 18:43:58','2026-04-23 18:43:58');
/*!40000 ALTER TABLE `booking_drafts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `booking_items`
--

DROP TABLE IF EXISTS `booking_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `booking_items` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `booking_id` bigint unsigned NOT NULL,
  `service_id` bigint unsigned NOT NULL,
  `labour_minutes` int NOT NULL,
  `parts_json` json DEFAULT NULL,
  `line_total_eur` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_bi_booking` (`booking_id`),
  KEY `idx_bi_service` (`service_id`),
  CONSTRAINT `fk_bi_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_bi_service` FOREIGN KEY (`service_id`) REFERENCES `service_catalog` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking_items`
--

LOCK TABLES `booking_items` WRITE;
/*!40000 ALTER TABLE `booking_items` DISABLE KEYS */;
INSERT INTO `booking_items` VALUES (1,1,84,0,NULL,163.95);
/*!40000 ALTER TABLE `booking_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `booking_offers`
--

DROP TABLE IF EXISTS `booking_offers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `booking_offers` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `booking_id` bigint unsigned NOT NULL,
  `mechanic_id` bigint unsigned NOT NULL,
  `status` enum('pending','accepted','declined','expired') NOT NULL DEFAULT 'pending',
  `sent_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `responded_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_booking_mechanic` (`booking_id`,`mechanic_id`),
  KEY `idx_offer_mechanic_status` (`mechanic_id`,`status`),
  CONSTRAINT `fk_offer_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_offer_mechanic` FOREIGN KEY (`mechanic_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking_offers`
--

LOCK TABLES `booking_offers` WRITE;
/*!40000 ALTER TABLE `booking_offers` DISABLE KEYS */;
INSERT INTO `booking_offers` VALUES (1,1,3,'accepted','2026-04-21 22:23:11','2026-04-21 22:24:18');
/*!40000 ALTER TABLE `booking_offers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookings` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid_public` binary(16) DEFAULT NULL,
  `customer_id` bigint unsigned NOT NULL,
  `mechanic_id` bigint unsigned DEFAULT NULL,
  `address_id` bigint unsigned NOT NULL,
  `vehicle_id` bigint unsigned NOT NULL,
  `slot_id` bigint unsigned DEFAULT NULL,
  `status` enum('requested','accepted','in_progress','completed','disputed','refunded','cancelled') NOT NULL,
  `mechanic_cancelled_reason` text,
  `mechanic_cancelled_at` datetime DEFAULT NULL,
  `subtotal_eur` decimal(10,2) NOT NULL,
  `vat_eur` decimal(10,2) NOT NULL,
  `total_eur` decimal(10,2) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `notes` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid_public` (`uuid_public`),
  KEY `idx_booking_customer` (`customer_id`),
  KEY `idx_booking_mechanic` (`mechanic_id`),
  KEY `idx_booking_status` (`status`),
  KEY `idx_booking_created` (`created_at`),
  KEY `fk_bk_address` (`address_id`),
  KEY `fk_bk_vehicle` (`vehicle_id`),
  KEY `fk_bk_slot` (`slot_id`),
  CONSTRAINT `fk_bk_address` FOREIGN KEY (`address_id`) REFERENCES `addresses` (`id`),
  CONSTRAINT `fk_bk_customer` FOREIGN KEY (`customer_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_bk_mechanic` FOREIGN KEY (`mechanic_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_bk_slot` FOREIGN KEY (`slot_id`) REFERENCES `availability_slots` (`id`),
  CONSTRAINT `fk_bk_vehicle` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` VALUES (1,_binary '�z==�\��\�T�	�',4,3,5,1,NULL,'completed',NULL,NULL,163.95,32.79,196.74,'2026-04-21 16:40:02',NULL);
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contact_messages`
--

DROP TABLE IF EXISTS `contact_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contact_messages` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(120) NOT NULL,
  `email` varchar(255) NOT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `message` text NOT NULL,
  `status` enum('new','in_progress','closed','spam') NOT NULL DEFAULT 'new',
  `source` varchar(50) NOT NULL DEFAULT 'home_web',
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_contact_status_created` (`status`,`created_at`),
  KEY `idx_contact_email_created` (`email`,`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact_messages`
--

LOCK TABLES `contact_messages` WRITE;
/*!40000 ALTER TABLE `contact_messages` DISABLE KEYS */;
/*!40000 ALTER TABLE `contact_messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `email_change_requests`
--

DROP TABLE IF EXISTS `email_change_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `email_change_requests` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `new_email` varchar(320) NOT NULL,
  `token` char(64) NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token` (`token`),
  KEY `idx_ecr_user` (`user_id`),
  CONSTRAINT `fk_ecr_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `email_change_requests`
--

LOCK TABLES `email_change_requests` WRITE;
/*!40000 ALTER TABLE `email_change_requests` DISABLE KEYS */;
/*!40000 ALTER TABLE `email_change_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invoices`
--

DROP TABLE IF EXISTS `invoices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invoices` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `booking_id` bigint unsigned NOT NULL,
  `issuer_mechanic_id` bigint unsigned NOT NULL,
  `buyer_user_id` bigint unsigned NOT NULL,
  `number` varchar(64) NOT NULL,
  `issued_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `totals_json` json NOT NULL,
  `pdf_url` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_invoice_booking` (`booking_id`),
  UNIQUE KEY `uq_invoice_number` (`number`),
  KEY `fk_inv_issuer` (`issuer_mechanic_id`),
  KEY `fk_inv_buyer` (`buyer_user_id`),
  CONSTRAINT `fk_inv_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_inv_buyer` FOREIGN KEY (`buyer_user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_inv_issuer` FOREIGN KEY (`issuer_mechanic_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoices`
--

LOCK TABLES `invoices` WRITE;
/*!40000 ALTER TABLE `invoices` DISABLE KEYS */;
INSERT INTO `invoices` VALUES (1,1,3,4,'INV-20260421-00000001','2026-04-21 22:56:13','{\"totals\": {\"vat_eur\": 32.79, \"currency\": \"GBP\", \"parts_eur\": 0, \"total_eur\": 196.74, \"labour_eur\": 163.95, \"subtotal_eur\": 163.95}, \"completion\": {\"photos\": [\"/uploads/booking-completion/booking-1-1776812173653-156735739.jpg\", \"/uploads/booking-completion/booking-1-1776812173654-418999105.jpg\", \"/uploads/booking-completion/booking-1-1776812173658-67419210.jpg\"], \"added_parts\": [{\"amount_eur\": 0, \"description\": \"No parts\"}]}, \"parts_lines\": [{\"amount_eur\": 0, \"description\": \"No parts\"}], \"labour_lines\": [{\"amount_eur\": 163.95, \"description\": \"Premium Pre-purchase Inspection\"}]}',NULL);
/*!40000 ALTER TABLE `invoices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `login_two_factor_challenges`
--

DROP TABLE IF EXISTS `login_two_factor_challenges`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `login_two_factor_challenges` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `challenge_token` char(64) NOT NULL,
  `code_hash` text NOT NULL,
  `expires_at` datetime NOT NULL,
  `consumed_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `challenge_token` (`challenge_token`),
  KEY `idx_l2fc_user` (`user_id`,`created_at`),
  KEY `idx_l2fc_expires` (`expires_at`),
  CONSTRAINT `fk_l2fc_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `login_two_factor_challenges`
--

LOCK TABLES `login_two_factor_challenges` WRITE;
/*!40000 ALTER TABLE `login_two_factor_challenges` DISABLE KEYS */;
INSERT INTO `login_two_factor_challenges` VALUES (1,4,'529c46248702f5c63cfda6e064b6c84f0e5c3102c3fbd9d5d90ff4e5665106e5','$2a$10$Qn/ZnkH/PrGSDKGZbHDoAe/Zh3JMNzOs6Mlsb3w/cPiDySmUUEnz.','2026-04-25 14:36:34','2026-04-25 14:27:03','2026-04-25 14:26:34'),(2,4,'06e1adf09efc7758976a04b3444d38470c019d71df24c710907b7a190d933964','$2a$10$kV6Ht.TgjJghHGl/viGj7uSff5BnfCDX.pjgUVADlQF04rYa4wk4S','2026-04-25 15:13:37',NULL,'2026-04-25 15:03:37');
/*!40000 ALTER TABLE `login_two_factor_challenges` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mechanic_accreditations`
--

DROP TABLE IF EXISTS `mechanic_accreditations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mechanic_accreditations` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `name` varchar(160) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_ma_user` (`user_id`),
  CONSTRAINT `fk_ma_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mechanic_accreditations`
--

LOCK TABLES `mechanic_accreditations` WRITE;
/*!40000 ALTER TABLE `mechanic_accreditations` DISABLE KEYS */;
INSERT INTO `mechanic_accreditations` VALUES (1,2,'ATA Level 2','2026-04-21 10:42:27'),(7,3,'ATA Level 2','2026-04-23 00:18:51');
/*!40000 ALTER TABLE `mechanic_accreditations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mechanic_documents`
--

DROP TABLE IF EXISTS `mechanic_documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mechanic_documents` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `original_name` varchar(255) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `mime_type` varchar(100) NOT NULL,
  `file_size` int unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_md_user` (`user_id`),
  CONSTRAINT `fk_md_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mechanic_documents`
--

LOCK TABLES `mechanic_documents` WRITE;
/*!40000 ALTER TABLE `mechanic_documents` DISABLE KEYS */;
INSERT INTO `mechanic_documents` VALUES (1,3,'SamplePDF-40kb-Text-7pages.pdf','/uploads/mechanic-documents/mechanic-doc-1776782815073-965054165.pdf','application/pdf',44706,'2026-04-21 14:46:55'),(2,3,'SamplePDF-500kb-Text-Images-Links-9Pages.pdf','/uploads/mechanic-documents/mechanic-doc-1776782815074-128698141.pdf','application/pdf',569837,'2026-04-21 14:46:55'),(3,3,'SamplePDF-40kb-Text-7pages.pdf','/uploads/mechanic-documents/mechanic-doc-1776783113323-85294810.pdf','application/pdf',44706,'2026-04-21 14:51:53'),(4,3,'SamplePDF-500kb-Text-Images-Links-9Pages.pdf','/uploads/mechanic-documents/mechanic-doc-1776783113324-867304877.pdf','application/pdf',569837,'2026-04-21 14:51:53');
/*!40000 ALTER TABLE `mechanic_documents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mechanic_memberships`
--

DROP TABLE IF EXISTS `mechanic_memberships`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mechanic_memberships` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `name` varchar(160) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_mm_user` (`user_id`),
  CONSTRAINT `fk_mm_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mechanic_memberships`
--

LOCK TABLES `mechanic_memberships` WRITE;
/*!40000 ALTER TABLE `mechanic_memberships` DISABLE KEYS */;
INSERT INTO `mechanic_memberships` VALUES (1,2,'RAC Approved Garage','2026-04-21 10:42:27'),(6,3,'RMIF','2026-04-23 00:18:51');
/*!40000 ALTER TABLE `mechanic_memberships` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mechanic_password_setup_challenges`
--

DROP TABLE IF EXISTS `mechanic_password_setup_challenges`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mechanic_password_setup_challenges` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `challenge_token` char(64) NOT NULL,
  `code_hash` text NOT NULL,
  `password_hash` text NOT NULL,
  `expires_at` datetime NOT NULL,
  `consumed_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  UNIQUE KEY `challenge_token` (`challenge_token`),
  KEY `idx_mpsc_expires` (`expires_at`),
  CONSTRAINT `fk_mpsc_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mechanic_password_setup_challenges`
--

LOCK TABLES `mechanic_password_setup_challenges` WRITE;
/*!40000 ALTER TABLE `mechanic_password_setup_challenges` DISABLE KEYS */;
INSERT INTO `mechanic_password_setup_challenges` VALUES (1,3,'466934983c25d700702b9c07ac74917903d8cf4919b72f6c68bff53bf645c865','$2a$10$NVVpaTgQA46RY6Be4Kkg4OyYbsAUzouSBGSEHVcMr7YuQUfUYI3DG','$2a$10$RW1r97sYwr3Ku0qr1FWri.Bd3aRzwfCKy4KJHcAbAFA5fn.APwouS','2026-04-21 15:21:00','2026-04-21 15:13:18','2026-04-21 15:10:59');
/*!40000 ALTER TABLE `mechanic_password_setup_challenges` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mechanic_profiles`
--

DROP TABLE IF EXISTS `mechanic_profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mechanic_profiles` (
  `user_id` bigint unsigned NOT NULL,
  `display_name` varchar(120) NOT NULL,
  `legal_name` varchar(160) NOT NULL,
  `years_experience` int DEFAULT NULL,
  `work_history` text,
  `website_url` varchar(255) DEFAULT NULL,
  `has_trade_insurance` tinyint(1) DEFAULT NULL,
  `has_public_liability` tinyint(1) DEFAULT NULL,
  `vat_registered` tinyint(1) DEFAULT NULL,
  `business_type` varchar(64) DEFAULT NULL,
  `application_type` varchar(64) DEFAULT NULL,
  `lead_postcode` varchar(16) DEFAULT NULL,
  `application_status` varchar(64) DEFAULT NULL,
  `account_status` varchar(64) DEFAULT NULL,
  `info_request_note` text,
  `info_requested_at` datetime DEFAULT NULL,
  `password_set_at` datetime DEFAULT NULL,
  `travel_radius_miles` int DEFAULT NULL,
  `availability_pref` varchar(32) DEFAULT NULL,
  `referral_source` varchar(64) DEFAULT NULL,
  `vat_id` varchar(32) DEFAULT NULL,
  `is_mobile` tinyint(1) NOT NULL DEFAULT '1',
  `rating_avg` decimal(3,2) NOT NULL DEFAULT '0.00',
  `jobs_done` int NOT NULL DEFAULT '0',
  `about` text,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `fk_mp_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mechanic_profiles`
--

LOCK TABLES `mechanic_profiles` WRITE;
/*!40000 ALTER TABLE `mechanic_profiles` DISABLE KEYS */;
INSERT INTO `mechanic_profiles` VALUES (2,'Mia Mechanic','Mia Mechanic Ltd',8,NULL,NULL,1,1,1,'independent_garage','staging_demo','SW1A 1AA','approved','active',NULL,NULL,'2026-04-21 10:42:27',25,'search','seed',NULL,1,4.80,12,'Staging demo mechanic account.'),(3,'Anderson Ricardo Gomes Ballesteroz','Anderson Ricardo Gomes Ballesteroz',8,'2011 – 2013 | Junior Automotive Technician – AutoFix Garage\n\nAssisted senior mechanics with basic repairs\nPerformed oil changes, brake checks, and filter replacements\nHelped inspect vehicles before service\nRecorded basic service information manually\n\n2014 – 2016 | General Mechanic – South London Vehicle Services\n\nCarried out routine maintenance and minor repairs\nDiagnosed common mechanical faults\nReplaced brake pads, batteries, and suspension components\nSupported customer vehicle inspections\n\n2017 – 2018 | Experienced Mechanic – South London Vehicle Services\n\nManaged more complex repair jobs independently\nPrepared repair recommendations for customers\nUsed diagnostic tools to identify engine and electrical issues\nImproved turnaround time for regular maintenance jobs\n\n2019 – 2021 | Senior Mechanic – Mendoza Auto Repair Ltd\n\nDiagnosed mechanical and electrical problems\nPrepared quotations for repair work\nUpdated service progress through a digital system\nCommunicated directly with customers about vehicle issues\n\n2022 – Present | Senior Automotive Mechanic – Mendoza Auto Repair Ltd\n\nHandles daily service requests and workshop jobs\nReviews customer complaints and creates repair plans\nUpdates job status from inspection to completion\nSupports junior staff when needed\nUses online systems for quotations, job tracking, and service records\nKey Skills\nVehicle diagnostics\nBrake and suspension repair\nRoutine vehicle servicing\nQuotation preparation\nJob progress tracking\nCustomer communication\nUse of digital workshop systems\nRecent Example Jobs\n2026 – Ford Focus 2018 – Brake pad replacement – Completed\n2026 – Toyota Yaris 2019 – Battery diagnostic – In Progress\n2026 – BMW 3 Series 2017 – Suspension inspection – Pending','https://www.mechanicfast.uk',0,0,0,'garage_and_mobile_mechanic',NULL,'SW15 5PG','approved','active',NULL,NULL,'2026-04-21 15:13:18',20,NULL,'tv',NULL,1,5.00,0,NULL);
/*!40000 ALTER TABLE `mechanic_profiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mechanic_qualifications`
--

DROP TABLE IF EXISTS `mechanic_qualifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mechanic_qualifications` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `name` varchar(160) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_mq_user` (`user_id`),
  CONSTRAINT `fk_mq_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mechanic_qualifications`
--

LOCK TABLES `mechanic_qualifications` WRITE;
/*!40000 ALTER TABLE `mechanic_qualifications` DISABLE KEYS */;
INSERT INTO `mechanic_qualifications` VALUES (1,2,'NVQ Level 3','2026-04-21 10:42:27'),(2,2,'IMI Level 2','2026-04-21 10:42:27'),(12,3,'NVQ Level 1','2026-04-23 00:18:51');
/*!40000 ALTER TABLE `mechanic_qualifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mechanic_services`
--

DROP TABLE IF EXISTS `mechanic_services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mechanic_services` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `mechanic_id` bigint unsigned NOT NULL,
  `service_id` bigint unsigned NOT NULL,
  `custom_labour_rate_eur` decimal(10,2) DEFAULT NULL,
  `enabled` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_mech_service` (`mechanic_id`,`service_id`),
  KEY `idx_ms_service` (`service_id`),
  CONSTRAINT `fk_ms_mech` FOREIGN KEY (`mechanic_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ms_service` FOREIGN KEY (`service_id`) REFERENCES `service_catalog` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=87 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mechanic_services`
--

LOCK TABLES `mechanic_services` WRITE;
/*!40000 ALTER TABLE `mechanic_services` DISABLE KEYS */;
INSERT INTO `mechanic_services` VALUES (1,3,34,NULL,1),(2,3,35,NULL,1),(3,3,36,NULL,1),(4,3,38,NULL,1),(5,3,40,NULL,1),(6,3,41,NULL,1),(7,3,42,NULL,1),(8,3,39,NULL,1),(9,3,43,NULL,1),(10,3,32,NULL,1),(11,3,44,NULL,1),(12,3,45,NULL,1),(13,3,46,NULL,1),(14,3,48,NULL,1),(15,3,47,NULL,1),(16,3,49,NULL,1),(17,3,50,NULL,1),(18,3,51,NULL,1),(19,3,52,NULL,1),(20,3,53,NULL,1),(21,3,54,NULL,1),(22,3,55,NULL,1),(23,3,56,NULL,1),(24,3,58,NULL,1),(25,3,57,NULL,1),(26,3,59,NULL,1),(27,3,60,NULL,1),(28,3,61,NULL,1),(29,3,62,NULL,1),(30,3,63,NULL,1),(31,3,33,NULL,1),(32,3,64,NULL,1),(33,3,37,NULL,1),(34,3,65,NULL,1),(35,3,67,NULL,1),(36,3,66,NULL,1),(37,3,68,NULL,1),(38,3,69,NULL,1),(39,3,70,NULL,1),(40,3,71,NULL,1),(41,3,72,NULL,1),(42,3,73,NULL,1),(43,3,74,NULL,1),(44,3,75,NULL,1),(45,3,76,NULL,1),(46,3,11,NULL,1),(47,3,1,NULL,1),(48,3,86,NULL,1),(49,3,84,NULL,1),(50,3,85,NULL,1),(51,3,14,NULL,1),(52,3,81,NULL,1),(53,3,13,NULL,1),(54,3,22,NULL,1),(55,3,17,NULL,1),(56,3,2,NULL,1),(57,3,19,NULL,1),(58,3,3,NULL,1),(59,3,4,NULL,1),(60,3,6,NULL,1),(61,3,7,NULL,1),(62,3,8,NULL,1),(63,3,9,NULL,1),(64,3,5,NULL,1),(65,3,26,NULL,1),(66,3,16,NULL,1),(67,3,20,NULL,1),(68,3,18,NULL,1),(69,3,29,NULL,1),(70,3,23,NULL,1),(71,3,12,NULL,1),(72,3,25,NULL,1),(73,3,27,NULL,1),(74,3,10,NULL,1),(75,3,24,NULL,1),(76,3,28,NULL,1),(77,3,15,NULL,1),(78,3,30,NULL,1),(79,3,21,NULL,1),(80,3,31,NULL,1),(81,3,78,NULL,1),(82,3,79,NULL,1),(83,3,77,NULL,1),(84,3,80,NULL,1),(85,3,82,NULL,1),(86,3,83,NULL,1);
/*!40000 ALTER TABLE `mechanic_services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mechanic_services_offered`
--

DROP TABLE IF EXISTS `mechanic_services_offered`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mechanic_services_offered` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `service_type` varchar(64) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_mso_user_type` (`user_id`,`service_type`),
  KEY `idx_mso_user` (`user_id`),
  CONSTRAINT `fk_mso_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mechanic_services_offered`
--

LOCK TABLES `mechanic_services_offered` WRITE;
/*!40000 ALTER TABLE `mechanic_services_offered` DISABLE KEYS */;
INSERT INTO `mechanic_services_offered` VALUES (1,2,'mobile_mechanic_service','2026-04-21 10:42:27'),(37,3,'mobile_mechanic_service','2026-04-23 21:20:25'),(38,3,'customer_drop_off','2026-04-23 21:20:25'),(39,3,'collection_and_delivery','2026-04-23 21:20:25');
/*!40000 ALTER TABLE `mechanic_services_offered` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `booking_id` bigint unsigned NOT NULL,
  `sender_id` bigint unsigned NOT NULL,
  `body` text NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_msg_booking` (`booking_id`,`created_at`),
  KEY `fk_msg_sender` (`sender_id`),
  CONSTRAINT `fk_msg_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_msg_sender` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_requests`
--

DROP TABLE IF EXISTS `password_reset_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_requests` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `token` char(64) NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token` (`token`),
  KEY `idx_pr_user` (`user_id`),
  CONSTRAINT `fk_prr_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_requests`
--

LOCK TABLES `password_reset_requests` WRITE;
/*!40000 ALTER TABLE `password_reset_requests` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment_admin_notes`
--

DROP TABLE IF EXISTS `payment_admin_notes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_admin_notes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `payment_kind` varchar(32) NOT NULL,
  `record_id` bigint unsigned NOT NULL,
  `admin_id` bigint unsigned NOT NULL,
  `note` text NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_payment_admin_notes_lookup` (`payment_kind`,`record_id`,`created_at`),
  KEY `idx_payment_admin_notes_admin` (`admin_id`,`created_at`),
  CONSTRAINT `fk_payment_admin_notes_admin` FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_admin_notes`
--

LOCK TABLES `payment_admin_notes` WRITE;
/*!40000 ALTER TABLE `payment_admin_notes` DISABLE KEYS */;
/*!40000 ALTER TABLE `payment_admin_notes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `booking_id` bigint unsigned NOT NULL,
  `provider` varchar(64) NOT NULL,
  `status` enum('authorized','auth_captured','refunded','failed') NOT NULL,
  `amount_eur` decimal(10,2) NOT NULL,
  `currency` char(3) NOT NULL DEFAULT 'EUR',
  `payment_method` varchar(32) DEFAULT NULL,
  `card_last4` char(4) DEFAULT NULL,
  `provider_ref` varchar(128) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_provider_ref` (`provider`,`provider_ref`),
  KEY `fk_pay_booking` (`booking_id`),
  CONSTRAINT `fk_pay_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (1,1,'mock','auth_captured',196.74,'GBP','American Express','6456','PAY-00000001','2026-04-21 16:40:02');
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payouts`
--

DROP TABLE IF EXISTS `payouts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payouts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `wallet_id` bigint unsigned NOT NULL,
  `amount_eur` decimal(10,2) NOT NULL,
  `status` enum('requested','processing','paid','failed') NOT NULL DEFAULT 'requested',
  `provider_ref` varchar(128) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_payout_wallet` (`wallet_id`,`created_at`),
  CONSTRAINT `fk_payout_wallet` FOREIGN KEY (`wallet_id`) REFERENCES `wallets` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payouts`
--

LOCK TABLES `payouts` WRITE;
/*!40000 ALTER TABLE `payouts` DISABLE KEYS */;
/*!40000 ALTER TABLE `payouts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `promo_codes`
--

DROP TABLE IF EXISTS `promo_codes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `promo_codes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(32) NOT NULL,
  `type` enum('percent','fixed') NOT NULL,
  `value` decimal(10,2) NOT NULL,
  `max_redemptions` int DEFAULT NULL,
  `valid_from` datetime NOT NULL,
  `valid_to` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promo_codes`
--

LOCK TABLES `promo_codes` WRITE;
/*!40000 ALTER TABLE `promo_codes` DISABLE KEYS */;
/*!40000 ALTER TABLE `promo_codes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `promo_redemptions`
--

DROP TABLE IF EXISTS `promo_redemptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `promo_redemptions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `code_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `booking_id` bigint unsigned NOT NULL,
  `amount_eur` decimal(10,2) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_pr_user` (`user_id`),
  KEY `idx_pr_booking` (`booking_id`),
  KEY `fk_pr_code` (`code_id`),
  CONSTRAINT `fk_pr_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_pr_code` FOREIGN KEY (`code_id`) REFERENCES `promo_codes` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_pr_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promo_redemptions`
--

LOCK TABLES `promo_redemptions` WRITE;
/*!40000 ALTER TABLE `promo_redemptions` DISABLE KEYS */;
/*!40000 ALTER TABLE `promo_redemptions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `resolution_case_message_attachments`
--

DROP TABLE IF EXISTS `resolution_case_message_attachments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `resolution_case_message_attachments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `message_id` bigint unsigned NOT NULL,
  `file_url` text NOT NULL,
  `original_name` varchar(255) DEFAULT NULL,
  `mime_type` varchar(100) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_rcma_message` (`message_id`,`created_at`),
  CONSTRAINT `fk_rcma_message` FOREIGN KEY (`message_id`) REFERENCES `resolution_case_messages` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resolution_case_message_attachments`
--

LOCK TABLES `resolution_case_message_attachments` WRITE;
/*!40000 ALTER TABLE `resolution_case_message_attachments` DISABLE KEYS */;
/*!40000 ALTER TABLE `resolution_case_message_attachments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `resolution_case_messages`
--

DROP TABLE IF EXISTS `resolution_case_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `resolution_case_messages` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `case_id` bigint unsigned NOT NULL,
  `sender_id` bigint unsigned NOT NULL,
  `body` text NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_resolution_message_case` (`case_id`,`created_at`),
  KEY `fk_resolution_message_sender` (`sender_id`),
  CONSTRAINT `fk_resolution_message_case` FOREIGN KEY (`case_id`) REFERENCES `resolution_cases` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_resolution_message_sender` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resolution_case_messages`
--

LOCK TABLES `resolution_case_messages` WRITE;
/*!40000 ALTER TABLE `resolution_case_messages` DISABLE KEYS */;
INSERT INTO `resolution_case_messages` VALUES (1,1,3,'Hello John, thanks for contacting us. Could you please tell me the vehicle model and when the issue started?','2026-04-21 22:32:25'),(2,1,4,'Yes, it’s a Ford Fiesta 2016. The noise started about 3 days ago, and I noticed the loss of power yesterday.','2026-04-21 22:32:53'),(3,2,4,'I would like to make a complaint regarding the amount I was charged for the service. I was charged more than the price that was originally agreed. This is very concerning, as I was expecting to pay the amount we discussed beforehand.\n\nI would appreciate it if you could review the charge and explain why the final amount was higher than agreed. If this was a mistake, I kindly request a refund for the difference.\n\nI look forward to your prompt response and a resolution to this issue.','2026-04-23 19:08:47'),(4,2,1,'Thank you for bringing this to our attention.\n\nWe sincerely apologise for the concern caused regarding the amount charged for the service. We understand your frustration and appreciate the opportunity to review this matter.\n\nPlease be assured that we take complaints of this nature seriously. We will carefully check the original agreed price and compare it with the final amount charged in order to identify whether there has been an error or if there were any additional costs applied.\n\nIf a mistake has been made, we will arrange the appropriate refund for the difference as soon as possible. We will get back to you shortly with an update once the review has been completed.\n\nThank you for your patience and understanding.','2026-04-23 21:43:45');
/*!40000 ALTER TABLE `resolution_case_messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `resolution_cases`
--

DROP TABLE IF EXISTS `resolution_cases`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `resolution_cases` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `booking_id` bigint unsigned NOT NULL,
  `mechanic_id` bigint unsigned NOT NULL,
  `customer_id` bigint unsigned NOT NULL,
  `case_type` enum('general','complaint') NOT NULL DEFAULT 'general',
  `subject` varchar(120) NOT NULL,
  `sequence_no` int NOT NULL,
  `reference` varchar(64) NOT NULL,
  `status` enum('open','in_progress','closed') NOT NULL DEFAULT 'open',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_resolution_reference` (`reference`),
  UNIQUE KEY `uq_resolution_booking_sequence` (`booking_id`,`sequence_no`),
  KEY `idx_resolution_mechanic_status` (`mechanic_id`,`status`,`updated_at`),
  KEY `idx_resolution_booking` (`booking_id`),
  KEY `fk_resolution_customer` (`customer_id`),
  CONSTRAINT `fk_resolution_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_resolution_customer` FOREIGN KEY (`customer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_resolution_mechanic` FOREIGN KEY (`mechanic_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resolution_cases`
--

LOCK TABLES `resolution_cases` WRITE;
/*!40000 ALTER TABLE `resolution_cases` DISABLE KEYS */;
INSERT INTO `resolution_cases` VALUES (1,1,3,4,'general','General Enquiry',1,'00000001/1','open','2026-04-21 22:31:12','2026-04-21 22:31:12'),(2,1,3,4,'complaint','Complaint',2,'00000001/2','open','2026-04-23 19:08:47','2026-04-23 21:43:45');
/*!40000 ALTER TABLE `resolution_cases` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `booking_id` bigint unsigned NOT NULL,
  `customer_id` bigint unsigned NOT NULL,
  `mechanic_id` bigint unsigned NOT NULL,
  `rating` tinyint NOT NULL,
  `comment` text,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_review_booking` (`booking_id`),
  KEY `idx_review_mechanic` (`mechanic_id`),
  KEY `fk_rev_customer` (`customer_id`),
  CONSTRAINT `fk_rev_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_rev_customer` FOREIGN KEY (`customer_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_rev_mechanic` FOREIGN KEY (`mechanic_id`) REFERENCES `users` (`id`),
  CONSTRAINT `reviews_chk_1` CHECK ((`rating` between 1 and 5))
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES (1,1,4,3,5,'Excellent mechanic. Very professional, honest, and efficient. He identified the problem quickly and fixed it properly. I am very satisfied with the service and would highly recommend him.','2026-04-23 19:01:42');
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `service_catalog`
--

DROP TABLE IF EXISTS `service_catalog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `service_catalog` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(64) NOT NULL,
  `name` varchar(120) NOT NULL,
  `category` varchar(64) NOT NULL,
  `group_name` varchar(64) DEFAULT NULL,
  `subcategory` varchar(64) DEFAULT NULL,
  `display_order` int NOT NULL DEFAULT '1000',
  `description` text,
  `base_labour_minutes` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=87 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `service_catalog`
--

LOCK TABLES `service_catalog` WRITE;
/*!40000 ALTER TABLE `service_catalog` DISABLE KEYS */;
INSERT INTO `service_catalog` VALUES (1,'ev_charger_installation','EV Charger installation','ev','ev_chargers','ev_chargers',10,NULL,240),(2,'repair_automatic_transmission_service','Automatic transmission, housing & fluid systems','repair','repairs','automatic_transmissions',60,NULL,180),(3,'repair_body_centre_interior_trim','Interior/Seats/Seatbelts','repair','repairs','body_centre_sections',70,NULL,120),(4,'repair_body_front_bonnet','Bonnets','repair','repairs','body_front_sections',80,NULL,90),(5,'repair_clutch_replacement','Clutch replacement','repair','repairs','clutch_and_controls',210,'Vehicles with a manual gearbox only',300),(6,'repair_brake_discs_pads_front','Brake discs & pads replacement - front (both)','repair','repairs','brakes',110,NULL,180),(7,'repair_brake_discs_pads_rear','Brake discs & pads replacement - rear (both)','repair','repairs','brakes',120,NULL,180),(8,'repair_brake_pads_front','Brake pads replacement - front (all)','repair','repairs','brakes',130,NULL,90),(9,'repair_brake_pads_rear','Brake pads replacement - rear (all)','repair','repairs','brakes',140,NULL,90),(10,'repair_timing_chain','Timing chain replacement','repair','repairs','engines',310,NULL,420),(11,'diagnostic_inspection','Diagnostic inspection','diagnostics','diagnostics','general',610,NULL,60),(12,'repair_oil_filter','Engine oil & filter replacement','repair','repairs','engines',320,NULL,90),(13,'mot_test_only','MOT (test only)','repair','mots','mots',20,'Test only',60),(14,'mot_collection_delivery','MOT with collection & delivery','repair','mots','mots',30,NULL,90),(15,'repair_water_pump','Water pump replacement','repair','repairs','cooling_systems',410,NULL,240),(16,'repair_driveshaft_replacement','Driveshaft replacement','repair','repairs','driveshafts_propshafts_differentials',420,NULL,210),(17,'repair_alternator','Alternator replacement','repair','repairs','engine_management_ignitions',510,NULL,210),(18,'repair_fuel_pump_replacement','Fuel pump replacement','repair','repairs','engine_management_fuels',500,NULL,180),(19,'repair_aux_belt','Auxiliary drive belt replacement','repair','repairs','engines',330,NULL,60),(20,'repair_exhaust_silencer_replacement','Exhaust silencer replacement','repair','repairs','exhaust_systems',530,NULL,120),(21,'repair_window_regulator','Window regulator replacement','repair','repairs','general_electrics',540,NULL,120),(22,'repair_air_conditioning_regas','Air conditioning re-gas','repair','repairs','heating_air_conditionings',550,NULL,60),(23,'repair_manual_gearbox_service','Manual gearbox service','repair','repairs','manual_transmissions',560,NULL,120),(24,'repair_track_rod_end','Track rod end replacement','repair','repairs','steerings',570,NULL,90),(25,'repair_shock_absorbers_front','Shock absorbers replacement - front (pair)','repair','repairs','suspensions',710,NULL,180),(26,'repair_coil_spring_front','Coil spring replacement - front (both)','repair','repairs','suspensions',720,NULL,180),(27,'repair_starter_motor','Starter motor replacement','repair','repairs','engine_management_ignitions',520,NULL,150),(28,'repair_turbocharger_replacement','Turbocharger replacement','repair','repairs','turbocharger_intercoolers',730,NULL,300),(29,'repair_locking_wheel_nut_removal','Locking wheel nut removal (one)','repair','repairs','vehicle_securities',740,NULL,45),(30,'repair_wheel_bearing_front','Front wheel bearing replacement','repair','repairs','wheel_bearings',750,NULL,150),(31,'repair_wing_mirror_glass','Wing mirror glass replacement','repair','repairs','wing_mirrors',760,NULL,60),(32,'diag_car_wont_start','Car won\'t start inspection','diagnostics','diagnostics','general',620,NULL,60),(33,'diag_plugin_inspection','Plug-in diagnostic inspection','diagnostics','diagnostics','general',630,NULL,60),(34,'diag_abs_warning_light','ABS Warning Light Inspection','diagnostics','diagnostics','general',631,NULL,60),(35,'diag_air_conditioning_system','Air conditioning system inspection','diagnostics','diagnostics','general',632,NULL,60),(36,'diag_battery_warning_light','Battery Warning Light Inspection','diagnostics','diagnostics','general',633,NULL,60),(37,'diag_pulls_left_right','Pulling System Inspection','diagnostics','diagnostics','general',634,NULL,60),(38,'diag_bulb_failure','Bulb Failure Inspection','diagnostics','diagnostics','general',635,NULL,60),(39,'diag_car_smoking','Car Smoking Inspection','diagnostics','diagnostics','general',636,NULL,60),(40,'diag_car_leaking_oil','Car Leaking Oil Inspection','diagnostics','diagnostics','general',637,NULL,60),(41,'diag_car_overheating','Car Overheating Inspection','diagnostics','diagnostics','general',638,NULL,60),(42,'diag_car_shuddering','Car Shuddering/Vibrating Inspection','diagnostics','diagnostics','general',639,NULL,60),(43,'diag_car_steering','Car Steering Inspection','diagnostics','diagnostics','general',640,NULL,60),(44,'diag_catalytic_converter','Catalytic Converter Inspection','diagnostics','diagnostics','general',641,NULL,60),(45,'diag_central_locking','Central Locking Inspection','diagnostics','diagnostics','general',642,NULL,60),(46,'diag_convertible_roof','Convertible roof fault diagnostic','diagnostics','diagnostics','general',643,NULL,60),(47,'diag_cooling_system','Cooling System Inspection','diagnostics','diagnostics','general',644,NULL,60),(48,'diag_cooling_heating','Cooling and Heating Inspection','diagnostics','diagnostics','general',645,NULL,60),(49,'diag_cruise_control','Cruise Control Inspection','diagnostics','diagnostics','general',646,NULL,60),(50,'diag_door_open','Door Open Inspection','diagnostics','diagnostics','general',647,NULL,60),(51,'diag_electronic_throttle','Electronic Throttle Control Inspection','diagnostics','diagnostics','general',648,NULL,60),(52,'diag_engine_warning_light','Engine Warning Light Inspection','diagnostics','diagnostics','general',649,NULL,60),(53,'diag_fuel_filler_cap','Fuel Filler Cap Inspection','diagnostics','diagnostics','general',650,NULL,60),(54,'diag_gear_selector_transmission','Gear Selector And Transmission Inspection','diagnostics','diagnostics','general',651,NULL,60),(55,'diag_handbrake','Handbrake Inspection','diagnostics','diagnostics','general',652,NULL,60),(56,'diag_noise_all_speeds','Noise At All Speeds Inspection','diagnostics','diagnostics','general',653,NULL,60),(57,'diag_noise_low_speeds','Noise At Slow Speeds Inspection','diagnostics','diagnostics','general',654,NULL,60),(58,'diag_noise_inside_car','Noise Inside Car Inspection','diagnostics','diagnostics','general',655,NULL,60),(59,'diag_noise_under_bonnet','Noise Under Bonnet Inspection','diagnostics','diagnostics','general',656,NULL,60),(60,'diag_noise_when_braking','Noise When Braking Inspection','diagnostics','diagnostics','general',657,NULL,60),(61,'diag_noise_when_starting','Noise When Starting Inspection','diagnostics','diagnostics','general',658,NULL,60),(62,'diag_oil_level_pressure','Oil Level And Pressure Inspection','diagnostics','diagnostics','general',659,NULL,60),(63,'diag_overdrive','Overdrive Inspection','diagnostics','diagnostics','general',660,NULL,60),(64,'diag_power_steering','Power Steering Inspection','diagnostics','diagnostics','general',661,NULL,60),(65,'diag_reduced_engine_power','Reduced Engine Power Inspection','diagnostics','diagnostics','general',662,NULL,60),(66,'diag_srs_airbag','SRS/Airbags Inspection','diagnostics','diagnostics','general',663,NULL,60),(67,'diag_seatbelts','Seatbelts Inspection','diagnostics','diagnostics','general',664,NULL,60),(68,'diag_suspension','Suspension Inspection','diagnostics','diagnostics','general',665,NULL,60),(69,'diag_suspension_noise','Suspension Noise Inspection','diagnostics','diagnostics','general',666,NULL,60),(70,'diag_traction_control','Traction Control Inspection','diagnostics','diagnostics','general',667,NULL,60),(71,'diag_transmission_fluid_temp','Transmission Fluid Temperature Inspection','diagnostics','diagnostics','general',668,NULL,60),(72,'diag_tyre_pressure_warning','Tyre pressure warning light inspection (TPMS)','diagnostics','diagnostics','general',669,NULL,60),(73,'diag_warning_light','Warning Light Inspection','diagnostics','diagnostics','general',670,NULL,60),(74,'diag_washer_system','Washer System Inspection','diagnostics','diagnostics','general',671,NULL,60),(75,'diag_water_car','Water Coming into Car Inspection','diagnostics','diagnostics','general',672,NULL,60),(76,'diag_windows','Windows Inspection','diagnostics','diagnostics','general',673,NULL,60),(77,'service_major','Major Service','service','services','services',410,NULL,240),(78,'service_full','Full Service','service','services','services',420,NULL,180),(79,'service_interim','Interim Service','service','services','services',430,NULL,120),(80,'service_vehicle_health','Vehicle Health Check','inspection','inspections','inspections',705,'Only Â£30 when booked with other work',45),(81,'mot_collection_delivery_plus','MOT with collection & delivery','service','mots','mots',40,'Only Â£19 when booked with a service',90),(82,'tyre_fitting','Tyre fitting','tyres','tyres','tyres',510,NULL,60),(83,'tyre_replacement_pair','Tyre replacement - pair','tyres','tyres','tyres',520,NULL,90),(84,'inspection_premium','Premium Pre-purchase Inspection','inspection','inspections','inspections',710,NULL,180),(85,'inspection_standard','Standard Pre-purchase Inspection','inspection','inspections','inspections',720,NULL,150),(86,'inspection_basic','Basic Pre-purchase Inspection','inspection','inspections','inspections',730,NULL,120);
/*!40000 ALTER TABLE `service_catalog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `service_pricing`
--

DROP TABLE IF EXISTS `service_pricing`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `service_pricing` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `service_id` bigint unsigned NOT NULL,
  `region` varchar(32) NOT NULL DEFAULT 'ES-default',
  `labour_rate_eur` decimal(10,2) NOT NULL,
  `parts_markup_pct` decimal(5,2) NOT NULL DEFAULT '0.00',
  `travel_fee_eur` decimal(10,2) NOT NULL DEFAULT '0.00',
  `vat_pct` decimal(5,2) NOT NULL DEFAULT '21.00',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_service_region` (`service_id`,`region`),
  CONSTRAINT `fk_sp_service` FOREIGN KEY (`service_id`) REFERENCES `service_catalog` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=87 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `service_pricing`
--

LOCK TABLES `service_pricing` WRITE;
/*!40000 ALTER TABLE `service_pricing` DISABLE KEYS */;
INSERT INTO `service_pricing` VALUES (1,5,'UK-default',675.00,0.00,0.00,20.00),(2,2,'UK-default',280.00,0.00,0.00,20.00),(3,3,'UK-default',120.00,0.00,0.00,20.00),(4,4,'UK-default',150.00,0.00,0.00,20.00),(5,6,'UK-default',300.00,0.00,0.00,20.00),(6,7,'UK-default',270.00,0.00,0.00,20.00),(7,8,'UK-default',145.00,0.00,0.00,20.00),(8,9,'UK-default',135.00,0.00,0.00,20.00),(9,10,'UK-default',1150.00,0.00,0.00,20.00),(10,11,'UK-default',60.00,0.00,0.00,20.00),(11,12,'UK-default',155.00,0.00,0.00,20.00),(12,13,'UK-default',50.00,0.00,0.00,20.00),(13,14,'UK-default',90.00,0.00,0.00,20.00),(14,15,'UK-default',350.00,0.00,0.00,20.00),(15,16,'UK-default',310.00,0.00,0.00,20.00),(16,17,'UK-default',525.00,0.00,0.00,20.00),(17,18,'UK-default',240.00,0.00,0.00,20.00),(18,19,'UK-default',110.00,0.00,0.00,20.00),(19,20,'UK-default',180.00,0.00,0.00,20.00),(20,21,'UK-default',165.00,0.00,0.00,20.00),(21,22,'UK-default',95.00,0.00,0.00,20.00),(22,23,'UK-default',210.00,0.00,0.00,20.00),(23,24,'UK-default',140.00,0.00,0.00,20.00),(24,25,'UK-default',325.00,0.00,0.00,20.00),(25,26,'UK-default',300.00,0.00,0.00,20.00),(26,27,'UK-default',375.00,0.00,0.00,20.00),(27,28,'UK-default',690.00,0.00,0.00,20.00),(28,29,'UK-default',55.00,0.00,0.00,20.00),(29,30,'UK-default',260.00,0.00,0.00,20.00),(30,31,'UK-default',95.00,0.00,0.00,20.00),(31,1,'UK-default',399.00,0.00,0.00,20.00),(32,32,'UK-default',66.39,0.00,0.00,20.00),(33,33,'UK-default',66.39,0.00,0.00,20.00),(34,34,'UK-default',66.39,0.00,0.00,20.00),(35,35,'UK-default',66.39,0.00,0.00,20.00),(36,36,'UK-default',66.39,0.00,0.00,20.00),(37,37,'UK-default',66.39,0.00,0.00,20.00),(38,38,'UK-default',66.39,0.00,0.00,20.00),(39,39,'UK-default',66.39,0.00,0.00,20.00),(40,40,'UK-default',66.39,0.00,0.00,20.00),(41,41,'UK-default',66.39,0.00,0.00,20.00),(42,42,'UK-default',66.39,0.00,0.00,20.00),(43,43,'UK-default',66.39,0.00,0.00,20.00),(44,44,'UK-default',66.39,0.00,0.00,20.00),(45,45,'UK-default',66.39,0.00,0.00,20.00),(46,46,'UK-default',66.39,0.00,0.00,20.00),(47,47,'UK-default',66.39,0.00,0.00,20.00),(48,48,'UK-default',66.39,0.00,0.00,20.00),(49,49,'UK-default',66.39,0.00,0.00,20.00),(50,50,'UK-default',66.39,0.00,0.00,20.00),(51,51,'UK-default',66.39,0.00,0.00,20.00),(52,52,'UK-default',66.39,0.00,0.00,20.00),(53,53,'UK-default',66.39,0.00,0.00,20.00),(54,54,'UK-default',66.39,0.00,0.00,20.00),(55,55,'UK-default',66.39,0.00,0.00,20.00),(56,56,'UK-default',66.39,0.00,0.00,20.00),(57,57,'UK-default',66.39,0.00,0.00,20.00),(58,58,'UK-default',66.39,0.00,0.00,20.00),(59,59,'UK-default',66.39,0.00,0.00,20.00),(60,60,'UK-default',66.39,0.00,0.00,20.00),(61,61,'UK-default',66.39,0.00,0.00,20.00),(62,62,'UK-default',66.39,0.00,0.00,20.00),(63,63,'UK-default',66.39,0.00,0.00,20.00),(64,64,'UK-default',66.39,0.00,0.00,20.00),(65,65,'UK-default',66.39,0.00,0.00,20.00),(66,66,'UK-default',66.39,0.00,0.00,20.00),(67,67,'UK-default',66.39,0.00,0.00,20.00),(68,68,'UK-default',66.39,0.00,0.00,20.00),(69,69,'UK-default',66.39,0.00,0.00,20.00),(70,70,'UK-default',66.39,0.00,0.00,20.00),(71,71,'UK-default',66.39,0.00,0.00,20.00),(72,72,'UK-default',66.39,0.00,0.00,20.00),(73,73,'UK-default',66.39,0.00,0.00,20.00),(74,74,'UK-default',66.39,0.00,0.00,20.00),(75,75,'UK-default',66.39,0.00,0.00,20.00),(76,76,'UK-default',66.39,0.00,0.00,20.00),(77,77,'UK-default',208.25,0.00,0.00,20.00),(78,78,'UK-default',152.86,0.00,0.00,20.00),(79,79,'UK-default',123.45,0.00,0.00,20.00),(80,80,'UK-default',50.00,0.00,0.00,20.00),(81,81,'UK-default',98.00,0.00,0.00,20.00),(82,82,'UK-default',85.00,0.00,0.00,20.00),(83,83,'UK-default',190.00,0.00,0.00,20.00),(84,84,'UK-default',163.95,0.00,0.00,20.00),(85,85,'UK-default',114.29,0.00,0.00,20.00),(86,86,'UK-default',94.87,0.00,0.00,20.00);
/*!40000 ALTER TABLE `service_pricing` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_profiles`
--

DROP TABLE IF EXISTS `user_profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_profiles` (
  `user_id` bigint unsigned NOT NULL,
  `name` varchar(120) NOT NULL,
  `middle_name` varchar(120) DEFAULT NULL,
  `lastname` varchar(120) NOT NULL,
  `avatar_url` text,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `fk_up_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_profiles`
--

LOCK TABLES `user_profiles` WRITE;
/*!40000 ALTER TABLE `user_profiles` DISABLE KEYS */;
INSERT INTO `user_profiles` VALUES (1,'Daniel','Ricardo','Ricardo Ricardo Anderson Thompson','/uploads/avatars/user-1-1776790105435.jpg'),(2,'Mia',NULL,'Mechanic',NULL),(3,'Anderson','Ricardo','Gomes Ballesteroz',NULL),(4,'Angel','Joseph','Gomes Ballesteroz','/uploads/avatars/user-4-1776789973449.jpg');
/*!40000 ALTER TABLE `user_profiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_roles`
--

DROP TABLE IF EXISTS `user_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_roles` (
  `user_id` bigint unsigned NOT NULL,
  `role` enum('user','mechanic','admin') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`,`role`),
  CONSTRAINT `fk_ur_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_roles`
--

LOCK TABLES `user_roles` WRITE;
/*!40000 ALTER TABLE `user_roles` DISABLE KEYS */;
INSERT INTO `user_roles` VALUES (1,'admin','2026-04-23 21:49:17'),(2,'mechanic','2026-04-21 10:42:27'),(3,'user','2026-04-21 13:57:19'),(3,'mechanic','2026-04-21 14:54:34'),(4,'user','2026-04-21 16:39:30');
/*!40000 ALTER TABLE `user_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_security_settings`
--

DROP TABLE IF EXISTS `user_security_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_security_settings` (
  `user_id` bigint unsigned NOT NULL,
  `two_factor_email_enabled` tinyint(1) NOT NULL DEFAULT '0',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `fk_uss_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_security_settings`
--

LOCK TABLES `user_security_settings` WRITE;
/*!40000 ALTER TABLE `user_security_settings` DISABLE KEYS */;
INSERT INTO `user_security_settings` VALUES (4,0,'2026-04-25 14:16:29');
/*!40000 ALTER TABLE `user_security_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid_public` binary(16) DEFAULT NULL,
  `email` varchar(320) COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(320) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password_hash` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('user','mechanic','admin') COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('pending','active','suspended','banned') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_login_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `uuid_public` (`uuid_public`),
  KEY `idx_users_phone` (`phone`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,_binary '\�b\0�=n񉰒,6��','zang17uk@outlook.com','Daniel174','07541017231','$2a$10$QgAztGwu0LwemtTV9aaBoe1mQfNQpl7ByHmivv5YsRDq0TmLj152a','admin','active','2026-04-21 10:42:27','2026-04-25 14:27:36'),(2,_binary '\�d�Z=n񉰒,6��','mechanic@smartworkshop.local','mechanic',NULL,'$2a$10$CQaCFg3M8oXuZxU1y62OxeF/5XnbG51WoW9KRI16KwRZUJ6xrtMdu','mechanic','active','2026-04-21 10:42:27',NULL),(3,_binary '\�\�=�\��\�T�	�','zang17univ@outlook.com','ander10','07541979335','$2a$10$RW1r97sYwr3Ku0qr1FWri.Bd3aRzwfCKy4KJHcAbAFA5fn.APwouS','mechanic','active','2026-04-21 13:57:19','2026-04-25 14:31:02'),(4,_binary '�C$/=�\��\�T�	�','zang17@hotmail.com','angel11','07541017231','$2a$10$u.wgcsH7IuxXLg2Lg40Y4.ilceub5JoizxYcPA9fHMB9qpbgz5m7.','user','active','2026-04-21 16:39:30','2026-04-25 18:26:35');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vehicles`
--

DROP TABLE IF EXISTS `vehicles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vehicles` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid_public` binary(16) DEFAULT NULL,
  `user_id` bigint unsigned NOT NULL,
  `license_plate` varchar(20) NOT NULL,
  `make` varchar(64) NOT NULL,
  `model` varchar(64) NOT NULL,
  `year` smallint DEFAULT NULL,
  `fuel_type` varchar(32) DEFAULT NULL,
  `mileage` varchar(32) DEFAULT NULL,
  `mot_status` varchar(64) DEFAULT NULL,
  `tax_status` varchar(64) DEFAULT NULL,
  `vin` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_veh_plate_user` (`user_id`,`license_plate`),
  UNIQUE KEY `uuid_public` (`uuid_public`),
  KEY `idx_veh_user` (`user_id`),
  CONSTRAINT `fk_vehicle_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vehicles`
--

LOCK TABLES `vehicles` WRITE;
/*!40000 ALTER TABLE `vehicles` DISABLE KEYS */;
INSERT INTO `vehicles` VALUES (1,_binary '�x\�\�=�\��\�T�	�',4,'KL05USC','TOYOTA','COROLLA',2005,'PETROL','39580','Due in 23 weeks','Due in 19 weeks',NULL);
/*!40000 ALTER TABLE `vehicles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wallets`
--

DROP TABLE IF EXISTS `wallets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wallets` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `mechanic_id` bigint unsigned NOT NULL,
  `available_eur` decimal(10,2) NOT NULL DEFAULT '0.00',
  `pending_eur` decimal(10,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`id`),
  UNIQUE KEY `mechanic_id` (`mechanic_id`),
  CONSTRAINT `fk_wallet_mech` FOREIGN KEY (`mechanic_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wallets`
--

LOCK TABLES `wallets` WRITE;
/*!40000 ALTER TABLE `wallets` DISABLE KEYS */;
/*!40000 ALTER TABLE `wallets` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-27  8:46:06

