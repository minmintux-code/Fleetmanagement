package com.fleetmanagement.controller;

import com.fleetmanagement.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.*;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "*")
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
        long totalVehicles = vehicleRepository.countByIsDeletedFalse();
        long activeVehicles = vehicleRepository.countByStatusAndIsDeletedFalse("AVAILABLE")
                            + vehicleRepository.countByStatusAndIsDeletedFalse("IN_TRANSIT");
        long maintenanceVehicles = vehicleRepository.countByStatusAndIsDeletedFalse("IN_MAINTENANCE");

        long totalDrivers = driverRepository.countByIsDeletedFalse();
        long activeDrivers = driverRepository.countByStatusAndIsDeletedFalse("AVAILABLE")
                            + driverRepository.countByStatusAndIsDeletedFalse("ON_TRIP");

        long totalCustomers = customerRepository.count();

        long ongoingTrips = tripRepository.countByStatusAndIsDeletedFalse("IN_PROGRESS");
        long completedTripsMonth = tripRepository.countByStatusAndIsDeletedFalse("COMPLETED");

        BigDecimal totalRevenue = rentalRepository.sumTotalRevenueInr();
        BigDecimal totalExpenses = expenseRepository.sumTotalExpensesInr();
        BigDecimal totalFuelCost = fuelLogRepository.sumTotalFuelCostInr();
        BigDecimal totalMaintenanceCost = maintenanceRepository.sumTotalMaintenanceCostInr();

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
