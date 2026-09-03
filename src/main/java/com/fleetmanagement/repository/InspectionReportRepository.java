package com.fleetmanagement.repository;

import com.fleetmanagement.entity.InspectionReport;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InspectionReportRepository extends JpaRepository<InspectionReport, Long>, JpaSpecificationExecutor<InspectionReport> {
    List<InspectionReport> findByIsDeletedFalse();
    Page<InspectionReport> findByIsDeletedFalse(Pageable pageable);
    List<InspectionReport> findByVehicleIdAndIsDeletedFalse(Long vehicleId);
    List<InspectionReport> findByOverallStatusAndIsDeletedFalse(String overallStatus);
}
