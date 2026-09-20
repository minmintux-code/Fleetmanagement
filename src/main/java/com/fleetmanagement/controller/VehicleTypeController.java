package com.fleetmanagement.controller;

import com.fleetmanagement.entity.VehicleType;
import com.fleetmanagement.service.VehicleTypeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/vehicle-types")
public class VehicleTypeController {

    private final VehicleTypeService vehicleTypeService;

    public VehicleTypeController(VehicleTypeService vehicleTypeService) {
        this.vehicleTypeService = vehicleTypeService;
    }

    @GetMapping
    public List<VehicleType> getAllVehicleTypes() {
        return vehicleTypeService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<VehicleType> getVehicleTypeById(@PathVariable Long id) {
        return vehicleTypeService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public VehicleType createVehicleType(@RequestBody VehicleType vehicleType) {
        return vehicleTypeService.save(vehicleType);
    }

    @PutMapping("/{id}")
    public ResponseEntity<VehicleType> updateVehicleType(@PathVariable Long id, @RequestBody VehicleType vehicleType) {
        return vehicleTypeService.findById(id)
                .map(existing -> {
                    vehicleType.setId(id);
                    return ResponseEntity.ok(vehicleTypeService.save(vehicleType));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVehicleType(@PathVariable Long id) {
        if (vehicleTypeService.findById(id).isPresent()) {
            vehicleTypeService.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
