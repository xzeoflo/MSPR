package com.example.demo.services;

import com.example.demo.models.User;

import java.sql.SQLException;
import java.util.List;

import com.example.demo.repositories.UserRepository;
import org.springframework.stereotype.Service;


@Service
public class UserService {
    private final UserRepository repository;
    private User currentUser;

    public UserService(UserRepository repository) {
        this.repository = repository;
    }

    public User getCurrentUser() {
        return currentUser;
    }

    public void setCurrentUser(User currentUser) {
        this.currentUser = currentUser;
    }
}