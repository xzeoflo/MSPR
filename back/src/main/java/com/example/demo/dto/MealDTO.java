package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MealDTO {
    private String name;
    private Double calories;
    private Double protein;
    private Double carbs;
    private Double fat;
}
