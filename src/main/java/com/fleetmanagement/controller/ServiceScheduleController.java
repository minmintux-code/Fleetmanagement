package com.fleetmanagement.controller;

import com.fleetmanagement.config.AuthContext;
import com.fleetmanagement.dto.ServiceScheduleDTO;
import com.fleetmanagement.entity.Maintenance;
import com.fleetmanagement.entity.ServiceSchedule;
import com.fleetmanagement.entity.Vehicle;
import com.fleetmanagement.repository.MaintenanceRepository;
import com.fleetmanagement.repository.ServiceScheduleRepository;
import com.fleetmanagement.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/service-schedules")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000"})
public class ServiceScheduleController {

    private static final Long DEV_OWNER_ID = 1L;

    @Autowired
    private ServiceScheduleRepository serviceScheduleRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private MaintenanceRepository maintenanceRepository;

    private Long resolveOwnerId() {
        Long id = AuthContext.getUserId();
        return (id != null) ? id : DEV_OWNER_ID;
    }

    private ServiceScheduleDTO mapToDTO(ServiceSchedule s) {
        ServiceScheduleDTO dto = new ServiceScheduleDTO();
        dto.setId(s.getId());
        if (s.getVehicle() != null) {
            dto.setVehicleId(s.getVehicle().getId());
            dto.setVehiclePlateNumber(s.getVehicle().getPlateNumber());
            dto.setVehicleMakeModel(s.getVehicle().getMake() + " " + s.getVehicle().getModel());
        }
        dto.setServiceName(s.getServiceName());
        dto.setIntervalKm(s.getIntervalKm());
        dto.setIntervalMonths(s.getIntervalMonths());
        dto.setLastServiceDate(s.getLastServiceDate());
        dto.setLastServiceKm(s.getLastServiceKm());
        dto.setNextDueDate(s.getNextDueDate());
        dto.setNextDueKm(s.getNextDueKm());

        // Dynamic status check: OVERDUE if nextDueDate is before today or vehicle mileage > nextDueKm
        String status = s.getStatus();
        if (!"COMPLETED".equalsIgnoreCase(status)) {
            LocalDate today = LocalDate.now();
            boolean isOverdueByDate = (s.getNextDueDate() != null && s.getNextDueDate().isBefore(today));
            boolean isOverdueByKm = (s.getVehicle() != null && s.getNextDueKm() != null && s.getVehicle().getMileage() != null && s.getVehicle().getMileage() >= s.getNextDueKm());
            if (isOverdueByDate || isOverdueByKm) {
                status = "OVERDUE";
            }
        }
        dto.setStatus(status);
        dto.setCreatedAt(s.getCreatedAt());
        return dto;
    }

