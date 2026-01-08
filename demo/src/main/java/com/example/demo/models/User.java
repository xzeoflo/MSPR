package com.example.demo.models;


import com.example.demo.models.enums.UserRole;
import jakarta.persistence.*;


public class User {
    private int id;
    private String email;
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;

    public User() {
    }

    public User(int id, String email, String name, UserRole role) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.role = role;
    }

    public int getId() {
        return id;
    }
    public String getEmail() {
        return email;
    }
    public String getName() {
        return name;
    }
    public UserRole getRole() {
        return role;
    }

}

