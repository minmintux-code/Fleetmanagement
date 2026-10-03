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
        return userRepository.findAll();
    }

    public Optional<User> findById(Integer id) {
        return userRepository.findById(id);
    }

    public User save(User user) {
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
        }
        user.setPassword(null);
        return userRepository.save(user);
    }

    public void deleteById(Integer id) {
        userRepository.deleteById(id);
    }
}
