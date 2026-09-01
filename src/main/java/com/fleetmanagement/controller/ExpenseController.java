package com.fleetmanagement.controller;

import com.fleetmanagement.dto.ExpenseDTO;
import com.fleetmanagement.entity.Expense;
import com.fleetmanagement.entity.Trip;
import com.fleetmanagement.entity.Vehicle;
import com.fleetmanagement.repository.ExpenseRepository;
import com.fleetmanagement.repository.TripRepository;
import com.fleetmanagement.repository.VehicleRepository;
import com.fleetmanagement.config.AuthContext;
import org.springframework.beans.factory.annotation.Autowired;
import com.fleetmanagement.config.AuthContext;
import org.springframework.http.ResponseEntity;
import com.fleetmanagement.config.AuthContext;
import org.springframework.web.bind.annotation.*;
import com.fleetmanagement.config.AuthContext;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    @Autowired
    private ExpenseRepository expenseRepository;
    
    @Autowired
    private VehicleRepository vehicleRepository;
    
    @Autowired
    private TripRepository tripRepository;

    @GetMapping
    public ResponseEntity<List<ExpenseDTO>> getExpenses() {
        List<Expense> expenses = expenseRepository.findByOwnerIdAndIsDeletedFalse(AuthContext.getUserId());
        return ResponseEntity.ok(expenses.stream().map(this::mapToDTO).collect(Collectors.toList()));
    }

    @PostMapping
    @Transactional
    public ResponseEntity<ExpenseDTO> createExpense(@RequestBody ExpenseDTO dto) {
        Expense expense = new Expense();
        expense.setExpenseNumber(dto.getExpenseNumber());
        expense.setCategory(dto.getCategory() != null ? dto.getCategory() : "MISCELLANEOUS");
        expense.setAmountInr(dto.getAmount() != null ? BigDecimal.valueOf(dto.getAmount()) : BigDecimal.ZERO);
        expense.setIncurredDate(dto.getIncurredDate());
        expense.setVendorName(dto.getVendorName());
        expense.setReceiptNumber(dto.getReceiptNumber());
        expense.setApprovedBy(dto.getApprovedBy());
        expense.setStatus(dto.getStatus() != null ? dto.getStatus() : "PENDING");
        expense.setNotes(dto.getNotes());
        
        if (dto.getVehicleId() != null) {
            Vehicle vehicle = vehicleRepository.findByIdAndOwnerIdAndIsDeletedFalse(dto.getVehicleId(), AuthContext.getUserId()).orElse(null);
            expense.setVehicle(vehicle);
        }
        
        if (dto.getTripId() != null) {
            Trip trip = tripRepository.findByIdAndOwnerIdAndIsDeletedFalse(dto.getTripId(), AuthContext.getUserId()).orElse(null);
            expense.setTrip(trip);
        }
        
        return ResponseEntity.ok(mapToDTO(expenseRepository.save(expense)));
    }
    
    private ExpenseDTO mapToDTO(Expense expense) {
        ExpenseDTO dto = new ExpenseDTO();
        dto.setId(expense.getId());
        dto.setExpenseNumber(expense.getExpenseNumber());
        dto.setCategory(expense.getCategory());
        dto.setAmount(expense.getAmountInr() != null ? expense.getAmountInr().doubleValue() : 0.0);
        dto.setIncurredDate(expense.getIncurredDate());
        dto.setVendorName(expense.getVendorName());
        dto.setReceiptNumber(expense.getReceiptNumber());
        dto.setApprovedBy(expense.getApprovedBy());
        dto.setStatus(expense.getStatus());
        dto.setNotes(expense.getNotes());
        
        if (expense.getVehicle() != null) {
            dto.setVehicleId(expense.getVehicle().getId());
            dto.setVehiclePlate(expense.getVehicle().getPlateNumber());
        }
        
        if (expense.getTrip() != null) {
            dto.setTripId(expense.getTrip().getId());
        }
        
        return dto;
    }
}
