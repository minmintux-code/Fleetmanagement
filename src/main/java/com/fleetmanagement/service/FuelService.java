package com.fleetmanagement.service;

import com.fleetmanagement.entity.Fuel;
import com.fleetmanagement.repository.FuelRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FuelService {

    private final FuelRepository fuelRepository;

    public FuelService(FuelRepository fuelRepository) {
        this.fuelRepository = fuelRepository;
    }

    public List<Fuel> findAll() {
        return fuelRepository.findByIsDeletedFalse();
    }

    public Optional<Fuel> findById(Long id) {
        return fuelRepository.findById(id).filter(f -> !Boolean.TRUE.equals(f.getIsDeleted()));
    }

    public Fuel save(Fuel fuel) {
        if (fuel.getId() != null) {
            fuelRepository.findById(fuel.getId()).ifPresent(existing -> {
                if (fuel.getCreatedAt() == null) {
                    fuel.setCreatedAt(existing.getCreatedAt());
                }
                if (fuel.getCreatedBy() == null || fuel.getCreatedBy().isBlank()) {
                    fuel.setCreatedBy(existing.getCreatedBy());
                }
                if (fuel.getIsDeleted() == null) {
                    fuel.setIsDeleted(existing.getIsDeleted());
                }
                if (fuel.getVehicleId() == null) {
                    fuel.setVehicleId(existing.getVehicleId());
                }
                if (fuel.getDriverId() == null) {
                    fuel.setDriverId(existing.getDriverId());
                }
            });
        }
        return fuelRepository.save(fuel);
    }

    public void deleteById(Long id) {
        fuelRepository.findById(id).ifPresent(fuel -> {
            fuel.setIsDeleted(true);
            fuelRepository.save(fuel);
        });
    }
}
