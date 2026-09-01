package com.fleetmanagement.controller;

import com.fleetmanagement.entity.Notification;
import com.fleetmanagement.repository.NotificationRepository;
import com.fleetmanagement.config.AuthContext;
import org.springframework.beans.factory.annotation.Autowired;
import com.fleetmanagement.config.AuthContext;
import org.springframework.http.ResponseEntity;
import com.fleetmanagement.config.AuthContext;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")

public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepository;

    @GetMapping
    public ResponseEntity<List<Notification>> getNotifications() {
        return ResponseEntity.ok(notificationRepository.findByOwnerIdAndIsDeletedFalseOrderByTimestampDesc(AuthContext.getUserId()));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id) {
        return notificationRepository.findByIdAndOwnerIdAndIsDeletedFalse(id, AuthContext.getUserId()).map(n -> {
            n.setIsRead(true);
            notificationRepository.save(n);
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead() {
        List<Notification> list = notificationRepository.findByOwnerIdAndIsDeletedFalseOrderByTimestampDesc(AuthContext.getUserId());
        list.forEach(n -> n.setIsRead(true));
        notificationRepository.saveAll(list);
        return ResponseEntity.ok().build();
    }
}
