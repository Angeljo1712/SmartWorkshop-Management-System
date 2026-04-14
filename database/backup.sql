-- MySQL dump 10.13  Distrib 8.0.36, for Linux (x86_64)
--
-- Host: localhost    Database: smartworkshop
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
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `addresses`
--

LOCK TABLES `addresses` WRITE;
/*!40000 ALTER TABLE `addresses` DISABLE KEYS */;
INSERT INTO `addresses` VALUES (1,_binary '\‰ˇ¶\‡eÒöΩä\Ã\‰2\»B',1,'Primary','Flat 19 Claycorn Court, Station Way',NULL,'Esher','KT10 0QR','GB',_binary '\Ê\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0'),(2,_binary 'o¬ÆgÒöΩä\Ã\‰2\»B',1,'Primary','Flat 19 Claycorn Court, Station Way',NULL,'Esher','KT10 0QR','GB',_binary '\Ê\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0'),(3,_binary 'QæFgÒöΩä\Ã\‰2\»B',1,'Primary','Flat 19 Claycorn Court, Station Way',NULL,'Esher','KT10 0QR','GB',_binary '\Ê\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0'),(4,_binary '∏/ BgÒöΩä\Ã\‰2\»B',1,'Primary','Flat 19 Claycorn Court, Station Way',NULL,'Esher','KT10 0QR','GB',_binary '\Ê\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0'),(5,_binary 'é`s_\Òâ\¬fHÇù<\Œ',8,'Primary','19 Claycorn Court, Station Way','Claygate','Esher','KT10 0QR','GB',_binary '\Ê\0\0\0\0\0	¿?•JÆI@˛++MJA÷ø'),(6,_binary '≥\ﬁˇ!^\ÒÅñ\¬B\œÕêe',1,'Primary','19 Claycorn Court, Station Way','Claygate','Esher','KT10 0QR','GB',_binary '\Ê\0\0\0\0\0	¿?•JÆI@˛++MJA÷ø'),(7,_binary 'n\∆+!_\ÒÅñ\¬B\œÕêe',1,'Primary','19 Claycorn Court, Station Way','Claygate','Esher','KT10 0QR','GB',_binary '\Ê\0\0\0\0\0	¿?•JÆI@˛++MJA÷ø'),(8,_binary 'H°e\“!_\ÒÅñ\¬B\œÕêe',1,'Primary','19 Claycorn Court, Station Way','Claygate','Esher','KT10 0QR','GB',_binary '\Ê\0\0\0\0\0	¿?•JÆI@˛++MJA÷ø'),(9,_binary '¡©î!_\ÒÅñ\¬B\œÕêe',1,'Primary','19 Claycorn Court, Station Way','Claygate','Esher','KT10 0QR','GB',_binary '\Ê\0\0\0\0\0	¿?•JÆI@˛++MJA÷ø'),(10,_binary '\«\Ì$\“!\Ò∫JaQ∏Sè',1,'Primary','19 Claycorn Court, Station Way','Claygate','Esher','KT10 0QR','GB',_binary '\Ê\0\0\0\0\0	¿?•JÆI@˛++MJA÷ø'),(11,_binary 'FêJ!Ä\Ò∫JaQ∏Sè',1,'Primary','Flat 19 Claycorn Court',NULL,'Esher','KT10 0QR','GB',_binary '\Ê\0\0\0\0\0	¿?•JÆI@˛++MJA÷ø'),(12,_binary '`,ü5!Ä\Ò∫JaQ∏Sè',1,'Primary','19 Claycorn Court, Station Way','Claygate','Esher','KT10 0QR','GB',_binary '\Ê\0\0\0\0\0	¿?•JÆI@˛++MJA÷ø'),(13,_binary 'g\\\Ë?!Ä\Ò∫JaQ∏Sè',1,'Primary','19 Claycorn Court, Station Way','Claygate','Esher','KT10 0QR','GB',_binary '\Ê\0\0\0\0\0	¿?•JÆI@˛++MJA÷ø'),(14,_binary '\ﬁ5Ωé!Ä\Ò∫JaQ∏Sè',1,'Primary','19 Claycorn Court, Station Way','Claygate','Esher','KT10 0QR','GB',_binary '\Ê\0\0\0\0\0	¿?•JÆI@˛++MJA÷ø'),(15,_binary 'C*\˜∞!â\Ò∫JaQ∏Sè',9,'Primary','19 Claycorn Court, Station Way','Claygate','Esher','KT10 0QR','GB',_binary '\Ê\0\0\0\0\0	¿?•JÆI@˛++MJA÷ø'),(16,_binary 'uÇ˙\√!â\Ò∫JaQ∏Sè',9,'Primary','19 Claycorn Court, Station Way','Claygate','Esher','KT10 0QR','GB',_binary '\Ê\0\0\0\0\0	¿?•JÆI@˛++MJA÷ø'),(17,_binary 'Ç	\Ã\”!ä\Ò∫JaQ∏Sè',10,'Primary','19 Claycorn Court, Station Way','Claygate','Esher','KT10 0QR','GB',_binary '\Ê\0\0\0\0\0	¿?•JÆI@˛++MJA÷ø'),(18,_binary '‘•B6!é\Ò∫JaQ∏Sè',11,'Primary','19 Claycorn Court, Station Way','Claygate','Esher','KT10 0QR','GB',_binary '\Ê\0\0\0\0\0	¿?•JÆI@˛++MJA÷ø'),(19,_binary '≈¥f6$q\Òß4≤B\Î0',1,'Primary','19 Claycorn Court, Station Way','Claygate','Esher','KT10 0QR','GB',_binary '\Ê\0\0\0\0\0	¿?•JÆI@˛++MJA÷ø'),(28,_binary '\ è\Ë%i\ÒòjJ\¬˚∂',1,'Primary','19 Claycorn Court, Station Way','Claygate','Esher','KT10 0QR','GB',_binary '\Ê\0\0\0\0\0	¿?•JÆI@˛++MJA÷ø'),(29,_binary 'âØ\Ÿ&C\Ò≥¨\Íç\Œ{/',1,'Primary','19 Claycorn Court, Station Way','Claygate','Esher','KT10 0QR','GB',_binary '\Ê\0\0\0\0\0	¿?•JÆI@˛++MJA÷ø'),(30,_binary '+\˜1π&D\Ò≥¨\Íç\Œ{/',1,'Primary','19 Claycorn Court, Station Way','Claygate','Esher','KT10 0QR','GB',_binary '\Ê\0\0\0\0\0	¿?•JÆI@˛++MJA÷ø'),(31,_binary 'l\'&û&D\Ò≥¨\Íç\Œ{/',1,'Primary','19 Claycorn Court, Station Way','Claygate','Esher','KT10 0QR','GB',_binary '\Ê\0\0\0\0\0	¿?•JÆI@˛++MJA÷ø'),(32,_binary 'π0&D\Ò≥¨\Íç\Œ{/',1,'Primary','19 Claycorn Court, Station Way','Claygate','Esher','KT10 0QR','GB',_binary '\Ê\0\0\0\0\0	¿?•JÆI@˛++MJA÷ø'),(33,_binary '•$\'\&E\Ò≥¨\Íç\Œ{/',1,'Primary','19 Claycorn Court, Station Way','Claygate','Esher','KT10 0QR','GB',_binary '\Ê\0\0\0\0\0	¿?•JÆI@˛++MJA÷ø'),(34,_binary '\·§Y&E\Ò≥¨\Íç\Œ{/',1,'Primary','19 Claycorn Court, Station Way','Claygate','Esher','KT10 0QR','GB',_binary '\Ê\0\0\0\0\0	¿?•JÆI@˛++MJA÷ø'),(35,_binary '\0e\Ÿ\Œ&F\Ò≥¨\Íç\Œ{/',1,'Primary','19 Claycorn Court, Station Way','Claygate','Esher','KT10 0QR','GB',_binary '\Ê\0\0\0\0\0	¿?•JÆI@˛++MJA÷ø'),(36,_binary '$E\Ù&F\Ò≥¨\Íç\Œ{/',1,'Primary','19 Claycorn Court, Station Way','Claygate','Esher','KT10 0QR','GB',_binary '\Ê\0\0\0\0\0	¿?•JÆI@˛++MJA÷ø'),(37,_binary '\“/]M&F\Ò≥¨\Íç\Œ{/',1,'Primary','19 Claycorn Court, Station Way','Claygate','Esher','KT10 0QR','GB',_binary '\Ê\0\0\0\0\0	¿?•JÆI@˛++MJA÷ø'),(38,_binary '\œ]d1\'ô\Ò†PÜ˘/$m',12,'Premises','Hillside, London,, Brent, NW9 0NE, GB','','','','',_binary '\Ê\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0'),(39,_binary '8Vr≥0M\Òå\’\Ó#I∑\“',1,'Primary','19 Claycorn Court, Station Way','Claygate','Esher','KT10 0QR','GB',_binary '\Ê\0\0\0\0\0	¿?•JÆI@˛++MJA÷ø'),(41,_binary 'gx\⁄\¬0N\Òå\’\Ó#I∑\“',1,'Primary','19 Claycorn Court, Station Way','Claygate','Esher','KT10 0QR','GB',_binary '\Ê\0\0\0\0\0	¿?•JÆI@˛++MJA÷ø'),(42,_binary '£p(\‡0P\Òå\’\Ó#I∑\“',1,'Primary','19 Claycorn Court, Station Way','Claygate','Esher','KT10 0QR','GB',_binary '\Ê\0\0\0\0\0	¿?•JÆI@˛++MJA÷ø'),(43,_binary '®hj2≠\Ò™\‘\‚Th®Z¯',1,'Primary','19 Claycorn Court, Station Way','Claygate','Esher','KT10 0QR','GB',_binary '\Ê\0\0\0\0\0	¿?•JÆI@˛++MJA÷ø'),(44,_binary '›π\›H2≠\Ò™\‘\‚Th®Z¯',1,'Primary','19 Claycorn Court, Station Way','Claygate','Esher','KT10 0QR','GB',_binary '\Ê\0\0\0\0\0	¿?•JÆI@˛++MJA÷ø'),(45,_binary '\\\ÿ0˚3ó\Ò∑\ﬁ>≤\ƒ\Ï\Ê\·',1,'Primary','19 Claycorn Court, Station Way','Claygate','Esher','KT10 0QR','GB',_binary '\Ê\0\0\0\0\0	¿?•JÆI@˛++MJA÷ø'),(46,_binary 'H\Ù±¿3§\Ò∑\ﬁ>≤\ƒ\Ï\Ê\·',1,'Primary','19 Claycorn Court, Station Way','Claygate','Esher','KT10 0QR','GB',_binary '\Ê\0\0\0\0\0	¿?•JÆI@˛++MJA÷ø'),(47,_binary 'W\⁄\Û/3¶\Ò∑\ﬁ>≤\ƒ\Ï\Ê\·',1,'Primary','19 Claycorn Court, Station Way','Claygate','Esher','KT10 0QR','GB',_binary '\Ê\0\0\0\0\0	¿?•JÆI@˛++MJA÷ø'),(48,_binary 'IÑ5,Òïæ∂QK?äL',7,'Contact','18 Friars Avenue',NULL,'London','SW15 3DU','GB',_binary '\Ê\0\0\0\0\0\Á\◊ \›∏I@ﬁ¶\‰A\—œø'),(49,_binary 'N\ﬁ\À\¬5∂\ÒÇLZF˚O™',2,'Primary','Flat 19 Claycorn Court, Station Way','Claygate','Esher','KT10 0QR','GB',_binary '\Ê\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0');
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
INSERT INTO `booking_completion_parts` VALUES (1,13,'Break pads',35.00,'2026-04-07 22:02:39');
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
INSERT INTO `booking_completion_photos` VALUES (1,13,7,'/uploads/booking-completion/booking-13-1775599359059-870155929.png','2026-04-07 22:02:39'),(2,13,7,'/uploads/booking-completion/booking-13-1775599359084-114505345.png','2026-04-07 22:02:39'),(3,13,7,'/uploads/booking-completion/booking-13-1775599359087-603627127.png','2026-04-07 22:02:39');
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
) ENGINE=InnoDB AUTO_INCREMENT=111 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking_draft_items`
--

LOCK TABLES `booking_draft_items` WRITE;
/*!40000 ALTER TABLE `booking_draft_items` DISABLE KEYS */;
INSERT INTO `booking_draft_items` VALUES (3,1,12,1,525.00),(4,1,13,1,110.00),(19,3,12,1,525.00),(20,5,12,1,525.00),(21,7,12,1,525.00),(22,9,12,1,525.00),(23,10,12,1,525.00),(24,10,13,1,110.00),(25,12,12,1,525.00),(26,13,12,1,525.00),(27,13,13,1,110.00),(47,14,12,1,525.00),(52,15,12,1,525.00),(64,16,12,1,525.00),(65,16,13,1,110.00),(66,17,12,1,525.00),(67,17,13,1,110.00),(68,22,12,1,525.00),(69,23,12,1,525.00),(70,23,13,1,110.00),(71,25,1,1,675.00),(72,30,65,1,66.39),(74,32,68,1,152.86),(76,34,68,1,152.86),(77,34,69,1,123.45),(78,34,12,1,525.00),(79,34,13,1,110.00),(83,37,12,1,525.00),(84,37,13,1,110.00),(85,38,12,1,525.00),(86,40,111,1,95.00),(89,41,111,1,95.00),(92,42,111,1,95.00),(93,44,111,1,95.00),(94,45,111,1,95.00),(95,46,111,1,95.00),(98,47,118,1,66.39),(99,57,111,1,95.00),(102,59,111,1,95.00),(103,59,118,1,66.39),(104,62,12,1,525.00),(105,64,106,1,150.00),(106,64,124,1,66.39),(109,67,70,1,50.00),(110,67,111,1,95.00);
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
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `notes` text,
  `vehicle_drivable` enum('yes','no') DEFAULT NULL,
  `availability_json` json DEFAULT NULL,
  `payment_status` enum('pending','authorized','paid','failed') NOT NULL DEFAULT 'pending',
  `payment_provider` varchar(64) DEFAULT NULL,
  `payment_amount_eur` decimal(10,2) DEFAULT NULL,
  `payment_currency` char(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `session_id` (`session_id`),
  KEY `idx_draft_user` (`user_id`),
  CONSTRAINT `fk_draft_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking_drafts`
--

LOCK TABLES `booking_drafts` WRITE;
/*!40000 ALTER TABLE `booking_drafts` DISABLE KEYS */;
INSERT INTO `booking_drafts` VALUES (1,'5469efdf-e7a2-410a-b459-f726dff471891770495233326',1,NULL,'2026-02-07 20:14:00','2026-02-07 20:45:10','Minor problems','yes','[{\"day\": \"6th\", \"slots\": [], \"weekday\": \"Friday\"}, {\"day\": \"7th\", \"slots\": [\"8-10 AM\"], \"weekday\": \"Saturday\"}, {\"day\": \"8th\", \"slots\": [], \"weekday\": \"Sunday\"}]','pending',NULL,NULL,NULL),(3,'b6711393-483f-4c31-9ee5-f62c07165dbc1770497590591',1,NULL,'2026-02-07 20:53:15','2026-02-07 20:53:37','Minor problem','yes','[{\"day\": \"6th\", \"slots\": [\"8-10 AM\"], \"weekday\": \"Friday\"}, {\"day\": \"7th\", \"slots\": [], \"weekday\": \"Saturday\"}, {\"day\": \"8th\", \"slots\": [], \"weekday\": \"Sunday\"}]','pending',NULL,NULL,NULL),(5,'c05cc153-6ed3-456e-b2b1-40455c88413b1770497704612',1,NULL,'2026-02-07 20:55:11','2026-02-07 20:55:22','Minor','yes','[{\"day\": \"6th\", \"slots\": [\"8-10 AM\"], \"weekday\": \"Friday\"}, {\"day\": \"7th\", \"slots\": [], \"weekday\": \"Saturday\"}, {\"day\": \"8th\", \"slots\": [], \"weekday\": \"Sunday\"}]','pending',NULL,NULL,NULL),(7,'ff62169b-4ab3-483d-a3b7-6d83065a0d4d1770497878262',1,NULL,'2026-02-07 20:58:04','2026-02-07 20:58:36','Minor','yes','[{\"day\": \"6th\", \"slots\": [\"8-10 AM\"], \"weekday\": \"Friday\"}, {\"day\": \"7th\", \"slots\": [], \"weekday\": \"Saturday\"}, {\"day\": \"8th\", \"slots\": [], \"weekday\": \"Sunday\"}]','paid','mock',630.00,'GBP'),(9,'2ce6130d-eb4a-41be-90af-1d0e660b4f331770567178019',NULL,NULL,'2026-02-08 16:13:12','2026-02-08 16:13:12',NULL,NULL,NULL,'pending',NULL,NULL,NULL),(10,'6e05c5a0-a5e4-4599-b241-6329de6dd7df1773353051661',8,'{\"make\": \"TOYOTA\", \"model\": \"COROLLA\", \"colour\": \"SILVER\", \"fuelType\": \"PETROL\", \"postcode\": \"KT10 0QR\", \"yearOfManufacture\": 2005, \"registrationNumber\": \"KL05USC\"}','2026-03-12 22:04:12','2026-03-12 22:05:40',NULL,'no','[{\"day\": \"6th\", \"slots\": [], \"weekday\": \"Friday\"}, {\"day\": \"7th\", \"slots\": [], \"weekday\": \"Saturday\"}, {\"day\": \"8th\", \"slots\": [\"All day\"], \"weekday\": \"Sunday\"}]','paid','mock',762.00,'GBP'),(12,'932af67d-84a6-4fc6-8685-902be95c37501773426361812',NULL,NULL,'2026-03-13 18:26:12','2026-03-13 18:26:12',NULL,NULL,NULL,'pending',NULL,NULL,NULL),(13,'95a2b93c-1fb2-4214-a98a-649329d1de561773428174261',NULL,NULL,'2026-03-13 18:56:27','2026-03-13 18:56:27',NULL,NULL,NULL,'pending',NULL,NULL,NULL),(14,'56548845-00e5-4cdf-a9fc-6b4fdd7ba2771773659277956',NULL,NULL,'2026-03-16 13:10:39','2026-03-16 13:10:39',NULL,NULL,NULL,'pending',NULL,NULL,NULL),(15,'a0bdab2b-8945-4c68-903c-cdf1abed36b81773671650162',NULL,NULL,'2026-03-16 14:34:15','2026-03-16 14:34:15',NULL,NULL,NULL,'pending',NULL,NULL,NULL),(16,'f4ed5c25-9cd0-46cd-8003-4578385b7cc61773672103115',NULL,NULL,'2026-03-16 14:43:45','2026-03-16 14:43:45',NULL,NULL,NULL,'pending',NULL,NULL,NULL),(17,'0aeb5ab3-1ec5-44a5-a0a5-1292cc91e15f1773677178952',1,NULL,'2026-03-16 16:25:20','2026-03-16 17:36:45',NULL,'yes','[{\"day\": \"16th\", \"slots\": [], \"weekday\": \"Thursday\"}, {\"day\": \"17th\", \"slots\": [\"All day\", \"8-10 AM\", \"10-12 AM\", \"12-2 PM\", \"2-4 PM\", \"4-6 PM\"], \"weekday\": \"Friday\"}, {\"day\": \"18th\", \"slots\": [], \"weekday\": \"Saturday\"}, {\"day\": \"19th\", \"slots\": [], \"weekday\": \"Sunday\"}, {\"day\": \"20th\", \"slots\": [], \"weekday\": \"Monday\"}]','pending',NULL,NULL,NULL),(22,'93372567-2c12-46a0-a609-5f94e65c640d1773684950260',NULL,NULL,'2026-03-16 18:15:53','2026-03-16 18:15:53',NULL,NULL,NULL,'pending',NULL,NULL,NULL),(23,'ccf9051c-7277-4216-9253-00f76faccb0a1773694408545',1,'{\"make\": \"TOYOTA\", \"model\": \"COROLLA\", \"colour\": \"SILVER\", \"fuelType\": \"PETROL\", \"postcode\": \"KT10 0QR\", \"yearOfManufacture\": 2005, \"registrationNumber\": \"KL05USC\"}','2026-03-16 20:53:30','2026-03-16 22:14:50',NULL,'yes','[{\"day\": \"16th\", \"slots\": [], \"weekday\": \"Thursday\"}, {\"day\": \"17th\", \"slots\": [], \"weekday\": \"Friday\"}, {\"day\": \"18th\", \"slots\": [], \"weekday\": \"Saturday\"}, {\"day\": \"19th\", \"slots\": [], \"weekday\": \"Sunday\"}, {\"day\": \"20th\", \"slots\": [], \"weekday\": \"Monday\"}]','paid','mock',762.00,'GBP'),(25,'debug-session',1,'{\"make\": \"Toyota\", \"model\": \"Corolla\", \"yearOfManufacture\": 2005, \"registrationNumber\": \"KL05USC\"}','2026-03-16 21:35:37','2026-03-16 21:35:53','test','yes','[{\"day\": \"16th\", \"slots\": [\"All day\"], \"weekday\": \"Monday\"}]','paid','mock',810.00,'GBP'),(29,'e58c23cf-c00e-4174-b57a-503c292451c91773697277215',9,NULL,'2026-03-16 22:41:24','2026-03-16 22:41:24',NULL,'yes','[{\"day\": \"17th\", \"slots\": [\"All day\", \"8-10 AM\", \"10-12 AM\", \"12-2 PM\", \"2-4 PM\", \"4-6 PM\"], \"weekday\": \"Friday\", \"iso_date\": \"2026-04-17\"}]','pending',NULL,NULL,NULL),(30,'02f4a160-06f9-4aa8-a98b-08f70b0c12491773700926825',9,'{\"make\": \"TOYOTA\", \"model\": \"COROLLA\", \"colour\": \"SILVER\", \"fuelType\": \"PETROL\", \"postcode\": \"KT10 0QR\", \"yearOfManufacture\": 2005, \"registrationNumber\": \"KL05USC\"}','2026-03-16 22:42:07','2026-03-16 22:43:14',NULL,'yes','[{\"day\": \"17th\", \"slots\": [\"All day\", \"8-10 AM\", \"10-12 AM\", \"12-2 PM\", \"2-4 PM\", \"4-6 PM\"], \"weekday\": \"Friday\", \"iso_date\": \"2026-04-17\"}]','paid','mock',79.67,'GBP'),(32,'ea16d688-44f9-47ac-bd82-556c0039be6c1773701366383',10,'{\"make\": \"TOYOTA\", \"model\": \"COROLLA\", \"colour\": \"SILVER\", \"fuelType\": \"PETROL\", \"postcode\": \"KT10 0QR\", \"yearOfManufacture\": 2005, \"registrationNumber\": \"KL05USC\"}','2026-03-16 22:49:27','2026-03-16 22:50:40','Vehiculo estable','yes','[{\"day\": \"16th\", \"slots\": [\"8-10 AM\"], \"weekday\": \"Thursday\", \"iso_date\": \"2026-04-16\"}]','paid','mock',183.43,'GBP'),(34,'9cea1512-8c82-4628-831b-4550d575e4481773701571507',11,'{\"make\": \"TOYOTA\", \"model\": \"COROLLA\", \"colour\": \"SILVER\", \"fuelType\": \"PETROL\", \"postcode\": \"KT10 0QR\", \"yearOfManufacture\": 2005, \"registrationNumber\": \"KL05USC\"}','2026-03-16 22:52:52','2026-03-16 23:21:16',NULL,'yes','[{\"day\": \"18th\", \"slots\": [\"All day\", \"8-10 AM\", \"10-12 AM\", \"12-2 PM\", \"2-4 PM\", \"4-6 PM\"], \"weekday\": \"Saturday\", \"iso_date\": \"2026-04-18\"}]','pending',NULL,NULL,NULL),(36,'a98cfc7d-c824-42da-b2db-482fba58f0981773837103620',NULL,NULL,'2026-03-18 12:31:47','2026-03-18 12:31:47',NULL,NULL,NULL,'pending',NULL,NULL,NULL),(37,'dd2eb930-b900-4b25-b489-dad6939bd6ac1774016751101',NULL,NULL,'2026-03-20 14:25:54','2026-03-20 14:25:54',NULL,NULL,NULL,'pending',NULL,NULL,NULL),(38,'f7eed0c6-8835-420b-adee-f7434f009e291774020308886',1,'{\"make\": \"TOYOTA\", \"model\": \"COROLLA\", \"colour\": \"SILVER\", \"fuelType\": \"PETROL\", \"postcode\": \"KT10 0QR\", \"yearOfManufacture\": 2005, \"registrationNumber\": \"KL05USC\"}','2026-03-20 15:25:13','2026-03-20 15:31:08','Nothing especial','yes','[{\"day\": \"20th\", \"slots\": [\"8-10 AM\"], \"weekday\": \"Monday\", \"iso_date\": \"2026-04-20\"}]','paid','mock',630.00,'GBP'),(40,'01f6e1e2-52e0-431a-8ef4-315ea6bd06aa1774119668549',NULL,NULL,'2026-03-21 19:26:13','2026-03-21 19:26:13',NULL,NULL,NULL,'pending',NULL,NULL,NULL),(41,'050407b4-f1e2-4e70-a167-d467c2f92a561774121493837',NULL,NULL,'2026-03-21 19:31:35','2026-03-21 19:31:35',NULL,NULL,NULL,'pending',NULL,NULL,NULL),(42,'72ad7744-18a1-451a-98b5-360f2323a7811774125484356',1,'{\"make\": \"TOYOTA\", \"model\": \"COROLLA\", \"colour\": \"SILVER\", \"fuelType\": \"PETROL\", \"postcode\": \"KT10 0QR\", \"yearOfManufacture\": 2005, \"registrationNumber\": \"KL05USC\"}','2026-03-21 20:38:08','2026-03-21 21:06:42',NULL,'no','[]','paid','mock',114.00,'GBP'),(44,'340a4ee4-8288-46b8-9e2e-e32aa26e7f531774133406498',NULL,NULL,'2026-03-21 23:00:03','2026-03-21 23:00:03',NULL,NULL,NULL,'pending',NULL,NULL,NULL),(45,'aa9bab0e-2b0a-4759-bf94-1e107f7c6c0a1774213682547',NULL,NULL,'2026-03-22 21:08:10','2026-03-22 21:08:10',NULL,NULL,NULL,'pending',NULL,NULL,NULL),(46,'fb3f81c0-92f5-493b-aed8-b47c8c454db01774217886692',1,'{\"make\": \"TOYOTA\", \"model\": \"COROLLA\", \"colour\": \"SILVER\", \"fuelType\": \"PETROL\", \"postcode\": \"KT10 0QR\", \"yearOfManufacture\": 2005, \"registrationNumber\": \"KL05USC\"}','2026-03-22 23:01:09','2026-03-22 23:13:23',NULL,'no','[]','pending',NULL,NULL,NULL),(47,'589a5320-66d1-41a9-b104-7942a7bd45e51774216188936',1,'{\"make\": \"TOYOTA\", \"model\": \"COROLLA\", \"colour\": \"SILVER\", \"fuelType\": \"PETROL\", \"postcode\": \"KT10 0QR\", \"yearOfManufacture\": 2005, \"registrationNumber\": \"KL05USC\"}','2026-03-22 23:04:29','2026-03-22 23:24:48',NULL,'no','[]','paid','mock',114.00,'GBP'),(57,'d76402d8-d319-4b4c-aad5-0efa1b4e820c1774356975437',NULL,NULL,'2026-03-24 12:56:28','2026-03-24 12:56:28',NULL,NULL,NULL,'pending',NULL,NULL,NULL),(58,'9274d14b-e9ff-42c8-a43f-3a9894db5f341775159834038',NULL,NULL,'2026-04-02 19:57:32','2026-04-02 19:57:32',NULL,NULL,NULL,'pending',NULL,NULL,NULL),(59,'5c75f2cd-e552-4c27-bf89-08d464cc982e1775323402766',1,'{\"make\": \"TOYOTA\", \"model\": \"COROLLA\", \"colour\": \"SILVER\", \"fuelType\": \"PETROL\", \"postcode\": \"KT10 0QR\", \"yearOfManufacture\": 2005, \"registrationNumber\": \"KL05USC\"}','2026-04-04 17:29:46','2026-04-04 17:48:21','Minor problems','yes','[{\"day\": \"6th\", \"slots\": [\"All day\", \"8-10 AM\", \"10-12 AM\", \"12-2 PM\", \"2-4 PM\", \"4-6 PM\"], \"weekday\": \"Monday\", \"iso_date\": \"2026-04-06\"}]','paid','mock',193.67,'GBP'),(62,'6c6c121d-da5d-41ba-9a28-6277860814261775325808151',1,'{\"make\": \"TOYOTA\", \"model\": \"COROLLA\", \"colour\": \"SILVER\", \"fuelType\": \"PETROL\", \"postcode\": \"KT10 0QR\", \"yearOfManufacture\": 2005, \"registrationNumber\": \"KL05USC\"}','2026-04-04 18:03:29','2026-04-04 18:04:11',NULL,'yes','[{\"day\": \"7th\", \"slots\": [\"8-10 AM\"], \"weekday\": \"Tuesday\", \"iso_date\": \"2026-04-07\"}]','paid','mock',630.00,'GBP'),(64,'3be4834e-139d-4d4a-9814-13111822a2ad1775585670917',1,'{\"make\": \"TOYOTA\", \"model\": \"COROLLA\", \"colour\": \"SILVER\", \"fuelType\": \"PETROL\", \"postcode\": \"KT100QR\", \"yearOfManufacture\": 2005, \"registrationNumber\": \"KL05USC\"}','2026-04-07 18:14:32','2026-04-07 18:16:35',NULL,'yes','[{\"day\": \"9th\", \"slots\": [\"10-12 AM\"], \"weekday\": \"Thursday\", \"iso_date\": \"2026-04-09\"}]','paid','mock',259.67,'GBP'),(67,'89d3aca3-aaf5-4fd8-a250-08855a0332dd1775685464962',1,'{\"make\": \"TOYOTA\", \"model\": \"COROLLA\", \"colour\": \"SILVER\", \"fuelType\": \"PETROL\", \"postcode\": \"KT10 0QR\", \"yearOfManufacture\": 2005, \"registrationNumber\": \"KL05USC\"}','2026-04-08 21:57:55','2026-04-08 23:55:16',NULL,'yes','[{\"day\": \"11th\", \"slots\": [\"8-10 AM\"], \"weekday\": \"Saturday\", \"iso_date\": \"2026-04-11\"}]','paid','mock',174.00,'GBP');
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
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking_items`
--

