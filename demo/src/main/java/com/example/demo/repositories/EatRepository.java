package com.example.demo.repositories;

import com.example.demo.models.Eat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EatRepository extends JpaRepository<Eat, Integer> {
    List<Eat> findByUserId(Integer userId);
    List<Eat> findByMealId(Integer mealId);
}