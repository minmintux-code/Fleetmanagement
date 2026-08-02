package com.fleetmanagement.repository;

import com.fleetmanagement.entity.ActivityLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long>, JpaSpecificationExecutor<ActivityLog> {
    List<ActivityLog> findByIsDeletedFalse();
    Page<ActivityLog> findByIsDeletedFalse(Pageable pageable);
    List<ActivityLog> findByUserIdAndIsDeletedFalse(Long userId);
    List<ActivityLog> findByTimestampBetweenAndIsDeletedFalse(LocalDateTime startDate, LocalDateTime endDate);
}
