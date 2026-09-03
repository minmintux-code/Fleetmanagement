package com.fleetmanagement.controller;

import com.fleetmanagement.config.AuthContext;
import com.fleetmanagement.dto.InspectionDTO;
import com.fleetmanagement.entity.Driver;
import com.fleetmanagement.entity.InspectionReport;
import com.fleetmanagement.entity.Maintenance;
import com.fleetmanagement.entity.Vehicle;
import com.fleetmanagement.repository.DriverRepository;
import com.fleetmanagement.repository.InspectionReportRepository;
import com.fleetmanagement.repository.MaintenanceRepository;
import com.fleetmanagement.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/inspections")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000"})
public class InspectionController {

    private static final Long DEV_OWNER_ID = 1L;

    @Autowired
    private InspectionReportRepository inspectionReportRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private MaintenanceRepository maintenanceRepository;

    private Long resolveOwnerId() {
        Long id = AuthContext.getUserId();
        return (id != null) ? id : DEV_OWNER_ID;
    }

    private InspectionDTO mapToDTO(InspectionReport r) {
        InspectionDTO dto = new InspectionDTO();
        dto.setId(r.getId());
        if (r.getVehicle() != null) {
            dto.setVehicleId(r.getVehicle().getId());
            dto.setVehiclePlateNumber(r.getVehicle().getPlateNumber());
            dto.setVehicleMakeModel(r.getVehicle().getMake() + " " + r.getVehicle().getModel());
        }
        if (r.getDriver() != null) {
            dto.setDriverId(r.getDriver().getId());
            dto.setDriverName(r.getDriver().getFirstName() + " " + r.getDriver().getLastName());
        }
        dto.setInspectionType(r.getInspectionType());
        dto.setInspectionDate(r.getInspectionDate());
        dto.setOverallStatus(r.getOverallStatus());
        dto.setBrakesStatus(r.getBrakesStatus());
        dto.setTiresStatus(r.getTiresStatus());
        dto.setLightsStatus(r.getLightsStatus());
        dto.setSteeringStatus(r.getSteeringStatus());
        dto.setFluidsStatus(r.getFluidsStatus());
        dto.setDefectsDescription(r.getDefectsDescription());
        dto.setRepaired(r.getRepaired());
        dto.setCreatedAt(r.getCreatedAt());
        return dto;
    }

    @GetMapping
    public ResponseEntity<List<InspectionDTO>> getAllInspections() {
        List<InspectionDTO> list = inspectionReportRepository.findByIsDeletedFalse()
                .stream().map(this::mapToDTO).collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    @GetMapping("/vehicle/{vehicleId}")
    public ResponseEntity<List<InspectionDTO>> getInspectionsByVehicle(@PathVariable Long vehicleId) {
        List<InspectionDTO> list = inspectionReportRepository.findByVehicleIdAndIsDeletedFalse(vehicleId)
                .stream().map(this::mapToDTO).collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    @PostMapping
    public ResponseEntity<InspectionDTO> createInspection(@RequestBody InspectionDTO dto) {
        if (dto.getVehicleId() == null) {
            return ResponseEntity.badRequest().build();
        }
        Vehicle vehicle = vehicleRepository.findById(dto.getVehicleId()).orElse(null);
        if (vehicle == null) {
            return ResponseEntity.badRequest().build();
        }

        Driver driver = null;
        if (dto.getDriverId() != null) {
            driver = driverRepository.findById(dto.getDriverId()).orElse(null);
        }

        InspectionReport report = new InspectionReport();
        report.setOwnerId(resolveOwnerId());
        report.setVehicle(vehicle);
        report.setDriver(driver);
        report.setInspectionType(dto.getInspectionType() != null ? dto.getInspectionType() : "PRE_TRIP");
        report.setInspectionDate(dto.getInspectionDate() != null ? dto.getInspectionDate() : LocalDate.now());
        report.setBrakesStatus(dto.getBrakesStatus() != null ? dto.getBrakesStatus() : "PASS");
        report.setTiresStatus(dto.getTiresStatus() != null ? dto.getTiresStatus() : "PASS");
        report.setLightsStatus(dto.getLightsStatus() != null ? dto.getLightsStatus() : "PASS");
        report.setSteeringStatus(dto.getSteeringStatus() != null ? dto.getSteeringStatus() : "PASS");
        report.setFluidsStatus(dto.getFluidsStatus() != null ? dto.getFluidsStatus() : "PASS");
        report.setDefectsDescription(dto.getDefectsDescription());

        boolean hasDefect = "FAIL".equalsIgnoreCase(dto.getBrakesStatus()) ||
                "FAIL".equalsIgnoreCase(dto.getTiresStatus()) ||
                "FAIL".equalsIgnoreCase(dto.getLightsStatus()) ||
                "FAIL".equalsIgnoreCase(dto.getSteeringStatus()) ||
                "FAIL".equalsIgnoreCase(dto.getFluidsStatus());

        String overall = hasDefect ? "FAIL" : (dto.getOverallStatus() != null ? dto.getOverallStatus() : "PASS");
        report.setOverallStatus(overall);
        report.setRepaired(false);

        InspectionReport saved = inspectionReportRepository.save(report);

        // If safety defect flagged, automatically create high-priority Maintenance work order and set vehicle to IN_MAINTENANCE
        if ("FAIL".equalsIgnoreCase(overall)) {
            Maintenance m = new Maintenance();
            m.setOwnerId(resolveOwnerId());
            m.setVehicle(vehicle);
            m.setType("REPAIR");
            m.setPriority("CRITICAL");
            m.setStatus("SCHEDULED");
            m.setScheduledDate(LocalDate.now());
            m.setServiceCenter("Mobile Service Team / Depot");
            m.setDescription("DVIR Safety Defect Reported: " + (dto.getDefectsDescription() != null ? dto.getDefectsDescription() : "Safety Inspection Fail"));
            m.setEstimatedCostInr(java.math.BigDecimal.valueOf(10000.0));
            m.setOdometerReading(vehicle.getMileage() != null ? vehicle.getMileage() : 0.0);
            maintenanceRepository.save(m);

            vehicle.setStatus("IN_MAINTENANCE");
            vehicleRepository.save(vehicle);
        }

        return ResponseEntity.ok(mapToDTO(saved));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInspection(@PathVariable Long id) {
        return inspectionReportRepository.findById(id).map(r -> {
            r.setIsDeleted(true);
            inspectionReportRepository.save(r);
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
