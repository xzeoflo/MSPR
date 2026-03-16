package com.example.demo.dto.external;

import com.opencsv.bean.CsvBindByName;
import lombok.Data;

@Data
public class ExternalMealDTO {
    @CsvBindByName(column = "Food_Item") 
    private String name;

    @CsvBindByName(column = "Category") 
    private String category;

    @CsvBindByName(column = "Calories (kcal)")
    private Double calories;

    @CsvBindByName(column = "Protein (g)")
    private Double proteins;

    @CsvBindByName(column = "Carbohydrates (g)")
    private Double carbohydrates;

    @CsvBindByName(column = "Fat (g)")
    private Double lipids;

    @CsvBindByName(column = "Fiber (g)")
    private Double fiber;

    @CsvBindByName(column = "Sugars (g)")
    private Double sugar;

    @CsvBindByName(column = "Meal_Type")
    private String mealType;
}
