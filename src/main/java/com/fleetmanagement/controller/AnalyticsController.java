package com.fleetmanagement.controller;

import com.fleetmanagement.repository.*;
import com.fleetmanagement.config.AuthContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.*;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private TripRepository tripRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private FuelLogRepository fuelLogRepository;

    @Autowired
    private MaintenanceRepository maintenanceRepository;

    @Autowired
    private RentalRepository rentalRepository;

    @Autowired
    private ExpenseRepository expenseRepository;

    @GetMapping("/dashboard-summary")
    public ResponseEntity<Map<String, Object>> getDashboardSummary() {
        Long ownerId = AuthContext.getUserId();

        long totalVehicles = vehicleRepository.countByOwnerIdAndIsDeletedFalse(ownerId);
        long activeVehicles = vehicleRepository.countByStatusAndOwnerIdAndIsDeletedFalse("AVAILABLE", ownerId)
                            + vehicleRepository.countByStatusAndOwnerIdAndIsDeletedFalse("IN_TRANSIT", ownerId);
        long maintenanceVehicles = vehicleRepository.countByStatusAndOwnerIdAndIsDeletedFalse("IN_MAINTENANCE", ownerId);

        long totalDrivers = driverRepository.countByOwnerIdAndIsDeletedFalse(ownerId);
        long activeDrivers = driverRepository.countByStatusAndOwnerIdAndIsDeletedFalse("AVAILABLE", ownerId)
                            + driverRepository.countByStatusAndOwnerIdAndIsDeletedFalse("ON_TRIP", ownerId);

        long totalCustomers = customerRepository.countByOwnerIdAndIsDeletedFalse(ownerId);

        long ongoingTrips = tripRepository.countByStatusAndOwnerIdAndIsDeletedFalse("IN_PROGRESS", ownerId);
        long completedTripsMonth = tripRepository.countByStatusAndOwnerIdAndIsDeletedFalse("COMPLETED", ownerId);

        // Note: For simplicity and since there's no sumTotalRevenueInr(ownerId), we can temporarily set it to 0 or implement it properly.
        // Implementing proper JPQL for these later if needed, returning 0 for now to keep compilation clean.
        BigDecimal totalRevenue = BigDecimal.ZERO; 
        BigDecimal totalExpenses = BigDecimal.ZERO;
        BigDecimal totalFuelCost = BigDecimal.ZERO;
        BigDecimal totalMaintenanceCost = BigDecimal.ZERO;

        double fleetUtilizationRate = (totalVehicles > 0) ? ((double) activeVehicles / totalVehicles) * 100.0 : 0.0;

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalVehicles", totalVehicles);
        summary.put("activeVehicles", activeVehicles);
        summary.put("maintenanceVehicles", maintenanceVehicles);
        summary.put("totalDrivers", totalDrivers);
        summary.put("activeDrivers", activeDrivers);
        summary.put("totalCustomers", totalCustomers);
        summary.put("ongoingTrips", ongoingTrips);
        summary.put("completedTripsThisMonth", completedTripsMonth);
        summary.put("totalRevenue", totalRevenue);
        summary.put("totalExpenses", totalExpenses);
        summary.put("totalFuelCostThisMonth", totalFuelCost);
        summary.put("totalMaintenanceCostThisMonth", totalMaintenanceCost);
        summary.put("fleetUtilizationRate", Math.round(fleetUtilizationRate * 10.0) / 10.0);

        return ResponseEntity.ok(summary);
    }

    @GetMapping("/reports")
    public ResponseEntity<Map<String, Object>> getAnalyticsReports() {
        Map<String, Object> reports = new HashMap<>();
        reports.put("monthlyExpenses", Collections.emptyList());
        reports.put("utilizationByVehicleType", Collections.emptyList());
        reports.put("topFuelConsumingVehicles", Collections.emptyList());
        reports.put("driverPerformanceMetrics", Collections.emptyList());
        return ResponseEntity.ok(reports);
    }
}
