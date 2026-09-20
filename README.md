# Fleet Management System

A web-based fleet management application built as a final-year capstone project. The system provides a centralized platform to manage vehicles, drivers, trips, maintenance schedules, fuel logs, system notifications, and real-time dashboard statistics.

---

## 1. Project Overview

The **Fleet Management System** is designed to streamline day-to-day fleet operation tasks for transportation and logistics management. In many traditional setups, fleet records—such as vehicle details, driver assignments, fuel expenses, and routine maintenance—are tracked manually across separate spreadsheets or paperwork. This project integrates all these operational areas into a single web-based management platform.

### Purpose & Objectives
- **Centralized Vehicle & Driver Management:** Store and manage complete profiles for all fleet vehicles and drivers in one place.
- **Trip Scheduling & Dispatching:** Assign drivers to vehicles, set routes, track start/end times, and monitor status updates (Planned, In Progress, Completed).
- **Maintenance & Expense Tracking:** Log routine service schedules, repairs, and associated costs to minimize vehicle downtime.
- **Fuel Consumption Monitoring:** Record fuel fill-ups, costs, and odometer readings to keep track of operational costs and fuel efficiency.
- **Alerts & Dashboard Statistics:** Summarize fleet performance, pending maintenance tasks, and active trips using a unified dashboard view.

---

## 2. Technology Stack

### Frontend
- **Framework / Library:** React.js (v19)
- **Build Tool:** Vite
- **HTTP Client:** Axios
- **Styling:** CSS & Bootstrap 5
- **Animations:** Framer Motion
- **Icons:** Lucide React

### Backend
- **Language:** Java 17
- **Framework:** Spring Boot (v4.1)
- **Web Layer:** Spring Web / MVC
- **Persistence Layer:** Spring Data JPA / Hibernate
- **Security:** Spring Security
- **Build Tool:** Maven

### Database
- **Database Engine:** MySQL 8

### Development Tools
- **Version Control:** Git & GitHub
- **IDE / Environment:** VS Code / Antigravity

---

## 3. System Architecture & Diagrams

The system follows a standard multi-tier client-server architecture. The React frontend interacts with the Spring Boot REST APIs, which execute business logic and access the MySQL database via Spring Data JPA.

### 3.1 High-Level Architecture
```text
FLEET MANAGEMENT SYSTEM
        │
 ┌──────┴───────┐
 ▼              ▼
REACT         SPRING BOOT
FRONTEND      BACKEND
 │              │
 ├ Dashboard    ├ Controllers
 ├ Vehicles     ├ Services
 ├ Drivers      ├ Repositories
 ├ Trips        ├ JPA / Hibernate
 ├ Maintenance  └ Security
 ├ Fuel              │
 └ Notifications     │
        │            │
        └── REST API ┘
              │
              ▼
           MYSQL 8
              │
      ┌───────┼────────┐
      ▼       ▼        ▼
    USERS  VEHICLES  DRIVERS
      │       │        │
      └───────┼────────┘
              ▼
       TRIPS / FUEL /
       MAINTENANCE /
       NOTIFICATIONS
```

### 3.2 Full System Execution Flow
```text
USER
 │
 ▼
WEB BROWSER
 │
 ▼
REACT FRONTEND
 │
 │ HTTP / REST
 ▼
SPRING BOOT SERVER
 │
 ├ Controllers
 ├ Services
 ├ Repositories
 ├ JPA / Hibernate
 └ Security
 │
 ▼
MYSQL 8 DATABASE
 │
 ├ Users
 ├ Vehicles
 ├ Drivers
 ├ Trips
 ├ Maintenance
 ├ Fuel
 ├ Notifications
 ├ Vehicle Types
 └ Dashboard Statistics
```

### 3.3 Data Flow Architecture (User Action to Database)
```text
USER ACTION
    │
    ▼
REACT FRONTEND
    │
    │ HTTP / REST API
    ▼
CONTROLLER
    │
    ▼
SERVICE
    │
    ▼
REPOSITORY
    │
    ▼
JPA / HIBERNATE
    │
    ▼
MYSQL DATABASE
    │
    ▼
DATA RESPONSE
    │
    ▼
REACT FRONTEND
    │
    ▼
UPDATED SCREEN
```

### 3.4 Step-by-Step Feature Data Flow (Example: Adding a Vehicle)
```text
ADD VEHICLE
     │
     ▼
React Form
     │
     ▼
POST /api/vehicles
     │
     ▼
VehicleController
     │
     ▼
VehicleService
     │
     ▼
VehicleRepository
     │
     ▼
vehicles TABLE
     │
     ▼
Saved Vehicle
     │
     ▼
React Dashboard
```

