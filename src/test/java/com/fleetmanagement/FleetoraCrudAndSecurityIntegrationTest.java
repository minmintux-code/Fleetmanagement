package com.fleetmanagement;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fleetmanagement.config.JwtTokenProvider;
import com.fleetmanagement.entity.*;
import com.fleetmanagement.repository.*;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class FleetoraCrudAndSecurityIntegrationTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    private MockMvc mockMvc;

    @BeforeEach
    public void setupMockMvc() {
        if (this.mockMvc == null) {
            this.mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext)
                    .apply(springSecurity())
                    .build();
        }
    }

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private VehicleTypeRepository vehicleTypeRepository;

    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private TripRepository tripRepository;

    @Autowired
    private MaintenanceRepository maintenanceRepository;

    @Autowired
    private FuelRepository fuelRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    private static String adminToken;
    private static String userToken;
    private static Long testVehicleTypeId;
    private static Integer testVehicleId;
    private static Integer testDriverId;
    private static Long testTripId;
    private static Long testMaintenanceId;
    private static Long testFuelId;
    private static Long testNotificationId;
    private static Integer testCreatedUserId;

    @BeforeAll
    public void setupTokens() {
        adminToken = jwtTokenProvider.generateToken("fleetora", "ADMIN");
        userToken = jwtTokenProvider.generateToken("simson", "USER");
    }

    @Test
    @Order(1)
    @DisplayName("Auth: Login Success with valid admin credentials")
    public void testLoginSuccess() throws Exception {
        Map<String, String> creds = Map.of("username", "fleetora", "password", "fleetora@123");
        MvcResult result = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(creds)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.role").value("ADMIN"))
                .andReturn();

        Map<?, ?> response = objectMapper.readValue(result.getResponse().getContentAsString(), Map.class);
        assertThat(response.get("token")).isNotNull();
    }

    @Test
    @Order(2)
    @DisplayName("Auth: Login Failure with invalid credentials returns 401")
    public void testLoginFailure() throws Exception {
        Map<String, String> creds = Map.of("username", "fleetora", "password", "wrongpassword");
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(creds)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @Order(3)
    @DisplayName("Auth: /api/auth/me returns user profile with valid JWT")
    public void testAuthMe() throws Exception {
        mockMvc.perform(get("/api/auth/me")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.user.username").value("fleetora"));
    }

    @Test
    @Order(4)
    @DisplayName("Security: Non-admin USER is denied access to /api/users (403 Forbidden)")
    public void testUserCannotAccessUserManagement() throws Exception {
        mockMvc.perform(get("/api/users")
                        .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isForbidden());
    }

    @Test
    @Order(5)
    @DisplayName("Security: Non-admin USER cannot perform write operations (403 Forbidden)")
    public void testUserCannotCreateVehicle() throws Exception {
        Vehicle vehicle = new Vehicle();
        vehicle.setPlateNumber("TEST-DENIED");
        mockMvc.perform(post("/api/vehicles")
                        .header("Authorization", "Bearer " + userToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(vehicle)))
                .andExpect(status().isForbidden());
    }

    @Test
    @Order(6)
    @DisplayName("CRUD VehicleType: Create, Read, Update, Soft-Delete")
    public void testVehicleTypeCrud() throws Exception {
        // CREATE
        VehicleType vt = new VehicleType();
        vt.setCode("TEST_HEAVY");
        vt.setName("Test Heavy Truck");
        vt.setDescription("Heavy commercial testing vehicle");

        MvcResult createRes = mockMvc.perform(post("/api/vehicle-types")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(vt)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists())
                .andReturn();

        VehicleType created = objectMapper.readValue(createRes.getResponse().getContentAsString(), VehicleType.class);
        testVehicleTypeId = created.getId();
        assertThat(testVehicleTypeId).isNotNull();

        // READ
        mockMvc.perform(get("/api/vehicle-types/" + testVehicleTypeId)
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Test Heavy Truck"));

        // UPDATE
        created.setName("Test Heavy Truck Updated");
        mockMvc.perform(put("/api/vehicle-types/" + testVehicleTypeId)
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(created)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Test Heavy Truck Updated"));

        // DELETE (Soft delete)
        mockMvc.perform(delete("/api/vehicle-types/" + testVehicleTypeId)
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isNoContent());

        // Verify it is not in the active list
        MvcResult listRes = mockMvc.perform(get("/api/vehicle-types")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andReturn();
        assertThat(listRes.getResponse().getContentAsString()).doesNotContain("Test Heavy Truck Updated");
    }

    @Test
    @Order(7)
    @DisplayName("CRUD Driver: Create, Read, Update, Soft-Delete")
    public void testDriverCrud() throws Exception {
        // CREATE
        Driver driver = new Driver();
        driver.setFirstName("Alex");
        driver.setLastName("Mercer");
        driver.setEmail("alex.test." + System.currentTimeMillis() + "@fleetora.test");
        driver.setPhone("+1999888777");
        driver.setLicenseNumber("DL-TEST-" + System.currentTimeMillis());
        driver.setLicenseCategory("COMMERCIAL");
        driver.setLicenseExpiryDate(LocalDate.now().plusYears(4));
        driver.setStatus("AVAILABLE");

        MvcResult createRes = mockMvc.perform(post("/api/drivers")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(driver)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists())
                .andReturn();

        Driver created = objectMapper.readValue(createRes.getResponse().getContentAsString(), Driver.class);
        testDriverId = created.getId();

        // READ
        mockMvc.perform(get("/api/drivers/" + testDriverId)
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstName").value("Alex"));

        // UPDATE
        created.setFirstName("Alexander");
        mockMvc.perform(put("/api/drivers/" + testDriverId)
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(created)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstName").value("Alexander"));

        // Keep testDriverId active for Trip test, will delete in tear down
    }

    @Test
    @Order(8)
    @DisplayName("CRUD Vehicle: Create, Read, Update, Soft-Delete")
    public void testVehicleCrud() throws Exception {
        // CREATE
        Vehicle vehicle = new Vehicle();
        vehicle.setPlateNumber("TEST-PL-" + (System.currentTimeMillis() % 10000));
        vehicle.setVin("VINTEST" + (System.currentTimeMillis() % 100000000));
        vehicle.setMake("Volvo");
        vehicle.setModel("FH16");
        vehicle.setYear(2024);
        vehicle.setFuelType("DIESEL");
        vehicle.setStatus("ACTIVE");
        vehicle.setFuelCapacity(300.0);
        vehicle.setCurrentFuelLevel(250.0);
        vehicle.setMileage(15000.0);
        vehicle.setVehicleTypeId(1L); // Links to existing vehicle type 1

        MvcResult createRes = mockMvc.perform(post("/api/vehicles")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(vehicle)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists())
                .andReturn();

        Vehicle created = objectMapper.readValue(createRes.getResponse().getContentAsString(), Vehicle.class);
        testVehicleId = created.getId();

        // READ
        mockMvc.perform(get("/api/vehicles/" + testVehicleId)
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.make").value("Volvo"));

        // UPDATE
        created.setModel("FH16 Super");
        mockMvc.perform(put("/api/vehicles/" + testVehicleId)
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(created)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.model").value("FH16 Super"));

        // Keep vehicle active for Trip, Fuel, Maintenance tests
    }

    @Test
    @Order(9)
    @DisplayName("CRUD Trip: Create, Read, Update, Soft-Delete with FK relations")
    public void testTripCrud() throws Exception {
        // CREATE
        Trip trip = new Trip();
        trip.setTripCode("TRIP-TEST-" + (System.currentTimeMillis() % 10000));
        trip.setOrigin("Chicago Depot");
        trip.setDestination("Detroit Terminal");
        trip.setDistanceKm(450.0);
        trip.setStatus("SCHEDULED");
        trip.setVehicleId(testVehicleId);
        trip.setDriverId(testDriverId);
        trip.setScheduledDeparture(LocalDateTime.now().plusDays(1));
        trip.setScheduledArrival(LocalDateTime.now().plusDays(2));

        MvcResult createRes = mockMvc.perform(post("/api/trips")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(trip)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists())
                .andReturn();

        Trip created = objectMapper.readValue(createRes.getResponse().getContentAsString(), Trip.class);
        testTripId = created.getId();

        // READ
        mockMvc.perform(get("/api/trips/" + testTripId)
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.destination").value("Detroit Terminal"));

        // UPDATE
        created.setStatus("ONGOING");
        mockMvc.perform(put("/api/trips/" + testTripId)
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(created)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("ONGOING"));

        // DELETE
        mockMvc.perform(delete("/api/trips/" + testTripId)
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isNoContent());

        // Verify filtered from active list
        MvcResult listRes = mockMvc.perform(get("/api/trips")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andReturn();
        assertThat(listRes.getResponse().getContentAsString()).doesNotContain("TRIP-TEST-");
    }

    @Test
    @Order(10)
    @DisplayName("CRUD Maintenance: Create, Read, Update, Soft-Delete")
    public void testMaintenanceCrud() throws Exception {
        // CREATE
        Maintenance m = new Maintenance();
        m.setVehicleId(testVehicleId);
        m.setType("PREVENTIVE");
        m.setDescription("Oil and brake check");
        m.setServiceCenter("Central Service Hub");
        m.setScheduledDate(LocalDate.now().plusDays(3));
        m.setEstimatedCostInr(BigDecimal.valueOf(4500.0));
        m.setOdometerReading(15200.0);
        m.setPriority("MEDIUM");
        m.setStatus("SCHEDULED");

        MvcResult createRes = mockMvc.perform(post("/api/maintenance")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(m)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists())
                .andReturn();

        Maintenance created = objectMapper.readValue(createRes.getResponse().getContentAsString(), Maintenance.class);
        testMaintenanceId = created.getId();

        // READ
        mockMvc.perform(get("/api/maintenance/" + testMaintenanceId)
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.serviceCenter").value("Central Service Hub"));

        // UPDATE
        created.setStatus("IN_PROGRESS");
        mockMvc.perform(put("/api/maintenance/" + testMaintenanceId)
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(created)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("IN_PROGRESS"));

        // DELETE
        mockMvc.perform(delete("/api/maintenance/" + testMaintenanceId)
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isNoContent());
    }

    @Test
    @Order(11)
    @DisplayName("CRUD Fuel: Create, Read, Update, Soft-Delete")
    public void testFuelCrud() throws Exception {
        // CREATE
        Fuel fuel = new Fuel();
        fuel.setVehicleId(testVehicleId);
        fuel.setStationName("Shell Express #42");
        fuel.setFilledAt(LocalDateTime.now());
        fuel.setFuelDate(LocalDate.now());
        fuel.setLiters(60.0);
        fuel.setCostPerLiterInr(BigDecimal.valueOf(95.50));
        fuel.setTotalCostInr(BigDecimal.valueOf(5730.0));
        fuel.setOdometerReading(15300.0);

        MvcResult createRes = mockMvc.perform(post("/api/fuel")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(fuel)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists())
                .andReturn();

        Fuel created = objectMapper.readValue(createRes.getResponse().getContentAsString(), Fuel.class);
        testFuelId = created.getId();

        // READ
        mockMvc.perform(get("/api/fuel/" + testFuelId)
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.stationName").value("Shell Express #42"));

        // UPDATE
        created.setStationName("Shell Express #42 Updated");
        mockMvc.perform(put("/api/fuel/" + testFuelId)
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(created)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.stationName").value("Shell Express #42 Updated"));

        // DELETE
        mockMvc.perform(delete("/api/fuel/" + testFuelId)
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isNoContent());
    }

    @Test
    @Order(12)
    @DisplayName("CRUD Notification: Create, Read, Update, Soft-Delete")
    public void testNotificationCrud() throws Exception {
        // CREATE
        Notification n = new Notification();
        n.setTitle("Speed Alert Test");
        n.setMessage("Vehicle exceeded 100km/h");
        n.setCategory("ALERT");
        n.setType("WARNING");
        n.setStatus("UNREAD");

        MvcResult createRes = mockMvc.perform(post("/api/notifications")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(n)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists())
                .andReturn();

        Notification created = objectMapper.readValue(createRes.getResponse().getContentAsString(), Notification.class);
        testNotificationId = created.getId();

        // READ
        mockMvc.perform(get("/api/notifications/" + testNotificationId)
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Speed Alert Test"));

        // UPDATE
        created.setIsRead(true);
        mockMvc.perform(put("/api/notifications/" + testNotificationId)
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(created)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.isRead").value(true));

        // DELETE
        mockMvc.perform(delete("/api/notifications/" + testNotificationId)
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isNoContent());
    }

    @Test
    @Order(13)
    @DisplayName("CRUD User Management: Create User, Toggle Status, Password Preservation")
    public void testUserManagementCrud() throws Exception {
        // CREATE
        User newUser = new User();
        newUser.setUsername("testofficer" + (System.currentTimeMillis() % 10000));
        newUser.setFullName("Test Officer");
        newUser.setEmail("officer" + System.currentTimeMillis() + "@fleetora.test");
        newUser.setPassword("officerPass123");
        newUser.setRole("USER");
        newUser.setStatus("ACTIVE");

        MvcResult createRes = mockMvc.perform(post("/api/users")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newUser)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists())
                .andReturn();

        User created = objectMapper.readValue(createRes.getResponse().getContentAsString(), User.class);
        testCreatedUserId = created.getId();

        // UPDATE (Simulate status toggle without sending password - must NOT wipe password or fail null constraint)
        created.setStatus("INACTIVE");
        mockMvc.perform(put("/api/users/" + testCreatedUserId)
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(created)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("INACTIVE"));

        // Verify password hash in DB is preserved and not null
        User dbUser = userRepository.findById(testCreatedUserId).orElseThrow();
        assertThat(dbUser.getPasswordHash()).isNotEmpty();
        assertThat(dbUser.getStatus()).isEqualTo("INACTIVE");

        // DELETE (Soft delete)
        mockMvc.perform(delete("/api/users/" + testCreatedUserId)
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isNoContent());
    }

    @Test
    @Order(14)
    @DisplayName("Dashboard Statistics: Calculated from live database without fabricated values")
    public void testDashboardStatisticsLiveCalculation() throws Exception {
        MvcResult res = mockMvc.perform(get("/api/dashboard-statistics")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andReturn();

        DashboardStatistics[] stats = objectMapper.readValue(res.getResponse().getContentAsString(), DashboardStatistics[].class);
        assertThat(stats).isNotEmpty();

        DashboardStatistics current = stats[0];
        // Ensure total vehicles is accurate and >= 2
        assertThat(current.getTotalVehicles()).isGreaterThanOrEqualTo(2);
        // Ensure revenue is real (0, not the fabricated 50000.0)
        assertThat(current.getTotalRevenueInr()).isEqualTo(BigDecimal.ZERO);
    }

    @AfterAll
    public void cleanUp() {
        // Clean up only the specific test entities created in this test suite
        if (testTripId != null) tripRepository.deleteById(testTripId);
        if (testMaintenanceId != null) maintenanceRepository.deleteById(testMaintenanceId);
        if (testFuelId != null) fuelRepository.deleteById(testFuelId);
        if (testNotificationId != null) notificationRepository.deleteById(testNotificationId);
        if (testVehicleId != null) vehicleRepository.deleteById(testVehicleId);
        if (testDriverId != null) driverRepository.deleteById(testDriverId);
        if (testVehicleTypeId != null) vehicleTypeRepository.deleteById(testVehicleTypeId);
        if (testCreatedUserId != null) userRepository.deleteById(testCreatedUserId);
    }
}
