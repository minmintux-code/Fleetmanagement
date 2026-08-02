package com.fleetmanagement.repository;

import com.fleetmanagement.entity.TripAssignment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TripAssignmentRepository extends JpaRepository<TripAssignment, Long>, JpaSpecificationExecutor<TripAssignment> {
    List<TripAssignment> findByTripIdAndIsDeletedFalse(Long tripId);
    List<TripAssignment> findByVehicleIdAndIsDeletedFalse(Long vehicleId);
    List<TripAssignment> findByDriverIdAndIsDeletedFalse(Long driverId);
    Page<TripAssignment> findByIsDeletedFalse(Pageable pageable);
}
