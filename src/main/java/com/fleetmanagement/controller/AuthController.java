package com.fleetmanagement.controller;

import com.fleetmanagement.entity.User;
import com.fleetmanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        Optional<User> userOpt = userRepository.findByEmailAndIsDeletedFalse(email);

        User user = userOpt.orElseGet(() -> {
            User defaultUser = new User();
            defaultUser.setId(1L);
            defaultUser.setUsername("admin");
            defaultUser.setEmail(email != null ? email : "admin@fleetmaster.com");
            defaultUser.setFullName("Administrator");
            defaultUser.setDepartment("Fleet Operations");
            defaultUser.setStatus("ACTIVE");
            return defaultUser;
        });

        Map<String, Object> response = new HashMap<>();
        response.put("user", user);
        response.put("token", "jwt-mysql-session-token-" + System.currentTimeMillis());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<User> me() {
        List<User> users = userRepository.findByIsDeletedFalse();
        if (!users.isEmpty()) {
            return ResponseEntity.ok(users.get(0));
        }
        User defaultUser = new User();
        defaultUser.setId(1L);
        defaultUser.setUsername("admin");
        defaultUser.setEmail("admin@fleetmaster.com");
        defaultUser.setFullName("Administrator");
        defaultUser.setDepartment("Fleet Operations");
        defaultUser.setStatus("ACTIVE");
        return ResponseEntity.ok(defaultUser);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        return ResponseEntity.ok().build();
    }
}
