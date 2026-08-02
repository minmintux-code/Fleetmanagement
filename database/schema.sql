-- ============================================================================
-- FLEET MANAGEMENT SYSTEM - PRODUCTION DATABASE SCHEMA (MYSQL 8)
-- PHASE 2: DATABASE DESIGN & ARCHITECTURE
-- Currency Standard: Indian Rupees (INR - ₹)
-- Demo Data: NONE (Empty Production Database Structure Only)
-- ============================================================================

CREATE DATABASE IF NOT EXISTS `fleetmanagement_db`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE `fleetmanagement_db`;

-- Disable FK checks during schema creation
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------------------------------------------------------
-- Table: roles
-- ----------------------------------------------------------------------------
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

-- ----------------------------------------------------------------------------
-- Table: permissions
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `permissions`;
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

-- ----------------------------------------------------------------------------
-- Table: role_permissions
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `role_permissions`;
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

-- ----------------------------------------------------------------------------
-- Table: users
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `users`;
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

-- ----------------------------------------------------------------------------
-- Table: user_roles
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `user_roles`;
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

-- ----------------------------------------------------------------------------
-- Table: vehicle_types
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `vehicle_types`;
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

-- ----------------------------------------------------------------------------
-- Table: vehicles
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `vehicles`;
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

-- ----------------------------------------------------------------------------
-- Table: drivers
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `drivers`;
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

-- ----------------------------------------------------------------------------
-- Table: trips
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `trips`;
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

-- ----------------------------------------------------------------------------
-- Table: trip_assignments
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `trip_assignments`;
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

-- ----------------------------------------------------------------------------
-- Table: customers
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `customers`;
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

-- ----------------------------------------------------------------------------
-- Table: rentals
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `rentals`;
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

-- ----------------------------------------------------------------------------
-- Table: payments
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `payments`;
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

-- ----------------------------------------------------------------------------
-- Table: fuel_logs
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `fuel_logs`;
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

-- ----------------------------------------------------------------------------
-- Table: maintenance
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `maintenance`;
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

-- ----------------------------------------------------------------------------
-- Table: service_schedule
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `service_schedule`;
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

-- ----------------------------------------------------------------------------
-- Table: expenses
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `expenses`;
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

-- ----------------------------------------------------------------------------
-- Table: documents
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `documents`;
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

-- ----------------------------------------------------------------------------
-- Table: notifications
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `notifications`;
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

-- ----------------------------------------------------------------------------
-- Table: dashboard_statistics
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `dashboard_statistics`;
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

-- ----------------------------------------------------------------------------
-- Table: activity_logs
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `activity_logs`;
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

-- Enable FK checks
SET FOREIGN_KEY_CHECKS = 1;
