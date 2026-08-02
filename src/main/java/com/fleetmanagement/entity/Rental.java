package com.fleetmanagement.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "rentals")
public class Rental extends BaseEntity {

    @Column(name = "rental_code", nullable = false, unique = true, length = 50)
    private String rentalCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "daily_rate_inr", nullable = false, precision = 12, scale = 2)
    private BigDecimal dailyRateInr = BigDecimal.ZERO;

    @Column(name = "total_cost_inr", nullable = false, precision = 14, scale = 2)
    private BigDecimal totalCostInr = BigDecimal.ZERO;

    @Column(name = "deposit_amount_inr", nullable = false, precision = 12, scale = 2)
    private BigDecimal depositAmountInr = BigDecimal.ZERO;

    @Column(name = "status", nullable = false, length = 30)
    private String status = "RESERVED";

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    public Rental() {}

    public String getRentalCode() {
        return rentalCode;
    }

    public void setRentalCode(String rentalCode) {
        this.rentalCode = rentalCode;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public Vehicle getVehicle() {
        return vehicle;
    }

    public void setVehicle(Vehicle vehicle) {
        this.vehicle = vehicle;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public BigDecimal getDailyRateInr() {
        return dailyRateInr;
    }

    public void setDailyRateInr(BigDecimal dailyRateInr) {
        this.dailyRateInr = dailyRateInr;
    }

    public BigDecimal getTotalCostInr() {
        return totalCostInr;
    }

    public void setTotalCostInr(BigDecimal totalCostInr) {
        this.totalCostInr = totalCostInr;
    }

    public BigDecimal getDepositAmountInr() {
        return depositAmountInr;
    }

    public void setDepositAmountInr(BigDecimal depositAmountInr) {
        this.depositAmountInr = depositAmountInr;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
