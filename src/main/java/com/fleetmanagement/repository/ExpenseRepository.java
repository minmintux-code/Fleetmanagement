package com.fleetmanagement.repository;

import com.fleetmanagement.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByIsDeletedFalse();

    @Query("SELECT COALESCE(SUM(e.amountInr), 0) FROM Expense e WHERE e.isDeleted = false")
    BigDecimal sumTotalExpensesInr();
}
