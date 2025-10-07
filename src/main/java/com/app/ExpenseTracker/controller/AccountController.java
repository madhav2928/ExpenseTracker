package com.app.ExpenseTracker.controller;

import com.app.ExpenseTracker.dto.AccountDTO;
import com.app.ExpenseTracker.service.AccountService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    @Autowired private AccountService accountService;

    @PostMapping
    public ResponseEntity<AccountDTO> create(@Valid @RequestBody AccountDTO dto, Authentication auth) {
        AccountDTO res = accountService.createAccount(auth.getName(), dto);
        return ResponseEntity.ok(res);
    }

    @GetMapping
    public ResponseEntity<List<AccountDTO>> list(Authentication auth) {
        return ResponseEntity.ok(accountService.listAccounts(auth.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AccountDTO> get(@PathVariable Long id, Authentication auth) {
        return ResponseEntity.ok(accountService.getAccount(auth.getName(), id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AccountDTO> update(@PathVariable Long id, @Valid @RequestBody AccountDTO dto, Authentication auth) {
        return ResponseEntity.ok(accountService.updateAccount(auth.getName(), id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, Authentication auth) {
        accountService.deleteAccount(auth.getName(), id);
        return ResponseEntity.noContent().build();
    }
}
