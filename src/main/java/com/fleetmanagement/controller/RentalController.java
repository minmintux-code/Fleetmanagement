package com.fleetmanagement.controller;

import com.fleetmanagement.config.AuthContext;
import com.fleetmanagement.dto.RentalDTO;
import com.fleetmanagement.entity.Customer;
import com.fleetmanagement.entity.Rental;
import com.fleetmanagement.entity.Vehicle;
import com.fleetmanagement.repository.CustomerRepository;
import com.fleetmanagement.repository.RentalRepository;
import com.fleetmanagement.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/rentals")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000"})
public class RentalController {

    private static final Long DEV_OWNER_ID = 1L;

    @Autowired
    private RentalRepository rentalRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    private Long resolveOwnerId() {
        Long id = AuthContext.getUserId();
        return (id != null) ? id : DEV_OWNER_ID;
    }

    @GetMapping
    public ResponseEntity<List<RentalDTO>> getRentals() {
        List<Rental> rentals = rentalRepository.findByOwnerIdAndIsDeletedFalse(resolveOwnerId());
        return ResponseEntity.ok(rentals.stream().map(this::mapToDTO).collect(Collectors.toList()));
    }

    @PostMapping
    @Transactional
    public ResponseEntity<RentalDTO> createRental(@RequestBody RentalDTO dto) {
        Rental rental = new Rental();
        rental.setRentalCode(dto.getRentalCode());
        rental.setStartDate(dto.getStartDate());
        rental.setEndDate(dto.getEndDate());
        rental.setDailyRateInr(dto.getDailyRate() != null ? BigDecimal.valueOf(dto.getDailyRate()) : BigDecimal.ZERO);
        rental.setTotalCostInr(dto.getTotalCost() != null ? BigDecimal.valueOf(dto.getTotalCost()) : BigDecimal.ZERO);
        rental.setDepositAmountInr(dto.getDepositAmount() != null ? BigDecimal.valueOf(dto.getDepositAmount()) : BigDecimal.ZERO);
        rental.setStatus(dto.getStatus() != null ? dto.getStatus() : "RESERVED");
        rental.setNotes(dto.getNotes());
        rental.setOwnerId(resolveOwnerId());

        if (dto.getCustomerId() != null) {
            Customer customer = customerRepository.findByIdAndOwnerIdAndIsDeletedFalse(dto.getCustomerId(), resolveOwnerId()).orElse(null);
            rental.setCustomer(customer);
        }

        if (dto.getVehicleId() != null) {
            Vehicle vehicle = vehicleRepository.findByIdAndOwnerIdAndIsDeletedFalse(dto.getVehicleId(), resolveOwnerId()).orElse(null);
            rental.setVehicle(vehicle);
        }

        return ResponseEntity.ok(mapToDTO(rentalRepository.save(rental)));
    }

    private RentalDTO mapToDTO(Rental rental) {
        RentalDTO dto = new RentalDTO();
        dto.setId(rental.getId());
        dto.setRentalCode(rental.getRentalCode());
        dto.setStartDate(rental.getStartDate());
        dto.setEndDate(rental.getEndDate());
        dto.setDailyRate(rental.getDailyRateInr() != null ? rental.getDailyRateInr().doubleValue() : 0.0);
        dto.setTotalCost(rental.getTotalCostInr() != null ? rental.getTotalCostInr().doubleValue() : 0.0);
        dto.setDepositAmount(rental.getDepositAmountInr() != null ? rental.getDepositAmountInr().doubleValue() : 0.0);
        dto.setStatus(rental.getStatus());
        dto.setNotes(rental.getNotes());

        if (rental.getCustomer() != null) {
            dto.setCustomerId(rental.getCustomer().getId());
            dto.setCustomerName(rental.getCustomer().getName());
        }

        if (rental.getVehicle() != null) {
            dto.setVehicleId(rental.getVehicle().getId());
            dto.setVehiclePlate(rental.getVehicle().getPlateNumber());
        }

        return dto;
    }
}
