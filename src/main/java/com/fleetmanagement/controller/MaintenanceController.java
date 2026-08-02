package com.fleetmanagement.controller;

import com.fleetmanagement.entity.Maintenance;
import com.fleetmanagement.repository.MaintenanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/maintenance")
@CrossOrigin(origins = "*")
public class MaintenanceController {

    @Autowired
    private MaintenanceRepository maintenanceRepository;

    @GetMapping
    public ResponseEntity<List<Maintenance>> getMaintenanceRecords() {
        return ResponseEntity.ok(maintenanceRepository.findByIsDeletedFalse());
    }

    @PostMapping
    public ResponseEntity<Maintenance> createRecord(@RequestBody Maintenance record) {
        return ResponseEntity.ok(maintenanceRepository.save(record));
    }
}
