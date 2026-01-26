package com.example.demo.controllers;

import com.example.demo.models.Workout;
import com.example.demo.models.User;
import com.example.demo.services.WorkoutService;
import com.example.demo.services.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/workouts")
public class WorkoutController {

    private final WorkoutService workoutService;
    private final UserService userService;

    public WorkoutController(WorkoutService workoutService, UserService userService) {
        this.workoutService = workoutService;
        this.userService = userService;
    }

    private String getRequestingUserPartner(Principal principal) {
        if (principal == null) return null;
        User currentUser = userService.getUserByEmail(principal.getName(), null);
        return currentUser.getPartnerBrand();
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'COACH', 'CLIENT')")
    public ResponseEntity<List<Workout>> getAllWorkouts(Principal principal) {
        String brand = getRequestingUserPartner(principal);
        return ResponseEntity.ok(workoutService.getAllWorkouts(brand));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COACH', 'CLIENT')")
    public ResponseEntity<Workout> getWorkoutById(@PathVariable Integer id, Principal principal) {
        String brand = getRequestingUserPartner(principal);
        return ResponseEntity.ok(workoutService.getWorkoutById(id, brand));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'COACH')")
    public ResponseEntity<Workout> createWorkout(@RequestBody Workout workout, Principal principal) {
        String brand = getRequestingUserPartner(principal);
        return ResponseEntity.ok(workoutService.createWorkout(workout, brand));
    }

    @GetMapping("/stats/age")
    @PreAuthorize("hasAnyRole('ADMIN', 'COACH')")
    public ResponseEntity<List<Workout>> getWorkoutsByAgeStats(
            @RequestParam int min,
            @RequestParam int max,
            Principal principal) {
        String brand = getRequestingUserPartner(principal);
        return ResponseEntity.ok(workoutService.getWorkoutsByAgeRange(min, max, brand));
    }

    @GetMapping("/filter/time")
    @PreAuthorize("hasAnyRole('ADMIN', 'COACH', 'CLIENT')")
    public ResponseEntity<List<Workout>> getWorkoutsByTime(
            @RequestParam int maxMinutes,
            Principal principal) {
        String brand = getRequestingUserPartner(principal);
        return ResponseEntity.ok(workoutService.getWorkoutsByMaxDuration(maxMinutes, brand));
    }

    @GetMapping("/filter/intensity")
    @PreAuthorize("hasAnyRole('ADMIN', 'COACH', 'CLIENT')")
    public ResponseEntity<List<Workout>> getWorkoutsByIntensity(
            @RequestParam String level,
            Principal principal) {
        String brand = getRequestingUserPartner(principal);
        return ResponseEntity.ok(workoutService.getWorkoutsByDifficulty(level, brand));
    }

    @GetMapping("/history/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COACH')")
    public ResponseEntity<List<Workout>> getUserHistory(@PathVariable Integer userId, Principal principal) {
        String brand = getRequestingUserPartner(principal);
        return ResponseEntity.ok(userService.getCompletedWorkouts(userId, brand));
    }
}