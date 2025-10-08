package com.app.ExpenseTracker.service.impl;

import com.app.ExpenseTracker.dto.*;
import com.app.ExpenseTracker.entity.*;
import com.app.ExpenseTracker.exception.NotFoundException;
import com.app.ExpenseTracker.repository.*;
import com.app.ExpenseTracker.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;

@Service
public class TransactionServiceImpl implements TransactionService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public TransactionResponseDTO createTransaction(String username, TransactionRequestDTO dto) {
        User user = userRepository.findByEmail(username).orElseThrow(() -> new NotFoundException("User not found"));
        TransactionEntity t = new TransactionEntity();
        t.setUser(user);
        if (dto.getAccountId() != null) {
            var acc = accountRepository.findById(dto.getAccountId())
                    .orElseThrow(() -> new NotFoundException("Account not found"));
            t.setAccount(acc);
        } else {
            // pick first account as default
            var accOpt = accountRepository.findFirstByUserId(user.getId());
            accOpt.ifPresent(t::setAccount);
        }
        t.setMerchant(dto.getMerchant());
        t.setAmount(dto.getAmount());
        t.setCurrency(dto.getCurrency());
        t.setType(dto.getType());

        Category category;
        if (dto.getCategoryId() != null) {
            category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new NotFoundException("Category not found"));
        } else {
            // Default to global "Uncategorized"
            category = categoryRepository.findByNameAndUserId("Uncategorized", null)
                    .orElseThrow(() -> new NotFoundException("Default category not found"));
        }
        t.setCategory(category);

        t.setSource(dto.getSource());
        t.setTxnDate(Instant.now());
        transactionRepository.save(t);

        // adjust balance estimate if account present
        if (t.getAccount() != null && t.getAmount() != null) {
            var bal = t.getAccount().getBalanceEstimate() == null ? BigDecimal.ZERO : t.getAccount().getBalanceEstimate();
            if ("DEBIT".equalsIgnoreCase(t.getType())) {
                t.getAccount().setBalanceEstimate(bal.subtract(t.getAmount()));
            } else {
                t.getAccount().setBalanceEstimate(bal.add(t.getAmount()));
            }
            accountRepository.save(t.getAccount());
        }

        return toDto(t);
    }

    @Override
    public TransactionResponseDTO getTransaction(String username, Long id) {
        User user = userRepository.findByEmail(username).orElseThrow(() -> new NotFoundException("User not found"));
        TransactionEntity t = transactionRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Transaction not found"));
        if (!t.getUser().getId().equals(user.getId())) throw new NotFoundException("Transaction not found");
        return toDto(t);
    }

    @Override
    public Page<TransactionResponseDTO> listTransactions(String username, Pageable pageable) {
        User user = userRepository.findByEmail(username).orElseThrow(() -> new NotFoundException("User not found"));
        Page<TransactionEntity> page = transactionRepository.findByUserId(user.getId(), pageable);
        return page.map(this::toDto);
    }

    @Override
    public Page<TransactionResponseDTO> listTransactionsByCategory(String username, Long categoryId, Pageable pageable) {
        User user = userRepository.findByEmail(username).orElseThrow(() -> new NotFoundException("User not found"));
        Page<TransactionEntity> page = transactionRepository.findByUserIdAndCategoryId(user.getId(), categoryId, pageable);
        return page.map(this::toDto);
    }

    @Override
    public TransactionResponseDTO updateTransaction(String username, Long id, TransactionRequestDTO dto) {
        User user = userRepository.findByEmail(username).orElseThrow(() -> new NotFoundException("User not found"));
        TransactionEntity t = transactionRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Transaction not found"));
        if (!t.getUser().getId().equals(user.getId())) throw new NotFoundException("Transaction not found");

        t.setMerchant(dto.getMerchant());
        t.setAmount(dto.getAmount());
        t.setCurrency(dto.getCurrency());
        t.setType(dto.getType());

        if (dto.getCategoryId() != null) {
            Category category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new NotFoundException("Category not found"));
            t.setCategory(category);
        } // else keep existing

        t.setSource(dto.getSource());
        transactionRepository.save(t);
        return toDto(t);
    }

    @Override
    public void deleteTransaction(String username, Long id) {
        User user = userRepository.findByEmail(username).orElseThrow(() -> new NotFoundException("User not found"));
        TransactionEntity t = transactionRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Transaction not found"));
        if (!t.getUser().getId().equals(user.getId())) throw new NotFoundException("Transaction not found");
        transactionRepository.delete(t);
    }

    private TransactionResponseDTO toDto(TransactionEntity t) {
        TransactionResponseDTO dto = new TransactionResponseDTO();
        dto.setId(t.getId());
        dto.setAccountId(t.getAccount() == null ? null : t.getAccount().getId());
        dto.setMerchant(t.getMerchant());
        dto.setAmount(t.getAmount());
        dto.setCurrency(t.getCurrency());
        dto.setType(t.getType());
        dto.setCategoryId(t.getCategory() != null ? t.getCategory().getId() : null);
        dto.setCategoryName(t.getCategory() != null ? t.getCategory().getName() : null);
        dto.setSource(t.getSource());
        dto.setTxnDate(t.getTxnDate());
        return dto;
    }
}
