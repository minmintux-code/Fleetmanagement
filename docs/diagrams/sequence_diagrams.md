# System Sequence Diagrams

This document contains detailed end-to-end interaction sequence diagrams for key operational workflows in the **Fleet Manager** system.

---

## 1. User Authentication Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    actor User as Fleet Administrator
    participant UI as React Login Page
    participant AuthContext as AuthContext Provider
    participant API as Axios Service Layer
    participant Controller as AuthController (/api/auth)
    participant Repo as UserRepository
    participant DB as MySQL Database

    User->>UI: Input Credentials (email, password)
    UI->>AuthContext: login(email)
    AuthContext->>API: authService.login(email)
    API->>Controller: POST /api/auth/login
    Controller->>Repo: findByEmailAndIsDeletedFalse(email)
    Repo->>DB: SELECT * FROM users WHERE email = ? AND is_deleted = 0
    DB-->>Repo: User Record
    Repo-->>Controller: Optional<User>
    Controller-->>API: 200 OK (JSON User + JWT Token)
    API->>AuthContext: Save Token & User in LocalStorage
    AuthContext-->>UI: Set Auth State (Authenticated)
    UI-->>User: Navigate to Dashboard Screen
```

---

## 2. Vehicle Registration Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    actor Dispatcher as Fleet Manager
    participant Modal as VehicleForm Modal
    participant API as vehicleService.ts
    participant Controller as VehicleController (/api/vehicles)
    participant Repo as VehicleRepository
    participant DB as MySQL Database

    Dispatcher->>Modal: Fill VIN, Plate Number, Make, Model, Fuel Type
    Dispatcher->>Modal: Click "Register Vehicle"
    Modal->>API: vehicleService.createVehicle(payload)
    API->>Controller: POST /api/vehicles
    Controller->>Repo: save(Vehicle entity)
    Repo->>DB: INSERT INTO vehicles (...) VALUES (...)
    DB-->>Repo: Saved Entity with Auto-ID
    Repo-->>Controller: Vehicle Entity
    Controller-->>API: 200 OK (Saved Vehicle JSON)
    API-->>Modal: Success Toast & Refresh Grid
    Modal-->>Dispatcher: Vehicle Visible in Table
```

---

## 3. Driver Registration Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    actor Admin as Fleet Manager
    participant UI as DriverForm Modal
    participant Service as driverService.ts
    participant Controller as DriverController (/api/drivers)
    participant Repo as DriverRepository
    participant DB as MySQL 8 Database

    Admin->>UI: Submit First/Last Name, License #, Expiry Date, Phone
    UI->>Service: driverService.createDriver(data)
    Service->>Controller: POST /api/drivers
    Controller->>Repo: save(Driver entity)
    Repo->>DB: INSERT INTO drivers (...) VALUES (...)
    DB-->>Repo: Saved Driver Record
    Repo-->>Controller: Driver Entity
    Controller-->>Service: 200 OK (Driver JSON)
    Service-->>UI: Update Local Driver State
    UI-->>Admin: Show Success Notification
```

---

## 4. Trip Assignment Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    actor Dispatcher as Fleet Dispatcher
    participant UI as TripForm Modal
    participant Service as tripService.ts
    participant Controller as TripController (/api/trips)
    participant Repo as TripRepository
    participant DB as MySQL 8 Database

    Dispatcher->>UI: Select Origin, Destination, Vehicle & Driver
    UI->>Service: tripService.createTrip(tripPayload)
    Service->>Controller: POST /api/trips
    Controller->>Repo: save(Trip entity)
    Repo->>DB: INSERT INTO trips & trip_assignments
    DB-->>Repo: Saved Trip & Assignment Records
    Repo-->>Controller: Trip Entity
    Controller-->>Service: 200 OK (Trip JSON)
    Service-->>UI: Close Modal & Refresh Dispatch Table
    UI-->>Dispatcher: Display "Trip Scheduled Successfully"
```

---

