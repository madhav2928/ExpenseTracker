package com.app.ExpenseTracker.service.impl;

import com.app.ExpenseTracker.dto.CategoryDTO;
import com.app.ExpenseTracker.entity.Category;
import com.app.ExpenseTracker.entity.User;
import com.app.ExpenseTracker.exception.NotFoundException;
import com.app.ExpenseTracker.repository.CategoryRepository;
import com.app.ExpenseTracker.repository.UserRepository;
import com.app.ExpenseTracker.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired private CategoryRepository categoryRepository;
    @Autowired private UserRepository userRepository;

    @Override
    public CategoryDTO createCategory(String username, CategoryDTO dto) {
        User user = userRepository.findByEmail(username).orElseThrow(() -> new NotFoundException("User not found"));
        Category c = new Category();
        c.setUserId(user.getId());
        c.setName(dto.getName());
        c.setParent(dto.getParent());
        categoryRepository.save(c);
        dto.setId(c.getId());
        return dto;
    }

    @Override
    public List<CategoryDTO> listCategories(String username) {
        User user = userRepository.findByEmail(username).orElseThrow(() -> new NotFoundException("User not found"));
        return categoryRepository.findByUserId(user.getId())
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public CategoryDTO getCategory(String username, Long id) {
        User user = userRepository.findByEmail(username).orElseThrow(() -> new NotFoundException("User not found"));
        Category c = categoryRepository.findById(id).orElseThrow(() -> new NotFoundException("Category not found"));
        if (c.getUserId() == null || !c.getUserId().equals(user.getId())) throw new NotFoundException("Category not found");
        return toDto(c);
    }

    @Override
    public CategoryDTO updateCategory(String username, Long id, CategoryDTO dto) {
        User user = userRepository.findByEmail(username).orElseThrow(() -> new NotFoundException("User not found"));
        Category c = categoryRepository.findById(id).orElseThrow(() -> new NotFoundException("Category not found"));
        if (c.getUserId() == null || !c.getUserId().equals(user.getId())) throw new NotFoundException("Category not found");
        c.setName(dto.getName());
        c.setParent(dto.getParent());
        categoryRepository.save(c);
        dto.setId(c.getId());
        return dto;
    }

    @Override
    public void deleteCategory(String username, Long id) {
        User user = userRepository.findByEmail(username).orElseThrow(() -> new NotFoundException("User not found"));
        Category c = categoryRepository.findById(id).orElseThrow(() -> new NotFoundException("Category not found"));
        if (c.getUserId() == null || !c.getUserId().equals(user.getId())) throw new NotFoundException("Category not found");
        categoryRepository.delete(c);
    }

    private CategoryDTO toDto(Category c) {
        CategoryDTO dto = new CategoryDTO();
        dto.setId(c.getId());
        dto.setName(c.getName());
        dto.setParent(c.getParent());
        return dto;
    }
}
