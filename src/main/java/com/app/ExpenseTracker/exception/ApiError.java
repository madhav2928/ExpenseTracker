package com.app.ExpenseTracker.exception;

import java.time.Instant;
import java.util.List;

public class ApiError {
    private Instant timestamp = Instant.now();
    private String message;
    private List<String> details;

    public ApiError() {}

    public ApiError(String message, List<String> details) {
        this.message = message;
        this.details = details;
    }

    // getters / setters
    public Instant getTimestamp() { return timestamp; }
    public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public List<String> getDetails() { return details; }
    public void setDetails(List<String> details) { this.details = details; }
}
