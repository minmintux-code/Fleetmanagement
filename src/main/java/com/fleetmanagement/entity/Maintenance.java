package com.fleetmanagement.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "maintenance")
public class Maintenance extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    @Column(name = "type", nullable = false, length = 30)
    private String type = "PREVENTIVE";

    @Column(name = "priority", nullable = false, length = 20)
    private String priority = "MEDIUM";

    @Column(name = "status", nullable = false, length = 30)
    private String status = "SCHEDULED";

    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "service_center", nullable = false, length = 100)
    private String serviceCenter;

    @Column(name = "technician_name", length = 100)
    private String technicianName;

    @Column(name = "estimated_cost_inr", nullable = false, precision = 12, scale = 2)
    private BigDecimal estimatedCostInr = BigDecimal.ZERO;

    @Column(name = "actual_cost_inr", precision = 12, scale = 2)
    private BigDecimal actualCostInr;

    @Column(name = "scheduled_date", nullable = false)
    private LocalDate scheduledDate;

    @Column(name = "completion_date")
    private LocalDate completionDate;

    @Column(name = "odometer_reading", nullable = false)
    private Double odometerReading = 0.0;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    public Maintenance() {}

    public Vehicle getVehicle() {
        return vehicle;
    }

    public void setVehicle(Vehicle vehicle) {
        this.vehicle = vehicle;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getServiceCenter() {
        return serviceCenter;
    }

    public void setServiceCenter(String serviceCenter) {
        this.serviceCenter = serviceCenter;
    }

    public String getTechnicianName() {
        return technicianName;
    }

    public void setTechnicianName(String technicianName) {
        this.technicianName = technicianName;
    }

    public BigDecimal getEstimatedCostInr() {
        return estimatedCostInr;
    }

    public void setEstimatedCostInr(BigDecimal estimatedCostInr) {
        this.estimatedCostInr = estimatedCostInr;
    }

    public BigDecimal getActualCostInr() {
        return actualCostInr;
    }

    public void setActualCostInr(BigDecimal actualCostInr) {
        this.actualCostInr = actualCostInr;
    }

    public LocalDate getScheduledDate() {
        return scheduledDate;
    }

    public void setScheduledDate(LocalDate scheduledDate) {
        this.scheduledDate = scheduledDate;
    }

    public LocalDate getCompletionDate() {
        return completionDate;
    }

    public void setCompletionDate(LocalDate completionDate) {
        this.completionDate = completionDate;
    }

    public Double getOdometerReading() {
        return odometerReading;
    }

    public void setOdometerReading(Double odometerReading) {
        this.odometerReading = odometerReading;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
