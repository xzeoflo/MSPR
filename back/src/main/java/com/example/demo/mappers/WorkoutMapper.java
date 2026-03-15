package com.example.demo.mappers;

import com.example.demo.dto.WorkoutDTO;
import com.example.demo.dto.ExerciseDTO;
import com.example.demo.models.Workout;
import com.example.demo.models.Exercise;
import com.example.demo.models.Includes;
import com.example.demo.models.enums.Intensity;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class WorkoutMapper {

    private final ExerciseMapper exerciseMapper;

    public WorkoutMapper(ExerciseMapper exerciseMapper) {
        this.exerciseMapper = exerciseMapper;
    }

    public WorkoutDTO toDTO(Workout entity) {
        if (entity == null)
            return null;

        WorkoutDTO dto = new WorkoutDTO();
        dto.setTitle(entity.getTitle());
        dto.setDescription(entity.getDescription());
        dto.setDifficulty(entity.getDifficulty());
        dto.setWorkoutType(entity.getWorkoutType());
        dto.setPartnerBrand(entity.getPartnerBrand());

        dto.setTotalCalories(entity.getTotalCaloriesBurned());
        dto.setTotalDuration(entity.getTotalDurationInMinutes());

        if (entity.getIncludedExercises() != null) {
            dto.setExercises(entity.getIncludedExercises().stream()
                    .map(inc -> exerciseMapper.toDTO(inc.getExercise()))
                    .collect(Collectors.toList()));
        }
        return dto;
    }

    public Workout toEntity(WorkoutDTO dto) {
        if (dto == null)
            return null;

        Workout workout = new Workout();
        workout.setTitle(dto.getTitle() != null ? dto.getTitle() : "Nouveau Workout");
        workout.setDescription(dto.getDescription());
        workout.setDifficulty(dto.getDifficulty() != null ? dto.getDifficulty() : Intensity.INTERMEDIATE);
        workout.setWorkoutType(dto.getWorkoutType());
        workout.setPartnerBrand(dto.getPartnerBrand());

        if (dto.getExercises() != null && !dto.getExercises().isEmpty()) {
            List<Includes> includesList = new ArrayList<>();
            int order = 1;
            for (ExerciseDTO exDto : dto.getExercises()) {
                Exercise ex = exerciseMapper.toEntity(exDto);
                if (ex != null) {
                    Includes include = new Includes();
                    include.setExercise(ex);
                    include.setWorkout(workout);
                    include.setSequenceOrder(order);
                    includesList.add(include);
                    order++;
                }
            }
            workout.setIncludedExercises(includesList);
        }
        return workout;
    }
}