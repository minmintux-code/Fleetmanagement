-- ============================================================================
-- FLEET MANAGEMENT SYSTEM - COMPREHENSIVE DEMO SEED DATA SCRIPT (MYSQL 8)
-- Currency Standard: Indian Rupees (INR - ₹)
-- Description: Inserts realistic sample data across all system tables.
-- ============================================================================

USE `fleetmanagement_db`;

SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------------------------------------------------------
-- 1. SEED ROLES
-- ----------------------------------------------------------------------------
INSERT INTO `roles` (`id`, `name`, `description`, `created_by`, `updated_by`) VALUES
(1, 'ADMIN', 'Full System Administrator with unrestricted access', 'SYSTEM', 'SYSTEM'),
(2, 'FLEET_MANAGER', 'Fleet operations manager controlling vehicles & drivers', 'SYSTEM', 'SYSTEM'),
(3, 'DISPATCHER', 'Trip dispatcher responsible for routing and assignments', 'SYSTEM', 'SYSTEM'),
(4, 'DRIVER', 'Commercial vehicle driver access', 'SYSTEM', 'SYSTEM'),
(5, 'MAINTENANCE_TECH', 'Vehicle service technician and workshop supervisor', 'SYSTEM', 'SYSTEM'),
(6, 'ACCOUNTANT', 'Financial accountant handling rentals, expenses, and billing', 'SYSTEM', 'SYSTEM')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`), `description` = VALUES(`description`);

-- ----------------------------------------------------------------------------
-- 2. SEED PERMISSIONS
-- ----------------------------------------------------------------------------
INSERT INTO `permissions` (`id`, `name`, `description`, `created_by`, `updated_by`) VALUES
(1, 'VEHICLE_READ', 'View vehicle inventory and real-time status', 'SYSTEM', 'SYSTEM'),
(2, 'VEHICLE_WRITE', 'Create, modify, and update vehicle specifications', 'SYSTEM', 'SYSTEM'),
(3, 'VEHICLE_DELETE', 'Soft delete or decommission vehicle entries', 'SYSTEM', 'SYSTEM'),
(4, 'DRIVER_READ', 'View driver roster and CDL details', 'SYSTEM', 'SYSTEM'),
(5, 'DRIVER_WRITE', 'Add, update, or assign drivers', 'SYSTEM', 'SYSTEM'),
(6, 'TRIP_READ', 'View scheduled, active, and past trip itineraries', 'SYSTEM', 'SYSTEM'),
(7, 'TRIP_DISPATCH', 'Create trips and dispatch drivers and vehicles', 'SYSTEM', 'SYSTEM'),
(8, 'RENTAL_READ', 'View customer rental agreements and lease contracts', 'SYSTEM', 'SYSTEM'),
(9, 'RENTAL_WRITE', 'Create and modify customer rental contracts', 'SYSTEM', 'SYSTEM'),
(10, 'MAINTENANCE_READ', 'View service schedules and repair work orders', 'SYSTEM', 'SYSTEM'),
(11, 'MAINTENANCE_WRITE', 'Schedule service and log completed repairs', 'SYSTEM', 'SYSTEM'),
(12, 'FINANCE_READ', 'View financial reports, fuel logs, and revenue metrics', 'SYSTEM', 'SYSTEM'),
(13, 'FINANCE_WRITE', 'Record payments, fuel refills, and operational expenses', 'SYSTEM', 'SYSTEM')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`), `description` = VALUES(`description`);

