package com.fleetmanagement.repository;

import com.fleetmanagement.entity.Vehicle;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long>, JpaSpecificationExecutor<Vehicle> {
    Optional<Vehicle> findByIdAndIsDeletedFalse(Long id);
    Optional<Vehicle> findByVinAndIsDeletedFalse(String vin);
    Optional<Vehicle> findByPlateNumberAndIsDeletedFalse(String plateNumber);

    List<Vehicle> findByIsDeletedFalse();
    List<Vehicle> findByIsDeletedFalse(Sort sort);
    Page<Vehicle> findByIsDeletedFalse(Pageable pageable);

    List<Vehicle> findByStatusAndIsDeletedFalse(String status);
    Page<Vehicle> findByStatusAndIsDeletedFalse(String status, Pageable pageable);

    List<Vehicle> findByFuelTypeAndIsDeletedFalse(String fuelType);
    Page<Vehicle> findByFuelTypeAndIsDeletedFalse(String fuelType, Pageable pageable);

    @Query("SELECT v FROM Vehicle v WHERE v.isDeleted = false AND " +
           "(LOWER(v.plateNumber) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(v.vin) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(v.make) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(v.model) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(v.location) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Vehicle> searchVehicles(@Param("keyword") String keyword, Pageable pageable);

    long countByIsDeletedFalse();
    long countByStatusAndIsDeletedFalse(String status);
    boolean existsByVinAndIsDeletedFalse(String vin);
    boolean existsByPlateNumberAndIsDeletedFalse(String plateNumber);
}
