package com.fleetmanagement.repository;

import com.fleetmanagement.entity.Permission;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, Long>, JpaSpecificationExecutor<Permission> {
    Optional<Permission> findByNameAndIsDeletedFalse(String name);
    List<Permission> findByIsDeletedFalse();
    Page<Permission> findByIsDeletedFalse(Pageable pageable);
    boolean existsByNameAndIsDeletedFalse(String name);
}
