package com.fleetmanagement.controller;

import com.fleetmanagement.entity.Vehicle;
import com.fleetmanagement.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
@CrossOrigin(origins = "*")
public class VehicleController {

    @Autowired
    private VehicleRepository vehicleRepository;

    @GetMapping
    public ResponseEntity<List<Vehicle>> getAllVehicles() {
        List<Vehicle> vehicles = vehicleRepository.findByIsDeletedFalse();
        return ResponseEntity.ok(vehicles);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Vehicle> getVehicleById(@PathVariable Long id) {
        return vehicleRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Vehicle> createVehicle(@RequestBody Vehicle vehicle) {
        Vehicle saved = vehicleRepository.save(vehicle);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Vehicle> updateVehicle(@PathVariable Long id, @RequestBody Vehicle details) {
        return vehicleRepository.findById(id).map(v -> {
            v.setPlateNumber(details.getPlateNumber());
            v.setVin(details.getVin());
            v.setMake(details.getMake());
            v.setModel(details.getModel());
            v.setYear(details.getYear());
            v.setFuelType(details.getFuelType());
            v.setStatus(details.getStatus());
            v.setMileage(details.getMileage());
            v.setFuelCapacity(details.getFuelCapacity());
            v.setCurrentFuelLevel(details.getCurrentFuelLevel());
            v.setLocation(details.getLocation());
            return ResponseEntity.ok(vehicleRepository.save(v));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVehicle(@PathVariable Long id) {
        return vehicleRepository.findById(id).map(v -> {
            v.setIsDeleted(true);
            vehicleRepository.save(v);
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
