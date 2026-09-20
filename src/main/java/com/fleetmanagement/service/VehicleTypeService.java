package com.fleetmanagement.service;

import com.fleetmanagement.entity.VehicleType;
import com.fleetmanagement.repository.VehicleTypeRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class VehicleTypeService {

    private final VehicleTypeRepository vehicleTypeRepository;

    public VehicleTypeService(VehicleTypeRepository vehicleTypeRepository) {
        this.vehicleTypeRepository = vehicleTypeRepository;
    }

    public List<VehicleType> findAll() {
        return vehicleTypeRepository.findAll();
    }

    public Optional<VehicleType> findById(Long id) {
        return vehicleTypeRepository.findById(id);
    }

    public VehicleType save(VehicleType vehicleType) {
        LocalDateTime now = LocalDateTime.now();
        if (vehicleType.getCreatedAt() == null) vehicleType.setCreatedAt(now);
        vehicleType.setUpdatedAt(now);
        if (vehicleType.getCreatedBy() == null || vehicleType.getCreatedBy().isBlank()) vehicleType.setCreatedBy("ADMIN");
        if (vehicleType.getUpdatedBy() == null || vehicleType.getUpdatedBy().isBlank()) vehicleType.setUpdatedBy("ADMIN");
        if (vehicleType.getIsDeleted() == null) vehicleType.setIsDeleted(false);
        if (vehicleType.getCode() == null || vehicleType.getCode().isBlank()) {
            vehicleType.setCode(vehicleType.getName() != null ? vehicleType.getName().toUpperCase().replaceAll("\\s+", "_") : "TYPE");
        }
        return vehicleTypeRepository.save(vehicleType);
    }

    public void deleteById(Long id) {
        vehicleTypeRepository.deleteById(id);
    }
}