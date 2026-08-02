package com.fleetmanagement.repository;

import com.fleetmanagement.entity.DashboardStatistic;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface DashboardStatisticRepository extends JpaRepository<DashboardStatistic, Long>, JpaSpecificationExecutor<DashboardStatistic> {
    Optional<DashboardStatistic> findByStatDateAndIsDeletedFalse(LocalDate statDate);
    List<DashboardStatistic> findByIsDeletedFalse();
    Page<DashboardStatistic> findByIsDeletedFalse(Pageable pageable);
    List<DashboardStatistic> findByStatDateBetweenAndIsDeletedFalse(LocalDate startDate, LocalDate endDate);
}
