package com.app.ExpenseTracker.dto;

import java.math.BigDecimal;
import java.time.Instant;

public class TransactionResponseDTO {
    private Long id;
    private Long accountId;
    private String merchant;
    private BigDecimal amount;
    private String currency;
    private String type;
    private Long categoryId;
    private String categoryName;
    private String source;
    private Instant txnDate;

    // getters/setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getAccountId() { return accountId; }
    public void setAccountId(Long accountId) { this.accountId = accountId; }
    public String getMerchant() { return merchant; }
    public void setMerchant(String merchant) { this.merchant = merchant; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }
    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
    public Instant getTxnDate() { return txnDate; }
    public void setTxnDate(Instant txnDate) { this.txnDate = txnDate; }
}
