package com.fleetmanagement.service;

import com.fleetmanagement.entity.Trip;
import com.fleetmanagement.repository.TripRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TripService {

    private final TripRepository tripRepository;

    public TripService(TripRepository tripRepository) {
        this.tripRepository = tripRepository;
    }

    public List<Trip> findAll() {
        return tripRepository.findByIsDeletedFalse();
    }

    public Optional<Trip> findById(Long id) {
        return tripRepository.findById(id).filter(t -> !Boolean.TRUE.equals(t.getIsDeleted()));
    }

    public Trip save(Trip trip) {
        if (trip.getId() != null) {
            tripRepository.findById(trip.getId()).ifPresent(existing -> {
                if (trip.getCreatedAt() == null) {
                    trip.setCreatedAt(existing.getCreatedAt());
                }
                if (trip.getCreatedBy() == null || trip.getCreatedBy().isBlank()) {
                    trip.setCreatedBy(existing.getCreatedBy());
                }
                if (trip.getIsDeleted() == null) {
                    trip.setIsDeleted(existing.getIsDeleted());
                }
                if (trip.getVehicleId() == null) {
                    trip.setVehicleId(existing.getVehicleId());
                }
                if (trip.getDriverId() == null) {
                    trip.setDriverId(existing.getDriverId());
                }
            });
        }
        return tripRepository.save(trip);
    }

    public void deleteById(Long id) {
        tripRepository.findById(id).ifPresent(trip -> {
            trip.setIsDeleted(true);
            trip.setStatus("CANCELLED");
            tripRepository.save(trip);
        });
    }
}
