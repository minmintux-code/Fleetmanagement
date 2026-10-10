package com.fleetmanagement.service;

import com.fleetmanagement.entity.Driver;
import com.fleetmanagement.repository.DriverRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DriverService {

    private final DriverRepository driverRepository;

    public DriverService(DriverRepository driverRepository) {
        this.driverRepository = driverRepository;
    }

    public List<Driver> findAll() {
        return driverRepository.findByIsDeletedFalse();
    }

    public Optional<Driver> findById(Integer id) {
        return driverRepository.findById(id).filter(d -> !Boolean.TRUE.equals(d.getIsDeleted()));
    }

    public Driver save(Driver driver) {
        if (driver.getId() != null) {
            driverRepository.findById(driver.getId()).ifPresent(existing -> {
                if (driver.getCreatedAt() == null) {
                    driver.setCreatedAt(existing.getCreatedAt());
                }
                if (driver.getCreatedBy() == null || driver.getCreatedBy().isBlank()) {
                    driver.setCreatedBy(existing.getCreatedBy());
                }
                if (driver.getIsDeleted() == null) {
                    driver.setIsDeleted(existing.getIsDeleted());
                }
            });
        }
        return driverRepository.save(driver);
    }

    public void deleteById(Integer id) {
        driverRepository.findById(id).ifPresent(driver -> {
            driver.setIsDeleted(true);
            driver.setStatus("INACTIVE");
            driverRepository.save(driver);
        });
    }
}