-- ----------------------------------------------------------------------------
-- 3. SEED ROLE PERMISSIONS
-- ----------------------------------------------------------------------------
DELETE FROM `role_permissions`;
INSERT INTO `role_permissions` (`role_id`, `permission_id`, `created_by`, `updated_by`) VALUES
-- ADMIN (All permissions 1..13)
(1, 1, 'SYSTEM', 'SYSTEM'), (1, 2, 'SYSTEM', 'SYSTEM'), (1, 3, 'SYSTEM', 'SYSTEM'),
(1, 4, 'SYSTEM', 'SYSTEM'), (1, 5, 'SYSTEM', 'SYSTEM'), (1, 6, 'SYSTEM', 'SYSTEM'),
(1, 7, 'SYSTEM', 'SYSTEM'), (1, 8, 'SYSTEM', 'SYSTEM'), (1, 9, 'SYSTEM', 'SYSTEM'),
(1, 10, 'SYSTEM', 'SYSTEM'), (1, 11, 'SYSTEM', 'SYSTEM'), (1, 12, 'SYSTEM', 'SYSTEM'), (1, 13, 'SYSTEM', 'SYSTEM'),
-- FLEET_MANAGER
(2, 1, 'SYSTEM', 'SYSTEM'), (2, 2, 'SYSTEM', 'SYSTEM'), (2, 4, 'SYSTEM', 'SYSTEM'), (2, 5, 'SYSTEM', 'SYSTEM'),
(2, 6, 'SYSTEM', 'SYSTEM'), (2, 7, 'SYSTEM', 'SYSTEM'), (2, 10, 'SYSTEM', 'SYSTEM'), (2, 11, 'SYSTEM', 'SYSTEM'), (2, 12, 'SYSTEM', 'SYSTEM'),
-- DISPATCHER
(3, 1, 'SYSTEM', 'SYSTEM'), (3, 4, 'SYSTEM', 'SYSTEM'), (3, 6, 'SYSTEM', 'SYSTEM'), (3, 7, 'SYSTEM', 'SYSTEM'),
-- DRIVER
(4, 1, 'SYSTEM', 'SYSTEM'), (4, 4, 'SYSTEM', 'SYSTEM'), (4, 6, 'SYSTEM', 'SYSTEM'),
-- MAINTENANCE_TECH
(5, 1, 'SYSTEM', 'SYSTEM'), (5, 10, 'SYSTEM', 'SYSTEM'), (5, 11, 'SYSTEM', 'SYSTEM'),
-- ACCOUNTANT
(6, 8, 'SYSTEM', 'SYSTEM'), (6, 9, 'SYSTEM', 'SYSTEM'), (6, 12, 'SYSTEM', 'SYSTEM'), (6, 13, 'SYSTEM', 'SYSTEM');

-- ----------------------------------------------------------------------------
-- 4. SEED USERS
-- ----------------------------------------------------------------------------
INSERT INTO `users` (`id`, `username`, `email`, `password_hash`, `full_name`, `phone`, `department`, `status`, `created_by`, `updated_by`) VALUES
(1, 'admin', 'admin@fleetmanagement.com', 'JAvlGPq9JyTdtvBO6x2llnRI1+gxwIyPqCKAn3THIKk=', 'System Administrator', '+91 9876543210', 'IT & Operations', 'ACTIVE', 'SYSTEM', 'SYSTEM'),
(2, 'testuser', 'testuser@fleetmanagement.com', 'O2Esdae1BIpDX7bsgeUv+S1teVqLWpwXBw9qY8l6U7I=', 'Test Operations User', '+91 9876543211', 'Fleet Operations', 'ACTIVE', 'SYSTEM', 'SYSTEM'),
(3, 'rajesh_mgr', 'rajesh.kumar@fleetmanagement.com', 'JAvlGPq9JyTdtvBO6x2llnRI1+gxwIyPqCKAn3THIKk=', 'Rajesh Kumar', '+91 9811223344', 'Fleet Management', 'ACTIVE', 'SYSTEM', 'SYSTEM'),
(4, 'priya_dispatch', 'priya.sharma@fleetmanagement.com', 'JAvlGPq9JyTdtvBO6x2llnRI1+gxwIyPqCKAn3THIKk=', 'Priya Sharma', '+91 9822334455', 'Dispatch Control', 'ACTIVE', 'SYSTEM', 'SYSTEM'),
(5, 'suresh_driver', 'suresh.raina@fleetmanagement.com', 'JAvlGPq9JyTdtvBO6x2llnRI1+gxwIyPqCKAn3THIKk=', 'Suresh Raina', '+91 9833445566', 'Driver Roster', 'ACTIVE', 'SYSTEM', 'SYSTEM'),
(6, 'vikram_driver', 'vikram.singh@fleetmanagement.com', 'JAvlGPq9JyTdtvBO6x2llnRI1+gxwIyPqCKAn3THIKk=', 'Vikram Singh', '+91 9844556677', 'Driver Roster', 'ACTIVE', 'SYSTEM', 'SYSTEM'),
(7, 'ramesh_tech', 'ramesh.patel@fleetmanagement.com', 'JAvlGPq9JyTdtvBO6x2llnRI1+gxwIyPqCKAn3THIKk=', 'Ramesh Patel', '+91 9855667788', 'Workshop Service', 'ACTIVE', 'SYSTEM', 'SYSTEM'),
(8, 'anita_acct', 'anita.desai@fleetmanagement.com', 'JAvlGPq9JyTdtvBO6x2llnRI1+gxwIyPqCKAn3THIKk=', 'Anita Desai', '+91 9866778899', 'Finance & Billing', 'ACTIVE', 'SYSTEM', 'SYSTEM')
ON DUPLICATE KEY UPDATE `username` = VALUES(`username`), `email` = VALUES(`email`), `full_name` = VALUES(`full_name`);

