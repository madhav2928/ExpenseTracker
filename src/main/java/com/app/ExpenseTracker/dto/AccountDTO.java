package com.app.ExpenseTracker.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public class AccountDTO {
    private Long id;

    @NotBlank(message = "name is required")
    private String name;

    private String type;

    @Size(max = 10)
    private String last4;

    private BigDecimal balanceEstimate;

    // getters/setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getLast4() { return last4; }
    public void setLast4(String last4) { this.last4 = last4; }
    public BigDecimal getBalanceEstimate() { return balanceEstimate; }
    public void setBalanceEstimate(BigDecimal balanceEstimate) { this.balanceEstimate = balanceEstimate; }
}