### 3.5 Backend Architecture Layers
```text
APPLICATION
     │
     ▼
SPRING BOOT
     │
     ▼
JPA / HIBERNATE
     │
     ▼
MYSQL 8
     │
 ┌───┼──────────────────────────────┐
 ▼   ▼        ▼        ▼            ▼
USERS VEHICLES DRIVERS TRIPS VEHICLE_TYPES
 │      │        │        │
 │      │        │        ├── vehicle_id
 │      │        │        └── driver_id
 │      │        │
 │      │        ├── user_id
 │      │        └── assigned_vehicle_id
 │      │
 │      ├── vehicle_type_id
 │      ├── vehicle_id → MAINTENANCE
 │      └── vehicle_id → FUEL
 │
 ├── user_id → NOTIFICATIONS
 └── recipient_user_id → NOTIFICATIONS
```

### 3.6 User Navigation & Module Flow
```text
USER
 │
 ▼
LOGIN
 │
 ▼
DASHBOARD
 │
 ├──► VEHICLES
 │      └── Add / Edit / Delete / View
 │
 ├──► DRIVERS
 │      └── Add / Edit / Assign / View
 │
 ├──► TRIPS
 │      └── Create / Update / Complete
 │
 ├──► MAINTENANCE
 │      └── Schedule / Update / Complete
 │
 ├──► FUEL
 │      └── Add Fuel / Cost / Mileage
 │
 └──► NOTIFICATIONS
        └── Alerts / Updates
                 │
                 ▼
          SPRING BOOT API
                 │
                 ▼
             MYSQL DB
```

---

## 4. Database Design & Relationships

The MySQL database (`fleetmanagement_db`) consists of tables representing the core domain entities.

### 4.1 Relational Architecture Diagram
```text
MYSQL DATABASE
      │
 ┌────┼─────────────────────────────┐
 ▼    ▼        ▼        ▼           ▼
USERS VEHICLES DRIVERS  TRIPS  VEHICLE_TYPES
 │      │        │        │           │
 │      │        │        │           │
 │      │        ├─ user_id ───────► USERS.id
 │      │        └─ assigned_vehicle_id ─► VEHICLES.id
 │      │
 │      ├─ vehicle_type_id ────────► VEHICLE_TYPES.id
 │      ├─ vehicle_id ─────────────► MAINTENANCE.vehicle_id
 │      └─ vehicle_id ─────────────► FUEL.vehicle_id
 │
 ├─ user_id ───────────────────────► NOTIFICATIONS.user_id
 └─ recipient_user_id ─────────────► NOTIFICATIONS.recipient_user_id

DRIVERS.id ────────────────────────► TRIPS.driver_id
VEHICLES.id ───────────────────────► TRIPS.vehicle_id
```

### 4.2 Foreign Key Reference Mapping
```text
users.id
 ├──► drivers.user_id
 └──► notifications.user_id

vehicles.id
 ├──► drivers.assigned_vehicle_id
 ├──► trips.vehicle_id
 ├──► maintenance.vehicle_id
 └──► fuel.vehicle_id

drivers.id
 ├──► trips.driver_id
 └──► fuel.driver_id

vehicle_types.id
 └──► vehicles.vehicle_type_id
```

---

## 5. Project Directory Structure

```text
fleet-master/
├── src/main/java/com/fleetmanagement/
│   ├── FleetmanagementApplication.java
│   ├── config/
│   │   └── SecurityConfig.java
│   ├── controller/
│   │   ├── DashboardStatisticsController.java
│   │   ├── DriverController.java
│   │   ├── FuelController.java
│   │   ├── MaintenanceController.java
│   │   ├── NotificationController.java
│   │   ├── TripController.java
│   │   ├── UserController.java
│   │   ├── VehicleController.java
│   │   └── VehicleTypeController.java
│   ├── entity/
│   │   ├── DashboardStatistics.java
│   │   ├── Driver.java
│   │   ├── Fuel.java
│   │   ├── Maintenance.java
│   │   ├── Notification.java
│   │   ├── Trip.java
│   │   ├── User.java
│   │   ├── Vehicle.java
│   │   └── VehicleType.java
│   ├── repository/
│   │   ├── DashboardStatisticsRepository.java
│   │   ├── DriverRepository.java
│   │   ├── FuelRepository.java
│   │   ├── MaintenanceRepository.java
│   │   ├── NotificationRepository.java
│   │   ├── TripRepository.java
│   │   ├── UserRepository.java
│   │   ├── VehicleRepository.java
│   │   └── VehicleTypeRepository.java
│   └── service/
│       ├── DashboardStatisticsService.java
│       ├── DriverService.java
│       ├── FuelService.java
│       ├── MaintenanceService.java
│       ├── NotificationService.java
│       ├── TripService.java
│       ├── UserService.java
│       ├── VehicleService.java
│       └── VehicleTypeService.java
├── src/main/resources/
│   └── application.properties
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── pom.xml
└── README.md
```

