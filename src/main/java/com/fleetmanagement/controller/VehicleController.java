package com.fleetmanagement.controller;

import com.fleetmanagement.config.AuthContext;
import com.fleetmanagement.dto.VehicleDTO;
import com.fleetmanagement.entity.Vehicle;
import com.fleetmanagement.entity.VehicleType;
import com.fleetmanagement.repository.VehicleRepository;
import com.fleetmanagement.repository.VehicleTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/vehicles")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000"})
public class VehicleController {

    /** Development fallback: all data belongs to owner_id=1 when no auth session exists. */
    private static final Long DEV_OWNER_ID = 1L;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private VehicleTypeRepository vehicleTypeRepository;

    /** Returns the current user's ID, falling back to DEV_OWNER_ID during development. */
    private Long resolveOwnerId() {
        Long id = AuthContext.getUserId();
        return (id != null) ? id : DEV_OWNER_ID;
    }

    private VehicleDTO mapToDTO(Vehicle v) {
        VehicleDTO dto = new VehicleDTO();
        dto.setId(v.getId());
        dto.setVin(v.getVin());
        dto.setPlateNumber(v.getPlateNumber());
        dto.setMake(v.getMake());
        dto.setModel(v.getModel());
        dto.setYear(v.getYear());
        dto.setType(v.getVehicleType() != null ? v.getVehicleType().getCode() : null);
        dto.setFuelType(v.getFuelType());
        dto.setStatus(v.getStatus());
        dto.setMileage(v.getMileage());
        dto.setFuelCapacity(v.getFuelCapacity());
        dto.setCurrentFuelLevel(v.getCurrentFuelLevel());
        dto.setLocation(v.getLocation());
        dto.setCreatedAt(v.getCreatedAt());
        return dto;
    }

    @GetMapping
    public ResponseEntity<List<VehicleDTO>> getAllVehicles() {
        List<VehicleDTO> vehicles = vehicleRepository
                .findByOwnerIdAndIsDeletedFalse(resolveOwnerId())
                .stream().map(this::mapToDTO).collect(Collectors.toList());
        return ResponseEntity.ok(vehicles);
    }

    @GetMapping("/{id}")
    public ResponseEntity<VehicleDTO> getVehicleById(@PathVariable Long id) {
        return vehicleRepository
                .findByIdAndOwnerIdAndIsDeletedFalse(id, resolveOwnerId())
                .map(v -> ResponseEntity.ok(mapToDTO(v)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<VehicleDTO> createVehicle(@RequestBody VehicleDTO dto) {
        Vehicle vehicle = new Vehicle();
        vehicle.setVin(dto.getVin());
        vehicle.setPlateNumber(dto.getPlateNumber());
        vehicle.setMake(dto.getMake());
        vehicle.setModel(dto.getModel());
        vehicle.setYear(dto.getYear());
        vehicle.setFuelType(dto.getFuelType() != null ? dto.getFuelType() : "DIESEL");
        vehicle.setStatus(dto.getStatus() != null ? dto.getStatus() : "AVAILABLE");
        vehicle.setMileage(dto.getMileage() != null ? dto.getMileage() : 0.0);
        vehicle.setFuelCapacity(dto.getFuelCapacity() != null ? dto.getFuelCapacity() : 0.0);
        vehicle.setCurrentFuelLevel(dto.getCurrentFuelLevel() != null ? dto.getCurrentFuelLevel() : 0.0);
        vehicle.setLocation(dto.getLocation());
        // Explicitly set owner so it's never null
        vehicle.setOwnerId(resolveOwnerId());

        if (dto.getType() != null && !dto.getType().isBlank()) {
            VehicleType vt = vehicleTypeRepository.findByCodeAndIsDeletedFalse(dto.getType())
                    .orElseGet(() -> {
                        VehicleType newVt = new VehicleType();
                        newVt.setCode(dto.getType());
                        newVt.setName(dto.getType());
                        newVt.setOwnerId(resolveOwnerId());
                        return vehicleTypeRepository.save(newVt);
                    });
            vehicle.setVehicleType(vt);
        }

        Vehicle saved = vehicleRepository.save(vehicle);
        return ResponseEntity.ok(mapToDTO(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<VehicleDTO> updateVehicle(@PathVariable Long id, @RequestBody VehicleDTO dto) {
        return vehicleRepository.findByIdAndOwnerIdAndIsDeletedFalse(id, resolveOwnerId()).map(v -> {
            v.setPlateNumber(dto.getPlateNumber());
            v.setVin(dto.getVin());
            v.setMake(dto.getMake());
            v.setModel(dto.getModel());
            v.setYear(dto.getYear());
            v.setFuelType(dto.getFuelType());
            v.setStatus(dto.getStatus());
            v.setMileage(dto.getMileage());
            v.setFuelCapacity(dto.getFuelCapacity());
            v.setCurrentFuelLevel(dto.getCurrentFuelLevel());
            v.setLocation(dto.getLocation());

            if (dto.getType() != null && !dto.getType().isBlank()) {
                VehicleType vt = vehicleTypeRepository.findByCodeAndIsDeletedFalse(dto.getType())
                        .orElseGet(() -> {
                            VehicleType newVt = new VehicleType();
                            newVt.setCode(dto.getType());
                            newVt.setName(dto.getType());
                            newVt.setOwnerId(resolveOwnerId());
                            return vehicleTypeRepository.save(newVt);
                        });
                v.setVehicleType(vt);
            }

            return ResponseEntity.ok(mapToDTO(vehicleRepository.save(v)));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVehicle(@PathVariable Long id) {
        return vehicleRepository.findByIdAndOwnerIdAndIsDeletedFalse(id, resolveOwnerId()).map(v -> {
            v.setIsDeleted(true);
            vehicleRepository.save(v);
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
