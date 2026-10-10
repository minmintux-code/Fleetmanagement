package com.fleetmanagement.config;

import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.util.StringUtils;

import javax.sql.DataSource;
import java.net.URI;

@Configuration
public class DatabaseConfig {

    private static final Logger log = LoggerFactory.getLogger(DatabaseConfig.class);

    @Value("${spring.datasource.url:}")
    private String defaultUrl;

    @Value("${spring.datasource.username:}")
    private String defaultUsername;

    @Value("${spring.datasource.password:}")
    private String defaultPassword;

    @Value("${spring.datasource.driver-class-name:com.mysql.cj.jdbc.Driver}")
    private String driverClassName;

    @Value("${MYSQL_URL:}")
    private String envMysqlUrl;

    @Value("${DATABASE_URL:}")
    private String envDatabaseUrl;

    @Value("${MYSQLHOST:${MYSQL_HOST:}}")
    private String mysqlHost;

    @Value("${MYSQLPORT:${MYSQL_PORT:3306}}")
    private String mysqlPort;

    @Value("${MYSQLDATABASE:${MYSQL_DATABASE:}}")
    private String mysqlDatabase;

    @Value("${MYSQLUSER:${MYSQL_USER:}}")
    private String mysqlUser;

    @Value("${MYSQLPASSWORD:${MYSQL_PASSWORD:}}")
    private String mysqlPassword;

    @Bean
    @Primary
    public DataSource dataSource() {
        String resolvedUrl = null;
        String resolvedUser = null;
        String resolvedPass = null;

        // 1. Inspect combined connection URLs from Railway or environment (MYSQL_URL or DATABASE_URL)
        String combinedUrl = StringUtils.hasText(envMysqlUrl) ? envMysqlUrl : envDatabaseUrl;
        if (StringUtils.hasText(combinedUrl)) {
            try {
                if (combinedUrl.startsWith("mysql://")) {
                    URI uri = new URI(combinedUrl);
                    String host = uri.getHost();
                    int port = uri.getPort() > 0 ? uri.getPort() : 3306;
                    String path = uri.getPath();
                    String dbName = (path != null && path.length() > 1) ? path.substring(1) : "fleetmanagement_db";
                    resolvedUrl = String.format("jdbc:mysql://%s:%d/%s?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC", host, port, dbName);

                    if (uri.getUserInfo() != null) {
                        String[] userInfo = uri.getUserInfo().split(":", 2);
                        resolvedUser = userInfo[0];
                        if (userInfo.length > 1) {
                            resolvedPass = userInfo[1];
                        }
                    }
                    log.info("Successfully converted Railway mysql:// URL to JDBC: jdbc:mysql://{}:{}/{}", host, port, dbName);
                } else if (combinedUrl.startsWith("jdbc:mysql://")) {
                    resolvedUrl = combinedUrl;
                }
            } catch (Exception ex) {
                log.warn("Failed to parse combined MySQL URL URI: {}. Falling back to individual parameters.", ex.getMessage());
            }
        }

        // 2. Check discrete Railway variables (MYSQLHOST, MYSQLPORT, MYSQLDATABASE)
        if (!StringUtils.hasText(resolvedUrl) && StringUtils.hasText(mysqlHost)) {
            String db = StringUtils.hasText(mysqlDatabase) ? mysqlDatabase : "fleetmanagement_db";
            resolvedUrl = String.format("jdbc:mysql://%s:%s/%s?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC", mysqlHost, mysqlPort, db);
            log.info("Configured JDBC URL from Railway discrete host/port: jdbc:mysql://{}:{}/{}", mysqlHost, mysqlPort, db);
        }

        // 3. Fallback to spring.datasource.url or local default
        if (!StringUtils.hasText(resolvedUrl)) {
            resolvedUrl = StringUtils.hasText(defaultUrl) ? defaultUrl : "jdbc:mysql://localhost:3306/fleetmanagement_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC";
        }

        // Resolve credentials
        if (!StringUtils.hasText(resolvedUser)) {
            if (StringUtils.hasText(mysqlUser)) {
                resolvedUser = mysqlUser;
            } else if (StringUtils.hasText(defaultUsername)) {
                resolvedUser = defaultUsername;
            } else {
                resolvedUser = "root";
            }
        }

        if (!StringUtils.hasText(resolvedPass)) {
            if (StringUtils.hasText(mysqlPassword)) {
                resolvedPass = mysqlPassword;
            } else if (StringUtils.hasText(defaultPassword)) {
                resolvedPass = defaultPassword;
            } else {
                resolvedPass = "qrpasses321";
            }
        }

        log.info("Initializing HikariDataSource -> URL: {}, Username: {}", resolvedUrl, resolvedUser);

        HikariDataSource dataSource = new HikariDataSource();
        dataSource.setJdbcUrl(resolvedUrl);
        dataSource.setUsername(resolvedUser);
        dataSource.setPassword(resolvedPass);
        dataSource.setDriverClassName(driverClassName);
        dataSource.setMaximumPoolSize(10);
        dataSource.setMinimumIdle(2);
        dataSource.setIdleTimeout(30000);
        dataSource.setConnectionTimeout(20000);
        dataSource.setMaxLifetime(1800000);
        return dataSource;
    }
}
