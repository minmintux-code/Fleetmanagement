package com.fleetmanagement.repository;

import com.fleetmanagement.entity.UserSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface UserSessionRepository extends JpaRepository<UserSession, Long> {
    Optional<UserSession> findByTokenAndExpiresAtAfter(String token, LocalDateTime now);
    void deleteByToken(String token);
}
