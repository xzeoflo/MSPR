package com.example.demo.repositories;

import com.example.demo.models.Meal;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MealRepository {

    // 🔍 Trouver un repas par son nom
    Meal findByFoodName(String foodName);

    // 📋 Lister tous les repas du catalogue
    List<Meal> findAll();

    // 💾 Enregistrer un nouveau repas
    void save(Meal meal);
}