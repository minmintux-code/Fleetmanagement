-- ============================================================================
-- FLEET MANAGEMENT SYSTEM - PERFORMANCE INDEXES (MYSQL 8)
-- ============================================================================

USE `fleetmanagement_db`;

-- Indexes on users & auth
CREATE INDEX `idx_users_status` ON `users` (`status`, `is_deleted`);
CREATE INDEX `idx_role_permissions_role` ON `role_permissions` (`role_id`);
CREATE INDEX `idx_user_roles_user` ON `user_roles` (`user_id`);

-- Indexes on vehicles
CREATE INDEX `idx_vehicles_status` ON `vehicles` (`status`, `is_deleted`);
CREATE INDEX `idx_vehicles_type` ON `vehicles` (`vehicle_type_id`);
CREATE INDEX `idx_vehicles_fuel_type` ON `vehicles` (`fuel_type`);
CREATE INDEX `idx_vehicles_mileage` ON `vehicles` (`mileage`);

-- Indexes on drivers
CREATE INDEX `idx_drivers_status` ON `drivers` (`status`, `is_deleted`);
CREATE INDEX `idx_drivers_license_expiry` ON `drivers` (`license_expiry_date`);
CREATE INDEX `idx_drivers_assigned_vehicle` ON `drivers` (`assigned_vehicle_id`);

-- Indexes on trips & dispatch
CREATE INDEX `idx_trips_status` ON `trips` (`status`, `is_deleted`);
CREATE INDEX `idx_trips_scheduled_departure` ON `trips` (`scheduled_departure`);
CREATE INDEX `idx_trip_assignments_trip` ON `trip_assignments` (`trip_id`);
CREATE INDEX `idx_trip_assignments_vehicle` ON `trip_assignments` (`vehicle_id`);
CREATE INDEX `idx_trip_assignments_driver` ON `trip_assignments` (`driver_id`);

-- Indexes on rentals & payments
CREATE INDEX `idx_rentals_customer` ON `rentals` (`customer_id`);
CREATE INDEX `idx_rentals_vehicle` ON `rentals` (`vehicle_id`);
CREATE INDEX `idx_rentals_status` ON `rentals` (`status`, `is_deleted`);
CREATE INDEX `idx_payments_rental` ON `payments` (`rental_id`);
CREATE INDEX `idx_payments_customer` ON `payments` (`customer_id`);

-- Indexes on fuel logs & maintenance
CREATE INDEX `idx_fuel_logs_vehicle` ON `fuel_logs` (`vehicle_id`, `filled_at`);
CREATE INDEX `idx_fuel_logs_driver` ON `fuel_logs` (`driver_id`);
CREATE INDEX `idx_maintenance_vehicle` ON `maintenance` (`vehicle_id`, `scheduled_date`);
CREATE INDEX `idx_maintenance_status_priority` ON `maintenance` (`status`, `priority`);
CREATE INDEX `idx_service_schedule_due_date` ON `service_schedule` (`next_due_date`);

-- Indexes on expenses & documents
CREATE INDEX `idx_expenses_category` ON `expenses` (`category`);
CREATE INDEX `idx_expenses_vehicle` ON `expenses` (`vehicle_id`);
CREATE INDEX `idx_expenses_incurred_date` ON `expenses` (`incurred_date`);
CREATE INDEX `idx_documents_entity` ON `documents` (`entity_type`, `entity_id`);

-- Indexes on notifications & activity logs
CREATE INDEX `idx_notifications_user_read` ON `notifications` (`recipient_user_id`, `is_read`);
CREATE INDEX `idx_activity_logs_user` ON `activity_logs` (`user_id`, `timestamp`);
