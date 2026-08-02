package com.fleetmanagement.repository;

import com.fleetmanagement.entity.Document;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long>, JpaSpecificationExecutor<Document> {
    List<Document> findByIsDeletedFalse();
    Page<Document> findByIsDeletedFalse(Pageable pageable);
    List<Document> findByEntityTypeAndEntityIdAndIsDeletedFalse(String entityType, Long entityId);
}
