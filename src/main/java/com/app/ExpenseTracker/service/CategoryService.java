package com.app.ExpenseTracker.service;

import com.app.ExpenseTracker.dto.CategoryDTO;

import java.util.List;

public interface CategoryService {
    CategoryDTO createCategory(String username, CategoryDTO dto);
    List<CategoryDTO> listCategories(String username);
    CategoryDTO getCategory(String username, Long id);
    CategoryDTO updateCategory(String username, Long id, CategoryDTO dto);
    void deleteCategory(String username, Long id);
}