-- ----------------------------------------------------------------------------
-- 5. SEED USER ROLES
-- ----------------------------------------------------------------------------
DELETE FROM `user_roles`;
INSERT INTO `user_roles` (`user_id`, `role_id`, `created_by`, `updated_by`) VALUES
(1, 1, 'SYSTEM', 'SYSTEM'), -- Admin -> ADMIN
(2, 2, 'SYSTEM', 'SYSTEM'), -- Testuser -> FLEET_MANAGER
(3, 2, 'SYSTEM', 'SYSTEM'), -- Rajesh -> FLEET_MANAGER
(4, 3, 'SYSTEM', 'SYSTEM'), -- Priya -> DISPATCHER
(5, 4, 'SYSTEM', 'SYSTEM'), -- Suresh -> DRIVER
(6, 4, 'SYSTEM', 'SYSTEM'), -- Vikram -> DRIVER
(7, 5, 'SYSTEM', 'SYSTEM'), -- Ramesh -> MAINTENANCE_TECH
(8, 6, 'SYSTEM', 'SYSTEM'); -- Anita -> ACCOUNTANT

-- ----------------------------------------------------------------------------
-- 6. SEED VEHICLE TYPES
-- ----------------------------------------------------------------------------
INSERT INTO `vehicle_types` (`id`, `code`, `name`, `description`, `created_by`, `updated_by`) VALUES
(1, 'TRUCK', 'Heavy Haulage Commercial Truck', 'Multi-axle heavy duty cargo transport truck', 'SYSTEM', 'SYSTEM'),
(2, 'VAN', 'Light Commercial Delivery Van', 'Urban last-mile logistics distribution van', 'SYSTEM', 'SYSTEM'),
(3, 'EV_SEMI', 'Electric Heavy Semi Truck', 'Zero-emission electric long-haul semi tractor', 'SYSTEM', 'SYSTEM'),
(4, 'CONTAINER_HAULER', 'Container Freight Transporter', 'High capacity intermodal container tractor', 'SYSTEM', 'SYSTEM'),
(5, 'REFRIGERATED_VAN', 'Cold Chain Refrigerated Vehicle', 'Temperature-controlled cold transport for perishables', 'SYSTEM', 'SYSTEM')
ON DUPLICATE KEY UPDATE `code` = VALUES(`code`), `name` = VALUES(`name`), `description` = VALUES(`description`);

-- ----------------------------------------------------------------------------
-- 7. SEED VEHICLES
-- ----------------------------------------------------------------------------
INSERT INTO `vehicles` (`id`, `vin`, `plate_number`, `make`, `model`, `year`, `vehicle_type_id`, `fuel_type`, `status`, `mileage`, `fuel_capacity`, `current_fuel_level`, `location`, `created_by`, `updated_by`, `is_deleted`) VALUES
(1, 'MAT1234567890ABCD', 'TN01AB1234', 'Tata Motors', 'Prima 5530.S', 2023, 1, 'DIESEL', 'AVAILABLE', 45200.0, 400.0, 320.0, 'Chennai Main Depot', 'SYSTEM', 'SYSTEM', 0),
(2, 'AL2345678901BCDE2', 'KA05CD5678', 'Ashok Leyland', 'AVTR 2820', 2022, 1, 'DIESEL', 'IN_TRANSIT', 38400.0, 350.0, 210.0, 'Bengaluru Freight Terminal', 'SYSTEM', 'SYSTEM', 0),
(3, 'EC3456789012CDEF3', 'MH12EF9012', 'Eicher Motors', 'Pro 6055', 2021, 4, 'DIESEL', 'IN_MAINTENANCE', 62100.0, 450.0, 150.0, 'Mumbai Logistics Hub', 'SYSTEM', 'SYSTEM', 0),
(4, 'MH4567890123DEFG4', 'DL03GH3456', 'Mahindra', 'Treo Zor EV', 2024, 2, 'ELECTRIC', 'AVAILABLE', 12800.0, 80.0, 75.0, 'Delhi NCR Distribution Center', 'SYSTEM', 'SYSTEM', 0),
(5, 'BB5678901234EFGH5', 'AP09IJ7890', 'BharatBenz', '3528C Heavy Hauler', 2023, 1, 'DIESEL', 'AVAILABLE', 89000.0, 500.0, 420.0, 'Hyderabad Logistics Park', 'SYSTEM', 'SYSTEM', 0)
ON DUPLICATE KEY UPDATE `plate_number` = VALUES(`plate_number`), `make` = VALUES(`make`), `model` = VALUES(`model`), `status` = VALUES(`status`), `mileage` = VALUES(`mileage`);

