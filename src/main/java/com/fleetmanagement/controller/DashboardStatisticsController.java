package com.fleetmanagement.controller;

import com.fleetmanagement.entity.DashboardStatistics;
import com.fleetmanagement.service.DashboardStatisticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard-statistics")
public class DashboardStatisticsController {

    private final DashboardStatisticsService dashboardStatisticsService;

    public DashboardStatisticsController(DashboardStatisticsService dashboardStatisticsService) {
        this.dashboardStatisticsService = dashboardStatisticsService;
    }

    @GetMapping
    public List<DashboardStatistics> getAllDashboardStatistics() {
        return dashboardStatisticsService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<DashboardStatistics> getDashboardStatisticsById(@PathVariable Long id) {
        return dashboardStatisticsService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public DashboardStatistics createDashboardStatistics(@RequestBody DashboardStatistics dashboardStatistics) {
        return dashboardStatisticsService.save(dashboardStatistics);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DashboardStatistics> updateDashboardStatistics(@PathVariable Long id, @RequestBody DashboardStatistics dashboardStatistics) {
        return dashboardStatisticsService.findById(id)
                .map(existing -> {
                    dashboardStatistics.setId(id);
                    return ResponseEntity.ok(dashboardStatisticsService.save(dashboardStatistics));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDashboardStatistics(@PathVariable Long id) {
        if (dashboardStatisticsService.findById(id).isPresent()) {
            dashboardStatisticsService.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
