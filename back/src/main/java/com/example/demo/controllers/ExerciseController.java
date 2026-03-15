package com.example.demo.controllers;

import com.example.demo.dto.ExerciseDTO;
import com.example.demo.models.Exercise;
import com.example.demo.models.User;
import com.example.demo.services.ExerciseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.example.demo.services.ExerciseSyncService;

@RestController
@RequestMapping("/api/exercises")
@RequiredArgsConstructor
public class ExerciseController {
    private final ExerciseService exerciseService;
    private final ExerciseSyncService exerciseSyncService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'COACH')")
    public ResponseEntity<Exercise> create(@RequestBody Exercise exercise, Authentication auth) {
        User user = (User) auth.getPrincipal();
        return ResponseEntity.ok(exerciseService.create(exercise, user.getPartnerBrand(), user.getRole().name()));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'COACH', 'CLIENT')")
    public ResponseEntity<List<Exercise>> getAll(Authentication auth) {
        User user = (User) auth.getPrincipal();
        return ResponseEntity.ok(exerciseService.getAll(user.getPartnerBrand(), user.getRole().name()));
    }

    @GetMapping("/workout/{workoutId}")
    public ResponseEntity<List<Exercise>> getByWorkout(@PathVariable Integer workoutId, Authentication auth) {
        User user = (User) auth.getPrincipal();
        return ResponseEntity
                .ok(exerciseService.getByWorkout(workoutId, user.getPartnerBrand(), user.getRole().name()));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COACH')")
    public ResponseEntity<Exercise> update(@PathVariable Integer id, @RequestBody Exercise exercise,
            Authentication auth) {
        User user = (User) auth.getPrincipal();
        return ResponseEntity.ok(exerciseService.update(id, exercise, user.getPartnerBrand(), user.getRole().name()));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COACH')")
    public ResponseEntity<Void> delete(@PathVariable Integer id, Authentication auth) {
        User user = (User) auth.getPrincipal();
        exerciseService.delete(id, user.getPartnerBrand(), user.getRole().name());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/export")
    @PreAuthorize("hasAnyRole('ADMIN', 'COACH')")
    public ResponseEntity<List<ExerciseDTO>> exportExercises(Authentication auth) {
        User user = (User) auth.getPrincipal();
        List<ExerciseDTO> data = exerciseService.exportExercises(user.getPartnerBrand(), user.getRole().name());
        String fileName = "export_exercises_"
                + (user.getPartnerBrand() != null ? user.getPartnerBrand().toLowerCase() : "all") + ".json";

        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=\"" + fileName + "\"")
                .header("Content-Type", "application/json")
                .body(data);
    }

    @PostMapping("/import")
    @PreAuthorize("hasAnyRole('ADMIN', 'COACH')")
    public ResponseEntity<String> importExercises(@RequestBody List<ExerciseDTO> exerciseDTOs) {
        try {
            exerciseService.importExercises(exerciseDTOs);
            return ResponseEntity.ok("Importation réussie de " + exerciseDTOs.size() + " exercices.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erreur lors de l'import : " + e.getMessage());
        }
    }

    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Exercise>> getPending() {
        return ResponseEntity.ok(exerciseService.getPendingExercises());
    }

    @PutMapping("/{id}/validate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Exercise> validate(@PathVariable Integer id, @RequestBody Exercise exerciseDetails) {
        return ResponseEntity.ok(exerciseService.validateExercise(id, exerciseDetails));
    }

    @DeleteMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> reject(@PathVariable Integer id) {
        exerciseService.rejectExercise(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/rejected")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Exercise>> getRejected(Authentication auth) {
        return ResponseEntity.ok(exerciseService.getRejectedExercises());
    }

    @PostMapping("/sync")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> syncWithExternalApi() {
        try {
            exerciseSyncService.syncExercises();
            return ResponseEntity.ok("Synchronisation avec l'API externe terminée (voir logs pour le détail).");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erreur lors de la synchronisation : " + e.getMessage());
        }
    }
}
