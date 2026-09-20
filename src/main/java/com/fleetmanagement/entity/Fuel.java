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
@Table(name = "fuel")
public class Fuel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "vehicle_id")
    private Integer vehicleId;

    @Column(name = "driver_id")
    private Long driverId;

    @Column(name = "station_name", nullable = false, length = 100)
    private String stationName;

    @Column(name = "fuel_card_number", length = 50)
    private String fuelCardNumber;

    @Column(name = "filled_at", nullable = false)
    private LocalDateTime filledAt;

    @Column(name = "fuel_date")
    private LocalDate fuelDate;

    @Column(nullable = false)
    private Double liters;

    @Column(precision = 10, scale = 2)
    private BigDecimal litres;

    @Column(name = "cost_per_liter_inr", nullable = false, precision = 10, scale = 2)
    private BigDecimal costPerLiterInr;

    @Column(name = "total_cost_inr", nullable = false, precision = 12, scale = 2)
    private BigDecimal totalCostInr;

    @Column(precision = 10, scale = 2)
    private BigDecimal cost;

    @Column(name = "odometer_reading", nullable = false)
    private Double odometerReading;

    @Column(name = "mileage_avg", precision = 10, scale = 2)
    private BigDecimal mileageAvg;

    @Column(columnDefinition = "TEXT")
    private String notes;

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

    public Fuel() {
    }

    @PrePersist
    public void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        if (createdAt == null) createdAt = now;
        if (updatedAt == null) updatedAt = now;
        if (createdBy == null || createdBy.isBlank()) createdBy = "ADMIN";
        if (updatedBy == null || updatedBy.isBlank()) updatedBy = "ADMIN";
        if (isDeleted == null) isDeleted = false;
        if (filledAt == null) filledAt = now;
        if (fuelDate == null) fuelDate = LocalDate.now();
        if (liters == null) liters = 0.0;
        if (litres == null) litres = BigDecimal.valueOf(liters);
        if (costPerLiterInr == null) costPerLiterInr = BigDecimal.ZERO;
        if (totalCostInr == null) totalCostInr = BigDecimal.ZERO;
        if (cost == null) cost = totalCostInr;
        if (odometerReading == null) odometerReading = 0.0;
        if (stationName == null || stationName.isBlank()) stationName = "Fuel Station";
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
        if (updatedBy == null || updatedBy.isBlank()) updatedBy = "ADMIN";
        if (liters != null && litres == null) litres = BigDecimal.valueOf(liters);
        if (totalCostInr != null && cost == null) cost = totalCostInr;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getVehicleId() {
        return vehicleId;
    }

    public void setVehicleId(Integer vehicleId) {
        this.vehicleId = vehicleId;
    }

    public Long getDriverId() {
        return driverId;
    }

    public void setDriverId(Long driverId) {
        this.driverId = driverId;
    }

    public String getStationName() {
        return stationName;
    }

    public void setStationName(String stationName) {
        this.stationName = stationName;
    }

    public String getFuelCardNumber() {
        return fuelCardNumber;
    }

    public void setFuelCardNumber(String fuelCardNumber) {
        this.fuelCardNumber = fuelCardNumber;
    }

    public LocalDateTime getFilledAt() {
        return filledAt;
    }

    public void setFilledAt(LocalDateTime filledAt) {
        this.filledAt = filledAt;
    }

    public LocalDate getFuelDate() {
        return fuelDate;
    }

    public void setFuelDate(LocalDate fuelDate) {
        this.fuelDate = fuelDate;
    }

    public Double getLiters() {
        return liters;
    }

    public void setLiters(Double liters) {
        this.liters = liters;
    }

    public BigDecimal getLitres() {
        return litres;
    }

    public void setLitres(BigDecimal litres) {
        this.litres = litres;
    }

    public BigDecimal getCostPerLiterInr() {
        return costPerLiterInr;
    }

    public void setCostPerLiterInr(BigDecimal costPerLiterInr) {
        this.costPerLiterInr = costPerLiterInr;
    }

    public BigDecimal getTotalCostInr() {
        return totalCostInr;
    }

    public void setTotalCostInr(BigDecimal totalCostInr) {
        this.totalCostInr = totalCostInr;
    }

    public BigDecimal getCost() {
        return cost;
    }

    public void setCost(BigDecimal cost) {
        this.cost = cost;
    }

    public Double getOdometerReading() {
        return odometerReading;
    }

    public void setOdometerReading(Double odometerReading) {
        this.odometerReading = odometerReading;
    }

    public BigDecimal getMileageAvg() {
        return mileageAvg;
    }

    public void setMileageAvg(BigDecimal mileageAvg) {
        this.mileageAvg = mileageAvg;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
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
