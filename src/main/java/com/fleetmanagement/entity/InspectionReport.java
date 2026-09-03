package com.fleetmanagement.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "inspection_reports")
public class InspectionReport extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "driver_id")
    private Driver driver;

    @Column(name = "inspection_type", nullable = false, length = 20)
    private String inspectionType = "PRE_TRIP";

    @Column(name = "inspection_date", nullable = false)
    private LocalDate inspectionDate = LocalDate.now();

    @Column(name = "overall_status", nullable = false, length = 20)
    private String overallStatus = "PASS";

    @Column(name = "brakes_status", length = 10)
    private String brakesStatus = "PASS";

    @Column(name = "tires_status", length = 10)
    private String tiresStatus = "PASS";

    @Column(name = "lights_status", length = 10)
    private String lightsStatus = "PASS";

    @Column(name = "steering_status", length = 10)
    private String steeringStatus = "PASS";

    @Column(name = "fluids_status", length = 10)
    private String fluidsStatus = "PASS";

    @Column(name = "defects_description", columnDefinition = "TEXT")
    private String defectsDescription;

    @Column(name = "repaired")
    private Boolean repaired = false;

    public InspectionReport() {}

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

    public String getInspectionType() {
        return inspectionType;
    }

    public void setInspectionType(String inspectionType) {
        this.inspectionType = inspectionType;
    }

    public LocalDate getInspectionDate() {
        return inspectionDate;
    }

    public void setInspectionDate(LocalDate inspectionDate) {
        this.inspectionDate = inspectionDate;
    }

    public String getOverallStatus() {
        return overallStatus;
    }

    public void setOverallStatus(String overallStatus) {
        this.overallStatus = overallStatus;
    }

    public String getBrakesStatus() {
        return brakesStatus;
    }

    public void setBrakesStatus(String brakesStatus) {
        this.brakesStatus = brakesStatus;
    }

    public String getTiresStatus() {
        return tiresStatus;
    }

    public void setTiresStatus(String tiresStatus) {
        this.tiresStatus = tiresStatus;
    }

    public String getLightsStatus() {
        return lightsStatus;
    }

    public void setLightsStatus(String lightsStatus) {
        this.lightsStatus = lightsStatus;
    }

    public String getSteeringStatus() {
        return steeringStatus;
    }

    public void setSteeringStatus(String steeringStatus) {
        this.steeringStatus = steeringStatus;
    }

    public String getFluidsStatus() {
        return fluidsStatus;
    }

    public void setFluidsStatus(String fluidsStatus) {
        this.fluidsStatus = fluidsStatus;
    }

    public String getDefectsDescription() {
        return defectsDescription;
    }

    public void setDefectsDescription(String defectsDescription) {
        this.defectsDescription = defectsDescription;
    }

    public Boolean getRepaired() {
        return repaired;
    }

    public void setRepaired(Boolean repaired) {
        this.repaired = repaired;
    }
}
