package com.fleetmanagement.repository;

import com.fleetmanagement.entity.RolePermission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RolePermissionRepository extends JpaRepository<RolePermission, Long>, JpaSpecificationExecutor<RolePermission> {
    List<RolePermission> findByRoleIdAndIsDeletedFalse(Long roleId);
    List<RolePermission> findByPermissionIdAndIsDeletedFalse(Long permissionId);
    void deleteByRoleId(Long roleId);
}
