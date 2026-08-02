-- ============================================================================
-- FLEET MANAGEMENT SYSTEM - TRIGGERS & AUDIT AUTOMATION (MYSQL 8)
-- ============================================================================

USE `fleetmanagement_db`;

DELIMITER $$

-- Trigger: Automatically sync driver total_trips_completed upon trip completion
DROP TRIGGER IF EXISTS `trg_after_trip_completed`$$
CREATE TRIGGER `trg_after_trip_completed`
AFTER UPDATE ON `trips`
FOR EACH ROW
BEGIN
  IF NEW.`status` = 'COMPLETED' AND OLD.`status` != 'COMPLETED' THEN
    UPDATE `drivers` d
    JOIN `trip_assignments` ta ON ta.`driver_id` = d.`id`
    SET d.`total_trips_completed` = d.`total_trips_completed` + 1
    WHERE ta.`trip_id` = NEW.`id`;
  END IF;
END$$

-- Trigger: Automatically update vehicle mileage upon fuel log entry if higher
DROP TRIGGER IF EXISTS `trg_after_fuel_log_inserted`$$
CREATE TRIGGER `trg_after_fuel_log_inserted`
AFTER INSERT ON `fuel_logs`
FOR EACH ROW
BEGIN
  UPDATE `vehicles`
  SET `mileage` = GREATEST(`mileage`, NEW.`odometer_reading`)
  WHERE `id` = NEW.`vehicle_id`;
END$$

DELIMITER ;
