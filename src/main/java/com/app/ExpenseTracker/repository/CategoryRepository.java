package com.app.ExpenseTracker.repository;

import com.app.ExpenseTracker.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByUserId(Long userId);

    Optional<Category> findByNameAndUserId(String name, Long userId);
}
