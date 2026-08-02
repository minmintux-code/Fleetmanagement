-- ============================================================================
-- FLEET MANAGEMENT SYSTEM - CONSTRAINTS & CHECK RULES (MYSQL 8)
-- ============================================================================

USE `fleetmanagement_db`;

-- Add check constraints for valid ranges and enum states
ALTER TABLE `vehicles`
  ADD CONSTRAINT `chk_vehicles_mileage_positive` CHECK (`mileage` >= 0),
  ADD CONSTRAINT `chk_vehicles_fuel_capacity_positive` CHECK (`fuel_capacity` >= 0),
  ADD CONSTRAINT `chk_vehicles_fuel_level_range` CHECK (`current_fuel_level` >= 0 AND `current_fuel_level` <= 100);

ALTER TABLE `drivers`
  ADD CONSTRAINT `chk_drivers_safety_score_range` CHECK (`safety_score` >= 0 AND `safety_score` <= 100);

ALTER TABLE `trips`
  ADD CONSTRAINT `chk_trips_distance_positive` CHECK (`distance_km` >= 0);

ALTER TABLE `rentals`
  ADD CONSTRAINT `chk_rentals_daily_rate_positive` CHECK (`daily_rate_inr` >= 0),
  ADD CONSTRAINT `chk_rentals_total_cost_positive` CHECK (`total_cost_inr` >= 0),
  ADD CONSTRAINT `chk_rentals_dates_valid` CHECK (`end_date` >= `start_date`);

ALTER TABLE `payments`
  ADD CONSTRAINT `chk_payments_amount_positive` CHECK (`amount_inr` >= 0);

ALTER TABLE `fuel_logs`
  ADD CONSTRAINT `chk_fuel_logs_liters_positive` CHECK (`liters` >= 0),
  ADD CONSTRAINT `chk_fuel_logs_cost_positive` CHECK (`cost_per_liter_inr` >= 0 AND `total_cost_inr` >= 0);

ALTER TABLE `maintenance`
  ADD CONSTRAINT `chk_maintenance_estimated_cost_positive` CHECK (`estimated_cost_inr` >= 0);

ALTER TABLE `expenses`
  ADD CONSTRAINT `chk_expenses_amount_positive` CHECK (`amount_inr` >= 0);
