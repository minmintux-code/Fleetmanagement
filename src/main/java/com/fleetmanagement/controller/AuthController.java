package com.fleetmanagement.controller;

import com.fleetmanagement.config.AuthContext;
import com.fleetmanagement.config.PasswordUtils;
import com.fleetmanagement.entity.User;
import com.fleetmanagement.entity.UserSession;
import com.fleetmanagement.repository.UserRepository;
import com.fleetmanagement.repository.UserSessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserSessionRepository userSessionRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String adminId = body.get("adminId");
        String username = body.get("username");
        String password = body.get("password");

        if (adminId == null || username == null || password == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Admin ID, Username, and password are required."));
        }

        // Fixed credentials for application access
        if (!"Admin123".equals(adminId) || !"Admin123".equals(password)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid Admin ID or Password."));
        }

        // Workspace identification via Username
        Optional<User> userOpt = userRepository.findByUsernameAndIsDeletedFalse(username);
        User user;

        if (userOpt.isEmpty()) {
            // Dynamically create the user workspace
            user = new User();
            user.setUsername(username);
            user.setFullName(username);
            user.setEmail(username + "@fleetmanagement.com");
            user.setPasswordHash(PasswordUtils.hashPassword("Admin123")); // Required by DB but not used for auth
            user.setStatus("ACTIVE");
            user.setIsDeleted(false);
            userRepository.save(user);
        } else {
            user = userOpt.get();
        }

        if (!"ACTIVE".equalsIgnoreCase(user.getStatus())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Your workspace is inactive."));
        }

        // Generate Token
        String token = UUID.randomUUID().toString();
        UserSession session = new UserSession();
        session.setToken(token);
        session.setUser(user);
        session.setExpiresAt(LocalDateTime.now().plusHours(24));
        userSessionRepository.save(session);

        // Remove password from response
        user.setPasswordHash(null);

        Map<String, Object> response = new HashMap<>();
        response.put("user", user);
        response.put("token", token);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        Long userId = AuthContext.getUserId();
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        User user = userOpt.get();
        user.setPasswordHash(null);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            userSessionRepository.deleteByToken(token);
        }
        return ResponseEntity.ok().build();
    }
}
