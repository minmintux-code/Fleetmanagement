package com.fleetmanagement.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "fuel_logs")
public class FuelLog extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "driver_id", nullable = false)
    private Driver driver;

    @Column(name = "liters", nullable = false)
    private Double liters = 0.0;

    @Column(name = "cost_per_liter_inr", nullable = false, precision = 10, scale = 2)
    private BigDecimal costPerLiterInr = BigDecimal.ZERO;

    @Column(name = "total_cost_inr", nullable = false, precision = 12, scale = 2)
    private BigDecimal totalCostInr = BigDecimal.ZERO;

    @Column(name = "odometer_reading", nullable = false)
    private Double odometerReading = 0.0;

    @Column(name = "station_name", nullable = false, length = 100)
    private String stationName;

    @Column(name = "fuel_card_number", length = 50)
    private String fuelCardNumber;

    @Column(name = "filled_at", nullable = false)
    private LocalDateTime filledAt;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    public FuelLog() {}

    public Vehicle getVehicle() {
        return vehicle;
    }

    public void setVehicle(Vehicle vehicle) {
        this.vehicle = vehicle;
    }

    public Driver getDriver() {
        return driver;
    }

    public void setDriver(Driver driver) {
        this.driver = driver;
    }

    public Double getLiters() {
        return liters;
    }

    public void setLiters(Double liters) {
        this.liters = liters;
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

    public Double getOdometerReading() {
        return odometerReading;
    }

    public void setOdometerReading(Double odometerReading) {
        this.odometerReading = odometerReading;
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

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
