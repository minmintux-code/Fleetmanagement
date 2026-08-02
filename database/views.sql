-- ============================================================================
-- FLEET MANAGEMENT SYSTEM - ANALYTICS & REPORTING VIEWS (MYSQL 8)
-- Currency Standard: Indian Rupees (INR - ₹)
-- ============================================================================

USE `fleetmanagement_db`;

-- ----------------------------------------------------------------------------
-- View: vw_active_fleet_summary
-- Summarizes overall fleet vehicle statuses, current locations, and drivers
-- ----------------------------------------------------------------------------
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

-- ----------------------------------------------------------------------------
-- View: vw_monthly_fuel_costs_inr
-- Aggregates fuel expenditure per vehicle per calendar month in INR (₹)
-- ----------------------------------------------------------------------------
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

-- ----------------------------------------------------------------------------
-- View: vw_driver_performance_metrics
-- Aggregates completed trips, safety rating, and total distance driven
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW `vw_driver_performance_metrics` AS
SELECT 
  d.`id` AS `driver_id`,
  CONCAT(d.`first_name`, ' ', d.`last_name`) AS `driver_name`,
  d.`license_number`,
  d.`license_category`,
  d.`status` AS `driver_status`,
  d.`safety_score`,
  d.`total_trips_completed`,
  COALESCE(SUM(t.`distance_km`), 0) AS `total_distance_km_driven`
FROM `drivers` d
LEFT JOIN `trip_assignments` ta ON ta.`driver_id` = d.`id` AND ta.`is_deleted` = 0
LEFT JOIN `trips` t ON ta.`trip_id` = t.`id` AND t.`status` = 'COMPLETED' AND t.`is_deleted` = 0
WHERE d.`is_deleted` = 0
GROUP BY d.`id`, d.`first_name`, d.`last_name`, d.`license_number`, d.`license_category`, d.`status`, d.`safety_score`, d.`total_trips_completed`;
