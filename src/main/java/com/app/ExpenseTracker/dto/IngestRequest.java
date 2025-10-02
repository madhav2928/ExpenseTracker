package com.app.ExpenseTracker.dto;

import java.math.BigDecimal;

public class IngestRequest {
    private BigDecimal amount;
    private String currency;
    private String merchant;
    private String accountHint;
    private String rawText;
    private String source;

    // getters / setters
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public String getMerchant() { return merchant; }
    public void setMerchant(String merchant) { this.merchant = merchant; }
    public String getAccountHint() { return accountHint; }
    public void setAccountHint(String accountHint) { this.accountHint = accountHint; }
    public String getRawText() { return rawText; }
    public void setRawText(String rawText) { this.rawText = rawText; }
    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
}
