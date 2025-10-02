package com.app.ExpenseTracker.repository;

import com.app.ExpenseTracker.entity.TransactionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionRepository extends JpaRepository<TransactionEntity, Long> {
}