---

## 6. Key Features & Functionality

1. **Dashboard & Fleet Analytics**
   - Summary cards displaying total vehicles, active trips, scheduled maintenance, and total driver counts.
   - Quick overview metrics calculated dynamically from backend endpoints.

2. **Vehicle Management**
   - Add new vehicles with plate number, VIN, make, model, year, fuel type, mileage, and vehicle type.
   - Update vehicle information and toggle active/maintenance status.
   - Soft deletion support (`is_deleted` field).

3. **Driver Management**
   - Register drivers with license number, phone, email, and current availability status.
   - Assign vehicles directly to drivers (`assigned_vehicle_id`).

4. **Trip Planning & Tracking**
   - Create new trip dispatches specifying driver, vehicle, start location, destination, and scheduled departure.
   - Track status progress (Planned, In Progress, Completed, Cancelled).

5. **Maintenance Scheduling**
   - Log service requests, oil changes, engine inspections, and repairs.
   - Track estimated and actual maintenance costs and status.

6. **Fuel Logs**
   - Record fuel refills with fuel volume, cost per unit, total cost, and current odometer reading.
   - Link records to specific vehicles and drivers for cost audit.

7. **System Notifications**
   - View system notifications and operational alerts.

---

## 7. REST API Endpoints Summary

Below is a summary of the backend REST endpoints available in the application:

| Controller Module | Endpoint Base | Supported Methods | Description |
| :--- | :--- | :--- | :--- |
| **Vehicles** | `/api/vehicles` | `GET`, `POST`, `PUT`, `DELETE` | CRUD operations for fleet vehicles |
| **Drivers** | `/api/drivers` | `GET`, `POST`, `PUT`, `DELETE` | Manage driver records and assignments |
| **Trips** | `/api/trips` | `GET`, `POST`, `PUT`, `DELETE` | Create, update, and manage trip logs |
| **Maintenance** | `/api/maintenance` | `GET`, `POST`, `PUT`, `DELETE` | Log and track vehicle service records |
| **Fuel** | `/api/fuel` | `GET`, `POST`, `PUT`, `DELETE` | Track fuel logs and expenses |
| **Notifications** | `/api/notifications` | `GET`, `POST`, `PUT`, `DELETE` | System alert and user notifications |
| **Dashboard** | `/api/dashboard` | `GET` | Retrieve summary fleet statistics |
| **Users** | `/api/users` | `GET`, `POST`, `PUT`, `DELETE` | System user profile management |
| **Vehicle Types** | `/api/vehicle-types` | `GET`, `POST`, `PUT`, `DELETE` | Vehicle category lookups |

---

## 8. Setup & Local Installation

### Prerequisites
Make sure you have the following installed on your machine:
- **Java Development Kit (JDK 17)**
- **Apache Maven 3.8+**
- **Node.js (v18+ or v20+)** & **npm**
- **MySQL Server 8.0+**

---

### Step 1: Database Setup
1. Start your MySQL Server.
2. Open MySQL Workbench or MySQL CLI and execute:
   ```sql
   CREATE DATABASE fleetmanagement_db;
   ```
3. Update database credentials in `src/main/resources/application.properties` if required:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/fleetmanagement_db
   spring.datasource.username=root
   spring.datasource.password=your_mysql_password
   ```

---

### Step 2: Backend Setup (Spring Boot)
1. Open a terminal in the project root directory:
   ```bash
   cd "fleet master"
   ```
2. Build the Maven project:
   ```bash
   mvn clean install
   ```
3. Run the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```
4. The backend server will start on `http://localhost:8080`.

---

### Step 3: Frontend Setup (React + Vite)
1. Open a separate terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and visit: `http://localhost:5173`.

---

## 9. Future Enhancements

As part of future scope and real-world deployment, the following features can be added:
- Live GPS tracking integration with map visualization (Leaflet/Mapbox).
- Automated SMS and email notifications for due maintenance schedules.
- Exporting trip and fuel reports to PDF / Excel format.
- Role-Based Access Control (RBAC) with detailed JWT authentication.

---

## 10. Conclusion

This project serves as a comprehensive capstone demonstration of full-stack software development using Spring Boot and React.js. It highlights RESTful API design, database normalization with Spring Data JPA, modern UI development with React and Bootstrap, and multi-entity relational state management.
