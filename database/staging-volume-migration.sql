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
-- Dumping data for table `addresses`
--

LOCK TABLES `addresses` WRITE;
/*!40000 ALTER TABLE `addresses` DISABLE KEYS */;
/*!40000 ALTER TABLE `addresses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `attachments`
--

LOCK TABLES `attachments` WRITE;
/*!40000 ALTER TABLE `attachments` DISABLE KEYS */;
/*!40000 ALTER TABLE `attachments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `audit_logs`
--

LOCK TABLES `audit_logs` WRITE;
/*!40000 ALTER TABLE `audit_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `audit_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `availability_slots`
--

LOCK TABLES `availability_slots` WRITE;
/*!40000 ALTER TABLE `availability_slots` DISABLE KEYS */;
/*!40000 ALTER TABLE `availability_slots` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `booking_completion_parts`
--

LOCK TABLES `booking_completion_parts` WRITE;
/*!40000 ALTER TABLE `booking_completion_parts` DISABLE KEYS */;
/*!40000 ALTER TABLE `booking_completion_parts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `booking_completion_photos`
--

LOCK TABLES `booking_completion_photos` WRITE;
/*!40000 ALTER TABLE `booking_completion_photos` DISABLE KEYS */;
/*!40000 ALTER TABLE `booking_completion_photos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `booking_draft_items`
--

LOCK TABLES `booking_draft_items` WRITE;
/*!40000 ALTER TABLE `booking_draft_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `booking_draft_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `booking_drafts`
--

LOCK TABLES `booking_drafts` WRITE;
/*!40000 ALTER TABLE `booking_drafts` DISABLE KEYS */;
/*!40000 ALTER TABLE `booking_drafts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `booking_items`
--

LOCK TABLES `booking_items` WRITE;
/*!40000 ALTER TABLE `booking_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `booking_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `booking_offers`
--

LOCK TABLES `booking_offers` WRITE;
/*!40000 ALTER TABLE `booking_offers` DISABLE KEYS */;
/*!40000 ALTER TABLE `booking_offers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `contact_messages`
--

LOCK TABLES `contact_messages` WRITE;
/*!40000 ALTER TABLE `contact_messages` DISABLE KEYS */;
/*!40000 ALTER TABLE `contact_messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `email_change_requests`
--

LOCK TABLES `email_change_requests` WRITE;
/*!40000 ALTER TABLE `email_change_requests` DISABLE KEYS */;
/*!40000 ALTER TABLE `email_change_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `invoices`
--

LOCK TABLES `invoices` WRITE;
/*!40000 ALTER TABLE `invoices` DISABLE KEYS */;
/*!40000 ALTER TABLE `invoices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `login_two_factor_challenges`
--

LOCK TABLES `login_two_factor_challenges` WRITE;
/*!40000 ALTER TABLE `login_two_factor_challenges` DISABLE KEYS */;
/*!40000 ALTER TABLE `login_two_factor_challenges` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `mechanic_accreditations`
--

LOCK TABLES `mechanic_accreditations` WRITE;
/*!40000 ALTER TABLE `mechanic_accreditations` DISABLE KEYS */;
INSERT  IGNORE INTO `mechanic_accreditations` VALUES (1,2,'ATA Level 2','2026-04-21 10:42:27');
/*!40000 ALTER TABLE `mechanic_accreditations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `mechanic_memberships`
--

LOCK TABLES `mechanic_memberships` WRITE;
/*!40000 ALTER TABLE `mechanic_memberships` DISABLE KEYS */;
INSERT  IGNORE INTO `mechanic_memberships` VALUES (1,2,'RAC Approved Garage','2026-04-21 10:42:27');
/*!40000 ALTER TABLE `mechanic_memberships` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `mechanic_profiles`
--

LOCK TABLES `mechanic_profiles` WRITE;
/*!40000 ALTER TABLE `mechanic_profiles` DISABLE KEYS */;
INSERT  IGNORE INTO `mechanic_profiles` VALUES (2,'Mia Mechanic','Mia Mechanic Ltd',8,NULL,NULL,1,1,1,'independent_garage','staging_demo','SW1A 1AA','approved','active','2026-04-21 10:42:27',25,'search','seed',NULL,1,4.80,12,'Staging demo mechanic account.');
/*!40000 ALTER TABLE `mechanic_profiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `mechanic_qualifications`
--

LOCK TABLES `mechanic_qualifications` WRITE;
/*!40000 ALTER TABLE `mechanic_qualifications` DISABLE KEYS */;
INSERT  IGNORE INTO `mechanic_qualifications` VALUES (1,2,'NVQ Level 3','2026-04-21 10:42:27'),(2,2,'IMI Level 2','2026-04-21 10:42:27');
/*!40000 ALTER TABLE `mechanic_qualifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `mechanic_services`
--

LOCK TABLES `mechanic_services` WRITE;
/*!40000 ALTER TABLE `mechanic_services` DISABLE KEYS */;
/*!40000 ALTER TABLE `mechanic_services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `mechanic_services_offered`
--

LOCK TABLES `mechanic_services_offered` WRITE;
/*!40000 ALTER TABLE `mechanic_services_offered` DISABLE KEYS */;
INSERT  IGNORE INTO `mechanic_services_offered` VALUES (1,2,'mobile_mechanic_service','2026-04-21 10:42:27');
/*!40000 ALTER TABLE `mechanic_services_offered` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `password_reset_requests`
--

LOCK TABLES `password_reset_requests` WRITE;
/*!40000 ALTER TABLE `password_reset_requests` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `payouts`
--

LOCK TABLES `payouts` WRITE;
/*!40000 ALTER TABLE `payouts` DISABLE KEYS */;
/*!40000 ALTER TABLE `payouts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `promo_codes`
--

LOCK TABLES `promo_codes` WRITE;
/*!40000 ALTER TABLE `promo_codes` DISABLE KEYS */;
/*!40000 ALTER TABLE `promo_codes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `promo_redemptions`
--

LOCK TABLES `promo_redemptions` WRITE;
/*!40000 ALTER TABLE `promo_redemptions` DISABLE KEYS */;
/*!40000 ALTER TABLE `promo_redemptions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `resolution_case_message_attachments`
--

LOCK TABLES `resolution_case_message_attachments` WRITE;
/*!40000 ALTER TABLE `resolution_case_message_attachments` DISABLE KEYS */;
/*!40000 ALTER TABLE `resolution_case_message_attachments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `resolution_case_messages`
--

LOCK TABLES `resolution_case_messages` WRITE;
/*!40000 ALTER TABLE `resolution_case_messages` DISABLE KEYS */;
/*!40000 ALTER TABLE `resolution_case_messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `resolution_cases`
--

LOCK TABLES `resolution_cases` WRITE;
/*!40000 ALTER TABLE `resolution_cases` DISABLE KEYS */;
/*!40000 ALTER TABLE `resolution_cases` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `service_catalog`
--

LOCK TABLES `service_catalog` WRITE;
/*!40000 ALTER TABLE `service_catalog` DISABLE KEYS */;
INSERT  IGNORE INTO `service_catalog` VALUES (1,'ev_charger_installation','EV Charger installation','ev','ev_chargers','ev_chargers',10,NULL,240),(2,'repair_automatic_transmission_service','Automatic transmission, housing & fluid systems','repair','repairs','automatic_transmissions',60,NULL,180),(3,'repair_body_centre_interior_trim','Interior/Seats/Seatbelts','repair','repairs','body_centre_sections',70,NULL,120),(4,'repair_body_front_bonnet','Bonnets','repair','repairs','body_front_sections',80,NULL,90),(5,'repair_clutch_replacement','Clutch replacement','repair','repairs','clutch_and_controls',210,'Vehicles with a manual gearbox only',300),(6,'repair_brake_discs_pads_front','Brake discs & pads replacement - front (both)','repair','repairs','brakes',110,NULL,180),(7,'repair_brake_discs_pads_rear','Brake discs & pads replacement - rear (both)','repair','repairs','brakes',120,NULL,180),(8,'repair_brake_pads_front','Brake pads replacement - front (all)','repair','repairs','brakes',130,NULL,90),(9,'repair_brake_pads_rear','Brake pads replacement - rear (all)','repair','repairs','brakes',140,NULL,90),(10,'repair_timing_chain','Timing chain replacement','repair','repairs','engines',310,NULL,420),(11,'diagnostic_inspection','Diagnostic inspection','diagnostics','diagnostics','general',610,NULL,60),(12,'repair_oil_filter','Engine oil & filter replacement','repair','repairs','engines',320,NULL,90),(13,'mot_test_only','MOT (test only)','repair','mots','mots',20,'Test only',60),(14,'mot_collection_delivery','MOT with collection & delivery','repair','mots','mots',30,NULL,90),(15,'repair_water_pump','Water pump replacement','repair','repairs','cooling_systems',410,NULL,240),(16,'repair_driveshaft_replacement','Driveshaft replacement','repair','repairs','driveshafts_propshafts_differentials',420,NULL,210),(17,'repair_alternator','Alternator replacement','repair','repairs','engine_management_ignitions',510,NULL,210),(18,'repair_fuel_pump_replacement','Fuel pump replacement','repair','repairs','engine_management_fuels',500,NULL,180),(19,'repair_aux_belt','Auxiliary drive belt replacement','repair','repairs','engines',330,NULL,60),(20,'repair_exhaust_silencer_replacement','Exhaust silencer replacement','repair','repairs','exhaust_systems',530,NULL,120),(21,'repair_window_regulator','Window regulator replacement','repair','repairs','general_electrics',540,NULL,120),(22,'repair_air_conditioning_regas','Air conditioning re-gas','repair','repairs','heating_air_conditionings',550,NULL,60),(23,'repair_manual_gearbox_service','Manual gearbox service','repair','repairs','manual_transmissions',560,NULL,120),(24,'repair_track_rod_end','Track rod end replacement','repair','repairs','steerings',570,NULL,90),(25,'repair_shock_absorbers_front','Shock absorbers replacement - front (pair)','repair','repairs','suspensions',710,NULL,180),(26,'repair_coil_spring_front','Coil spring replacement - front (both)','repair','repairs','suspensions',720,NULL,180),(27,'repair_starter_motor','Starter motor replacement','repair','repairs','engine_management_ignitions',520,NULL,150),(28,'repair_turbocharger_replacement','Turbocharger replacement','repair','repairs','turbocharger_intercoolers',730,NULL,300),(29,'repair_locking_wheel_nut_removal','Locking wheel nut removal (one)','repair','repairs','vehicle_securities',740,NULL,45),(30,'repair_wheel_bearing_front','Front wheel bearing replacement','repair','repairs','wheel_bearings',750,NULL,150),(31,'repair_wing_mirror_glass','Wing mirror glass replacement','repair','repairs','wing_mirrors',760,NULL,60),(32,'diag_car_wont_start','Car won\'t start inspection','diagnostics','diagnostics','general',620,NULL,60),(33,'diag_plugin_inspection','Plug-in diagnostic inspection','diagnostics','diagnostics','general',630,NULL,60),(34,'diag_abs_warning_light','ABS Warning Light Inspection','diagnostics','diagnostics','general',631,NULL,60),(35,'diag_air_conditioning_system','Air conditioning system inspection','diagnostics','diagnostics','general',632,NULL,60),(36,'diag_battery_warning_light','Battery Warning Light Inspection','diagnostics','diagnostics','general',633,NULL,60),(37,'diag_pulls_left_right','Pulling System Inspection','diagnostics','diagnostics','general',634,NULL,60),(38,'diag_bulb_failure','Bulb Failure Inspection','diagnostics','diagnostics','general',635,NULL,60),(39,'diag_car_smoking','Car Smoking Inspection','diagnostics','diagnostics','general',636,NULL,60),(40,'diag_car_leaking_oil','Car Leaking Oil Inspection','diagnostics','diagnostics','general',637,NULL,60),(41,'diag_car_overheating','Car Overheating Inspection','diagnostics','diagnostics','general',638,NULL,60),(42,'diag_car_shuddering','Car Shuddering/Vibrating Inspection','diagnostics','diagnostics','general',639,NULL,60),(43,'diag_car_steering','Car Steering Inspection','diagnostics','diagnostics','general',640,NULL,60),(44,'diag_catalytic_converter','Catalytic Converter Inspection','diagnostics','diagnostics','general',641,NULL,60),(45,'diag_central_locking','Central Locking Inspection','diagnostics','diagnostics','general',642,NULL,60),(46,'diag_convertible_roof','Convertible roof fault diagnostic','diagnostics','diagnostics','general',643,NULL,60),(47,'diag_cooling_system','Cooling System Inspection','diagnostics','diagnostics','general',644,NULL,60),(48,'diag_cooling_heating','Cooling and Heating Inspection','diagnostics','diagnostics','general',645,NULL,60),(49,'diag_cruise_control','Cruise Control Inspection','diagnostics','diagnostics','general',646,NULL,60),(50,'diag_door_open','Door Open Inspection','diagnostics','diagnostics','general',647,NULL,60),(51,'diag_electronic_throttle','Electronic Throttle Control Inspection','diagnostics','diagnostics','general',648,NULL,60),(52,'diag_engine_warning_light','Engine Warning Light Inspection','diagnostics','diagnostics','general',649,NULL,60),(53,'diag_fuel_filler_cap','Fuel Filler Cap Inspection','diagnostics','diagnostics','general',650,NULL,60),(54,'diag_gear_selector_transmission','Gear Selector And Transmission Inspection','diagnostics','diagnostics','general',651,NULL,60),(55,'diag_handbrake','Handbrake Inspection','diagnostics','diagnostics','general',652,NULL,60),(56,'diag_noise_all_speeds','Noise At All Speeds Inspection','diagnostics','diagnostics','general',653,NULL,60),(57,'diag_noise_low_speeds','Noise At Slow Speeds Inspection','diagnostics','diagnostics','general',654,NULL,60),(58,'diag_noise_inside_car','Noise Inside Car Inspection','diagnostics','diagnostics','general',655,NULL,60),(59,'diag_noise_under_bonnet','Noise Under Bonnet Inspection','diagnostics','diagnostics','general',656,NULL,60),(60,'diag_noise_when_braking','Noise When Braking Inspection','diagnostics','diagnostics','general',657,NULL,60),(61,'diag_noise_when_starting','Noise When Starting Inspection','diagnostics','diagnostics','general',658,NULL,60),(62,'diag_oil_level_pressure','Oil Level And Pressure Inspection','diagnostics','diagnostics','general',659,NULL,60),(63,'diag_overdrive','Overdrive Inspection','diagnostics','diagnostics','general',660,NULL,60),(64,'diag_power_steering','Power Steering Inspection','diagnostics','diagnostics','general',661,NULL,60),(65,'diag_reduced_engine_power','Reduced Engine Power Inspection','diagnostics','diagnostics','general',662,NULL,60),(66,'diag_srs_airbag','SRS/Airbags Inspection','diagnostics','diagnostics','general',663,NULL,60),(67,'diag_seatbelts','Seatbelts Inspection','diagnostics','diagnostics','general',664,NULL,60),(68,'diag_suspension','Suspension Inspection','diagnostics','diagnostics','general',665,NULL,60),(69,'diag_suspension_noise','Suspension Noise Inspection','diagnostics','diagnostics','general',666,NULL,60),(70,'diag_traction_control','Traction Control Inspection','diagnostics','diagnostics','general',667,NULL,60),(71,'diag_transmission_fluid_temp','Transmission Fluid Temperature Inspection','diagnostics','diagnostics','general',668,NULL,60),(72,'diag_tyre_pressure_warning','Tyre pressure warning light inspection (TPMS)','diagnostics','diagnostics','general',669,NULL,60),(73,'diag_warning_light','Warning Light Inspection','diagnostics','diagnostics','general',670,NULL,60),(74,'diag_washer_system','Washer System Inspection','diagnostics','diagnostics','general',671,NULL,60),(75,'diag_water_car','Water Coming into Car Inspection','diagnostics','diagnostics','general',672,NULL,60),(76,'diag_windows','Windows Inspection','diagnostics','diagnostics','general',673,NULL,60),(77,'service_major','Major Service','service','services','services',410,NULL,240),(78,'service_full','Full Service','service','services','services',420,NULL,180),(79,'service_interim','Interim Service','service','services','services',430,NULL,120),(80,'service_vehicle_health','Vehicle Health Check','inspection','inspections','inspections',705,'Only Â£30 when booked with other work',45),(81,'mot_collection_delivery_plus','MOT with collection & delivery','service','mots','mots',40,'Only Â£19 when booked with a service',90),(82,'tyre_fitting','Tyre fitting','tyres','tyres','tyres',510,NULL,60),(83,'tyre_replacement_pair','Tyre replacement - pair','tyres','tyres','tyres',520,NULL,90),(84,'inspection_premium','Premium Pre-purchase Inspection','inspection','inspections','inspections',710,NULL,180),(85,'inspection_standard','Standard Pre-purchase Inspection','inspection','inspections','inspections',720,NULL,150),(86,'inspection_basic','Basic Pre-purchase Inspection','inspection','inspections','inspections',730,NULL,120);
/*!40000 ALTER TABLE `service_catalog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `service_pricing`
--

LOCK TABLES `service_pricing` WRITE;
/*!40000 ALTER TABLE `service_pricing` DISABLE KEYS */;
INSERT  IGNORE INTO `service_pricing` VALUES (1,5,'UK-default',675.00,0.00,0.00,20.00),(2,2,'UK-default',280.00,0.00,0.00,20.00),(3,3,'UK-default',120.00,0.00,0.00,20.00),(4,4,'UK-default',150.00,0.00,0.00,20.00),(5,6,'UK-default',300.00,0.00,0.00,20.00),(6,7,'UK-default',270.00,0.00,0.00,20.00),(7,8,'UK-default',145.00,0.00,0.00,20.00),(8,9,'UK-default',135.00,0.00,0.00,20.00),(9,10,'UK-default',1150.00,0.00,0.00,20.00),(10,11,'UK-default',60.00,0.00,0.00,20.00),(11,12,'UK-default',155.00,0.00,0.00,20.00),(12,13,'UK-default',50.00,0.00,0.00,20.00),(13,14,'UK-default',90.00,0.00,0.00,20.00),(14,15,'UK-default',350.00,0.00,0.00,20.00),(15,16,'UK-default',310.00,0.00,0.00,20.00),(16,17,'UK-default',525.00,0.00,0.00,20.00),(17,18,'UK-default',240.00,0.00,0.00,20.00),(18,19,'UK-default',110.00,0.00,0.00,20.00),(19,20,'UK-default',180.00,0.00,0.00,20.00),(20,21,'UK-default',165.00,0.00,0.00,20.00),(21,22,'UK-default',95.00,0.00,0.00,20.00),(22,23,'UK-default',210.00,0.00,0.00,20.00),(23,24,'UK-default',140.00,0.00,0.00,20.00),(24,25,'UK-default',325.00,0.00,0.00,20.00),(25,26,'UK-default',300.00,0.00,0.00,20.00),(26,27,'UK-default',375.00,0.00,0.00,20.00),(27,28,'UK-default',690.00,0.00,0.00,20.00),(28,29,'UK-default',55.00,0.00,0.00,20.00),(29,30,'UK-default',260.00,0.00,0.00,20.00),(30,31,'UK-default',95.00,0.00,0.00,20.00),(31,1,'UK-default',399.00,0.00,0.00,20.00),(32,32,'UK-default',66.39,0.00,0.00,20.00),(33,33,'UK-default',66.39,0.00,0.00,20.00),(34,34,'UK-default',66.39,0.00,0.00,20.00),(35,35,'UK-default',66.39,0.00,0.00,20.00),(36,36,'UK-default',66.39,0.00,0.00,20.00),(37,37,'UK-default',66.39,0.00,0.00,20.00),(38,38,'UK-default',66.39,0.00,0.00,20.00),(39,39,'UK-default',66.39,0.00,0.00,20.00),(40,40,'UK-default',66.39,0.00,0.00,20.00),(41,41,'UK-default',66.39,0.00,0.00,20.00),(42,42,'UK-default',66.39,0.00,0.00,20.00),(43,43,'UK-default',66.39,0.00,0.00,20.00),(44,44,'UK-default',66.39,0.00,0.00,20.00),(45,45,'UK-default',66.39,0.00,0.00,20.00),(46,46,'UK-default',66.39,0.00,0.00,20.00),(47,47,'UK-default',66.39,0.00,0.00,20.00),(48,48,'UK-default',66.39,0.00,0.00,20.00),(49,49,'UK-default',66.39,0.00,0.00,20.00),(50,50,'UK-default',66.39,0.00,0.00,20.00),(51,51,'UK-default',66.39,0.00,0.00,20.00),(52,52,'UK-default',66.39,0.00,0.00,20.00),(53,53,'UK-default',66.39,0.00,0.00,20.00),(54,54,'UK-default',66.39,0.00,0.00,20.00),(55,55,'UK-default',66.39,0.00,0.00,20.00),(56,56,'UK-default',66.39,0.00,0.00,20.00),(57,57,'UK-default',66.39,0.00,0.00,20.00),(58,58,'UK-default',66.39,0.00,0.00,20.00),(59,59,'UK-default',66.39,0.00,0.00,20.00),(60,60,'UK-default',66.39,0.00,0.00,20.00),(61,61,'UK-default',66.39,0.00,0.00,20.00),(62,62,'UK-default',66.39,0.00,0.00,20.00),(63,63,'UK-default',66.39,0.00,0.00,20.00),(64,64,'UK-default',66.39,0.00,0.00,20.00),(65,65,'UK-default',66.39,0.00,0.00,20.00),(66,66,'UK-default',66.39,0.00,0.00,20.00),(67,67,'UK-default',66.39,0.00,0.00,20.00),(68,68,'UK-default',66.39,0.00,0.00,20.00),(69,69,'UK-default',66.39,0.00,0.00,20.00),(70,70,'UK-default',66.39,0.00,0.00,20.00),(71,71,'UK-default',66.39,0.00,0.00,20.00),(72,72,'UK-default',66.39,0.00,0.00,20.00),(73,73,'UK-default',66.39,0.00,0.00,20.00),(74,74,'UK-default',66.39,0.00,0.00,20.00),(75,75,'UK-default',66.39,0.00,0.00,20.00),(76,76,'UK-default',66.39,0.00,0.00,20.00),(77,77,'UK-default',208.25,0.00,0.00,20.00),(78,78,'UK-default',152.86,0.00,0.00,20.00),(79,79,'UK-default',123.45,0.00,0.00,20.00),(80,80,'UK-default',50.00,0.00,0.00,20.00),(81,81,'UK-default',98.00,0.00,0.00,20.00),(82,82,'UK-default',85.00,0.00,0.00,20.00),(83,83,'UK-default',190.00,0.00,0.00,20.00),(84,84,'UK-default',163.95,0.00,0.00,20.00),(85,85,'UK-default',114.29,0.00,0.00,20.00),(86,86,'UK-default',94.87,0.00,0.00,20.00);
/*!40000 ALTER TABLE `service_pricing` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `user_profiles`
--

LOCK TABLES `user_profiles` WRITE;
/*!40000 ALTER TABLE `user_profiles` DISABLE KEYS */;
INSERT  IGNORE INTO `user_profiles` VALUES (1,'Admin','User',NULL),(2,'Mia','Mechanic',NULL);
/*!40000 ALTER TABLE `user_profiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `user_roles`
--

LOCK TABLES `user_roles` WRITE;
/*!40000 ALTER TABLE `user_roles` DISABLE KEYS */;
INSERT  IGNORE INTO `user_roles` VALUES (1,'admin','2026-04-21 10:42:27'),(2,'mechanic','2026-04-21 10:42:27');
/*!40000 ALTER TABLE `user_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `user_security_settings`
--

LOCK TABLES `user_security_settings` WRITE;
/*!40000 ALTER TABLE `user_security_settings` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_security_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT  IGNORE INTO `users` VALUES (1,0xCA6200A33D6E11F189B0922C0F36AB92,'admin@smartworkshop.local','admin',NULL,'$2a$10$pbXVjfe4Dgc0Cx5m6IA72uB12zroFMoa90C8kf5b1Zu7d3bpPf6vK','admin','active','2026-04-21 10:42:27',NULL),(2,0xCA64B55A3D6E11F189B0922C0F36AB92,'mechanic@smartworkshop.local','mechanic',NULL,'$2a$10$CQaCFg3M8oXuZxU1y62OxeF/5XnbG51WoW9KRI16KwRZUJ6xrtMdu','mechanic','active','2026-04-21 10:42:27',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `vehicles`
--

LOCK TABLES `vehicles` WRITE;
/*!40000 ALTER TABLE `vehicles` DISABLE KEYS */;
/*!40000 ALTER TABLE `vehicles` ENABLE KEYS */;
UNLOCK TABLES;

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

-- Dump completed on 2026-04-21 11:33:14
