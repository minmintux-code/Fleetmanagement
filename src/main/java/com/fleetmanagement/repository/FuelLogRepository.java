package com.fleetmanagement.repository;

import com.fleetmanagement.entity.FuelLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface FuelLogRepository extends JpaRepository<FuelLog, Long>, JpaSpecificationExecutor<FuelLog> {
    Optional<FuelLog> findByIdAndIsDeletedFalse(Long id);

    List<FuelLog> findByIsDeletedFalse();
    List<FuelLog> findByIsDeletedFalse(Sort sort);
    Page<FuelLog> findByIsDeletedFalse(Pageable pageable);

    List<FuelLog> findByVehicleIdAndIsDeletedFalse(Long vehicleId);
    Page<FuelLog> findByVehicleIdAndIsDeletedFalse(Long vehicleId, Pageable pageable);
    List<FuelLog> findByDriverIdAndIsDeletedFalse(Long driverId);

    @Query("SELECT f FROM FuelLog f WHERE f.isDeleted = false AND " +
           "f.filledAt BETWEEN :startDate AND :endDate")
    List<FuelLog> findLogsByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT COALESCE(SUM(f.totalCostInr), 0) FROM FuelLog f WHERE f.isDeleted = false")
    BigDecimal sumTotalFuelCostInr();

    @Query("SELECT COALESCE(SUM(f.liters), 0) FROM FuelLog f WHERE f.isDeleted = false AND f.vehicle.id = :vehicleId")
    Double sumTotalLitersByVehicle(@Param("vehicleId") Long vehicleId);
}
