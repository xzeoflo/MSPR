package com.example.demo.repositories;

import com.example.demo.models.User;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository  <User, Integer> {
    User findByEmail(String email);

    List<com.example.demo.models.User> findAll();

    void save(com.example.demo.models.User user);
}

