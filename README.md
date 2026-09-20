# Fleet Management System

A web-based Fleet Management System developed to manage vehicles, drivers, trips, maintenance, fuel records, notifications and fleet statistics in one place.

## Technology Stack

Frontend: React.js, Vite, Axios, CSS, Bootstrap, Framer Motion, Lucide React

Backend: Java 17, Spring Boot, Spring Data JPA, Hibernate, Spring Security, Maven

Database: MySQL 8

Tools: Git, GitHub, VS Code / Antigravity

## System Architecture

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

React is used for the user interface. Spring Boot handles the backend logic and REST APIs. Spring Data JPA and Hibernate connect the backend with MySQL.

Database Architecture
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
 │      │        │        │           │
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
Database Tables

The system contains these main tables:

users
drivers
vehicles
vehicle_types
trips
maintenance
fuel
notifications
dashboard_statistics
ER Diagram
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
Primary Key and Foreign Key Relationships
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
Database Flow
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
System Flow
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
Infrastructure Architecture
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
Main Modules
Dashboard

Provides an overview of fleet information and available statistics.

Vehicle Management

Allows vehicles to be added, viewed, edited and deleted. Vehicle status, location and fuel information can also be maintained.

Driver Management

Stores driver details, license information, status, safety score and vehicle assignment.

Trip Management

Manages trip information including vehicle, driver, origin, destination, scheduled time, actual time, distance and status.

Maintenance Management

Stores vehicle service information, maintenance type, dates, costs, priority and status.

Fuel Management

Stores fuel quantity, fuel cost, station, odometer reading and mileage information.

Notifications

Stores notifications and associates them with users.

Vehicle Types

Stores vehicle categories and connects them with vehicles.

Dashboard Statistics

Stores fleet-level statistics such as vehicles, drivers, trips, maintenance, fuel cost and other available statistics.

Backend Structure
src/main/java/com/fleetmanagement/
│
├── config
├── controller
├── entity
├── repository
└── service
controller → handles API requests
service → handles application logic
repository → communicates with database
entity → represents database tables
config → configuration and security
Frontend Structure
frontend/
├── public/
├── src/
│   ├── assets/
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── package.json
└── vite.config.js
API Modules
/api/users
/api/drivers
/api/vehicles
/api/vehicle-types
/api/trips
/api/maintenance
/api/fuel
/api/notifications
/api/dashboard-statistics

The React frontend communicates with the Spring Boot backend using REST APIs.

How the System Works
User
 ↓
React Frontend
 ↓
REST API
 ↓
Spring Boot Controller
 ↓
Service
 ↓
Repository
 ↓
MySQL Database
 ↓
Response
 ↓
React Frontend
 ↓
Updated Screen

For example, when a vehicle is added, the user enters the vehicle details in the React form. The data is sent to the Spring Boot API, processed by the service layer and saved into MySQL through the repository. The saved information is then returned to the frontend and displayed to the user.

Setup
Requirements
Java 17
Node.js
npm
MySQL 8
Git
Database

Create the database:

CREATE DATABASE fleetmanagement_db;

Configure the MySQL username and password in:

src/main/resources/application.properties
Start Backend

From the project root:

.\mvnw.cmd spring-boot:run

Backend:

http://localhost:8080
Start Frontend

Open another terminal:

cd frontend
npm install
npm run dev

Frontend:

http://localhost:5173

MySQL, Spring Boot and React should be running while using the application.

Basic Usage
Start MySQL
    ↓
Start Spring Boot
    ↓
Start React
    ↓
Open Application
    ↓
Open Dashboard
    ↓
Manage Vehicles
    ↓
Manage Drivers
    ↓
Create Trips
    ↓
Add Maintenance
    ↓
Add Fuel Records
    ↓
Check Notifications
    ↓
View Dashboard
GitHub

Repository:

https://github.com/minmintux-code/Fleetmanagement

The project uses Git for version control and GitHub for source-code management.

Future Improvements
More complete role-based access
JWT authentication if required
Real GPS hardware integration
Cloud deployment
Automated fleet alerts
Advanced reports
Advanced analytics
Mobile application
Real-time vehicle tracking integration
Conclusion

The Fleet Management System brings vehicle, driver, trip, maintenance and fuel management into one application.

The React frontend provides the user interface, Spring Boot handles the backend logic and REST APIs, and MySQL stores the fleet information. The system provides a single place to manage fleet operations and view important fleet information.
