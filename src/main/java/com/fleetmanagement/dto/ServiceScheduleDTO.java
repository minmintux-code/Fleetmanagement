package com.fleetmanagement.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class ServiceScheduleDTO {
    private Long id;
    private Long vehicleId;
    private String vehiclePlateNumber;
    private String vehicleMakeModel;
    private String serviceName;
    private Double intervalKm;
    private Integer intervalMonths;
    private LocalDate lastServiceDate;
    private Double lastServiceKm;
    private LocalDate nextDueDate;
    private Double nextDueKm;
    private String status; // PENDING, OVERDUE, COMPLETED
    private LocalDateTime createdAt;
}
