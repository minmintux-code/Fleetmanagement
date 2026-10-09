package com.fleetmanagement.config;

import com.fleetmanagement.entity.User;
import com.fleetmanagement.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Optional;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        Optional<User> adminOpt = userRepository.findByUsername("fleetora");
        if (adminOpt.isEmpty()) {
            log.info("Admin account not found. Creating predefined admin user...");
            User admin = new User();
            admin.setUsername("fleetora");
            admin.setFullName("System Administrator");
            admin.setName("System Administrator");
            admin.setEmail("admin@fleetora.com");
            admin.setPassword(null);
            admin.setPasswordHash(passwordEncoder.encode("fleetora@123"));
            admin.setRole("ADMIN");
            admin.setStatus("ACTIVE");
            admin.setDepartment("Fleet Operations");
            admin.setPhone("+1000000000");
            admin.setIsDeleted(false);
            admin.setCreatedAt(LocalDateTime.now());
            admin.setCreatedBy("SYSTEM");
            admin.setUpdatedAt(LocalDateTime.now());
            admin.setUpdatedBy("SYSTEM");

            userRepository.save(admin);
            log.info("Predefined admin user created successfully.");
        } else {
            User admin = adminOpt.get();
            // Force reset password to fleetora@123 to ensure it works for the user
            admin.setPasswordHash(passwordEncoder.encode("fleetora@123"));
            admin.setPassword(null);
            admin.setRole("ADMIN");
            admin.setUpdatedAt(LocalDateTime.now());
            admin.setUpdatedBy("SYSTEM");
            userRepository.save(admin);
            log.info("Forced update of existing admin user password hash to fleetora@123.");
        }
    }
}
