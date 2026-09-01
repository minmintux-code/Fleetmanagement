package com.fleetmanagement.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class ExpenseDTO {
    private Long id;
    
    private String expenseNumber;
    private String category;
    private Double amount;
    
    private Long vehicleId;
    private String vehiclePlate;
    
    private Long tripId;
    private Long driverId;
    
    private LocalDate incurredDate;
    private String vendorName;
    private String receiptNumber;
    private String approvedBy;
    private String status;
    private String notes;
}
