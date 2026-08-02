package com.fleetmanagement.repository;

import com.fleetmanagement.entity.FuelLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.util.List;

@Repository
public interface FuelLogRepository extends JpaRepository<FuelLog, Long> {
    List<FuelLog> findByIsDeletedFalse();

    @Query("SELECT COALESCE(SUM(f.totalCostInr), 0) FROM FuelLog f WHERE f.isDeleted = false")
    BigDecimal sumTotalFuelCostInr();
}
