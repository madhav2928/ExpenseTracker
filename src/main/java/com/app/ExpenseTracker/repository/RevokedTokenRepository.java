package com.app.ExpenseTracker.repository;

import com.app.ExpenseTracker.entity.RevokedToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface RevokedTokenRepository extends JpaRepository<RevokedToken, Long> {
    Optional<RevokedToken> findByToken(String token);

    void deleteByExpiresAtBefore(LocalDateTime dateTime);
}
