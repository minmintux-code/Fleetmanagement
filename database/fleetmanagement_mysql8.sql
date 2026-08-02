-- ============================================================================
-- FLEET MANAGEMENT SYSTEM - MASTER MYSQL WORKBENCH DATABASE SCRIPT (MYSQL 8)
-- Currency Standard: Indian Rupees (INR - ₹)
-- Demo Data: NONE (Empty Production Database Structure Only)
-- Instructions: Open in MySQL Workbench and click 'Execute Script' (⚡)
-- ============================================================================

CREATE DATABASE IF NOT EXISTS `fleetmanagement_db`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE `fleetmanagement_db`;

SET FOREIGN_KEY_CHECKS = 0;

-- 1. TABLES DEFINITION (3NF NORMALIZED WITH AUDIT COLUMNS)
DROP TABLE IF EXISTS `activity_logs`;
DROP TABLE IF EXISTS `dashboard_statistics`;
DROP TABLE IF EXISTS `notifications`;
DROP TABLE IF EXISTS `documents`;
DROP TABLE IF EXISTS `expenses`;
DROP TABLE IF EXISTS `service_schedule`;
DROP TABLE IF EXISTS `maintenance`;
DROP TABLE IF EXISTS `fuel_logs`;
DROP TABLE IF EXISTS `payments`;
DROP TABLE IF EXISTS `rentals`;
DROP TABLE IF EXISTS `customers`;
DROP TABLE IF EXISTS `trip_assignments`;
DROP TABLE IF EXISTS `trips`;
DROP TABLE IF EXISTS `drivers`;
DROP TABLE IF EXISTS `vehicles`;
DROP TABLE IF EXISTS `vehicle_types`;
DROP TABLE IF EXISTS `user_roles`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `role_permissions`;
DROP TABLE IF EXISTS `permissions`;
DROP TABLE IF EXISTS `roles`;

