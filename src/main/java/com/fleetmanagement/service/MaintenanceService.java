package com.fleetmanagement.service;

import com.fleetmanagement.entity.Maintenance;
import com.fleetmanagement.repository.MaintenanceRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MaintenanceService {

    private final MaintenanceRepository maintenanceRepository;

    public MaintenanceService(MaintenanceRepository maintenanceRepository) {
        this.maintenanceRepository = maintenanceRepository;
    }

    public List<Maintenance> findAll() {
        return maintenanceRepository.findByIsDeletedFalse();
    }

    public Optional<Maintenance> findById(Long id) {
        return maintenanceRepository.findById(id).filter(m -> !Boolean.TRUE.equals(m.getIsDeleted()));
    }

    public Maintenance save(Maintenance maintenance) {
        if (maintenance.getId() != null) {
            maintenanceRepository.findById(maintenance.getId()).ifPresent(existing -> {
                if (maintenance.getCreatedAt() == null) {
                    maintenance.setCreatedAt(existing.getCreatedAt());
                }
                if (maintenance.getCreatedBy() == null || maintenance.getCreatedBy().isBlank()) {
                    maintenance.setCreatedBy(existing.getCreatedBy());
                }
                if (maintenance.getIsDeleted() == null) {
                    maintenance.setIsDeleted(existing.getIsDeleted());
                }
                if (maintenance.getVehicleId() == null) {
                    maintenance.setVehicleId(existing.getVehicleId());
                }
            });
        }
        return maintenanceRepository.save(maintenance);
    }

    public void deleteById(Long id) {
        maintenanceRepository.findById(id).ifPresent(maintenance -> {
            maintenance.setIsDeleted(true);
            maintenance.setStatus("CANCELLED");
            maintenanceRepository.save(maintenance);
        });
    }
}
