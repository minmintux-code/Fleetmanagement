package com.fleetmanagement.controller;

import com.fleetmanagement.dto.FuelLogDTO;
import com.fleetmanagement.entity.Driver;
import com.fleetmanagement.entity.FuelLog;
import com.fleetmanagement.entity.Vehicle;
import com.fleetmanagement.repository.DriverRepository;
import com.fleetmanagement.repository.FuelLogRepository;
import com.fleetmanagement.repository.VehicleRepository;
import com.fleetmanagement.config.AuthContext;
import org.springframework.beans.factory.annotation.Autowired;
import com.fleetmanagement.config.AuthContext;
import org.springframework.http.ResponseEntity;
import com.fleetmanagement.config.AuthContext;
import org.springframework.web.bind.annotation.*;
import com.fleetmanagement.config.AuthContext;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/fuel")
public class FuelController {

    @Autowired
    private FuelLogRepository fuelLogRepository;
    
    @Autowired
    private VehicleRepository vehicleRepository;
    
    @Autowired
    private DriverRepository driverRepository;

    @GetMapping
    public ResponseEntity<List<FuelLogDTO>> getFuelLogs() {
        List<FuelLog> logs = fuelLogRepository.findByOwnerIdAndIsDeletedFalse(AuthContext.getUserId());
        return ResponseEntity.ok(logs.stream().map(this::mapToDTO).collect(Collectors.toList()));
    }

    @PostMapping
    @Transactional
    public ResponseEntity<FuelLogDTO> createFuelLog(@RequestBody FuelLogDTO dto) {
        FuelLog log = new FuelLog();
        log.setLiters(dto.getLiters() != null ? dto.getLiters() : 0.0);
        log.setCostPerLiterInr(dto.getCostPerLiter() != null ? BigDecimal.valueOf(dto.getCostPerLiter()) : BigDecimal.ZERO);
        log.setTotalCostInr(dto.getTotalCost() != null ? BigDecimal.valueOf(dto.getTotalCost()) : BigDecimal.ZERO);
        log.setOdometerReading(dto.getOdometerReading() != null ? dto.getOdometerReading() : 0.0);
        log.setStationName(dto.getStationName());
        log.setFuelCardNumber(dto.getFuelCardNumber());
        log.setFilledAt(dto.getFilledAt());
        log.setNotes(dto.getNotes());
        
        if (dto.getVehicleId() != null) {
            Vehicle vehicle = vehicleRepository.findByIdAndOwnerIdAndIsDeletedFalse(dto.getVehicleId(), AuthContext.getUserId()).orElse(null);
            log.setVehicle(vehicle);
        }
        
        if (dto.getDriverId() != null) {
            Driver driver = driverRepository.findByIdAndOwnerIdAndIsDeletedFalse(dto.getDriverId(), AuthContext.getUserId()).orElse(null);
            log.setDriver(driver);
        }
        
        return ResponseEntity.ok(mapToDTO(fuelLogRepository.save(log)));
    }
    
    private FuelLogDTO mapToDTO(FuelLog log) {
        FuelLogDTO dto = new FuelLogDTO();
        dto.setId(log.getId());
        dto.setLiters(log.getLiters());
        dto.setCostPerLiter(log.getCostPerLiterInr() != null ? log.getCostPerLiterInr().doubleValue() : 0.0);
        dto.setTotalCost(log.getTotalCostInr() != null ? log.getTotalCostInr().doubleValue() : 0.0);
        dto.setOdometerReading(log.getOdometerReading());
        dto.setStationName(log.getStationName());
        dto.setFuelCardNumber(log.getFuelCardNumber());
        dto.setFilledAt(log.getFilledAt());
        dto.setNotes(log.getNotes());
        
        if (log.getVehicle() != null) {
            dto.setVehicleId(log.getVehicle().getId());
            dto.setVehiclePlate(log.getVehicle().getPlateNumber());
        }
        
        if (log.getDriver() != null) {
            dto.setDriverId(log.getDriver().getId());
            dto.setDriverName(log.getDriver().getFullName());
        }
        
        return dto;
    }
}
