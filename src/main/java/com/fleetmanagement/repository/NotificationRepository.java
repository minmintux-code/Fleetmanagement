package com.fleetmanagement.repository;

import com.fleetmanagement.entity.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long>, JpaSpecificationExecutor<Notification> {
    List<Notification> findByIsDeletedFalseOrderByTimestampDesc();
    Page<Notification> findByIsDeletedFalse(Pageable pageable);
    List<Notification> findByRecipientUserIdAndIsDeletedFalseOrderByTimestampDesc(Long recipientUserId);
    List<Notification> findByIsReadFalseAndIsDeletedFalse();
}
