package com.fleetmanagement.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.fleetmanagement.entity.DashboardStatistics;
import com.fleetmanagement.repository.DashboardStatisticsRepository;
import com.fleetmanagement.repository.DriverRepository;
import com.fleetmanagement.repository.FuelRepository;
import com.fleetmanagement.repository.MaintenanceRepository;
import com.fleetmanagement.repository.TripRepository;
import com.fleetmanagement.repository.VehicleRepository;

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
        DashboardStatistics computed = computeLiveStats();
        return List.of(computed);
    }

    public DashboardStatistics computeLiveStats() {
        var vehicles = vehicleRepository.findByIsDeletedFalse();
        var drivers = driverRepository.findByIsDeletedFalse();
        var trips = tripRepository.findByIsDeletedFalse();
        var maintenanceList = maintenanceRepository.findByIsDeletedFalse();
        var fuelList = fuelRepository.findByIsDeletedFalse();

        int totalVehicles = vehicles.size();
        int activeVehicles = (int) vehicles.stream()
                .filter(v -> "ACTIVE".equalsIgnoreCase(v.getStatus()))
                .count();
        int maintenanceVehicles = (int) vehicles.stream()
                .filter(v -> "MAINTENANCE".equalsIgnoreCase(v.getStatus()) || "IN_MAINTENANCE".equalsIgnoreCase(v.getStatus()))
                .count();

        int totalDrivers = drivers.size();
        int activeDrivers = (int) drivers.stream()
                .filter(d -> "ACTIVE".equalsIgnoreCase(d.getStatus()) || "AVAILABLE".equalsIgnoreCase(d.getStatus()))
                .count();

        int ongoingTrips = (int) trips.stream()
                .filter(t -> "ONGOING".equalsIgnoreCase(t.getStatus()) || "ACTIVE".equalsIgnoreCase(t.getStatus()) || "IN_TRANSIT".equalsIgnoreCase(t.getStatus()) || "IN_PROGRESS".equalsIgnoreCase(t.getStatus()))
                .count();

        YearMonth currentMonth = YearMonth.now();
        int completedTripsMonth = (int) trips.stream()
                .filter(t -> "COMPLETED".equalsIgnoreCase(t.getStatus()))
                .filter(t -> {
                    LocalDateTime arrival = t.getActualArrival() != null ? t.getActualArrival()
                            : (t.getScheduledArrival() != null ? t.getScheduledArrival() : t.getCreatedAt());
                    return arrival != null && arrival.getYear() == currentMonth.getYear() && arrival.getMonth() == currentMonth.getMonth();
                })
                .count();

        BigDecimal totalFuelCost = fuelList.stream()
                .map(f -> f.getTotalCostInr() != null ? f.getTotalCostInr() : (f.getCost() != null ? f.getCost() : BigDecimal.ZERO))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalMaintenanceCost = maintenanceList.stream()
                .map(m -> m.getEstimatedCostInr() != null ? m.getEstimatedCostInr() : (m.getCost() != null ? m.getCost() : BigDecimal.ZERO))
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
        stat.setTotalRevenueInr(BigDecimal.ZERO);
        stat.setFleetUtilizationRate(utilizationRate);

        return stat;
    }

    public Optional<DashboardStatistics> findById(Long id) {
        return Optional.of(computeLiveStats());
    }

    public DashboardStatistics save(DashboardStatistics dashboardStatistics) {
        return dashboardStatisticsRepository.save(dashboardStatistics);
    }

    public void deleteById(Long id) {
        dashboardStatisticsRepository.findById(id).ifPresent(stat -> {
            stat.setIsDeleted(true);
            dashboardStatisticsRepository.save(stat);
        });
    }
}
