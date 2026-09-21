package com.fleetmanagement.controller;

import com.fleetmanagement.config.JwtTokenProvider;
import com.fleetmanagement.entity.User;
import com.fleetmanagement.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthController(UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String usernameOrEmail = request.get("username");
        if (!StringUtils.hasText(usernameOrEmail)) {
            usernameOrEmail = request.get("email");
        }
        String password = request.get("password");

        if (!StringUtils.hasText(usernameOrEmail) || !StringUtils.hasText(password)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Username/Email and password are required."));
        }

        Optional<User> userOpt = userRepository.findByUsernameOrEmail(usernameOrEmail, usernameOrEmail);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid username or password."));
        }

        User user = userOpt.get();
        boolean passwordMatches = false;
        if (user.getPasswordHash() != null && passwordEncoder.matches(password, user.getPasswordHash())) {
            passwordMatches = true;
        } else if (password.equals(user.getPassword()) || password.equals(user.getPasswordHash())) {
            passwordMatches = true;
            // Upgrade legacy stored password to BCrypt
            user.setPasswordHash(passwordEncoder.encode(password));
            userRepository.save(user);
        }

        if (!passwordMatches) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid username or password."));
        }

        if (Boolean.TRUE.equals(user.getIsDeleted())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Account has been deactivated."));
        }

        String role = user.getRole() != null ? user.getRole().toUpperCase() : "USER";
        String token = jwtTokenProvider.generateToken(user.getUsername(), role);

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user", buildUserProfile(user, role));

        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        String fullName = request.get("fullName");
        String username = request.get("username");
        String email = request.get("email");
        String phone = request.get("phone");
        String password = request.get("password");
        String confirmPassword = request.get("confirmPassword");

        if (!StringUtils.hasText(fullName) || !StringUtils.hasText(username) ||
            !StringUtils.hasText(email) || !StringUtils.hasText(password)) {
            return ResponseEntity.badRequest().body(Map.of("message", "All required fields must be provided."));
        }

        if (confirmPassword != null && !password.equals(confirmPassword)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Passwords do not match."));
        }

        if (userRepository.existsByUsername(username)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Username is already taken."));
        }

        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email is already registered."));
        }

        User newUser = new User();
        newUser.setFullName(fullName);
        newUser.setName(fullName);
        newUser.setUsername(username);
        newUser.setEmail(email);
        newUser.setPhone(phone);
        newUser.setPassword(password);
        newUser.setPasswordHash(passwordEncoder.encode(password));
        newUser.setRole("USER"); // Registration ALWAYS creates USER accounts
        newUser.setStatus("ACTIVE");
        newUser.setIsDeleted(false);
        newUser.setCreatedAt(LocalDateTime.now());
        newUser.setCreatedBy(username);
        newUser.setUpdatedAt(LocalDateTime.now());
        newUser.setUpdatedBy(username);

        User savedUser = userRepository.save(newUser);
        String token = jwtTokenProvider.generateToken(savedUser.getUsername(), "USER");

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user", buildUserProfile(savedUser, "USER"));
        response.put("message", "Account created successfully!");

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (!StringUtils.hasText(authHeader) || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "No token provided."));
        }

        String token = authHeader.substring(7);
        if (!jwtTokenProvider.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid or expired token."));
        }

        String username = jwtTokenProvider.getUsernameFromToken(token);
        Optional<User> userOpt = userRepository.findByUsername(username);

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found."));
        }

        User user = userOpt.get();
        String role = user.getRole() != null ? user.getRole().toUpperCase() : "USER";

        Map<String, Object> response = new HashMap<>();
        response.put("user", buildUserProfile(user, role));
        return ResponseEntity.ok(response);
    }

    private Map<String, Object> buildUserProfile(User user, String role) {
        Map<String, Object> profile = new HashMap<>();
        profile.put("id", user.getId());
        profile.put("username", user.getUsername());
        profile.put("fullName", user.getFullName());
        profile.put("name", user.getName());
        profile.put("email", user.getEmail());
        profile.put("phone", user.getPhone());
        profile.put("role", role);
        profile.put("status", user.getStatus());
        profile.put("avatarUrl", user.getAvatarUrl());
        return profile;
    }
}
