package com.app.ExpenseTracker.service;

import com.app.ExpenseTracker.entity.RevokedToken;
import com.app.ExpenseTracker.repository.RevokedTokenRepository;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

@Service
public class TokenBlacklistService {

    @Autowired
    private RevokedTokenRepository revokedTokenRepository;

    @Value("${jwt.secret}")
    private String secret;

    private Algorithm algorithm() {
        return Algorithm.HMAC256(secret.getBytes());
    }

    @Transactional
    public void revokeToken(String token) {
        try {
            DecodedJWT decoded = JWT.require(algorithm()).build().verify(token);
            Date expiresAt = decoded.getExpiresAt();
            LocalDateTime expiresAtLocal = Instant.ofEpochMilli(expiresAt.getTime())
                    .atZone(ZoneId.systemDefault())
                    .toLocalDateTime();

            RevokedToken revokedToken = new RevokedToken(token, expiresAtLocal);
            revokedTokenRepository.save(revokedToken);
        } catch (Exception e) {
            // If token is invalid or expired, we don't need to blacklist it
            // Just ignore
        }
    }

    public boolean isTokenRevoked(String token) {
        return revokedTokenRepository.findByToken(token).isPresent();
    }
}
