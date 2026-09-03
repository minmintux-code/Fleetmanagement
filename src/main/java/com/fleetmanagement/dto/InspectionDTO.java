package com.fleetmanagement.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class InspectionDTO {
    private Long id;
    private Long vehicleId;
    private String vehiclePlateNumber;
    private String vehicleMakeModel;
    private Long driverId;
    private String driverName;
    private String inspectionType; // PRE_TRIP, POST_TRIP
    private LocalDate inspectionDate;
    private String overallStatus; // PASS, FAIL
    private String brakesStatus;
    private String tiresStatus;
    private String lightsStatus;
    private String steeringStatus;
    private String fluidsStatus;
    private String defectsDescription;
    private Boolean repaired;
    private LocalDateTime createdAt;
}
