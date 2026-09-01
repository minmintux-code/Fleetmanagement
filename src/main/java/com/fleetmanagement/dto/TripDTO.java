package com.fleetmanagement.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class TripDTO {
    private Long id;
    private String tripCode;
    
    // Assignment fields
    private Long vehicleId;
    private String vehiclePlate;
    private Long driverId;
    private String driverName;
    
    private String origin;
    private String destination;
    private LocalDateTime scheduledDeparture;
    private LocalDateTime scheduledArrival;
    private LocalDateTime actualDeparture;
    private LocalDateTime actualArrival;
    private Double distanceKm;
    private String status;
    private String cargoDescription;
    private String notes;
    private LocalDateTime createdAt;
}
