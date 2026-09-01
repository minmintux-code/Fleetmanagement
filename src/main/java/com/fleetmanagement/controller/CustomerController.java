package com.fleetmanagement.controller;

import com.fleetmanagement.entity.Customer;
import com.fleetmanagement.repository.CustomerRepository;
import com.fleetmanagement.config.AuthContext;
import org.springframework.beans.factory.annotation.Autowired;
import com.fleetmanagement.config.AuthContext;
import org.springframework.http.ResponseEntity;
import com.fleetmanagement.config.AuthContext;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/customers")

public class CustomerController {

    @Autowired
    private CustomerRepository customerRepository;

    @GetMapping
    public ResponseEntity<List<Customer>> getCustomers() {
        return ResponseEntity.ok(customerRepository.findByOwnerIdAndIsDeletedFalse(AuthContext.getUserId()));
    }

    @PostMapping
    public ResponseEntity<Customer> createCustomer(@RequestBody Customer customer) {
        return ResponseEntity.ok(customerRepository.save(customer));
    }
}
