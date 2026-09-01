package com.fleetmanagement.controller;

import com.fleetmanagement.config.AuthContext;
import com.fleetmanagement.entity.Driver;
import com.fleetmanagement.repository.DriverRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/drivers")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000"})
public class DriverController {

    /** Development fallback: all data belongs to owner_id=1 when no auth session exists. */
    private static final Long DEV_OWNER_ID = 1L;

    @Autowired
    private DriverRepository driverRepository;

    /** Returns the current user's ID, falling back to DEV_OWNER_ID during development. */
    private Long resolveOwnerId() {
        Long id = AuthContext.getUserId();
        return (id != null) ? id : DEV_OWNER_ID;
    }

    @GetMapping
    public ResponseEntity<List<Driver>> getAllDrivers() {
        return ResponseEntity.ok(driverRepository.findByOwnerIdAndIsDeletedFalse(resolveOwnerId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Driver> getDriverById(@PathVariable Long id) {
        return driverRepository.findByIdAndOwnerIdAndIsDeletedFalse(id, resolveOwnerId())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Driver> createDriver(@RequestBody Driver driver) {
        // Explicitly set owner so it's never null
        driver.setOwnerId(resolveOwnerId());
        return ResponseEntity.ok(driverRepository.save(driver));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Driver> updateDriver(@PathVariable Long id, @RequestBody Driver details) {
        return driverRepository.findByIdAndOwnerIdAndIsDeletedFalse(id, resolveOwnerId()).map(d -> {
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
        return driverRepository.findByIdAndOwnerIdAndIsDeletedFalse(id, resolveOwnerId()).map(d -> {
            d.setIsDeleted(true);
            driverRepository.save(d);
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
