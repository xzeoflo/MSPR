package com.example.demo.services;

import com.example.demo.models.Exercise;
import com.example.demo.dto.ExerciseDTO;
import com.example.demo.mappers.ExerciseMapper;
import com.example.demo.models.Workout;
import com.example.demo.models.enums.DataStatus;
import com.example.demo.repositories.ExerciseRepository;
import com.example.demo.repositories.WorkoutRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExerciseService {

    private final ExerciseRepository exerciseRepository;
    private final WorkoutRepository workoutRepository;
    private final ExerciseMapper exerciseMapper;

    public Exercise create(Exercise exercise, String userBrand, String role) {
        exercise.setStatus(DataStatus.APPROVED);
        exercise.setOriginSource("MANUAL");
        return exerciseRepository.save(exercise);
    }

    public List<Exercise> getAll(String userBrand, String role) {
        String cleanRole = role.replace("ROLE_", "");

        List<Exercise> allApproved = exerciseRepository.findByStatus(DataStatus.APPROVED);

        if ("ADMIN".equals(cleanRole)) {
            return allApproved;
        } else {
            return allApproved.stream()
                    .filter(ex -> ex.getWorkouts().stream()
                            .anyMatch(w -> w.getPartnerBrand().equals(userBrand)))
                    .collect(Collectors.toList());
        }
    }

    public List<ExerciseDTO> exportExercises(String userBrand, String role) {
        return getAll(userBrand, role).stream()
                .map(exerciseMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void importExercises(List<ExerciseDTO> dtos) {
        List<Exercise> exercises = dtos.stream()
                .filter(this::isValidForImport)
                .map(exerciseMapper::toEntity)
                .peek(ex -> {
                    ex.setStatus(DataStatus.PENDING);
                    ex.setOriginSource("JSON_IMPORT");
                })
                .collect(Collectors.toList());

        if (exercises.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Aucun exercice valide trouvé dans le JSON.");
        }

        exerciseRepository.saveAll(exercises);
    }

    private boolean isValidForImport(ExerciseDTO dto) {
        return dto.getName() != null && !dto.getName().trim().isEmpty()
                && dto.getIntensityLevel() != null;
    }

    public List<Exercise> getByWorkout(Integer workoutId, String userBrand, String role) {
        Workout workout = workoutRepository.findById(workoutId)
                .orElseThrow(() -> new RuntimeException("Workout not found"));

        String cleanRole = role.replace("ROLE_", "");
        if (!cleanRole.equals("ADMIN") && !workout.getPartnerBrand().equals(userBrand)) {
            throw new RuntimeException("Forbidden");
        }
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

    public List<Exercise> getPendingExercises() {
        return exerciseRepository.findByStatus(DataStatus.PENDING);
    }

    @Transactional
    public void rejectExercise(Integer id) {
        Exercise exercise = exerciseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Exercice non trouvé"));
        exercise.setStatus(DataStatus.REJECTED);
        exerciseRepository.save(exercise);
    }

    public List<Exercise> getRejectedExercises() {
        return exerciseRepository.findByStatus(DataStatus.REJECTED);
    }

    @Transactional
    public Exercise validateExercise(Integer id, Exercise updateDetails) {
        Exercise exercise = exerciseRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Exercice non trouvé"));

        exercise.setName(updateDetails.getName());
        if (updateDetails.getDescription() != null) {
            exercise.setDescription(updateDetails.getDescription());
        }
        exercise.setExerciseType(updateDetails.getExerciseType());
        exercise.setIntensityLevel(updateDetails.getIntensityLevel());
        exercise.setCaloriesBurned(updateDetails.getCaloriesBurned());

        exercise.setStatus(DataStatus.APPROVED);

        return exerciseRepository.save(exercise);
    }
}
