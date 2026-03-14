package com.example.demo.controllers;

import com.example.demo.models.Exercise;
import com.example.demo.models.User;
import com.example.demo.services.ExerciseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/exercises")
@RequiredArgsConstructor
public class ExerciseController {
    private final ExerciseService exerciseService;

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
}
