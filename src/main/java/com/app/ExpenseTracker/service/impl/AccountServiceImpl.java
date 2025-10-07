package com.app.ExpenseTracker.service.impl;

import com.app.ExpenseTracker.dto.AccountDTO;
import com.app.ExpenseTracker.entity.Account;
import com.app.ExpenseTracker.entity.User;
import com.app.ExpenseTracker.exception.NotFoundException;
import com.app.ExpenseTracker.repository.*;
import com.app.ExpenseTracker.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AccountServiceImpl implements AccountService {

    @Autowired private UserRepository userRepository;
    @Autowired private AccountRepository accountRepository;

    @Override
    public AccountDTO createAccount(String username, AccountDTO dto) {
        User user = userRepository.findByEmail(username).orElseThrow(() -> new NotFoundException("User not found"));
        Account acc = new Account();
        acc.setUser(user);
        acc.setName(dto.getName());
        acc.setType(dto.getType());
        acc.setLast4(dto.getLast4());
        acc.setBalanceEstimate(dto.getBalanceEstimate());
        accountRepository.save(acc);
        dto.setId(acc.getId());
        return dto;
    }

    @Override
    public AccountDTO updateAccount(String username, Long id, AccountDTO dto) {
        User user = userRepository.findByEmail(username).orElseThrow(() -> new NotFoundException("User not found"));
        Account acc = accountRepository.findById(id).orElseThrow(() -> new NotFoundException("Account not found"));
        if (!acc.getUser().getId().equals(user.getId())) throw new NotFoundException("Account not found");
        acc.setName(dto.getName());
        acc.setType(dto.getType());
        acc.setLast4(dto.getLast4());
        acc.setBalanceEstimate(dto.getBalanceEstimate());
        accountRepository.save(acc);
        dto.setId(acc.getId());
        return dto;
    }

    @Override
    public AccountDTO getAccount(String username, Long id) {
        User user = userRepository.findByEmail(username).orElseThrow(() -> new NotFoundException("User not found"));
        Account acc = accountRepository.findById(id).orElseThrow(() -> new NotFoundException("Account not found"));
        if (!acc.getUser().getId().equals(user.getId())) throw new NotFoundException("Account not found");
        return toDto(acc);
    }

    @Override
    public java.util.List<AccountDTO> listAccounts(String username) {
        User user = userRepository.findByEmail(username).orElseThrow(() -> new NotFoundException("User not found"));
        return accountRepository.findByUserId(user.getId())
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteAccount(String username, Long id) {
        User user = userRepository.findByEmail(username).orElseThrow(() -> new NotFoundException("User not found"));
        Account acc = accountRepository.findById(id).orElseThrow(() -> new NotFoundException("Account not found"));
        if (!acc.getUser().getId().equals(user.getId())) throw new NotFoundException("Account not found");
        accountRepository.delete(acc);
    }

    private AccountDTO toDto(Account acc) {
        AccountDTO dto = new AccountDTO();
        dto.setId(acc.getId());
        dto.setName(acc.getName());
        dto.setType(acc.getType());
        dto.setLast4(acc.getLast4());
        dto.setBalanceEstimate(acc.getBalanceEstimate());
        return dto;
    }
}
