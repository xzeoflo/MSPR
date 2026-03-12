package com.example.demo.repositories;

import com.example.demo.models.Meal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MealRepository extends JpaRepository<Meal, Integer> {
    @Query("SELECT m FROM Meal m WHERE :brand IS NULL OR m.partnerBrand = :brand")
    List<Meal> findByPartnerBrand(@Param("brand") String brand);
}