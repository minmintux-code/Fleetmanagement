package com.fleetmanagement.repository;

import com.fleetmanagement.entity.Payment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long>, JpaSpecificationExecutor<Payment> {
    Optional<Payment> findByIdAndIsDeletedFalse(Long id);
    Optional<Payment> findByPaymentNumberAndIsDeletedFalse(String paymentNumber);

    List<Payment> findByIsDeletedFalse();
    List<Payment> findByIsDeletedFalse(Sort sort);
    Page<Payment> findByIsDeletedFalse(Pageable pageable);

    List<Payment> findByRentalIdAndIsDeletedFalse(Long rentalId);
    List<Payment> findByCustomerIdAndIsDeletedFalse(Long customerId);
    List<Payment> findByStatusAndIsDeletedFalse(String status);
    List<Payment> findByPaymentModeAndIsDeletedFalse(String paymentMode);

    @Query("SELECT COALESCE(SUM(p.amountInr), 0) FROM Payment p WHERE p.isDeleted = false AND p.status = 'SUCCESS'")
    BigDecimal sumTotalSuccessfulPaymentsInr();

    boolean existsByPaymentNumberAndIsDeletedFalse(String paymentNumber);
}
