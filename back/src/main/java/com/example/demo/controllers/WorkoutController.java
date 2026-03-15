package com.example.demo.controllers;

import com.example.demo.dto.WorkoutDTO;
import com.example.demo.models.Workout;
import com.example.demo.models.User;
import com.example.demo.services.WorkoutService;

import jakarta.validation.Valid;

import com.example.demo.services.UserService;
import com.example.demo.mappers.WorkoutMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/workouts")
public class WorkoutController {

    private final WorkoutService workoutService;
    private final UserService userService;
    private final WorkoutMapper workoutMapper;

    public WorkoutController(WorkoutService workoutService, UserService userService, WorkoutMapper workoutMapper) {
        this.workoutService = workoutService;
        this.userService = userService;
        this.workoutMapper = workoutMapper;
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
    public ResponseEntity<Workout> createWorkout(@Valid @RequestBody WorkoutDTO workoutDto, Principal principal) {
        String brand = getRequestingUserPartner(principal);
        Workout workout = workoutMapper.toEntity(workoutDto);
        return ResponseEntity.ok(workoutService.createWorkout(workout, brand));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COACH')")
    public ResponseEntity<Workout> update(@PathVariable Integer id, @RequestBody WorkoutDTO workoutDto,
            Authentication auth) {
        User user = (User) auth.getPrincipal();
        Workout workout = workoutMapper.toEntity(workoutDto);
        return ResponseEntity
                .ok(workoutService.updateWorkout(id, workout, user.getPartnerBrand(), user.getRole().name()));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COACH')")
    public ResponseEntity<Void> delete(@PathVariable Integer id, Authentication auth) {
        User user = (User) auth.getPrincipal();
        workoutService.deleteWorkout(id, user.getPartnerBrand(), user.getRole().name());
        return ResponseEntity.noContent().build();
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
        return ResponseEntity.ok(workoutService.getWorkoutsIntensity(level, brand));
    }

    @GetMapping("/history/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COACH')")
    public ResponseEntity<List<Workout>> getUserHistory(@PathVariable Integer userId, Principal principal) {
        String brand = getRequestingUserPartner(principal);
        return ResponseEntity.ok(userService.getCompletedWorkouts(userId, brand));
    }

    @GetMapping("/filter/exerciseType")
    @PreAuthorize("hasAnyRole('ADMIN', 'COACH', 'CLIENT')")
    public ResponseEntity<List<Workout>> getWorkoutsByExType(
            @RequestParam String type,
            Principal principal) {
        String brand = getRequestingUserPartner(principal);
        return ResponseEntity.ok(workoutService.getWorkoutsByExerciseType(type, brand));
    }

    @GetMapping("/filter/workoutType")
    @PreAuthorize("hasAnyRole('ADMIN', 'COACH', 'CLIENT')")
    public ResponseEntity<List<Workout>> getWorkoutsByWType(
            @RequestParam String type,
            Principal principal) {
        String brand = getRequestingUserPartner(principal);
        return ResponseEntity.ok(workoutService.getWorkoutsByType(type, brand));
    }

    @GetMapping("/filter/pure")
    @PreAuthorize("hasAnyRole('ADMIN', 'COACH', 'CLIENT')")
    public ResponseEntity<List<Workout>> getPureWorkouts(
            @RequestParam String workoutType,
            @RequestParam String exerciseType,
            Principal principal) {
        String brand = getRequestingUserPartner(principal);
        return ResponseEntity.ok(workoutService.getWorkoutByTypeAndIntensity(workoutType, exerciseType, brand));
    }

    @GetMapping("/export")
    @PreAuthorize("hasAnyRole('ADMIN', 'COACH')")
    public ResponseEntity<List<WorkoutDTO>> exportWorkouts(Principal principal) {
        String brand = getRequestingUserPartner(principal);
        List<WorkoutDTO> data = workoutService.exportWorkouts(brand);
        String fileName = "export_workouts_" + (brand != null ? brand.toLowerCase() : "all") + ".json";

        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=\"" + fileName + "\"")
                .header("Content-Type", "application/json")
                .body(data);
    }

    @PostMapping("/import")
    @PreAuthorize("hasAnyRole('ADMIN', 'COACH')")
    public ResponseEntity<String> importWorkouts(
            @RequestBody List<WorkoutDTO> workoutDTOs,
            Authentication auth) {

        User user = (User) auth.getPrincipal();
        String brand = user.getPartnerBrand();

        try {
            workoutService.importWorkouts(workoutDTOs, brand);
            return ResponseEntity.ok("Importation réussie de " + workoutDTOs.size() + " workouts.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Erreur lors de l'import : " + e.getMessage());
        }
    }
}
