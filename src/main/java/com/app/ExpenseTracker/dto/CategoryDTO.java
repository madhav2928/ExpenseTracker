package com.app.ExpenseTracker.dto;

import jakarta.validation.constraints.*;

public class CategoryDTO {
    private Long id;

    @NotBlank(message = "name is required")
    @Size(max = 255)
    private String name;

    private String parent;

    // getters/setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getParent() { return parent; }
    public void setParent(String parent) { this.parent = parent; }
}
