package com.fleetmanagement.controller;

import com.fleetmanagement.config.AuthContext;
import com.fleetmanagement.dto.MaintenanceDTO;
import com.fleetmanagement.entity.Maintenance;
import com.fleetmanagement.entity.Vehicle;
import com.fleetmanagement.repository.MaintenanceRepository;
import com.fleetmanagement.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/maintenance")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000"})
public class MaintenanceController {

    private static final Long DEV_OWNER_ID = 1L;

    @Autowired
    private MaintenanceRepository maintenanceRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    private Long resolveOwnerId() {
        Long id = AuthContext.getUserId();
        return (id != null) ? id : DEV_OWNER_ID;
    }

    @GetMapping
    public ResponseEntity<List<MaintenanceDTO>> getMaintenanceRecords() {
        List<Maintenance> records = maintenanceRepository.findByOwnerIdAndIsDeletedFalse(resolveOwnerId());
        return ResponseEntity.ok(records.stream().map(this::mapToDTO).collect(Collectors.toList()));
    }

    @PostMapping
    @Transactional
    public ResponseEntity<MaintenanceDTO> createRecord(@RequestBody MaintenanceDTO dto) {
        Maintenance record = new Maintenance();
        record.setType(dto.getType() != null ? dto.getType() : "PREVENTIVE");
        record.setPriority(dto.getPriority() != null ? dto.getPriority() : "MEDIUM");
        record.setStatus(dto.getStatus() != null ? dto.getStatus() : "SCHEDULED");
        record.setDescription(dto.getDescription());
        record.setServiceCenter(dto.getServiceCenter());
        record.setTechnicianName(dto.getTechnicianName());
        record.setEstimatedCostInr(dto.getEstimatedCost() != null ? BigDecimal.valueOf(dto.getEstimatedCost()) : BigDecimal.ZERO);
        record.setActualCostInr(dto.getActualCost() != null ? BigDecimal.valueOf(dto.getActualCost()) : BigDecimal.ZERO);
        record.setScheduledDate(dto.getScheduledDate());
        record.setCompletionDate(dto.getCompletionDate());
        record.setOdometerReading(dto.getOdometerReading() != null ? dto.getOdometerReading() : 0.0);
        record.setNotes(dto.getNotes());
        record.setOwnerId(resolveOwnerId());

        if (dto.getVehicleId() != null) {
            Vehicle vehicle = vehicleRepository.findByIdAndOwnerIdAndIsDeletedFalse(dto.getVehicleId(), resolveOwnerId()).orElse(null);
            record.setVehicle(vehicle);
        }

        return ResponseEntity.ok(mapToDTO(maintenanceRepository.save(record)));
    }

    private MaintenanceDTO mapToDTO(Maintenance record) {
        MaintenanceDTO dto = new MaintenanceDTO();
        dto.setId(record.getId());
        dto.setType(record.getType());
        dto.setPriority(record.getPriority());
        dto.setStatus(record.getStatus());
        dto.setDescription(record.getDescription());
        dto.setServiceCenter(record.getServiceCenter());
        dto.setTechnicianName(record.getTechnicianName());
        dto.setEstimatedCost(record.getEstimatedCostInr() != null ? record.getEstimatedCostInr().doubleValue() : 0.0);
        dto.setActualCost(record.getActualCostInr() != null ? record.getActualCostInr().doubleValue() : 0.0);
        dto.setScheduledDate(record.getScheduledDate());
        dto.setCompletionDate(record.getCompletionDate());
        dto.setOdometerReading(record.getOdometerReading());
        dto.setNotes(record.getNotes());

        if (record.getVehicle() != null) {
            dto.setVehicleId(record.getVehicle().getId());
            dto.setVehiclePlate(record.getVehicle().getPlateNumber());
        }

        return dto;
    }
}
