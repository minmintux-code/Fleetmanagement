package com.fleetmanagement.config;

import com.fleetmanagement.entity.User;
import com.fleetmanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {
        Optional<User> adminOpt = userRepository.findByUsernameAndIsDeletedFalse("admin");
        if (adminOpt.isEmpty()) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPasswordHash(PasswordUtils.hashPassword("admin123"));
            admin.setFullName("System Administrator");
            admin.setEmail("admin@fleetmanagement.com");
            admin.setStatus("ACTIVE");
            admin.setIsDeleted(false);
            userRepository.save(admin);
            System.out.println("Default admin user created: admin / admin123");
        }
    }
}
