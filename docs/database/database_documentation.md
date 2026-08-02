# Database Data Dictionary Specification

This document presents the complete MySQL 8 data dictionary for the **Fleet Manager** system (`fleetmanagement_db`). All tables comply with **3NF normalization** rules and standard audit columns (`id`, `created_at`, `updated_at`, `created_by`, `updated_by`, `is_deleted`).

---

## 1. Table Summary Overview

| Table Name | Entity Class | Primary Key | Foreign Keys | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `roles` | `Role` | `id` (BIGINT) | None | User authorization roles (`ADMIN`, `MANAGER`, etc.) |
| `permissions` | `Permission` | `id` (BIGINT) | None | System permissions (`VEHICLE_WRITE`, `TRIP_DISPATCH`) |
| `role_permissions` | `RolePermission` | `id` (BIGINT) | `role_id`, `permission_id` | Mapping table connecting roles to permissions |
| `users` | `User` | `id` (BIGINT) | None | System users and credentials |
| `user_roles` | `UserRole` | `id` (BIGINT) | `user_id`, `role_id` | Mapping table connecting users to roles |
| `vehicle_types` | `VehicleType` | `id` (BIGINT) | None | Vehicle categories (`TRUCK`, `VAN`, `EV_SEMI`) |
| `vehicles` | `Vehicle` | `id` (BIGINT) | `vehicle_type_id` | Fleet vehicle assets, status, and mileage |
| `drivers` | `Driver` | `id` (BIGINT) | `user_id`, `assigned_vehicle_id` | Commercial drivers & CDL details |
| `trips` | `Trip` | `id` (BIGINT) | None | Dispatch route itineraries |
| `trip_assignments` | `TripAssignment` | `id` (BIGINT) | `trip_id`, `vehicle_id`, `driver_id` | Operation assignments connecting trip, vehicle, driver |
| `customers` | `Customer` | `id` (BIGINT) | None | Corporate clients & GST details |
| `rentals` | `Rental` | `id` (BIGINT) | `customer_id`, `vehicle_id` | Vehicle lease contracts & rates in INR (₹) |
| `payments` | `Payment` | `id` (BIGINT) | `rental_id`, `customer_id` | Transactions & payment modes in INR (₹) |
| `fuel_logs` | `FuelLog` | `id` (BIGINT) | `vehicle_id`, `driver_id` | Fuel refill logs & costs per liter in INR (₹) |
| `maintenance` | `Maintenance` | `id` (BIGINT) | `vehicle_id` | Repair work orders & estimated costs in INR (₹) |
| `service_schedule` | `ServiceSchedule` | `id` (BIGINT) | `vehicle_id` | Interval service schedules (KM/Months) |
| `expenses` | `Expense` | `id` (BIGINT) | `vehicle_id`, `trip_id`, `driver_id` | Operating expenses in INR (₹) |
| `documents` | `Document` | `id` (BIGINT) | None | Document files & expiry dates |
| `notifications` | `Notification` | `id` (BIGINT) | `recipient_user_id` | Alerts and notification logs |
| `dashboard_statistics`| `DashboardStatistic`| `id` (BIGINT) | None | Daily aggregated snapshot metrics in INR (₹) |
| `activity_logs` | `ActivityLog` | `id` (BIGINT) | `user_id` | Security audit trail logs |

---

## 2. Table Column Specifications

### Table: `vehicles`
Stores core physical fleet vehicle details.

