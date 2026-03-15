package com.example.demo.services;

import com.example.demo.models.Exercise;
import com.example.demo.models.Workout;
import com.example.demo.repositories.ExerciseRepository;
import com.example.demo.repositories.WorkoutRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ExerciseService {

    private final ExerciseRepository exerciseRepository;
    private final WorkoutRepository workoutRepository;

    public Exercise create(Exercise exercise, String userBrand, String role) {
        return exerciseRepository.save(exercise);
    }

    public List<Exercise> getAll(String userBrand, String role) {
        if ("ADMIN".equals(role)) {
            return exerciseRepository.findAll();
        } else {
            // Changement ici : findByWorkouts_PartnerBrand
            return exerciseRepository.findByWorkouts_PartnerBrand(userBrand);
        }
    }

    public List<Exercise> getByWorkout(Integer workoutId, String userBrand, String role) {
        Workout workout = workoutRepository.findById(workoutId)
                .orElseThrow(() -> new RuntimeException("Workout not found"));

        if (!role.equals("ADMIN") && !workout.getPartnerBrand().equals(userBrand)) {
            throw new RuntimeException("Forbidden");
        }
        // Changement ici : findByWorkouts_Id
        return exerciseRepository.findByWorkouts_Id(workoutId);
    }

    public Exercise update(Integer id, Exercise details, String userBrand, String role) {
        Exercise exercise = exerciseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Exercise not found"));

        exercise.setName(details.getName());
        exercise.setDescription(details.getDescription());
        exercise.setSets(details.getSets());
        exercise.setRepetitions(details.getRepetitions());
        exercise.setDurationInSeconds(details.getDurationInSeconds());
        exercise.setCaloriesBurned(details.getCaloriesBurned());
        exercise.setIntensityLevel(details.getIntensityLevel());
        exercise.setExerciseType(details.getExerciseType());
        exercise.setExerciseEquipments(details.getExerciseEquipments());

        return exerciseRepository.save(exercise);
    }

    @Transactional
    public void delete(Integer id, String userBrand, String role) {
        Exercise exercise = exerciseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Exercise not found"));
        exerciseRepository.delete(exercise);
    }
}
