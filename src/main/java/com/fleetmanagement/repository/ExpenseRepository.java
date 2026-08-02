package com.fleetmanagement.repository;

import com.fleetmanagement.entity.Expense;
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
public interface ExpenseRepository extends JpaRepository<Expense, Long>, JpaSpecificationExecutor<Expense> {
    Optional<Expense> findByIdAndIsDeletedFalse(Long id);
    Optional<Expense> findByExpenseNumberAndIsDeletedFalse(String expenseNumber);

    List<Expense> findByIsDeletedFalse();
    List<Expense> findByIsDeletedFalse(Sort sort);
    Page<Expense> findByIsDeletedFalse(Pageable pageable);

    List<Expense> findByCategoryAndIsDeletedFalse(String category);
    List<Expense> findByVehicleIdAndIsDeletedFalse(Long vehicleId);
    List<Expense> findByDriverIdAndIsDeletedFalse(Long driverId);
    List<Expense> findByTripIdAndIsDeletedFalse(Long tripId);

    @Query("SELECT e FROM Expense e WHERE e.isDeleted = false AND " +
           "(LOWER(e.expenseNumber) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(e.category) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(e.vendorName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(e.receiptNumber) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Expense> searchExpenses(@Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT e FROM Expense e WHERE e.isDeleted = false AND " +
           "e.incurredDate BETWEEN :startDate AND :endDate")
    List<Expense> findExpensesByDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT COALESCE(SUM(e.amountInr), 0) FROM Expense e WHERE e.isDeleted = false")
    BigDecimal sumTotalExpensesInr();

    boolean existsByExpenseNumberAndIsDeletedFalse(String expenseNumber);
}
