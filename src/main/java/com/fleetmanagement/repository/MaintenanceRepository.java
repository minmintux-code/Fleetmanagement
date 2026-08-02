package com.fleetmanagement.repository;

import com.fleetmanagement.entity.Maintenance;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface MaintenanceRepository extends JpaRepository<Maintenance, Long>, JpaSpecificationExecutor<Maintenance> {
    Optional<Maintenance> findByIdAndIsDeletedFalse(Long id);

    List<Maintenance> findByIsDeletedFalse();
    List<Maintenance> findByIsDeletedFalse(Sort sort);
    Page<Maintenance> findByIsDeletedFalse(Pageable pageable);

    List<Maintenance> findByVehicleIdAndIsDeletedFalse(Long vehicleId);
    Page<Maintenance> findByVehicleIdAndIsDeletedFalse(Long vehicleId, Pageable pageable);

    List<Maintenance> findByStatusAndIsDeletedFalse(String status);
    List<Maintenance> findByPriorityAndIsDeletedFalse(String priority);
    List<Maintenance> findByTypeAndIsDeletedFalse(String type);

    @Query("SELECT m FROM Maintenance m WHERE m.isDeleted = false AND " +
           "(LOWER(m.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(m.serviceCenter) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(m.technicianName) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Maintenance> searchMaintenance(@Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT m FROM Maintenance m WHERE m.isDeleted = false AND " +
           "m.scheduledDate BETWEEN :startDate AND :endDate")
    List<Maintenance> findMaintenanceByDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT COALESCE(SUM(m.estimatedCostInr), 0) FROM Maintenance m WHERE m.isDeleted = false")
    BigDecimal sumTotalMaintenanceCostInr();

    long countByIsDeletedFalse();
    long countByStatusAndIsDeletedFalse(String status);
}
