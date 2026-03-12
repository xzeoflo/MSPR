package com.example.demo.controllers;

import com.example.demo.models.Meal;
import com.example.demo.models.User;
import com.example.demo.services.MealService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/meals")
public class MealController {

    private final MealService mealService;

    public MealController(MealService mealService) {
        this.mealService = mealService;
    }

    private String getRequestingUserPartner(Principal principal) {
        if (principal instanceof Authentication authentication) {
            Object userPrincipal = authentication.getPrincipal();
            if (userPrincipal instanceof User user) {
                return user.getPartnerBrand();
            }
        }
        return null;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'COACH')")
    public ResponseEntity<List<Meal>> getAllMeals(Principal principal) {
        String brand = getRequestingUserPartner(principal);
        return ResponseEntity.ok(mealService.getAllMeals(brand));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COACH', 'CLIENT')")
    public ResponseEntity<Meal> getMealById(@PathVariable Integer id, Principal principal) {
        String brand = getRequestingUserPartner(principal);
        return ResponseEntity.ok(mealService.getMealById(id, brand));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Meal> createMeal(@RequestBody Meal meal, Principal principal) {
        String brand = getRequestingUserPartner(principal);
        return ResponseEntity.status(201).body(mealService.createMeal(meal, brand));
    }

    @PostMapping("/{mealId}/consume/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    public ResponseEntity<Void> associateUserToMeal(
            @PathVariable Integer mealId,
            @PathVariable Integer userId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime date,
            Principal principal) {

        String brand = getRequestingUserPartner(principal);
        LocalDateTime consumptionDate = (date != null) ? date : LocalDateTime.now();
        mealService.associateUserToMeal(mealId, userId, consumptionDate, brand);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Meal> updateMeal(@PathVariable Integer id, @RequestBody Meal meal, Principal principal) {
        String brand = getRequestingUserPartner(principal);
        return ResponseEntity.ok(mealService.updateMeal(id, meal, brand));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteMeal(@PathVariable Integer id, Principal principal) {
        String brand = getRequestingUserPartner(principal);
        mealService.deleteMeal(id, brand);
        return ResponseEntity.noContent().build();
    }
}