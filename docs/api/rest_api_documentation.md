# REST API Specification

This document provides complete documentation for all REST API endpoints provided by the **Fleet Manager** backend microservice (`http://localhost:8080/api`).

All endpoints communicate via JSON payloads and format monetary parameters in **Indian Rupees (₹ / INR)**.

---

## 1. Authentication Endpoints (`/api/auth`)

### POST `/api/auth/login`
Authenticates a user and generates a session token.

- **Request Body**:
  ```json
  {
    "email": "admin@fleetmaster.com",
    "password": "password123"
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "user": {
      "id": 1,
      "username": "admin",
      "email": "admin@fleetmaster.com",
      "fullName": "Administrator",
      "department": "Fleet Operations",
      "status": "ACTIVE"
    },
    "token": "jwt-mysql-session-token-1738520000000"
  }
  ```
- **Status Codes**: `200 OK`, `400 Bad Request`, `401 Unauthorized`

---

### GET `/api/auth/me`
Retrieves current authenticated user details.

- **Response `200 OK`**:
  ```json
  {
    "id": 1,
    "username": "admin",
    "email": "admin@fleetmaster.com",
    "fullName": "Administrator",
    "department": "Fleet Operations",
    "status": "ACTIVE"
  }
  ```
- **Status Codes**: `200 OK`, `401 Unauthorized`

---

## 2. Vehicle Endpoints (`/api/vehicles`)

### GET `/api/vehicles`
Retrieves all non-deleted vehicles.

- **Response `200 OK`**:
  ```json
  [
    {
      "id": 1,
      "vin": "1HGCR2F83HA000001",
      "plateNumber": "KA-01-EA-1234",
      "make": "Tata",
      "model": "Prima 5530.S",
      "year": 2024,
      "fuelType": "DIESEL",
      "status": "AVAILABLE",
      "mileage": 14250.0,
      "fuelCapacity": 300.0,
      "currentFuelLevel": 85.0,
      "location": "Bengaluru Logistics Hub"
    }
  ]
  ```
- **Status Codes**: `200 OK`

---

### POST `/api/vehicles`
Registers a new vehicle in MySQL database.

- **Request Body**:
  ```json
  {
    "vin": "1HGCR2F83HA000002",
    "plateNumber": "MH-12-PQ-5678",
    "make": "Ashok Leyland",
    "model": "AVTR 3520",
    "year": 2023,
    "vehicleType": { "id": 1 },
    "fuelType": "DIESEL",
    "status": "AVAILABLE",
    "mileage": 0.0,
    "fuelCapacity": 400.0,
    "currentFuelLevel": 100.0,
    "location": "Mumbai Terminal"
  }
  ```
- **Response `200 OK`**: Created `Vehicle` entity JSON.
- **Status Codes**: `200 OK`, `400 Bad Request`

---

### PUT `/api/vehicles/{id}`
Updates an existing vehicle record.

- **Status Codes**: `200 OK`, `404 Not Found`

---

### DELETE `/api/vehicles/{id}`
Soft-deletes a vehicle by setting `is_deleted = true`.

- **Status Codes**: `200 OK`, `404 Not Found`

---

## 3. Driver Endpoints (`/api/drivers`)

### GET `/api/drivers`
Retrieves all registered commercial CDL drivers.

- **Response `200 OK`**:
  ```json
  [
    {
      "id": 1,
      "firstName": "Rajesh",
      "lastName": "Kumar",
      "email": "rajesh.kumar@fleetmaster.com",
      "phone": "+91 98765 43210",
      "licenseNumber": "DL-0420110012345",
      "licenseCategory": "COMMERCIAL_CDL",
      "licenseExpiryDate": "2028-12-31",
      "status": "AVAILABLE",
      "safetyScore": 98.5,
      "totalTripsCompleted": 42
    }
  ]
  ```
- **Status Codes**: `200 OK`

---

### POST `/api/drivers`
Creates a new driver record.

- **Status Codes**: `200 OK`, `400 Bad Request`

---

## 4. Trip Endpoints (`/api/trips`)

### GET `/api/trips`
Retrieves all trip dispatches.

- **Status Codes**: `200 OK`

---

### POST `/api/trips`
Dispatches a new trip.

- **Request Body**:
  ```json
  {
    "tripCode": "TRIP-2026-8841",
    "origin": "Bengaluru",
    "destination": "Chennai",
    "scheduledDeparture": "2026-08-05T06:00:00",
    "scheduledArrival": "2026-08-05T14:00:00",
    "distanceKm": 346.0,
    "status": "SCHEDULED",
    "cargoDescription": "Electronics Hardware"
  }
  ```
- **Status Codes**: `200 OK`, `400 Bad Request`

---

## 5. Fuel Endpoints (`/api/fuel`)

### GET `/api/fuel`
Retrieves fuel logs.

- **Status Codes**: `200 OK`

---

### POST `/api/fuel`
Logs a fuel refill in INR.

- **Request Body**:
  ```json
  {
    "vehicle": { "id": 1 },
    "driver": { "id": 1 },
    "liters": 120.0,
    "costPerLiterInr": 96.50,
    "totalCostInr": 11580.00,
    "odometerReading": 14500.0,
    "stationName": "Indian Oil Station",
    "filledAt": "2026-08-02T10:30:00"
  }
  ```
- **Status Codes**: `200 OK`

---

## 6. Maintenance Endpoints (`/api/maintenance`)

### GET `/api/maintenance`
Retrieves maintenance work orders.

- **Status Codes**: `200 OK`

---

### POST `/api/maintenance`
Schedules a maintenance work order in INR.

- **Request Body**:
  ```json
  {
    "vehicle": { "id": 1 },
    "type": "PREVENTIVE",
    "priority": "HIGH",
    "status": "SCHEDULED",
    "description": "Oil Change & Brake Inspection",
    "serviceCenter": "Tata Authorized Service Center",
    "estimatedCostInr": 14500.00,
    "scheduledDate": "2026-08-10",
    "odometerReading": 14500.0
  }
  ```
- **Status Codes**: `200 OK`

---

## 7. Customer & Rental Endpoints (`/api/customers`, `/api/rentals`)

### GET `/api/customers` | GET `/api/rentals`
Retrieves corporate clients and rental contracts.

- **Status Codes**: `200 OK`

---

## 8. Analytics & Summary Endpoints (`/api/analytics`)

### GET `/api/analytics/dashboard-summary`
Returns live metric counts and financial totals in INR computed directly from MySQL database.

- **Response `200 OK`**:
  ```json
  {
    "totalVehicles": 0,
    "activeVehicles": 0,
    "maintenanceVehicles": 0,
    "totalDrivers": 0,
    "activeDrivers": 0,
    "totalCustomers": 0,
    "ongoingTrips": 0,
    "completedTripsThisMonth": 0,
    "totalRevenue": 0.0,
    "totalExpenses": 0.0,
    "totalFuelCostThisMonth": 0.0,
    "totalMaintenanceCostThisMonth": 0.0,
    "fleetUtilizationRate": 0.0
  }
  ```
- **Status Codes**: `200 OK`

---

## 9. Notification Endpoints (`/api/notifications`)

### GET `/api/notifications`
Retrieves system notifications ordered by timestamp.

- **Status Codes**: `200 OK`
