package com.app.ExpenseTracker.controller;

import com.app.ExpenseTracker.dto.IngestRequest;
import com.app.ExpenseTracker.entity.*;
import com.app.ExpenseTracker.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;

@RestController
@RequestMapping("/api/ingest")
public class IngestController {

    @Autowired private UserRepository userRepository;
    @Autowired private ProposalRepository proposalRepository;

    @PostMapping
    public Object ingest(@RequestBody IngestRequest req, Authentication authentication) {
        // authenticated user
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElseThrow();

        Proposal p = new Proposal();
        p.setUser(user);
        if (req.getAmount() != null) p.setAmount(req.getAmount());
        p.setCurrency(req.getCurrency());
        p.setMerchant(req.getMerchant());
        p.setAccountHint(req.getAccountHint());
        p.setParsedJson(req.getRawText());
        p.setStatus("PENDING");
        p.setCreatedAt(Instant.now());
        proposalRepository.save(p);

        String display = String.format("Add ₹%s for %s ?", (req.getAmount()==null ? "0" : req.getAmount()), req.getMerchant());
        return java.util.Map.of("proposalId", p.getId(), "displayText", display);
    }
}
