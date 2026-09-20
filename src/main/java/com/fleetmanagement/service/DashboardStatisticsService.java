package com.fleetmanagement.service;

import com.fleetmanagement.entity.DashboardStatistics;
import com.fleetmanagement.repository.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class DashboardStatisticsService {

    private final DashboardStatisticsRepository dashboardStatisticsRepository;
    private final VehicleRepository vehicleRepository;
    private final DriverRepository driverRepository;
    private final TripRepository tripRepository;
    private final MaintenanceRepository maintenanceRepository;
    private final FuelRepository fuelRepository;

    public DashboardStatisticsService(
            DashboardStatisticsRepository dashboardStatisticsRepository,
            VehicleRepository vehicleRepository,
            DriverRepository driverRepository,
            TripRepository tripRepository,
            MaintenanceRepository maintenanceRepository,
            FuelRepository fuelRepository) {
        this.dashboardStatisticsRepository = dashboardStatisticsRepository;
        this.vehicleRepository = vehicleRepository;
        this.driverRepository = driverRepository;
        this.tripRepository = tripRepository;
        this.maintenanceRepository = maintenanceRepository;
        this.fuelRepository = fuelRepository;
    }

    public List<DashboardStatistics> findAll() {
        List<DashboardStatistics> stats = dashboardStatisticsRepository.findAll();
        if (stats.isEmpty()) {
            DashboardStatistics computed = computeLiveStats();
            return List.of(computed);
        }
        return stats;
    }

    public DashboardStatistics computeLiveStats() {
        var vehicles = vehicleRepository.findAll();
        var drivers = driverRepository.findAll();
        var trips = tripRepository.findAll();
        var maintenanceList = maintenanceRepository.findAll();
        var fuelList = fuelRepository.findAll();

        int totalVehicles = vehicles.size();
        int activeVehicles = (int) vehicles.stream().filter(v -> "ACTIVE".equalsIgnoreCase(v.getStatus())).count();
        int maintenanceVehicles = (int) vehicles.stream().filter(v -> "MAINTENANCE".equalsIgnoreCase(v.getStatus()) || "IN_MAINTENANCE".equalsIgnoreCase(v.getStatus())).count();

        int totalDrivers = drivers.size();
        int activeDrivers = (int) drivers.stream().filter(d -> "ACTIVE".equalsIgnoreCase(d.getStatus())).count();

        int ongoingTrips = (int) trips.stream().filter(t -> "ONGOING".equalsIgnoreCase(t.getStatus()) || "ACTIVE".equalsIgnoreCase(t.getStatus()) || "IN_TRANSIT".equalsIgnoreCase(t.getStatus())).count();
        int completedTripsMonth = (int) trips.stream().filter(t -> "COMPLETED".equalsIgnoreCase(t.getStatus())).count();

        BigDecimal totalFuelCost = fuelList.stream()
                .map(f -> f.getTotalCostInr() != null ? f.getTotalCostInr() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalMaintenanceCost = maintenanceList.stream()
                .map(m -> m.getEstimatedCostInr() != null ? m.getEstimatedCostInr() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        double utilizationRate = totalVehicles > 0 ? ((double) activeVehicles / totalVehicles) * 100.0 : 0.0;

        DashboardStatistics stat = new DashboardStatistics();
        stat.setStatDate(LocalDate.now());
        stat.setTotalVehicles(totalVehicles);
        stat.setActiveVehicles(activeVehicles);
        stat.setMaintenanceVehicles(maintenanceVehicles);
        stat.setTotalDrivers(totalDrivers);
        stat.setActiveDrivers(activeDrivers);
        stat.setOngoingTrips(ongoingTrips);
        stat.setCompletedTripsMonth(completedTripsMonth);
        stat.setTotalFuelCostInr(totalFuelCost);
        stat.setTotalMaintenanceCostInr(totalMaintenanceCost);
        stat.setTotalRevenueInr(BigDecimal.valueOf(50000.0));
        stat.setFleetUtilizationRate(utilizationRate);

        return stat;
    }

    public Optional<DashboardStatistics> findById(Long id) {
        return dashboardStatisticsRepository.findById(id);
    }

    public DashboardStatistics save(DashboardStatistics dashboardStatistics) {
        return dashboardStatisticsRepository.save(dashboardStatistics);
    }

    public void deleteById(Long id) {
        dashboardStatisticsRepository.deleteById(id);
    }
}
