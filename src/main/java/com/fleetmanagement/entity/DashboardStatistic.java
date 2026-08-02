package com.fleetmanagement.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "dashboard_statistics")
public class DashboardStatistic extends BaseEntity {

    @Column(name = "stat_date", nullable = false, unique = true)
    private LocalDate statDate;

    @Column(name = "total_vehicles", nullable = false)
    private Integer totalVehicles = 0;

    @Column(name = "active_vehicles", nullable = false)
    private Integer activeVehicles = 0;

    @Column(name = "maintenance_vehicles", nullable = false)
    private Integer maintenanceVehicles = 0;

    @Column(name = "total_drivers", nullable = false)
    private Integer totalDrivers = 0;

    @Column(name = "active_drivers", nullable = false)
    private Integer activeDrivers = 0;

    @Column(name = "ongoing_trips", nullable = false)
    private Integer ongoingTrips = 0;

    @Column(name = "completed_trips_month", nullable = false)
    private Integer completedTripsMonth = 0;

    @Column(name = "total_fuel_cost_inr", nullable = false, precision = 14, scale = 2)
    private BigDecimal totalFuelCostInr = BigDecimal.ZERO;

    @Column(name = "total_maintenance_cost_inr", nullable = false, precision = 14, scale = 2)
    private BigDecimal totalMaintenanceCostInr = BigDecimal.ZERO;

    @Column(name = "total_revenue_inr", nullable = false, precision = 14, scale = 2)
    private BigDecimal totalRevenueInr = BigDecimal.ZERO;

    @Column(name = "fleet_utilization_rate", nullable = false)
    private Double fleetUtilizationRate = 0.0;

    public DashboardStatistic() {}

    public LocalDate getStatDate() {
        return statDate;
    }

    public void setStatDate(LocalDate statDate) {
        this.statDate = statDate;
    }

    public Integer getTotalVehicles() {
        return totalVehicles;
    }

    public void setTotalVehicles(Integer totalVehicles) {
        this.totalVehicles = totalVehicles;
    }

    public Integer getActiveVehicles() {
        return activeVehicles;
    }

    public void setActiveVehicles(Integer activeVehicles) {
        this.activeVehicles = activeVehicles;
    }

    public Integer getMaintenanceVehicles() {
        return maintenanceVehicles;
    }

    public void setMaintenanceVehicles(Integer maintenanceVehicles) {
        this.maintenanceVehicles = maintenanceVehicles;
    }

    public Integer getTotalDrivers() {
        return totalDrivers;
    }

    public void setTotalDrivers(Integer totalDrivers) {
        this.totalDrivers = totalDrivers;
    }

    public Integer getActiveDrivers() {
        return activeDrivers;
    }

    public void setActiveDrivers(Integer activeDrivers) {
        this.activeDrivers = activeDrivers;
    }

    public Integer getOngoingTrips() {
        return ongoingTrips;
    }

    public void setOngoingTrips(Integer ongoingTrips) {
        this.ongoingTrips = ongoingTrips;
    }

    public Integer getCompletedTripsMonth() {
        return completedTripsMonth;
    }

    public void setCompletedTripsMonth(Integer completedTripsMonth) {
        this.completedTripsMonth = completedTripsMonth;
    }

    public BigDecimal getTotalFuelCostInr() {
        return totalFuelCostInr;
    }

    public void setTotalFuelCostInr(BigDecimal totalFuelCostInr) {
        this.totalFuelCostInr = totalFuelCostInr;
    }

    public BigDecimal getTotalMaintenanceCostInr() {
        return totalMaintenanceCostInr;
    }

    public void setTotalMaintenanceCostInr(BigDecimal totalMaintenanceCostInr) {
        this.totalMaintenanceCostInr = totalMaintenanceCostInr;
    }

    public BigDecimal getTotalRevenueInr() {
        return totalRevenueInr;
    }

    public void setTotalRevenueInr(BigDecimal totalRevenueInr) {
        this.totalRevenueInr = totalRevenueInr;
    }

    public Double getFleetUtilizationRate() {
        return fleetUtilizationRate;
    }

    public void setFleetUtilizationRate(Double fleetUtilizationRate) {
        this.fleetUtilizationRate = fleetUtilizationRate;
    }
}
