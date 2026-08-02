# Operational Flowcharts

This document details the business process flowcharts for key operational workflows in the **Fleet Manager** system.

---

## 1. User Login Process Flowchart

```mermaid
flowchart TD
    Start([User Opens Application]) --> LoginPage[Navigate to Login Screen]
    LoginPage --> InputCredentials[Enter Corporate Email & Password]
    InputCredentials --> ClickSubmit[Click 'Sign In to Dashboard']
    ClickSubmit --> Validate{Credentials Valid?}
    Validate -- No --> ErrorToast[Display 'Authentication Failed' Error Toast]
    ErrorToast --> InputCredentials
    Validate -- Yes --> GenerateToken[Generate Session Token]
    GenerateToken --> StoreLocal[Save Token & Profile in LocalStorage]
    StoreLocal --> Redirect[Redirect to /dashboard]
    Redirect --> Dashboard([Load Empty Dashboard Metrics])
```

---

## 2. Vehicle Management Lifecycle Flowchart

```mermaid
flowchart TD
    Start([Start Vehicle Workflow]) --> CheckAction{Action Type?}
    CheckAction -- Add New --> FormModal[Open Vehicle Registration Form]
    FormModal --> InputDetails[Enter VIN, Plate #, Make, Model, Fuel Type]
    InputDetails --> SaveVehicle[Click Save Vehicle]
    SaveVehicle --> DBInsert[Persist to MySQL `vehicles` table]
    DBInsert --> GridRefresh[Refresh Vehicle Management Table]
    
    CheckAction -- Edit --> EditModal[Open Edit Vehicle Form]
    EditModal --> UpdateFields[Modify Mileage, Fuel Level, Location]
    UpdateFields --> DBSave[Update MySQL `vehicles` record]
    DBSave --> GridRefresh

    CheckAction -- Change Status --> StatusDropdown[Select Status: AVAILABLE / IN_TRANSIT / IN_MAINTENANCE]
    StatusDropdown --> DBSave
    
    GridRefresh --> End([Vehicle State Updated in MySQL])
```

---

## 3. Trip Dispatch Workflow Flowchart

```mermaid
flowchart TD
    Start([Initiate Trip Dispatch]) --> OpenTripForm[Open Trip Dispatch Form]
    OpenTripForm --> SelectVehicle[Select Available Vehicle from Dropdown]
    SelectVehicle --> SelectDriver[Select Available Driver from Dropdown]
    SelectDriver --> InputRoute[Enter Origin, Destination & Departure Date]
    InputRoute --> SubmitTrip[Submit Dispatch Order]
    SubmitTrip --> SaveTrip[Persist to `trips` & `trip_assignments` in MySQL]
    SaveTrip --> UpdateStatus[Set Vehicle Status = 'IN_TRANSIT', Driver Status = 'ON_TRIP']
    UpdateStatus --> CompleteTrip{Trip Completed?}
    CompleteTrip -- Yes --> SetComplete[Set Trip Status = 'COMPLETED']
    SetComplete --> IncrementDriver[Trigger: Increment Driver Completed Trips Counter]
    IncrementDriver --> ResetStatus[Set Vehicle & Driver Status = 'AVAILABLE']
    ResetStatus --> End([Trip Dispatch Closed])
```

---

## 4. Rental Contract Management Flowchart

```mermaid
flowchart TD
    Start([New Customer Rental]) --> SelectCustomer[Select Customer & Vehicle]
    SelectCustomer --> EnterDates[Enter Start Date, End Date & Daily Rate in ₹]
    EnterDates --> CalcCost[Auto-Calculate Total Rental Cost in ₹]
    CalcCost --> CreateRental[Save Rental Contract to MySQL `rentals`]
    CreateRental --> ReserveVehicle[Set Vehicle Status = 'RENTED']
    ReserveVehicle --> ProcessPayment{Payment Received?}
    ProcessPayment -- Yes --> RecordPayment[Insert Payment Record in ₹]
    RecordPayment --> UpdateRevenue[Update Total Revenue Snapshot]
    ProcessPayment -- No --> AwaitPayment[Mark Rental Status = 'RESERVED']
    UpdateRevenue --> End([Rental Agreement Active])
    AwaitPayment --> End
```

---

## 5. Fuel Logging & Odometer Sync Flowchart

```mermaid
flowchart TD
    Start([Refill Log Entry]) --> Form[Open Fuel Log Form]
    Form --> Details[Enter Liters, Cost Per Liter in ₹, Odometer Reading, Station]
    Details --> CalcTotal[Auto-Compute Total Fuel Cost in ₹]
    CalcTotal --> Submit[Save Fuel Log to MySQL `fuel_logs`]
    Submit --> TriggerCheck{Odometer > Vehicle Mileage?}
    TriggerCheck -- Yes --> UpdateMileage[Trigger: Update Vehicle Mileage in `vehicles`]
    TriggerCheck -- No --> KeepMileage[Maintain Existing Mileage]
    UpdateMileage --> RefreshUI[Refresh Fuel Expenses Table & Dashboard Metrics]
    KeepMileage --> RefreshUI
    RefreshUI --> End([Fuel Refill Logged])
```

---

## 6. Maintenance Work Order Flowchart

```mermaid
flowchart TD
    Start([Schedule Maintenance]) --> Form[Open Maintenance Work Order Form]
    Form --> InputInfo[Enter Service Center, Priority, Description, Scheduled Date]
    InputInfo --> Cost[Enter Estimated Cost in ₹]
    Cost --> Save[Save to MySQL `maintenance`]
    Save --> UpdateVehicle[Set Vehicle Status = 'IN_MAINTENANCE']
    UpdateVehicle --> RepairDone{Repair Completed?}
    RepairDone -- Yes --> EnterActualCost[Enter Actual Cost in ₹ & Completion Date]
    EnterActualCost --> SetVehicleAvailable[Set Vehicle Status = 'AVAILABLE']
    SetVehicleAvailable --> UpdateMetrics[Update Total Maintenance Cost Metric]
    UpdateMetrics --> End([Work Order Closed])
```
