package com.fleetmanagement.controller;

import com.fleetmanagement.config.AuthContext;
import com.fleetmanagement.dto.TripDTO;
import com.fleetmanagement.entity.Driver;
import com.fleetmanagement.entity.Trip;
import com.fleetmanagement.entity.TripAssignment;
import com.fleetmanagement.entity.Vehicle;
import com.fleetmanagement.repository.DriverRepository;
import com.fleetmanagement.repository.TripAssignmentRepository;
import com.fleetmanagement.repository.TripRepository;
import com.fleetmanagement.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/trips")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000"})
public class TripController {

    private static final Long DEV_OWNER_ID = 1L;

    @Autowired
    private TripRepository tripRepository;

    @Autowired
    private TripAssignmentRepository tripAssignmentRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private DriverRepository driverRepository;

    private Long resolveOwnerId() {
        Long id = AuthContext.getUserId();
        return (id != null) ? id : DEV_OWNER_ID;
    }

    @GetMapping
    public ResponseEntity<List<TripDTO>> getAllTrips() {
        List<Trip> trips = tripRepository.findByOwnerIdAndIsDeletedFalse(resolveOwnerId());
        List<TripDTO> dtos = trips.stream().map(this::mapToDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PostMapping
    @Transactional
    public ResponseEntity<TripDTO> createTrip(@RequestBody TripDTO dto) {
        Trip trip = new Trip();
        trip.setTripCode(dto.getTripCode());
        trip.setOrigin(dto.getOrigin());
        trip.setDestination(dto.getDestination());
        trip.setScheduledDeparture(dto.getScheduledDeparture());
        trip.setScheduledArrival(dto.getScheduledArrival());
        trip.setDistanceKm(dto.getDistanceKm() != null ? dto.getDistanceKm() : 0.0);
        trip.setStatus(dto.getStatus() != null ? dto.getStatus() : "SCHEDULED");
        trip.setCargoDescription(dto.getCargoDescription());
        trip.setNotes(dto.getNotes());
        trip.setOwnerId(resolveOwnerId());

        Trip savedTrip = tripRepository.save(trip);

        if (dto.getVehicleId() != null && dto.getDriverId() != null) {
            Vehicle vehicle = vehicleRepository.findByIdAndOwnerIdAndIsDeletedFalse(dto.getVehicleId(), resolveOwnerId()).orElse(null);
            Driver driver = driverRepository.findByIdAndOwnerIdAndIsDeletedFalse(dto.getDriverId(), resolveOwnerId()).orElse(null);

            if (vehicle != null && driver != null) {
                TripAssignment assignment = new TripAssignment();
                assignment.setTrip(savedTrip);
                assignment.setVehicle(vehicle);
                assignment.setDriver(driver);
                assignment.setAssignedAt(LocalDateTime.now());
                assignment.setStatus("ASSIGNED");
                tripAssignmentRepository.save(assignment);
            }
        }

        return ResponseEntity.ok(mapToDTO(savedTrip));
    }

    private TripDTO mapToDTO(Trip trip) {
        TripDTO dto = new TripDTO();
        dto.setId(trip.getId());
        dto.setTripCode(trip.getTripCode());
        dto.setOrigin(trip.getOrigin());
        dto.setDestination(trip.getDestination());
        dto.setScheduledDeparture(trip.getScheduledDeparture());
        dto.setScheduledArrival(trip.getScheduledArrival());
        dto.setActualDeparture(trip.getActualDeparture());
        dto.setActualArrival(trip.getActualArrival());
        dto.setDistanceKm(trip.getDistanceKm());
        dto.setStatus(trip.getStatus());
        dto.setCargoDescription(trip.getCargoDescription());
        dto.setNotes(trip.getNotes());
        dto.setCreatedAt(trip.getCreatedAt());

        TripAssignment assignment = tripAssignmentRepository.findByTripIdAndIsDeletedFalse(trip.getId()).stream().findFirst().orElse(null);
        if (assignment != null) {
            if (assignment.getVehicle() != null) {
                dto.setVehicleId(assignment.getVehicle().getId());
                dto.setVehiclePlate(assignment.getVehicle().getPlateNumber());
            }
            if (assignment.getDriver() != null) {
                dto.setDriverId(assignment.getDriver().getId());
                dto.setDriverName(assignment.getDriver().getFirstName() + " " + assignment.getDriver().getLastName());
            }
        }

        return dto;
    }
}
