package com.fleetmanagement.repository;

import com.fleetmanagement.entity.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TripRepository extends JpaRepository<Trip, Long> {
    List<Trip> findByIsDeletedFalse();
    List<Trip> findByStatusAndIsDeletedFalse(String status);
    long countByStatusAndIsDeletedFalse(String status);
}
