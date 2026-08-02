package com.fleetmanagement.repository;

import com.fleetmanagement.entity.Driver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DriverRepository extends JpaRepository<Driver, Long> {
    List<Driver> findByIsDeletedFalse();
    List<Driver> findByStatusAndIsDeletedFalse(String status);
    long countByIsDeletedFalse();
    long countByStatusAndIsDeletedFalse(String status);
}
