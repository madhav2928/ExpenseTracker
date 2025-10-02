package com.app.ExpenseTracker.repository;

import com.app.ExpenseTracker.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Long> {
    List<Account> findByUserId(Long userId);
    Optional<Account> findFirstByUserIdAndLast4(Long userId, String last4);
    Optional<Account> findFirstByUserId(Long userId);
}
