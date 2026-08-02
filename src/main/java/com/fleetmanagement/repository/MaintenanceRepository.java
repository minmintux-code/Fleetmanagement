package com.fleetmanagement.repository;

import com.fleetmanagement.entity.Maintenance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.util.List;

@Repository
public interface MaintenanceRepository extends JpaRepository<Maintenance, Long> {
    List<Maintenance> findByIsDeletedFalse();

    @Query("SELECT COALESCE(SUM(m.estimatedCostInr), 0) FROM Maintenance m WHERE m.isDeleted = false")
    BigDecimal sumTotalMaintenanceCostInr();
}
