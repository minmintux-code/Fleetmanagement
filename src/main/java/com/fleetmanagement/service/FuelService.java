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
        return fuelRepository.findAll();
    }

    public Optional<Fuel> findById(Long id) {
        return fuelRepository.findById(id);
    }

    public Fuel save(Fuel fuel) {
        return fuelRepository.save(fuel);
    }

    public void deleteById(Long id) {
        fuelRepository.deleteById(id);
    }
}