## 5. Fuel Log Entry Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    actor Driver as Driver / Fleet Manager
    participant UI as FuelForm Modal
    participant Service as fuelService.ts
    participant Controller as FuelController (/api/fuel)
    participant Repo as FuelLogRepository
    participant DB as MySQL Database
    participant Trigger as trg_after_fuel_log_inserted

    Driver->>UI: Enter Liters, Cost Per Liter (₹), Odometer, Station
    UI->>Service: fuelService.createFuelLog(fuelData)
    Service->>Controller: POST /api/fuel
    Controller->>Repo: save(FuelLog entity)
    Repo->>DB: INSERT INTO fuel_logs (...) VALUES (...)
    DB->>Trigger: Execute Odometer Sync Trigger
    Trigger->>DB: UPDATE vehicles SET mileage = GREATEST(...)
    DB-->>Repo: Saved Fuel Log Record
    Repo-->>Controller: FuelLog Entity
    Controller-->>Service: 200 OK (Fuel Log JSON)
    Service-->>UI: Refresh Fuel Expenses Table
    UI-->>Driver: Update Total Fuel Cost in INR
```

---

## 6. Maintenance Work Order Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    actor Manager as Fleet Manager
    participant UI as MaintenanceForm Modal
    participant Service as maintenanceService.ts
    participant Controller as MaintenanceController (/api/maintenance)
    participant Repo as MaintenanceRepository
    participant DB as MySQL Database

    Manager->>UI: Fill Service Center, Estimated Cost (₹), Scheduled Date
    UI->>Service: maintenanceService.createRecord(payload)
    Service->>Controller: POST /api/maintenance
    Controller->>Repo: save(Maintenance entity)
    Repo->>DB: INSERT INTO maintenance (...) VALUES (...)
    DB-->>Repo: Saved Maintenance Record
    Repo-->>Controller: Maintenance Entity
    Controller-->>Service: 200 OK (Maintenance JSON)
    Service-->>UI: Refresh Maintenance Log Grid
    UI-->>Manager: Display Work Order Scheduled
```

---

## 7. Customer Rental Contract Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    actor Manager as Rental Manager
    participant UI as RentalForm Modal
    participant Service as rentalService.ts
    participant Controller as RentalController (/api/rentals)
    participant Repo as RentalRepository
    participant DB as MySQL Database

    Manager->>UI: Select Customer, Vehicle, Start/End Date, Daily Rate (₹)
    UI->>Service: rentalService.createRental(rentalPayload)
    Service->>Controller: POST /api/rentals
    Controller->>Repo: save(Rental entity)
    Repo->>DB: INSERT INTO rentals (...) VALUES (...)
    DB-->>Repo: Saved Rental Record
    Repo-->>Controller: Rental Entity
    Controller-->>Service: 200 OK (Rental JSON)
    Service-->>UI: Refresh Rental Contracts Table
    UI-->>Manager: Contract Created Successfully
```

---

## 8. Payment Flow Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    actor Accountant as Fleet Accountant
    participant UI as Payments UI
    participant Service as API Layer
    participant Controller as Payment API Controller
    participant DB as MySQL Database

    Accountant->>UI: Enter Amount (₹), Mode (UPI/Card), Reference #
    UI->>Service: POST /api/payments
    Service->>Controller: Process Payment Record
    Controller->>DB: INSERT INTO payments (...)
    DB-->>Controller: Payment Confirmation ID
    Controller-->>Service: 200 OK Success
    Service-->>UI: Update Total Revenue Snapshot
```

---

## 9. Notification Broadcast Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    actor System as System Event (e.g. Service Due)
    participant Controller as NotificationController (/api/notifications)
    participant Repo as NotificationRepository
    participant UI as NotificationPanel
    actor User as Fleet Administrator

    System->>Controller: Trigger Warning Alert
    Controller->>Repo: save(Notification entity)
    Repo->>DB: INSERT INTO notifications (...)
    UI->>Controller: GET /api/notifications
    Controller-->>UI: 200 OK (List of Notifications)
    UI-->>User: Display Alert Badge & Slide-over Item
```
