package com.fleetmanagement.controller;

import com.fleetmanagement.entity.Rental;
import com.fleetmanagement.repository.RentalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/rentals")
@CrossOrigin(origins = "*")
public class RentalController {

    @Autowired
    private RentalRepository rentalRepository;

    @GetMapping
    public ResponseEntity<List<Rental>> getRentals() {
        return ResponseEntity.ok(rentalRepository.findByIsDeletedFalse());
    }

    @PostMapping
    public ResponseEntity<Rental> createRental(@RequestBody Rental rental) {
        return ResponseEntity.ok(rentalRepository.save(rental));
    }
}
