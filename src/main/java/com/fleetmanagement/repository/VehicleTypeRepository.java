package com.fleetmanagement.repository;

import com.fleetmanagement.entity.VehicleType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleTypeRepository extends JpaRepository<VehicleType, Long>, JpaSpecificationExecutor<VehicleType> {
    Optional<VehicleType> findByCodeAndIsDeletedFalse(String code);
    List<VehicleType> findByIsDeletedFalse();
    Page<VehicleType> findByIsDeletedFalse(Pageable pageable);
    boolean existsByCodeAndIsDeletedFalse(String code);
}