    @GetMapping
    public ResponseEntity<List<ServiceScheduleDTO>> getAllSchedules() {
        List<ServiceScheduleDTO> list = serviceScheduleRepository.findByIsDeletedFalse()
                .stream().map(this::mapToDTO).collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    @GetMapping("/vehicle/{vehicleId}")
    public ResponseEntity<List<ServiceScheduleDTO>> getSchedulesByVehicle(@PathVariable Long vehicleId) {
        List<ServiceScheduleDTO> list = serviceScheduleRepository.findByVehicleIdAndIsDeletedFalse(vehicleId)
                .stream().map(this::mapToDTO).collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    @PostMapping
    public ResponseEntity<ServiceScheduleDTO> createSchedule(@RequestBody ServiceScheduleDTO dto) {
        if (dto.getVehicleId() == null) {
            return ResponseEntity.badRequest().build();
        }
        Vehicle vehicle = vehicleRepository.findById(dto.getVehicleId()).orElse(null);
        if (vehicle == null) {
            return ResponseEntity.badRequest().build();
        }

        ServiceSchedule s = new ServiceSchedule();
        s.setOwnerId(resolveOwnerId());
        s.setVehicle(vehicle);
        s.setServiceName(dto.getServiceName());
        s.setIntervalKm(dto.getIntervalKm() != null ? dto.getIntervalKm() : 10000.0);
        s.setIntervalMonths(dto.getIntervalMonths() != null ? dto.getIntervalMonths() : 6);
        
        LocalDate lastDate = dto.getLastServiceDate() != null ? dto.getLastServiceDate() : LocalDate.now();
        Double lastKm = dto.getLastServiceKm() != null ? dto.getLastServiceKm() : vehicle.getMileage();
        
        s.setLastServiceDate(lastDate);
        s.setLastServiceKm(lastKm);
        
        s.setNextDueDate(dto.getNextDueDate() != null ? dto.getNextDueDate() : lastDate.plusMonths(s.getIntervalMonths()));
        s.setNextDueKm(dto.getNextDueKm() != null ? dto.getNextDueKm() : lastKm + s.getIntervalKm());
        s.setStatus(dto.getStatus() != null ? dto.getStatus() : "PENDING");

        ServiceSchedule saved = serviceScheduleRepository.save(s);
        return ResponseEntity.ok(mapToDTO(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ServiceScheduleDTO> updateSchedule(@PathVariable Long id, @RequestBody ServiceScheduleDTO dto) {
        return serviceScheduleRepository.findById(id).map(s -> {
            s.setServiceName(dto.getServiceName());
            if (dto.getIntervalKm() != null) s.setIntervalKm(dto.getIntervalKm());
            if (dto.getIntervalMonths() != null) s.setIntervalMonths(dto.getIntervalMonths());
            if (dto.getLastServiceDate() != null) s.setLastServiceDate(dto.getLastServiceDate());
            if (dto.getLastServiceKm() != null) s.setLastServiceKm(dto.getLastServiceKm());
            if (dto.getNextDueDate() != null) s.setNextDueDate(dto.getNextDueDate());
            if (dto.getNextDueKm() != null) s.setNextDueKm(dto.getNextDueKm());
            if (dto.getStatus() != null) s.setStatus(dto.getStatus());
            return ResponseEntity.ok(mapToDTO(serviceScheduleRepository.save(s)));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/convert-to-maintenance")
    public ResponseEntity<Maintenance> convertToMaintenance(@PathVariable Long id) {
        return serviceScheduleRepository.findById(id).map(s -> {
            Vehicle vehicle = s.getVehicle();
            Maintenance m = new Maintenance();
            m.setOwnerId(resolveOwnerId());
            m.setVehicle(vehicle);
            m.setType("PREVENTIVE");
            m.setDescription("Preventive Maintenance: " + s.getServiceName() + " (Scheduled Interval Check)");
            m.setServiceCenter("Fleet Main Depot");
            m.setPriority("HIGH");
            m.setStatus("SCHEDULED");
            m.setScheduledDate(LocalDate.now());
            m.setEstimatedCostInr(java.math.BigDecimal.valueOf(15000.0)); // Estimated standard service cost in INR
            m.setOdometerReading(vehicle != null && vehicle.getMileage() != null ? vehicle.getMileage() : 0.0);
            Maintenance savedMaintenance = maintenanceRepository.save(m);

            // Update schedule status
            s.setStatus("COMPLETED");
            s.setLastServiceDate(LocalDate.now());
            if (vehicle != null && vehicle.getMileage() != null) {
                s.setLastServiceKm(vehicle.getMileage());
                s.setNextDueKm(vehicle.getMileage() + s.getIntervalKm());
            }
            s.setNextDueDate(LocalDate.now().plusMonths(s.getIntervalMonths()));
            serviceScheduleRepository.save(s);

            return ResponseEntity.ok(savedMaintenance);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSchedule(@PathVariable Long id) {
        return serviceScheduleRepository.findById(id).map(s -> {
            s.setIsDeleted(true);
            serviceScheduleRepository.save(s);
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
