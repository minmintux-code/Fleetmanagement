package com.fleetmanagement.service;

import com.fleetmanagement.entity.User;
import com.fleetmanagement.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<User> findAll() {
        return userRepository.findByIsDeletedFalse();
    }

    public Optional<User> findById(Integer id) {
        return userRepository.findById(id).filter(u -> !Boolean.TRUE.equals(u.getIsDeleted()));
    }

    public User save(User user) {
        if (user.getId() != null) {
            Optional<User> existingOpt = userRepository.findById(user.getId());
            if (existingOpt.isPresent()) {
                User existing = existingOpt.get();
                if (!StringUtils.hasText(user.getPasswordHash()) && !StringUtils.hasText(user.getPassword())) {
                    user.setPasswordHash(existing.getPasswordHash());
                }
                if (user.getCreatedAt() == null) {
                    user.setCreatedAt(existing.getCreatedAt());
                }
                if (!StringUtils.hasText(user.getCreatedBy())) {
                    user.setCreatedBy(existing.getCreatedBy());
                }
                if (!StringUtils.hasText(user.getRole())) {
                    user.setRole(existing.getRole());
                }
                if (!StringUtils.hasText(user.getStatus())) {
                    user.setStatus(existing.getStatus());
                }
                if (user.getIsDeleted() == null) {
                    user.setIsDeleted(existing.getIsDeleted());
                }
            }
        }

        if (StringUtils.hasText(user.getPasswordHash())) {
            if (!user.getPasswordHash().startsWith("$2a$") && !user.getPasswordHash().startsWith("$2b$") && !user.getPasswordHash().startsWith("$2y$")) {
                user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));
            }
        } else if (StringUtils.hasText(user.getPassword())) {
            if (!user.getPassword().startsWith("$2a$") && !user.getPassword().startsWith("$2b$") && !user.getPassword().startsWith("$2y$")) {
                user.setPasswordHash(passwordEncoder.encode(user.getPassword()));
            } else {
                user.setPasswordHash(user.getPassword());
            }
        } else if (user.getId() == null || !StringUtils.hasText(user.getPasswordHash())) {
            user.setPasswordHash(passwordEncoder.encode("Fleetora@123"));
        }
        user.setPassword(null);
        return userRepository.save(user);
    }

    public void deleteById(Integer id) {
        userRepository.findById(id).ifPresent(user -> {
            user.setIsDeleted(true);
            user.setStatus("INACTIVE");
            userRepository.save(user);
        });
    }
}
