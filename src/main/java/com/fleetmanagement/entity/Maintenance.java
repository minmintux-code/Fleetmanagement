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
@Table(name = "maintenance")
public class Maintenance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "vehicle_id")
    private Integer vehicleId;

    @Column(nullable = false, length = 30)
    private String type;

    @Column(name = "maintenance_type", length = 100)
    private String maintenanceType;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "service_center", nullable = false, length = 100)
    private String serviceCenter;

    @Column(name = "technician_name", length = 100)
    private String technicianName;

    @Column(name = "scheduled_date", nullable = false)
    private LocalDate scheduledDate;

    @Column(name = "completion_date")
    private LocalDate completionDate;

    @Column(name = "maintenance_date")
    private LocalDate maintenanceDate;

    @Column(name = "estimated_cost_inr", nullable = false, precision = 12, scale = 2)
    private BigDecimal estimatedCostInr;

    @Column(name = "actual_cost_inr", precision = 12, scale = 2)
    private BigDecimal actualCostInr;

    @Column(precision = 10, scale = 2)
    private BigDecimal cost;

    @Column(precision = 10, scale = 2)
    private BigDecimal kilometers;

    @Column(name = "odometer_reading", nullable = false)
    private Double odometerReading;

    @Column(nullable = false, length = 20)
    private String priority;

    @Column(nullable = false, length = 30)
    private String status;

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

    public Maintenance() {
    }

    @PrePersist
    public void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        if (createdAt == null) createdAt = now;
        if (updatedAt == null) updatedAt = now;
        if (createdBy == null || createdBy.isBlank()) createdBy = "ADMIN";
        if (updatedBy == null || updatedBy.isBlank()) updatedBy = "ADMIN";
        if (isDeleted == null) isDeleted = false;
        if (status == null || status.isBlank()) status = "SCHEDULED";
        if (priority == null || priority.isBlank()) priority = "MEDIUM";
        if (type == null || type.isBlank()) type = "PREVENTIVE";
        if (maintenanceType == null || maintenanceType.isBlank()) maintenanceType = type;
        if (scheduledDate == null) scheduledDate = LocalDate.now();
        if (maintenanceDate == null) maintenanceDate = scheduledDate;
        if (description == null || description.isBlank()) description = "Routine Maintenance";
        if (serviceCenter == null || serviceCenter.isBlank()) serviceCenter = "Main Depot";
        if (estimatedCostInr == null) estimatedCostInr = BigDecimal.ZERO;
        if (cost == null) cost = estimatedCostInr;
        if (odometerReading == null) odometerReading = 0.0;
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
        if (updatedBy == null || updatedBy.isBlank()) updatedBy = "ADMIN";
        if (maintenanceType == null || maintenanceType.isBlank()) maintenanceType = type;
        if (cost == null && estimatedCostInr != null) cost = estimatedCostInr;
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

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getMaintenanceType() {
        return maintenanceType;
    }

    public void setMaintenanceType(String maintenanceType) {
        this.maintenanceType = maintenanceType;
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

    public LocalDate getMaintenanceDate() {
        return maintenanceDate;
    }

    public void setMaintenanceDate(LocalDate maintenanceDate) {
        this.maintenanceDate = maintenanceDate;
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

    public BigDecimal getCost() {
        return cost;
    }

    public void setCost(BigDecimal cost) {
        this.cost = cost;
    }

    public BigDecimal getKilometers() {
        return kilometers;
    }

    public void setKilometers(BigDecimal kilometers) {
        this.kilometers = kilometers;
    }

    public Double getOdometerReading() {
        return odometerReading;
    }

    public void setOdometerReading(Double odometerReading) {
        this.odometerReading = odometerReading;
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
