package com.example.demo.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "meals")
@Getter
@Setter
@NoArgsConstructor
public class Meal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "meal_id")
    private Integer id;

    @Column(name = "meal_type")
    private String mealType;

    @Column(name = "quantity_g")
    private Double quantityG;

    @Column(name = "allergies")
    private String allergies;

    @Column(name = "calories_kcal")
    private Double caloriesKcal;

    @Column(name = "protein_g")
    private Double proteinG;

    @Column(name = "carbs_g")
    private Double carbsG;

    @Column(name = "fiber_g")
    private Double fiberG;

    @Column(name = "fats_g")
    private Double fatsG;

    @Column(name = "sugar_g")
    private Double sugarG;

    @Column(name = "sodium_mg")
    private Double sodiumMg;

    @Column(name = "cholesterol_mg")
    private Double cholesterolMg;

    @Column(name = "partner_brand")
    private String partnerBrand;

    @OneToMany(mappedBy = "meal", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("meal")
    private List<Eat> consumptions = new ArrayList<>();
}
