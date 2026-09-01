package com.fleetmanagement.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class MaintenanceDTO {
    private Long id;
    
    private Long vehicleId;
    private String vehiclePlate;
    
    private String type;
    private String priority;
    private String status;
    private String description;
    private String serviceCenter;
    private String technicianName;
    private Double estimatedCost;
    private Double actualCost;
    private LocalDate scheduledDate;
    private LocalDate completionDate;
    private Double odometerReading;
    private String notes;
}