CREATE TABLE `roles` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  `description` VARCHAR(255) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` VARCHAR(100) NOT NULL DEFAULT 'SYSTEM',
  `updated_by` VARCHAR(100) NOT NULL DEFAULT 'SYSTEM',
  `is_deleted` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_roles_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `permissions` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `description` VARCHAR(255) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` VARCHAR(100) NOT NULL DEFAULT 'SYSTEM',
  `updated_by` VARCHAR(100) NOT NULL DEFAULT 'SYSTEM',
  `is_deleted` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_permissions_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `role_permissions` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `role_id` BIGINT NOT NULL,
  `permission_id` BIGINT NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` VARCHAR(100) NOT NULL DEFAULT 'SYSTEM',
  `updated_by` VARCHAR(100) NOT NULL DEFAULT 'SYSTEM',
  `is_deleted` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `users` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `full_name` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(20) DEFAULT NULL,
  `department` VARCHAR(100) DEFAULT NULL,
  `status` VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
  `avatar_url` VARCHAR(255) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` VARCHAR(100) NOT NULL DEFAULT 'SYSTEM',
  `updated_by` VARCHAR(100) NOT NULL DEFAULT 'SYSTEM',
  `is_deleted` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_users_username` (`username`),
  UNIQUE KEY `uk_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `user_roles` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL,
  `role_id` BIGINT NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` VARCHAR(100) NOT NULL DEFAULT 'SYSTEM',
  `updated_by` VARCHAR(100) NOT NULL DEFAULT 'SYSTEM',
  `is_deleted` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `vehicle_types` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `code` VARCHAR(30) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `description` VARCHAR(255) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` VARCHAR(100) NOT NULL DEFAULT 'SYSTEM',
  `updated_by` VARCHAR(100) NOT NULL DEFAULT 'SYSTEM',
  `is_deleted` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_vehicle_types_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `vehicles` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `vin` VARCHAR(17) NOT NULL,
  `plate_number` VARCHAR(20) NOT NULL,
  `make` VARCHAR(50) NOT NULL,
  `model` VARCHAR(50) NOT NULL,
  `year` INT NOT NULL,
  `vehicle_type_id` BIGINT NOT NULL,
  `fuel_type` VARCHAR(20) NOT NULL DEFAULT 'DIESEL',
  `status` VARCHAR(30) NOT NULL DEFAULT 'AVAILABLE',
  `mileage` DOUBLE NOT NULL DEFAULT 0.0,
  `fuel_capacity` DOUBLE NOT NULL DEFAULT 0.0,
  `current_fuel_level` DOUBLE NOT NULL DEFAULT 0.0,
  `location` VARCHAR(255) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` VARCHAR(100) NOT NULL DEFAULT 'SYSTEM',
  `updated_by` VARCHAR(100) NOT NULL DEFAULT 'SYSTEM',
  `is_deleted` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_vehicles_vin` (`vin`),
  UNIQUE KEY `uk_vehicles_plate` (`plate_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `drivers` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT DEFAULT NULL,
  `first_name` VARCHAR(50) NOT NULL,
  `last_name` VARCHAR(50) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `license_number` VARCHAR(50) NOT NULL,
  `license_category` VARCHAR(30) NOT NULL DEFAULT 'COMMERCIAL_CDL',
  `license_expiry_date` DATE NOT NULL,
  `status` VARCHAR(30) NOT NULL DEFAULT 'AVAILABLE',
  `safety_score` DOUBLE NOT NULL DEFAULT 100.0,
  `total_trips_completed` INT NOT NULL DEFAULT 0,
  `assigned_vehicle_id` BIGINT DEFAULT NULL,
  `joined_date` DATE DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` VARCHAR(100) NOT NULL DEFAULT 'SYSTEM',
  `updated_by` VARCHAR(100) NOT NULL DEFAULT 'SYSTEM',
  `is_deleted` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_drivers_license` (`license_number`),
  UNIQUE KEY `uk_drivers_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `trips` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `trip_code` VARCHAR(50) NOT NULL,
  `origin` VARCHAR(255) NOT NULL,
  `destination` VARCHAR(255) NOT NULL,
  `scheduled_departure` DATETIME NOT NULL,
  `scheduled_arrival` DATETIME NOT NULL,
  `actual_departure` DATETIME DEFAULT NULL,
  `actual_arrival` DATETIME DEFAULT NULL,
  `distance_km` DOUBLE NOT NULL DEFAULT 0.0,
  `status` VARCHAR(30) NOT NULL DEFAULT 'SCHEDULED',
  `cargo_description` TEXT DEFAULT NULL,
  `notes` TEXT DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` VARCHAR(100) NOT NULL DEFAULT 'SYSTEM',
  `updated_by` VARCHAR(100) NOT NULL DEFAULT 'SYSTEM',
  `is_deleted` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_trips_code` (`trip_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `trip_assignments` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `trip_id` BIGINT NOT NULL,
  `vehicle_id` BIGINT NOT NULL,
  `driver_id` BIGINT NOT NULL,
  `assigned_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` VARCHAR(30) NOT NULL DEFAULT 'ASSIGNED',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` VARCHAR(100) NOT NULL DEFAULT 'SYSTEM',
  `updated_by` VARCHAR(100) NOT NULL DEFAULT 'SYSTEM',
  `is_deleted` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `customers` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `company_name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `address` TEXT NOT NULL,
  `gst_tax_id` VARCHAR(50) DEFAULT NULL,
  `status` VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
  `total_bookings` INT NOT NULL DEFAULT 0,
  `total_spent_inr` DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` VARCHAR(100) NOT NULL DEFAULT 'SYSTEM',
  `updated_by` VARCHAR(100) NOT NULL DEFAULT 'SYSTEM',
  `is_deleted` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_customers_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `rentals` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `rental_code` VARCHAR(50) NOT NULL,
  `customer_id` BIGINT NOT NULL,
  `vehicle_id` BIGINT NOT NULL,
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL,
  `daily_rate_inr` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `total_cost_inr` DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  `deposit_amount_inr` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `status` VARCHAR(30) NOT NULL DEFAULT 'RESERVED',
  `notes` TEXT DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` VARCHAR(100) NOT NULL DEFAULT 'SYSTEM',
  `updated_by` VARCHAR(100) NOT NULL DEFAULT 'SYSTEM',
  `is_deleted` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_rentals_code` (`rental_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `payments` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `payment_number` VARCHAR(50) NOT NULL,
  `rental_id` BIGINT DEFAULT NULL,
  `customer_id` BIGINT DEFAULT NULL,
  `amount_inr` DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  `payment_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `payment_mode` VARCHAR(30) NOT NULL DEFAULT 'UPI',
  `transaction_reference` VARCHAR(100) DEFAULT NULL,
  `status` VARCHAR(20) NOT NULL DEFAULT 'SUCCESS',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` VARCHAR(100) NOT NULL DEFAULT 'SYSTEM',
  `updated_by` VARCHAR(100) NOT NULL DEFAULT 'SYSTEM',
  `is_deleted` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_payments_number` (`payment_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `fuel_logs` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `vehicle_id` BIGINT NOT NULL,
  `driver_id` BIGINT NOT NULL,
  `liters` DOUBLE NOT NULL DEFAULT 0.0,
  `cost_per_liter_inr` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `total_cost_inr` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `odometer_reading` DOUBLE NOT NULL DEFAULT 0.0,
  `station_name` VARCHAR(100) NOT NULL,
  `fuel_card_number` VARCHAR(50) DEFAULT NULL,
  `filled_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `notes` TEXT DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` VARCHAR(100) NOT NULL DEFAULT 'SYSTEM',
  `updated_by` VARCHAR(100) NOT NULL DEFAULT 'SYSTEM',
  `is_deleted` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `maintenance` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `vehicle_id` BIGINT NOT NULL,
  `type` VARCHAR(30) NOT NULL DEFAULT 'PREVENTIVE',
  `priority` VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
  `status` VARCHAR(30) NOT NULL DEFAULT 'SCHEDULED',
  `description` TEXT NOT NULL,
  `service_center` VARCHAR(100) NOT NULL,
  `technician_name` VARCHAR(100) DEFAULT NULL,
  `estimated_cost_inr` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `actual_cost_inr` DECIMAL(12,2) DEFAULT NULL,
  `scheduled_date` DATE NOT NULL,
  `completion_date` DATE DEFAULT NULL,
  `odometer_reading` DOUBLE NOT NULL DEFAULT 0.0,
  `notes` TEXT DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` VARCHAR(100) NOT NULL DEFAULT 'SYSTEM',
  `updated_by` VARCHAR(100) NOT NULL DEFAULT 'SYSTEM',
  `is_deleted` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `service_schedule` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `vehicle_id` BIGINT NOT NULL,
  `service_name` VARCHAR(100) NOT NULL,
  `interval_km` DOUBLE NOT NULL DEFAULT 10000.0,
  `interval_months` INT NOT NULL DEFAULT 6,
  `last_service_date` DATE DEFAULT NULL,
  `last_service_km` DOUBLE DEFAULT NULL,
  `next_due_date` DATE DEFAULT NULL,
  `next_due_km` DOUBLE DEFAULT NULL,
  `status` VARCHAR(20) NOT NULL DEFAULT 'PENDING',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` VARCHAR(100) NOT NULL DEFAULT 'SYSTEM',
  `updated_by` VARCHAR(100) NOT NULL DEFAULT 'SYSTEM',
  `is_deleted` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `expenses` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `expense_number` VARCHAR(50) NOT NULL,
  `category` VARCHAR(40) NOT NULL DEFAULT 'MISCELLANEOUS',
  `amount_inr` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `vehicle_id` BIGINT DEFAULT NULL,
  `trip_id` BIGINT DEFAULT NULL,
  `driver_id` BIGINT DEFAULT NULL,
  `incurred_date` DATE NOT NULL,
  `vendor_name` VARCHAR(100) DEFAULT NULL,
  `receipt_number` VARCHAR(50) DEFAULT NULL,
  `status` VARCHAR(20) NOT NULL DEFAULT 'PENDING',
  `approved_by` VARCHAR(100) DEFAULT NULL,
  `notes` TEXT DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` VARCHAR(100) NOT NULL DEFAULT 'SYSTEM',
  `updated_by` VARCHAR(100) NOT NULL DEFAULT 'SYSTEM',
  `is_deleted` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_expenses_number` (`expense_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `documents` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `document_name` VARCHAR(150) NOT NULL,
  `document_type` VARCHAR(50) NOT NULL,
  `file_path` VARCHAR(255) NOT NULL,
  `file_size_bytes` BIGINT NOT NULL DEFAULT 0,
  `mime_type` VARCHAR(50) DEFAULT NULL,
  `entity_type` VARCHAR(30) NOT NULL,
  `entity_id` BIGINT NOT NULL,
  `expiry_date` DATE DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` VARCHAR(100) NOT NULL DEFAULT 'SYSTEM',
  `updated_by` VARCHAR(100) NOT NULL DEFAULT 'SYSTEM',
  `is_deleted` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `notifications` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(150) NOT NULL,
  `message` TEXT NOT NULL,
  `type` VARCHAR(20) NOT NULL DEFAULT 'INFO',
  `category` VARCHAR(30) NOT NULL DEFAULT 'SYSTEM',
  `timestamp` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_read` TINYINT(1) NOT NULL DEFAULT 0,
  `link_url` VARCHAR(255) DEFAULT NULL,
  `recipient_user_id` BIGINT DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` VARCHAR(100) NOT NULL DEFAULT 'SYSTEM',
  `updated_by` VARCHAR(100) NOT NULL DEFAULT 'SYSTEM',
  `is_deleted` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `dashboard_statistics` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `stat_date` DATE NOT NULL,
  `total_vehicles` INT NOT NULL DEFAULT 0,
  `active_vehicles` INT NOT NULL DEFAULT 0,
  `maintenance_vehicles` INT NOT NULL DEFAULT 0,
  `total_drivers` INT NOT NULL DEFAULT 0,
  `active_drivers` INT NOT NULL DEFAULT 0,
  `ongoing_trips` INT NOT NULL DEFAULT 0,
  `completed_trips_month` INT NOT NULL DEFAULT 0,
  `total_fuel_cost_inr` DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  `total_maintenance_cost_inr` DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  `total_revenue_inr` DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  `fleet_utilization_rate` DOUBLE NOT NULL DEFAULT 0.00,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` VARCHAR(100) NOT NULL DEFAULT 'SYSTEM',
  `updated_by` VARCHAR(100) NOT NULL DEFAULT 'SYSTEM',
  `is_deleted` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_dashboard_stat_date` (`stat_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `activity_logs` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT DEFAULT NULL,
  `username` VARCHAR(50) DEFAULT NULL,
  `action` VARCHAR(100) NOT NULL,
  `entity_name` VARCHAR(50) NOT NULL,
  `entity_id` BIGINT DEFAULT NULL,
  `ip_address` VARCHAR(45) DEFAULT NULL,
  `user_agent` VARCHAR(255) DEFAULT NULL,
  `timestamp` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` VARCHAR(100) NOT NULL DEFAULT 'SYSTEM',
  `updated_by` VARCHAR(100) NOT NULL DEFAULT 'SYSTEM',
  `is_deleted` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. FOREIGN KEYS
ALTER TABLE `role_permissions`
  ADD CONSTRAINT `fk_role_permissions_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_role_permissions_permission` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `user_roles`
  ADD CONSTRAINT `fk_user_roles_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_user_roles_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `vehicles`
  ADD CONSTRAINT `fk_vehicles_vehicle_type` FOREIGN KEY (`vehicle_type_id`) REFERENCES `vehicle_types` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `drivers`
  ADD CONSTRAINT `fk_drivers_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_drivers_assigned_vehicle` FOREIGN KEY (`assigned_vehicle_id`) REFERENCES `vehicles` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `trip_assignments`
  ADD CONSTRAINT `fk_trip_assignments_trip` FOREIGN KEY (`trip_id`) REFERENCES `trips` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_trip_assignments_vehicle` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_trip_assignments_driver` FOREIGN KEY (`driver_id`) REFERENCES `drivers` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `rentals`
  ADD CONSTRAINT `fk_rentals_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_rentals_vehicle` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `payments`
  ADD CONSTRAINT `fk_payments_rental` FOREIGN KEY (`rental_id`) REFERENCES `rentals` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_payments_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `fuel_logs`
  ADD CONSTRAINT `fk_fuel_logs_vehicle` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_fuel_logs_driver` FOREIGN KEY (`driver_id`) REFERENCES `drivers` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `maintenance`
  ADD CONSTRAINT `fk_maintenance_vehicle` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `service_schedule`
  ADD CONSTRAINT `fk_service_schedule_vehicle` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `expenses`
  ADD CONSTRAINT `fk_expenses_vehicle` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_expenses_trip` FOREIGN KEY (`trip_id`) REFERENCES `trips` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_expenses_driver` FOREIGN KEY (`driver_id`) REFERENCES `drivers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `notifications`
  ADD CONSTRAINT `fk_notifications_user` FOREIGN KEY (`recipient_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `activity_logs`
  ADD CONSTRAINT `fk_activity_logs_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- 3. INDEXES
CREATE INDEX `idx_users_status` ON `users` (`status`, `is_deleted`);
CREATE INDEX `idx_vehicles_status` ON `vehicles` (`status`, `is_deleted`);
CREATE INDEX `idx_drivers_status` ON `drivers` (`status`, `is_deleted`);
CREATE INDEX `idx_trips_status` ON `trips` (`status`, `is_deleted`);
CREATE INDEX `idx_rentals_status` ON `rentals` (`status`, `is_deleted`);
CREATE INDEX `idx_fuel_logs_vehicle` ON `fuel_logs` (`vehicle_id`, `filled_at`);
CREATE INDEX `idx_maintenance_vehicle` ON `maintenance` (`vehicle_id`, `scheduled_date`);
CREATE INDEX `idx_expenses_category` ON `expenses` (`category`);

-- 4. REPORTING VIEWS
CREATE OR REPLACE VIEW `vw_active_fleet_summary` AS
SELECT 
  v.`id` AS `vehicle_id`,
  v.`plate_number`,
  v.`vin`,
  v.`make`,
  v.`model`,
  v.`year`,
  vt.`name` AS `vehicle_type`,
  v.`fuel_type`,
  v.`status` AS `vehicle_status`,
  v.`mileage`,
  v.`current_fuel_level`,
  v.`location`,
  d.`id` AS `assigned_driver_id`,
  CONCAT(d.`first_name`, ' ', d.`last_name`) AS `assigned_driver_name`,
  d.`phone` AS `driver_phone`
FROM `vehicles` v
JOIN `vehicle_types` vt ON v.`vehicle_type_id` = vt.`id`
LEFT JOIN `drivers` d ON d.`assigned_vehicle_id` = v.`id` AND d.`is_deleted` = 0
WHERE v.`is_deleted` = 0;

CREATE OR REPLACE VIEW `vw_monthly_fuel_costs_inr` AS
SELECT 
  v.`id` AS `vehicle_id`,
  v.`plate_number`,
  DATE_FORMAT(fl.`filled_at`, '%Y-%m') AS `refill_month`,
  COUNT(fl.`id`) AS `refill_count`,
  SUM(fl.`liters`) AS `total_liters`,
  SUM(fl.`total_cost_inr`) AS `total_fuel_cost_inr`
FROM `fuel_logs` fl
JOIN `vehicles` v ON fl.`vehicle_id` = v.`id`
WHERE fl.`is_deleted` = 0 AND v.`is_deleted` = 0
GROUP BY v.`id`, v.`plate_number`, DATE_FORMAT(fl.`filled_at`, '%Y-%m');

SET FOREIGN_KEY_CHECKS = 1;
