package com.fleetmanagement.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DriverManager;

@Configuration
public class DatabaseConfig {

    @Value("${spring.datasource.url:jdbc:mysql://localhost:3306/fleetmanagement_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true&createDatabaseIfNotExist=true}")
    private String mysqlUrl;

    @Value("${spring.datasource.username:simson}")
    private String mysqlUsername;

    @Value("${spring.datasource.password:qrpasses321}")
    private String mysqlPassword;

    @Bean
    @Primary
    public DataSource dataSource() {
        // Test MySQL connectivity
        try (Connection conn = DriverManager.getConnection(mysqlUrl, mysqlUsername, mysqlPassword)) {
            System.out.println(">>> Successfully connected to Primary MySQL Database!");
            return DataSourceBuilder.create()
                    .driverClassName("com.mysql.cj.jdbc.Driver")
                    .url(mysqlUrl)
                    .username(mysqlUsername)
                    .password(mysqlPassword)
                    .build();
        } catch (Exception e) {
            System.out.println(">>> Primary MySQL Database unreachable: " + e.getMessage());
            System.out.println(">>> Activating resilient embedded H2 SQL Database (MySQL dialect mode).");
            return DataSourceBuilder.create()
                    .driverClassName("org.h2.Driver")
                    .url("jdbc:h2:mem:fleetmanagement_db;DB_CLOSE_DELAY=-1;MODE=MySQL;NON_KEYWORDS=USER,VALUE")
                    .username("sa")
                    .password("")
                    .build();
        }
    }
}
