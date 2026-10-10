package com.fleetmanagement.service;

import com.fleetmanagement.entity.Vehicle;
import com.fleetmanagement.repository.VehicleRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class VehicleService {

    private final VehicleRepository vehicleRepository;

    public VehicleService(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    public List<Vehicle> findAll() {
        return vehicleRepository.findByIsDeletedFalse();
    }

    public Optional<Vehicle> findById(Integer id) {
        return vehicleRepository.findById(id).filter(v -> !Boolean.TRUE.equals(v.getIsDeleted()));
    }

    public Vehicle save(Vehicle vehicle) {
        if (vehicle.getId() != null) {
            vehicleRepository.findById(vehicle.getId()).ifPresent(existing -> {
                if (vehicle.getCreatedAt() == null) {
                    vehicle.setCreatedAt(existing.getCreatedAt());
                }
                if (vehicle.getCreatedBy() == null || vehicle.getCreatedBy().isBlank()) {
                    vehicle.setCreatedBy(existing.getCreatedBy());
                }
                if (vehicle.getIsDeleted() == null) {
                    vehicle.setIsDeleted(existing.getIsDeleted());
                }
                if (vehicle.getVehicleTypeId() == null) {
                    vehicle.setVehicleTypeId(existing.getVehicleTypeId());
                }
            });
        }
        return vehicleRepository.save(vehicle);
    }

    public void deleteById(Integer id) {
        vehicleRepository.findById(id).ifPresent(vehicle -> {
            vehicle.setIsDeleted(true);
            vehicle.setStatus("INACTIVE");
            vehicleRepository.save(vehicle);
        });
    }
}
