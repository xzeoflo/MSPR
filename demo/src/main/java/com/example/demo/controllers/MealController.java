package com.example.demo.controllers;

import com.example.demo.models.Meal;
import com.example.demo.services.MealService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.sql.SQLException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/meals")
public class MealController {

    private final MealService service;

    public MealController(MealService service) {
        this.service = service;
    }

    @GetMapping()
    public List<Meal> getAll() throws SQLException {
        return service.findAll();
    }
}