package com.app.ExpenseTracker.service;

import com.app.ExpenseTracker.dto.TransactionRequestDTO;
import com.app.ExpenseTracker.dto.TransactionResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface TransactionService {
    TransactionResponseDTO createTransaction(String username, TransactionRequestDTO dto);
    TransactionResponseDTO getTransaction(String username, Long id);
    Page<TransactionResponseDTO> listTransactions(String username, Pageable pageable);
    TransactionResponseDTO updateTransaction(String username, Long id, TransactionRequestDTO dto);
    void deleteTransaction(String username, Long id);
}
