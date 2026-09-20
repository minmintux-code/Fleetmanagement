package com.fleetmanagement.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "dashboard_statistics")
public class DashboardStatistics {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "stat_date", nullable = false, unique = true)
    private LocalDate statDate;

    @Column(name = "total_vehicles", nullable = false)
    private Integer totalVehicles;

    @Column(name = "active_vehicles", nullable = false)
    private Integer activeVehicles;

    @Column(name = "maintenance_vehicles", nullable = false)
    private Integer maintenanceVehicles;

    @Column(name = "total_drivers", nullable = false)
    private Integer totalDrivers;

    @Column(name = "active_drivers", nullable = false)
    private Integer activeDrivers;

    @Column(name = "ongoing_trips", nullable = false)
    private Integer ongoingTrips;

    @Column(name = "completed_trips_month", nullable = false)
    private Integer completedTripsMonth;

    @Column(name = "total_fuel_cost_inr", nullable = false, precision = 14, scale = 2)
    private BigDecimal totalFuelCostInr;

    @Column(name = "total_maintenance_cost_inr", nullable = false, precision = 14, scale = 2)
    private BigDecimal totalMaintenanceCostInr;

    @Column(name = "total_revenue_inr", nullable = false, precision = 14, scale = 2)
    private BigDecimal totalRevenueInr;

    @Column(name = "fleet_utilization_rate", nullable = false)
    private Double fleetUtilizationRate;

    @Column(name = "owner_id")
    private Long ownerId;

    @Column(name = "is_deleted", nullable = false)
    private Boolean isDeleted = false;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "created_by", nullable = false, length = 100)
    private String createdBy;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "updated_by", nullable = false, length = 100)
    private String updatedBy;

    public DashboardStatistics() {
    }

    @PrePersist
    public void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        if (createdAt == null) createdAt = now;
        if (updatedAt == null) updatedAt = now;
        if (createdBy == null || createdBy.isBlank()) createdBy = "ADMIN";
        if (updatedBy == null || updatedBy.isBlank()) updatedBy = "ADMIN";
        if (isDeleted == null) isDeleted = false;
        if (statDate == null) statDate = LocalDate.now();
        if (totalVehicles == null) totalVehicles = 0;
        if (activeVehicles == null) activeVehicles = 0;
        if (maintenanceVehicles == null) maintenanceVehicles = 0;
        if (totalDrivers == null) totalDrivers = 0;
        if (activeDrivers == null) activeDrivers = 0;
        if (ongoingTrips == null) ongoingTrips = 0;
        if (completedTripsMonth == null) completedTripsMonth = 0;
        if (totalFuelCostInr == null) totalFuelCostInr = BigDecimal.ZERO;
        if (totalMaintenanceCostInr == null) totalMaintenanceCostInr = BigDecimal.ZERO;
        if (totalRevenueInr == null) totalRevenueInr = BigDecimal.ZERO;
        if (fleetUtilizationRate == null) fleetUtilizationRate = 0.0;
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
        if (updatedBy == null || updatedBy.isBlank()) updatedBy = "ADMIN";
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public Long getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(Long ownerId) {
        this.ownerId = ownerId;
    }

    public Boolean getIsDeleted() {
        return isDeleted;
    }

    public void setIsDeleted(Boolean isDeleted) {
        this.isDeleted = isDeleted;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(String updatedBy) {
        this.updatedBy = updatedBy;
    }
}