-- ----------------------------------------------------------------------------
-- 8. SEED DRIVERS
-- ----------------------------------------------------------------------------
INSERT INTO `drivers` (`id`, `user_id`, `first_name`, `last_name`, `email`, `phone`, `license_number`, `license_category`, `license_expiry_date`, `status`, `safety_score`, `total_trips_completed`, `assigned_vehicle_id`, `joined_date`, `created_by`, `updated_by`, `is_deleted`) VALUES
(1, 5, 'Suresh', 'Raina', 'suresh.raina@fleetmanagement.com', '+91 9833445566', 'DL-TN0120180012345', 'COMMERCIAL_CDL', '2028-12-31', 'AVAILABLE', 98.5, 142, 1, '2020-01-15', 'SYSTEM', 'SYSTEM', 0),
(2, 6, 'Vikram', 'Singh', 'vikram.singh@fleetmanagement.com', '+91 9844556677', 'DL-KA0520190054321', 'COMMERCIAL_CDL', '2027-06-15', 'ON_TRIP', 96.0, 98, 2, '2021-03-20', 'SYSTEM', 'SYSTEM', 0),
(3, NULL, 'Amit', 'Verma', 'amit.verma@fleetmanagement.com', '+91 9877889900', 'DL-MH1220200098765', 'COMMERCIAL_CDL', '2026-11-20', 'AVAILABLE', 94.2, 76, NULL, '2022-07-10', 'SYSTEM', 'SYSTEM', 0),
(4, NULL, 'Rajesh', 'Kannan', 'rajesh.kannan@fleetmanagement.com', '+91 9899001122', 'DL-AP0920210045678', 'HAZMAT_CDL', '2029-03-10', 'ON_TRIP', 99.1, 185, 5, '2019-11-05', 'SYSTEM', 'SYSTEM', 0)
ON DUPLICATE KEY UPDATE `first_name` = VALUES(`first_name`), `last_name` = VALUES(`last_name`), `license_number` = VALUES(`license_number`), `safety_score` = VALUES(`safety_score`);

-- ----------------------------------------------------------------------------
-- 9. SEED TRIPS
-- ----------------------------------------------------------------------------
INSERT INTO `trips` (`id`, `trip_code`, `origin`, `destination`, `scheduled_departure`, `scheduled_arrival`, `actual_departure`, `actual_arrival`, `distance_km`, `status`, `cargo_description`, `notes`, `created_by`, `updated_by`, `is_deleted`) VALUES
(1, 'TRIP-2026-001', 'Chennai Port Container Depot', 'Bengaluru ICD Logistics Park', '2026-08-10 06:00:00', '2026-08-10 16:00:00', '2026-08-10 06:15:00', '2026-08-10 15:45:00', 350.0, 'COMPLETED', 'Auto Components & Industrial Machinery Parts', 'Delivered ahead of schedule without incident.', 'SYSTEM', 'SYSTEM', 0),
(2, 'TRIP-2026-002', 'Mumbai JNPT Port Terminal', 'Pune Chakan Industrial Hub', '2026-08-11 08:00:00', '2026-08-11 13:00:00', '2026-08-11 08:05:00', '2026-08-11 12:50:00', 150.0, 'COMPLETED', 'FMCG Consumer Packaged Goods', 'Express delivery completed successfully.', 'SYSTEM', 'SYSTEM', 0),
(3, 'TRIP-2026-003', 'Hyderabad Logistics Park', 'Vijayawada Highway Hub', '2026-08-12 07:00:00', '2026-08-12 14:00:00', '2026-08-12 07:10:00', NULL, 275.0, 'IN_TRANSIT', 'Agricultural Equipment & Spare Parts', 'En route via NH65.', 'SYSTEM', 'SYSTEM', 0),
(4, 'TRIP-2026-004', 'Delhi NCR Freight Hub', 'Jaipur Transport Nagar', '2026-08-13 05:30:00', '2026-08-13 12:00:00', NULL, NULL, 280.0, 'SCHEDULED', 'Textiles & Garment Consignment', 'Scheduled for early morning dispatch.', 'SYSTEM', 'SYSTEM', 0)
ON DUPLICATE KEY UPDATE `trip_code` = VALUES(`trip_code`), `status` = VALUES(`status`), `distance_km` = VALUES(`distance_km`);

