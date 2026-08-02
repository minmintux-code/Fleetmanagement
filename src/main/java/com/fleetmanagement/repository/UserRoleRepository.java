package com.fleetmanagement.repository;

import com.fleetmanagement.entity.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface UserRoleRepository extends JpaRepository<UserRole, Long>, JpaSpecificationExecutor<UserRole> {
    List<UserRole> findByUserIdAndIsDeletedFalse(Long userId);
    List<UserRole> findByRoleIdAndIsDeletedFalse(Long roleId);
    void deleteByUserId(Long userId);
}
