package com.fleetmanagement.repository;

import com.fleetmanagement.entity.Driver;
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
public interface DriverRepository extends JpaRepository<Driver, Long>, JpaSpecificationExecutor<Driver> {
    Optional<Driver> findByIdAndIsDeletedFalse(Long id);
    Optional<Driver> findByEmailAndIsDeletedFalse(String email);
    Optional<Driver> findByLicenseNumberAndIsDeletedFalse(String licenseNumber);

    List<Driver> findByIsDeletedFalse();
    List<Driver> findByIsDeletedFalse(Sort sort);
    Page<Driver> findByIsDeletedFalse(Pageable pageable);

    List<Driver> findByStatusAndIsDeletedFalse(String status);
    Page<Driver> findByStatusAndIsDeletedFalse(String status, Pageable pageable);

    @Query("SELECT d FROM Driver d WHERE d.isDeleted = false AND " +
           "(LOWER(d.firstName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(d.lastName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(d.email) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(d.phone) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(d.licenseNumber) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Driver> searchDrivers(@Param("keyword") String keyword, Pageable pageable);

    long countByIsDeletedFalse();
    long countByStatusAndIsDeletedFalse(String status);
    boolean existsByLicenseNumberAndIsDeletedFalse(String licenseNumber);
    boolean existsByEmailAndIsDeletedFalse(String email);
}
