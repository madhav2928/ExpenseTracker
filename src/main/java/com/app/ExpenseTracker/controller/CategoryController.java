package com.app.ExpenseTracker.controller;

import com.app.ExpenseTracker.dto.CategoryDTO;
import com.app.ExpenseTracker.dto.TransactionResponseDTO;
import com.app.ExpenseTracker.service.CategoryService;
import com.app.ExpenseTracker.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired private CategoryService categoryService;
    @Autowired private TransactionService transactionService;

    @PostMapping
    public ResponseEntity<CategoryDTO> create(@Valid @RequestBody CategoryDTO dto, Authentication auth) {
        CategoryDTO created = categoryService.createCategory(auth.getName(), dto);
        return ResponseEntity.ok(created);
    }

    @GetMapping
    public ResponseEntity<List<CategoryDTO>> list(Authentication auth) {
        return ResponseEntity.ok(categoryService.listCategories(auth.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryDTO> get(@PathVariable Long id, Authentication auth) {
        return ResponseEntity.ok(categoryService.getCategory(auth.getName(), id));
    }

    @GetMapping("/{id}/transactions")
    public ResponseEntity<Page<TransactionResponseDTO>> getTransactions(
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            Authentication auth
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("txnDate").descending());
        Page<TransactionResponseDTO> transactions = transactionService.listTransactionsByCategory(auth.getName(), id, pageable);
        return ResponseEntity.ok(transactions);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoryDTO> update(@PathVariable Long id, @Valid @RequestBody CategoryDTO dto, Authentication auth) {
        return ResponseEntity.ok(categoryService.updateCategory(auth.getName(), id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, Authentication auth) {
        categoryService.deleteCategory(auth.getName(), id);
        return ResponseEntity.noContent().build();
    }
}
