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

    public User findByEmail(String email) throws SQLException {
        return (User) repository.findByEmail(email);
    }

    public List<User> findAll() throws SQLException {
        return repository.findAll();
    }

    public void save(User user) throws SQLException {
        repository.save(user);
    }

    public User getCurrentUser() {
        return currentUser;
    }

    public void setCurrentUser(User currentUser) {
        this.currentUser = currentUser;
    }
}