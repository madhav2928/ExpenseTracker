package com.app.ExpenseTracker.controller;

import com.app.ExpenseTracker.entity.*;
import com.app.ExpenseTracker.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.*;
import java.util.regex.*;

@RestController
@RequestMapping("/api/proposals")
public class ProposalController {

    @Autowired private UserRepository userRepository;
    @Autowired private ProposalRepository proposalRepository;
    @Autowired private AccountRepository accountRepository;
    @Autowired private TransactionRepository transactionRepository;
    @Autowired private CategoryRepository categoryRepository;

    @GetMapping
    public List<Proposal> list(Authentication auth) {
        User user = userRepository.findByEmail(auth.getName()).orElseThrow();
        return proposalRepository.findByUserIdAndStatus(user.getId(), "PENDING");
    }

    @PostMapping("/{id}/accept")
    public Object accept(@PathVariable Long id, Authentication auth) {
        User user = userRepository.findByEmail(auth.getName()).orElseThrow();
        Proposal p = proposalRepository.findById(id).orElseThrow();
        if (!p.getUser().getId().equals(user.getId())) return Map.of("error", "not yours");
        if (!"PENDING".equals(p.getStatus())) return Map.of("error", "already handled");

        // Try match account by digits in accountHint
        Account matched = null;
        String hint = p.getAccountHint() == null ? "" : p.getAccountHint();
        // extract last 3-4 digits
        Matcher m = Pattern.compile("(\\d{3,4})").matcher(hint);
        if (m.find()) {
            String digits = m.group(1);
            Optional<Account> aOpt = accountRepository.findFirstByUserIdAndLast4(user.getId(), digits);
            if (aOpt.isPresent()) matched = aOpt.get();
        }
        if (matched == null) {
            Optional<Account> aOpt = accountRepository.findFirstByUserId(user.getId());
            matched = aOpt.orElse(null);
        }

        TransactionEntity t = new TransactionEntity();
        t.setUser(user);
        t.setAccount(matched);
        t.setMerchant(p.getMerchant());
        t.setAmount(p.getAmount() == null ? BigDecimal.ZERO : p.getAmount());
        t.setCurrency(p.getCurrency());
        t.setType("DEBIT");

        Category category = categoryRepository.findByNameAndUserId("Uncategorized", null).orElseThrow();
        t.setCategory(category);
        t.setSource("PROPOSAL");
        t.setTxnDate(Instant.now());
        transactionRepository.save(t);

        // Adjust account balance estimate (basic)
        if (matched != null && t.getAmount() != null) {
            var bal = matched.getBalanceEstimate() == null ? BigDecimal.ZERO : matched.getBalanceEstimate();
            matched.setBalanceEstimate(bal.subtract(t.getAmount()));
            accountRepository.save(matched);
        }

        p.setStatus("ACCEPTED");
        p.setRespondedAt(Instant.now());
        proposalRepository.save(p);

        return Map.of("transactionId", t.getId());
    }
}
