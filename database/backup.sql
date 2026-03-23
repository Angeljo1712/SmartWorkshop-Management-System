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
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `addresses`
--

LOCK TABLES `addresses` WRITE;
/*!40000 ALTER TABLE `addresses` DISABLE KEYS */;
INSERT INTO `addresses` VALUES (1,_binary '\‰ˇ¶\‡eÒöΩä\Ã\‰2\»B',1,'Primary','Flat 19 Claycorn Court, Station Way',NULL,'Esher','KT10 0QR','GB',_binary '\Ê\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0'),(2,_binary 'o¬ÆgÒöΩä\Ã\‰2\»B',1,'Primary','Flat 19 Claycorn Court, Station Way',NULL,'Esher','KT10 0QR','GB',_binary '\Ê\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0'),(3,_binary 'QæFgÒöΩä\Ã\‰2\»B',1,'Primary','Flat 19 Claycorn Court, Station Way',NULL,'Esher','KT10 0QR','GB',_binary '\Ê\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0'),(4,_binary '∏/ BgÒöΩä\Ã\‰2\»B',1,'Primary','Flat 19 Claycorn Court, Station Way',NULL,'Esher','KT10 0QR','GB',_binary '\Ê\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0'),(5,_binary 'é`s_\Òâ\¬fHÇù<\Œ',8,'Primary','19 Claycorn Court, Station Way','Claygate','Esher','KT10 0QR','GB',_binary '\Ê\0\0\0\0\0	¿?•JÆI@˛++MJA÷ø'),(6,_binary '≥\ﬁˇ!^\ÒÅñ\¬B\œÕêe',1,'Primary','19 Claycorn Court, Station Way','Claygate','Esher','KT10 0QR','GB',_binary '\Ê\0\0\0\0\0	¿?•JÆI@˛++MJA÷ø'),(7,_binary 'n\∆+!_\ÒÅñ\¬B\œÕêe',1,'Primary','19 Claycorn Court, Station Way','Claygate','Esher','KT10 0QR','GB',_binary '\Ê\0\0\0\0\0	¿?•JÆI@˛++MJA÷ø'),(8,_binary 'H°e\“!_\ÒÅñ\¬B\œÕêe',1,'Primary','19 Claycorn Court, Station Way','Claygate','Esher','KT10 0QR','GB',_binary '\Ê\0\0\0\0\0	¿?•JÆI@˛++MJA÷ø'),(9,_binary '¡©î!_\ÒÅñ\¬B\œÕêe',1,'Primary','19 Claycorn Court, Station Way','Claygate','Esher','KT10 0QR','GB',_binary '\Ê\0\0\0\0\0	¿?•JÆI@˛++MJA÷ø'),(10,_binary '\«\Ì$\“!\Ò∫JaQ∏Sè',1,'Primary','19 Claycorn Court, Station Way','Claygate','Esher','KT10 0QR','GB',_binary '\Ê\0\0\0\0\0	¿?•JÆI@˛++MJA÷ø'),(11,_binary 'FêJ!Ä\Ò∫JaQ∏Sè',1,'Primary','Flat 19 Claycorn Court',NULL,'Esher','KT10 0QR','GB',_binary '\Ê\0\0\0\0\0	¿?•JÆI@˛++MJA÷ø'),(12,_binary '`,ü5!Ä\Ò∫JaQ∏Sè',1,'Primary','19 Claycorn Court, Station Way','Claygate','Esher','KT10 0QR','GB',_binary '\Ê\0\0\0\0\0	¿?•JÆI@˛++MJA÷ø'),(13,_binary 'g\\\Ë?!Ä\Ò∫JaQ∏Sè',1,'Primary','19 Claycorn Court, Station Way','Claygate','Esher','KT10 0QR','GB',_binary '\Ê\0\0\0\0\0	¿?•JÆI@˛++MJA÷ø'),(14,_binary '\ﬁ5Ωé!Ä\Ò∫JaQ∏Sè',1,'Primary','19 Claycorn Court, Station Way','Claygate','Esher','KT10 0QR','GB',_binary '\Ê\0\0\0\0\0	¿?•JÆI@˛++MJA÷ø'),(15,_binary 'C*\˜∞!â\Ò∫JaQ∏Sè',9,'Primary','19 Claycorn Court, Station Way','Claygate','Esher','KT10 0QR','GB',_binary '\Ê\0\0\0\0\0	¿?•JÆI@˛++MJA÷ø'),(16,_binary 'uÇ˙\√!â\Ò∫JaQ∏Sè',9,'Primary','19 Claycorn Court, Station Way','Claygate','Esher','KT10 0QR','GB',_binary '\Ê\0\0\0\0\0	¿?•JÆI@˛++MJA÷ø'),(17,_binary 'Ç	\Ã\”!ä\Ò∫JaQ∏Sè',10,'Primary','19 Claycorn Court, Station Way','Claygate','Esher','KT10 0QR','GB',_binary '\Ê\0\0\0\0\0	¿?•JÆI@˛++MJA÷ø'),(18,_binary '‘•B6!é\Ò∫JaQ∏Sè',11,'Primary','19 Claycorn Court, Station Way','Claygate','Esher','KT10 0QR','GB',_binary '\Ê\0\0\0\0\0	¿?•JÆI@˛++MJA÷ø'),(19,_binary '≈¥f6$q\Òß4≤B\Î0',1,'Primary','19 Claycorn Court, Station Way','Claygate','Esher','KT10 0QR','GB',_binary '\Ê\0\0\0\0\0	¿?•JÆI@˛++MJA÷ø'),(27,_binary '\Zªv,$ã\Òß4≤B\Î0',7,'Contact','18 Friars Avenue',NULL,'London','SW15 3DU','GB',_binary '\Ê\0\0\0\0\0\Á\◊ \›∏I@ﬁ¶\‰A\—œø'),(28,_binary '\ è\Ë%i\ÒòjJ\¬˚∂',1,'Primary','19 Claycorn Court, Station Way','Claygate','Esher','KT10 0QR','GB',_binary '\Ê\0\0\0\0\0	¿?•JÆI@˛++MJA÷ø'),(29,_binary 'âØ\Ÿ&C\Ò≥¨\Íç\Œ{/',1,'Primary','19 Claycorn Court, Station Way','Claygate','Esher','KT10 0QR','GB',_binary '\Ê\0\0\0\0\0	¿?•JÆI@˛++MJA÷ø'),(30,_binary '+\˜1π&D\Ò≥¨\Íç\Œ{/',1,'Primary','19 Claycorn Court, Station Way','Claygate','Esher','KT10 0QR','GB',_binary '\Ê\0\0\0\0\0	¿?•JÆI@˛++MJA÷ø'),(31,_binary 'l\'&û&D\Ò≥¨\Íç\Œ{/',1,'Primary','19 Claycorn Court, Station Way','Claygate','Esher','KT10 0QR','GB',_binary '\Ê\0\0\0\0\0	¿?•JÆI@˛++MJA÷ø'),(32,_binary 'π0&D\Ò≥¨\Íç\Œ{/',1,'Primary','19 Claycorn Court, Station Way','Claygate','Esher','KT10 0QR','GB',_binary '\Ê\0\0\0\0\0	¿?•JÆI@˛++MJA÷ø'),(33,_binary '•$\'\&E\Ò≥¨\Íç\Œ{/',1,'Primary','19 Claycorn Court, Station Way','Claygate','Esher','KT10 0QR','GB',_binary '\Ê\0\0\0\0\0	¿?•JÆI@˛++MJA÷ø'),(34,_binary '\·§Y&E\Ò≥¨\Íç\Œ{/',1,'Primary','19 Claycorn Court, Station Way','Claygate','Esher','KT10 0QR','GB',_binary '\Ê\0\0\0\0\0	¿?•JÆI@˛++MJA÷ø'),(35,_binary '\0e\Ÿ\Œ&F\Ò≥¨\Íç\Œ{/',1,'Primary','19 Claycorn Court, Station Way','Claygate','Esher','KT10 0QR','GB',_binary '\Ê\0\0\0\0\0	¿?•JÆI@˛++MJA÷ø'),(36,_binary '$E\Ù&F\Ò≥¨\Íç\Œ{/',1,'Primary','19 Claycorn Court, Station Way','Claygate','Esher','KT10 0QR','GB',_binary '\Ê\0\0\0\0\0	¿?•JÆI@˛++MJA÷ø'),(37,_binary '\“/]M&F\Ò≥¨\Íç\Œ{/',1,'Primary','19 Claycorn Court, Station Way','Claygate','Esher','KT10 0QR','GB',_binary '\Ê\0\0\0\0\0	¿?•JÆI@˛++MJA÷ø');
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
) ENGINE=InnoDB AUTO_INCREMENT=99 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking_draft_items`
--

LOCK TABLES `booking_draft_items` WRITE;
/*!40000 ALTER TABLE `booking_draft_items` DISABLE KEYS */;
INSERT INTO `booking_draft_items` VALUES (3,1,12,1,525.00),(4,1,13,1,110.00),(19,3,12,1,525.00),(20,5,12,1,525.00),(21,7,12,1,525.00),(22,9,12,1,525.00),(23,10,12,1,525.00),(24,10,13,1,110.00),(25,12,12,1,525.00),(26,13,12,1,525.00),(27,13,13,1,110.00),(47,14,12,1,525.00),(52,15,12,1,525.00),(64,16,12,1,525.00),(65,16,13,1,110.00),(66,17,12,1,525.00),(67,17,13,1,110.00),(68,22,12,1,525.00),(69,23,12,1,525.00),(70,23,13,1,110.00),(71,25,1,1,675.00),(72,30,65,1,66.39),(74,32,68,1,152.86),(76,34,68,1,152.86),(77,34,69,1,123.45),(78,34,12,1,525.00),(79,34,13,1,110.00),(83,37,12,1,525.00),(84,37,13,1,110.00),(85,38,12,1,525.00),(86,40,111,1,95.00),(89,41,111,1,95.00),(92,42,111,1,95.00),(93,44,111,1,95.00),(94,45,111,1,95.00),(95,46,111,1,95.00),(98,47,118,1,66.39);
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
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking_drafts`
--

