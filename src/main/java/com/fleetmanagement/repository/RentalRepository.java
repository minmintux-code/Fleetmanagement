package com.fleetmanagement.repository;

import com.fleetmanagement.entity.Rental;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.util.List;

@Repository
public interface RentalRepository extends JpaRepository<Rental, Long> {
    List<Rental> findByIsDeletedFalse();

    @Query("SELECT COALESCE(SUM(r.totalCostInr), 0) FROM Rental r WHERE r.isDeleted = false")
    BigDecimal sumTotalRevenueInr();
}
