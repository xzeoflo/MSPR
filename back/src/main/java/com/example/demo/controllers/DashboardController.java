package com.example.demo.controllers;

import com.example.demo.models.Meal;
import com.example.demo.models.User;
import com.example.demo.models.Workout;
import com.example.demo.models.Exercise;
import com.example.demo.services.ExerciseService;
import com.example.demo.services.MealService;
import com.example.demo.services.UserService;
import com.example.demo.services.WorkoutService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final UserService userService;
    private final WorkoutService workoutService;
    private final ExerciseService exerciseService;
    private final MealService mealService;

    @GetMapping("/stats")
    @PreAuthorize("hasAnyRole('ADMIN', 'COACH')")
    public ResponseEntity<Map<String, Long>> getQuickStats(Authentication auth) {
        User user = (User) auth.getPrincipal();
        String brand = ("ADMIN".equals(user.getRole().name())) ? null : user.getPartnerBrand();
        String role = user.getRole().name();

        return ResponseEntity.ok(Map.of(
                "totalUsers", (long) userService.getAllUsers(brand).size(),
                "totalWorkouts", (long) workoutService.getAllWorkouts(brand).size(),
                "totalExercises", (long) exerciseService.getAll(brand, role).size(),
                "totalMeals", (long) mealService.getAllMeals(brand).size()));
    }

    @GetMapping("/stats/types")
    @PreAuthorize("hasAnyRole('ADMIN', 'COACH')")
    public ResponseEntity<List<Map<String, Object>>> getWorkoutTypeStats(Authentication auth) {
        User user = (User) auth.getPrincipal();
        List<Workout> workouts = workoutService.getAllWorkouts(user.getPartnerBrand());

        Map<String, Long> counts = workouts.stream()
                .collect(Collectors.groupingBy(w -> w.getWorkoutType().toString().toLowerCase(),
                        Collectors.counting()));

        return ResponseEntity.ok(mapToChartData(counts));
    }

    @GetMapping("/stats/meals-types")
    @PreAuthorize("hasAnyRole('ADMIN', 'COACH')")
    public ResponseEntity<List<Map<String, Object>>> getMealTypeStats(Authentication auth) {
        User user = (User) auth.getPrincipal();
        String brand = ("ADMIN".equals(user.getRole().name())) ? null : user.getPartnerBrand();

        List<Meal> meals = mealService.getAllMeals(brand);

        Map<String, Long> counts = meals.stream()
                .collect(Collectors.groupingBy(
                        m -> (m.getMealType() == null || m.getMealType().isBlank())
                                ? "other"
                                : m.getMealType().trim().toLowerCase(),
                        Collectors.counting()));

        return ResponseEntity.ok(mapToChartData(counts));
    }

    @GetMapping("/stats/users-distribution")
    @PreAuthorize("hasAnyRole('ADMIN', 'COACH')")
    public ResponseEntity<List<Map<String, Object>>> getUserDistribution(Authentication auth) {
        User currentUser = (User) auth.getPrincipal();
        String brand = currentUser.getPartnerBrand();
        String role = currentUser.getRole().name();

        List<User> allUsers = userService.getAllUsers(brand);

        Map<String, Long> counts;
        if ("ADMIN".equals(role)) {
            counts = allUsers.stream()
                    .collect(Collectors.groupingBy(
                            u -> u.getPartnerBrand() != null ? u.getPartnerBrand() : "Internal",
                            Collectors.counting()));
        } else {
            counts = allUsers.stream()
                    .collect(Collectors.groupingBy(u -> u.getRole().name(), Collectors.counting()));
        }

        return ResponseEntity.ok(mapToChartData(counts));
    }

    @GetMapping("/stats/exercises-distribution")
    @PreAuthorize("hasAnyRole('ADMIN', 'COACH')")
    public ResponseEntity<List<Map<String, Object>>> getExerciseDistribution(Authentication auth) {
        User currentUser = (User) auth.getPrincipal();
        List<Exercise> exercises = exerciseService.getAll(currentUser.getPartnerBrand(), currentUser.getRole().name());

        Map<String, Long> counts = exercises.stream()
                .collect(Collectors.groupingBy(
                        ex -> ex.getExerciseType() != null ? ex.getExerciseType().toLowerCase() : "autre",
                        Collectors.counting()));

        return ResponseEntity.ok(mapToChartData(counts));
    }

    @GetMapping("/stats/brands-comparison")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> getBrandsComparison() {
        List<Workout> allWorkouts = workoutService.getAllWorkouts(null);
        List<User> allUsers = userService.getAllUsers(null);
        List<Meal> allMeals = mealService.getAllMeals(null);

        Map<String, Long> workoutsByBrand = allWorkouts.stream()
                .filter(w -> w.getPartnerBrand() != null)
                .collect(Collectors.groupingBy(Workout::getPartnerBrand, Collectors.counting()));

        Map<String, Long> usersByBrand = allUsers.stream()
                .filter(u -> u.getPartnerBrand() != null)
                .collect(Collectors.groupingBy(User::getPartnerBrand, Collectors.counting()));

        Map<String, Long> mealsByBrand = allMeals.stream()
                .filter(m -> m.getPartnerBrand() != null)
                .collect(Collectors.groupingBy(Meal::getPartnerBrand, Collectors.counting()));

        java.util.Set<String> brands = new java.util.HashSet<>();
        brands.addAll(workoutsByBrand.keySet());
        brands.addAll(usersByBrand.keySet());
        brands.addAll(mealsByBrand.keySet());

        List<Map<String, Object>> chartData = new ArrayList<>();
        for (String brand : brands) {
            Map<String, Object> row = new HashMap<>();
            row.put("brand", brand);
            row.put("workouts", workoutsByBrand.getOrDefault(brand, 0L));
            row.put("users", usersByBrand.getOrDefault(brand, 0L));
            row.put("meals", mealsByBrand.getOrDefault(brand, 0L));
            chartData.add(row);
        }

        return ResponseEntity.ok(chartData);
    }

    private List<Map<String, Object>> mapToChartData(Map<String, Long> counts) {
        List<Map<String, Object>> chartData = new ArrayList<>();
        int colorIndex = 1;

        for (Map.Entry<String, Long> entry : counts.entrySet()) {
            Map<String, Object> row = new HashMap<>();
            String name = entry.getKey();
            row.put("name", name.substring(0, 1).toUpperCase() + name.substring(1)); // Capitalize
            row.put("type", name);
            row.put("value", entry.getValue());
            row.put("fill", "var(--chart-" + colorIndex + ")");
            chartData.add(row);
            colorIndex = (colorIndex % 5) + 1;
        }
        return chartData;
    }
}
