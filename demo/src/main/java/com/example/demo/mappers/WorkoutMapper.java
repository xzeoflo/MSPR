package com.example.demo.mappers;

import com.example.demo.dto.WorkoutDTO;
import com.example.demo.models.Workout;
import org.springframework.stereotype.Component;
import java.util.ArrayList;
import java.util.stream.Collectors;

@Component
public class WorkoutMapper {

    private final ExerciseMapper exerciseMapper;

    public WorkoutMapper(ExerciseMapper exerciseMapper) {
        this.exerciseMapper = exerciseMapper;
    }

    public WorkoutDTO toDTO(Workout entity) {
        if (entity == null) return null;
        WorkoutDTO dto = new WorkoutDTO();
        dto.setTitle(entity.getTitle());
        dto.setDescription(entity.getDescription());
        dto.setDifficulty(entity.getDifficulty());
        dto.setWorkoutType(entity.getWorkoutIntensity());
        dto.setPartnerBrand(entity.getPartnerBrand());

        dto.setTotalCalories(entity.getTotalCaloriesBurned());
        dto.setTotalDuration(entity.getTotalDurationInSeconds());

        if (entity.getExercises() != null) {
            dto.setExercises(entity.getExercises().stream()
                    .map(exerciseMapper::toDTO)
                    .collect(Collectors.toList()));
        }
        return dto;
    }

    public Workout toEntity(WorkoutDTO dto) {
        if (dto == null) return null;
        Workout workout = new Workout();
        workout.setTitle(dto.getTitle() != null ? dto.getTitle() : "Nouveau Workout");
        workout.setDescription(dto.getDescription());
        workout.setDifficulty(dto.getDifficulty() != null ? dto.getDifficulty() : "Intermediate");
        workout.setWorkoutIntensity(dto.getWorkoutType());
        workout.setPartnerBrand(dto.getPartnerBrand());

        if (dto.getExercises() != null && !dto.getExercises().isEmpty()) {
            workout.setExercises(dto.getExercises().stream()
                    .map(exDto -> {
                        var ex = exerciseMapper.toEntity(exDto);
                        ex.setWorkout(workout);
                        return ex;
                    })
                    .collect(Collectors.toCollection(ArrayList::new)));
        }
        return workout;
    }
}