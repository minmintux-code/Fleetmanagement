package com.fleetmanagement.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class FuelLogDTO {
    private Long id;
    
    // Assignment fields
    private Long vehicleId;
    private String vehiclePlate;
    private Long driverId;
    private String driverName;
    
    private Double liters;
    private Double costPerLiter;
    private Double totalCost;
    private Double odometerReading;
    private String stationName;
    private String fuelCardNumber;
    private LocalDateTime filledAt;
    private String notes;
}