-- ----------------------------------------------------------------------------
-- 10. SEED TRIP ASSIGNMENTS
-- ----------------------------------------------------------------------------
DELETE FROM `trip_assignments`;
INSERT INTO `trip_assignments` (`id`, `trip_id`, `vehicle_id`, `driver_id`, `assigned_at`, `status`, `created_by`, `updated_by`) VALUES
(1, 1, 1, 1, '2026-08-09 18:00:00', 'COMPLETED', 'SYSTEM', 'SYSTEM'),
(2, 2, 2, 2, '2026-08-10 17:00:00', 'COMPLETED', 'SYSTEM', 'SYSTEM'),
(3, 3, 5, 4, '2026-08-11 16:00:00', 'ASSIGNED', 'SYSTEM', 'SYSTEM'),
(4, 4, 4, 3, '2026-08-12 10:00:00', 'ASSIGNED', 'SYSTEM', 'SYSTEM');

-- ----------------------------------------------------------------------------
-- 11. SEED CUSTOMERS
-- ----------------------------------------------------------------------------
INSERT INTO `customers` (`id`, `name`, `company_name`, `email`, `phone`, `address`, `gst_tax_id`, `status`, `total_bookings`, `total_spent_inr`, `created_by`, `updated_by`, `is_deleted`) VALUES
(1, 'Anand Mahindra', 'Reliance Logistics Solutions Pvt Ltd', 'logistics@reliance.com', '+91 44 28123456', '100 Mount Road, Guindy, Chennai, TN - 600032', '33AAACR1234A1Z5', 'ACTIVE', 12, 450000.00, 'SYSTEM', 'SYSTEM', 0),
(2, 'Sunil Mittal', 'Flipkart Supply Chain Services', 'fleet.ops@flipkart.com', '+91 80 49123456', 'Outer Ring Road, Devarabeesanahalli, Bengaluru, KA - 560103', '29AABCF5678B1Z2', 'ACTIVE', 8, 310000.00, 'SYSTEM', 'SYSTEM', 0),
(3, 'Natarajan Chandrasekaran', 'Tata Croma Express', 'supplychain@croma.com', '+91 22 66123456', 'Bombay House, Homi Mody Street, Fort, Mumbai, MH - 400001', '27AAACT9012C1Z8', 'ACTIVE', 15, 680000.00, 'SYSTEM', 'SYSTEM', 0),
(4, 'Deepinder Goyal', 'Zomato Hyperpure Freight', 'hyperpure.fleet@zomato.com', '+91 124 4812345', 'DLF Phase 5, Gurugram, HR - 122002', '07AAAAA0000A1Z5', 'ACTIVE', 5, 185000.00, 'SYSTEM', 'SYSTEM', 0)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`), `company_name` = VALUES(`company_name`), `email` = VALUES(`email`);

-- ----------------------------------------------------------------------------
-- 12. SEED RENTALS
-- ----------------------------------------------------------------------------
INSERT INTO `rentals` (`id`, `rental_code`, `customer_id`, `vehicle_id`, `start_date`, `end_date`, `daily_rate_inr`, `total_cost_inr`, `deposit_amount_inr`, `status`, `notes`, `created_by`, `updated_by`, `is_deleted`) VALUES
(1, 'RENT-2026-101', 1, 1, '2026-08-01', '2026-08-15', 4500.00, 67500.00, 25000.00, 'ACTIVE', '15-day commercial heavy haulage lease agreement.', 'SYSTEM', 'SYSTEM', 0),
(2, 'RENT-2026-102', 2, 4, '2026-07-15', '2026-07-31', 2500.00, 40000.00, 15000.00, 'COMPLETED', 'EV Delivery Van urban distribution lease.', 'SYSTEM', 'SYSTEM', 0),
(3, 'RENT-2026-103', 3, 5, '2026-08-10', '2026-08-25', 5500.00, 82500.00, 30000.00, 'RESERVED', 'Container freight long distance contract.', 'SYSTEM', 'SYSTEM', 0)
ON DUPLICATE KEY UPDATE `rental_code` = VALUES(`rental_code`), `status` = VALUES(`status`), `total_cost_inr` = VALUES(`total_cost_inr`);

-- ----------------------------------------------------------------------------
-- 13. SEED PAYMENTS
-- ----------------------------------------------------------------------------
INSERT INTO `payments` (`id`, `payment_number`, `rental_id`, `customer_id`, `amount_inr`, `payment_date`, `payment_mode`, `transaction_reference`, `status`, `created_by`, `updated_by`, `is_deleted`) VALUES
(1, 'PAY-2026-501', 1, 1, 67500.00, '2026-08-01 11:30:00', 'NEFT', 'NEFT987654321098', 'SUCCESS', 'SYSTEM', 'SYSTEM', 0),
(2, 'PAY-2026-502', 2, 2, 40000.00, '2026-07-15 14:20:00', 'UPI', 'UPI-PAY-87654321', 'SUCCESS', 'SYSTEM', 'SYSTEM', 0),
(3, 'PAY-2026-503', 3, 3, 30000.00, '2026-08-10 09:15:00', 'CREDIT_CARD', 'CC-AUTH-45678901', 'SUCCESS', 'SYSTEM', 'SYSTEM', 0)
ON DUPLICATE KEY UPDATE `payment_number` = VALUES(`payment_number`), `amount_inr` = VALUES(`amount_inr`);

-- ----------------------------------------------------------------------------
-- 14. SEED FUEL LOGS
-- ----------------------------------------------------------------------------
INSERT INTO `fuel_logs` (`id`, `vehicle_id`, `driver_id`, `liters`, `cost_per_liter_inr`, `total_cost_inr`, `odometer_reading`, `station_name`, `fuel_card_number`, `filled_at`, `notes`, `created_by`, `updated_by`, `is_deleted`) VALUES
(1, 1, 1, 120.5, 92.50, 11146.25, 45200.0, 'IOCL Highway Station - Sriperumbudur', 'FC-IN-100234', '2026-08-09 07:30:00', 'Full tank refilled before Chennai to Bengaluru trip.', 'SYSTEM', 'SYSTEM', 0),
(2, 2, 2, 150.0, 93.10, 13965.00, 38400.0, 'BPCL Logistics Plaza - Hosur Highway', 'FC-IN-100567', '2026-08-10 19:15:00', 'Mid-route tank topping.', 'SYSTEM', 'SYSTEM', 0),
(3, 5, 4, 180.0, 91.80, 16524.00, 89000.0, 'HPCL Expressway Station - Shamshabad', 'FC-IN-100890', '2026-08-11 21:00:00', 'Full diesel refill prior to Vijayawada dispatch.', 'SYSTEM', 'SYSTEM', 0)
ON DUPLICATE KEY UPDATE `total_cost_inr` = VALUES(`total_cost_inr`), `odometer_reading` = VALUES(`odometer_reading`);

-- ----------------------------------------------------------------------------
-- 15. SEED MAINTENANCE WORK ORDERS
-- ----------------------------------------------------------------------------
INSERT INTO `maintenance` (`id`, `vehicle_id`, `type`, `priority`, `status`, `description`, `service_center`, `technician_name`, `estimated_cost_inr`, `actual_cost_inr`, `scheduled_date`, `completion_date`, `odometer_reading`, `notes`, `created_by`, `updated_by`, `is_deleted`) VALUES
(1, 3, 'CORRECTIVE', 'HIGH', 'IN_PROGRESS', 'Engine tuning, transmission oil replacement, and brake pad overhaul.', 'Eicher Authorized Service Center - Thane, Mumbai', 'Ramesh Patel', 35000.00, NULL, '2026-08-08', NULL, 62100.0, 'Vehicle under repair in bay 4.', 'SYSTEM', 'SYSTEM', 0),
(2, 1, 'PREVENTIVE', 'LOW', 'COMPLETED', 'Routine 45,000 KM service, oil filter swap, and multi-point safety inspection.', 'Tata Motors Commercial Hub - Ambattur, Chennai', 'Karthik Raja', 18500.00, 17800.00, '2026-08-02', '2026-08-03', 44800.0, 'Passed all safety and emission tests.', 'SYSTEM', 'SYSTEM', 0)
ON DUPLICATE KEY UPDATE `description` = VALUES(`description`), `status` = VALUES(`status`), `estimated_cost_inr` = VALUES(`estimated_cost_inr`);

-- ----------------------------------------------------------------------------
-- 16. SEED SERVICE SCHEDULE
-- ----------------------------------------------------------------------------
INSERT INTO `service_schedule` (`id`, `vehicle_id`, `service_name`, `interval_km`, `interval_months`, `last_service_date`, `last_service_km`, `next_due_date`, `next_due_km`, `status`, `created_by`, `updated_by`, `is_deleted`) VALUES
(1, 1, '50,000 KM Scheduled Major Inspection', 10000.0, 6, '2026-08-03', 44800.0, '2027-02-03', 54800.0, 'PENDING', 'SYSTEM', 'SYSTEM', 0),
(2, 2, 'Transmission Fluid & Differential Service', 15000.0, 6, '2026-05-10', 30000.0, '2026-11-10', 45000.0, 'PENDING', 'SYSTEM', 'SYSTEM', 0),
(3, 4, 'EV Battery Cell Balancing & Firmware Diagnostic', 20000.0, 12, '2026-02-15', 5000.0, '2027-02-15', 25000.0, 'PENDING', 'SYSTEM', 'SYSTEM', 0)
ON DUPLICATE KEY UPDATE `service_name` = VALUES(`service_name`), `status` = VALUES(`status`);

-- ----------------------------------------------------------------------------
-- 17. SEED EXPENSES
-- ----------------------------------------------------------------------------
INSERT INTO `expenses` (`id`, `expense_number`, `category`, `amount_inr`, `vehicle_id`, `trip_id`, `driver_id`, `incurred_date`, `vendor_name`, `receipt_number`, `status`, `approved_by`, `notes`, `created_by`, `updated_by`, `is_deleted`) VALUES
(1, 'EXP-2026-801', 'TOLL_FEE', 1850.00, 1, 1, 1, '2026-08-10', 'NHAI FASTag Toll Plaza', 'FT-8877665544', 'APPROVED', 'Rajesh Kumar', 'Chennai-Bengaluru FASTag electronic toll charges.', 'SYSTEM', 'SYSTEM', 0),
(2, 'EXP-2026-802', 'DRIVER_ALLOWANCE', 2500.00, 2, 2, 2, '2026-08-11', 'Fleet Operations Cash Desk', 'ALLOW-009988', 'APPROVED', 'Rajesh Kumar', 'Night halt and driver daily travel allowance (BTA).', 'SYSTEM', 'SYSTEM', 0),
(3, 'EXP-2026-803', 'INSURANCE', 42000.00, 5, NULL, NULL, '2026-08-01', 'ICICI Lombard General Insurance', 'POL-INS-334455', 'APPROVED', 'System Administrator', 'Annual comprehensive fleet commercial insurance premium.', 'SYSTEM', 'SYSTEM', 0)
ON DUPLICATE KEY UPDATE `expense_number` = VALUES(`expense_number`), `amount_inr` = VALUES(`amount_inr`);

-- ----------------------------------------------------------------------------
-- 18. SEED DOCUMENTS
-- ----------------------------------------------------------------------------
INSERT INTO `documents` (`id`, `document_name`, `document_type`, `file_path`, `file_size_bytes`, `mime_type`, `entity_type`, `entity_id`, `expiry_date`, `created_by`, `updated_by`, `is_deleted`) VALUES
(1, 'Tata_Prima_Vehicle_RC_Book.pdf', 'VEHICLE_REGISTRATION', '/documents/vehicles/TN01AB1234_RC.pdf', 1048576, 'application/pdf', 'VEHICLE', 1, '2038-05-15', 'SYSTEM', 'SYSTEM', 0),
(2, 'Suresh_Raina_CDL_License.pdf', 'DRIVER_LICENSE', '/documents/drivers/DL_Suresh_Raina.pdf', 524288, 'application/pdf', 'DRIVER', 1, '2028-12-31', 'SYSTEM', 'SYSTEM', 0),
(3, 'Fleet_Comprehensive_Insurance_Policy.pdf', 'INSURANCE_POLICY', '/documents/insurance/Fleet_Policy_2026.pdf', 2097152, 'application/pdf', 'VEHICLE', 5, '2027-07-31', 'SYSTEM', 'SYSTEM', 0)
ON DUPLICATE KEY UPDATE `document_name` = VALUES(`document_name`), `document_type` = VALUES(`document_type`);

-- ----------------------------------------------------------------------------
-- 19. SEED NOTIFICATIONS
-- ----------------------------------------------------------------------------
INSERT INTO `notifications` (`id`, `title`, `message`, `type`, `category`, `timestamp`, `is_read`, `link_url`, `recipient_user_id`, `created_by`, `updated_by`, `is_deleted`) VALUES
(1, 'CDL License Expiry Warning', 'Driver Amit Verma commercial driving license expires in 90 days. Please arrange renewal.', 'WARNING', 'DRIVER', '2026-08-12 08:00:00', 0, '/drivers/3', 3, 'SYSTEM', 'SYSTEM', 0),
(2, 'Work Order Update: Maintenance', 'Eicher Pro 6055 corrective repairs are currently IN_PROGRESS at Thane workshop.', 'INFO', 'MAINTENANCE', '2026-08-11 14:30:00', 1, '/maintenance/1', 2, 'SYSTEM', 'SYSTEM', 0),
(3, 'Trip Dispatch Completed', 'TRIP-2026-001 (Chennai to Bengaluru) successfully delivered. Odometer & fuel updated.', 'SUCCESS', 'TRIP', '2026-08-10 16:00:00', 1, '/trips/1', 4, 'SYSTEM', 'SYSTEM', 0)
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`), `message` = VALUES(`message`);

