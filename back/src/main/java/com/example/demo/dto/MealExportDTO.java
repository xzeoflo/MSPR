package com.example.demo.dto;

import lombok.Data;

@Data
public class MealExportDTO {
    private String mealType;
    private Double quantityG;
    private String allergies;
    private Double caloriesKcal;
    private Double proteinG;
    private Double carbsG;
    private Double fiberG;
    private Double fatsG;
    private Double sugarG;
    private Double sodiumMg;
    private Double cholesterolMg;
    private String partnerBrand;
}