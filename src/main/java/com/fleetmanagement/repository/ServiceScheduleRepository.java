package com.fleetmanagement.repository;

import com.fleetmanagement.entity.ServiceSchedule;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ServiceScheduleRepository extends JpaRepository<ServiceSchedule, Long>, JpaSpecificationExecutor<ServiceSchedule> {
    List<ServiceSchedule> findByIsDeletedFalse();
    Page<ServiceSchedule> findByIsDeletedFalse(Pageable pageable);
    List<ServiceSchedule> findByVehicleIdAndIsDeletedFalse(Long vehicleId);
    List<ServiceSchedule> findByStatusAndIsDeletedFalse(String status);
}