LOCK TABLES `booking_drafts` WRITE;
/*!40000 ALTER TABLE `booking_drafts` DISABLE KEYS */;
INSERT INTO `booking_drafts` VALUES (1,'5469efdf-e7a2-410a-b459-f726dff471891770495233326',1,NULL,'2026-02-07 20:14:00','2026-02-07 20:45:10','Minor problems','yes','[{\"day\": \"6th\", \"slots\": [], \"weekday\": \"Friday\"}, {\"day\": \"7th\", \"slots\": [\"8-10 AM\"], \"weekday\": \"Saturday\"}, {\"day\": \"8th\", \"slots\": [], \"weekday\": \"Sunday\"}]','pending',NULL,NULL,NULL),(3,'b6711393-483f-4c31-9ee5-f62c07165dbc1770497590591',1,NULL,'2026-02-07 20:53:15','2026-02-07 20:53:37','Minor problem','yes','[{\"day\": \"6th\", \"slots\": [\"8-10 AM\"], \"weekday\": \"Friday\"}, {\"day\": \"7th\", \"slots\": [], \"weekday\": \"Saturday\"}, {\"day\": \"8th\", \"slots\": [], \"weekday\": \"Sunday\"}]','pending',NULL,NULL,NULL),(5,'c05cc153-6ed3-456e-b2b1-40455c88413b1770497704612',1,NULL,'2026-02-07 20:55:11','2026-02-07 20:55:22','Minor','yes','[{\"day\": \"6th\", \"slots\": [\"8-10 AM\"], \"weekday\": \"Friday\"}, {\"day\": \"7th\", \"slots\": [], \"weekday\": \"Saturday\"}, {\"day\": \"8th\", \"slots\": [], \"weekday\": \"Sunday\"}]','pending',NULL,NULL,NULL),(7,'ff62169b-4ab3-483d-a3b7-6d83065a0d4d1770497878262',1,NULL,'2026-02-07 20:58:04','2026-02-07 20:58:36','Minor','yes','[{\"day\": \"6th\", \"slots\": [\"8-10 AM\"], \"weekday\": \"Friday\"}, {\"day\": \"7th\", \"slots\": [], \"weekday\": \"Saturday\"}, {\"day\": \"8th\", \"slots\": [], \"weekday\": \"Sunday\"}]','paid','mock',630.00,'GBP'),(9,'2ce6130d-eb4a-41be-90af-1d0e660b4f331770567178019',NULL,NULL,'2026-02-08 16:13:12','2026-02-08 16:13:12',NULL,NULL,NULL,'pending',NULL,NULL,NULL),(10,'6e05c5a0-a5e4-4599-b241-6329de6dd7df1773353051661',8,'{\"make\": \"TOYOTA\", \"model\": \"COROLLA\", \"colour\": \"SILVER\", \"fuelType\": \"PETROL\", \"postcode\": \"KT10 0QR\", \"yearOfManufacture\": 2005, \"registrationNumber\": \"KL05USC\"}','2026-03-12 22:04:12','2026-03-12 22:05:40',NULL,'no','[{\"day\": \"6th\", \"slots\": [], \"weekday\": \"Friday\"}, {\"day\": \"7th\", \"slots\": [], \"weekday\": \"Saturday\"}, {\"day\": \"8th\", \"slots\": [\"All day\"], \"weekday\": \"Sunday\"}]','paid','mock',762.00,'GBP'),(12,'932af67d-84a6-4fc6-8685-902be95c37501773426361812',NULL,NULL,'2026-03-13 18:26:12','2026-03-13 18:26:12',NULL,NULL,NULL,'pending',NULL,NULL,NULL),(13,'95a2b93c-1fb2-4214-a98a-649329d1de561773428174261',NULL,NULL,'2026-03-13 18:56:27','2026-03-13 18:56:27',NULL,NULL,NULL,'pending',NULL,NULL,NULL),(14,'56548845-00e5-4cdf-a9fc-6b4fdd7ba2771773659277956',NULL,NULL,'2026-03-16 13:10:39','2026-03-16 13:10:39',NULL,NULL,NULL,'pending',NULL,NULL,NULL),(15,'a0bdab2b-8945-4c68-903c-cdf1abed36b81773671650162',NULL,NULL,'2026-03-16 14:34:15','2026-03-16 14:34:15',NULL,NULL,NULL,'pending',NULL,NULL,NULL),(16,'f4ed5c25-9cd0-46cd-8003-4578385b7cc61773672103115',NULL,NULL,'2026-03-16 14:43:45','2026-03-16 14:43:45',NULL,NULL,NULL,'pending',NULL,NULL,NULL),(17,'0aeb5ab3-1ec5-44a5-a0a5-1292cc91e15f1773677178952',1,NULL,'2026-03-16 16:25:20','2026-03-16 17:36:45',NULL,'yes','[{\"day\": \"16th\", \"slots\": [], \"weekday\": \"Thursday\"}, {\"day\": \"17th\", \"slots\": [\"All day\", \"8-10 AM\", \"10-12 AM\", \"12-2 PM\", \"2-4 PM\", \"4-6 PM\"], \"weekday\": \"Friday\"}, {\"day\": \"18th\", \"slots\": [], \"weekday\": \"Saturday\"}, {\"day\": \"19th\", \"slots\": [], \"weekday\": \"Sunday\"}, {\"day\": \"20th\", \"slots\": [], \"weekday\": \"Monday\"}]','pending',NULL,NULL,NULL),(22,'93372567-2c12-46a0-a609-5f94e65c640d1773684950260',NULL,NULL,'2026-03-16 18:15:53','2026-03-16 18:15:53',NULL,NULL,NULL,'pending',NULL,NULL,NULL),(23,'ccf9051c-7277-4216-9253-00f76faccb0a1773694408545',1,'{\"make\": \"TOYOTA\", \"model\": \"COROLLA\", \"colour\": \"SILVER\", \"fuelType\": \"PETROL\", \"postcode\": \"KT10 0QR\", \"yearOfManufacture\": 2005, \"registrationNumber\": \"KL05USC\"}','2026-03-16 20:53:30','2026-03-16 22:14:50',NULL,'yes','[{\"day\": \"16th\", \"slots\": [], \"weekday\": \"Thursday\"}, {\"day\": \"17th\", \"slots\": [], \"weekday\": \"Friday\"}, {\"day\": \"18th\", \"slots\": [], \"weekday\": \"Saturday\"}, {\"day\": \"19th\", \"slots\": [], \"weekday\": \"Sunday\"}, {\"day\": \"20th\", \"slots\": [], \"weekday\": \"Monday\"}]','paid','mock',762.00,'GBP'),(25,'debug-session',1,'{\"make\": \"Toyota\", \"model\": \"Corolla\", \"yearOfManufacture\": 2005, \"registrationNumber\": \"KL05USC\"}','2026-03-16 21:35:37','2026-03-16 21:35:53','test','yes','[{\"day\": \"16th\", \"slots\": [\"All day\"], \"weekday\": \"Monday\"}]','paid','mock',810.00,'GBP'),(29,'e58c23cf-c00e-4174-b57a-503c292451c91773697277215',9,NULL,'2026-03-16 22:41:24','2026-03-16 22:41:24',NULL,'yes','[{\"day\": \"17th\", \"slots\": [\"All day\", \"8-10 AM\", \"10-12 AM\", \"12-2 PM\", \"2-4 PM\", \"4-6 PM\"], \"weekday\": \"Friday\", \"iso_date\": \"2026-04-17\"}]','pending',NULL,NULL,NULL),(30,'02f4a160-06f9-4aa8-a98b-08f70b0c12491773700926825',9,'{\"make\": \"TOYOTA\", \"model\": \"COROLLA\", \"colour\": \"SILVER\", \"fuelType\": \"PETROL\", \"postcode\": \"KT10 0QR\", \"yearOfManufacture\": 2005, \"registrationNumber\": \"KL05USC\"}','2026-03-16 22:42:07','2026-03-16 22:43:14',NULL,'yes','[{\"day\": \"17th\", \"slots\": [\"All day\", \"8-10 AM\", \"10-12 AM\", \"12-2 PM\", \"2-4 PM\", \"4-6 PM\"], \"weekday\": \"Friday\", \"iso_date\": \"2026-04-17\"}]','paid','mock',79.67,'GBP'),(32,'ea16d688-44f9-47ac-bd82-556c0039be6c1773701366383',10,'{\"make\": \"TOYOTA\", \"model\": \"COROLLA\", \"colour\": \"SILVER\", \"fuelType\": \"PETROL\", \"postcode\": \"KT10 0QR\", \"yearOfManufacture\": 2005, \"registrationNumber\": \"KL05USC\"}','2026-03-16 22:49:27','2026-03-16 22:50:40','Vehiculo estable','yes','[{\"day\": \"16th\", \"slots\": [\"8-10 AM\"], \"weekday\": \"Thursday\", \"iso_date\": \"2026-04-16\"}]','paid','mock',183.43,'GBP'),(34,'9cea1512-8c82-4628-831b-4550d575e4481773701571507',11,'{\"make\": \"TOYOTA\", \"model\": \"COROLLA\", \"colour\": \"SILVER\", \"fuelType\": \"PETROL\", \"postcode\": \"KT10 0QR\", \"yearOfManufacture\": 2005, \"registrationNumber\": \"KL05USC\"}','2026-03-16 22:52:52','2026-03-16 23:21:16',NULL,'yes','[{\"day\": \"18th\", \"slots\": [\"All day\", \"8-10 AM\", \"10-12 AM\", \"12-2 PM\", \"2-4 PM\", \"4-6 PM\"], \"weekday\": \"Saturday\", \"iso_date\": \"2026-04-18\"}]','pending',NULL,NULL,NULL),(36,'a98cfc7d-c824-42da-b2db-482fba58f0981773837103620',NULL,NULL,'2026-03-18 12:31:47','2026-03-18 12:31:47',NULL,NULL,NULL,'pending',NULL,NULL,NULL),(37,'dd2eb930-b900-4b25-b489-dad6939bd6ac1774016751101',NULL,NULL,'2026-03-20 14:25:54','2026-03-20 14:25:54',NULL,NULL,NULL,'pending',NULL,NULL,NULL),(38,'f7eed0c6-8835-420b-adee-f7434f009e291774020308886',1,'{\"make\": \"TOYOTA\", \"model\": \"COROLLA\", \"colour\": \"SILVER\", \"fuelType\": \"PETROL\", \"postcode\": \"KT10 0QR\", \"yearOfManufacture\": 2005, \"registrationNumber\": \"KL05USC\"}','2026-03-20 15:25:13','2026-03-20 15:31:08','Nothing especial','yes','[{\"day\": \"20th\", \"slots\": [\"8-10 AM\"], \"weekday\": \"Monday\", \"iso_date\": \"2026-04-20\"}]','paid','mock',630.00,'GBP'),(40,'01f6e1e2-52e0-431a-8ef4-315ea6bd06aa1774119668549',NULL,NULL,'2026-03-21 19:26:13','2026-03-21 19:26:13',NULL,NULL,NULL,'pending',NULL,NULL,NULL),(41,'050407b4-f1e2-4e70-a167-d467c2f92a561774121493837',NULL,NULL,'2026-03-21 19:31:35','2026-03-21 19:31:35',NULL,NULL,NULL,'pending',NULL,NULL,NULL),(42,'72ad7744-18a1-451a-98b5-360f2323a7811774125484356',1,'{\"make\": \"TOYOTA\", \"model\": \"COROLLA\", \"colour\": \"SILVER\", \"fuelType\": \"PETROL\", \"postcode\": \"KT10 0QR\", \"yearOfManufacture\": 2005, \"registrationNumber\": \"KL05USC\"}','2026-03-21 20:38:08','2026-03-21 21:06:42',NULL,'no','[]','paid','mock',114.00,'GBP'),(44,'340a4ee4-8288-46b8-9e2e-e32aa26e7f531774133406498',NULL,NULL,'2026-03-21 23:00:03','2026-03-21 23:00:03',NULL,NULL,NULL,'pending',NULL,NULL,NULL),(45,'aa9bab0e-2b0a-4759-bf94-1e107f7c6c0a1774213682547',NULL,NULL,'2026-03-22 21:08:10','2026-03-22 21:08:10',NULL,NULL,NULL,'pending',NULL,NULL,NULL),(46,'fb3f81c0-92f5-493b-aed8-b47c8c454db01774217886692',1,'{\"make\": \"TOYOTA\", \"model\": \"COROLLA\", \"colour\": \"SILVER\", \"fuelType\": \"PETROL\", \"postcode\": \"KT10 0QR\", \"yearOfManufacture\": 2005, \"registrationNumber\": \"KL05USC\"}','2026-03-22 23:01:09','2026-03-22 23:13:23',NULL,'no','[]','pending',NULL,NULL,NULL),(47,'589a5320-66d1-41a9-b104-7942a7bd45e51774216188936',1,'{\"make\": \"TOYOTA\", \"model\": \"COROLLA\", \"colour\": \"SILVER\", \"fuelType\": \"PETROL\", \"postcode\": \"KT10 0QR\", \"yearOfManufacture\": 2005, \"registrationNumber\": \"KL05USC\"}','2026-03-22 23:04:29','2026-03-22 23:24:48',NULL,'no','[]','paid','mock',114.00,'GBP');
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
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking_items`
--

LOCK TABLES `booking_items` WRITE;
/*!40000 ALTER TABLE `booking_items` DISABLE KEYS */;
INSERT INTO `booking_items` VALUES (1,1,12,0,NULL,525.00),(2,1,13,0,NULL,110.00),(3,2,1,0,NULL,675.00),(4,3,12,0,NULL,525.00),(5,3,13,0,NULL,110.00),(6,4,65,0,NULL,66.39),(7,5,68,0,NULL,152.86),(8,6,12,0,NULL,525.00),(9,7,111,0,NULL,95.00),(10,8,111,0,NULL,95.00),(11,9,111,0,NULL,95.00);
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking_offers`
--

