package com.example.demo.services;

import com.example.demo.models.Exercise;
import com.example.demo.models.Workout;
import com.example.demo.repositories.ExerciseRepository;
import com.example.demo.repositories.WorkoutRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ExerciseService {
    private final ExerciseRepository exerciseRepository;
    private final WorkoutRepository workoutRepository;

    public Exercise create(Exercise exercise, String userBrand, String role) {
        Workout workout = workoutRepository.findById(exercise.getWorkout().getId())
                .orElseThrow(() -> new RuntimeException("Workout not found"));

        if (!role.equals("ADMIN") && !workout.getPartnerBrand().equals(userBrand)) {
            throw new RuntimeException("Forbidden");
        }
        return exerciseRepository.save(exercise);
    }

    public List<Exercise> getByWorkout(Integer workoutId, String userBrand, String role) {
        Workout workout = workoutRepository.findById(workoutId)
                .orElseThrow(() -> new RuntimeException("Workout not found"));

        if (!role.equals("ADMIN") && !workout.getPartnerBrand().equals(userBrand)) {
            throw new RuntimeException("Forbidden");
        }
        return exerciseRepository.findByWorkoutId(workoutId);
    }

    public Exercise update(Integer id, Exercise details, String userBrand, String role) {
        Exercise exercise = exerciseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Exercise not found"));

        if (!role.equals("ADMIN") && !exercise.getWorkout().getPartnerBrand().equals(userBrand)) {
            throw new RuntimeException("Forbidden");
        }

        exercise.setName(details.getName());
        exercise.setSets(details.getSets());
        exercise.setRepetitions(details.getRepetitions());
        exercise.setDurationInSeconds(details.getDurationInSeconds());
        return exerciseRepository.save(exercise);
    }

    public void delete(Integer id, String userBrand, String role) {
        Exercise exercise = exerciseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Exercise not found"));

        if (!role.equals("ADMIN") && !exercise.getWorkout().getPartnerBrand().equals(userBrand)) {
            throw new RuntimeException("Forbidden");
        }
        exerciseRepository.delete(exercise);
    }
}
