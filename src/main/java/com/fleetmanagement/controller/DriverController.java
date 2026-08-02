package com.fleetmanagement.controller;

import com.fleetmanagement.entity.Driver;
import com.fleetmanagement.repository.DriverRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/drivers")
@CrossOrigin(origins = "*")
public class DriverController {

    @Autowired
    private DriverRepository driverRepository;

    @GetMapping
    public ResponseEntity<List<Driver>> getAllDrivers() {
        return ResponseEntity.ok(driverRepository.findByIsDeletedFalse());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Driver> getDriverById(@PathVariable Long id) {
        return driverRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Driver> createDriver(@RequestBody Driver driver) {
        return ResponseEntity.ok(driverRepository.save(driver));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Driver> updateDriver(@PathVariable Long id, @RequestBody Driver details) {
        return driverRepository.findById(id).map(d -> {
            d.setFirstName(details.getFirstName());
            d.setLastName(details.getLastName());
            d.setEmail(details.getEmail());
            d.setPhone(details.getPhone());
            d.setLicenseNumber(details.getLicenseNumber());
            d.setLicenseCategory(details.getLicenseCategory());
            d.setLicenseExpiryDate(details.getLicenseExpiryDate());
            d.setStatus(details.getStatus());
            d.setSafetyScore(details.getSafetyScore());
            return ResponseEntity.ok(driverRepository.save(d));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDriver(@PathVariable Long id) {
        return driverRepository.findById(id).map(d -> {
            d.setIsDeleted(true);
            driverRepository.save(d);
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