| Column Name | Data Type | Nullable | Key | Default | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `BIGINT` | NO | PK | AUTO_INCREMENT | Unique vehicle ID |
| `vin` | `VARCHAR(17)` | NO | UK | NULL | Vehicle Identification Number |
| `plate_number` | `VARCHAR(20)` | NO | UK | NULL | Registration license plate |
| `make` | `VARCHAR(50)` | NO | - | NULL | Manufacturer make |
| `model` | `VARCHAR(50)` | NO | - | NULL | Model name |
| `year` | `INT` | NO | - | NULL | Manufacture year |
| `vehicle_type_id`| `BIGINT` | NO | FK | NULL | FK to `vehicle_types(id)` |
| `fuel_type` | `VARCHAR(20)` | NO | - | `'DIESEL'` | Fuel type (DIESEL/ELECTRIC/CNG) |
| `status` | `VARCHAR(30)` | NO | INDEX| `'AVAILABLE'` | Vehicle state |
| `mileage` | `DOUBLE` | NO | - | `0.0` | Odometer reading in KM |
| `fuel_capacity` | `DOUBLE` | NO | - | `0.0` | Fuel tank capacity in Liters |
| `current_fuel_level`|`DOUBLE` | NO | - | `0.0` | Current fuel percentage |
| `location` | `VARCHAR(255)`| YES | - | NULL | Current hub/location |
| `created_at` | `DATETIME` | NO | - | `CURRENT_TIMESTAMP` | Audit creation time |
| `updated_at` | `DATETIME` | NO | - | `CURRENT_TIMESTAMP` | Audit update time |
| `created_by` | `VARCHAR(100)`| NO | - | `'SYSTEM'` | User who created record |
| `updated_by` | `VARCHAR(100)`| NO | - | `'SYSTEM'` | User who updated record |
| `is_deleted` | `TINYINT(1)` | NO | INDEX| `0` | Soft-delete flag |

---

### Table: `rentals`
Stores customer vehicle rental agreements. All rates in **INR (₹)**.

| Column Name | Data Type | Nullable | Key | Default | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `BIGINT` | NO | PK | AUTO_INCREMENT | Unique rental contract ID |
| `rental_code` | `VARCHAR(50)` | NO | UK | NULL | Unique contract code |
| `customer_id` | `BIGINT` | NO | FK | NULL | FK to `customers(id)` |
| `vehicle_id` | `BIGINT` | NO | FK | NULL | FK to `vehicles(id)` |
| `start_date` | `DATE` | NO | - | NULL | Rental start date |
| `end_date` | `DATE` | NO | - | NULL | Rental end date |
| `daily_rate_inr` | `DECIMAL(12,2)`| NO | - | `0.00` | Daily rate in Indian Rupees (₹) |
| `total_cost_inr` | `DECIMAL(14,2)`| NO | - | `0.00` | Total cost in Indian Rupees (₹) |
| `deposit_amount_inr`|`DECIMAL(12,2)`| NO | - | `0.00` | Security deposit in INR (₹) |
| `status` | `VARCHAR(30)` | NO | INDEX| `'RESERVED'` | Contract status |
| `notes` | `TEXT` | YES | - | NULL | Contract notes |

---

### Table: `fuel_logs`
Stores fuel refill logs. All monetary amounts in **INR (₹)**.

| Column Name | Data Type | Nullable | Key | Default | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `BIGINT` | NO | PK | AUTO_INCREMENT | Unique fuel log ID |
| `vehicle_id` | `BIGINT` | NO | FK | NULL | FK to `vehicles(id)` |
| `driver_id` | `BIGINT` | NO | FK | NULL | FK to `drivers(id)` |
| `liters` | `DOUBLE` | NO | - | `0.0` | Volume refilled in Liters |
| `cost_per_liter_inr`|`DECIMAL(10,2)`| NO | - | `0.00` | Price per Liter in INR (₹) |
| `total_cost_inr` | `DECIMAL(12,2)`| NO | - | `0.00` | Total cost in INR (₹) |
| `odometer_reading`| `DOUBLE` | NO | - | `0.0` | Odometer reading at refill |
| `station_name` | `VARCHAR(100)`| NO | - | NULL | Fuel station name |
| `filled_at` | `DATETIME` | NO | INDEX| `CURRENT_TIMESTAMP` | Refill timestamp |

---

## 3. Database Indexing Strategy

Targeted B-Tree indexes created to optimize high-cardinality searches and reporting queries:

```sql
CREATE INDEX `idx_users_status` ON `users` (`status`, `is_deleted`);
CREATE INDEX `idx_vehicles_status` ON `vehicles` (`status`, `is_deleted`);
CREATE INDEX `idx_drivers_status` ON `drivers` (`status`, `is_deleted`);
CREATE INDEX `idx_trips_status` ON `trips` (`status`, `is_deleted`);
CREATE INDEX `idx_rentals_status` ON `rentals` (`status`, `is_deleted`);
CREATE INDEX `idx_fuel_logs_vehicle` ON `fuel_logs` (`vehicle_id`, `filled_at`);
CREATE INDEX `idx_maintenance_vehicle` ON `maintenance` (`vehicle_id`, `scheduled_date`);
CREATE INDEX `idx_expenses_category` ON `expenses` (`category`);
```
