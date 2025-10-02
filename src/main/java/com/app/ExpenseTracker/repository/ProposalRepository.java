package com.app.ExpenseTracker.repository;

import com.app.ExpenseTracker.entity.Proposal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProposalRepository extends JpaRepository<Proposal, Long> {
    List<Proposal> findByUserIdAndStatus(Long userId, String status);
}
