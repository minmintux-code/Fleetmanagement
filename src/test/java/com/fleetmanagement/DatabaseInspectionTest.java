package com.fleetmanagement;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;
import java.util.Map;

@SpringBootTest
public class DatabaseInspectionTest {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Test
    public void inspectColumns() {
        String[] tables = {"vehicles", "drivers", "trips", "maintenance", "fuel", "notifications", "vehicle_types", "users", "dashboard_statistics"};
        for (String table : tables) {
            System.out.println("=== DESCRIBE " + table + " ===");
            List<Map<String, Object>> columns = jdbcTemplate.queryForList("DESCRIBE " + table);
            for (Map<String, Object> col : columns) {
                System.out.println(table + "." + col.get("Field") + " | " + col.get("Type") + " | Null:" + col.get("Null") + " | Default:" + col.get("Default"));
            }
        }
    }
}
