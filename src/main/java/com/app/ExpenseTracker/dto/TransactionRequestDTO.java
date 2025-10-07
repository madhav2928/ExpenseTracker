package com.app.ExpenseTracker.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public class TransactionRequestDTO {

    @NotNull(message = "amount is required")
    @DecimalMin(value = "0.01", inclusive = true, message = "amount must be positive")
    private BigDecimal amount;

    @NotBlank(message = "merchant is required")
    @Size(max = 255)
    private String merchant;

    @Size(max = 10)
    private String currency = "INR";

    private Long accountId; // optional; if null backend picks default

    @Size(max = 255)
    private String category;

    @Size(max = 255)
    private String type = "DEBIT";

    @Size(max = 2000)
    private String source;

    // getters/setters
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public String getMerchant() { return merchant; }
    public void setMerchant(String merchant) { this.merchant = merchant; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public Long getAccountId() { return accountId; }
    public void setAccountId(Long accountId) { this.accountId = accountId; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
}
