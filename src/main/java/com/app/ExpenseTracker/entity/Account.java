package com.app.ExpenseTracker.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "accounts")
public class Account {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    private String name;
    private String type;
    private String last4;

    @Column(name = "balance_estimate", precision = 18, scale = 2)
    private BigDecimal balanceEstimate = BigDecimal.ZERO;

    @Column(name = "created_at")
    private Instant createdAt = Instant.now();

    // getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getLast4() { return last4; }
    public void setLast4(String last4) { this.last4 = last4; }
    public BigDecimal getBalanceEstimate() { return balanceEstimate; }
    public void setBalanceEstimate(BigDecimal balanceEstimate) { this.balanceEstimate = balanceEstimate; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