LOCK TABLES `booking_items` WRITE;
/*!40000 ALTER TABLE `booking_items` DISABLE KEYS */;
INSERT INTO `booking_items` VALUES (1,1,12,0,NULL,525.00),(2,1,13,0,NULL,110.00),(3,2,1,0,NULL,675.00),(4,3,12,0,NULL,525.00),(5,3,13,0,NULL,110.00),(6,4,65,0,NULL,66.39),(7,5,68,0,NULL,152.86),(8,6,12,0,NULL,525.00),(9,7,111,0,NULL,95.00),(10,8,111,0,NULL,95.00),(11,9,111,0,NULL,95.00),(12,10,111,0,NULL,95.00),(13,11,118,0,NULL,66.39),(14,11,111,0,NULL,95.00),(15,12,12,0,NULL,525.00),(16,13,106,0,NULL,150.00),(17,13,124,0,NULL,66.39),(18,14,68,0,NULL,152.86),(19,15,70,0,NULL,50.00),(20,16,111,0,NULL,95.00),(21,16,70,0,NULL,50.00);
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
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking_offers`
--

LOCK TABLES `booking_offers` WRITE;
/*!40000 ALTER TABLE `booking_offers` DISABLE KEYS */;
INSERT INTO `booking_offers` VALUES (1,6,7,'accepted','2026-03-20 15:31:08','2026-03-20 19:36:31'),(2,7,7,'accepted','2026-03-21 21:06:42','2026-04-07 16:40:56'),(3,8,7,'accepted','2026-03-21 21:14:36','2026-04-07 17:23:37'),(4,9,7,'declined','2026-03-22 23:24:48','2026-04-05 00:52:09'),(5,11,7,'declined','2026-04-04 17:48:21','2026-04-05 00:50:47'),(6,12,7,'declined','2026-04-04 18:04:11','2026-04-05 00:31:09'),(7,13,7,'accepted','2026-04-07 18:16:34','2026-04-07 18:17:32'),(8,14,7,'declined','2026-04-08 22:08:01','2026-04-08 23:36:34'),(9,15,7,'declined','2026-04-08 23:40:28','2026-04-08 23:54:04'),(10,16,7,'declined','2026-04-08 23:55:16','2026-04-09 00:29:28');
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
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` VALUES (1,_binary 'õRïà_\Òâ\¬fHÇù<\Œ',8,NULL,5,3,NULL,'requested',NULL,NULL,635.00,127.00,762.00,'2026-03-12 22:05:40',NULL),(2,_binary '\›\Ò!Ä\Ò∫JaQ∏Sè',1,NULL,11,4,NULL,'requested',NULL,NULL,675.00,135.00,810.00,'2026-03-16 21:35:53','test'),(3,_binary 'åµ\Ï%!Ö\Ò∫JaQ∏Sè',1,NULL,14,4,NULL,'requested',NULL,NULL,635.00,127.00,762.00,'2026-03-16 22:14:50',NULL),(4,_binary 'Ñ\ÔNö!â\Ò∫JaQ∏Sè',9,NULL,16,5,NULL,'requested',NULL,NULL,66.39,13.28,79.67,'2026-03-16 22:43:14',NULL),(5,_binary 'é89c!ä\Ò∫JaQ∏Sè',10,NULL,17,6,NULL,'requested',NULL,NULL,152.86,30.57,183.43,'2026-03-16 22:50:40','Vehiculo estable'),(6,_binary '\—\Z\‡£$q\Òß4≤B\Î0',1,7,19,4,NULL,'completed',NULL,NULL,525.00,105.00,630.00,'2026-03-20 15:31:08','Nothing especial'),(7,_binary '\‹l\˜v%i\ÒòjJ\¬˚∂',1,7,28,4,NULL,'completed',NULL,NULL,95.00,19.00,114.00,'2026-03-21 21:06:42',NULL),(8,_binary '\˜:ß\‹%j\ÒòjJ\¬˚∂',1,7,28,4,NULL,'completed',NULL,NULL,95.00,19.00,114.00,'2026-03-21 21:14:36',NULL),(9,_binary 'Q\⁄n\Ú&F\Ò≥¨\Íç\Œ{/',1,NULL,36,4,NULL,'requested',NULL,NULL,95.00,19.00,114.00,'2026-03-22 23:24:48',NULL),(10,_binary 'M±∂>0M\Òå\’\Ó#I∑\“',1,NULL,39,4,NULL,'requested',NULL,NULL,95.00,19.00,114.00,'2026-04-04 17:39:59',NULL),(11,_binary 'xª∞\Â0N\Òå\’\Ó#I∑\“',1,NULL,41,4,NULL,'requested',NULL,NULL,161.39,32.28,193.67,'2026-04-04 17:48:21','Minor problems'),(12,_binary 'Æ£≠0P\Òå\’\Ó#I∑\“',1,NULL,42,4,NULL,'requested',NULL,NULL,525.00,105.00,630.00,'2026-04-04 18:04:11',NULL),(13,_binary '\ÈG\”2≠\Ò™\‘\‚Th®Z¯',1,7,44,4,NULL,'completed',NULL,NULL,216.39,43.28,259.67,'2026-04-07 18:16:34',NULL),(14,_binary 'hÄ+K3ó\Ò∑\ﬁ>≤\ƒ\Ï\Ê\·',1,NULL,45,4,NULL,'requested',NULL,NULL,152.86,30.57,183.43,'2026-04-08 22:08:01','General Revision'),(15,_binary 'S/@\ƒ3§\Ò∑\ﬁ>≤\ƒ\Ï\Ê\·',1,NULL,46,4,NULL,'in_progress',NULL,NULL,50.00,10.00,60.00,'2026-04-08 23:40:28',NULL),(16,_binary 'd7@3¶\Ò∑\ﬁ>≤\ƒ\Ï\Ê\·',1,NULL,47,4,NULL,'cancelled','Not Available','2026-04-09 00:29:28',145.00,29.00,174.00,'2026-04-08 23:55:16',NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact_messages`
--

LOCK TABLES `contact_messages` WRITE;
/*!40000 ALTER TABLE `contact_messages` DISABLE KEYS */;
INSERT INTO `contact_messages` VALUES (1,'Test User','test@example.com','Prueba','Mensaje de prueba desde contacto','closed','home_web','::ffff:172.18.0.1','Mozilla/5.0 (Windows NT 10.0; Microsoft Windows 10.0.26200; en-GB) PowerShell/7.5.4','2026-03-07 19:02:17','2026-04-11 22:44:10'),(2,'Angel Joseph Gomes Ballesteroz','zang17@hotmail.com','General Question','Test','in_progress','home_web','::ffff:172.18.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0','2026-04-11 21:32:24','2026-04-13 17:11:44');
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoices`
--

LOCK TABLES `invoices` WRITE;
/*!40000 ALTER TABLE `invoices` DISABLE KEYS */;
INSERT INTO `invoices` VALUES (1,6,7,1,'INV-20260407-00000006','2026-04-07 16:19:12','{\"totals\": {\"vat_eur\": 105, \"currency\": \"GBP\", \"parts_eur\": 0, \"total_eur\": 630, \"labour_eur\": 525, \"subtotal_eur\": 525}, \"parts_lines\": [], \"labour_lines\": [{\"amount_eur\": 525, \"description\": \"Alternator replacement\"}]}',NULL),(2,7,7,1,'INV-20260407-00000007','2026-04-07 16:42:23','{\"totals\": {\"vat_eur\": 19, \"currency\": \"GBP\", \"parts_eur\": 45, \"total_eur\": 114, \"labour_eur\": 50, \"subtotal_eur\": 95}, \"completion\": {\"photos\": [], \"added_parts\": [{\"amount_eur\": 45, \"description\": \"Break pads\"}]}, \"parts_lines\": [{\"amount_eur\": 45, \"description\": \"Break pads\"}], \"labour_lines\": [{\"amount_eur\": 95, \"description\": \"Air conditioning re-gas\"}]}',NULL),(3,8,7,1,'INV-20260407-00000008','2026-04-07 18:08:24','{\"totals\": {\"vat_eur\": 19, \"currency\": \"GBP\", \"parts_eur\": 0, \"total_eur\": 114, \"labour_eur\": 95, \"subtotal_eur\": 95}, \"completion\": {\"photos\": [], \"added_parts\": []}, \"parts_lines\": [], \"labour_lines\": [{\"amount_eur\": 95, \"description\": \"Air conditioning re-gas\"}]}',NULL),(4,13,7,1,'INV-20260407-00000013','2026-04-07 22:02:39','{\"totals\": {\"vat_eur\": 43.28, \"currency\": \"GBP\", \"parts_eur\": 35, \"total_eur\": 259.67, \"labour_eur\": 181.39, \"subtotal_eur\": 216.39}, \"completion\": {\"photos\": [\"/uploads/booking-completion/booking-13-1775599359059-870155929.png\", \"/uploads/booking-completion/booking-13-1775599359084-114505345.png\", \"/uploads/booking-completion/booking-13-1775599359087-603627127.png\"], \"added_parts\": [{\"amount_eur\": 35, \"description\": \"Break pads\"}]}, \"parts_lines\": [{\"amount_eur\": 35, \"description\": \"Break pads\"}], \"labour_lines\": [{\"amount_eur\": 150, \"description\": \"Bonnets\"}, {\"amount_eur\": 66.39, \"description\": \"Car Leaking Oil Inspection\"}]}',NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `login_two_factor_challenges`
--

LOCK TABLES `login_two_factor_challenges` WRITE;
/*!40000 ALTER TABLE `login_two_factor_challenges` DISABLE KEYS */;
INSERT INTO `login_two_factor_challenges` VALUES (1,1,'cd7f4420c809b57e2cd842a942780d4ebb5455fb52a0385e66985ea011ce88a0','$2a$10$VdmWRtK2.lE2Tn4CfS1f8uC1WwTzMchvBnGqZA2bs.cxzn7NxbDoe','2026-04-08 17:28:34','2026-04-08 17:21:11','2026-04-08 17:18:33'),(2,1,'057a3b85c1321a6f71067604cfb5d42a53668dcc49f5ec1616c591bd9d054581','$2a$10$asI8YiNVneMjDrhfJhHl..8.eXDtmrWguA.TWno3qKrKETl6nraVW','2026-04-08 22:08:24',NULL,'2026-04-08 21:58:24'),(3,1,'0f5080612f4f5d76deda0f4a51c857e71ad356da8007660b9a02b825e372c5d6','$2a$10$/uKoPyZ78KHNf9YoRS92DOiF5Dpr54Hhzs2H2CIe5umLoj13FT6Ge','2026-04-08 22:08:50',NULL,'2026-04-08 21:58:50'),(4,1,'b0e4817b30ac012da99a63482959923580303aef48067428b63c9226e7022ad5','$2a$10$SidmOuB4dflhAhjNN9pqLuuibjanMPtaqbQNntpOBN21T5o5uUJmy','2026-04-08 22:15:41','2026-04-08 22:06:01','2026-04-08 22:05:40'),(5,1,'33640381b1cff54fbce27f9f7d7111ae411c8ebe7f81955e6535a5cf1d46aa86','$2a$10$H/642VhRhwVQH//bL1znDO0j0nVVOmIbgud7JRsqAp1CYvCYWfTkK','2026-04-09 17:26:27','2026-04-09 17:17:53','2026-04-09 17:16:26'),(6,1,'bd2c7ccba96d4b8a3175cbdaa778fcd0419bfa10a5d6d23bd44813fc47fee584','$2a$10$4a8//Jck.ODB/NaO.ns40eTocVydTjKZ7HQkBd4Yub4AQAxH7X5vK','2026-04-10 19:18:35','2026-04-10 19:09:16','2026-04-10 19:08:34'),(7,1,'860113d4decda08aeb566426a9bf1085c3ef44a1c01b7349e00aa0082dd90b2a','$2a$10$3O7AOcfRRaxKIK6BZ7xpoODThiqCQo2KHag3RFbyyWNrX1s4ehnp6','2026-04-10 21:59:58','2026-04-10 21:50:34','2026-04-10 21:49:58'),(8,7,'d72f4f298f71b6ec9bd79a6b926cb1e2f59ca820c50fe46748359d562e420797','$2a$10$NhaUDUb54Z7A9Yd.KiuR6ef6AmCHjGK1kqmb0M6oD0ncjIEFswFFS','2026-04-11 11:50:06','2026-04-11 11:40:34','2026-04-11 11:40:05'),(9,1,'c127dd1bfdf2b47b94cd54fcafce392340173bb74834b430536b0f47c7b7b744','$2a$10$5t4UVr6179Z5bqXATf/2EuwGLcwwaNfvSiVD.9sJkrYi2e1YxxiJu','2026-04-11 14:19:18','2026-04-11 14:09:33','2026-04-11 14:09:18'),(10,2,'83eca316c1203b14f92802b3e3e4aaf3ffa74a15bc76bbd2db72090eec1a3df2','$2a$10$7NvMbmMUMZd0ieaJgZdlr.PD7TmY5Q4Viu7E.iDwTiI.SJJJYb/Oe','2026-04-11 21:42:45','2026-04-11 21:33:26','2026-04-11 21:32:44'),(11,2,'ba2fe74255f213257e80ab3b49903e5e807473f7310aa47dc3e182b2e418febb','$2a$10$MxVyK6mtnzhJ1U3Lc8fK6eSa0izgTSylqcgdW5EwYLPcLGOnfhwyi','2026-04-12 11:01:06','2026-04-12 10:51:34','2026-04-12 10:51:06'),(12,1,'e979d453b3b625783e0d087afbe03d5e6e870667e90cc58ab0b9931ede45fc6c','$2a$10$4cJMP8Crzr3IB8Aab1b1Fu3IBFj8nwJyJgobg2cjiBCKKB7MFBjgG','2026-04-12 12:20:22','2026-04-12 12:10:59','2026-04-12 12:10:22'),(13,1,'2e1205de953e9772197ff57fe75c4b9f78abb312d8cb26e483990cc6c07b3b3b','$2a$10$UppHk9Gu94UIWOtIluHsZuxI3bt46/iYfk3BTZyNdcyKmgeY5SzZW','2026-04-13 18:47:50','2026-04-13 18:38:26','2026-04-13 18:37:49'),(14,1,'6b0f0174a45d8adfe5b24c78d582a31853e63af8a1b8455aedee029eff811516','$2a$10$..eG/Z5VIqg0hKKe1086w.pzrEyGK5d0SZz1C.z8o72u9t9qF0OFy','2026-04-14 16:41:06',NULL,'2026-04-14 16:31:06'),(15,1,'5e3f113cf01e1634c2584d97d41ef7ece3d5eb730248f5dba88244d1c7a1c9d9','$2a$10$wU38Y5ez6zT4e/VkBx4ebOAAjOiL2Wpg1EQci8DSlNXb7wPiqWFvO','2026-04-14 16:43:07',NULL,'2026-04-14 16:33:07'),(16,1,'9d9973253e24567251380e27a1bab0159b544511a0876a6d856ab4cfb12c5435','$2a$10$Rvls..rCn7VIq0m72wRTo.1CCgLfQPLYyiBIg8zC.dOo8wdsQF2Fa','2026-04-14 16:44:04',NULL,'2026-04-14 16:34:04'),(17,1,'5ca6d58c33e16861381a2663bbf8d0b3707e4485fcfcf81978c5df75d8d14452','$2a$10$0PjreMM7lRY3CzaPnt3Xs..b01xFNNtNkdX7oduPU7BC4H9ZVm1q.','2026-04-14 16:47:30',NULL,'2026-04-14 16:37:30'),(18,2,'4e9ff75b2f53445398bb90a5728e779d5cf62a323941ef43f1e63f462e0820d5','$2a$10$l9c4FFq0slDEso/wt/2ctOTPzpvOsjc3.x0VXnPBqnmMfF/yDfq.G','2026-04-14 16:49:46',NULL,'2026-04-14 16:39:45'),(19,1,'160182e4a35dead566e5868744ac1db01176ddc86b2ecbaed8deacd6f81765c0','$2a$10$ftR6y97QGk9ZHDGrKzufjeArjC1TG6b0dxfUp38Aa.5RjcTPSDeOy','2026-04-14 16:54:15',NULL,'2026-04-14 16:44:14'),(20,1,'e4a600ab3cb669f9581751f1eb922dcbb829080151493c4ce6cffe9a3796449f','$2a$10$EBH8OsS4cNkNM12mci06h.tR3RVbaXJQIHHOamzn24.ccKCNOgJXm','2026-04-14 16:58:09',NULL,'2026-04-14 16:48:09'),(21,1,'3d5a488dbb89e0fcdf876fd40d25e1ed4b9098e25c274b2feaa654df43d568b7','$2a$10$2u0zkmFsgzvoLgjRDytYgeaWTqAMosXXyH7udi2cAt6gGkcd5nFW6','2026-04-14 17:15:09',NULL,'2026-04-14 17:05:08'),(22,1,'1efc0023ced8e377eeaa7a87708ec9a821f9e93fbe478b690de2ef1d5ae71fdf','$2a$10$2vHXWRcNt4iAfb8p7jLd1OevM4YxcgI8aGnsHdORDqEF1Cs9K6g.m','2026-04-14 17:15:52',NULL,'2026-04-14 17:05:52'),(23,1,'99172cb6287f4829caad720da1b5a3956724ff0e5762cb0240ba957b67a69212','$2a$10$ZsaT2r12zneXA32Hbd0p5OGZBhX8iy/Z3DCdrS0rA2gdQuMBaAcr.','2026-04-14 17:16:53',NULL,'2026-04-14 17:06:52'),(24,1,'7eda24dc442df65958560707460ed2631cfae2a784959e63f37fb90f4f54b104','$2a$10$aKnlqWvdBztl2adq0g3EUOmJoDEEqewRx18Stj4oXwmpEXzCCKQiC','2026-04-14 17:18:48',NULL,'2026-04-14 17:08:47'),(25,1,'e4071ad1906d7c445b114f114147691258639d53a5b02001b52b154eae5b2a01','$2a$10$L3Sw1rpNIjogCnCJ0gU0IOx1lIPqKkZ2OKk0LueXjeP5JaSJn6l3C','2026-04-14 17:30:40',NULL,'2026-04-14 17:20:40'),(26,1,'1d50ed79b4d1a0982af2867e718fd03067fc5eef891d43bf081d62c049c728f4','$2a$10$oFVTDcvoLsxoCs8865QfKuQMgQsAchE7tBAcQeLzUE6Up/nMXaAuq','2026-04-14 17:35:20',NULL,'2026-04-14 17:25:20'),(27,1,'8ad51e5983a9d7712d620ff7c4eeeafff6eb0a8e9b3a8b475b6909fd325069b1','$2a$10$m1ibt54x5TqYioW3t.JF5eOeWiYlK/LANlnFZgwNUAGJuI8p7g25u','2026-04-14 18:18:26',NULL,'2026-04-14 18:08:25'),(28,1,'3838bce255583e4cde2b80b2bb32309916e0559d0d830e834729ec419f8c8d40','$2a$10$vpIuB5z.WJ56Ij7GKsQUDum7G0fw41qPH0qUxMwlvUdzrz7WU8m12','2026-04-14 18:31:16',NULL,'2026-04-14 18:21:16'),(29,1,'d51153902b511b3d7cca3d3263ea96dbe2ef58e3122d4e07f69c4400fac0f498','$2a$10$rxj7VhMMTX400Ev8QmhFTuXCd0k.tNZX8vHcz7RatmoKWHXd.Wokq','2026-04-14 18:35:51',NULL,'2026-04-14 18:25:51');
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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mechanic_accreditations`
--

LOCK TABLES `mechanic_accreditations` WRITE;
/*!40000 ALTER TABLE `mechanic_accreditations` DISABLE KEYS */;
INSERT INTO `mechanic_accreditations` VALUES (1,7,'ATA Level 2','2026-04-10 18:41:18');
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
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mechanic_documents`
--

LOCK TABLES `mechanic_documents` WRITE;
/*!40000 ALTER TABLE `mechanic_documents` DISABLE KEYS */;
INSERT INTO `mechanic_documents` VALUES (1,12,'Screenshot 2025-03-24 215133.png','/uploads/mechanic-documents/mechanic-doc-1774369582046-58825347.png','image/png',173008,'2026-03-24 16:26:22'),(2,12,'Screenshot 2025-03-24 215133.png','/uploads/mechanic-documents/mechanic-doc-1774369599780-631726428.png','image/png',173008,'2026-03-24 16:26:39'),(3,12,'Report template headings revised 2025.pdf','/uploads/mechanic-documents/mechanic-doc-1774369921853-674400607.pdf','application/pdf',56803,'2026-03-24 16:32:01'),(5,7,'marking-criteria-FYP2025.pdf','/uploads/mechanic-documents/mechanic-doc-1775829545228-184181004.pdf','application/pdf',150852,'2026-04-10 13:59:05'),(6,7,'marking-criteria-FYP2025.pdf','/uploads/mechanic-documents/mechanic-doc-1775829656987-719879941.pdf','application/pdf',150852,'2026-04-10 14:00:56'),(7,7,'CW2 Assessment Brief .pdf','/uploads/mechanic-documents/mechanic-doc-1775832078650-232887541.pdf','application/pdf',284180,'2026-04-10 14:41:18');
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
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mechanic_memberships`
--

LOCK TABLES `mechanic_memberships` WRITE;
/*!40000 ALTER TABLE `mechanic_memberships` DISABLE KEYS */;
INSERT INTO `mechanic_memberships` VALUES (8,12,'rmif','2026-03-24 15:54:58'),(10,7,'imI','2026-04-10 18:41:18'),(11,7,'RAC Approved Garage','2026-04-10 18:41:18');
/*!40000 ALTER TABLE `mechanic_memberships` ENABLE KEYS */;
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
  `vat_id` varchar(32) DEFAULT NULL,
  `is_mobile` tinyint(1) NOT NULL DEFAULT '1',
  `rating_avg` decimal(3,2) NOT NULL DEFAULT '0.00',
  `jobs_done` int NOT NULL DEFAULT '0',
  `about` text,
  `website_url` varchar(255) DEFAULT NULL,
  `has_trade_insurance` tinyint(1) DEFAULT NULL,
  `has_public_liability` tinyint(1) DEFAULT NULL,
  `vat_registered` tinyint(1) DEFAULT NULL,
  `business_type` varchar(64) DEFAULT NULL,
  `application_type` varchar(64) DEFAULT NULL,
  `lead_postcode` varchar(16) DEFAULT NULL,
  `application_status` varchar(64) DEFAULT NULL,
  `account_status` varchar(64) DEFAULT NULL,
  `password_set_at` datetime DEFAULT NULL,
  `travel_radius_miles` int DEFAULT NULL,
  `availability_pref` varchar(32) DEFAULT NULL,
  `referral_source` varchar(64) DEFAULT NULL,
  `years_experience` int DEFAULT NULL,
  `work_history` text,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `fk_mp_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mechanic_profiles`
--

LOCK TABLES `mechanic_profiles` WRITE;
/*!40000 ALTER TABLE `mechanic_profiles` DISABLE KEYS */;
INSERT INTO `mechanic_profiles` VALUES (7,'Ramon Garcia','Ramon Garcia',NULL,1,4.50,0,NULL,NULL,1,1,1,'generalist',NULL,NULL,'approved','password_pending',NULL,15,'low','search',5,'independent_garage'),(12,'Pedro Perez','Pedro Perez',NULL,1,0.00,0,NULL,'https://www.perosky.com',1,0,1,'garage_based_mechanic',NULL,NULL,'approved','password_pending',NULL,5,NULL,'twitter',6,NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mechanic_qualifications`
--

LOCK TABLES `mechanic_qualifications` WRITE;
/*!40000 ALTER TABLE `mechanic_qualifications` DISABLE KEYS */;
INSERT INTO `mechanic_qualifications` VALUES (1,1,'NVQ Level 3','2026-02-08 21:58:31'),(2,1,'NVQ Level 3','2026-02-08 22:01:11'),(10,12,'iml_level_1','2026-03-24 15:54:58'),(11,12,'city_guilds_level_1','2026-03-24 15:54:58'),(15,7,'iml_level_1','2026-04-10 18:41:18'),(16,7,'NVQ Level 3','2026-04-10 18:41:18');
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
) ENGINE=InnoDB AUTO_INCREMENT=250 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mechanic_services`
--

LOCK TABLES `mechanic_services` WRITE;
/*!40000 ALTER TABLE `mechanic_services` DISABLE KEYS */;
INSERT INTO `mechanic_services` VALUES (167,7,118,NULL,1),(168,7,119,NULL,1),(169,7,120,NULL,1),(170,7,122,NULL,1),(171,7,124,NULL,1),(172,7,125,NULL,1),(173,7,126,NULL,1),(174,7,123,NULL,1),(175,7,127,NULL,1),(176,7,65,NULL,1),(177,7,128,NULL,1),(178,7,129,NULL,1),(179,7,130,NULL,1),(180,7,132,NULL,1),(181,7,131,NULL,1),(182,7,133,NULL,1),(183,7,134,NULL,1),(184,7,135,NULL,1),(185,7,136,NULL,1),(186,7,137,NULL,1),(187,7,138,NULL,1),(188,7,139,NULL,1),(189,7,140,NULL,1),(190,7,142,NULL,1),(191,7,141,NULL,1),(192,7,143,NULL,1),(193,7,144,NULL,1),(194,7,145,NULL,1),(195,7,146,NULL,1),(196,7,147,NULL,1),(197,7,66,NULL,1),(198,7,148,NULL,1),(199,7,121,NULL,1),(200,7,149,NULL,1),(201,7,151,NULL,1),(202,7,150,NULL,1),(203,7,152,NULL,1),(204,7,153,NULL,1),(205,7,154,NULL,1),(206,7,155,NULL,1),(207,7,156,NULL,1),(208,7,157,NULL,1),(209,7,158,NULL,1),(210,7,159,NULL,1),(211,7,160,NULL,1),(212,7,7,NULL,1),(213,7,101,NULL,1),(214,7,74,NULL,1),(215,7,72,NULL,1),(216,7,73,NULL,1),(217,7,10,NULL,1),(218,7,111,NULL,1),(219,7,12,NULL,1),(220,7,104,NULL,1),(221,7,13,NULL,1),(222,7,105,NULL,1),(223,7,106,NULL,1),(224,7,2,NULL,1),(225,7,3,NULL,1),(226,7,4,NULL,1),(227,7,5,NULL,1),(228,7,1,NULL,1),(229,7,15,NULL,1),(230,7,107,NULL,1),(231,7,109,NULL,1),(232,7,108,NULL,1),(233,7,115,NULL,1),(234,7,112,NULL,1),(235,7,8,NULL,1),(236,7,14,NULL,1),(237,7,16,NULL,1),(238,7,6,NULL,1),(239,7,113,NULL,1),(240,7,114,NULL,1),(241,7,11,NULL,1),(242,7,116,NULL,1),(243,7,110,NULL,1),(244,7,117,NULL,1),(245,7,68,NULL,0),(246,7,69,NULL,0),(247,7,67,NULL,0),(248,7,70,NULL,1),(249,7,102,NULL,1);
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
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mechanic_services_offered`
--

LOCK TABLES `mechanic_services_offered` WRITE;
/*!40000 ALTER TABLE `mechanic_services_offered` DISABLE KEYS */;
INSERT INTO `mechanic_services_offered` VALUES (16,12,'mobile_service','2026-03-24 15:54:58'),(17,12,'customer_drop','2026-03-24 15:54:58'),(18,12,'mot_testing','2026-03-24 15:54:58'),(19,12,'tyre_fitting','2026-03-24 15:54:58'),(22,7,'mobile_mechanic_service','2026-04-10 22:24:49');
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
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_requests`
--

LOCK TABLES `password_reset_requests` WRITE;
/*!40000 ALTER TABLE `password_reset_requests` DISABLE KEYS */;
INSERT INTO `password_reset_requests` VALUES (1,1,'3ced3ad9d83e042a751f11912cb4923ff4ffa366a22e8392','2026-02-08 21:10:47','2026-02-08 20:10:46'),(2,1,'2d6779df444823c0b54abdcdb2617f7a4f7c14f9df0432d6','2026-02-08 21:16:33','2026-02-08 20:16:32'),(3,1,'2a8eb32751b998b7e9a9fd9e77ecf5618615319cf2c0ac9e','2026-02-08 21:18:22','2026-02-08 20:18:22'),(6,1,'293fa1f186c96584d0d9fb5ee5de89461333a09cd3b72fc2','2026-02-28 02:08:34','2026-02-28 01:08:34'),(9,1,'14485c1840e784a42e2cbf143987cab51a3d96dc60adce69','2026-02-28 02:20:18','2026-02-28 01:20:18');
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resolution_case_messages`
--

LOCK TABLES `resolution_case_messages` WRITE;
/*!40000 ALTER TABLE `resolution_case_messages` DISABLE KEYS */;
INSERT INTO `resolution_case_messages` VALUES (1,3,7,'Hi this is a test','2026-03-20 20:30:45'),(2,3,1,'Gracias por la ayuda','2026-03-20 20:45:19'),(3,3,1,'Prueba','2026-04-02 11:03:14'),(4,3,1,'Prueba','2026-04-07 15:50:40'),(5,4,1,'Prueba','2026-04-08 18:21:50'),(6,5,1,'Esto es una preueba','2026-04-08 19:25:16'),(7,6,1,'Prueba','2026-04-08 19:31:09'),(8,4,1,'Prueba','2026-04-08 19:34:15'),(9,4,1,'Pruebba','2026-04-08 19:37:44'),(10,6,1,'Prueba','2026-04-08 19:47:24'),(11,5,1,'Prueba','2026-04-08 19:53:26'),(12,7,1,'Prueba','2026-04-08 19:59:42'),(13,4,1,'Prueba','2026-04-08 20:08:37'),(14,4,1,'Prueba','2026-04-08 20:29:14'),(15,3,2,'Prueba','2026-04-12 17:11:11'),(16,3,1,'Test','2026-04-12 17:13:32');
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
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resolution_cases`
--

LOCK TABLES `resolution_cases` WRITE;
/*!40000 ALTER TABLE `resolution_cases` DISABLE KEYS */;
INSERT INTO `resolution_cases` VALUES (3,6,7,1,'general','General Enquiry',1,'6/1','in_progress','2026-03-20 20:26:29','2026-04-13 17:01:42'),(4,6,7,1,'complaint','Complaint',2,'6/2','open','2026-03-22 12:53:56','2026-03-22 12:53:56'),(5,13,7,1,'complaint','Complaint',1,'00000013/1','open','2026-04-08 19:25:16','2026-04-08 19:25:16'),(6,8,7,1,'complaint','Complaint',1,'00000008/1','closed','2026-04-08 19:31:09','2026-04-13 17:01:53'),(7,13,7,1,'general','General Enquiry',2,'00000013/2','open','2026-04-08 19:53:47','2026-04-08 19:53:47'),(8,8,7,1,'general','General Enquiry',2,'00000008/2','open','2026-04-09 01:15:30','2026-04-12 17:10:54');
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
INSERT INTO `reviews` VALUES (1,7,1,7,5,'Very good','2026-04-09 01:25:27'),(2,8,1,7,4,'Amazing Job.','2026-04-10 22:35:48');
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
) ENGINE=InnoDB AUTO_INCREMENT=162 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `service_catalog`
--

LOCK TABLES `service_catalog` WRITE;
/*!40000 ALTER TABLE `service_catalog` DISABLE KEYS */;
INSERT INTO `service_catalog` VALUES (1,'repair_clutch_replacement','Clutch replacement','repair','repairs','clutch_and_controls',210,'Vehicles with a manual gearbox only',300),(2,'repair_brake_discs_pads_front','Brake discs & pads replacement - front (both)','repair','repairs','brakes',110,NULL,180),(3,'repair_brake_discs_pads_rear','Brake discs & pads replacement - rear (both)','repair','repairs','brakes',120,NULL,180),(4,'repair_brake_pads_front','Brake pads replacement - front (all)','repair','repairs','brakes',130,NULL,90),(5,'repair_brake_pads_rear','Brake pads replacement - rear (all)','repair','repairs','brakes',140,NULL,90),(6,'repair_timing_chain','Timing chain replacement','repair','repairs','engines',310,NULL,420),(7,'diagnostic_inspection','Diagnostic inspection','diagnostics','diagnostics','general',610,NULL,60),(8,'repair_oil_filter','Engine oil & filter replacement','repair','repairs','engines',320,NULL,90),(10,'mot_collection_delivery','MOT with collection & delivery','repair','mots','mots',30,NULL,90),(11,'repair_water_pump','Water pump replacement','repair','repairs','cooling_systems',410,NULL,240),(12,'repair_alternator','Alternator replacement','repair','repairs','engine_management_ignitions',510,NULL,210),(13,'repair_aux_belt','Auxiliary drive belt replacement','repair','repairs','engines',330,NULL,60),(14,'repair_shock_absorbers_front','Shock absorbers replacement - front (pair)','repair','repairs','suspensions',710,NULL,180),(15,'repair_coil_spring_front','Coil spring replacement - front (both)','repair','repairs','suspensions',720,NULL,180),(16,'repair_starter_motor','Starter motor replacement','repair','repairs','engine_management_ignitions',520,NULL,150),(65,'diag_car_wont_start','Car won\'t start inspection','diagnostics','diagnostics','general',620,NULL,60),(66,'diag_plugin_inspection','Plug-in diagnostic inspection','diagnostics','diagnostics','general',630,NULL,60),(67,'service_major','Major Service','service','services','services',410,NULL,240),(68,'service_full','Full Service','service','services','services',420,NULL,180),(69,'service_interim','Interim Service','service','services','services',430,NULL,120),(70,'service_vehicle_health','Vehicle Health Check','inspection','inspections','inspections',705,'Only ¬£30 when booked with other work',45),(72,'inspection_premium','Premium Pre-purchase Inspection','inspection','inspections','inspections',710,NULL,180),(73,'inspection_standard','Standard Pre-purchase Inspection','inspection','inspections','inspections',720,NULL,150),(74,'inspection_basic','Basic Pre-purchase Inspection','inspection','inspections','inspections',730,NULL,120),(101,'ev_charger_installation','EV Charger installation','ev','ev_chargers','ev_chargers',10,NULL,240),(102,'tyre_fitting','Tyre fitting','tyres','tyres','tyres',510,NULL,60),(104,'repair_automatic_transmission_service','Automatic transmission, housing & fluid systems','repair','repairs','automatic_transmissions',60,NULL,180),(105,'repair_body_centre_interior_trim','Interior/Seats/Seatbelts','repair','repairs','body_centre_sections',70,NULL,120),(106,'repair_body_front_bonnet','Bonnets','repair','repairs','body_front_sections',80,NULL,90),(107,'repair_driveshaft_replacement','Driveshaft replacement','repair','repairs','driveshafts_propshafts_differentials',420,NULL,210),(108,'repair_fuel_pump_replacement','Fuel pump replacement','repair','repairs','engine_management_fuels',500,NULL,180),(109,'repair_exhaust_silencer_replacement','Exhaust silencer replacement','repair','repairs','exhaust_systems',530,NULL,120),(110,'repair_window_regulator','Window regulator replacement','repair','repairs','general_electrics',540,NULL,120),(111,'repair_air_conditioning_regas','Air conditioning re-gas','repair','repairs','heating_air_conditionings',550,NULL,60),(112,'repair_manual_gearbox_service','Manual gearbox service','repair','repairs','manual_transmissions',560,NULL,120),(113,'repair_track_rod_end','Track rod end replacement','repair','repairs','steerings',570,NULL,90),(114,'repair_turbocharger_replacement','Turbocharger replacement','repair','repairs','turbocharger_intercoolers',730,NULL,300),(115,'repair_locking_wheel_nut_removal','Locking wheel nut removal (one)','repair','repairs','vehicle_securities',740,NULL,45),(116,'repair_wheel_bearing_front','Front wheel bearing replacement','repair','repairs','wheel_bearings',750,NULL,150),(117,'repair_wing_mirror_glass','Wing mirror glass replacement','repair','repairs','wing_mirrors',760,NULL,60),(118,'diag_abs_warning_light','ABS Warning Light Inspection','diagnostics','diagnostics','general',631,NULL,60),(119,'diag_air_conditioning_system','Air conditioning system inspection','diagnostics','diagnostics','general',632,NULL,60),(120,'diag_battery_warning_light','Battery Warning Light Inspection','diagnostics','diagnostics','general',633,NULL,60),(121,'diag_pulls_left_right','Pulling System Inspection','diagnostics','diagnostics','general',634,NULL,60),(122,'diag_bulb_failure','Bulb Failure Inspection','diagnostics','diagnostics','general',635,NULL,60),(123,'diag_car_smoking','Car Smoking Inspection','diagnostics','diagnostics','general',636,NULL,60),(124,'diag_car_leaking_oil','Car Leaking Oil Inspection','diagnostics','diagnostics','general',637,NULL,60),(125,'diag_car_overheating','Car Overheating Inspection','diagnostics','diagnostics','general',638,NULL,60),(126,'diag_car_shuddering','Car Shuddering/Vibrating Inspection','diagnostics','diagnostics','general',639,NULL,60),(127,'diag_car_steering','Car Steering Inspection','diagnostics','diagnostics','general',640,NULL,60),(128,'diag_catalytic_converter','Catalytic Converter Inspection','diagnostics','diagnostics','general',641,NULL,60),(129,'diag_central_locking','Central Locking Inspection','diagnostics','diagnostics','general',642,NULL,60),(130,'diag_convertible_roof','Convertible roof fault diagnostic','diagnostics','diagnostics','general',643,NULL,60),(131,'diag_cooling_system','Cooling System Inspection','diagnostics','diagnostics','general',644,NULL,60),(132,'diag_cooling_heating','Cooling and Heating Inspection','diagnostics','diagnostics','general',645,NULL,60),(133,'diag_cruise_control','Cruise Control Inspection','diagnostics','diagnostics','general',646,NULL,60),(134,'diag_door_open','Door Open Inspection','diagnostics','diagnostics','general',647,NULL,60),(135,'diag_electronic_throttle','Electronic Throttle Control Inspection','diagnostics','diagnostics','general',648,NULL,60),(136,'diag_engine_warning_light','Engine Warning Light Inspection','diagnostics','diagnostics','general',649,NULL,60),(137,'diag_fuel_filler_cap','Fuel Filler Cap Inspection','diagnostics','diagnostics','general',650,NULL,60),(138,'diag_gear_selector_transmission','Gear Selector And Transmission Inspection','diagnostics','diagnostics','general',651,NULL,60),(139,'diag_handbrake','Handbrake Inspection','diagnostics','diagnostics','general',652,NULL,60),(140,'diag_noise_all_speeds','Noise At All Speeds Inspection','diagnostics','diagnostics','general',653,NULL,60),(141,'diag_noise_low_speeds','Noise At Slow Speeds Inspection','diagnostics','diagnostics','general',654,NULL,60),(142,'diag_noise_inside_car','Noise Inside Car Inspection','diagnostics','diagnostics','general',655,NULL,60),(143,'diag_noise_under_bonnet','Noise Under Bonnet Inspection','diagnostics','diagnostics','general',656,NULL,60),(144,'diag_noise_when_braking','Noise When Braking Inspection','diagnostics','diagnostics','general',657,NULL,60),(145,'diag_noise_when_starting','Noise When Starting Inspection','diagnostics','diagnostics','general',658,NULL,60),(146,'diag_oil_level_pressure','Oil Level And Pressure Inspection','diagnostics','diagnostics','general',659,NULL,60),(147,'diag_overdrive','Overdrive Inspection','diagnostics','diagnostics','general',660,NULL,60),(148,'diag_power_steering','Power Steering Inspection','diagnostics','diagnostics','general',661,NULL,60),(149,'diag_reduced_engine_power','Reduced Engine Power Inspection','diagnostics','diagnostics','general',662,NULL,60),(150,'diag_srs_airbag','SRS/Airbags Inspection','diagnostics','diagnostics','general',663,NULL,60),(151,'diag_seatbelts','Seatbelts Inspection','diagnostics','diagnostics','general',664,NULL,60),(152,'diag_suspension','Suspension Inspection','diagnostics','diagnostics','general',665,NULL,60),(153,'diag_suspension_noise','Suspension Noise Inspection','diagnostics','diagnostics','general',666,NULL,60),(154,'diag_traction_control','Traction Control Inspection','diagnostics','diagnostics','general',667,NULL,60),(155,'diag_transmission_fluid_temp','Transmission Fluid Temperature Inspection','diagnostics','diagnostics','general',668,NULL,60),(156,'diag_tyre_pressure_warning','Tyre pressure warning light inspection (TPMS)','diagnostics','diagnostics','general',669,NULL,60),(157,'diag_warning_light','Warning Light Inspection','diagnostics','diagnostics','general',670,NULL,60),(158,'diag_washer_system','Washer System Inspection','diagnostics','diagnostics','general',671,NULL,60),(159,'diag_water_car','Water Coming into Car Inspection','diagnostics','diagnostics','general',672,NULL,60),(160,'diag_windows','Windows Inspection','diagnostics','diagnostics','general',673,NULL,60);
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
) ENGINE=InnoDB AUTO_INCREMENT=106 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `service_pricing`
--

LOCK TABLES `service_pricing` WRITE;
/*!40000 ALTER TABLE `service_pricing` DISABLE KEYS */;
INSERT INTO `service_pricing` VALUES (1,1,'UK-default',675.00,0.00,0.00,20.00),(2,2,'UK-default',300.00,0.00,0.00,20.00),(3,3,'UK-default',270.00,0.00,0.00,20.00),(4,4,'UK-default',145.00,0.00,0.00,20.00),(5,5,'UK-default',135.00,0.00,0.00,20.00),(6,6,'UK-default',1150.00,0.00,0.00,20.00),(7,7,'UK-default',60.00,0.00,0.00,20.00),(8,8,'UK-default',155.00,0.00,0.00,20.00),(10,10,'UK-default',90.00,0.00,0.00,20.00),(11,11,'UK-default',350.00,0.00,0.00,20.00),(12,12,'UK-default',525.00,0.00,0.00,20.00),(13,13,'UK-default',110.00,0.00,0.00,20.00),(14,14,'UK-default',325.00,0.00,0.00,20.00),(15,15,'UK-default',300.00,0.00,0.00,20.00),(16,16,'UK-default',375.00,0.00,0.00,20.00),(34,65,'UK-default',66.39,0.00,0.00,20.00),(35,66,'UK-default',66.39,0.00,0.00,20.00),(36,67,'UK-default',208.25,0.00,0.00,20.00),(37,68,'UK-default',152.86,0.00,0.00,20.00),(38,69,'UK-default',123.45,0.00,0.00,20.00),(39,70,'UK-default',50.00,0.00,0.00,20.00),(41,72,'UK-default',163.95,0.00,0.00,20.00),(42,73,'UK-default',114.29,0.00,0.00,20.00),(43,74,'UK-default',94.87,0.00,0.00,20.00),(44,101,'UK-default',399.00,0.00,0.00,20.00),(45,102,'UK-default',85.00,0.00,0.00,20.00),(47,104,'UK-default',280.00,0.00,0.00,20.00),(48,105,'UK-default',120.00,0.00,0.00,20.00),(49,106,'UK-default',150.00,0.00,0.00,20.00),(50,107,'UK-default',310.00,0.00,0.00,20.00),(51,108,'UK-default',240.00,0.00,0.00,20.00),(52,109,'UK-default',180.00,0.00,0.00,20.00),(53,110,'UK-default',165.00,0.00,0.00,20.00),(54,111,'UK-default',95.00,0.00,0.00,20.00),(55,112,'UK-default',210.00,0.00,0.00,20.00),(56,113,'UK-default',140.00,0.00,0.00,20.00),(57,114,'UK-default',690.00,0.00,0.00,20.00),(58,115,'UK-default',55.00,0.00,0.00,20.00),(59,116,'UK-default',260.00,0.00,0.00,20.00),(60,117,'UK-default',95.00,0.00,0.00,20.00),(62,118,'UK-default',66.39,0.00,0.00,20.00),(63,119,'UK-default',66.39,0.00,0.00,20.00),(64,120,'UK-default',66.39,0.00,0.00,20.00),(65,122,'UK-default',66.39,0.00,0.00,20.00),(66,124,'UK-default',66.39,0.00,0.00,20.00),(67,125,'UK-default',66.39,0.00,0.00,20.00),(68,126,'UK-default',66.39,0.00,0.00,20.00),(69,123,'UK-default',66.39,0.00,0.00,20.00),(70,127,'UK-default',66.39,0.00,0.00,20.00),(71,128,'UK-default',66.39,0.00,0.00,20.00),(72,129,'UK-default',66.39,0.00,0.00,20.00),(73,130,'UK-default',66.39,0.00,0.00,20.00),(74,132,'UK-default',66.39,0.00,0.00,20.00),(75,131,'UK-default',66.39,0.00,0.00,20.00),(76,133,'UK-default',66.39,0.00,0.00,20.00),(77,134,'UK-default',66.39,0.00,0.00,20.00),(78,135,'UK-default',66.39,0.00,0.00,20.00),(79,136,'UK-default',66.39,0.00,0.00,20.00),(80,137,'UK-default',66.39,0.00,0.00,20.00),(81,138,'UK-default',66.39,0.00,0.00,20.00),(82,139,'UK-default',66.39,0.00,0.00,20.00),(83,140,'UK-default',66.39,0.00,0.00,20.00),(84,142,'UK-default',66.39,0.00,0.00,20.00),(85,141,'UK-default',66.39,0.00,0.00,20.00),(86,143,'UK-default',66.39,0.00,0.00,20.00),(87,144,'UK-default',66.39,0.00,0.00,20.00),(88,145,'UK-default',66.39,0.00,0.00,20.00),(89,146,'UK-default',66.39,0.00,0.00,20.00),(90,147,'UK-default',66.39,0.00,0.00,20.00),(91,148,'UK-default',66.39,0.00,0.00,20.00),(92,121,'UK-default',66.39,0.00,0.00,20.00),(93,149,'UK-default',66.39,0.00,0.00,20.00),(94,151,'UK-default',66.39,0.00,0.00,20.00),(95,150,'UK-default',66.39,0.00,0.00,20.00),(96,152,'UK-default',66.39,0.00,0.00,20.00),(97,153,'UK-default',66.39,0.00,0.00,20.00),(98,154,'UK-default',66.39,0.00,0.00,20.00),(99,155,'UK-default',66.39,0.00,0.00,20.00),(100,156,'UK-default',66.39,0.00,0.00,20.00),(101,157,'UK-default',66.39,0.00,0.00,20.00),(102,158,'UK-default',66.39,0.00,0.00,20.00),(103,159,'UK-default',66.39,0.00,0.00,20.00),(104,160,'UK-default',66.39,0.00,0.00,20.00);
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
INSERT INTO `user_profiles` VALUES (1,'Rafael','Perales','/uploads/avatars/user-1-1775130738359.jpg'),(2,'Richard','Perales','/uploads/avatars/user-2-1775914120029.jpg'),(7,'Ramon','Garcia','/uploads/avatars/user-7-1775420900547.jpg'),(8,'Rafael','Perales',NULL),(9,'Gonzales','Ramon',NULL),(10,'Pedro','Perez',NULL),(11,'Angel','jose',NULL),(12,'Pedro','Perez',NULL),(13,'Pedro','Pitter Perez',NULL);
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
INSERT INTO `user_roles` VALUES (1,'user','2026-02-08 20:39:03'),(2,'admin','2026-04-11 14:54:14'),(7,'user','2026-02-10 00:32:26'),(7,'mechanic','2026-02-10 00:32:28'),(8,'user','2026-03-12 22:05:18'),(9,'user','2026-03-16 22:41:24'),(10,'user','2026-03-16 22:50:19'),(11,'user','2026-03-16 23:21:16'),(12,'mechanic','2026-04-11 13:38:49'),(13,'user','2026-03-29 20:15:58');
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
INSERT INTO `user_security_settings` VALUES (1,1,'2026-04-11 14:18:56'),(2,1,'2026-04-14 16:39:32'),(7,1,'2026-04-11 11:39:52');
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
  `email` varchar(320) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password_hash` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('user','mechanic','admin') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_login_at` timestamp NULL DEFAULT NULL,
  `username` varchar(320) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('pending','active','suspended','banned') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `uq_users_username` (`username`),
  UNIQUE KEY `uuid_public` (`uuid_public`),
  KEY `idx_users_phone` (`phone`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,_binary '\‰¸\r™eÒöΩä\Ã\‰2\»B','zang17@hotmail.com','07541017233','$2a$10$mtyyhv46g38s7s7gLHF70.zS.N4H3DwAPMj9VyW/JWSdquXdjvMeK','user','2026-02-07 20:45:10','2026-04-13 18:38:26','zang17@hotmail.com','active'),(2,_binary 'çï∫\Õ\r\Ò¥õmªŸï','zang17univ@outlook.com','07541017231','$2a$10$fjBigxvRHCkpYOIs0vOJtOFjqBm6EIvJX1cFECHy1e5XQJt57dKLy','admin','2026-02-09 23:17:50','2026-04-14 16:39:18','Richar10','active'),(7,_binary '˘ºe<\Ò¥õmªŸï','zang17uk@outlook.com','07541017244','$2a$10$ngs3Id/JOy1zcQCE88cYR.s2RCek69QZWY6WxbO/K92aoOlWe/zwC','mechanic','2026-02-10 00:32:26','2026-04-11 11:40:34','zang17uk@outlook.com','pending'),(8,_binary 'éNL\‘_\Òâ\¬fHÇù<\Œ','zang17pro@outlook.com','07541017233','$2a$10$nHNF305YzE24XbY.gSuvROgiKWgkUtB27FAvWDaiMUp5oh1LAIyAS','user','2026-03-12 22:05:18',NULL,'zang17pro@outlook.com','active'),(9,_binary 'Cù.!â\Ò∫JaQ∏Sè','zang123@outlook.com','07541017233','$2a$10$Su/lDoPpB/C..5yxnoffbOWER7od0.JB5JfQsea11LexdcKc1ZQMm','user','2026-03-16 22:41:24',NULL,'zang123@outlook.com','active'),(10,_binary 'Å˚H!ä\Ò∫JaQ∏Sè','zang1@hotmail.com','07541017233','$2a$10$6fsWyS6C0rAYfgnU7Q9sQukZsptoKnQ5mmxky6dag2iLHvS6BFsDa','user','2026-03-16 22:50:19','2026-03-16 22:54:15','zang1@hotmail.com','active'),(11,_binary '‘ã\0ô!é\Ò∫JaQ∏Sè','zang1234@outlook.com','07541017233','$2a$10$cz1RKiArs6eoasCFEFiODufePWd2CZR97p/nMgr8ZtPxI9O.u/XNm','user','2026-03-16 23:21:16',NULL,'zang1234@outlook.com','active'),(12,_binary '\œWàR\'ô\Ò†PÜ˘/$m','zang17@outlook.cl','07541017235','$2a$10$Qw8h6P9t7AQ/OS.WBbltNO0L0cy2TTsl5fhyphw7xfdV/RnNzoWXy','mechanic','2026-03-24 15:54:58',NULL,'zang17@outlook.cl','pending'),(13,_binary 'áa˙\Ò\'\ﬂ\Òös\‚†!æ\’%','zang17@outlook.com','7541017238','$2a$10$EzH3c5jsDxiZUGUlrpflQeadCS4SuGyn89kaYqfUxrsPiWzFX7vaW','user','2026-03-25 00:14:02',NULL,'zang17@outlook.com','active');
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
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vehicles`
--

LOCK TABLES `vehicles` WRITE;
/*!40000 ALTER TABLE `vehicles` DISABLE KEYS */;
INSERT INTO `vehicles` VALUES (3,_binary 'õP\Ÿa_\Òâ\¬fHÇù<\Œ',8,'KL05USC','TOYOTA','COROLLA',2005,NULL,NULL,NULL,NULL,NULL),(4,_binary '‹∂!Ä\Ò∫JaQ∏Sè',1,'KL05USC','TOYOTA','COROLLA',2005,'PETROL','39580','Due in 26 weeks','Due in 22 weeks',NULL),(5,_binary 'Ñ\Ì\Ù˚!â\Ò∫JaQ∏Sè',9,'KL05USC','TOYOTA','COROLLA',2005,NULL,NULL,NULL,NULL,NULL),(6,_binary 'é7\Z\'!ä\Ò∫JaQ∏Sè',10,'KL05USC','TOYOTA','COROLLA',2005,NULL,NULL,NULL,NULL,NULL),(40,_binary '˙Wv-\Í\ÒØ\€&oˇVúw',1,'BP67XRZ','RENAULT','CLIO',2018,'PETROL','13126','Due in 26 weeks','Due in 35 weeks',NULL);
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

-- Dump completed on 2026-04-14 19:44:04