LOCK TABLES `booking_offers` WRITE;
/*!40000 ALTER TABLE `booking_offers` DISABLE KEYS */;
INSERT INTO `booking_offers` VALUES (1,6,7,'accepted','2026-03-20 15:31:08','2026-03-20 19:36:31'),(2,7,7,'pending','2026-03-21 21:06:42',NULL),(3,8,7,'pending','2026-03-21 21:14:36',NULL),(4,9,7,'pending','2026-03-22 23:24:48',NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` VALUES (1,_binary 'õRïà_\Òâ\¬fHÇù<\Œ',8,NULL,5,3,NULL,'requested',635.00,127.00,762.00,'2026-03-12 22:05:40',NULL),(2,_binary '\›\Ò!Ä\Ò∫JaQ∏Sè',1,NULL,11,4,NULL,'requested',675.00,135.00,810.00,'2026-03-16 21:35:53','test'),(3,_binary 'åµ\Ï%!Ö\Ò∫JaQ∏Sè',1,NULL,14,4,NULL,'requested',635.00,127.00,762.00,'2026-03-16 22:14:50',NULL),(4,_binary 'Ñ\ÔNö!â\Ò∫JaQ∏Sè',9,NULL,16,5,NULL,'requested',66.39,13.28,79.67,'2026-03-16 22:43:14',NULL),(5,_binary 'é89c!ä\Ò∫JaQ∏Sè',10,NULL,17,6,NULL,'requested',152.86,30.57,183.43,'2026-03-16 22:50:40','Vehiculo estable'),(6,_binary '\—\Z\‡£$q\Òß4≤B\Î0',1,7,19,4,NULL,'accepted',525.00,105.00,630.00,'2026-03-20 15:31:08','Nothing especial'),(7,_binary '\‹l\˜v%i\ÒòjJ\¬˚∂',1,NULL,28,4,NULL,'requested',95.00,19.00,114.00,'2026-03-21 21:06:42',NULL),(8,_binary '\˜:ß\‹%j\ÒòjJ\¬˚∂',1,NULL,28,4,NULL,'requested',95.00,19.00,114.00,'2026-03-21 21:14:36',NULL),(9,_binary 'Q\⁄n\Ú&F\Ò≥¨\Íç\Œ{/',1,NULL,36,4,NULL,'requested',95.00,19.00,114.00,'2026-03-22 23:24:48',NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact_messages`
--

LOCK TABLES `contact_messages` WRITE;
/*!40000 ALTER TABLE `contact_messages` DISABLE KEYS */;
INSERT INTO `contact_messages` VALUES (1,'Test User','test@example.com','Prueba','Mensaje de prueba desde contacto','new','home_web','::ffff:172.18.0.1','Mozilla/5.0 (Windows NT 10.0; Microsoft Windows 10.0.26200; en-GB) PowerShell/7.5.4','2026-03-07 19:02:17','2026-03-07 19:02:17');
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoices`
--

LOCK TABLES `invoices` WRITE;
/*!40000 ALTER TABLE `invoices` DISABLE KEYS */;
/*!40000 ALTER TABLE `invoices` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mechanic_memberships`
--

LOCK TABLES `mechanic_memberships` WRITE;
/*!40000 ALTER TABLE `mechanic_memberships` DISABLE KEYS */;
INSERT INTO `mechanic_memberships` VALUES (7,7,'imI','2026-02-10 00:32:26');
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
INSERT INTO `mechanic_profiles` VALUES (7,'Ramon Garcia','Ramon Garcia',NULL,1,0.00,0,NULL,NULL,1,1,1,'generalist',5,'low','search',5,'independent_garage');
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
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mechanic_qualifications`
--

LOCK TABLES `mechanic_qualifications` WRITE;
/*!40000 ALTER TABLE `mechanic_qualifications` DISABLE KEYS */;
INSERT INTO `mechanic_qualifications` VALUES (1,1,'NVQ Level 3','2026-02-08 21:58:31'),(2,1,'NVQ Level 3','2026-02-08 22:01:11'),(9,7,'iml_level_1','2026-02-10 00:32:26');
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mechanic_services`
--

LOCK TABLES `mechanic_services` WRITE;
/*!40000 ALTER TABLE `mechanic_services` DISABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mechanic_services_offered`
--

LOCK TABLES `mechanic_services_offered` WRITE;
/*!40000 ALTER TABLE `mechanic_services_offered` DISABLE KEYS */;
INSERT INTO `mechanic_services_offered` VALUES (15,7,'mobile_mechanic_service','2026-03-20 18:32:09');
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resolution_case_messages`
--

LOCK TABLES `resolution_case_messages` WRITE;
/*!40000 ALTER TABLE `resolution_case_messages` DISABLE KEYS */;
INSERT INTO `resolution_case_messages` VALUES (1,3,7,'Hi this is a test','2026-03-20 20:30:45'),(2,3,1,'Gracias por la ayuda','2026-03-20 20:45:19');
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
  `status` enum('open','closed') NOT NULL DEFAULT 'open',
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resolution_cases`
--

LOCK TABLES `resolution_cases` WRITE;
/*!40000 ALTER TABLE `resolution_cases` DISABLE KEYS */;
INSERT INTO `resolution_cases` VALUES (3,6,7,1,'general','General Enquiry',1,'6/1','open','2026-03-20 20:26:29','2026-03-20 20:26:29'),(4,6,7,1,'complaint','Complaint',2,'6/2','open','2026-03-22 12:53:56','2026-03-22 12:53:56');
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=161 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
) ENGINE=InnoDB AUTO_INCREMENT=105 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
INSERT INTO `user_profiles` VALUES (1,'Rafael','Perales',NULL),(2,'Admin','User',NULL),(7,'Ramon','Garcia',NULL),(8,'Rafael','Perales',NULL),(9,'Gonzales','Ramon',NULL),(10,'Pedro','Perez',NULL),(11,'Angel','jose',NULL);
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
INSERT INTO `user_roles` VALUES (1,'user','2026-02-08 20:39:03'),(2,'admin','2026-02-09 23:17:50'),(7,'user','2026-02-10 00:32:26'),(7,'mechanic','2026-02-10 00:32:28'),(8,'user','2026-03-12 22:05:18'),(9,'user','2026-03-16 22:41:24'),(10,'user','2026-03-16 22:50:19'),(11,'user','2026-03-16 23:21:16');
/*!40000 ALTER TABLE `user_roles` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,_binary '\‰¸\r™eÒöΩä\Ã\‰2\»B','zang17@hotmail.com','07541017233','$2a$10$HWTn7lKBCB6M6YIUepn4iORIBXytmCtSrseMJUbUvi179DFGk7qMq','user','2026-02-07 20:45:10','2026-03-22 19:13:51','zang17@hotmail.com','active'),(2,_binary 'çï∫\Õ\r\Ò¥õmªŸï','zang17univ@outlook.com','07541017231','$2a$10$fjBigxvRHCkpYOIs0vOJtOFjqBm6EIvJX1cFECHy1e5XQJt57dKLy','admin','2026-02-09 23:17:50','2026-03-07 23:02:15','zang17univ@outlook.com','active'),(7,_binary '˘ºe<\Ò¥õmªŸï','zang17uk@outlook.com','07541017244','$2a$10$ngs3Id/JOy1zcQCE88cYR.s2RCek69QZWY6WxbO/K92aoOlWe/zwC','mechanic','2026-02-10 00:32:26','2026-03-22 18:48:34','zang17uk@outlook.com','active'),(8,_binary 'éNL\‘_\Òâ\¬fHÇù<\Œ','zang17pro@outlook.com','07541017233','$2a$10$nHNF305YzE24XbY.gSuvROgiKWgkUtB27FAvWDaiMUp5oh1LAIyAS','user','2026-03-12 22:05:18',NULL,'zang17pro@outlook.com','active'),(9,_binary 'Cù.!â\Ò∫JaQ∏Sè','zang123@outlook.com','07541017233','$2a$10$Su/lDoPpB/C..5yxnoffbOWER7od0.JB5JfQsea11LexdcKc1ZQMm','user','2026-03-16 22:41:24',NULL,'zang123@outlook.com','active'),(10,_binary 'Å˚H!ä\Ò∫JaQ∏Sè','zang1@hotmail.com','07541017233','$2a$10$6fsWyS6C0rAYfgnU7Q9sQukZsptoKnQ5mmxky6dag2iLHvS6BFsDa','user','2026-03-16 22:50:19','2026-03-16 22:54:15','zang1@hotmail.com','active'),(11,_binary '‘ã\0ô!é\Ò∫JaQ∏Sè','zang1234@outlook.com','07541017233','$2a$10$cz1RKiArs6eoasCFEFiODufePWd2CZR97p/nMgr8ZtPxI9O.u/XNm','user','2026-03-16 23:21:16',NULL,'zang1234@outlook.com','active');
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
  `vin` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_veh_plate_user` (`user_id`,`license_plate`),
  UNIQUE KEY `uuid_public` (`uuid_public`),
  KEY `idx_veh_user` (`user_id`),
  CONSTRAINT `fk_vehicle_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vehicles`
--

LOCK TABLES `vehicles` WRITE;
/*!40000 ALTER TABLE `vehicles` DISABLE KEYS */;
INSERT INTO `vehicles` VALUES (3,_binary 'õP\Ÿa_\Òâ\¬fHÇù<\Œ',8,'KL05USC','TOYOTA','COROLLA',2005,NULL),(4,_binary '‹∂!Ä\Ò∫JaQ∏Sè',1,'KL05USC','Toyota','Corolla',2005,NULL),(5,_binary 'Ñ\Ì\Ù˚!â\Ò∫JaQ∏Sè',9,'KL05USC','TOYOTA','COROLLA',2005,NULL),(6,_binary 'é7\Z\'!ä\Ò∫JaQ∏Sè',10,'KL05USC','TOYOTA','COROLLA',2005,NULL);
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

-- Dump completed on 2026-03-23 23:48:33
