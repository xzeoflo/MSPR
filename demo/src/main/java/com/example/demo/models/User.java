package com.example.demo.models;


import com.example.demo.models.enums.UserRole;
import jakarta.persistence.*;

import java.util.Date;


public class User {
    private int id;
    private String email;
    private String password;
    private String firstname;
    private String lastname;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;

    private Date Birthday;
    private Enum gender;
    private enum subscriptionTier;
    private enum activity_level;


    public User() {
    }

    public User(int id, String email, String firstname, UserRole role) {
        this.id = id;
        this.email = email;
        this.firstname = firstname;
        this.role = role;
    }

    public int getId() {
        return id;
    }
    public String getEmail() {
        return email;
    }
    public String getFirstname() {
        return firstname;
    }
    public UserRole getRole() {
        return role;
    }

}

