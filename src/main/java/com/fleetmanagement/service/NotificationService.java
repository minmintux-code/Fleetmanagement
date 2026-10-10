package com.fleetmanagement.service;

import com.fleetmanagement.entity.Notification;
import com.fleetmanagement.repository.NotificationRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public List<Notification> findAll() {
        return notificationRepository.findByIsDeletedFalse();
    }

    public Optional<Notification> findById(Long id) {
        return notificationRepository.findById(id).filter(n -> !Boolean.TRUE.equals(n.getIsDeleted()));
    }

    public Notification save(Notification notification) {
        if (notification.getId() != null) {
            notificationRepository.findById(notification.getId()).ifPresent(existing -> {
                if (notification.getCreatedAt() == null) {
                    notification.setCreatedAt(existing.getCreatedAt());
                }
                if (notification.getCreatedBy() == null || notification.getCreatedBy().isBlank()) {
                    notification.setCreatedBy(existing.getCreatedBy());
                }
                if (notification.getIsDeleted() == null) {
                    notification.setIsDeleted(existing.getIsDeleted());
                }
                if (notification.getUserId() == null) {
                    notification.setUserId(existing.getUserId());
                }
            });
        }
        return notificationRepository.save(notification);
    }

    public void deleteById(Long id) {
        notificationRepository.findById(id).ifPresent(notification -> {
            notification.setIsDeleted(true);
            notificationRepository.save(notification);
        });
    }
}
