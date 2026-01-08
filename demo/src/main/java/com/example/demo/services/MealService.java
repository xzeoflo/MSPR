package com.example.demo.services;

import com.example.demo.models.Meal;
import com.example.demo.repositories.MealRepository;
import org.springframework.stereotype.Service;

import java.sql.SQLException;
import java.util.List;

@Service
public class MealService {

    private final MealRepository repository;

    public MealService(MealRepository repository) {
        this.repository = repository;
    }

    // 🔍 Trouver un repas par son nom (
    public Meal findByName(String name) throws SQLException {
        return repository.findByFoodName(name);
    }

    // 📋 Récupérer toute la liste du catalogue FOOD_CATALOG
    public List<Meal> findAll() throws SQLException {
        return repository.findAll();
    }

    // 💾 Ajouter un nouveau repas au catalogue
    public void save(Meal meal) throws SQLException {
        repository.save(meal);
    }
}