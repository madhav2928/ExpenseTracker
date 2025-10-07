package com.app.ExpenseTracker.repository;

import com.app.ExpenseTracker.entity.TransactionEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionRepository extends JpaRepository<TransactionEntity, Long> {
    Page<TransactionEntity> findByUserId(Long userId, Pageable pageable);
}
