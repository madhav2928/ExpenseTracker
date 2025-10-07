package com.app.ExpenseTracker.controller;

import com.app.ExpenseTracker.dto.*;
import com.app.ExpenseTracker.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @PostMapping
    public ResponseEntity<TransactionResponseDTO> create(@Valid @RequestBody TransactionRequestDTO dto, Authentication auth) {
        TransactionResponseDTO res = transactionService.createTransaction(auth.getName(), dto);
        return ResponseEntity.ok(res);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TransactionResponseDTO> get(@PathVariable Long id, Authentication auth) {
        TransactionResponseDTO res = transactionService.getTransaction(auth.getName(), id);
        return ResponseEntity.ok(res);
    }

    @GetMapping
    public ResponseEntity<Page<TransactionResponseDTO>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            Authentication auth
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("txnDate").descending());
        var res = transactionService.listTransactions(auth.getName(), pageable);
        return ResponseEntity.ok(res);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TransactionResponseDTO> update(@PathVariable Long id, @Valid @RequestBody TransactionRequestDTO dto, Authentication auth) {
        TransactionResponseDTO res = transactionService.updateTransaction(auth.getName(), id, dto);
        return ResponseEntity.ok(res);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, Authentication auth) {
        transactionService.deleteTransaction(auth.getName(), id);
        return ResponseEntity.noContent().build();
    }
}
