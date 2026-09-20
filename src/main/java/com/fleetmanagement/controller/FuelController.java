package com.fleetmanagement.controller;

import com.fleetmanagement.entity.Fuel;
import com.fleetmanagement.service.FuelService;
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
@RequestMapping("/api/fuel")
public class FuelController {

    private final FuelService fuelService;

    public FuelController(FuelService fuelService) {
        this.fuelService = fuelService;
    }

    @GetMapping
    public List<Fuel> getAllFuelRecords() {
        return fuelService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Fuel> getFuelById(@PathVariable Long id) {
        return fuelService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Fuel createFuelRecord(@RequestBody Fuel fuel) {
        return fuelService.save(fuel);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Fuel> updateFuelRecord(@PathVariable Long id, @RequestBody Fuel fuel) {
        return fuelService.findById(id)
                .map(existing -> {
                    fuel.setId(id);
                    return ResponseEntity.ok(fuelService.save(fuel));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFuelRecord(@PathVariable Long id) {
        if (fuelService.findById(id).isPresent()) {
            fuelService.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
