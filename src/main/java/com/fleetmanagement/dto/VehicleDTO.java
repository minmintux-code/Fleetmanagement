package com.fleetmanagement.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class VehicleDTO {
    private Long id;
    private String vin;
    private String plateNumber;
    private String make;
    private String model;
    private Integer year;
    private String type; // maps to VehicleType code
    private String fuelType;
    private String status;
    private Double mileage;
    private Double fuelCapacity;
    private Double currentFuelLevel;
    private String location;
    private Double latitude;
    private Double longitude;
    private Double speedKmH;
    private Double heading;
    private LocalDateTime createdAt;
}