-- ----------------------------------------------------------------------------
-- 20. SEED DASHBOARD STATISTICS
-- ----------------------------------------------------------------------------
INSERT INTO `dashboard_statistics` (`id`, `stat_date`, `total_vehicles`, `active_vehicles`, `maintenance_vehicles`, `total_drivers`, `active_drivers`, `ongoing_trips`, `completed_trips_month`, `total_fuel_cost_inr`, `total_maintenance_cost_inr`, `total_revenue_inr`, `fleet_utilization_rate`, `created_by`, `updated_by`, `is_deleted`) VALUES
(1, '2026-08-10', 5, 4, 1, 4, 3, 1, 14, 25111.25, 17800.00, 107500.00, 80.0, 'SYSTEM', 'SYSTEM', 0),
(2, '2026-08-11', 5, 4, 1, 4, 3, 1, 15, 41635.25, 17800.00, 147500.00, 80.0, 'SYSTEM', 'SYSTEM', 0),
(3, '2026-08-12', 5, 4, 1, 4, 3, 1, 16, 41635.25, 52800.00, 190000.00, 80.0, 'SYSTEM', 'SYSTEM', 0)
ON DUPLICATE KEY UPDATE `stat_date` = VALUES(`stat_date`), `total_revenue_inr` = VALUES(`total_revenue_inr`);

-- ----------------------------------------------------------------------------
-- 21. SEED ACTIVITY LOGS
-- ----------------------------------------------------------------------------
INSERT INTO `activity_logs` (`id`, `user_id`, `username`, `action`, `entity_name`, `entity_id`, `ip_address`, `user_agent`, `timestamp`, `created_by`, `updated_by`, `is_deleted`) VALUES
(1, 1, 'admin', 'INITIALIZE_SEED_DATA', 'DATABASE', 1, '127.0.0.1', 'FleetManager/1.0', '2026-08-12 12:00:00', 'SYSTEM', 'SYSTEM', 0),
(2, 3, 'rajesh_mgr', 'CREATE_VEHICLE', 'VEHICLE', 1, '192.168.1.50', 'Mozilla/5.0', '2026-08-10 09:30:00', 'SYSTEM', 'SYSTEM', 0),
(3, 4, 'priya_dispatch', 'DISPATCH_TRIP', 'TRIP', 1, '192.168.1.51', 'Mozilla/5.0', '2026-08-10 10:00:00', 'SYSTEM', 'SYSTEM', 0);

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
-- SEED DATA SCRIPT EXECUTED SUCCESSFULLY
-- ============================================================================
