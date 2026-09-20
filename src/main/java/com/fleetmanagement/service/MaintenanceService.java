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
        return maintenanceRepository.findAll();
    }

    public Optional<Maintenance> findById(Long id) {
        return maintenanceRepository.findById(id);
    }

    public Maintenance save(Maintenance maintenance) {
        return maintenanceRepository.save(maintenance);
    }

    public void deleteById(Long id) {
        maintenanceRepository.deleteById(id);
    }
}
