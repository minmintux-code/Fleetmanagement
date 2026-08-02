package com.fleetmanagement.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "service_schedule")
public class ServiceSchedule extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    @Column(name = "service_name", nullable = false, length = 100)
    private String serviceName;

    @Column(name = "interval_km", nullable = false)
    private Double intervalKm = 10000.0;

    @Column(name = "interval_months", nullable = false)
    private Integer intervalMonths = 6;

    @Column(name = "last_service_date")
    private LocalDate lastServiceDate;

    @Column(name = "last_service_km")
    private Double lastServiceKm;

    @Column(name = "next_due_date")
    private LocalDate nextDueDate;

    @Column(name = "next_due_km")
    private Double nextDueKm;

    @Column(name = "status", nullable = false, length = 20)
    private String status = "PENDING";

    public ServiceSchedule() {}

    public Vehicle getVehicle() {
        return vehicle;
    }

    public void setVehicle(Vehicle vehicle) {
        this.vehicle = vehicle;
    }

    public String getServiceName() {
        return serviceName;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    public Double getIntervalKm() {
        return intervalKm;
    }

    public void setIntervalKm(Double intervalKm) {
        this.intervalKm = intervalKm;
    }

    public Integer getIntervalMonths() {
        return intervalMonths;
    }

    public void setIntervalMonths(Integer intervalMonths) {
        this.intervalMonths = intervalMonths;
    }

    public LocalDate getLastServiceDate() {
        return lastServiceDate;
    }

    public void setLastServiceDate(LocalDate lastServiceDate) {
        this.lastServiceDate = lastServiceDate;
    }

    public Double getLastServiceKm() {
        return lastServiceKm;
    }

    public void setLastServiceKm(Double lastServiceKm) {
        this.lastServiceKm = lastServiceKm;
    }

    public LocalDate getNextDueDate() {
        return nextDueDate;
    }

    public void setNextDueDate(LocalDate nextDueDate) {
        this.nextDueDate = nextDueDate;
    }

    public Double getNextDueKm() {
        return nextDueKm;
    }

    public void setNextDueKm(Double nextDueKm) {
        this.nextDueKm = nextDueKm;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
