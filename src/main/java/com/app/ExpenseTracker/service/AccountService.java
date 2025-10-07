package com.app.ExpenseTracker.service;

import com.app.ExpenseTracker.dto.AccountDTO;

import java.util.List;

public interface AccountService {
    AccountDTO createAccount(String username, AccountDTO dto);
    AccountDTO updateAccount(String username, Long id, AccountDTO dto);
    AccountDTO getAccount(String username, Long id);
    List<AccountDTO> listAccounts(String username);
    void deleteAccount(String username, Long id);
}
