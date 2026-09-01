package com.fleetmanagement.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class RentalDTO {
    private Long id;
    
    private String rentalCode;
    
    private Long customerId;
    private String customerName;
    
    private Long vehicleId;
    private String vehiclePlate;
    
    private LocalDate startDate;
    private LocalDate endDate;
    private Double dailyRate;
    private Double totalCost;
    private Double depositAmount;
    
    private String status;
    private String notes;
}
