package com.fleetmanagement.repository;

import com.fleetmanagement.entity.Rental;
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
public interface RentalRepository extends JpaRepository<Rental, Long>, JpaSpecificationExecutor<Rental> {
    Optional<Rental> findByIdAndIsDeletedFalse(Long id);
    Optional<Rental> findByRentalCodeAndIsDeletedFalse(String rentalCode);

    List<Rental> findByIsDeletedFalse();
    List<Rental> findByIsDeletedFalse(Sort sort);
    Page<Rental> findByIsDeletedFalse(Pageable pageable);

    List<Rental> findByCustomerIdAndIsDeletedFalse(Long customerId);
    List<Rental> findByVehicleIdAndIsDeletedFalse(Long vehicleId);
    List<Rental> findByStatusAndIsDeletedFalse(String status);
    Page<Rental> findByStatusAndIsDeletedFalse(String status, Pageable pageable);

    @Query("SELECT r FROM Rental r WHERE r.isDeleted = false AND " +
           "(LOWER(r.rentalCode) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(r.status) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Rental> searchRentals(@Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT r FROM Rental r WHERE r.isDeleted = false AND " +
           "r.startDate >= :startDate AND r.endDate <= :endDate")
    List<Rental> findRentalsByDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT COALESCE(SUM(r.totalCostInr), 0) FROM Rental r WHERE r.isDeleted = false")
    BigDecimal sumTotalRevenueInr();

    long countByIsDeletedFalse();
    long countByStatusAndIsDeletedFalse(String status);
    boolean existsByRentalCodeAndIsDeletedFalse(String rentalCode);
}
