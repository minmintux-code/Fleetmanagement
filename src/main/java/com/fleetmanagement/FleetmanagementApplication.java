package com.fleetmanagement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import jakarta.annotation.PostConstruct;
import java.util.List;

@SpringBootApplication
public class FleetmanagementApplication {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostConstruct
    public void fixUniqueConstraints() {
        try {
            // Drop global unique constraint on plate_number if it exists
            List<String> plateConstraints = jdbcTemplate.queryForList(
                "SELECT CONSTRAINT_NAME FROM information_schema.table_constraints " +
                "WHERE table_name='vehicles' AND constraint_type='UNIQUE' AND CONSTRAINT_NAME LIKE '%plate%'", String.class);
            for (String constraint : plateConstraints) {
                jdbcTemplate.execute("ALTER TABLE vehicles DROP INDEX " + constraint);
            }

            // Drop global unique constraint on vin if it exists
            List<String> vinConstraints = jdbcTemplate.queryForList(
                "SELECT CONSTRAINT_NAME FROM information_schema.table_constraints " +
                "WHERE table_name='vehicles' AND constraint_type='UNIQUE' AND CONSTRAINT_NAME LIKE '%vin%'", String.class);
            for (String constraint : vinConstraints) {
                jdbcTemplate.execute("ALTER TABLE vehicles DROP INDEX " + constraint);
            }
            
            // Drop global unique constraint on code if it exists
            List<String> codeConstraints = jdbcTemplate.queryForList(
                "SELECT CONSTRAINT_NAME FROM information_schema.table_constraints " +
                "WHERE table_name='vehicle_types' AND constraint_type='UNIQUE' AND CONSTRAINT_NAME LIKE '%code%'", String.class);
            for (String constraint : codeConstraints) {
                jdbcTemplate.execute("ALTER TABLE vehicle_types DROP INDEX " + constraint);
            }

            // Add composite unique constraints for workspace isolation
            try {
                jdbcTemplate.execute("ALTER TABLE vehicles ADD CONSTRAINT uk_workspace_plate UNIQUE (owner_id, plate_number)");
            } catch (Exception e) {}
            try {
                jdbcTemplate.execute("ALTER TABLE vehicles ADD CONSTRAINT uk_workspace_vin UNIQUE (owner_id, vin)");
            } catch (Exception e) {}
            try {
                jdbcTemplate.execute("ALTER TABLE vehicle_types ADD CONSTRAINT uk_workspace_code UNIQUE (owner_id, code)");
            } catch (Exception e) {}
        } catch (Exception e) {
            System.err.println("Could not update constraints: " + e.getMessage());
        }
    }

	public static void main(String[] args) {
		SpringApplication.run(FleetmanagementApplication.class, args);
	}
}
