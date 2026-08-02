package com.fleetmanagement.repository;

import com.fleetmanagement.entity.Trip;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TripRepository extends JpaRepository<Trip, Long>, JpaSpecificationExecutor<Trip> {
    Optional<Trip> findByIdAndIsDeletedFalse(Long id);
    Optional<Trip> findByTripCodeAndIsDeletedFalse(String tripCode);

    List<Trip> findByIsDeletedFalse();
    List<Trip> findByIsDeletedFalse(Sort sort);
    Page<Trip> findByIsDeletedFalse(Pageable pageable);

    List<Trip> findByStatusAndIsDeletedFalse(String status);
    Page<Trip> findByStatusAndIsDeletedFalse(String status, Pageable pageable);

    @Query("SELECT t FROM Trip t WHERE t.isDeleted = false AND " +
           "(LOWER(t.tripCode) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(t.origin) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(t.destination) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(t.cargoDescription) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Trip> searchTrips(@Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT t FROM Trip t WHERE t.isDeleted = false AND " +
           "t.scheduledDeparture BETWEEN :startDate AND :endDate")
    List<Trip> findTripsByDepartureDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    long countByIsDeletedFalse();
    long countByStatusAndIsDeletedFalse(String status);
    boolean existsByTripCodeAndIsDeletedFalse(String tripCode);
}
