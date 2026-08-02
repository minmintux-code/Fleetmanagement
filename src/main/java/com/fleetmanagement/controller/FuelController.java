package com.fleetmanagement.controller;

import com.fleetmanagement.entity.FuelLog;
import com.fleetmanagement.repository.FuelLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/fuel")
@CrossOrigin(origins = "*")
public class FuelController {

    @Autowired
    private FuelLogRepository fuelLogRepository;

    @GetMapping
    public ResponseEntity<List<FuelLog>> getFuelLogs() {
        return ResponseEntity.ok(fuelLogRepository.findByIsDeletedFalse());
    }

    @PostMapping
    public ResponseEntity<FuelLog> createFuelLog(@RequestBody FuelLog log) {
        return ResponseEntity.ok(fuelLogRepository.save(log));
    }
}
